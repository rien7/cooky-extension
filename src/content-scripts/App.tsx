import { useEffect, useRef, useState } from 'react'
import { Md5 } from 'ts-md5'
import { OpenAi } from '../utils/openai'
import type { ShortcutKey } from '../utils/shortcutKey'
import ArrowRightSvg from '../assets/arrow-right'
import CloseSvg from '../assets/close'
import useElementBounding from './hooks/useElementBounding'
import useMouseElement from './hooks/useMouseElement'
import useSelection from './hooks/useSelection'
import useKeyPress from './hooks/useKeyPress'
import useMouse from './hooks/useMouse'

function App() {
  const [fixed, setFixed] = useState(false)
  const [showBlock, setShowBlock] = useState(false)
  const element = useMouseElement(fixed)
  const boundingRef = useRef<HTMLDivElement | null>(null)
  const position = useMouse()
  const keyPressSetting = useRef<ShortcutKey[]>([])
  const keyPress = useKeyPress(keyPressSetting.current)
  const bounding = useElementBounding(fixed)
  const elementRef = useRef<HTMLElement | undefined>(undefined)
  const selection = useSelection(elementRef.current)
  const paragraphIdSet = useRef<Set<string>>(new Set())
  const selectionParagraphIdRef = useRef<string | undefined>(undefined)
  const bodyBounding = document.body.getBoundingClientRect()

  useEffect(() => {
    chrome.storage.local.get(['shortcut'], (result) => {
      keyPressSetting.current = result.shortcut
    })
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.shortcut)
        keyPressSetting.current = changes.shortcut.newValue
    })
  }, [])

  useEffect(() => {
    if (keyPress && !fixed)
      setShowBlock(true)
    else if (fixed)
      setShowBlock(true)
    else
      setShowBlock(false)
  }, [keyPress, fixed, element])

  useEffect(() => {
    if (!fixed || !position || !bounding)
      return
    if (position.clientX > bounding.left && position.clientX < bounding.left + bounding.width && position.clientY > bounding.top && position.clientY < bounding.top + bounding.height) {
      if (!boundingRef.current?.classList.contains('pointer-events-none'))
        boundingRef.current?.classList.add('pointer-events-none')
    }
    else {
      if (boundingRef.current?.classList.contains('pointer-events-none'))
        boundingRef.current?.classList.remove('pointer-events-none')
    }
  }, [fixed, position])

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
      {showBlock && bounding && <div ref={boundingRef} className={`element-bounding ${fixed ? 'fixed' : ''} ${element?.classList.contains('cooky-selection-paragraph') ? 'block' : ''}`}
      style={{ left: bounding.left + bounding.scrollX - 10 - bodyBounding.left, top: bounding.top + bounding.scrollY - 10, width: bounding.width + 20, height: bounding.height + 20 }}
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
        }} >
          <ArrowRightSvg />
        </div>
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
        }} >
          <CloseSvg />
        </div>
      </div>}
    </>
  )
}

export default App
