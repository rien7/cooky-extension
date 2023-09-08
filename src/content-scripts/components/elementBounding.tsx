import type { ElementBoundingType } from '../hooks/useElementBounding'

export default function ElementBounding(props: {
  element: Element
  bounding: ElementBoundingType
  boundingRef: React.MutableRefObject<HTMLDivElement | null>
  elementRef: React.MutableRefObject<HTMLElement | undefined>
  fixed: boolean
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode[]
}) {
  const { element, bounding, boundingRef, elementRef, fixed, setFixed } = props
  const bodyBounding = document.body.getBoundingClientRect()
  const isBlock = element.classList.contains('cooky-selection-paragraph')

  let color = 'bg-orange-400/20'
  let pointer = 'cursor-pointer'

  if (isBlock) {
    color = 'bg-red-400/40'
    pointer = 'cursor-not-allowed'
  }
  else if (fixed) {
    color = 'bg-transparent'
    pointer = 'cursor-default'
  }

  return (
    <>
      <div ref={boundingRef}
        className={`absolute z-50 ${pointer} ${color} overflow-hidden rounded-lg transition-all duration-300`}
        style={{
          left: bounding.left + bounding.scrollX - 10 - bodyBounding.left,
          top: bounding.top + bounding.scrollY - 10,
          width: bounding.width + 20,
          height: bounding.height + 20,
        }}
        onClick={() => {
          const classList = element.classList
          if (classList.contains('cooky-selection-paragraph'))
            return
          setFixed(true)
          if (!classList.contains('cooky-selecting-paragraph'))
            element.classList.add('cooky-selecting-paragraph')
          elementRef.current = element as HTMLElement
        }}>
          {props.children}
      </div>
    </>
  )
}
