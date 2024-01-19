import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Input, toast, Tooltip, Modal, Upload, Popover, Tabs } from 'acud';
import styled, { createGlobalStyle } from 'styled-components'
import Api from '../../../api';
import Prism from 'prismjs';
import { OutlinedLoading, OutlinedClose } from 'acud-icon';

import { down, copy2 } from '../constant';

const initialPanes = [
  { tab: '编辑模板', content: '内容1', key: '1' },
  { tab: '查看示例', content: '内容2', key: '2' },
];



export default function UpLoads({ modalValue, isSetSywd, MD, getEmbeddingSuggest, setUpCompSucStatus, setIsShowMask, isShowMask, cUpLoads }) {
  useImperativeHandle(cUpLoads, () => ({
    // changeVal 就是暴露给父组件的方法
    setIsShowUpPop
  }));


  const [isShowUpPop, setIsShowUpPop] = useState(false);
  const [isShowDemoPop, setIsShowDemoPop] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [isDownUp, setIsDownUp] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [isSyslLoading, setIsSyslLoading] = useState(false);




  const [isShowEditPop, setIsShowEditPop] = useState(false);

  const [editActiveKey, setEditActiveKey] = useState('1');
  const [privatePromptData, setPrivatePromptData] = useState({});

  const [inputPrompt, setPrompt] = useState();

  const [curDoc, setCurDoc] = useState('');

  const [showDoc, setShowDoc] = useState('')


  const [isShowCurDoc, setIsShowCurDoc] = useState(false);








  const confirmUp = async () => {

    if (fileList.length <= 0) return toast.error({
      message: '请上传文件',
      duration: 2
    });
    setIsUpLoading(true)

    const form = new FormData();

    form.append('file', fileList[0]);
    try {
      let res = await Api.upDoc(modalValue, form)

      if (res.err_no === 0) {
        toast.success({
          message: `文件上传成功！`,
          duration: 2
        });

        setIsShowUpPop(false)
        handleIsDownUp()
        // 上传成功后更新左侧 首页的数据

        setUpCompSucStatus(true) //左侧

        getEmbeddingSuggest() //首页



      } else {
        toast.error({
          message: res.msg,
          duration: 10
        });
      }
      setFileList([])
    } catch (error) {
      toast.success({
        message: error.msg,
        duration: 2
      });
    }

    setIsUpLoading(false)


  }

  const confirmEdit = async () => {
    setIsUpLoading(true)

    const queryString = Object.entries({ "prompt": encodeURI(inputPrompt) }).reduce((acc, [key, value]) => {
      return `${acc}${key}=${value}&`;
    }, "").slice(0, -1);


    try {
      let res = await Api.setPrivatePrompt(queryString)

      if (res.msg == "success") {
        toast.success({
          message: res.msg,
          duration: 2
        });

        setIsShowEditPop(false)



      } else {
        toast.error({
          message: res.msg,
          duration: 2
        });
      }
    } catch (error) {
      toast.success({
        message: error.msg,
        duration: 2
      });
    }

    setIsUpLoading(false)
  }



  const customRequest = (e) => {


    let arrType = ['jsonl']
    const isPass = arrType.every(v => e.file.name.includes(v))

    if (!isPass) {
      return toast.error({
        message: '仅支持.jsonl格式文档',
        duration: 2
      });
    }

    const isLt1M = e.file.size / 1024 / 1024 < 10;
    if (!isLt1M) {
      return toast.error({
        message: '文档必须小于10MB!',
        duration: 2
      });
    }

    setFileList([e.file]);
  }

  const uphandleCancel = () => {
    setIsShowUpPop(false)
    setFileList([])
    setIsUpLoading(false)
  }
  const props = {
    name: 'file',
    type: 'drag',
    fileList,
    // action: `/v1/ernie/embedding?model=${modalValue}`,
    headers: {
      authorization: 'authorization-text'
    },
    showUploadList: {
      showDownloadIcon: false
    },
    onDownload(file) {

    },
    // description: '帮助文案',
    // multiple: true,
    // maxCount: 5,
    customRequest,
    onRemove(e) {
      setFileList([])
    }
  };

  const handleIsDownUp = async () => {
    let res = await Api.getEmbedding()


    if (res.data.current) {
      setIsDownUp(true)
      setCurDoc(res.data.current)
    } else {
      setIsDownUp(false)
    }
    setShowDoc(res.data.default)
  }

  const downLoad = (e) => {

    down(
      {
        content: e,
        name: 'demo',
        suffix: '.jsonl',
        fn: () => {
          toast.success({
            message: '下载成功',
            duration: 3
          });
        }
      });
  }

  const usageExamples = async (e) => {
    setIsSyslLoading(true)

    const form = new FormData();

    form.append('useDefault', 1);



    let res = await Api.upDoc(modalValue, form)

    if (res.err_no === 0) {
      toast.success({
        message: '成功',
        duration: 3
      });

      // 上传成功后更新左侧 首页的数据

      setUpCompSucStatus(true) //左侧

      getEmbeddingSuggest() //首页
      setIsShowUpPop(false)
      handleIsDownUp()
    }else{
      toast.warning({
        message: res.msg,
        duration: 10
      });
    }

    setIsSyslLoading(false)


  }

  useEffect(() => {
    handleIsDownUp()
  }, [])

  useEffect(() => {

    if (isSetSywd) {
      setIsShowMask(true)
    }

  }, [isSetSywd])





  const GetIcon = () => {
    return <>
      <Tooltip placement="top" title={isDownUp ? '已上传' : '上传文档'}>
        <div className={`upLoad ${isDownUp ? 'isDownUp' : ''}`} onClick={e => setIsShowUpPop(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path fillRule="evenodd" d="M8 10.963a.74.74 0 00.74-.74v-5.36l1.7 1.698a.74.74 0 101.047-1.048L8.524 2.55a.74.74 0 00-1.048 0L4.513 5.513a.74.74 0 001.048 1.048l1.698-1.699v5.36c0 .41.332.74.741.74zm-3.004 1.37h6.026a.7.7 0 010 1.4H4.996a.7.7 0 110-1.4z"></path></svg>
        </div>
      </Tooltip>
      {/* <img className="mbk" onClick={openIsShowEditPop} src={assistant} alt="" /> */}
    </>
  }

  const HasMask = () => {
    return <>
      <div className="mask" onClick={e => setIsShowMask(false)}></div>
      <Popover defaultVisible content={<div className='popCont'>点击可上传自己的文档<OutlinedClose onClick={e => setIsShowMask(false)} /></div>} trigger="click">
        <GetIcon />
      </Popover>
    </>
  }

  const openIsShowEditPop = async () => {
    setIsShowEditPop(true)
    let res = await Api.getPrivatePrompt()


    setPrompt(res.data.current)

    setPrivatePromptData(res.data)
  }

  const onChangeset = (e) => {

    setPrompt(e.target.value)
  }

  // Django-syntax
  const jump2Doc = (e) => {
    window.open(e);
  }








  return (
    <UpLoadsWrap>
      {<TooltipStyle />}


      {
        isSetSywd && (isShowMask ? <HasMask /> : <GetIcon />)
      }


      {/* 上传 */}
      <Modal footer={null} className={`upModal ${fileList.length > 0 ? 'upLoads' : ''}`} maskClosable closable title="上传文档" visible={isShowUpPop} onCancel={uphandleCancel}>
        <Upload {...props}  >
          <div className="drag-content">

            <p className="text">
              <div className="top">将文件拖到此处</div>
              <div className="bot">
                或<span>点击</span>上传
              </div>
            </p>
          </div>
        </Upload>
        <p className="tips">
          注意：目前只支持 *.jsonl（ <span onClick={e => { setIsShowDemoPop(true) }}>示例</span>） 文件上传，您也可查看<span onClick={e => { setIsShowCurDoc(true) }}>当前语料</span>。
        </p>
        <div className="upFooter">
          <button className='upBtn sysl' onClick={usageExamples}>{isSyslLoading && <OutlinedLoading width={22} animation="spin" />}导入示例</button>
          <button className='upBtn' onClick={confirmUp}>{isUpLoading && <OutlinedLoading width={22} animation="spin" />}确认上传</button>
        </div>

      </Modal>

      {/* 当前文档 */}

      <Modal className="upModal" footer={null} size="normal" maskClosable closable title={'当前文档'} visible={isShowCurDoc} onCancel={e => setIsShowCurDoc(false)}>
        <pre className={`language-js`}>
          {
            <code dangerouslySetInnerHTML={{ __html: Prism.highlight(curDoc, Prism.languages['js'], "js") }}></code>
          }
        </pre>
        <div className="upFooter tipsDemo">
          <p> 注意：每行语料（Q加A）的总字符数量不超过384，文档大小不超过10M， 训练数据上传暂时只支持 *.jsonl 文件, <span onClick={e => downLoad(curDoc)}>下载当前文档</span></p>
        </div>
      </Modal>



      {/* 查看示例 */}

      <Modal className="upModal" footer={null} size="normal" maskClosable closable title={'查看示例'} visible={isShowDemoPop} onCancel={e => setIsShowDemoPop(false)}>
        <pre className={`language-js`}>
          {
            <code dangerouslySetInnerHTML={{ __html: Prism.highlight(showDoc, Prism.languages['js'], "js") }}></code>
          }
        </pre>
        <div className="upFooter tipsDemo">
          <p> 注意：每行语料（Q加A）的总字符数量不超过384，文档大小不超过10M， 训练数据上传暂时只支持 *.jsonl 文件, <span onClick={e => downLoad(showDoc)}>下载示例文档</span></p>
        </div>
      </Modal>
      {/* 编辑模版 */}
      <Modal className="upModal" footer={null} size="normal" maskClosable closable title="" visible={isShowEditPop} onCancel={e => setIsShowEditPop(false)}>
        <Tabs
          onChange={e => setEditActiveKey(e)}
          activeKey={editActiveKey}
        >
          {initialPanes.map(pane => (
            <Tabs.TabPane tab={pane.tab} key={pane.key} closable={pane.closable} max={4}></Tabs.TabPane>
          ))}
        </Tabs>

        {
          editActiveKey == 1 ?
            <div className='TextAreacontent'><Input.TextArea
              placeholder="输入Prompt"
              allowClear={false}
              // autoSize={{ minRows: 5, maxRows: 15 }}
              value={inputPrompt}
              onChange={onChangeset}
            />
              <p className="tips">通过编辑Prompt模板来控制问答效果，localData变量表示向量库返回的QA对，input表示当前问题，语法可参照 <span onClick={e => { jump2Doc('https://docs.djangoproject.com/en/4.2/ref/templates/language/') }}>文档</span></p>
              <div className="upFooter">
                <button className='upBtn' onClick={confirmEdit}>{isUpLoading && <OutlinedLoading width={22} animation="spin" />}确认编辑</button>
              </div>
            </div> :
            <div className='showPrivatePromptData'>
              <pre className={`language-js`}>
                {
                  <code dangerouslySetInnerHTML={{ __html: Prism.highlight(privatePromptData?.default, Prism.languages.js, "js") }}></code>
                }
              </pre>
              <p className="tips">Prompt的设置决定着问答的效果，可联系我们获取更多Prompt调试技巧 <span onClick={e => { jump2Doc("https://cloud.baidu.com/product/ACA/expert.html") }}>文档</span></p>
              <div className="upFooter">
                <button className='upBtn' onClick={e => copy2(privatePromptData?.default, () => {
                  toast.success({
                    message: '复制成功',
                    duration: 3
                  });
                })}>复制内容</button>
              </div>

            </div>
        }


      </Modal>
    </UpLoadsWrap>
  )
}

const UpLoadsWrap = styled.div`
padding: 10px 0;
align-self: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
align-self: flex-start;
.mbk{
  width: 22px !important;
  object-fit: contain;
  margin-left:6px;
    /* height:32px; */
    margin-bottom: 0 !important;
}
.upLoad {
  /* margin-bottom:10px; */
  cursor: pointer;
  align-items: center;
  background: #e7e5ef;
  border-radius: 50%;
  color: #4d4477;
  display: flex;
  flex-shrink: 0;
  height: 22px;
  justify-content: center;
  transition: all .2s linear;
  width: 22px;
  margin-left: 6px;
  display: flex;
  flex-direction: column;
  
}
.isDownUp{
  background-color: #4c57e9;
  color:#fff;
}
.mask{
  position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(7, 12, 20, 0.5);
}

`
const TooltipStyle = createGlobalStyle`

.upModal{

  .showPrivatePromptData{
    flex:1;
    white-space: break-spaces;
    overflow: auto;
  display: flex;
  flex-direction: column;
 code, p{
    white-space: break-spaces;
  }
}
code{
    white-space: break-spaces;
  }
.TextAreacontent{
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .acud-input-textarea-outer{
    flex: 1;
    justify-content: flex-start;
    textarea{
      /* height: 100% !important; */
      flex: 1;
    }
  }
}

  .acud-modal-title{
  text-align: center;
  }   
  .acud-modal-close{
    right: -32px;
    top: -26px;
  }
  .popCont{
  height: 50px;
  display: flex;
  justify-content: center;
  position: relative;
  button{
    margin-left: 10px;
    border-radius: 20px;
  }
  span{
    position: absolute;
    right: -40px;
    top: -12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background:#323343;
    border-radius: 4px;
    color:#fff!important;
    padding: 4px !important;
    cursor: pointer;
  }
  }
  .acud-modal-sm>.acud-modal-content{
  /* min-height: auto; */
}
.acud-modal-body{
    display: flex;
    flex-direction: column;
    overflow: auto;
    pre{
      flex: 1;
      overflow: auto;
    }
  }
.acud-modal-close-x{
    background: #323343;
    border-radius: 6px;
    height: 28px;
    margin-left: 0;
    width: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
.acud-modal-content{
  overflow: inherit;
  background: #e9ecea;
  background-image: radial-gradient(circle at 15% 69%,#e7ecf7 0,rgba(231,236,247,0) 37%),radial-gradient(circle at 3.4% 12%,rgba(245,237,241,.6) 0,rgba(245,237,241,0) 28%),radial-gradient(circle at 93% 11%,#e8ebea 0,hsla(160,7%,92%,0) 30%),linear-gradient(180deg,#f5f4f6,#e6ebf7);

}
.drag-content{
  height: 120px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .text{
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content:center;
    .top{
      font-weight: bold;
      color: #05073b;
    font-family: PingFangSC-Medium;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0;
    text-align: center;
    }
    .bot{
      span{
        color: blue;
        margin: 0 2px;
      }
    }
  }
}
.tips{
  color:#676c90;
  opacity: 0.7;
  margin-top: 10px;
  text-align: center;
  span{
    color: blue;
    cursor: pointer;
  }
}
.upFooter{
  display: flex;
  justify-content: space-around;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  button{
    background-image: linear-gradient(-52deg,#2e6ee7,#b89dfe 100%,#b89dfe 0);
    color: #fff;
    display: flex;
    font-family: PingFangSC-Medium;
    font-size: 13px;
    /* font-weight: 500; */
    height: 32px;
    justify-content: center;
    align-items: center;
    letter-spacing: 0;
    line-height: 30px;
    opacity: 1;
    text-align: center;
    width: 94px;
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    font-weight: 300;
    span{
      margin-right: 2px;
    }

  }
  .upBtn{

  }
  .sysl{
    margin-right: 10px;
    background: transparent;
    border:1px solid #8f91ac;
    color: #8f91ac;
  }

}
.tipsDemo{
  text-align: left;
  color: #929292;
  span{
    color: blue;
    cursor: pointer;
  }
}
}



.upLoads{
  .acud-upload-drag{
    display: none;
  }
  .acud-upload-list{
    width: 100%;
    height: 120px;
    /* height: 152px; */
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    .acud-upload-list-text-container{
      width: 98%;
    }
    .acud-upload-list-text-container:first-child{
      margin-top: 4px;
      align-self: flex-start;
    }

  }
 
}

/* .upFooter */
`



