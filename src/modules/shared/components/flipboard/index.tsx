import {useEffect, useState} from "react";


export const Flipboard = () => {
    const [row,setRow] =  useState(6);
    const [col,setCol] = useState(40)
    const [width,setWidth] = useState(0)

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


        //
        // for(let textl = 0 ; textl < e.target.value.length;textl++) {
        //     if(e.target.value.charCodeAt(textl) && e.target.value.charCodeAt(textl) === 10 || textl === (41 * (rowIn + 1) )) {
        //         rowIn++;
        //         colIn = (col%2);
        //         console.log(colIn)
        //         if( document.getElementById('flipInput-col'+ rowIn + (col/2  + 1))) {
        //             document.getElementById('flipInput-col'+ rowIn + (col/2  + 1)).value = e.target.value.charAt(textl).toUpperCase() || ''
        //         }
        //
        //     } else {
        //         if(document.getElementById('flipInput-col'+ rowIn + colIn)) {
        //             document.getElementById('flipInput-col'+ rowIn + colIn).value = e.target.value.charAt(textl).toUpperCase() || ''
        //
        //         }
        //         colIn++;
        //     }
        //
        // }

        // for(let rowI = 0;rowI < row;rowI++) {
        //     for (let colI = 0; colI < col; colI++) {
        //         if(e.target.value.charCodeAt(4) && e.target.value.charCodeAt(4) === 107) {
        //             break;
        //         }
        //
        //
        //     }
        // }
    }
    return (
        <>
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
                    <textarea rows={6} cols={40} id={'mainTextArea'} maxLength={(41 * 6)} onChange={onChnage}></textarea>
            </div>


        </>
    )
}
