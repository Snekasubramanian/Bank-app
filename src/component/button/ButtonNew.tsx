import React from 'react'

interface buttonProps {
  name: string
  onClick?: React.MouseEventHandler
}

export default function ButtonNew ({ name, onClick }: buttonProps): ReturnType<React.FC> {
  return <button className="w-full h-[50px] bg-[var(--Background_color)] text-base font-[600] rounded-full text-[#191C1F] top-[721px]" onClick={onClick} >{name}</button>
}
