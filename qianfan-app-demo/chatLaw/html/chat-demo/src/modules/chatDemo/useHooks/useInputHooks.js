import React, { useState, } from 'react';

export default () => {

  const [isComposing, setIsComposing] = useState(false);

  const onCompositionStart = () => {
    // 

    setIsComposing(true)

  }

  const onCompositionEnd = () => {

    setTimeout(() => {
      setIsComposing(false)
    }, 0);

  }


  return [isComposing, onCompositionStart, onCompositionEnd]

}

// const onKeyDownFn = (event) => {
// if (event.key === 'Enter' && !isComposing) {
//   if (event.metaKey || event.ctrlKey || event.altKey) {
//     set_inputVal(prevValue => prevValue + '\n');
//   } else {
//     event.preventDefault();
//     btnClick()
//   }
// }
// }