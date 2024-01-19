/* eslint-disable import/no-anonymous-default-export */
import React, { Fragment, useEffect, useState } from 'react';
import { Select ,Alert} from 'acud';
import { OutlinedWriteDocument, OutlinedClose, OutlinedMenu } from 'acud-icon';
import './index.less';
import appLogo from '../../assets/appLogo.png';
const { Option } = Select;
export default (props) => {
  const { changeContent, currentDom_h5 } = props;

  const goFeadback = () => {
    // 功能反馈跳转
    window.open('https://console.bce.baidu.com/voc/#/voc');
  };



  return (
    <Fragment>
      <div className="topBox">
        <div className="l">
          {/* <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" className="logo" /> */}
          <div className="logoAndName">
            <img src={appLogo} alt="" />
            <div className="appName">AI大厨</div>
          </div>
          <div className="modelsBox afterModel">
            <div className="label">推理模型：</div>
            <Select defaultValue="ERNIE-Bot 4.0" value="ERNIE-Bot 4.0" style={{ width: 156 }} disabled>
                <Option value="ERNIE-Bot 4.0" key={1}>ERNIE-Bot 4.0</Option>
            </Select>
          </div>
          <div className="modelsBox">
            <div className="label">绘图模型：</div>
            <Select defaultValue="Stable-Diffusion-XL" value="Stable-Diffusion-XL" style={{ width: 156 }} disabled>
                <Option value="Stable-Diffusion-XL" key={1}>Stable-Diffusion-XL</Option>
            </Select>
          </div>
          <div className="alertBox">
            <Alert message="每次生成菜品介绍和提炼标准化步骤需消耗Ernie-Bot-4 tokens" type="info" showIcon />
          </div>
        </div>
        <div className="r">
          <div className="fead" onClick={goFeadback}><OutlinedWriteDocument style={{ margin: "0 6px 2px 0", fontSize: "15px" }} />功能反馈</div>
          <div className="hisListIconH5" onClick={changeContent}>
            {currentDom_h5 === 'right' ? <OutlinedMenu style={{ margin: "0 6px 2px 0", fontSize: "15px" }} />
              : <OutlinedClose style={{ margin: "0 6px 2px 0", fontSize: "15px" }} />}
          </div>
        </div>
      </div>
    </Fragment>
  )
}