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
      { fixed && <div className='group absolute -left-2 -top-2 h-6 w-6 cursor-pointer rounded-full bg-red-400 blur-sm transition-all hover:-left-4 hover:-top-4 hover:z-50 hover:h-20 hover:w-20 hover:blur-md'
        onClick={handleClick} >
          {/* <Icon icon='material-symbols:close-rounded'
          className="absolute left-0 top-0 m-0 h-0 w-0 text-white opacity-0 transition
          group-hover:left-1/2 group-hover:top-1/2 group-hover:h-6 group-hover:w-6 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100"/> */}
        </div> }
    </>
  )
}
