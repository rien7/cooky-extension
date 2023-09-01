import { useEffect, useRef, useState } from 'react'
import FloatDot from './content-scripts/components/floatDot'
import useFloatDotPosition from './content-scripts/hooks/useFloatDotPosition'
import useMouseElement from './content-scripts/hooks/useMouseElement'
import useSelection from './content-scripts/hooks/useSelection'
import { OpenAi } from './utils/openai'

function App() {
  const [floatDotClick, setFloatDotClick] = useState(false)
  const floatDotPositoin = useFloatDotPosition(floatDotClick)
  const element = useMouseElement(floatDotClick)

  const elementRef = useRef<HTMLElement | undefined>(undefined)
  const selection = useSelection(elementRef.current)

  useEffect(() => {
    if (element && floatDotClick) {
      const randomId = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
      if (!element.classList.contains('cooky-selection-paragraph')) {
        element.classList.add('cooky-selection-paragraph')
        element.classList.add(`paragraph-${randomId}`)
      }
      elementRef.current = element as HTMLElement
    }
    else { elementRef.current = undefined }
  }, [element, floatDotClick])

  async function handleClick() {
    if (!floatDotClick) {
      setFloatDotClick(true)
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
          setFloatDotClick(false)
        }
      }
    }
  }

  return (
    <>
      {floatDotPositoin && <div className="absolute" style={{ left: floatDotPositoin.x - 10, top: floatDotPositoin.y - 10 }}>
        <FloatDot handleClick={handleClick} />
      </div>}
    </>
  )
}

export default App
