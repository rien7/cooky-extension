import { useEffect, useRef, useState } from 'react'
import type { ShortcutKey } from '../utils/shortcutKey'
import type { ElementBoundingType } from './hooks/useElementBounding'
import useElementBounding from './hooks/useElementBounding'
import useMouseElement from './hooks/useMouseElement'
import useSelection from './hooks/useSelection'
import useKeyPress from './hooks/useKeyPress'
import useMouse from './hooks/useMouse'
import ConfirmDot from './components/confirmDot'
import CancleDot from './components/cancleDot'
import ElementBounding from './components/elementBounding'
import useElementChange from './hooks/useElementChange'

export interface ParagraphDataType {
  id: string
  element: HTMLElement
  current: boolean
  position: ElementBoundingType
  text?: string
  textTranslation?: string
  selections: { s: number; e: number; id: string }[]
  selectionsTranslation: { id: string; text: string }[]
  chatHistory: { role: 'user' | 'assistant'; text: string; timestamp: number }[]
}

export default function App() {
  const [fixed, setFixed] = useState(false)

  // recode pressed key in setting
  const keyPressSetting = useRef<ShortcutKey[]>([])
  const keyPress = useKeyPress(keyPressSetting.current)

  const [showBlock, setShowBlock] = useState(false)
  const [domChange, setDomChange] = useState(false)

  // use to set bounding element pointer-events
  const boundingDomRef = useRef<HTMLDivElement | null>(null)

  const paragraphData = useRef<ParagraphDataType[]>([])

  const position = useMouse()

  // if key press and not fixed, get element that mouse is on
  const element = useMouseElement(fixed, keyPress, position)

  const bounding = useElementBounding(fixed, keyPress, element!)
  const selection = useSelection(fixed, element)

  const elementChange = useElementChange(fixed, element, bounding
    ? {
        clientX: bounding.left + bounding.width / 2,
        clientY: bounding.top + bounding.height / 2,
      }
    : undefined, domChange, setDomChange)

  useEffect(() => {
    chrome.storage.local.get(['shortcut'], (result) => {
      keyPressSetting.current = result.shortcut
    })
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.shortcut)
        keyPressSetting.current = changes.shortcut.newValue
    })
    const mutationObserver = new MutationObserver(() => {
      setDomChange(true)
    })
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }, [])

  useEffect(() => {
    if (elementChange) {
      if (element?.classList.contains('cooky-selecting-paragraph'))
        element.classList.remove('cooky-selecting-paragraph')
      setFixed(false)
    }
  }, [elementChange])

  useEffect(() => {
    if (!keyPress && !fixed)
      setShowBlock(false)
    else if (!element || !bounding)
      setShowBlock(false)
    else
      setShowBlock(true)
  }, [fixed, keyPress, element, bounding])

  // when mouse is on bounding element, set bounding element pointer-events to none
  // so that mouse event can pass through bounding element
  // fixed ElementBounding z-index heighter than bounding element
  useEffect(() => {
    if (!fixed || !position || !bounding)
      return
    if (position.clientX > bounding.left && position.clientX < bounding.left + bounding.width && position.clientY > bounding.top && position.clientY < bounding.top + bounding.height) {
      if (!boundingDomRef.current?.classList.contains('pointer-events-none'))
        boundingDomRef.current?.classList.add('pointer-events-none')
    }
    else {
      if (boundingDomRef.current?.classList.contains('pointer-events-none'))
        boundingDomRef.current?.classList.remove('pointer-events-none')
    }
  }, [fixed, position])

  return (
    <>
      { showBlock
        && <ElementBounding element={element!}
                            bounding={bounding!}
                            boundingRef={boundingDomRef}
                            fixed={fixed}
                            setFixed={setFixed}
                            _paragraphData={paragraphData} >
              <ConfirmDot element={element!}
                          bounding={bounding!}
                          _paragraphData={paragraphData}
                          setShowBlock={setShowBlock}
                          setFixed={setFixed}
                          fixed={fixed}
                          selection={selection}/>
              <CancleDot element={element!}
                         setFixed={setFixed}
                         fixed={fixed}/>
           </ElementBounding>
      }
    </>
  )
}
