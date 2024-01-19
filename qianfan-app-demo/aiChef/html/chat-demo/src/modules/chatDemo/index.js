import React, { Fragment, useEffect, useState, useRef } from 'react';
import { toast, Timeline, Button, Table, DialogBox, Badge, Modal } from 'acud';
import './index.less';
import Api from '../../api';
import { menu, getChangeMenuList } from './constant';
import Top from './top';
import Empty from './empty';
import AiChefLoading from './aiChefLoading';
import banner from '../../assets/banner.png'
import md from './MarkDownIt'
import { eventSourcePolyfill } from './EventSourcePolyfill';
let eventSourceObj = null
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {


  const [showThree, setShowThree] = useState(false);

  const [modalValue, setModalValue] = useState('');

  const [updateDialog, setUpdateDialog] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentDom_h5, setCurrentDom_h5] = useState('right');

  const [versionInfo, setVersionInfo] = useState({});

  const [previewVisible, setPreviewVisible] = useState(false)

  const [isLoadingFoodImg, setIsLoadingFoodImg] = useState(false) // 菜品图片loading
  const [isLoadingFoodBaseInfo, setIsLoadingFoodBaseInfo] = useState(false) // 菜品基本信息loading
  const [isLoadingFoodLineStep, setIsLoadingFoodLineStep] = useState(false) // 菜品步骤信息loading
  const [isLoadingStandStep, setIsLoadingStandStep] = useState(false) // 表格loading


  const [isHasStandData, setIsHasStandData] = useState(false) // 是否已经有过表格数据

  const [recipeStepInfo, setRecipeStepInfo] = useState("") // 当前食物烹饪步骤序列化

  const [curFoodItemInfo, setCurFoodItemInfo] = useState(null) // 当前选中的食物菜单子项 

  const [curFoodImg, setCurFoodImg] = useState('') // 当前食物图片

  const [curFoodBaseInfo, setCurFoodBaseInfo] = useState({})// 当前食物基本信息

  const [curFoodStep, setCurFoodStep] = useState([]) // 当前食物烹饪步骤

  const [curFoodStandInfo, setCurFoodStandInfo] = useState('') // 当前食物表格信息

  const [curFoodMenuList, setCurFoodMenuList] = useState(getChangeMenuList(menu, 10) || []) // 当前菜单列表


  const curFoodStandInfoColumns = [
    {
      title: '步骤序号',
      dataIndex: 'number',
      key: 'number'
    },

    {
      title: '动作',
      dataIndex: 'stepType',
      key: 'stepType'
    },
    {
      title: '火侯',
      dataIndex: 'firePower',
      key: 'firePower'
    },

    // {
    //   title: '混合速度',
    //   dataIndex: 'mixSpeed',
    //   key: 'mixSpeed'
    // },
    // {
    //   title: '搅拌轴位置',
    //   dataIndex: 'mixShaftPosition',
    //   key: 'mixShaftPosition'
    // },
    // {
    //   title: '调料',
    //   dataIndex: 'seasoning',
    //   key: 'seasoning'
    // },

    {
      title: '食材',
      dataIndex: 'foodIngredient',
      key: 'foodIngredient',
      render: (v) => {
        return v.map(v2 => {
          return (v2.weight || v2.count) ? <span>{v2.name}<br /></span > : null
        })
      }
    },
    // {
    //   title: '操作描述',
    //   dataIndex: 'voiceDesc',
    //   key: 'voiceDesc'
    // }
    {
      title: '分量',
      dataIndex: 'foodIngredient',
      key: 'foodIngredient',

      render: (v) => {

        return v.map(v2 => {
          return (v2.weight || v2.count) ? <span>{v2.weight || v2.count}{v2.unit}<br /></span > : null
        })
      }
    },
    {
      title: '时长',
      dataIndex: 'runTime',
      key: 'runTime',
      render: (v) => <span>{v}秒</span>
    },
  ]

  const getVersionFn = async () => {
    // 获取版本号
    const res = await Api.getVersion();
    setVersionInfo(res);
  };




  const menuItemClick = async (v, i) => {

    if (isLoadingFoodImg || isLoadingFoodBaseInfo || isLoadingFoodLineStep || isLoadingStandStep) {
      return toast.error({
        message: "数据正在生成中...",
        duration: 3
      });
    }

    setShowThree(false)
    setCurFoodImg('')
    setCurFoodBaseInfo('')
    setCurFoodStep([])
    setCurFoodStandInfo('')
    setCurFoodItemInfo(null)
    setIsHasStandData(false)
    setIsLoadingStandStep(false)


    getErnieRecipeImg(v.EnglishName)


    getCurFoodBaseInfo(v.ChineseName)


    setCurFoodItemInfo(v)




  }



  const getErnieRecipeImg = async (recipeName) => {

    setIsLoadingFoodImg(true)

    let res = await Api.getErnieRecipeImg({
      recipeName
    })

    if (res.err_no == 0) {
      setCurFoodImg(res.data.data)
    }

    setIsLoadingFoodImg(false)
  }




  const getCurFoodBaseInfo = async (recipeName) => {

    setIsLoadingFoodBaseInfo(true)
    setIsLoadingFoodLineStep(true)

    try {

      let res = await Api.getErnieRecipe({
        recipeName,
        type: 'baseRecipeInfo',
        stream: false
      })


      let lastRes = null

      if (res.data.result.includes('```json')) {
        lastRes = res.data.result.substring(7, res.data.result.length - 3)
      } else {
        lastRes = res.data.result
      }


      if (res.err_no == 0) {
        setCurFoodBaseInfo(JSON.parse(lastRes))

        getCurFoodStep(recipeName, lastRes)


      } else {
        setCurFoodBaseInfo(false)
        setIsLoadingFoodLineStep(false)
      }


    } catch (error) {
      setIsLoadingFoodBaseInfo(false)
      setIsLoadingFoodLineStep(false)
      return toast.error({
        message: "数据解析错误",
        duration: 3
      });
    }
    setIsLoadingFoodBaseInfo(false)
  }


  const getCurFoodStep = async (recipeName, recipeBaseInfo) => {

    try {

      let res2 = await Api.getErnieRecipe({
        recipeName,
        type: 'manMadeRecipeStepInfo',
        stream: false,
        recipeBaseInfo
      })




      if (res2.err_no == 0) {
        setRecipeStepInfo(res2.data.result)

        let foodStepList = Array.isArray(res2.data.result) ? res2.data.result : JSON.parse(res2.data.result) || []

        let newFoodStepList = foodStepList.map(v => {
          // 使用正则表达式匹配第一个逗号
          const match = v.match(/^(.*?)(?:，|$)(.*)$/);
          let obj = {
            label: '',
            value: ''
          }
          if (match) {
            obj.label = match[1];
            obj.value = match[2];
          }

          return obj
        })


        setCurFoodStep(newFoodStepList)
        setShowThree(true)

      }

    } catch (error) {
      setIsLoadingFoodLineStep(false)

      return toast.error({
        message: "数据解析错误",
        duration: 3
      });
    }

    setIsLoadingFoodLineStep(false)

  }

  const contentMsgArr = []
  /**
   * 添加打印机效果
   */
  const typerEffect = (content, isEnd) => {


    // 清除最后一个字符下划线
    // setIsTypewriter(true)
    var renderSpeed = 2500
    if (isEnd) {
      renderSpeed = 1000
      // setIsShowStop(2);
      // setIsTypewriter(false)
    }
    contentMsgArr.push(...content.split(''))
    const typerEffectTimeout = setInterval(() => {

      // if (forceStop) {
      //   clearInterval(typerEffectTimeout);
      //   return
      // }

      if (contentMsgArr.length <= 0) {
        clearInterval(typerEffectTimeout);
        // setIsTypewriter(false)
      }
      var leftChar = contentMsgArr.shift()
      if (leftChar !== undefined) {

        setCurFoodStandInfo(e => {
          return e += leftChar
        })
      }
    }, Math.round(renderSpeed / content.length));
  }

  const getCurFoodStandInfo = async () => {

    setIsLoadingStandStep(true)

    let params = {
      recipeName: curFoodItemInfo.ChineseName,
      type: 'machineRecipeStepInfo',
      recipeStepInfo: recipeStepInfo,
      stream: true,
      responseType: 'stream'
    }

    eventSourcePolyfill({
      params,
      url: '/v1/ernie/recipe',
      messageCallback(message) {
        try {
          let res = JSON.parse(message)

          if (res.err_no == 0) {
            setIsLoadingStandStep(false)
            typerEffect(res.data.result, res.data.is_end)
            if (res.data.is_end) {
              eventSourceObj.close()
            }
          } else {
            setIsLoadingStandStep(false)

            toast.warning({
              message: res.msg,
              duration: 10
            });

            eventSourceObj.close()

          }



        } catch (error) {
          setIsLoadingStandStep(false)
          eventSourceObj.close()
        }
      }
    }).then((e) => {
      eventSourceObj = e
    }).catch(e => {
      // 处理错误
      toast.error({
        message: "数据解析失败，请重试",
        duration: 3
      });
      setIsLoadingStandStep(false)
      eventSourceObj.close()
    })



  }

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


  const setChangeMenu = () => {

    if (isLoadingFoodImg || isLoadingFoodBaseInfo || isLoadingFoodLineStep || isLoadingStandStep) {
      return toast.error({
        message: "数据正在生成中...",
        duration: 3
      });
    }

    setCurFoodMenuList(getChangeMenuList(menu, 10));
    setCurFoodItemInfo()
  }

  const updateDialogHandleCancel = () => {
    setUpdateDialog(false);
  };

  useEffect(() => {
    getVersionFn();
  }, [])


  const DomNotHasStandDataEmpty = <>
    <span className='notHasStandDataEmpty'>
      标准化制作步骤可根据「菜品制作步骤简介」进行，点击 &nbsp;</span>
    <Button onClick={getCurFoodStandInfo} type="primary">提炼标准化步骤</Button>
  </>

  const DomErrDataEmpty = <div className='errDataEmpty'>
    <span >生成失败</span>
    <br />您的账户下余额不足，可<a>&nbsp;提交工单&nbsp;</a>联系我们进行处理
  </div>


  const DomFoodDataEmpty = <>
    <span style={{ color: "#000000", display: "inline-block", marginBottom: "6px" }}>您可在左侧「菜品选择」栏中选择⽬标菜品</span>
    <br />选择⽬标菜品后，将⽣产对应的菜品介绍内容，包括菜品配图、菜品信息、菜品制作步骤
  </>

  return (
    <Fragment>
      <div className="chatDemo">
        <Top modalValue={modalValue} setModalValue={setModalValue} changeContent={changeContent} currentDom_h5={currentDom_h5} />
        <div className="mainBox">
          <div className="aiChefContent">
            <div className="forLeftHidden">

              <div className="leftBox" style={{ width: '230px' }}>
                <div className='AiChef-left'>
                  <div className="AiChef-top">
                    <h1>菜品选择</h1>
                    <span onClick={setChangeMenu}>换一换</span>
                  </div>
                  <div className="AiChef-list">
                    {
                      curFoodMenuList.map((v, i) =>
                        <div onClick={e => menuItemClick(v, i)} className={`item ${curFoodItemInfo?.ChineseName === v.ChineseName ? 'act' : ''}`} >
                          {v.ChineseName}
                        </div>
                      )
                    }

                  </div>

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
              </div>
            </div>
            <div className="rightBox">
              <div className="title">菜品介绍</div>


              {/* <AiChefLoading title={`正在生成${curFoodItemInfo?.ChineseName}菜品介绍`} loading={isLoadingAiChef}> */}

              {<div className="aiChefMainBox">
                <div className="dishBox">
                  <div className="dishImg">
                    <div className='secTitle'>菜品配图</div>
                    {/* <img src={curFoodImg} alt="" /> */}

                    <AiChefLoading title={`正在生成配图中`} loading={isLoadingFoodImg}>
                      {
                        curFoodImg.length > 50 ? <img className='curFoodImg' onClick={() => setPreviewVisible(true)} src={curFoodImg} alt="" />
                          : <Empty
                            MT='20'
                            emptyText={'暂无菜品配图'}
                          />

                      }
                    </AiChefLoading>

                  </div>


                  <div className="dishInfo">
                    <div className='secTitle'>菜品信息</div>

                    <AiChefLoading title={`正在生成${curFoodItemInfo?.ChineseName}菜品信息`} loading={isLoadingFoodBaseInfo}>
                      {
                        curFoodBaseInfo.ChineseName ?
                          <div className="info">

                            <div className="infoItem">
                              <div className="itemLabel">菜品名称:</div>
                              <div className="itemVal">{curFoodBaseInfo.ChineseName}</div>
                            </div>
                            <div className="infoItem">
                              <div className="itemLabel">主要食材:</div>
                              <div className="itemVal">{curFoodBaseInfo.MainIngredients?.map((v, i) => <span>{v}{i == curFoodBaseInfo.MainIngredients.length - 1 ? '' : '、'}</span>)}</div>
                            </div>
                            <div className="infoItem">
                              <div className="itemLabel">主要烹饪方法:</div>
                              <div className="itemVal">{curFoodBaseInfo.MainMethod}</div>
                            </div>
                            <div className="infoItem">
                              <div className="itemLabel">添加调料:</div>
                              <div className="itemVal">{curFoodBaseInfo.Seasonings?.map((v, i) => <span>{v}{i == curFoodBaseInfo.Seasonings.length - 1 ? '' : '、'}</span>)}</div>

                            </div>
                            <div className="infoItem">
                              <div className="itemLabel">菜品评价:</div>
                              <div className="itemVal">{curFoodBaseInfo.FoodReview}</div>
                            </div>
                          </div>
                          : <Empty
                            MT='0'
                            emptyText={'暂无菜品信息数据'}
                          />

                      }

                    </AiChefLoading>
                  </div>
                </div>
                <div className="makeBox" style={(curFoodStep.length > 0 || curFoodStandInfo.length > 0) ? { overflow: 'initial' } : {}}>
                  <div className="stepsBox">
                    <div className='secTitle'>菜品制作步骤简介</div>
                    <div className="steps">
                      <AiChefLoading title={`正在生成步骤简介中`} loading={isLoadingFoodLineStep}>
                        {
                          curFoodStep.length ?
                            <Timeline>
                              {
                                curFoodStep.map(v => <Timeline.Item label={v.label}>{v.value}</Timeline.Item>)
                              }
                            </Timeline>
                            : <Empty
                              MT='0'
                              emptyText={'暂无步骤简介数据'}
                            />

                        }
                      </AiChefLoading>
                    </div>
                  </div>
                  {showThree && <div className="standardStepsBox">
                    <div className='secTitle standardStepsBoxTitle' >标准化制作步骤
                      {isHasStandData && <Button onClick={getCurFoodStandInfo} type="primary">重新提炼标准化步骤</Button>}
                    </div>
                    <div className="tableBox">

                      <AiChefLoading title='正在提炼标准化步骤' loading={isLoadingStandStep}>

                        {
                          curFoodStandInfo.length > 0 ?
                            <div className="tableContent contentAiChef">

                              <div className='msg' dangerouslySetInnerHTML={{ __html: (md.render(curFoodStandInfo)).replace(/<\/p>\s*$/, '</p>') }}></div>

                              {/* <Table dataSource={curFoodStandInfo.makeSteps} columns={curFoodStandInfoColumns} pagination={false} /> */}


                            </div>

                            : <Empty
                              MT='20'
                              emptyText={
                                <div style={{ textAlign: 'center' }} className='emptyText'>
                                  {DomNotHasStandDataEmpty}</div>}
                            />
                        }

                      </AiChefLoading>


                    </div>
                  </div>}
                </div>
              </div>

              }

              {/* </AiChefLoading> */}
            </div>
          </div>
        </div>
      </div>
      <DialogBox
        className='dialog'
        title="版本更新"
        content={<>{versionInfo.descrip}</>}
        visible={updateDialog}
        onOk={updateDialogHandleOk}
        onCancel={updateDialogHandleCancel}
      >
      </DialogBox>

      <Modal
        visible={previewVisible}
        title={"预览"}
        width={'600px'}
        className="image-preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="" style={{ width: '100%' }} src={curFoodImg} />
      </Modal>
    </Fragment>
  );
};
