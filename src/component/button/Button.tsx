import React from 'react'
import images from '../../assets/images'

interface buttonProps {
  name?: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  disabled?: boolean
  onClick?: any
  otpValue?: any
}

export default function Button({
  name,
  bgColor = 'bg-[var(--Primary_button_color)]',
  textColor = 'var(--Text_color)',
  borderColor,
  disabled = false,
  onClick,
  otpValue
}: buttonProps): ReturnType<React.FC> {
  // console.log("otp", otpValue?.length);

  const newValue = otpValue?.length
  return (
    <button
      // className={`w-full h-[50px] text-base font-[600] rounded-full disabled:opacity-50  ${bgColor} ${textColor} ${borderColor} `}
      className='bottom-button'
      // className="multi_pan_button" // multiFI
      onClick={onClick}
      disabled={disabled}
    >
      
      {newValue === 6 ?
        <img src={images.music} />
        : name
      }


    </button>
  )
}
