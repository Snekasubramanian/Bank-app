import React from 'react'
import Modal from 'react-modal'
import Heading from '../component/heading/Heading'
import images from '../assets/images'
import Button from '../component/button/Button'
import {
  redirectUrl as redirectUrlAtom,
  XORDecryptRes as XORDecryptResAtom,
  FiDetails as FiDetailsAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { closeAndRedirect } from '../services/AaRedirection'
import ButtonGray from '../component/button/ButtonGray'

interface modalProps {
  handleClose?: React.MouseEventHandler
  OnExit?: React.MouseEventHandler
  isOpen: boolean
  nextNavigate:any
}
export default function NotifyModal ({
  isOpen,
  nextNavigate,
  handleClose
}: modalProps): ReturnType<React.FC> {
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const checkValue : boolean  = false;
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
  // on click notify
  async function onClickNotify () {
    closeAndRedirect({
      parentStatusMessage: 'REJECTED',
      delay: true,
      decrypt:XORDecryptRes,
      url: redirectUrl,
    });
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
          <h6>You have more accounts to link!</h6>
          <p>Do you wish to proceed without linking accounts?</p>
        </div>
        <div className=' deny_card  '>
          <span className='offer_text'>
          3 lakh+ users have securely shared their accounts with 100% accurate financial data for a faster, seamless account verification.
          </span>
        </div>
        <div className='flex justify-between  import-exited '>
          <div className='w-full '>
            <ButtonGray
              name={'No'}
              bgColor='bg-red'
              textColor='text-black'
              borderColor='border-black border-2'
              onClick={handleClose}
            ></ButtonGray>
          </div>
          <div className=' w-full'>
            {/* On deny Bottom Sheet Close */}
            <Button name={'Yes, Proceed'}    onClick={nextNavigate}  bgColor='bg-[#017AFF]' textColor='var(--Text_color)'></Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
