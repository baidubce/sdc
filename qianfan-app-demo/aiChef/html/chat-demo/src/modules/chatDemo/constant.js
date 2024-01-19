import { toast } from 'acud';
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

export const menu = [
  { "ChineseName": "地三鲜", "EnglishName": "Stir-Fried Potatoes, Eggplants, and Bell Peppers" },
  { "ChineseName": "大葱炒鸡蛋", "EnglishName": "Scrambled Eggs with Green Onions" },
  { "ChineseName": "红烧肉", "EnglishName": "Braised Pork Belly" },
  { "ChineseName": "花菜炒肉片", "EnglishName": "Cauliflower Stir-Fried with Pork Slices" },
  { "ChineseName": "黄瓜炒肉", "EnglishName": "Stir-Fried Cucumber with Pork" },
  { "ChineseName": "回锅肉", "EnglishName": "Twice-Cooked Pork" },
  { "ChineseName": "辣椒炒肉", "EnglishName": "Spicy Pepper Stir-Fried Pork" },
  { "ChineseName": "麻婆豆腐", "EnglishName": "Mapo Tofu" },
  { "ChineseName": "芹菜牛肉丝", "EnglishName": "Celery Beef Strips" },
  { "ChineseName": "芹菜香干炒肉丝", "EnglishName": "Celery and Dried Bean Curd Stir-Fried with Shredded Pork" },
  { "ChineseName": "清炒苦瓜", "EnglishName": "Stir-Fried Bitter Gourd" },
  { "ChineseName": "清炒油麦菜", "EnglishName": "Stir-Fried Oilseed Rape (Chinese Broccoli)" },
  { "ChineseName": "肉丝炒海鲜菇", "EnglishName": "Stir-Fried Meat Strips with Seafood Mushrooms" },
  { "ChineseName": "山药炒黑木耳", "EnglishName": "Stir-Fried Chinese Yam with Black Fungus" },
  { "ChineseName": "蒜蓉西兰花", "EnglishName": "Garlic Broccoli" },
  { "ChineseName": "土豆片炒肉", "EnglishName": "Stir-Fried Potato Slices with Pork" },
  { "ChineseName": "西红柿炒蛋", "EnglishName": "Stir-Fried Tomatoes with Eggs" },
  { "ChineseName": "鱼香茄子", "EnglishName": "Fish-Flavored Eggplant" },
  { "ChineseName": "鱼香肉丝", "EnglishName": "Fish-Flavored Shredded Pork" },
  { "ChineseName": "鱼香虾球", "EnglishName": "Fish-Flavored Shrimp Balls" },
  { "ChineseName": "宫保鸡丁", "EnglishName": "Kung Pao Chicken" },
  { "ChineseName": "回锅牛肉", "EnglishName": "Double-Cooked Beef" },
  { "ChineseName": "麻辣香锅", "EnglishName": "Spicy Hot Pot" },
  { "ChineseName": "京酱肉丝", "EnglishName": "Shredded Pork in Beijing Sauce" },
  { "ChineseName": "醋溜白菜", "EnglishName": "Sweet and Sour Cabbage" },
  { "ChineseName": "蚝油芥兰", "EnglishName": "Oyster Sauce Kai-lan" },
  { "ChineseName": "夫妻肺片", "EnglishName": "Sliced Beef and Ox Tongue in Chili Sauce" },
  { "ChineseName": "家常豆腐", "EnglishName": "Home-Style Tofu" },
  { "ChineseName": "三杯鸡", "EnglishName": "Three-Cup Chicken" },
  { "ChineseName": "麻辣烫", "EnglishName": "Spicy Hot Pot" },
  { "ChineseName": "辣子鸡", "EnglishName": "Spicy Chicken with Peanuts" },
  { "ChineseName": "香辣蟹", "EnglishName": "Spicy Crab" },
  { "ChineseName": "红烧鱼块", "EnglishName": "Braised Fish Fillets" },
  { "ChineseName": "葱爆羊肉", "EnglishName": "Scallion Lamb Stir-Fry" },
  { "ChineseName": "干锅牛肉", "EnglishName": "Dry Pot Beef" },
  { "ChineseName": "芥兰炒虾仁", "EnglishName": "Kai-lan Stir-Fried with Shrimp" },
  { "ChineseName": "腊肠炒饭", "EnglishName": "Chinese Sausage Fried Rice" },
  { "ChineseName": "宫保虾球", "EnglishName": "Kung Pao Shrimp Balls" },
  { "ChineseName": "辣炒鳝段", "EnglishName": "Spicy Stir-Fried Eel" },
  { "ChineseName": "红烧茄子", "EnglishName": "Braised Eggplant" },
  { "ChineseName": "香辣排骨", "EnglishName": "Spicy Spare Ribs" },
  { "ChineseName": "蜜汁烤鸡翅", "EnglishName": "Honey Glazed Chicken Wings" },
  { "ChineseName": "蚝油牛河", "EnglishName": "Oyster Sauce Beef Flat Rice Noodles" },
  { "ChineseName": "香菇炖鸡", "EnglishName": "Chicken Stew with Mushrooms" },
  { "ChineseName": "酸菜鱼", "EnglishName": "Sour Cabbage Fish Hot Pot" },
  { "ChineseName": "豆腐鲫鱼汤", "EnglishName": "Tofu and Crucian Carp Soup" },
  { "ChineseName": "金针菇炒牛肉", "EnglishName": "Stir-Fried Beef with Enoki Mushrooms" },
  { "ChineseName": "糖醋排骨", "EnglishName": "Sweet and Sour Spare Ribs" }
]

export const getChangeMenuList = (arr, count) => {


  // 复制数组
  const copyArray = [...arr];

  // 洗牌算法，打乱数组顺序
  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
  }

  // 返回数组的前count个元素
  return copyArray.slice(0, count);

}