async function sendMessageToAssistant(requestData) {
  console.log('requestData: ', requestData);
  try {
    const apiUrl = `/v1/ernie/recipeImg`;
    // const requestData = {
    //   messages: [
    //     { role: 'user', content: message }
    //   ],
    //   stream: true  // 启动流模式
    // };

    // 输出请求数据
    let response = null

    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      // signal: controller.signal
    });

    console.log('response: ', response);



    // 输出 fetch 请求的响应

    if (!response.ok) {
      throw new Error('Failed to fetch response from the API.');
    }

    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('Failed to get the reader from the response body.');
    }



    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      const chunk = new TextDecoder('utf-8').decode(value);
      console.log('chunk: ', chunk);

      // yield chunk


    }
  } catch (error) {
    console.log('error: ', error);

  }




}

export { sendMessageToAssistant };