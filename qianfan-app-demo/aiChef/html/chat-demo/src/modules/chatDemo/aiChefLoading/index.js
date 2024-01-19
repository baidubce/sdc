import React from 'react'
import { Loading } from 'acud';
import './index.less'

export default function LoadIng({ title, loading, children }) {
  return (
    <Loading loading={loading} indicator={
      <div className='LoadingAiChef' style={{ display: 'flex' }}>
        <div className="title">{title}</div>
        <div className="dotLoadig" style={{ marginLeft: '16px' }}>
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>
    }>
      {children}
    </Loading>
  )
}