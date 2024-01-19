import React, { Fragment, useEffect, useState } from 'react';
import { Button, Tabs, toast, DialogBox, Badge } from 'acud';
import { OutlinedPlusNew, OutlinedLeft, OutlinedDelete, OutlinedDownload } from 'acud-icon';
import './index.less';
import { storage, guid, prompts, down } from './constant';
import Api from '../../api';
import banner from '../../assets/banner.png'
import ac from '../../assets/ac.svg'
const { TabPane } = Tabs;
const panes = [
  { tab: '推荐提问', key: '0' },
  { tab: '历史对话', key: '1' },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { setTextAreaVal, setMessageList, setUuid, setUsageInfo, usageInfoDefault, isChange, setSendStatus, setIsShowStop, setIsLoading, setIsChange, setCurrentDom_h5, windowWidth } = props;
  const [activeKey, setActiveKey] = useState('0');
  const [promptList, setPromptList] = useState([]);
  const [showPromptInfo, setShowPromptInfo] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [versionInfo, setVersionInfo] = useState({});
  const [isAcIndex, setIsAcIndex] = useState('');
  const [isShowDelModal, setIsShowDelModal] = useState(false);
  const [acItem, setAcItem] = useState({});
  const [updateDialog, setUpdateDialog] = useState(false);

  const changeDom = () => {
    const left = document.querySelector('.forLeftHidden');
    const right = document.querySelector('.rightBox');
    if (windowWidth < 768) {
      left.style.display = 'none';
      right.style.display = 'block';
    }
    setCurrentDom_h5('right')
  }

  const newDialogue = () => {
    // + 新对话
    if (isChange) {
      toast.warning({
        message: '正在推理中，无法新建对话',
        duration: 3
      });
      return
    }
    setIsChange(false);
    setIsLoading(false);
    setIsShowStop(2);
    setSendStatus(0);
    setUuid(guid());
    setShowPromptInfo(false);
    setTextAreaVal('');
    setMessageList([]);
    setUsageInfo(usageInfoDefault);
    changeDom()
  };
  const tabsOnChange = activeKey => {
    // 左侧tabs切换
    setActiveKey(activeKey);
    if (activeKey === '1') {
      let historySationData = storage.get('historySationData') || {};
      let arr = Object.keys(historySationData).map(key => {
        return { uuid: key, list: historySationData[key].list };
      });
      setHistoryList([...arr.reverse()]);
    }
  };
  const openTag = list => {
    // 点击推荐提问tag
    setPromptList(list);
    setShowPromptInfo(true);
  };
  const promptItemFn = item => {
    // Prompt点击
    setTextAreaVal(item.content);

    changeDom()
  };
  const openSation = (item, index) => {
    // 打开历史会话记录
    if (isChange) {
      toast.warning({
        message: '正在推理中，无法覆盖会话',
        duration: 3
      });
      return
    }
    let historySationData = storage.get('historySationData') || {};
    setUuid(item.uuid);
    setMessageList(historySationData[item.uuid].list);
    setUsageInfo(historySationData[item.uuid].tokens);
    setIsAcIndex(index);
    setIsShowStop(2);
    setSendStatus(0);
    setIsLoading(false);

    changeDom()
  };
  const getVersionFn = async () => {
    // 获取版本号
    const res = await Api.getVersion();
    setVersionInfo(res);
  };
  const operationFn = (e, item, str) => {
    e.stopPropagation(); // 阻止冒泡
    let historySationData = storage.get('historySationData') || {};
    // 下载&&删除
    if (str === 'down') {
      down(
        {
          content: JSON.stringify(historySationData[item.uuid].list),
          name: 'prompt',
          suffix: '.json',
          fn: () => {
            toast.success({
              message: '下载成功',
              duration: 3
            });
          }
        });
    }
    if (str === 'del') {
      setIsShowDelModal(true);
      setAcItem(item);
    }
  };
  const delModalHandleOk = () => {
    let historySationData = storage.get('historySationData') || {};
    delete historySationData[acItem.uuid];
    let arr = Object.keys(historySationData).map(key => {
      return { uuid: key, list: historySationData[key].list };
    });
    setHistoryList([...arr.reverse()]);
    storage.set('historySationData', historySationData);
    setIsShowDelModal(false);
  };

  const delModalHandleCancel = () => {
    setIsShowDelModal(false);
  };
  const versionFn = () => {
    if (!versionInfo.available) {
      return <span>{versionInfo.version}</span>
    } else {
      return (
        <Badge dot>
          <span className="txt" style={{ cursor: "pointer" }} onClick={() => setUpdateDialog(true)}>{versionInfo.version}</span>
        </Badge>
      )
    }
  };
  const updateDialogHandleOk = () => {
    window.open(versionInfo.update_link);
    setUpdateDialog(false);
  };
  const updateDialogHandleCancel = () => {
    setUpdateDialog(false);
  };

  useEffect(() => {
    getVersionFn();
  }, [])

  return (
    <Fragment>
      <div className="leftBox">
        <div className="addBtn">
          <Button icon={<OutlinedPlusNew />} type="primary" onClick={newDialogue}>新对话</Button>
        </div>
        <div className="tabs">
          <Tabs onChange={tabsOnChange} activeKey={activeKey}>
            {panes.map(pane => (
              <TabPane tab={pane.tab} key={pane.key} closable={pane.closable} />
            ))}
          </Tabs>
        </div>
        {activeKey === '0' && (
          <div className="tagList">
            {!showPromptInfo && (
              <div className="tagItemBox">
                {prompts.map((v, index) => <div onClick={() => openTag(v.list)} className="tagItem" key={index}>
                  <img src={v.icon} alt="" />
                  <div className="tagName">{v.tag}</div>
                </div>)}
              </div>
            )}
            {showPromptInfo && (
              <div className="promptBox">
                <div className="promptTop">
                  <div className="goBack" onClick={() => setShowPromptInfo(false)}>
                    <OutlinedLeft />
                    <span>返回</span>
                  </div>
                  <div className="topLabel">Prompt列表</div>
                </div>
                <div className="promptInfo">
                  {promptList && promptList.map((v, index) => <div onClick={() => promptItemFn(v)} className="promptItem" key={index}>{v.content}</div>)}
                </div>
              </div>
            )}
          </div>
        )}
        {activeKey === '1' && (
          <div className="historyList">
            {historyList && historyList.map((v, index) => <div onClick={() => openSation(v, index)} className={isAcIndex === index ? "sationItem active" : "sationItem"} key={index}>
              {isAcIndex === index && (<img src={ac} alt="" />)}
              <div className="content">{v.list[0].content}</div>
              <div className="downAndDelBox">
                <OutlinedDownload onClick={(e) => operationFn(e, v, 'down')} style={{ paddingRight: "8px", borderRight: "1px solid #D4D6D9", cursor: "pointer" }} />
                <OutlinedDelete onClick={(e) => operationFn(e, v, 'del')} style={{ paddingLeft: "8px", cursor: "pointer" }} />
              </div>
            </div>)}
          </div>
        )}
        <div className="bannerBox">
          <div className="banner">
            <a href='https://cloud.baidu.com/survey/ctsservice.html' target='_blank' rel="noopener noreferrer">
              <img src={banner} alt="" />
            </a>
          </div>
          <div className="version">
            请遵守《 文心千帆服务协议 》，版本号：{versionFn()}</div>
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
      <DialogBox
        className='dialog'
        title="版本更新"
        content={<>{versionInfo.descrip}</>}
        visible={updateDialog}
        onOk={updateDialogHandleOk}
        onCancel={updateDialogHandleCancel}
      >
      </DialogBox>
    </Fragment>
  );
};
