import React, { useEffect, useState } from 'react'
import images from '../assets/images/index'
import Modal from 'react-modal'
import Heading from '../component/heading/Heading'
import Button from '../component/button/Button'
import { useRecoilState } from 'recoil'
import {
  redirectUrl as redirectUrlAtom,
  XORDecryptRes as XORDecryptResAtom,
  FiDetails as FiDetailsAtom,
  UUID as UUIDAtom,
} from '../services/recoil-states/atom'
import { EventtrackerApi } from '../services/api/event'
import ButtonGray from '../component/button/ButtonGray'
import { useNavigate } from 'react-router'
import Encrypt from '../services/encrypt'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import { useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import { BankState } from '../store/types/bankListType'

interface buttonProps {
  handleClose?: React.MouseEventHandler
  OnExit?: React.MouseEventHandler
  pageName?: any
  isOpen: boolean
}
export default function DenyAndExit({
  handleClose,
  isOpen,
  pageName,
  OnExit
}: buttonProps): JSX.Element {
  const navigate = useNavigate()
  const { consentData,FICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [selectedRadio, setSelectedRadio] = useState('')
  const [inputValue, setInputValue] = useState("Didn’t receive OTP for verification")
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [UUID] = useRecoilState(UUIDAtom)
  const ecres = {
    fipid: '',
    addfip: '',
    txnid: XORDecryptRes.txnid,
    sessionid: XORDecryptRes.sessionId,
    userid: XORDecryptRes.userId,
    srcref: XORDecryptRes.consentId,
    redirect: redirectUrl,
    status: 'F',
    errorcode: '2'
  }

  const consentDenyApiCall = async (consentvalue: any) => {
    const consentDenyPayload = {
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_BROWSER: 'chrome',
      I_ConsentHandle: consentvalue,
      I_SESSION: XORDecryptRes.sessionId,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID,
      I_FIUID: FiDetails.fiuid,
      I_REASON: inputValue,
      I_PAGE: pageName,
      I_STATUS: 'PENDING'
    }
    const encryptConsent = Encrypt(
      'Encrypt',
      JSON.stringify(consentDenyPayload)
    )
    try {
      const apiData = UseApi('POST', 'ConsentDenyReason', encryptConsent)
      const data = await apiData
      const consentDenyResponse = Decrypt('Decrypt', data)
      return consentDenyResponse
    } catch (error) {
    }
  }

  const handleReject = async () => {
    const requests = consentData.map((consentvalue: any) => {
      return consentDenyApiCall(consentvalue);
    })
    const responses = await Promise.all(requests)
    let success = responses?.filter((response: any) => {
      return response.RESULT_CODE === "200"
    })
    if (success.length > 0) {
      navigate('/accountNotConnected')
      //  const ecres = {
      //   fipid: '',
      //   addfip: XORDecryptRes.addfip,
      //   txnid: XORDecryptRes.txnid,
      //   sessionid: XORDecryptRes.sessionId,
      //   userid: XORDecryptRes.userId,
      //   srcref: XORDecryptRes.consentId,
      //   redirect: redirectUrl,
      //   status: decryptedResponse.RESULT_CODE === '200' ? 'S' : 'F',
      //   errorcode:
      //     decryptedResponse.RESULT_CODE === '200'
      //       ? '0'
      //       : getErrorCode(decryptedResponse.MESSAGE)
      // }
      // const urlparams = await GenerateEncryptedUrl(redirectUrl, ecres, FiDetails.fiuid)
      // if (!(redirectUrl === '')) {
      //   window.location.replace(urlparams) // Replace Redirect URL here
      // } else {
      // }
    } else {
      // closeAndRedirect({
      //   parentStatusMessage: 'REJECTED',
      //   delay: true,
      //   decrypt,
      //   url: decrypt?.redirect,
      //  });
      navigate('/accountNotConnected')
    }
  }

  // On deny bottom sheet click Deny will redirect to url page
  async function onClickExit() {
    handleReject()
    // navigate('/accountNotConnected')
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "click",
          "page_name": "aa_consent_denial_reason",
          "bank_name": FiDetails.fipid,
          "source": "",
          "cta_text": "Deny",
          "event_name": "aa_linking_cta_clicked"
        }
      ]
    }
    EventtrackerApi(event);
    // const urlparams = await GenerateEncryptedUrl(redirectUrl, ecres, FiDetails.fiuid)
    // if (!(redirectUrl === '')) {
    //   window.location.replace(urlparams) // Replace Redirect URL here
    // } else {
    // }
  }

  const fiCategoryRender: any = () => {
    const bankFi = [
      {
        id: 1,
        name: 'Don’t understand about linking Bank Accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my bank account',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]
  
    const GstFi = [
      {
        id: 1,
        name: 'Don’t understand about linking Accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my GST account',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]
  
    const MfFi = [
      {
        id: 1,
        name: 'Don’t understand about linking Accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my folios',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]
  
    const EQUITIES = [
      {
        id: 1,
        name: 'Don’t understand about linking Accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my DP ID account',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]
  
    const NPS = [
      {
        id: 1,
        name: 'Don’t understand about linking Accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my NPS account',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]
  
    const Insurance = [
      {
        id: 1,
        name: 'Don’t understand about linking Accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my insurance policies',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]

    const MultiFi = [
      {
        id: 1,
        name: 'Don’t understand about linking accounts',
      },
      {
        id: 2,
        name: 'Fearful of data being misused!',
      },
      {
        id: 3,
        name: 'Couldn’t find my account',
      },
      {
        id: 4,
        name: 'Other',
      }
    ]

    if(FICategory.split(',').length == 1){
    if (XORDecryptRes?.fiCategory === "BANK") {
      return bankFi;
    }
    else if (XORDecryptRes?.fiCategory === "GSTR") {
      return GstFi;
    }
    else if (XORDecryptRes?.fiCategory === "MF") {
      return MfFi;
    }
    else if (XORDecryptRes?.fiCategory === "EQUITIES") {
      return EQUITIES;
    }
    else if (XORDecryptRes?.fiCategory === "NPS") {
      return NPS;
    }
    else if (XORDecryptRes?.fiCategory === "INSURANCE_POLICIES") {
      return Insurance;
    }
  }else{
      return MultiFi;
  }

  }

  useEffect(()=>{
    if(isOpen){
      setSelectedRadio("")
      setInputValue("Didn’t receive OTP for verification")
    }
  },[isOpen])

  const handleRadioClick = (value: string) => {
    setSelectedRadio(value)
    setInputValue(value)
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      className="modal-transition"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
          position: 'fixed',
          // left: '50%',
          // right: 'auto',
          // transform: 'translate(-50%, 0)',
          width: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'fit-content',
          border: 'none',
          borderRadius: '20px 20px 0 0',
          background: 'var(--Background_color)',
          padding: '0',
          boxShadow:
            '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 6px 12px rgba(0, 0, 0, 0.12), 0px 1px 16px rgba(0, 0, 0, 0.12)',
          bottom: '0',
          // top: 'auto',
          // marginTop: 'auto'
        }
      }}
    >
      <div className=''>
        <div className='flex flex-col justify-end  '>
          <div className='warning-deny'>
            <img
              className='warning-gif'
              src={images.warnings}
            />
            <h6>Are you sure you won’t connect?</h6>
            <p>Please select a reason why are you denying the consent:</p>
          </div>
          <div className='flex flex-col warning-designs '>
            {/* <div className='overflow-auto max-h-56'> */}
              <ul className=''>
                <li className='exit-fullbox '>
                  {fiCategoryRender()?.map((list:any)=> (
                  <div 
                    className='exit-box'
                    onClick={() => {
                      handleRadioClick(list.name)
                    }}
                  >
                    <input
                      readOnly
                      value='radio_1'
                      checked={selectedRadio === list.name}
                      name='radioDeny'
                      id='radio1'
                      type='checkbox'
                      className='suggest-radio'
                    />
                    <label className='w-full suggest-radio-text '>
                       {list.name}
                      
                    </label>

                  </div>))}
                </li>
              </ul>
            {/* </div> */}
          </div>
          <div className=' offer_card  '>
            <span className='offer_text'>
              Over 3 lakh users have securely shared their account details for 100% accurate financial data for a faster, seamless processing.
            </span>
          </div>

          <div className='flex justify-between  deny-exited '>
            <div className='w-full '>
              <ButtonGray
                name={'Deny and Exit'}
                bgColor='bg-red'
                textColor='text-black'
                borderColor='border-black border-2'
                disabled={selectedRadio === ""}
                onClick={() => {
                  onClickExit()
                }}
              ></ButtonGray>
            </div>
            <div className=' w-full  '>
              {/* On deny Bottom Sheet Close */}
              <Button name={'Cancel'} onClick={handleClose} bgColor='bg-[#017AFF]' textColor='var(--Text_color)'></Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
