import React, { type Dispatch, type SetStateAction } from 'react'
import OtpInput from 'react-otp-input'

interface OtpInputProps {
  otp: string
  setOtp: Dispatch<SetStateAction<string>>
  otpValid?: any
  disable:any
  verifyLoader: any
}
export default function OtpInputComponent ({ otp, setOtp, otpValid,disable,verifyLoader }: OtpInputProps): ReturnType<React.FC> {
  // const errorStyle = '!border-[1px] !border-[#DF3C27]'
  let style = ' bg-[#EBEBEB] input-box text-[#202020]'
  if (otpValid){
    style = ' bg-[#EBEBEB] input-box text-[#101010]'
  } else if (otpValid === false){
    style = ' bg-[#EBEBEB] input-box  text-[#DF3C27]'
  } else if (verifyLoader){
    style = ' bg-[#C2C2C2] input-box  text-[#626262]'
  }
  else {
    style = ' bg-[#EBEBEB] input-box text-[#101010]'
  }
  return (
     
      <OtpInput
        // inputType="number"
        isInputNum={true}
        shouldAutoFocus={true}
        containerStyle=" otpContainerClass"
        inputStyle={style}
        value={otp}
        onChange={setOtp}
        numInputs={6}
        isDisabled={disable}
        // renderSeparator={<span> </span>}
        // renderInput={(props) => <input {...props} />}
      /> 
  )
}
