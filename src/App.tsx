import { useEffect, useRef, useState } from 'react'
import useElementBounding from './content-scripts/hooks/useElementBounding'
import useMouseElement from './content-scripts/hooks/useMouseElement'
import useSelection from './content-scripts/hooks/useSelection'
import { OpenAi } from './utils/openai'
import useKeyPress from './content-scripts/hooks/useKeyPress'

function App() {
  const [fixed, setFixed] = useState(false)
  const [showBlock, setShowBlock] = useState(false)
  // const floatDotPositoin = useFloatDotPosition(fixed)
  const element = useMouseElement(fixed)
  const keyPress = useKeyPress('MetaLeft')
  const bounding = useElementBounding(fixed)
  const elementRef = useRef<HTMLElement | undefined>(undefined)
  const selection = useSelection(elementRef.current)

  // useEffect(() => {
  //   if (keyPress && !fixed) {
  //     const randomId = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
  //     if (!element.classList.contains('cooky-selection-paragraph')) {
  //       element.classList.add('cooky-selection-paragraph')
  //       element.classList.add(`paragraph-${randomId}`)
  //     }
  //     elementRef.current = element as HTMLElement
  //   }
  //   else { elementRef.current = undefined }
  // }, [keyPress, fixed])

  useEffect(() => {
    if (keyPress && !fixed)
      setShowBlock(true)
    else if (fixed)
      setShowBlock(true)
    else
      setShowBlock(false)
  }, [keyPress, fixed, element])

  async function handleClick() {
    if (!fixed) {
      setFixed(true)
    }
    else {
      let buffer = ''
      let explainationCompleted = false
      if (selection && elementRef.current?.textContent) {
        const stream = await OpenAi.SINGLETON.translate(elementRef.current?.textContent, selection)
        for await (const part of stream) {
          const data = part.choices[0]?.delta?.content || ''
          if (data === '❖') {
            explainationCompleted = true
            buffer = ''
            continue
          }
          if (explainationCompleted) {
            buffer += data
            const cookySelectionParagraph = document.querySelectorAll('.cooky-selection-paragraph')
            if (cookySelectionParagraph.length > 0)
              cookySelectionParagraph[cookySelectionParagraph.length - 1].setAttribute('data', buffer)
          }
          else {
            if (data === '\n' || data === '❖') {
              buffer = ''
              continue
            }
            buffer += data
            const match = buffer.match(/'(\d+)-(\d+)': (.*)\n?/)
            if (match) {
              const start = Number.parseInt(match[1])
              const end = Number.parseInt(match[2])
              let id = ''
              selection.forEach((item) => {
                if (item.s === start && item.e === end)
                  id = item.id
              })
              if (id.length === 22) {
                const text = match[3]
                const cookySelection = document.querySelectorAll(`cooky-selection[id='${id}']`)
                if (cookySelection.length > 0)
                  cookySelection[cookySelection.length - 1].setAttribute('data', text)
              }
            }
          }
          setFixed(false)
          if (element?.classList.contains('cooky-selecting-paragraph'))
            element?.classList.remove('cooky-selecting-paragraph')
          elementRef.current = undefined
        }
      }
    }
  }

  return (
    <>
      {showBlock && bounding && <div className={`element-bounding ${fixed ? 'fixed' : ''} ${element?.classList.contains('cooky-selection-paragraph') ? 'block' : ''}`}
      style={{ left: bounding.rect.left + scrollX - 33, top: bounding.rect.top + window.scrollY - 10, width: bounding.rect.width + 46, height: bounding.rect.height + 20 }}
      onClick={() => {
        const classList = element?.classList
        if (classList?.contains('cooky-selection-paragraph'))
          return
        setFixed(true)
        if (!classList?.contains('cooky-selecting-paragraph'))
          element?.classList.add('cooky-selecting-paragraph')
        elementRef.current = element as HTMLElement
      }}>
        <div className='float-block' />
        <div className='comfirm' onClick={(e) => {
          e.stopPropagation()
          if (!element?.classList.contains('cooky-selection-paragraph'))
            element?.classList.add('cooky-selection-paragraph')
          setShowBlock(false)
          handleClick()
        }}/>
        <div className='cancle' onClick={(e) => {
          e.stopPropagation()
          if (element?.classList.contains('cooky-selecting-paragraph'))
            element?.classList.remove('cooky-selecting-paragraph')
          const selectedElement = element?.querySelectorAll('cooky-selection')
          selectedElement?.forEach((element) => {
            element.outerHTML = element.textContent || ''
          })
          setFixed(false)
          elementRef.current = undefined
        }} />
      </div>}
    </>
  )
}

export default App
