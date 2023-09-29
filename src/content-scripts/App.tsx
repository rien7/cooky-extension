import { useEffect, useRef, useState } from 'react'
import type { ShortcutKey } from '../utils/shortcutKey'
import type { ElementBoundingType } from './hooks/useElementBounding'
import useElementBounding from './hooks/useElementBounding'
import useMouseElement from './hooks/useMouseElement'
import useSelection from './hooks/useSelection'
import useKeyPress from './hooks/useKeyPress'
import useMousePosition from './hooks/useMousePosition'
import ConfirmDot from './components/confirmDot'
import CancleDot from './components/cancleDot'
import ElementBounding from './components/elementBounding'

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

  const [showBlock, setShowBlock] = useState(false)

  // use to set bounding element pointer-events
  const boundingDomRef = useRef<HTMLDivElement | null>(null)
  const paragraphData = useRef<ParagraphDataType[]>([])
  const lastBounding = useRef<ElementBoundingType | undefined>(undefined)

  const keyPress = useKeyPress(keyPressSetting.current)
  const position = useMousePosition(fixed || keyPress)

  const element = useMouseElement(keyPress, position, lastBounding.current !== undefined && fixed)
  const bounding = useElementBounding(element)
  lastBounding.current = bounding

  const selection = useSelection(fixed, element)

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
    if (fixed)
      setShowBlock(true)
    else if (keyPress && bounding)
      setShowBlock(true)
    else
      setShowBlock(false)
  }, [fixed, keyPress, element, bounding])

  // when mouse is on bounding element, set bounding element pointer-events to none
  // so that mouse event can pass through bounding element
  // fixed ElementBounding z-index heighter than bounding element
  useEffect(() => {
    if (!fixed || !position || !bounding)
      return
    if (position.clientX > bounding.left + 5 && position.clientX < bounding.left - 5 + bounding.width && position.clientY > bounding.top + 5 && position.clientY < bounding.top - 5 + bounding.height) {
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
