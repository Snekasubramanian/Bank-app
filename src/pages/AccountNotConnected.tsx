import React, { useEffect } from 'react'
import LottieAnima from '../component/lottie/LottieAnima'
import images from '../assets/images'
import { useNavigate } from 'react-router'
import Encrypt from '../services/encrypt'
import Decrypt from '../services/decrypt'
import { UseApi } from '../services/api/api'
import {
  UUID as UUIDAtom,
  FIPDetailsList as FIPDetailsListAtom,
  redirectUrl as redirectUrlAtom,
  XORDecryptRes as XORDecryptResAtom,
  FiDetails as FiDetailsAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import Heading from '../component/heading/Heading'
import { closeAndRedirect } from '../services/AaRedirection'

export default function AccountNotConnected(): JSX.Element {
  const navigate = useNavigate()
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const checkValue : boolean  = false;
  
  const encrptHandler = async() => {
    closeAndRedirect({
      parentStatusMessage: 'REJECTED',
      delay: true,
      decrypt:XORDecryptRes,
      url: redirectUrl,
    });
  }

  useEffect(() => {
    setTimeout(() => {
      encrptHandler()
    },3000) 
  }, [])

  return (
    <>
    <Heading
    checked= {checkValue}
    Backbtn={false}
    closebtn={false}
   />
    <div className="gif_image ">
      <img className='not_loading_gif  ' src={images.not_loading} />
      <div className='acc_title'>Accounts not connected!</div>
      <div className='acc_subtitle'>Redirecting to  {XORDecryptRes.fiuName} </div>
    </div>
    </>
  )
}
