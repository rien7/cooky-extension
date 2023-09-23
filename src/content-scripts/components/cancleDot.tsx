import { preventDefault } from '../util/listenerFunctions'

export default function CancleDot(props: {
  element: Element
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  fixed: boolean
}) {
  const { element, setFixed, fixed } = props

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    if (element.classList.contains('cooky-selecting-paragraph'))
      element.classList.remove('cooky-selecting-paragraph')
    const selectedElement = element.querySelectorAll('cooky-selection')
    selectedElement.forEach((element) => {
      element.outerHTML = element.textContent || ''
    })
    setFixed(false)

    // reset <a> tag
    const aTags = document.querySelectorAll('a')
    aTags.forEach((aTag) => {
      aTag.removeEventListener('click', preventDefault)
      const href = aTag.getAttribute('disabled-href')
      if (href) {
        aTag.setAttribute('href', href)
        aTag.removeAttribute('disabled-href')
      }
    })
  }

  return (
    <>
      { fixed && <>
          <div className='absolute -left-2 -top-2 h-6 w-6 cursor-pointer rounded-full bg-red-400 blur-sm transition-all hover:-left-8 hover:-top-8 hover:z-50 hover:h-20 hover:w-20 hover:blur-md'
            onClick={handleClick} />
          <div className='absolute bottom-0 left-0 h-4 w-4 overflow-hidden'>
            <div className='absolute bottom-[3px] left-[3px] h-8 w-8 rounded-md border-2 border-red-300'/>
          </div>
        </> }
    </>
  )
}
