import React from 'react'
// import images from '../../assets/images'
import Lottie from 'lottie-react'

interface HeadingProps {
  lottieAnimation: object
}
function LottieAnima ({ lottieAnimation }: HeadingProps): ReturnType<React.FC> {
  return (
        <Lottie animationData={lottieAnimation} loop={true} allowFullScreen={true}/>
  )
}

export default LottieAnima
