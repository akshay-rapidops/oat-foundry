import React, {useEffect, useState} from "react";
import GridLayout from "react-grid-layout";
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'react-draggable';
export const Flipboard = () => {
    const [row,setRow] =  useState(6);
    const [col,setCol] = useState(40)
    const [width,setWidth] = useState(0)
    const [height,setHeight] = useState(0)
    const [align,setAlign] = useState('center')

    useEffect(() => {
        setTimeout(() =>{
                setWidth(document.getElementById('flipBoardMain').offsetWidth)
            setHeight(document.getElementById('flipBoardMain').offsetHeight)
        },100)
    },[])
    const renderArr = [];
    const setBoardValue = (str) => {
        //reset all inout
        for(let rowI = 0;rowI < row;rowI++) {
            for (let colI = 0; colI < col; colI++) {
                if(isElementExist(`${'flipInput-col'+ rowI + colI}`)) {
                    setTextInputValue(rowI,colI)
                    toggleClassForInput(rowI,colI)

                }
            }
        }
        //print board
        if(align === 'left') {
            printLeftAlignBoard(str)
        }
        if(align === 'right'){
            printRightAlignBoard(str)

        }
        if(align === 'center') {
            printCenterAlignBoard(str)
        }
    }
    const onChnage = (e) => {
            setBoardValue(e.target.value)
    }
    const printCenterAlignBoard = (str) => {
        const renderArr = [];
        let  rowIndex = 0;
        let myvar = (col -  1);
        for(let h = 0 ; h< str.length; h++) {
            if(rowIndex > 0) { // after 39 character new line
                if(renderArr[rowIndex]?.length > col) {
                    rowIndex++;
                    myvar =  myvar + col;

                }
            }
            if(h > myvar || (str.charCodeAt(h) === 10)) { // cliek on enter new line code
                rowIndex++;
                myvar =  myvar + col;
            }
            if(str.charCodeAt(h) !== 10) {
                const arrStringValue: any =  renderArr[rowIndex] || ''
                renderArr[rowIndex] = arrStringValue + str.charAt(h);

            }

        }

        let strArr =  renderArr;
        for(let rR=0 ;rR < strArr.length;rR++) { // row
            let m = 0;
            const startPoint =  (col/2 - Math.floor(strArr[rR]?.length/2));

            for(let cR = startPoint; cR< startPoint +  strArr[rR]?.length ;cR++) {
                if(isElementExist(`${'flipInput-col'+ rR + cR}`)) {
                    setTextInputValue(rR,cR, strArr[rR].charAt(m).toUpperCase())
                    toggleClassForInput(rR,cR)
                    m++;

                }
            }

        }
    }

    const printLeftAlignBoard = (str) => {
        let colIn = 0;
        let rowIn = 0;
        for(let textl = 0 ; textl < str?.length;textl++) {
            // console.log('Heyyyy',textl,(40 * (rowIn + 1)))
            if((str.charCodeAt(textl) && str.charCodeAt(textl) === 10) || (textl  === (col * (rowIn + 1)))) {
                rowIn++;
                colIn = 0;
                if(isElementExist(`${'flipInput-col'+ rowIn + 0}`)) {
                    setTextInputValue(rowIn,0,  str.charAt(textl).toUpperCase())
                    toggleClassForInput(rowIn,0)
                    colIn++;
                }


            } else {
                if(isElementExist(`${'flipInput-col'+ rowIn + colIn}`)) {
                    setTextInputValue(rowIn,colIn,  str.charAt(textl).toUpperCase())
                    toggleClassForInput(rowIn,colIn)

                }
                colIn++;
            }

        }
    }
    const printRightAlignBoard = (str) => {
        const renderArr = [];
        let  rowIndex = 0;
        let myvar = (col -  1);
        for(let h = 0 ; h< str.length; h++) {
            if(rowIndex > 0) { // after 39 character new line
                if(renderArr[rowIndex]?.length > col) {
                    rowIndex++;
                    myvar =  myvar + col;

                }
            }
            if(h > myvar || (str.charCodeAt(h) === 10)) { // cliek on enter new line code
                rowIndex++;
                myvar =  myvar + col;
            }
            if(str.charCodeAt(h) !== 10) {
                const arrStringValue: any =  renderArr[rowIndex] || ''
                renderArr[rowIndex] = arrStringValue + str.charAt(h);

            }

        }

        let strArr =  renderArr;
        for(let rR=0 ;rR < strArr.length;rR++) { // row
            for(let cR = col; cR> 0;cR--) { //col
                if(cR > (col - strArr[rR]?.length)) {
                    let m = 0;
                    for(let b = (col - strArr[rR].length); b < col;b++) {
                        if(isElementExist(`${'flipInput-col'+ rR + b}`)) {
                            setTextInputValue(rR,b,strArr[rR].charAt(m).toUpperCase())
                            toggleClassForInput(rR,b)

                        }
                        m++;

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
        if(event.target.value.length === (row * col)) {
            event.preventDefault();
        }
        if(event.key === "Enter") {
            let stopNewLine = false;
            for(let i = 0;i < col;i++) {
                if(getTextInputValue((row-1),i)) {
                    stopNewLine =  true;
                }
            }
            if(stopNewLine) {
                console.log('stopline')
                event.preventDefault();
            }

        }

    }



    useEffect(() =>{
            setTimeout(() =>{
                const textValue =  document.getElementById('mainTextArea')?.value || '';
                setBoardValue(textValue)
            },10)
    },[align])


    const setTextInputValue = (rowI,colI,val = '') =>{
        document.getElementById('flipInput-col'+ rowI + colI).value = val
    }
    const getTextInputValue = (rowI,colI,val = '') =>{
        const value  = document.getElementById('flipInput-col'+ rowI + colI).value || null;
        return value;
    }
    const isElementExist = (id) => {
        if (document.getElementById(id)) {
            return true
        }
        return  false
    }
    const toggleClassForInput  = (rowI,colI) => {
        if(document.getElementById('flipInput-col' + rowI + colI).value) {
            document.getElementById('flipInput-col' + rowI + colI).classList.add("splitflap-input-good");
        } else  {
            document.getElementById('flipInput-col' + rowI + colI).classList.remove("splitflap-input-good");
        }
    }

    return (
        <>

            <button className={`alignButton ${align === 'left' ? 'active' : ''}` } onClick={() => {
                document.getElementById('colorBoardMain').style.zIndex = 1;
                document.getElementById('mainTextArea').style.zIndex = 2;
                setAlign('left')}}>Left</button>
            <button  className={`alignButton ${align === 'center' ? 'active' : ''}`} onClick={() => {
                document.getElementById('colorBoardMain').style.zIndex = 1;
                document.getElementById('mainTextArea').style.zIndex = 2;
                setAlign('center')}}>Center</button>
            <button  className={`alignButton ${align === 'right' ? 'active' : ''}`} onClick={() => {
                document.getElementById('colorBoardMain').style.zIndex = 1;
                document.getElementById('mainTextArea').style.zIndex = 2;
                setAlign('right')}}>Right</button>

            <button onClick={() => {
                    document.getElementById('colorBoardMain').style.zIndex = 2;
                 document.getElementById('mainTextArea').style.zIndex = 1;
            }}>Color</button>
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
                                                    className={`flipInput-col
                                                       ${align === 'center' ? 'textaligncenter' :''}
                                                        ${align === 'left' ? 'textalignleft' :''}
                                                          ${align === 'right' ? 'textalignright' :''}
                                                    
                                                    
                                                    `}
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
                <div className={'dragLayout'} id={'dragLayout'}>
                    <Draggable
                        defaultPosition={{x: 0, y: 0}}
                        position={null}
                        grid={[20, 30]}
                        bounds={{left :0,right:width- (20 * 4),bottom:height-(30 * 3),top:0}}
                        scale={1}
                        onStart={() => {}}
                        onDrag={() => {}}
                        onStop={() => {}}>

                            <div className={'widget'}  id={'widget'}>Widget</div>

                    </Draggable>
                </div>
            </div>

                {/*<div className={'dragLayout'}>*/}
                {/*    {layout !== null && (*/}
                {/*        <GridLayout*/}
                {/*            className="layout"*/}
                {/*            layout={layout}*/}
                {/*            cols={40}*/}
                {/*            margin={[0,0]}*/}
                {/*            rowHeight={10}*/}
                {/*            width={width}*/}

                {/*        >*/}

                {/*            {layout.map((item, i) => (*/}
                {/*                <div key={item.i} data-grid={item} className={`${i===0 ? 'widget' :'widgetHide'}`}>*/}
                {/*                        {i === 0 ? 'DEMO' :''}*/}
                {/*                </div>*/}
                {/*            ))}*/}

                {/*        </GridLayout>*/}

                {/*    )}*/}

                {/*</div>*/}
                    <textarea rows={6} cols={40} id={'mainTextArea'} style={{textAlign:`${align}`}} maxLength={(41 * 6)}  onKeyPress={onKeyChange} onChange={onChnage}></textarea>
                    <div id={'colorBoardMain'}>

                        {
                            [...Array(row).keys()].map((rowIndex) => {
                                return (
                                    <>
                                        <div className={'flipInput-line'}>
                                            {
                                                [...Array(col).keys()].map((colIndex) => {
                                                    return (
                                                        <>
                                                            <div id={`colorInputPlaceholder-${rowIndex}-${colIndex}`} className={'colorInputPlaceholder'} onMouseDown={() => {

                                                                document.getElementById('colorInputPlaceholder-'+rowIndex+ '-'+colIndex).classList.add("whiteColorRect");

                                                            }}></div>
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


                </div>







        </>
    )
}
