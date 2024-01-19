package domain

import (
	"fmt"
	"strings"
)

// 输入菜名，返回基本菜谱信息
func PromptRecipeBaseInfo(recipeName string) []Message {
	var msgs []Message
	content := fmt.Sprintf("你是专业的厨师，请根据以下样例，生成菜品的基本信息。\n样例菜品: 地三鲜\n 基本信息:\n"+
		"{\"ChineseName\": \"地三鲜\",\"MainIngredients\": [\"土豆块\", \"紫茄子\", \"青椒\"],\"MainMethod\": \"大火翻炒\","+
		"\"Seasonings\": [\"食用油\", \"蚝油\", \"鸡粉\", \"白砂糖\", \"香油\", \"蒜末\", \"玉米生粉\", \"生抽\", \"老抽\", \"净水\", \"醋\"],"+
		"\"FoodReview\": \"香气扑鼻、味道鲜美、咸味、口感软糯\"}\n菜品: %s 基本信息:", recipeName)
	msgs = append(msgs, Message{Role: RoleUser, Content: content})
	return msgs
}

// 输入菜名，返回人工操作菜谱信息
func PromptRecipeUserStepInfo(recipeName string, recipeBaseInfo Recipe) []Message {
	var msgs []Message
	manMadeStep := `["第一步，大火热锅30秒后加入40克食用油", "第二步，大火热油50秒", "第三步，加入350克的长茄子条、50g猪肉沫",` +
		`"第四步，大火翻炒120秒", "第五步，在锅中加入3克豆瓣酱，30克红泡椒碎，15克姜末和30克蒜末", "第六步，大火翻炒60秒",` +
		`"第七步，加入5克老抽，8克生抽，20克糖和200克净水", "第八步，大火转中火煮制200秒",` +
		`"第九步，向锅中加入20克的醋和6克的玉米生粉将其混均匀", "第十步，向锅中继续20克食用油后大火翻炒60秒后出锅。"]`
	content := fmt.Sprintf("你是专业的厨师，请根据菜品基本信息，生成菜品的人工炒菜步骤。"+
		"食材、调料从基本信息中获取，且必须要有具体的重量。参考示例:\n"+
		"样例菜品: 鱼香茄子\n基本信息:\n食材:茄子，猪肉沫\n调料:食用油、红泡椒、姜、蒜、豆瓣酱、酱油、糖、醋、净水、玉米生粉\n"+
		"人工炒菜步骤:\n%s\n菜品: %s\n基本信息:\n食材:%s\n调料:%s\n人工炒菜步骤:\n", manMadeStep, recipeName,
		strings.Join(recipeBaseInfo.MainIngredients, "、"), strings.Join(recipeBaseInfo.Seasonings, "、"))
	msgs = append(msgs, Message{Role: RoleUser, Content: content})
	return msgs
}

// 输入菜名，人工炒菜步骤，返回标准菜谱菜谱信息 md 格式
func PromptRecipeStandardMDInfo(recipeName string, recipeInfo []string) []Message {
	var msgs []Message
	userRecipeStepDemo := []string{
		"第一步, 大火热锅30秒",
		"第二步, 加入食用油50克，土豆块200克",
		"第三步, 大火翻炒200秒",
		"第四步, 加入紫茄子200克",
		"第五步, 大火翻炒110秒",
		"第六步, 加入青椒100克",
		"第七步, 大火翻炒35秒",
		"第八步, 加入蚝油10克，鸡粉2克，白砂糖20克，香油5克，蒜末20克，玉米生粉5克生抽15克，老抽4克，净水40克，醋20克",
		"第九步, 高温翻炒20秒后出锅",
	}
	standardRecipeStepDemo := `|步骤序号|动作|火候|食材|时长|\n   
			| ---- | ---- | ---- | ----- | ---- |\n 
			|1|加热|1800w|⽆|30秒|\n
			|2|放食材|不加热|⻝⽤油50g、土豆块200g|1秒|\n  
			|3|开盖炒菜|1800w|⽆|200秒|\n  
			|4|放食材|1800w|茄子条200克|1秒|\n  
			|5|开盖炒菜|1800w|⽆|110秒|\n
			|6|放食材|1800w|青椒100克|1秒|\n
			|7|开盖炒菜|1800w|⽆|35秒|\n
			|8|放食材|1800w|蚝油10g、鸡粉2g、白砂糖20g、香油5g、蒜末20g、玉米生粉5g、生抽15g、老抽4g、净水40g、醋20g|1秒|\n
			|9|开盖炒菜|2000w|无|20秒|\n`
	content := "你是一个菜谱大师,任务是将人工菜谱翻译为标准菜谱。人工菜谱中的大火、中火、小火需要对应改成1800w/1000w/400w" +
		"参数要求:" +
		"动作：必须且只能选择一种：加热、放食材、开盖炒菜、盖上锅盖\n" +
		"时长：步骤类型如果是加热、开盖炒菜。则运行时长必填，其余是默认值:\"-\"\n" +
		"火候：可选值为| 不加热| 200w| 400w| 600w| 800w| 1000w| 1200w| 1400w| 1600w| 1800w| 2000w。\n" +
		"食材：不管食材还是调料都认为是食材，食材必须给出具体的重量。\n" +
		"具体参考示例处理\n示例: \n人工菜谱: " + strings.Join(userRecipeStepDemo, ";") +
		"\n标准菜谱:\n" + standardRecipeStepDemo + "\n人工菜谱: \n" + strings.Join(recipeInfo, ";") + "\n标准菜谱:\n"
	msgs = append(msgs, Message{Role: RoleUser, Content: content})
	return msgs
}

// 输入英文菜名，返回画图的prompt信息
func PromptRecipeImg(prompt string) (string, error) {

	return prompt, nil
}
