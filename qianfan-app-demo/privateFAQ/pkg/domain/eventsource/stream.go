package eventsource

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

// Stream handles a connection for receiving Server Sent Events.
// It will try and reconnect if the connection is lost, respecting both
// received retry delays and event id's.
type Stream struct {
	c           *http.Client
	req         *http.Request
	lastEventID string
	readTimeout time.Duration
	retryDelay  *retryDelayStrategy

	// Events emits the events received by the stream
	Events chan Event

	// Errors emits any errors encountered while reading events from the stream.
	//
	// Errors during initialization of the stream are not pushed to this channel, since until the
	// Subscribe method has returned the caller would not be able to consume the channel. If you have
	// configured the Stream to be able to retry on initialization errors, but you still want to know
	// about those errors or control how they are handled, use StreamOptionErrorHandler.
	//
	// If an error handler has been specified with StreamOptionErrorHandler, the Errors channel is
	// not used and will be nil.
	Errors chan error

	errorHandler StreamErrorHandler

	// Logger is a logger that, when set, will be used for logging informational messages.
	//
	// This field is exported for backward compatibility, but should not be set directly because
	// it may be used by multiple goroutines. Use SetLogger instead.
	Logger Logger

	restarter   chan struct{}
	closer      chan struct{}
	closeOnce   sync.Once
	mu          sync.RWMutex
	connections int
}

var (
	// ErrReadTimeout is the error that will be emitted if a stream was closed due to not
	// receiving any data within the configured read timeout interval.
	ErrReadTimeout = errors.New("Read timeout on stream")
)

// SubscriptionError is an error object returned from a stream when there is an HTTP error.
type SubscriptionError struct {
	Code    int
	Message string
}

type streamOptions struct {
	initialRetry        time.Duration
	httpClient          *http.Client
	lastEventID         string
	logger              Logger
	backoffMaxDelay     time.Duration
	jitterRatio         float64
	readTimeout         time.Duration
	retryResetInterval  time.Duration
	initialRetryTimeout time.Duration
	errorHandler        StreamErrorHandler
}

// StreamOption is a common interface for optional configuration parameters that can be
// used in creating a stream.
type StreamOption interface {
	apply(s *streamOptions) error
}

type readTimeoutOption struct {
	timeout time.Duration
}

func (o readTimeoutOption) apply(s *streamOptions) error {
	s.readTimeout = o.timeout
	return nil
}

// StreamOptionReadTimeout returns an option that sets the read timeout interval for a
// stream when the stream is created. If the stream does not receive new data within this
// length of time, it will restart the connection.
//
// By default, there is no read timeout.
func StreamOptionReadTimeout(timeout time.Duration) StreamOption {
	return readTimeoutOption{timeout: timeout}
}

type initialRetryOption struct {
	retry time.Duration
}

func (o initialRetryOption) apply(s *streamOptions) error {
	s.initialRetry = o.retry
	return nil
}

// StreamOptionInitialRetry returns an option that sets the initial retry delay for a
// stream when the stream is created.
//
// This delay will be used the first time the stream has to be restarted; the interval will
// increase exponentially on subsequent reconnections. Each time, there will also be a
// pseudo-random jitter so that the actual value may be up to 50% less. So, for instance,
// if you set the initial delay to 1 second, the first reconnection will use a delay between
// 0.5s and 1s inclusive, and subsequent reconnections will be 1s-2s, 2s-4s, etc.
//
// The default value is DefaultInitialRetry. In a future version, this value may change, so
// if you need a specific value it is best to set it explicitly.
func StreamOptionInitialRetry(retry time.Duration) StreamOption {
	return initialRetryOption{retry: retry}
}

type useBackoffOption struct {
	maxDelay time.Duration
}

func (o useBackoffOption) apply(s *streamOptions) error {
	s.backoffMaxDelay = o.maxDelay
	return nil
}

