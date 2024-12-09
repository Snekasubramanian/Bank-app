import React, { useState } from 'react'
import image from '../../assets/images/index'
import DenyAndExit from '../../modal/DenyAndExit'
import DenyTracking from '../../modal/DenyTracking'
import {
  UUID as UUIDAtom,
  discoveredData as discoveredDataAtom,
  XORDecryptRes as XorDecryptResAtom,
  refNumber as refNumberAtom,
  FIPDetailsList as FIPDetailsListAtom,
  FiDetails as FiDetailsAtom,
  redirectUrl as redirectUrlAtom,
  imgUrl as imgUrlAtom
} from '../../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { EventtrackerApi } from '../../services/api/event'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close';

interface HeadingProps {
  Backbtn: boolean
  closebtn: boolean
  checked: boolean
}

export default function Heading({
  Backbtn,
  closebtn,
  checked
}: HeadingProps): ReturnType<React.FC> {
  const [logo] = useRecoilState<any>(imgUrlAtom)
  const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [, setRefNumber] = useRecoilState(refNumberAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [open, setOpen] = React.useState(false)
  const [isModal, setIsModal] = useState(false)
  const [isModalTrack, setIsModalTrack] = useState(false)

  const onClickDeny = () => {
    setIsModal((prev: boolean) => !prev)
    if (!isModal) {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "page",
            "page_name": "aa_consent_denial_reason",
            "bank_name": FiDetails.fipid,
            "source": "",
            "event_name": "aa_linking_page_view"
          }
        ]
      }
      EventtrackerApi(event);
    } else {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "click",
            "event_name": "aa_consent_screen_reason_cta_clicked",
            "page_name": "aa_consent_screen",
            "bank_name": FiDetails.fipid,
            "source": "",
            "cta_text": "Close"
          }
        ]
      }
      EventtrackerApi(event);
    }
  }
  /* 5.	Back Pressed and Exit Clicked ->here on back button click popup modal will Open */
  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }
  return (
    <>
      <div className='sticky'>
        <div className='Header-box'>
          <div className='Back_arrow_box'>
            {Backbtn && (
              <div className='Back_arrow'
                onClick={() => {
                  if (window.location.pathname === '/' || window.location.pathname === '/accountNotConnected') {
                  } else if (checked) {
                  } else {
                    history.back()
                  }
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M20 11.5H7.83L13.42 5.91L12 4.5L4 12.5L12 20.5L13.41 19.09L7.83 13.5H20V11.5Z" fill="#4B4B4B" />
                </svg>
              </div>
              // <ArrowBackIcon className='Back_arrow' 
              // onClick={() => {
              //  if(window.location.pathname === '/' || window.location.pathname === '/accountNotConnected'){
              //  }else if(checked){
              //  }else{
              //   history.back()
              //  }
              //   }}/>
              //     <img className='Back_arrow'

              //       onClick={() => {
              //         if (window.location.pathname === '/' || window.location.pathname === '/accountNotConnected') {
              //         } else if (checked) {
              //         } else {
              //           history.back()
              //         }
              //       }} src={image.BackArrow}>
              // </img>
            )}
          </div>
          <div className='heading_logo_box'>
            {/* <img className='heading_logo' src={image.logo}></img> */}
            {/* <img className='heading_logo' src={``}></img> */}
            {logo === ''
              ? <img className='heading_logo' src={`https://uat.camsfinserv.com/newuat/assets${XORDecryptRes.logo}`}></img>
              : <img className='heading_logo' src={image.Yourlogo}></img>
            }
          </div>
          <div className='cross_button_box' >
            {closebtn && (
              //  <img className='cross_button' onClick={() => {
              //       onClickDeny()
              //     }} src={image.close}></img>
              <div className='cross_button' onClick={() => {
                onClickDeny()
              }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z" fill="#666666" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModal && <DenyAndExit
        handleClose={onClickDeny}
        isOpen={isModal}
        OnExit={onClickDeny}
      ></DenyAndExit>}
      <DenyTracking
        isOpen={isModalTrack}
        // OnExit={onClickDenyTrack}
        handleClose={onClickDenyTrack}
      ></DenyTracking>
    </>
  )
}
