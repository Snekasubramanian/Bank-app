import React, { useEffect, useState } from 'react'
import images from '../assets/images/index'
import Modal from 'react-modal'
import Heading from '../component/heading/Heading'
import Button from '../component/button/Button'
import { useRecoilState } from 'recoil'
import {
  redirectUrl as redirectUrlAtom,
  XORDecryptRes as XORDecryptResAtom,
  FiDetails as FiDetailsAtom
} from '../services/recoil-states/atom'
import { EventtrackerApi } from '../services/api/event'
import ButtonGray from '../component/button/ButtonGray'
import { useNavigate } from 'react-router'

interface buttonProps {
  handleClose?: React.MouseEventHandler
  isOpen: boolean
  onSubmitbtn: any
}
export default function ImportentModal({
  handleClose,
  isOpen,
  onSubmitbtn
}: buttonProps): JSX.Element {
  const navigate = useNavigate()
  const [selectedRadio, setSelectedRadio] = useState('radio_1')
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
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

  // On deny bottom sheet click Deny will redirect to url page
  async function onClickExit() {
    navigate('/accountNotConnected')
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
  const handleRadioClick = (value: string) => {
    setSelectedRadio(value)
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
          // marginRight: '-50%',
          // transform: 'translate(-50%, 0)',
          width: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'fit-content',
          border: 'none',
          background: 'var(--Background_color)',
          borderRadius: '20px 20px 0 0',
          padding: '0',
          boxShadow:
            '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 6px 12px rgba(0, 0, 0, 0.12), 0px 1px 16px rgba(0, 0, 0, 0.12)',
          bottom: '0',
          // top: 'auto',
          marginTop: 'auto'
        }
      }}
    >

      <div className='flex flex-col justify-end import-modal '>
        <div className='import-deny'>
          <img
            className='warning-gif'
            src={images.warnings}
          />
          <h6>Important notice</h6>
          <p>You have more accounts to link. Linking more accounts helps to better asses your financial information.</p>
        </div>
        <div className=' deny_card  '>
          <span className='offer_text'>
            Over 3 lakh users have securely shared their account details for 100% accurate financial data for a faster, seamless processing.
          </span>
        </div>
        <div className='flex justify-between  import-exited '>
          <div className='w-full '>
            <ButtonGray
              name={'Submit'}
              bgColor='bg-red'
              textColor='text-black'
              borderColor='border-black border-2'
              onClick={onSubmitbtn}
            ></ButtonGray>
          </div>
          <div className=' w-full'>
            {/* On deny Bottom Sheet Close */}
            <Button name={'Cancel'} onClick={handleClose} bgColor='bg-[#017AFF]' textColor='var(--Text_color)'></Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
