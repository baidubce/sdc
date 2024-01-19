import React, { Fragment, useEffect, useState } from 'react';
import { Select, Popover, Switch } from 'acud';
import { OutlinedWriteDocument, OutlinedQuestionCircle, OutlinedClose, OutlinedMenu } from 'acud-icon';
import Api from '../../api';
import './index.less';
const { Option } = Select;
export default (props) => {
  const { modalValue, setModalValue, getSywd, setIsShowMask, isShowMask, isSetSywd, changeContent, currentDom_h5 } = props;
  const [modelList, setModelList] = useState([]);
  const [descrip, setDescrip] = useState('');
  const [isCheck, setisCheck] = useState(true)

  const getModels = async () => {
    // 获取模型
    const res = await Api.getModels();
    if (res.err_no === 0) {
      setModelList(res.data);
      setModalValue(res.data[0].model);
      setDescrip(res.data[0].descrip);
    }
  };
  const handleChangeModals = value => {
    // 选择模型
    setModalValue(value);
    setDescrip(modelList.find(item => item.model === value).descrip);
  };
  const goFeadback = () => {
    // 功能反馈跳转
    window.open('https://console.bce.baidu.com/voc/#/voc');
  };

  useEffect(() => {
    getModels();
  }, []);

  const getSywds = (e) => {
    getSywd(e)
    setisCheck(e)
  }

  const GetSywd = () => {
    return <div className='sywd'>
      私域问答： <Switch checkedChildren="开" checked={isCheck} defaultChecked onChange={getSywds} unCheckedChildren="关" />
    </div>
  }

  const HasMask = () => {
    return <>
      <Popover defaultVisible content={<div className='popCont'>点击可开启或关闭私域问答<OutlinedClose onClick={e => setIsShowMask(false)} /></div>} trigger="click">
        <GetSywd />
      </Popover>
    </>
  }

  return (
    <Fragment>
      <div className="topBox">
        <div className="l">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" className="logo" />
          <div className="modelsBox">
            <div className="label">模型：</div>
            <Select defaultValue={modalValue} value={modalValue} style={{ width: 156 }} onChange={handleChangeModals}>
              {modelList && modelList.map((item, index) => (
                <Option value={item.model} key={index}>{item.name}</Option>
              ))}
            </Select>
            <Popover content={(<div style={{ width: '400px', wordBreak: 'break-all' }}>{descrip}</div>)} trigger="hover" placement="bottom">
              <OutlinedQuestionCircle className="descrip" />
            </Popover>
            {/* <HasMask /> */}

            {(isShowMask ? <HasMask /> : <GetSywd />)}
          </div>
        </div>
        <div className="r">
          <div className="fead" onClick={goFeadback}><OutlinedWriteDocument style={{ margin: "0 6px 2px 0", fontSize: "15px" }} />功能反馈</div>
          <div className="hisListIconH5" onClick={changeContent}>
            {currentDom_h5 === 'right' ? <OutlinedMenu style={{ margin: "0 6px 2px 0", fontSize: "15px" }} />
            : <OutlinedClose style={{ margin: "0 6px 2px 0", fontSize: "15px" }}/>}
          </div>
        </div>
      </div>
    </Fragment>
  )
}