// StreamOptionUseBackoff returns an option that determines whether to use an exponential
// backoff for reconnection delays.
//
// If the maxDelay parameter is greater than zero, backoff is enabled. The retry delay interval
// will be doubled (not counting jitter - see StreamOptionUseJitter) for consecutive stream
// reconnections, but will never be greater than maxDelay.
//
// For consistency with earlier versions, this is currently zero (disabled) by default. In
// a future version this may change, so if you do not want backoff behavior you should explicitly
// set it to zero. It is recommended to use both backoff and jitter, to avoid "thundering herd"
// behavior in the case of a server outage.
func StreamOptionUseBackoff(maxDelay time.Duration) StreamOption {
	return useBackoffOption{maxDelay}
}

type canRetryFirstConnectionOption struct {
	initialRetryTimeout time.Duration
}

func (o canRetryFirstConnectionOption) apply(s *streamOptions) error {
	s.initialRetryTimeout = o.initialRetryTimeout
	return nil
}

// StreamOptionCanRetryFirstConnection returns an option that determines whether to apply
// retry behavior to the first connection attempt for the stream.
//
// If the timeout is nonzero, an initial connection failure when subscribing will not cause an
// error result, but will trigger the same retry logic as if an existing connection had failed.
// The stream constructor will not return until a connection has been made, or until the
// specified timeout expires, if the timeout is positive; if the timeout is negative, it
// will continue retrying indefinitely.
//
// The default value is zero: an initial connection failure will not be retried.
func StreamOptionCanRetryFirstConnection(initialRetryTimeout time.Duration) StreamOption {
	return canRetryFirstConnectionOption{initialRetryTimeout}
}

type useJitterOption struct {
	jitterRatio float64
}

func (o useJitterOption) apply(s *streamOptions) error {
	s.jitterRatio = o.jitterRatio
	return nil
}

// StreamOptionUseJitter returns an option that determines whether to use a randomized
// jitter for reconnection delays.
//
// If jitterRatio is greater than zero, it represents a proportion up to 1.0 (100%) that will
// be deducted from the retry delay interval would otherwise be used: for instance, 0.5 means
// that the delay will be randomly decreased by up to 50%. A value greater than 1.0 is treated
// as equal to 1.0.
//
// For consistency with earlier versions, this is currently disabled (zero) by default. In
// a future version this may change, so if you do not want jitter you should explicitly set it
// to zero. It is recommended to use both backoff and jitter, to avoid "thundering herd"
// behavior in the case of a server outage.
func StreamOptionUseJitter(jitterRatio float64) StreamOption {
	return useJitterOption{jitterRatio}
}

type retryResetIntervalOption struct {
	retryResetInterval time.Duration
}

func (o retryResetIntervalOption) apply(s *streamOptions) error {
	s.retryResetInterval = o.retryResetInterval
	return nil
}

// StreamOptionRetryResetInterval returns an option that sets the minimum amount of time that a
// connection must stay open before the Stream resets its backoff delay. This is only relevant if
// backoff is enabled (see StreamOptionUseBackoff).
//
// If a connection fails before the threshold has elapsed, the delay before reconnecting will be
// greater than the last delay; if it fails after the threshold, the delay will start over at the
// the initial minimum value. This prevents long delays from occurring on connections that are only
// rarely restarted.
//
// The default value is DefaultRetryResetInterval.
func StreamOptionRetryResetInterval(retryResetInterval time.Duration) StreamOption {
	return retryResetIntervalOption{retryResetInterval: retryResetInterval}
}

type lastEventIDOption struct {
	lastEventID string
}

func (o lastEventIDOption) apply(s *streamOptions) error {
	s.lastEventID = o.lastEventID
	return nil
}

// StreamOptionLastEventID returns an option that sets the initial last event ID for a
// stream when the stream is created. If specified, this value will be sent to the server
// in case it can replay missed events.
func StreamOptionLastEventID(lastEventID string) StreamOption {
	return lastEventIDOption{lastEventID: lastEventID}
}

type httpClientOption struct {
	client *http.Client
}

func (o httpClientOption) apply(s *streamOptions) error {
	if o.client != nil {
		s.httpClient = o.client
	}
	return nil
}

// StreamOptionHTTPClient returns an option that overrides the default HTTP client used by
// a stream when the stream is created.
func StreamOptionHTTPClient(client *http.Client) StreamOption {
	return httpClientOption{client: client}
}

