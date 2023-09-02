import { useEffect, useRef, useState } from 'react'
import { Md5 } from 'ts-md5'
import { OpenAi } from '../utils/openai'
import useElementBounding from './hooks/useElementBounding'
import useMouseElement from './hooks/useMouseElement'
import useSelection from './hooks/useSelection'
import useKeyPress from './hooks/useKeyPress'

function App() {
  const [fixed, setFixed] = useState(false)
  const [showBlock, setShowBlock] = useState(false)
  // const floatDotPositoin = useFloatDotPosition(fixed)
  const element = useMouseElement(fixed)
  const keyPress = useKeyPress('MetaLeft')
  const bounding = useElementBounding(fixed)
  const elementRef = useRef<HTMLElement | undefined>(undefined)
  const selection = useSelection(elementRef.current)
  const paragraphIdSet = useRef<Set<string>>(new Set())
  const selectionParagraphIdRef = useRef<string | undefined>(undefined)

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
            const cookySelectionParagraph = document.querySelectorAll(`.paragraph-${selectionParagraphIdRef.current}`)
            if (cookySelectionParagraph.length === 1)
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
        }
        setFixed(false)
        if (element?.classList.contains('cooky-selecting-paragraph'))
          element?.classList.remove('cooky-selecting-paragraph')
        elementRef.current = undefined
        selectionParagraphIdRef.current = undefined
      }
    }
  }

  return (
    <>
      {showBlock && bounding && <div className={`element-bounding ${fixed ? 'fixed' : ''} ${element?.classList.contains('cooky-selection-paragraph') ? 'block' : ''}`}
      style={{ left: bounding.rect.left + window.scrollX - 10, top: bounding.rect.top + window.scrollY - 10, width: bounding.rect.width + 20, height: bounding.rect.height + 20 }}
      onClick={() => {
        const classList = element?.classList
        if (classList?.contains('cooky-selection-paragraph'))
          return
        setFixed(true)
        if (!classList?.contains('cooky-selecting-paragraph'))
          element?.classList.add('cooky-selecting-paragraph')
        elementRef.current = element as HTMLElement
      }}>
        <div className='confirm' onClick={(e) => {
          e.stopPropagation()
          let paragraphId = Md5.hashStr(element?.textContent || '').padStart(6, '0').slice(0, 6).toUpperCase()
          if (paragraphIdSet.current.has(paragraphId)) {
            const silbingElements = [element]
            while (paragraphIdSet.current.has(paragraphId)) {
              silbingElements.push(silbingElements[silbingElements.length - 1]?.nextElementSibling as HTMLElement)
              paragraphId = Md5.hashStr(silbingElements.map(element => element?.textContent).join('') || '').padStart(6, '0').slice(0, 6).toUpperCase()
            }
          }
          paragraphIdSet.current.add(paragraphId)
          selectionParagraphIdRef.current = paragraphId
          if (!element?.classList.contains('cooky-selection-paragraph'))
            element?.classList.add('cooky-selection-paragraph', `paragraph-${paragraphId}`)
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
