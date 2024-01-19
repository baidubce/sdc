import { toast } from 'acud';
import wbfy from '../../assets/wbfy.png';
import faq from '../../assets/faq.png';
import bkwd from '../../assets/bkwd.png';
import qgfx from '../../assets/qgfx.png';
import ydlj from '../../assets/ydlj.png';
import nrcz from '../../assets/nrcz.png';
import dmbx from '../../assets/dmbx.png';
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

export const handleHistoryData = (val, tokens, uuid, localKey) => {
  // 存储历史信息
  const obj = storage.get(localKey) ? storage.get(localKey) : {};
  obj[uuid] = {
    list: val,
    tokens: tokens
  };
  if (Object.keys(obj).length > 100) {
    delete obj[Object.keys(obj)[0]];
  }
  storage.set(localKey, obj);
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
    "tag": "文本翻译",
    "icon": wbfy,
    "list": [
      {
        "title": "",
        "content": "将「昆虫是生态系统中不可或缺的一环，它们在传粉、分解有机物和控制害虫中发挥着重要作用。」翻译成英文"
      },
      {
        "title": "",
        "content": "将「太阳」翻译成意大利语"
      },
      {
        "title": "",
        "content": "检测「perfekt」是什么语言"
      },
      {
        "title": "",
        "content": "将德语「perfekt」翻译成西班牙语"
      }
    ]
  },
  {
    "tag": "FAQ",
    "icon": faq,
    "list": [
      {
        "title": "",
        "content": "#使用下面格式进行回答，每个问题和答案通过----分隔，只要返回回答# \n问题：「中国有多少个民族？」\n回答：「56个民族」\n---- \n问题：「中国国土一共有多少平方公里」 \n回答："
      },
      {
        "title": "",
        "content": "分析{有了AI技术的加持，让我的工作效率提升了一倍}的情感倾向，从「开心」、「悲伤」、「愤怒」中选择1个回答，将结果放到json字符串{\"result\":}的result中"
      }
    ]
  },
  {
    "tag": "百科问答",
    "icon": bkwd,
    "list": [
      {
        "title": "",
        "content": "什么是「人工智能」？"
      },
      {
        "title": "",
        "content": "描述一下「全球变暖」的「原因和影响」。"
      },
      {
        "title": "",
        "content": "介绍一下「互联网」的「起源和发展历程」。"
      },
      {
        "title": "",
        "content": "解释一下「DNA」的「结构和功能」。"
      },
      {
        "title": "",
        "content": "详细说明「金字塔」的「建造过程和用途」。"
      }
    ]
  },
  {
    "tag": "情感分析",
    "icon": qgfx,
    "list": [
      {
        "title": "",
        "content": "「心如碎石，无尽的悲伤深深地镶嵌在我的内心深处」表达了什么情感？"
      },
      {
        "title": "",
        "content": "「愤怒的火焰在我心中燃烧，愿正义之剑斩尽邪恶之源。」表达了什么情感？"
      },
      {
        "title": "",
        "content": "分析「今天是个晴朗的日子，阳光洒满了整个城市。我走在街上，突然发现地上有一只小猫咪，它颤巍巍地躲在角落里。我慢慢地靠近它，轻声呼唤。渐渐地，小猫咪走近了我，它的眼神里透着害怕又渴望的神采。我伸出手，小猫咪轻轻地舔了一下，然后躺在我的怀里。我感到无比的温暖和幸福，因为我知道，我刚刚收获了一份无条件的爱和快乐。」中「我」的心情，用4个字表达"
      }
    ]
  },
  {
    "tag": "阅读理解",
    "icon": ydlj,
    "list": [
      {
        "title": "",
        "content": "分析「深夜，我独自一人走在荒僻的街道上。突然，一只黑影从背后冲出，我被吓得心跳加速。原来是一只小狗，它尾巴摇摆着，舔了舔我的手。我松了口气，笑了出来，因为我意识到自己的胆怯是多余的。那只小狗陪伴着我回家，我不再感到害怕，反而觉得有了一份意外的安慰和温暖。」中我经历了什么事情，用一句简短的话总结。"
      },
      {
        "title": "",
        "content": "请用一句话简短的总结「作为“一带一路”国际经贸合作首个落地的实体平台项目，中哈连云港物流项目运营近10年，已实现对中亚地区主要站点全覆盖。过境货品种类从最初的汽车配件、电子元器件，扩大到建材、家居、机电、粮食、矿产、化工材料等众多领域。国际集装箱在连云港的过境时间也由原来4天以上缩短至1天以内。」"
      },
      {
        "title": "",
        "content": "请根据「蜜蜂是勤劳而重要的昆虫。它们以其高效的传粉能力，为植物繁衍提供了巨大帮助，同时也是蜜蜂蜜和蜂蜡的主要生产者。蜜蜂的社会结构复杂，分工明确，包括工蜂、雄蜂和蜂后。它们以舞蹈的方式传递信息，使得整个蜂群高度协调。然而，蜜蜂面临着生存威胁，如杀虫剂使用和栖息地丧失。因此，我们需要重视蜜蜂保护，以维护生态平衡和农作物的多样性。」，简短地总结蜜蜂的特点"
      }
    ]
  },
  {
    "tag": "内容创作",
    "icon": nrcz,
    "list": [
      {
        "title": "",
        "content": "写一篇流浪地球2的影评。主要内容： 1. 电影的简要介绍：开篇可以简单介绍电影的导演和主要演员，电影的背景和故事情节，让读者了解电影的基本信息。 2. 电影的剧情评价：对电影的故事情节、人物形象和情感表现等方面进行评价，表述自己的观感，但不要透露太多关键剧情。 3. 角色评价：评价电影中的主要角色表现。可以从角色的演技、塑造和发展等方面进行评价。 4. 电影的制作和技术评价：评价电影的制作质量，包括画面、音效、配乐等。 5. 主题探讨：如果电影有明显的主题或者探讨了某些社会问题，可以在评论中提及，并探讨其意义和价值。 6. 总体评价和推荐：最后总结自己的观感，表述电影的优缺点，给出自己的推荐或不推荐，也可给出一个总体评分。  注意事项： 行文风格要生动、有感染力 可以加入个人情感、思考或建议等，让读者更深入了解你的观点和思考。"
      },
      {
        "title": "",
        "content": "请以「我爱中国」写一首藏头诗"
      },
      {
        "title": "",
        "content": "帮我写一个简短的科幻故事，场景包含「星球」、「飞船」、「外星人」"
      },
      {
        "title": "",
        "content": "帮我写一首歌词，风格是「摇滚」，歌曲中需要包含「北京、三里屯、后海」"
      },
      {
        "title": "",
        "content": "我要通过「英语专业八级考试」，请帮我列一份详细的学习计划"
      }
    ]
  },
  {
    "tag": "代码编写",
    "icon": dmbx,
    "list": [
      {
        "title": "",
        "content": "使用Python代码生成一个长度为10的随机字符串。"
      },
      {
        "title": "",
        "content": "使用Java代码生成一个冒泡排序"
      },
      {
        "title": "",
        "content": "用SQL实现，从名为\"Customers\"的表中检索出所有订单金额大于100的客户信息，包括客户姓名(customer_name)、联系方式(customer_phone)和订单金额(order_amount)"
      },
      {
        "title": "",
        "content": "编写一个Java程序，实现一个简单的银行账户类，包括存款、取款和查询余额的功能。"
      }
    ]
  }
]