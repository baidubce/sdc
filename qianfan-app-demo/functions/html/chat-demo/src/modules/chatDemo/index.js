import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Input, toast, DialogBox } from 'acud';
import { OutlinedDelete, OutlinedDownload, OutlinedRefresh } from 'acud-icon';
import './index.less';
import { guid, handleHistoryData, down } from './constant';
import Top from './top';
import Left from './left';
import Loading from './loading';
import Operate from './operate';
import Prism from 'prismjs';
import MarkdownIt from 'markdown-it';
import MarkdownItKatex from 'markdown-it-katex';
// import 'katex/dist/katex.min.css';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-c';
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import sendbtndefault from '../../assets/sendbtndefault.png';
import sendbtnac from '../../assets/sendbtnac.png';
import user from '../../assets/user.png';
import assistant from '../../assets/assistant.png';
import './prism.css'
import { EventSourcePolyfill } from 'event-source-polyfill';
import useInputHooks from './useHooks/useInputHooks'
const highlight = (str, lang) => {
  if (!Prism.languages[lang]) {
    lang = 'js';
  }
  let code = Prism.highlight(str, Prism.languages[lang], lang);
  return `<pre class="language-` + lang + `"><code>${code}</code></pre>`
}
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: highlight,
}).use(MarkdownItKatex);
const usageInfoDefault = {
  completion_tokens: 0,
  prompt_tokens: 0,
  total_tokens: 0
}
// 声明全局 eventSource，方便关闭
var eventSourceObj = null;
// 是否强制停止
var forceStop = false;
var text_pronpt = '';
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [textAreaVal, setTextAreaVal] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [uuid, setUuid] = useState(guid());
  const [usageInfo, setUsageInfo] = useState(usageInfoDefault);
  const [modalValue, setModalValue] = useState('');
  const [isShowDelModal, setIsShowDelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 请求时显示loading，有返回时隐藏
  const [isChange, setIsChange] = useState(false); // 是否可以切换左侧提示提问：true：不能切换 false：可以切换
  const [sendStatus, setSendStatus] = useState(0); // 0:默认状态 1:激活状态；2:发送状态
  const [isShowStop, setIsShowStop] = useState(2); // 0:停止状态 1:正在生成；2:完成生成
  const boxRef = useRef(null);
  const [isTypewriter, setIsTypewriter] = useState(false);
  const [isScroll, setIsScroll] = useState(true);
  const [isComposing, onCompositionStart, onCompositionEnd] = useInputHooks()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentDom_h5, setCurrentDom_h5] = useState('right');
  const sendFn = async () => {
    // 发送消息按钮
    let messageList_copy = [...messageList];
    if (messageList_copy.length > 0 && messageList_copy[messageList_copy.length - 1].role === 'user') {
      messageList_copy.pop();
    }
    messageList_copy.push({ role: 'user', content: textAreaVal });
    setMessageList([...messageList_copy]); // 发送时更新当前列表
    reqFn([...messageList_copy]);
  }

  const textAreaOnchange = e => {
    // 输入框change
    const val = e.target ? e.target.value : e;
    if (val.length === 0) setSendStatus(0);
    setTextAreaVal(val);
  }

  const eventSourceClose = () => {
    eventSourceObj.close();
  }

  const reqFn = async (list) => {
    eventSourceObj = null;
    forceStop = false;
    // 请求
    let acResult = 0;
    setIsLoading(true);
    setIsChange(true);
    setTextAreaVal('');
    setIsShowStop(1);
    setSendStatus(2);
    setIsScroll(true);
    const params = {
      "messages": JSON.stringify(list),
      "stream": "true",
      "model": modalValue
    }

    // 存储单次会话的所有文本，防止和打字机不同步，导致历史记录存储问题
    let historyRawMsg = "";
    eventSourceObj = new EventSourcePolyfill('/v1/ernie/chat?' + (new URLSearchParams(params)).toString(), {
      headers: {
        'Req-UUID': uuid
      }
    });
    eventSourceObj.onmessage = function (event) {
      var res = ""
      try {
        res = JSON.parse(event.data);
      } catch (error) {
        console.Error(res);
        toast.error({
          message: "数据解析失败，请重试",
          duration: 3
        });
        eventSourceClose();
      }
      if (res instanceof Object && res.err_no === 0) {
        if (acResult === 0) {
          setIsLoading(false);
          list.push({ role: 'assistant', content: "" });
          setMessageList([...list]);
          acResult = list.length - 1;
        }
        historyRawMsg += res.data.result
        typerEffect(res.data.result, acResult, list, res.data.is_end);
        if (res.data.is_end) {
          eventSourceClose();
          setIsChange(false);
          if (text_pronpt.length > 0 && text_pronpt !== textAreaVal) {
            setSendStatus(1);
          } else {
            setSendStatus(0);
          }
          // 此处不能直接使用list，因为打印机还未结束
          let list_copy = JSON.parse(JSON.stringify(list));
          list_copy[acResult].content = historyRawMsg;
          handleHistoryData(list_copy, res.data.usage, uuid); // 更新储存的历史信息
          setUsageInfo(res.data.usage);
          historyRawMsg = "";
        }

      } else {
        toast.warning({
          message: res.msg,
          duration: 10
        });
        setIsLoading(false);
        setIsShowStop(0);
        setSendStatus(0);
        setIsChange(false);
        eventSourceClose();
      }
    };

    eventSourceObj.onerror = function (event) {
      // 处理错误
      console.error(event);
      toast.error({
        message: "数据解析失败，请重试",
        duration: 3
      });
      setIsShowStop(0);
      setSendStatus(0);
      setIsChange(false);
      eventSourceClose();
    };
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !isComposing) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        setTextAreaVal(prevValue => prevValue + '\n');
      } else {
        event.preventDefault();
        if (textAreaVal.replace(/\s+/g, '').length < 1) {
          toast.warning({
            message: '请输入问题',
            duration: 3
          });
          return
        }
        if (sendStatus === 2) {
          toast.warning({
            message: '正在推理中，请稍后...',
            duration: 3
          });
          return
        }
        let messageList_copy = [...messageList];
        if (messageList_copy.length > 0 && messageList_copy[messageList_copy.length - 1].role === 'user') {
          messageList_copy.pop();
        }
        messageList_copy.push({ role: 'user', content: textAreaVal });
        setMessageList([...messageList_copy]); // 发送时更新当前列表
        reqFn([...messageList_copy]);
      }
    }
  }
  var contentMsgArr = [];
  // 添加打印机效果
  const typerEffect = (content, acResult, list, isEnd) => {
    // 清除最后一个字符下划线
    setIsTypewriter(true)
    var renderSpeed = 2500
    if (isEnd) {
      renderSpeed = 1000
      setIsShowStop(2);
      setIsTypewriter(false)
    }
    contentMsgArr.push(...content.split(''))
    const typerEffectTimeout = setInterval(() => {
      if (forceStop) {
        clearInterval(typerEffectTimeout);
        console.log("手动结束")
        setIsTypewriter(false)
        return
      }
      if (contentMsgArr.length <= 0) {
        clearInterval(typerEffectTimeout);
        console.log("打字机结束")
      }
      var leftChar = contentMsgArr.shift()
      if (leftChar !== undefined) {
        list[acResult].content = list[acResult].content + leftChar;
        setMessageList([...list]);
      }
    }, Math.round(renderSpeed / content.length));
  }
  const stopAndRefFn = str => {
    // 停止生成 && 重新生成
    let messageList_copy = [...messageList]
    if (str === 'stop') {
      eventSourceClose();
      setSendStatus(0);
      setIsChange(false);
      setIsShowStop(0);
      forceStop = true;
    } else {
      if (messageList_copy[messageList_copy.length - 1].role === 'assistant') {
        messageList_copy.pop();
      }
      reqFn([...messageList_copy]);
      setIsShowStop(1);
    }
    setMessageList([...messageList_copy]);
  };
  const downOperation = () => {
    // 下载当前会话列表
    down(
      {
        content: JSON.stringify(messageList),
        name: 'prompt',
        suffix: '.json',
        fn: () => {
          toast.success({
            message: '下载成功',
            duration: 3
          });
        }
      })
  }
  const delOperation = () => {
    // 删除当前会话列表，逻辑同新加对话
    setIsShowDelModal(true);
  }
  const goDownn = () => {
    // 会话框滚动到底部
    if (isScroll) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  };
  const delModalHandleOk = () => {
    // 删除当前会话，需要做很多初始化工作
    eventSourceClose();
    forceStop = true;
    setIsShowStop(2);

    setUuid(guid());
    setMessageList([]);
    setUsageInfo(usageInfoDefault);
    setIsShowDelModal(false);
  };

  const delModalHandleCancel = () => {
    setIsShowDelModal(false);
  };

  const changeContent = () => {
    // 头部历史记录入口逻辑处理
    const left = document.querySelector('.forLeftHidden');
    const right = document.querySelector('.rightBox');
    currentDom_h5 === 'right' ? setCurrentDom_h5('left') : setCurrentDom_h5('right');
    
    if (currentDom_h5 === 'right') {
      left.style.display = 'block';
      right.style.display = 'none';
    } else {
      left.style.display = 'none';
      right.style.display = 'block';
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  useEffect(() => {
    const left = document.querySelector('.forLeftHidden');
    const right = document.querySelector('.rightBox');
    if (windowWidth > 768) {
      left.style.display = 'block';
      right.style.display = 'block';
    } else {
      // TODO: H5适配开关
      // currentDom_h5 === 'right' ? left.style.display = 'none' : right.style.display = 'none';
    }
  }, [windowWidth,currentDom_h5]);

  useEffect(() => {
    text_pronpt = textAreaVal;
    if (textAreaVal.replace(/\s+/g, '').length > 0 && sendStatus !== 2) {
      setSendStatus(1);
    }
  }, [textAreaVal]);

  useEffect(() => {
    goDownn();
  }, [messageList]);

  return (
    <Fragment>
      <div className="chatDemo">
        <Top modalValue={modalValue} setModalValue={setModalValue} changeContent={changeContent} currentDom_h5={currentDom_h5} />
        <div className="mainBox">
          <div className="forLeftHidden">
            <Left
              setTextAreaVal={setTextAreaVal}
              setMessageList={setMessageList}
              setUuid={setUuid}
              setUsageInfo={setUsageInfo}
              usageInfoDefault={usageInfoDefault}
              setSendStatus={setSendStatus}
              setIsShowStop={setIsShowStop}
              isChange={isChange}
              setIsChange={setIsChange}
              setIsLoading={setIsLoading}
              windowWidth={windowWidth}
              setCurrentDom_h5={setCurrentDom_h5}
            />
          </div>
          <div className="rightBox">
            <div className="msgBox">
              <div className="msgTop">
                <div className="msgTopL">tokens数量：{usageInfo.total_tokens}</div>
                {messageList && messageList.length > 0 && (
                  <div className="msgTopR">
                    <OutlinedDownload onClick={downOperation} style={{ marginRight: "8px", cursor: "pointer" }} />
                    <OutlinedDelete onClick={delOperation} style={{ cursor: "pointer" }} />
                  </div>
                )}
              </div>
              <div className="msgList" ref={boxRef}>
                {messageList.length === 0 && (
                  <div className="defaultRab">
                    <img src={assistant} alt="" />
                    <div className="textBox">
                      <div className="nh">你好，</div>
                      <div className="desc">您可以从左侧『推荐提问』中选择选择提问示例进行提问，也可以在下方输入框中直接输入您的问题</div>
                    </div>
                  </div>
                )}
                {messageList && messageList.map((item, index) => (
                  <div className={item.role === 'user' ? 'msgItemUser' : 'msgItemRab'} style={index === messageList.length - 1 ? { marginBottom: 0 } : {}} key={index}>
                    <img src={item.role === 'user' ? user : assistant} alt="" />
                    {item.role === 'user' ? (
                      <div className="content">
                        <div className="msg mdcss">{item.content}</div>
                        <Operate
                          item={item}
                          index={index}
                          messageList={messageList}
                          setMessageList={setMessageList}
                          reqFn={reqFn}
                          setIsScroll={setIsScroll}
                        />
                      </div>
                    ) : <div className="content">
                      <div className="msg mdcss">
                        <div className={`msg2 ${isTypewriter && index == messageList.length - 1 ? 'isTypewriter' : ''} ${isShowStop === 0 && 'msg2-pb10'}`} dangerouslySetInnerHTML={{ __html: (md.render(item.content)).replace(/<\/p>\s*$/, '</p>') }}></div>
                        {isShowStop === 0 && index == messageList.length - 1 && (<div className="alreadyStop">已停止生成</div>)}
                      </div>
                      {isShowStop !== 1 && (
                        <Operate
                          item={item}
                          index={index}
                          messageList={messageList}
                          setMessageList={setMessageList}
                          reqFn={reqFn}
                          setIsScroll={setIsScroll}
                        />
                      )}
                    </div>}
                  </div>
                ))}
                {isLoading && (<Loading isShowStop={isShowStop} />)}
                {isShowStop === 1 && <div className="stopAndRefBox" onClick={() => stopAndRefFn('stop')}>停止生成</div>}
                {/* {isShowStop === 0 && <div className="stopAndRefBox" onClick={() => stopAndRefFn('ref')}><OutlinedRefresh style={{ margin: "0 3px 2px 0" }} />重新生成</div>} */}
              </div>
              <div className="msgSend">
                <div className="desc">您可以尝试输入任何问题，或在左侧推荐提问中选择您感兴趣的关键词</div>
                <div className="forBorder">
                  <div className="textAreaBox">
                    <Input.TextArea
                      placeholder="请输入问题"
                      value={textAreaVal}
                      allowClear={false}
                      limitLength={false}
                      autoSize={{ minRows: 1, maxRows: 5 }}
                      onChange={textAreaOnchange}
                      onKeyDown={onKeyDown}
                      onCompositionStart={onCompositionStart}
                      onCompositionEnd={onCompositionEnd}
                    />
                    {/* {sendStatus === 0 && (<img src={sendbtndefault} alt="" />)}
                    {sendStatus === 1 && (<img src={sendbtnac} onClick={sendFn} alt="" />)}
                    {sendStatus === 2 && (
                      <div className="dotBox">
                        <div className="dot dot1"></div>
                        <div className="dot dot2"></div>
                        <div className="dot dot3"></div>
                      </div>
                    )} */}
                    {(sendStatus === 0 || sendStatus === 2) && (<img src={sendbtndefault} alt="" />)}
                    {sendStatus === 1 && (<img src={sendbtnac} onClick={sendFn} alt="" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogBox
        className='dialog'
        title={`确定要删除该会话吗`}
        content={<>删除后数据不可恢复</>}
        visible={isShowDelModal}
        onOk={delModalHandleOk}
        onCancel={delModalHandleCancel}
      >
      </DialogBox>
    </Fragment>
  );
};