type loggerOption struct {
	logger Logger
}

func (o loggerOption) apply(s *streamOptions) error {
	s.logger = o.logger
	return nil
}

// StreamOptionLogger returns an option that sets the logger for a stream when the stream
// is created (to change it later, you can use SetLogger). By default, there is no logger.
func StreamOptionLogger(logger Logger) StreamOption {
	return loggerOption{logger: logger}
}

type streamErrorHandlerOption struct {
	handler StreamErrorHandler
}

func (o streamErrorHandlerOption) apply(s *streamOptions) error {
	s.errorHandler = o.handler
	return nil
}

// StreamOptionErrorHandler returns an option that causes a Stream to call the specified function
// for stream errors.
//
// If non-nil, this function will be called whenever Stream encounters either a network error or an
// HTTP error response status. The returned value determines whether Stream should retry as usual,
// or immediately stop as if Close had been called.
//
// When used, this mechanism replaces the Errors channel; that channel will be pre-closed and Stream
// will not push any errors to it, so the caller does not need to consume the channel.
//
// Note that using a handler is the only way to have control over how Stream handles errors during
// the initial connection attempt, since there would be no way for the caller to consume the Errors
// channel before the Subscribe method has returned.
func StreamOptionErrorHandler(handler StreamErrorHandler) StreamOption {
	return streamErrorHandlerOption{handler}
}

const (
	// DefaultInitialRetry is the default value for StreamOptionalInitialRetry.
	DefaultInitialRetry = time.Second * 3

	// DefaultRetryResetInterval is the default value for StreamOptionRetryResetInterval.
	DefaultRetryResetInterval = time.Second * 60
)

func (e SubscriptionError) Error() string {
	s := fmt.Sprintf("error %d", e.Code)
	if len(e.Message) != 0 {
		s = s + ": " + e.Message
	}
	return s
}

// Subscribe to the Events emitted from the specified url.
// If lastEventId is non-empty it will be sent to the server in case it can replay missed events.
// Deprecated: use SubscribeWithURL instead.
func Subscribe(url, lastEventID string) (*Stream, error) {
	return SubscribeWithURL(url, StreamOptionLastEventID(lastEventID))
}

// SubscribeWithURL subscribes to the Events emitted from the specified URL. The stream can
// be configured by providing any number of StreamOption values.
func SubscribeWithURL(url string, options ...StreamOption) (*Stream, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	return SubscribeWithRequestAndOptions(req, options...)
}

// SubscribeWithRequest will take an http.Request to set up the stream, allowing custom headers
// to be specified, authentication to be configured, etc.
// Deprecated: use SubscribeWithRequestAndOptions instead.
func SubscribeWithRequest(lastEventID string, request *http.Request) (*Stream, error) {
	return SubscribeWithRequestAndOptions(request, StreamOptionLastEventID(lastEventID))
}

// SubscribeWith takes a HTTP client and request providing customization over both headers and
// control over the HTTP client settings (timeouts, tls, etc)
// If request.Body is set, then request.GetBody should also be set so that we can reissue the request
// Deprecated: use SubscribeWithRequestAndOptions instead.
func SubscribeWith(lastEventID string, client *http.Client, request *http.Request) (*Stream, error) {
	return SubscribeWithRequestAndOptions(request, StreamOptionHTTPClient(client),
		StreamOptionLastEventID(lastEventID))
}

