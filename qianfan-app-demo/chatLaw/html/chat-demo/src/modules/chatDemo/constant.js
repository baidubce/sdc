import { toast } from 'acud';
import wbfy from '../../assets/wbfy.png';
import faq from '../../assets/faq.png';
import bkwd from '../../assets/bkwd.png';
import qgfx from '../../assets/qgfx.png';
export const guid = () => {
  // 生成uuid方法
  return Date.now().toString() + '-' + 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const storage = {
  // 本地存储方法「localStorage」
  set(key, value) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },
  get(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch (err) {
      return data;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
}

export const handleHistoryData = (val, tokens, uuid) => {
  // 存储历史信息
  const obj = storage.get('historySationData') ? storage.get('historySationData') : {};
  obj[uuid] = {
    list: val,
    tokens: tokens
  };
  if (Object.keys(obj).length > 100) {
    delete obj[Object.keys(obj)[0]];
  }
  storage.set('historySationData', obj);
}

export const copy = (str, fn) => {
  // 复制
  if (str?.trim() == '') {
    toast.error({
      message: '无内容',
      duration: 3
    });
    return
  }
  navigator && navigator.clipboard && navigator.clipboard.writeText(str).then(res => {
    fn && fn()
  }).catch(err => {
    console.log(err)
  })
}

export function copy2(content, fn) {
  // 创建输入框元素
  const input = document.createElement('textarea');//不会保留文本格式
  //如果要保留文本格式，比如保留换行符，或者多行文本，可以使用  textarea 标签，再配和模板字符串 ` `
  //const input = document.createElement('textarea')
  // 将想要复制的值
  input.value = content;
  // 页面底部追加输入框
  document.body.appendChild(input);
  // 选中输入框
  input.select();
  // 执行浏览器复制命令
  document.execCommand('Copy');
  // 弹出复制成功信息
  //this.$message.success('复制成功');
  // 复制后移除输入框
  input.remove();
  fn && fn()
}

export const down = (o) => {
  // 下载
  const { content, name, suffix, fn } = o;
  var eleLink = document.createElement('a');
  eleLink.download = name + suffix;
  eleLink.style.display = 'none';
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
  fn && fn();
}

export const prompts = [
  {
    "tag": "法律咨询",
    "icon": bkwd,
    "list": [
      {
        "title": "",
        "content": "我2021年买的房，是按揭的网签也签了，房贷也交了三年了，现在开发商宣布破产了房子还属于自己的吗？",
      },
      {
        "title": "",
        "content": "上海教练车处理违章还需要教练证吗？",
      },
      {
        "title": "",
        "content": "学生在舞蹈课时无意打碎玻璃要赔钱吗？",
      },
      {
        "title": "",
        "content": "民营养老院法人和经营者不是同一人，床位补助应该属于经营者还是法人，这方面有没有相关的法律规定",
      },
      {
        "title": "",
        "content": "给别人但保，现以走质行程序，但法院没去值行被告才财产。法院却把但保人的银行卡给冻结怎么样才能拿出卡上的钱？",
      },
    ]
  },
  {
    "tag": "案件审理",
    "icon": wbfy,
    "list": [
      {
        "title": "",
        "content": "审理查明：2019年1月12日0时许，被告人邵金成伙同耿某龙（另案处理）在沭阳县沭城街道一代佳人娱乐会所大厅，随意殴打被害人鲍某、姜某，致二人受伤。经鉴定，鲍某眼鼻部损伤致双侧鼻骨、左侧上颌骨额突及鼻中隔骨折构成轻伤二级；姜某左眼部及右踝部的损伤构成轻微伤。\n被告人邵金成归案后能如实供述自己的罪行；自愿认罪认罚。"
      },
      {
        "title": "",
        "content": "审理查明：李某在M书店经营的网络店铺付款22172元购买书籍，因该电商平台关联的银行账户额度所限，经与店铺客服沟通后，李某通过平台付款10172元，向店铺客服赵某微信转账12000元。2019年8月25日李某告知赵某书单有变化，待确定后再发货，赵某表示同意。\n后双方对购买商品品种和数量做了变更，交易价格变更为1223元。M书店将通过平台支付的10172元退还给李某，但通过微信支付给赵某的款项扣除交易价款后尚有10777元未退回。多次要求退款无果，李某将M书店诉至法院，请求退还购书款。"
      },
      {
        "title": "",
        "content": "审理查明：2012年5月1日，原告孙银山在被告南京欧尚超市有限公司江宁店（简称欧尚超市江宁店）购买“玉兔牌”香肠15包，其中价值558.6元的14包香肠已过保质期。孙银山到收银台结账后，即径直到服务台索赔，后因协商未果诉至法院，要求欧尚超市江宁店支付14包香肠售价十倍的赔偿金5586元。"
      }
    ]
  },
  {
    "tag": "情景问答",
    "icon": faq,
    "list": [
      {
        "title": "",
        "content": "根据我国证券法的规定，经纪类证券公司不得经营下列业务?\n证券承销业务\n请给出详细的推理过程之后再给出答案。"
      },
      {
        "title": "",
        "content": "某公司因合同纠纷的诉讼时效问题咨询律师。关于律师的答复，下列选项是正确的?\n诉讼时效届满，当事人一方向对方当事人作出同意履行义务意思表示的，不得再以时效届满为由进行抗辩\n请给出详细的推理过程之后再给出答案。"
      },
      {
        "title": "",
        "content": "刘某涉嫌故意伤害，在审查起诉阶段，检察院认为证据不足，遂作出不起诉决定。如果被害人不服检察院的不起诉决定，依法可以采取下列诉讼行为?\n可以直接向法院起诉\n请给出详细的推理过程之后再给出答案。"
      },
      {
        "title": "",
        "content": "达重公司对扣押行为非常不满，指使技术员周某侵入甲海关计算机信息系统，造成信息系统不能正常运行，甲市某区公安局派出所对周某作出罚款2000元的处罚决定。对此，下列说法正确吗？\n周某可以向某区公安局申请行政复议\n请给出详细的推理过程之后再给出答案。"
      },
      {
        "title": "",
        "content": "关于信用卡诈骗罪，说法正确吗？\n冒用他人的信用卡诈骗较大数额钱财的，应认定为诈骗罪\n请给出详细的推理过程之后再给出答案。"
      }
    ]
  },
  {
    "tag": "法考题库",
    "icon": qgfx,
    "list": [
      {
        "title": "",
        "content": "请选择正确答案：\n甲、乙两公司签订了一份家具买卖合同，因家具质量问题，甲公司起诉乙公司要求更换家具并支付违约金3万元。法院经审理判决乙公司败诉，乙公司未上诉。之后，乙公司向法院起诉，要求确认该家具买卖合同无效。对乙公司的起诉，法院应采取下列哪一处理方式？ \nA.予以受理 \nB.裁定不予受理 \nC.裁定驳回起诉 \nD.按再审处理",
      },
      {
        "title": "",
        "content": "请选择正确答案：\n马克思曾说：\"社会不是以法律为基础，那是法学家的幻想。相反，法律应该以社会为基础。法律应该是社会共同的，由一定的物质生产方式所产生的利益需要的表现，而不是单个人的恣意横行。\"根据这段话所表达的马克思主义法学原理，下列哪一选项是正确的？ \nA.强调法律以社会为基础，这是马克思主义法学与其他派别法学的根本区别 \nB.法律在本质上是社会共同体意志的体现 \nC.在任何社会，利益需要实际上都是法律内容的决定性因素 \nD.特定时空下的特定国家的法律都是由一定的社会物质生活条件所决定的",
      },
      {
        "title": "",
        "content": "请选择正确答案：\n以下问题应给予肯定回答的是: \nA. 黄某从孙某处偷了一个移动硬盘，放到信托商店寄卖，赵某从信托商店里购买了硬盘，孙某是否有权无条件要求赵某返还原物 \nB. 杨某从胡某处购买了一台彩电，杨某将彩电转卖给林某，杨某一直未向胡某付款。胡某是否有权要求林某返还原物 \nC. 钱某将MP3借给李某使用，费某以为MP3是李某之物，要求购买，李某将MP3卖给了费某，钱某是否有权要求费某返还MP3 \nD. 郭某从阎某处购买了一块天然红宝石，郭某一直未支付价款，郭某突然脑溢血死亡.郭某的女儿郭茜继承了该宝石，阎某是否有权要求郭茜返还宝石",
      }
    ]
  }
]