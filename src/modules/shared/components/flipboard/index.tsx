import {useEffect, useState} from "react";


export const Flipboard = () => {
    const [row,setRow] =  useState(6);
    const [col,setCol] = useState(40)
    const [width,setWidth] = useState(0)
    const [align,setAlign] = useState('left')

    useEffect(() => {
          setTimeout(() => {
              // const width =  document.getElementById('flipBoardMain').offsetWidth;
              // document.getElementById('mainTextArea').style.width = width + 'px';
              const colWidth =  document.getElementById('flipInput-col00').offsetWidth;

              // document.getElementById('mainTextArea').style.letterSpacing ='15px';
              // document.getElementById('mainTextArea').style.fontSize ='15px';
          },10)
    },[])
    const onChnage = (e) => {
        // console.log(e.target.value.charCodeAt(4))
        // console.log(e.target.value.charAt(4))
        console.log(document.getElementById("mainTextArea").selectionStart);
        let colIn = 0;
        let rowIn = 0;

        for(let rowI = 0;rowI < row;rowI++) {
            for (let colI = 0; colI < col; colI++) {
                if(document.getElementById('flipInput-col'+ rowI + colI)) {
                    document.getElementById('flipInput-col'+ rowI + colI).value = ''

                }
            }
        }
        if(align === 'left') {
            for(let textl = 0 ; textl < e.target.value.length;textl++) {
                if(e.target.value.charCodeAt(textl) && e.target.value.charCodeAt(textl) === 10 || textl === (41 * (rowIn + 1) )) {
                    rowIn++;
                    colIn = 0;
                    if( document.getElementById('flipInput-col'+ rowIn + 0)) {
                        document.getElementById('flipInput-col'+ rowIn + 0).value = e.target.value.charAt(textl).toUpperCase() || ''
                    }

                } else {
                    if(document.getElementById('flipInput-col'+ rowIn + colIn)) {
                        document.getElementById('flipInput-col'+ rowIn + colIn).value = e.target.value.charAt(textl).toUpperCase() || ''

                    }
                    colIn++;
                }

            }


        }
        if(align === 'right'){

            const strArr =  e.target.value.split('\n');
            console.log(strArr);
            for(let i=0 ;i < strArr.length;i++) { // row
                  for(let j = col; j> 0;j--) { //col
                      if(j > (col - strArr[i].length)) {
                          let m = 0;
                          for(let b = (col - strArr[i].length); b < 40;b++) {
                              if( document.getElementById('flipInput-col'+ i + b)) {
                                  document.getElementById('flipInput-col'+ i + b).value = strArr[i].charAt(m).toUpperCase()

                              }
                              m++;

                          }
                      }
                  }
            }
        }







    }


    const  getCursorLoc = () => {
        // Get the location of the box that should be in focus based on cursor position
        let text = document.getElementById('mainTextArea').value
        let cursorIndices = [document.getElementById('mainTextArea').selectionStart, document.getElementById('mainTextArea').selectionEnd]

        let indices = []
        for (let cursorIndex of cursorIndices)
        {
            let preText = text.slice(0, cursorIndex)
            let preLines = preText.split('\n')
            let lineIndex = preLines.length - 1
            let innerIndex = preLines[lineIndex].length
            indices.push(lineIndex)
            indices.push(innerIndex)
        }

        return indices
    }


    const onKeyChange = (event) => {
        const getPos =  getCursorLoc();
        if (event.key === "Enter" && getPos[0] === 5) {
            console.log('Two Many Line')
            event.preventDefault();
        }
        if(event.key === "Enter") {
            let stopNewLine = false;
            for(let i = 0;i < col;i++) {
                const value = document.getElementById('flipInput-col' + (row-1) + i).value;
                if(value) {
                    stopNewLine =  true;
                }
            }
            if(stopNewLine) {
                console.log('stopline')
                event.preventDefault();
            }

        }

    }

    return (
        <>

            <button onClick={() => setAlign('left')}>Left</button>
            <button onClick={() => setAlign('right')}>Right</button>
                <div className={'flipBoardMain'} id={'flipBoardMain'}>
            <div>
            {
                [...Array(row).keys()].map((rowIndex) => {
                    return (
                        <>
                            <div className={'flipInput-line'}>
                                {
                                    [...Array(col).keys()].map((colIndex) => {
                                        return (
                                            <>

                                                <input
                                                    className={'flipInput-col'}
                                                    id={`flipInput-col${rowIndex}${colIndex}`}
                                                    contentEditable={true}
                                                    readOnly={true}
                                                    maxLength={1}/>
                                            </>
                                        )
                                    })
                                }

                            </div>

                        </>
                    )
                })


            }
            </div>
                    <textarea rows={6} cols={40} id={'mainTextArea'} style={{textAlign:`${align}`}} maxLength={(41 * 6)}  onKeyPress={onKeyChange} onChange={onChnage}></textarea>
            </div>


        </>
    )
}
