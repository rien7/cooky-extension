export default function FloatDot(props: { setFloatDotClick: (value: boolean) => void }) {
  return (
    <>
      <div className='float-dot' onClick={() => props.setFloatDotClick(true)} />
    </>
  )
}
