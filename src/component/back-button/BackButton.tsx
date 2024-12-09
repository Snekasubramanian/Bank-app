import React from 'react'
import image from '../../assets/images/index'
interface backButtonProps {
  imageUrl: string
  denyBtn?: boolean
  onClickBack: React.MouseEventHandler<HTMLImageElement>
  onClickDeny?: React.MouseEventHandler<HTMLButtonElement>
}

export default function BackButton ({
  imageUrl,
  denyBtn = false,
  onClickBack,
  onClickDeny
}: backButtonProps): ReturnType<React.FC> {
  return (
    <div className="flex justify-between">
      <img src={image.backButton} alt="" onClick={onClickBack} />
      {denyBtn && (
        <button
          onClick={onClickDeny}
          className="font-[500] text-base text-[var(--Text_color)]"
        >
          Deny
        </button>
      )}
    </div>
  )
}
