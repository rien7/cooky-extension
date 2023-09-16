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

function App() {
  const [fixed, setFixed] = useState(false)
  const [showBlock, setShowBlock] = useState(false)
  const [domChange, setDomChange] = useState(false)

  // recode pressed key in setting
  const keyPressSetting = useRef<ShortcutKey[]>([])
  // recode element that mouse is on
  const elementRef = useRef<HTMLElement | undefined>(undefined)
  // use to set bounding element pointer-events
  const boundingRef = useRef<HTMLDivElement | null>(null)

  const paragraphData = useRef<ParagraphDataType[]>([])

  const position = useMouse()
  const element = useMouseElement(fixed)
  const bounding = useElementBounding(fixed, elementRef.current)
  const keyPress = useKeyPress(keyPressSetting.current)
  const selection = useSelection(elementRef.current)

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
      // TODO: extract to recovert function
      setFixed(false)
      elementRef.current = undefined
    }
  }, [elementChange])

  useEffect(() => {
    if (!fixed)
      elementRef.current = undefined
  }, [fixed])

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

  return (
    <>
      { showBlock && bounding && element
        && <ElementBounding element={element}
                            bounding={bounding}
                            boundingRef={boundingRef}
                            elementRef={elementRef}
                            fixed={fixed}
                            setFixed={setFixed}
                            _paragraphData={paragraphData} >
              <ConfirmDot element={element}
                          bounding={bounding}
                          _paragraphData={paragraphData}
                          setShowBlock={setShowBlock}
                          setFixed={setFixed}
                          fixed={fixed}
                          selection={selection}/>
              <CancleDot element={element}
                         elementRef={elementRef}
                         setFixed={setFixed}
                         fixed={fixed}/>
           </ElementBounding>
      }
    </>
  )
}

export default App
