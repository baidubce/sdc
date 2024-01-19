import React, { Fragment, useEffect, useState } from 'react';
import { OutlinedWriteDocument, OutlinedClose, OutlinedMenu } from 'acud-icon';
import './index.less';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { changeContent, currentDom_h5 } = props;


  const goFeadback = () => {
    // 功能反馈跳转
    window.open('https://console.bce.baidu.com/voc/#/voc');
  };

  // useEffect(() => {
  //   getModels();
  // }, []);

  return (
    <Fragment>
      <div className="topBox">
        <div className="l">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" className="logo" />
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