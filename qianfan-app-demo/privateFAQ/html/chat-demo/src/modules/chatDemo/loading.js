/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import './index.less';
import assistant from '../../assets/assistant.png';

export default (props) => {
  const { isShowStop } = props
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "16px" }}>
      <img src={assistant} alt="" style={{ width: "40px", height: "40px" }} />
      <div className="loadingBox-chatdemo">
        {isShowStop === 1 && (<div className="dotLoadig">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>)}
        {isShowStop === 0 && (<div className="alreadyStop">已停止生成</div>)}
      </div>
    </div>
  );
}
