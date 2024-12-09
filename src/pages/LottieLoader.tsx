import React, { useEffect } from 'react'
import LottieAnima from '../component/lottie/LottieAnima'
import images from '../assets/images'
import { useLocation, useNavigate } from 'react-router'
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
import { useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import { BankState } from '../store/types/bankListType'
import { closeAndRedirect } from '../services/AaRedirection'

export default function LottieLoader(): JSX.Element {
  const navigate = useNavigate()
  const location = useLocation();
  let statusfailed = location?.state?.statusfailed
  const checkValue: boolean = false;
  const [UUID] = useRecoilState(UUIDAtom)
  const { discoverBankResponse, consentData } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [FIPDetailsList] = useRecoilState(FIPDetailsListAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)

  // To generate Error Code based on MESSAGE
  const getErrorCode = (message: string) => {
    if (/Consent is rejected/i.test(message)) {
      return 2
    } else if (/Consent not available/i.test(message)) {
      return 2
    } else {
      return 2
    }
  }
  
  const encrptHandler = async () => {
    closeAndRedirect({
      parentStatusMessage: 'ACCEPTED',
      delay: true,
      decrypt:XORDecryptRes,
      url: redirectUrl,
    });
  }


  window.addEventListener('popstate', function (event:any) {
    navigate('/lottie', { state: { statusfailed: true }})
    });


  useEffect(() => {
    setTimeout(() => {
      encrptHandler()
    },3000) 

    // handleSubmit(FIPDetailsListModified)
    // navigate to Ind Money dashboard
    // setTimeout(() => {
    //   navigate('/') // Enter Dashboard URL here
    // }, 10000)
  }, [])

  return (
    <>
      <Heading
        checked={checkValue}
        Backbtn={false}
        closebtn={false}
      />
      <div className="gif_image"> {/* flex justify-center items-center flex-col */}
        <img className='success_img' src={images.accountConnect} />
        {!statusfailed && <h5 className='acc_title'>Accounts connected!</h5>}
        {!statusfailed && <p className='acc_subtitle'>Securely sharing your details with <br /> {XORDecryptRes.fiuName}</p>}
        {/* already submit */}
       {statusfailed && <div className="gif-submit">
          <h5 className='acc_title'>Your consent has been submitted already!</h5>
          <div className="already-submitted">
            <img src={images.Successed} alt="" />
            <p>To view and manage your consents,  use <span className='cams-letter'>CAMS</span><span className='fiserve-text'>finserv</span> website/mobile app.</p>
          </div>
        </div>}
        {/* already submit */}

      </div>
    </>
  )
}
