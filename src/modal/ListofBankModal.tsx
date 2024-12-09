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
  // onSubmitbtn : any
  setIsOpen: any
  choosebanklist: any

}
export default function ListofBankModal({
  handleClose,
  isOpen,
  setIsOpen,
  choosebanklist
}: buttonProps): JSX.Element {
  const navigate = useNavigate();

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
      <div className="list-modal">
        <div className="list-bank">
          <h5>List of available banks</h5>

          <ul>
            {/* <li>Allahabad Bank</li>
            <li> Andhra Bank</li>
            <li> Axis Bank</li>
            <li>Bank of Bahrain and Kuwait</li>
            <li> Bank of Baroda - Corporate Banking</li>
            <li> Bank of Baroda - Retail Banking</li>
            <li> Bank of India</li>
            <li>Bank of Maharashtra</li>
            <li> Canara Bank</li>
            <li> Central Bank of India</li>
            <li> City Union Bank</li> */}
            {choosebanklist.map((value: any)=>(
              <li key={value.FIPID}>{value.FIPNAME}</li>
            ))}
          </ul>
        </div>

        <div className="list-button">
          <button onClick={handleClose} className='button-close'>Close</button>
        </div>

      </div>
    </Modal>
  )
}