// SubscribeWithRequestAndOptions takes an initial http.Request to set up the stream - allowing
// custom headers, authentication, etc. to be configured - and also takes any number of
// StreamOption values to set other properties of the stream, such as timeouts or a specific
// HTTP client to use.
func SubscribeWithRequestAndOptions(request *http.Request, options ...StreamOption) (*Stream, error) {
	defaultClient := *http.DefaultClient

	configuredOptions := streamOptions{
		httpClient:         &defaultClient,
		initialRetry:       DefaultInitialRetry,
		retryResetInterval: DefaultRetryResetInterval,
	}

	for _, o := range options {
		if err := o.apply(&configuredOptions); err != nil {
			return nil, err
		}
	}

	stream := newStream(request, configuredOptions)

	var initialRetryTimeoutCh <-chan time.Time
	var lastError error
	if configuredOptions.initialRetryTimeout > 0 {
		initialRetryTimeoutCh = time.After(configuredOptions.initialRetryTimeout)
	}
	for {
		r, err := stream.connect()
		if err == nil {
			go stream.stream(r)
			return stream, nil
		}
		lastError = err
		if configuredOptions.initialRetryTimeout == 0 {
			return nil, err
		}
		if configuredOptions.errorHandler != nil {
			result := configuredOptions.errorHandler(err)
			if result.CloseNow {
				return nil, err
			}
		}
		// We never push errors to the Errors channel during initialization-- the caller would have no way to
		// consume the channel, since we haven't returned a Stream instance.
		delay := stream.retryDelay.NextRetryDelay(time.Now())
		if configuredOptions.logger != nil {
			configuredOptions.logger.Printf("Connection failed (%s), retrying in %0.4f secs\n", err, delay.Seconds())
		}
		nextRetryCh := time.After(delay)
		select {
		case <-initialRetryTimeoutCh:
			if lastError == nil {
				lastError = errors.New("timeout elapsed while waiting to connect")
			}
			return nil, lastError
		case <-nextRetryCh:
			continue
		}
	}
}

func newStream(request *http.Request, configuredOptions streamOptions) *Stream {
	var backoff backoffStrategy
	var jitter jitterStrategy
	if configuredOptions.backoffMaxDelay > 0 {
		backoff = newDefaultBackoff(configuredOptions.backoffMaxDelay)
	}
	if configuredOptions.jitterRatio > 0 {
		jitter = newDefaultJitter(configuredOptions.jitterRatio, 0)
	}
	retryDelay := newRetryDelayStrategy(
		configuredOptions.initialRetry,
		configuredOptions.retryResetInterval,
		backoff,
		jitter,
	)

	stream := &Stream{
		c:            configuredOptions.httpClient,
		lastEventID:  configuredOptions.lastEventID,
		readTimeout:  configuredOptions.readTimeout,
		req:          request,
		retryDelay:   retryDelay,
		Events:       make(chan Event),
		errorHandler: configuredOptions.errorHandler,
		Logger:       configuredOptions.logger,
		restarter:    make(chan struct{}, 1),
		closer:       make(chan struct{}),
	}

	if configuredOptions.errorHandler == nil {
		// The Errors channel is only used if there is no error handler.
		stream.Errors = make(chan error)
	}

	return stream
}

// Restart forces the stream to drop the currently active connection and attempt to connect again, in the
// same way it would if the connection had failed. There will be a delay before reconnection, as defined
// by the Stream configuration (StreamOptionInitialRetry, StreamOptionUseBackoff, etc.).
//
// This method is safe for concurrent access. Its behavior is asynchronous: Restart returns immediately
// and the connection is restarted as soon as possible from another goroutine after that. It is possible
// for additional events from the original connection to be delivered during that interval.ssible.
//
// If the stream has already been closed with Close, Restart has no effect.
func (stream *Stream) Restart() {
	// Note the non-blocking send: if there's already been a Restart call that hasn't been processed yet,
	// we'll just leave that one in the channel.
	select {
	case stream.restarter <- struct{}{}:
		break
	default:
		break
	}
}

// Close closes the stream permanently. It is safe for concurrent access and can be called multiple times.
func (stream *Stream) Close() {
	stream.closeOnce.Do(func() {
		close(stream.closer)
	})
}

// A reader which normalises line endings
// "/r" and "/r/n" are converted to "/n"
type normaliser struct {
	r        io.Reader
	lastChar byte
}

func newNormaliser(r io.Reader) *normaliser {
	return &normaliser{r: r}
}

