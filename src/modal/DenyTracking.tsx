import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import Heading from '../component/heading/Heading'
import images from '../assets/images'
import Button from '../component/button/Button'
import {
  // UUID as UUIDAtom,
  // FIPDetailsList as FIPDetailsListAtom,
  redirectUrl as redirectUrlAtom,
  XORDecryptRes as XORDecryptResAtom,
  FiDetails as FiDetailsAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { EventtrackerApi } from '../services/api/event'
import { useNavigate } from 'react-router'
// import Encrypt from '../services/encrypt'
// import moment from 'moment'
// import { GenerateEncryptedUrl } from '../services/AaRedirection'
interface modalProps {
  handleClose?: React.MouseEventHandler
  OnExit?: React.MouseEventHandler
  pageName?: any
  isOpen: boolean
}

export default function DenyTracking ({
  handleClose,
  pageName,
  isOpen
}: // OnExit
modalProps): ReturnType<React.FC> {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState("Didn't receive OTP from bank");
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const ecres = {
    fipid: '',
    addfip: XORDecryptRes.addfip,
    txnid: XORDecryptRes.txnid,
    sessionid: XORDecryptRes.sessionId,
    userid: XORDecryptRes.userId,
    srcref: XORDecryptRes.consentId,
    redirect: redirectUrl,
    status: 'F',
    errorcode: '2'
  }
  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };
  /* 5.	Back Pressed and Exit Clicked ->here on click Exit page will redirect to Redirection url */
  useEffect(() => {
    if (isOpen) {
      const event = {
        "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "page",
          "page_name": "aa_finvu_otp",
          "event_name": "aa_exit_page_view",
          "source": "",
          "bank_name": FiDetails.fipid
          }
        ]
       }
       EventtrackerApi(event);
    }
  }, [isOpen])
  
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
      className={'h-[auto] w-full modal-transition'}
    >
      <div className="w-full  fixed px-[16px] pt-[5px] pb-[40px] bottom-0  bg-[var(--Background_color)] rounded-t-lg">
      <div className='flex flex-col justify-between'>
            <div className=''>
              <img
                className='mr-2 md:mr-4 w-[10%]'
                src={images.warningimg}
              />
            </div>
      <div>Are you sure you wont track?</div>
      <div>Please select a reason why are you denying the consent:</div>
        <div className="pt-[20px]">
          <ul className="w-full ">
            <li className="w-full ">
              <div className="flex items-center">
                <label
                  htmlFor="noOtp"
                  className="w-full pb-1 text-base font-medium text-black"
                >
                  {"Didn't receive OTP from bank"}
                </label>
                <input
                  defaultChecked
                  id="noOtp"
                  type="radio"
                  value="Didn't receive OTP from bank"
                  onChange={handleInputChange}
                  name="list-radio"
                  className="w-4 h-4 rounded-full  bg-[var(--Background_color)] border-gray-300 focus:border-transparent focus:ring-0 checked:text-[var(--Primary_button_color)]"
                />
              </div>
            </li>
            <li className="w-full ">
              <div className="flex items-center">
                <label
                  htmlFor="noLinking"
                  className="w-full pb-1 text-base font-medium text-black"
                >
                  {'Not interested in linking'}
                </label>
                <input
                  id="noLinking"
                  type="radio"
                  value="Not interested in linking"
                  onChange={handleInputChange}
                  name="list-radio"
                  className="w-4 h-4 rounded-full  bg-[var(--Background_color)]border-gray-300 focus:border-transparent focus:ring-0 checked:text-[var(--Primary_button_color)]"
                />{' '}
              </div>
            </li>
            <li className="w-full">
              <div className="flex items-center">
                <label
                  htmlFor="noSecurity"
                  className="w-full pb-1  text-base font-medium  text-black"
                >
                  {'Not sure about data security'}
                </label>
                <input
                  id="noSecurity"
                  type="radio"
                  value="Not sure about data security"
                  onChange={handleInputChange}
                  name="list-radio"
                  className="w-4 h-4 rounded-full  bg-[var(--Background_color)]border-gray-300 focus:border-transparent focus:ring-0 checked:text-[var(--Primary_button_color)]"
                />{' '}
              </div>
            </li>
            <li className="w-full">
              <div className="flex items-center">
                <label
                  htmlFor="other"
                  className="w-full pb-1 text-sm font-medium  text-black"
                >
                  {'Other'}
                </label>
                <input
                  id="other"
                  type="radio"
                  value="Other"
                  onChange={handleInputChange}
                  name="list-radio"
                  className="w-4 h-4 rounded-full  bg-[var(--Background_color)]border-gray-300 focus:border-transparent focus:ring-0 checked:text-[var(--Primary_button_color)]"
                />{' '}
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-[#E8F4FD] px-[16px] py-[12px] rounded-lg my-[20px]">
          <p className="font-[400] text-[13px] ">
            12 lakh+ people have tracked their bank accounts and have benefited
            in achieving their financial goals.
          </p>
        </div>
        <div className="flex  justify-between ">
          <div className="w-full mr-2">
            <Button
              name={'Exit & go Back'}
              onClick={() => {
                // onClickExit()
                navigate('/accountNotConnected')
              }}
              bgColor="bg-[var(--Background_color)]"
              textColor="text-[var(--Text_color)]"
              borderColor="border-[var(--Text_color)] border-2"
            ></Button>
          </div>
          <div className=" w-full ml-2">
            <Button name={'Track Now'}></Button>
          </div>
        </div>
      </div>
      </div>
    </Modal>
  )
}
