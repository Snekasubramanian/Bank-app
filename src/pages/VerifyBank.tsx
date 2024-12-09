import React, { useEffect, useState } from 'react'
import OtpInputComponent from '../component/otp-input/OtpInput'
import Footer from '../component/footer/Footer'
import Heading from '../component/heading/Heading'
import { useInterval } from 'usehooks-ts'
import BackButton from '../component/back-button/BackButton'
import { useRecoilState } from 'recoil'
import {
  UUID as UUIDAtom,
  FIPDetailsList as FIPDetailsListAtom,
  refNumber as refNumberAtom,
  FiDetails as FiDetailsAtom,
  CurrentFip as CurrentFipAtom,
  discoveredData as discoveredDataAtom,
  XORDecryptRes as XORDecryptResAtom
} from '../services/recoil-states/atom'
import { useNavigate } from 'react-router'
import { UseApi } from '../services/api/api'
import Encrypt from '../services/encrypt'
import Decrypt from '../services/decrypt'
import DenyTracking from '../modal/DenyTracking'
import { EventtrackerApi } from '../services/api/event'
import Button from '../component/button/Button'
import Modal from 'react-modal'
import { BankState, CLICK_OTP_VALUE, DISCOVER_REPONSE, ERROR_VALUE, UPDATE_DISCOVER_REPONSE } from '../store/types/bankListType'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
interface modalProps {
  handleClose?: React.MouseEventHandler
  OnExit?: React.MouseEventHandler
  isOpen: boolean
  setIsOpen: any
  bankName: any
  CurrentLinkBank: any
  // list:any
}