func (norm *normaliser) Read(p []byte) (n int, err error) {
	n, err = norm.r.Read(p)
	for i := 0; i < n; i++ {
		switch {
		case p[i] == '\n' && norm.lastChar == '\r':
			copy(p[i:n], p[i+1:])
			norm.lastChar = p[i]
			n--
			i--
		case p[i] == '\r':
			norm.lastChar = p[i]
			p[i] = '\n'
		default:
			norm.lastChar = p[i]
		}
	}
	return
}

func (stream *Stream) connect() (io.ReadCloser, error) {
	var err error
	var resp *http.Response
	stream.req.Header.Set("Cache-Control", "no-cache")
	stream.req.Header.Set("Accept", "text/event-stream")
	if len(stream.lastEventID) > 0 {
		stream.req.Header.Set("Last-Event-ID", stream.lastEventID)
	}
	req := *stream.req

	// All but the initial connection will need to regenerate the body
	if stream.connections > 0 && req.GetBody != nil {
		if req.Body, err = req.GetBody(); err != nil {
			return nil, err
		}
	}

	if resp, err = stream.c.Do(&req); err != nil {
		return nil, err
	}
	stream.connections++
	if resp.StatusCode != 200 {
		message, _ := io.ReadAll(resp.Body)
		_ = resp.Body.Close()
		err = SubscriptionError{
			Code:    resp.StatusCode,
			Message: string(message),
		}
		return nil, err
	}
	return resp.Body, nil
}

func (stream *Stream) stream(r io.ReadCloser) {
	retryChan := make(chan struct{}, 1)

	scheduleRetry := func() {
		logger := stream.getLogger()
		delay := stream.retryDelay.NextRetryDelay(time.Now())
		if logger != nil {
			logger.Printf("Reconnecting in %0.4f secs", delay.Seconds())
		}
		time.AfterFunc(delay, func() {
			retryChan <- struct{}{}
		})
	}

	reportErrorAndMaybeContinue := func(err error) bool {
		if stream.errorHandler != nil {
			result := stream.errorHandler(err)
			if result.CloseNow {
				stream.Close()
				return false
			}
		} else if stream.Errors != nil {
			stream.Errors <- err
		}
		return true
	}

NewStream:
	for {
		events := make(chan Event)
		errs := make(chan error)

		if r != nil {
			dec := NewDecoderWithOptions(r,
				DecoderOptionReadTimeout(stream.readTimeout),
				DecoderOptionLastEventID(stream.lastEventID),
			)
			go func() {
				for {
					ev, err := dec.Decode()

					if err != nil {
						errs <- err
						close(errs)
						close(events)
						return
					}
					events <- ev
				}
			}()
		}

		discardCurrentStream := func() {
			if r != nil {
				_ = r.Close()
				r = nil
				// allow the decoding goroutine to terminate
				for range errs {
				}

				for range events {
				}

			}
		}

		for {
			select {
			case <-stream.restarter:
				discardCurrentStream()
				scheduleRetry()
				continue NewStream
			case err := <-errs:
				if !reportErrorAndMaybeContinue(err) {
					break NewStream
				}
				discardCurrentStream()
				scheduleRetry()
				continue NewStream
			case ev := <-events:
				pub := ev.(*publication)
				if pub.Retry() > 0 {
					stream.retryDelay.SetBaseDelay(time.Duration(pub.Retry()) * time.Millisecond)
				}
				stream.lastEventID = pub.lastEventID
				stream.retryDelay.SetGoodSince(time.Now())
				stream.Events <- ev
			case <-stream.closer:
				discardCurrentStream()
				break NewStream
			case <-retryChan:
				var err error
				r, err = stream.connect()
				if err != nil {
					r = nil
					if !reportErrorAndMaybeContinue(err) {
						break NewStream
					}
					scheduleRetry()
				}
				continue NewStream
			}
		}
	}

	if stream.Errors != nil {
		close(stream.Errors)
	}
	close(stream.Events)
}

// SetLogger sets the Logger field in a thread-safe manner.
func (stream *Stream) SetLogger(logger Logger) {
	stream.mu.Lock()
	defer stream.mu.Unlock()
	stream.Logger = logger
}

func (stream *Stream) getLogger() Logger {
	stream.mu.RLock()
	defer stream.mu.RUnlock()
	return stream.Logger
}
