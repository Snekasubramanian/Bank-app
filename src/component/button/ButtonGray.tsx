import React from 'react'

interface buttonProps {
  name: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  disabled?: boolean
  onClick?: any
}

export default function ButtonGray ({
  name,
  bgColor = 'bg-[var(--Primary_button_color)]',
  textColor = 'var(--Text_color)',
  borderColor,
  disabled = false,
  onClick
}: buttonProps): ReturnType<React.FC> {
  return (
    <button
      // className={`w-full h-[50px] text-base font-[600] rounded-full disabled:opacity-50  ${bgColor} ${textColor} ${borderColor} `}
      className='bottom-gray'
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  )
}
