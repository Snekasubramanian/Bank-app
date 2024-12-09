import React, { useState } from 'react'
import images from '../assets/images'
import Button from '../component/button/Button'
import Heading from '../component/heading/Heading'
import BackButton from '../component/back-button/BackButton'
import Footer from '../component/footer/Footer'
import { useNavigate } from 'react-router'
import Encrypt from '../services/encrypt'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import {
  UUID as UUIDAtom,
  FiDetails as FiDetailsAtom,
  XORDecryptRes as XORDecryptResAtom,
  ResgisterNum as resgisterNumAtom,
  discoveredData as discoveredDataAtom,
  nolinkedAccount as nolinkedAccountAtom,
  LinkedMobileNum as linkedMobileNumAtom,
  AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import DenyTracking from '../modal/DenyTracking'
import NotifyModal from '../modal/NotifyModal'
import { EventtrackerApi } from '../services/api/event'
import { useDispatch, useSelector } from 'react-redux';
import { BankState, CHOOSE_BANK_LIST, NO_ACCOUNTS_LIST } from '../store/types/bankListType'
import { RootStateType } from '../store/reducers'
import image from '../assets/images/index'
import Modifydrawer from './Modifydrawer'
import ChoosebankModal from './ChoosebankModal'

export default function WarningPage(): JSX.Element {
  let buttonName = ''
  const checkValue: boolean = false;
  const [isClick, setIsClick] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenbank, setIsOpenbank] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedCard, setSelectedCard] = useState('Check1')
  const [selectedButton, setSelectedButton] = useState('Check1')
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [nolinkedAccount] = useRecoilState<any>(nolinkedAccountAtom);
  const [UUID] = useRecoilState(UUIDAtom)
  const [LinkedMobileNum] = useRecoilState<any>(linkedMobileNumAtom)
  const [AlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [isNotifyModal, setisNotifyModal] = useState(false)
  const [FiDetails, setFiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [ResgisterNum] = useRecoilState<any>(resgisterNumAtom)
  const { accountnotfoundResponse, TryAgainCount, FITypes, ActiveFICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
  let isRemindMe = TryAgainCount >= 2
  let newFipdis: any = [];
  newFipdis = FiDetails.fipid;



  const deleteCard = (id: any) => {
    const newArr = accountnotfoundResponse?.filter((val: any, index: number) => index !== id);
    dispatch({
      type: NO_ACCOUNTS_LIST,
      body: newArr
    });
    let remainFipId = newFipdis.filter((val: any, index: number) => index !== id)
    setFiDetails({ fipid: remainFipId.length ? remainFipId : XORDecryptRes.fipid.split(",") })
    // let newList = accountnotfoundResponse.pop(newArr)
  }

  const notifyMePayload = {
    I_MOBILENUMBER: XORDecryptRes.mobileNumber,
    I_BROWSER: 'Chrome',
    I_SESSION: XORDecryptRes.sessionId,
    I_USERID: XORDecryptRes.mobileNumber,
    I_FIPNAME: 'finsharebank', // Ask
    UUID,
    I_FIUNAME: FiDetails.fiuName
  }
  const handleCardClick = (value: string) => {
    setSelectedCard(value)
  }
  const onClickNotifyButton = () => {
    // setisNotifyModal((prev: boolean) => !prev)
  }
  // on click notify button
  const getNotifyMe = async () => {
    const encryptedPayload = Encrypt(
      'Encrypt',
      JSON.stringify(notifyMePayload)
    )
    try {
      const apiData = UseApi('POST', 'NotifyMe', encryptedPayload)
      const data = await apiData
      const decryptedResponse = Decrypt('Decrypt', data)
    } catch (error) {
    }
  }

  const onClickBtn = async () => {
    if (selectedButton === 'Check1') {
      if (isRemindMe) {
        navigate("/RemindLater")
      } else {
        navigate('/lottieLoader')
      }
    } else if (selectedButton === 'Check2') {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "click",
            "page_name": "aa_no_linked_accounts",
            "bank_name": FiDetails.fipid,
            "source": "",
            "cta_text": "Modify Mobile Number",
            "event_name": "aa_linking_cta_clicked"
          }
        ]
      }
      EventtrackerApi(event);
      navigate('/entermobilenumber')
    }
    else if (selectedButton === 'Check3') {
      if (ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') {
        navigate("/PanRequired")
      } else {
        navigate('/choose-bank');
      }
    }
  }
  // Back Pressed and Exit Clicked
  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }

  const handleButtonClick = (value: string) => {
    setSelectedButton(value);
  }

  if (selectedButton === 'Check1') {
    if (isRemindMe) {
      buttonName = 'Remind later'
    } else {
      buttonName = 'Try again'
    }
  } else if (selectedButton === 'Check2') {
    buttonName = 'Modify number'
  } else if (ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') {
    buttonName = 'Modify PAN'
  } else if (ActiveFICategory === 'INSURANCE_POLICIES') {
    buttonName = 'Change insurer'
  }
  else {
    buttonName = 'Change bank'
  }

  const mobileClick = () => {
    if (AlreadyLinkedMobileNum) {
      return AlreadyLinkedMobileNum;
    } else if (LinkedMobileNum) {
      return LinkedMobileNum;
    } else {
      return XORDecryptRes.mobileNumber
    }
  }
  const modifyhandler = () => {
    setIsOpen(true)
  }
  const closeDrawer = () => {
    setIsOpen(false);
  }
  const choosebankhandler = () => {
    setIsOpenbank(true)
  }
  const closeDrawers = () => {
    setIsOpenbank(false);
  }
  return (
    <>
      <div className="warning_page"> {/* p-[16px] */}

        <Heading
          checked={checkValue}
          Backbtn={false}
          closebtn={true}
        />
        <div className=" main-body"> {/* pt-[20px]  */}
          <div className="warning-head">
            <h6  >
              Oh no! We were unable to discover your accounts </h6>
            {ActiveFICategory === 'BANK' && <p className='warning_subcontent'>
              There are no accounts linked to +91 {AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber}
            </p>}
            {ActiveFICategory === 'GSTR' && <p className='warning_subcontent'>
              There are no GST linked to {XORDecryptRes.pan.toUpperCase()} and +91 {AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber}
            </p>}
            {ActiveFICategory === 'MF' && <p className='warning_subcontent'>
              There are no mutual fund linked to {XORDecryptRes.pan.toUpperCase()} and +91 {AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber}
            </p>}
            {ActiveFICategory === 'EQUITIES' && <p className='warning_subcontent'>
              There are no investments linked to {XORDecryptRes.pan.toUpperCase()} and +91 {AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber}
            </p>}
            {ActiveFICategory === 'NPS' && <p className='warning_subcontent'>
              Your NPS account is not linked to +91 {AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber}
            </p>}
            {ActiveFICategory === 'INSURANCE_POLICIES' && <p className='warning_subcontent'>
              There are no policy linked to +91 {AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber}
            </p>}
          </div>
          {ActiveFICategory === 'BANK' && !isRemindMe && <div className="banks-design">
            <h5 className='bankheading'>
              Selected banks
            </h5>
            <div className={isClick ? '' : 'bankcards'}>

              {accountnotfoundResponse.map((item: any, index: number) => {
                return (
                  <div className={'selectbanklist'}>
                    <div className='banklist'>
                      <div className='bankcardlist'>
                        {/* <span>HDFC Bank</span> */}
                        {item.Logo ?
                          <img src={`https://uat.camsfinserv.com/newuat/assets${item.Logo}`} style={{ width: 25, height: 25 }}></img> :
                          <img className='warning-logo' src={image.Bank}></img>
                        }
                        <span key={index}>{item.FIPNAME}</span>
                      </div>
                      <div className='closeBtn'>
                        <button
                        //  onClick={() => { deleteCard(index) }} 
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path d="M13.1668 4.27325L12.2268 3.33325L8.50016 7.05992L4.7735 3.33325L3.8335 4.27325L7.56016 7.99992L3.8335 11.7266L4.7735 12.6666L8.50016 8.93992L12.2268 12.6666L13.1668 11.7266L9.44016 7.99992L13.1668 4.27325Z" fill="#A5A5A5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>}
          {ActiveFICategory === 'INSURANCE_POLICIES' && !isRemindMe && <div className="banks-design">
            <h5 className='bankheading'>
              Selected Insurer
            </h5>
            <div className={isClick ? '' : 'bankcards'}>

              {accountnotfoundResponse.map((item: any, index: number) => {
                return (
                  <div className='selectbanklist insure-list'>
                    <div className='banklist'>
                      <div className='bankcardlist'>
                        {/* <span>HDFC Bank</span> */}
                        {item.Logo ?
                          <img src={`https://uat.camsfinserv.com/newuat/assets${item.Logo}`} style={{ width: 25, height: 25 }}></img> :
                          <img className='heading_logo' src={XORDecryptRes.fiCategory === 'INSURANCE_POLICIES' ? image.Insurance : image.Bank}></img>
                        }
                        <span key={index}>{item.FIPNAME}</span>
                      </div>
                      <div className='closeBtn'>
                        <button
                        // onClick={() => { deleteCard(index) }} 
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path d="M13.1668 4.27325L12.2268 3.33325L8.50016 7.05992L4.7735 3.33325L3.8335 4.27325L7.56016 7.99992L3.8335 11.7266L4.7735 12.6666L8.50016 8.93992L12.2268 12.6666L13.1668 11.7266L9.44016 7.99992L13.1668 4.27325Z" fill="#A5A5A5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>}
          {!isRemindMe && (ActiveFICategory === 'BANK' || ActiveFICategory === 'INSURANCE_POLICIES') && <div className='straight-line'>
          </div>}
          <div className='card-list'>
            <div
              className={`${selectedCard === 'Check1' ? 'carddetails' : ''}   ${selectedCard === 'Check1' ? 'warning-cartbox' : 'warning-cartbox'
                }`}
              // class={"carddetails"}
              onClick={() => {
                handleCardClick('Check1')
                handleButtonClick('Check1')
              }}
            >
              {isRemindMe ?
                <div className='w-full'>
                  <label className="w-full card-gapss ">
                    <h6>
                      Remind me later!
                    </h6>
                    <p >
                      There might be a technical issue. We can notify to try later.
                    </p>
                  </label>
                </div> :
                <div className='w-full'>
                  {(ActiveFICategory === 'BANK' || ActiveFICategory === 'NPS' || ActiveFICategory === 'EQUITIES' || ActiveFICategory === 'INSURANCE_POLICIES') &&
                    <label className="w-full card-gapss ">
                      <h6>
                        My mobile number is correct
                      </h6>
                      {ActiveFICategory === 'BANK' && <p >
                        Retry with the same bank accounts
                      </p>}
                      {(ActiveFICategory === 'EQUITIES' || ActiveFICategory === 'NPS') && <p >
                        Retry with the same number
                      </p>}
                      {ActiveFICategory === 'INSURANCE_POLICIES' && <p >
                        Retry with the same insurer
                      </p>}
                    </label>}
                  {ActiveFICategory === 'GSTR' &&
                    <label className="w-full card-gapss ">
                      <h6>
                        GST is linked with same information
                      </h6>
                      <p >
                        Retry with the same mobile/PAN
                      </p>
                    </label>}
                  {ActiveFICategory === 'MF' &&
                    <label className="w-full card-gapss ">
                      <h6>
                        MF is linked with same information
                      </h6>
                      <p >
                        Retry with the same mobile/PAN
                      </p>
                    </label>}
                </div>
              }

              <input
                type="checkbox"
                checked={selectedCard === 'Check1'}
                onChange={() => {
                  setSelectedCard('Check1')
                }}
                className="border-warn"
              // value="Check2"
              />
            </div>
            <div
              className={`${selectedCard === 'Check2' ? 'carddetails' : ''}   ${selectedCard === 'Check2' ? 'warning-cartbox' : 'warning-cartbox'
                }`}
              onClick={() => {
                handleCardClick('Check2')
                handleButtonClick('Check2')
              }}
            >
              {(ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES' || ActiveFICategory === 'NPS' || ActiveFICategory === 'INSURANCE_POLICIES' || ActiveFICategory === 'BANK') && <label className="w-full card-gapss">
                {isRemindMe ?
                  <h6 >
                    Try with another mobile
                  </h6> :
                  <h6 >
                    Try with another number
                  </h6>
                }
                <p >
                  Quickly change your number and discover
                </p>
              </label>}
              <input
                type="checkbox"
                checked={selectedCard === 'Check2'}
                onChange={() => {
                  setSelectedCard('Check2')
                }}
                className="border-warn"
              // value="Check2"
              />
            </div>
            {(ActiveFICategory !== 'NPS') && !isRemindMe &&
              <div
                className={`${selectedCard === 'Check3' ? 'carddetails' : ''}   ${selectedCard === 'Check3' ? 'warning-cartbox' : 'warning-cartbox'
                  }`}
                onClick={() => {
                  handleCardClick('Check3')
                  handleButtonClick('Check3')
                }}
              >
                {ActiveFICategory === 'BANK' && <label className="w-full card-gapss">
                  <h6 >
                    It is a joined account?
                  </h6>

                  <p className='joint-paragraph' >
                    Joint accounts are not supported yet, Choose another bank you have an account.

                  </p>
                </label>}
                {(ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') && <label className="w-full card-gapss">
                  <h6 >
                    Try with another PAN
                  </h6>
                  <p>Change your PAN and discover</p>
                </label>}
                {(ActiveFICategory === 'INSURANCE_POLICIES') && <label className="w-full card-gapss">
                  <h6 >
                    Try with another insurer
                  </h6>
                  <p>Change policy insurer and discover</p>
                </label>}
                <input
                  type="checkbox"
                  checked={selectedCard === 'Check3'}
                  onChange={() => {
                    setSelectedCard('Check3')
                  }}
                  className="border-warn"
                // value="Check2"
                />
              </div>}
            {(ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') && isRemindMe &&
              <div
                className={`${selectedCard === 'Check3' ? 'carddetails' : ''}   ${selectedCard === 'Check3' ? 'warning-cartbox' : 'warning-cartbox'
                  }`}
                onClick={() => {
                  handleCardClick('Check3')
                  handleButtonClick('Check3')
                }}
              >
                <label className="w-full card-gapss">
                  <h6 >
                    Try with another PAN
                  </h6>
                  <p>Change your PAN and discover</p>
                </label>
                <input
                  type="checkbox"
                  checked={selectedCard === 'Check3'}
                  onChange={() => {
                    setSelectedCard('Check3')
                  }}
                  className="border-warn"
                // value="Check2"
                />
              </div>}
          </div>
        </div>
        < div className={`bottom_card fixed_bottom  ${selectedCard === '' ? 'bgColor' : 'modal-btn'}`
        }>
            {selectedButton === '' ? '' :
              <Button onClick={onClickBtn} name={buttonName} disabled={selectedButton === ''}></Button>
            }
          <Footer></Footer>

        </div >
      </div >
      {/* Back Pressed and Exit Clicked */}
      < DenyTracking
        isOpen={isModalTrack}
        OnExit={onClickDenyTrack}
        handleClose={onClickDenyTrack} ></DenyTracking >
    </>
  )
}