export default function VerifyBank({
  handleClose,
  isOpen,
  setIsOpen,
  bankName,
  CurrentLinkBank,
  // list
}: // OnExit
  modalProps): any {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const [otpValid, setOtpValid] = useState<any>(undefined)
  const navigate = useNavigate()
  const [timer, setTimer] = useState(0)
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [discoverData, setDiscoverData] = useRecoilState<any>(discoveredDataAtom)
  const [otpSendNotificationClass, setOtpSendNotificationClass] = useState('hidden opacity-0')
  const [UUID] = useRecoilState(UUIDAtom)
  const [currentfip] = useRecoilState(CurrentFipAtom)
  const [, setFIPDetailsList] = useRecoilState<any>(FIPDetailsListAtom)
  const [refNumber, setRefNumber] = useRecoilState(refNumberAtom)
  const [bank, setBank] = useState('')
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const fipIds = FiDetails.fipid;
  const [message, setMessage] = useState("")
  const [click, setClick] = useState(0)
  const [isDisable, setIsDisable] = useState<any>(false)
  const [errorClick, setErrorClick] = useState(0)
  const [verifyLoader, setVerifyLoader] = useState(false)
  const { discoverBankResponse, dynData, clickCount, errorCount } = useSelector<RootStateType, BankState>((state) => state.bank);
  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }
  // AuthenticateToken API Call
  const authenticateToken = async (data: any) => {
    setVerifyLoader(true)
    setIsDisable(true);
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "click",
          "page_name": "aa_bank_otp",
          "bank_name": currentfip,
          "source": "",
          "cta_text": "Confirm",
          "event_name": "aa_linking_cta_clicked"
        }
      ]
    }
    EventtrackerApi(event);
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))
    try {
      const apiData = UseApi('POST', 'AuthenticateToken', encryptData)
      apiData.then((result) => {
        const decryptedResponse: any = Decrypt('Decrypt', result)
        if (decryptedResponse.RESULT_CODE === '200') {
          setOtpValid(true)
          const updated = discoverBankResponse.map((acc: any, index: any) => {
            decryptedResponse.fip_NewDiscoverelist.map((x: any) => {
              if (x.FIPACCREFNUM === acc.FIPACCREFNUM) {
                discoverBankResponse[index].Linked = true;
                discoverBankResponse[index].LINKEDDATE = x.LINKEDDATE;
                discoverBankResponse[index].FIPACCLINKREF = x.FIPACCLINKREF
                return false;
              }
              return x;
            })
            return acc;
          })
          dispatch({
            type: UPDATE_DISCOVER_REPONSE,
            body: updated
          });
          sessionStorage.clear();
          // preLoading();
          // setOtp('')
          // setTimeout(() => {
            setVerifyLoader(false)
            // navigate('/lottieLoader')
            setIsOpen(false)
            setIsDisable(false);
          // }, 2000)
          setFIPDetailsList((prev: any) => [...prev, ...decryptedResponse.fip_NewDiscoverelist])
        } else {
          // error flow
          const otpInputs: any = document.getElementsByClassName('otpContainerClass')
          if (errorCount < 5) {
            setMessage("You have entered incorrect OTP!")
          }
          setErrorClick(errorClick + 1)
          setOtp('')
          setTimeout(() => {
            setVerifyLoader(false)
            if (!!otpInputs.item(0)) {
              otpInputs.item(0).querySelector('input').focus()
            }
            setOtpValid(undefined)
          }, 2000)
          setOtpValid(false)
          setIsDisable(false);
        }
      })
    } catch (error) {
      setErrorClick(errorClick + 1)
    }
  }

  useEffect(() => {
    if (errorCount >= 5) {
      setIsDisable(true);
      setOtpValid(false)
      setMessage("OTP limit has been exceeded. Please try again after 30 mins")
      setOtp("")
    }
  }, [errorCount])

  const Resendotp = async () => {
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "click",
          "page_name": "aa_bank_otp",
          "bank_name": FiDetails.fipid,
          "source": "",
          "cta_text": "Resend",
          "event_name": "aa_linking_cta_clicked"
        }
      ]
    }
    EventtrackerApi(event);
    const toLinkBank: any = []
    CurrentLinkBank.forEach((item: any) => {
      if (item.Consent === false && item.Linked === false && item.isChecked) {
        const data = {
          FIPACCNUM: item.FIPACCNUM,
          FIPACCREFNUM: item.FIPACCREFNUM,
          FIPACCTYPE: item.FIPACCTYPE,
          FIPTYPE: item.FITYPE,
          FIPID: item.FIPID,
          Logo: item.Logo
        }
        toLinkBank.push({ ...data })
      }
    })
    const inputBankpayload = {
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_BROWSER: 'Chrome',
      I_FIPID: toLinkBank[0].FIPID,
      ACCOUNTS_TO_LINK: toLinkBank,
      I_SESSION: XORDecryptRes.sessionId,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID,
      I_ConsentHandle: dynData
    }
    if (toLinkBank.length > 0) {
      const encryptedData = Encrypt('Encrypt', JSON.stringify(inputBankpayload))
      try {
        const apiResponse = UseApi('POST', 'Link', encryptedData)
        const data = await apiResponse
        const decryptedResponse: any = Decrypt('Decrypt', data)
        if (decryptedResponse?.RESULT_CODE === '200') {
          setRefNumber(decryptedResponse?.RefNumber ?? '')
        }
      } catch (error) {
      }
    }
  }
  useEffect(() => {
    dispatch({
      type: CLICK_OTP_VALUE,
      body: click
    })
    if (!isOpen) {
      setMessage('');
      setOtp('');
      setOtpValid(null);
    }
  }, [click, isOpen])

  useEffect(() => {
    dispatch({
      type: ERROR_VALUE,
      body: errorClick
    })
  }, [errorClick])

  useEffect(() => {
    if (otp === '') {
      const urlParams = new URLSearchParams(window.location.search)
      setBank(urlParams.get('banklogopath') ?? '')
      setTimer(15)
    }
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "page",
          "page_name": "aa_bank_otp",
          "bank_name": FiDetails.fipid,
          "source": "",
          "event_name": "aa_linking_page_view"
        }
      ]
    }
    EventtrackerApi(event);
  }, [isOpen])


  useEffect(() => {
    // On Entering 6 digit OTP, authenticate Token API is triggered
    if (otp.length === 6) {
      authenticateToken({
        I_MOBILENUMBER: XORDecryptRes.mobileNumber,
        I_BROWSER: 'chrome',
        I_FIPID: currentfip,
        I_FIPACCREFNUM: refNumber,
        I_MOBOTP: otp,
        I_SESSION: XORDecryptRes.sessionId,
        I_USERID: XORDecryptRes.mobileNumber,
        UUID,
        I_ConsentHandle: dynData
      })
    }
  }, [otp])

  // useEffect(() => {
  //   if(clickCount > 2){
  //     setOtpValid(false)
  //     setMessage("OTP limit has been exceeded. Please try again after 30 mins")
  //   }
  // },[clickCount])

  useEffect(() => {
    window.addEventListener("storage", () => {
      setOtp(JSON.parse(JSON.stringify(sessionStorage.getItem("otp"))));
    });
  }, [])

  const countdownTimer = (timer: number, delay: number) => {
    return timer - delay
  }
  useInterval(
    () => {
      setTimer(countdownTimer(timer, 1))
    },
    timer !== 0 ? 1000 : null
  )
  const falseID = () => {
    if (otp.length === 6) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
      className='verifyBankScreen'
    >
      <div className="verify-modal">
        <h6>
          Link accounts </h6>
        <div className="verify-account">
          <p className="otp-text">
            You will receive a 6-digit code on your phone number{' '}
            <span className="otp-mobileNumber">+91 {XORDecryptRes.mobileNumber}</span> from {bankName}
          </p>
          <div className="otp-inputField">
            <OtpInputComponent otp={otp} setOtp={setOtp} otpValid={otpValid} disable={isDisable} verifyLoader={verifyLoader} />
            {otpValid === true || otpValid === undefined || otpValid === null
              ? <p className="text-center text-[#DF3C27] success-opt">message</p>
              : <p className="text-center text-[#DF3C27] success-msg">{message}</p>
            } 
              <div className='ResendOtpText'>
                <span style={{ marginRight: '3px' }}>Didn’t receive it?</span>
                {timer === 0
                  ? (
                    <button
                      className="ResendOTP_txt"

                      onClick={() => {
                        // Resend OTP Function for Bank OTP Page will come here
                        Resendotp()
                        setTimer(15)
                        setClick(click + 1)
                        setOtpSendNotificationClass('transition-all duration-1000 ease-in block opacity-1')
                        setTimeout(() => {
                          setOtpSendNotificationClass('transition-all duration-1000 ease-in opacity-0  translate-y-[-200px]')
                        }, 1000)
                        setTimeout(() => {
                          setOtpSendNotificationClass('hidden')
                        }, 1500)
                      }}
                      disabled={clickCount > 2 || message == "Account Locked , Try again after 30 minutes" || errorCount >= 5}
                    >
                      {' '}
                      Resend
                    </button>
                  )
                  : (
                    <span>Resend in <span className='Timer'>{timer}</span></span>
                  )}
              </div>
            </div>
          </div>
          <div className='otpSubmitButton'>
            <Button name={'Confirm'} disabled={falseID()} otpValue={otp} onClick={authenticateToken} />
          </div>
        </div> 
      {/* </div> */}
    </Modal>
    // <DenyTracking
    //     isOpen={isModalTrack}
    //     OnExit={onClickDenyTrack}
    //     handleClose={onClickDenyTrack}
    //   ></DenyTracking>
  )
}