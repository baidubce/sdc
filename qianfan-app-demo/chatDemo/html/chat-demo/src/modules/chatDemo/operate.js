import React, { Fragment, useEffect, useState } from 'react';
import { Button, Input, toast, Modal, DialogBox } from 'acud';
import { OutlinedEditingSquare, OutlinedCopy, OutlinedRefresh, OutlinedDelete } from 'acud-icon';
import Api from '../../api';
import { copy, copy2 } from './constant';
import './index.less';
export default (props) => {
  const { item, index, messageList, setMessageList, reqFn, setIsScroll } = props;
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [textValueModal, setTextValueModal] = useState('');
  const [isShowDelModal1, setIsShowDelModal1] = useState(false);

  const operateFn = type => {
    // 操作函数（编辑、复制、刷新、删除）
    let messageList_copy = [...messageList];
    if (type === 'edit') {
      setIsScroll(false);
      setIsShowEditModal(true);
      setTextValueModal(item.content);
    }
    if (type === 'copy') {
      copy2(item.content, () => {
        toast.success({
          message: '复制成功',
          duration: 3
        });
      })
    }
    if (type === 'refresh') {
      // 获取当前重试的消息对象，先删除、后重新请求
      let currentRefMsg = { role: 'user', content: item.role === 'user' ? messageList_copy[index].content : messageList_copy[index - 1].content };
      item.role === 'user' ? messageList_copy.splice(index, 2) : messageList_copy.splice(index - 1, 2);
      messageList_copy.push(currentRefMsg);
      setMessageList([...messageList_copy]);
      reqFn([...messageList_copy]);
    }
    if (type === 'delete') {
      setIsScroll(false);
      setIsShowDelModal1(true);
    }
  }
  const handleOk = () => {
    let messageList_copy = [...messageList];
    messageList_copy[index].content = textValueModal;
    setMessageList([...messageList_copy]);
    setIsShowEditModal(false);
  };
  const handleCancel = () => {
    setIsShowEditModal(false);
  };
  const onChangeModal = (e) => {
    const value = e.target.value;
    setTextValueModal(value);
  };
  const delModalHandleOk1 = () => {
    let messageList_copy = [...messageList];
    item.role === 'user' ? messageList_copy.splice(index, 2) : messageList_copy.splice(index - 1, 2);
    setMessageList([...messageList_copy]);
    setIsShowDelModal1(false);
  };

  const delModalHandleCancel1 = () => {
    setIsShowDelModal1(false);
  }

  return (
    <Fragment>
      <div className="operationBox" style={{ right: item.content.length < 80 && item.role == "assistant" ? 'auto' : '0px' }}>
        <div className='operateIcon' onClick={() => operateFn('edit')}><OutlinedEditingSquare />&nbsp;编辑</div>
        <div className='operateIcon' onClick={() => operateFn('copy')}><OutlinedCopy />&nbsp;复制</div>
        <div className='operateIcon' onClick={() => operateFn('refresh')}><OutlinedRefresh />&nbsp;重试</div>
        <div className='operateIcon' onClick={() => operateFn('delete')}><OutlinedDelete />&nbsp;删除</div>
      </div>
      <Modal
        className="editModal"
        title="编辑"
        size="normal"
        visible={isShowEditModal}
        onOk={handleOk}
        onCancel={handleCancel}>
        <div className="modalContent">
          <Input.TextArea
            allowClear={false}
            autoSize={{ minRows: 8, maxRows: 20 }}
            value={textValueModal}
            onChange={onChangeModal}
          />
        </div>
      </Modal>
      <DialogBox
        className='dialog'
        title={`确定要删除该气泡吗`}
        content={<>删除后数据不可恢复</>}
        visible={isShowDelModal1}
        onOk={delModalHandleOk1}
        onCancel={delModalHandleCancel1}
      >
      </DialogBox>
    </Fragment>
  )
}