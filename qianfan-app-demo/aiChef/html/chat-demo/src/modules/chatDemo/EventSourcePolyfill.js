
import { EventSourcePolyfill } from 'event-source-polyfill';

export function eventSourcePolyfill({ params, url, opt, messageCallback }) {

  return new Promise((resolve, reject) => {

    let eventSource = new EventSourcePolyfill(url + '?' + (new URLSearchParams(params)).toString(), opt);

    eventSource.onmessage = function (event) {

      resolve(eventSource);

      if (typeof messageCallback === "function") {
        messageCallback(event.data);
      }

    }


    eventSource.onerror = function (event) {
      reject("eventSource error");
    };

  })








}