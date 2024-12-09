import React, { useEffect } from 'react'
import Button from '../component/button/Button'
import images from '../assets/images/index'
import Modal from 'react-modal'
import moment from 'moment'
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';

// import { useNavigate } from 'react-router'
import {
  CONSENT_HEADER,
  CONSENT_PURPOSE,
  CONSENT_CONTENT,
  CONSENT_BASIC_INFO,
  CONSENT_DETAILS_EXPIRE,
  CONSENT_DETAILS_REQUEST,
  CONSENT_DETAILS_SHARED,
  CONSENT_DETAILS_UPDATE
} from './consentBottomSheetConst'
import {
  XORDecryptRes as XorDecryptResAtom
} from '../services/recoil-states/atom'
import { EventtrackerApi } from '../services/api/event'
import { useRecoilState } from 'recoil'
import { useSelector } from 'react-redux';
import { RootStateType } from '../store/reducers'
import { BankState } from '../store/types/bankListType'

interface buttonProps {
  handleClose?: any
  open: boolean
  index: any
  // fromDate: string
  // toDate: string
  // concentExpDate: string
  // concentReqDate: string
  // accountType: string
  // concentTypes: string
  // frequencyValue: string
  // frequencyUnit: string
  // purposeDesc: string
  // fetchType: string
}
export default function ConsentBottomSheet({
  handleClose,
  open,
  index,
  // concentExpDate,
  // concentReqDate,
  // fromDate,
  // toDate,
  // accountType,
  // concentTypes,
  // frequencyValue,
  // frequencyUnit,
  // purposeDesc,
  // fetchType
}: buttonProps): JSX.Element {
  const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [view, setView] = React.useState(false)
  const { consentData, consentDetails } = useSelector<RootStateType, BankState>((state) => state.bank);
  const consentdetails = consentDetails[0]
  const viewMoreClick = () => {
    setView((prev) => !prev)
  }

  useEffect(() => {
    if (open) {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "page",
            "page_name": "aa_consent_details_bottomsheet",
            "source": "",
            "event_name": "aa_linking_page_view"
          }
        ]
      }
      EventtrackerApi(event);
      setView(false)
    }
  }, [open])
  function formatDate(date: string) {
    const months: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec'
    ]

    const formattedDate = new Date(date)
    const day = formattedDate.getDate()
    const month = months[formattedDate.getMonth()]
    const year = formattedDate.getFullYear().toString().slice(-2)

    let suffix = 'th'
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st'
    } else if (day === 2 || day === 22) {
      suffix = 'nd'
    } else if (day === 3 || day === 23) {
      suffix = 'rd'
    }
    const formattedDay = `${day}${suffix}`
    return `${formattedDay} ${month}'${year}`
  }
  const consentExpireDate = moment(consentdetails.CONSENTEXPIRYDATETIME).format('l')
  const consentRequestDate = moment(consentdetails.CONSENTSTARTDATETIME).format('l')
  const consentFromDate = moment(consentdetails.FIDATAFROMDATE).format('l')
  const concentToDate = moment(consentdetails.FIDATATODATE).format('l')
  //const consentDetailsUpdate = `${frequencyValue} times in a ${frequencyUnit ? frequencyUnit[0].toUpperCase() + frequencyUnit.substring(1).toLowerCase() : ""} `
  const consentDetailsUpdate = `${consentdetails?.FETCHTYPE ? consentdetails?.FETCHTYPE[0].toUpperCase() + consentdetails?.FETCHTYPE.substring(1).toLowerCase() : ''}`
  let ConsentTypes = ""
  let accountTypes = ""
  const consentType = consentdetails.CONSENTTYPES?.split(",")
  const consentTypes = consentType?.map((value: any, index: number) => {
    if (index === consentType.length - 1) {
      ConsentTypes = ConsentTypes + value[0].toUpperCase() + value.substring(1).toLowerCase()
    } else {
      ConsentTypes = ConsentTypes + value[0].toUpperCase() + value.substring(1).toLowerCase() + ", "
    }
  })
  const AccountType = consentdetails.FITYPES?.split(",")
  const AccountTypes = AccountType?.map((value: any, index: number) => {
    if (index === AccountType.length - 1) {
      accountTypes = accountTypes + value[0].toUpperCase() + value.substring(1).toLowerCase()
    } else {
      accountTypes = accountTypes + value[0].toUpperCase() + value.substring(1).toLowerCase() + ", "
    }
  })

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  return (
    <Modal
      isOpen={open}
      onRequestClose={handleClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      className="modal-transition"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
          position: 'fixed',  
          // transform: 'translate(-50%, 0)',
          width: '100%',
          maxWidth: '100%',
          maxHeight: '90%',
          height: 'fit-content',
          border: 'none',
          borderRadius: '20px 20px 0 0',
          background: 'var(--Background_color)',
          overflow: 'scroll',
          padding: '0',
          boxShadow:
            '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 6px 12px rgba(0, 0, 0, 0.12), 0px 1px 16px rgba(0, 0, 0, 0.12)',
          bottom: '0',
        }
      }}
    >
      <div className='consent-design'>
        <div className="">
          <div className=' drawer-heighted consent-height'>
            <div className='consent-bottom'>
              <img className=' secure_icon' src={images.lockInfo} alt='tick' />
              <h2 className='consent_header'>
                {CONSENT_HEADER}
              </h2>
              <h4 className='consent_subTitle'>
                RBI Regulated CAMSfinserv enables you to securely share your financial data with {XORDecryptRes.fiuName}, ensuring 100% safety through end-to-end encryption.
              </h4>
            </div>
            <div className="consent_height">
              <div className="link-boxx">
                {/* {consentData.length > 1 && <div className='consent-head'>
                  <h5>CONSENT {index + 1}</h5>
                </div>} */}
                <div className='consent_box'>
                  <div className='top_consent'>
                    <h6 className='constent_detail_title'>
                      {CONSENT_PURPOSE}
                    </h6>
                    <h5 className='constent_detail_subTitle'>
                      {consentdetails.PURPOSEDESC}
                    </h5>
                  </div>
                  <div className='top_consent'>
                    <h6 className='constent_detail_title'>
                      {CONSENT_DETAILS_SHARED}
                    </h6>
                    <h5 className='constent_detail_subTitle'>
                      {consentFromDate} to {concentToDate}
                    </h5>
                  </div>
                  <div className='top_consent'>
                    <h6 className='constent_detail_title'>
                      {CONSENT_DETAILS_UPDATE}
                    </h6>
                    <h5 className='constent_detail_subTitle'>
                      {consentDetailsUpdate}
                    </h5>
                  </div>
                  <div id='divModalContent' className={view ? 'view-consent' : 'hidden'}>
                    <div className='consent_bottom'>
                      <h6 className='constent_detail_title'>
                        {CONSENT_DETAILS_REQUEST}
                      </h6>
                      <h5 className='constent_detail_subTitle'>
                        {consentRequestDate}
                      </h5>
                    </div>
                    <div className='consent_bottom'>
                      <h6 className='constent_detail_title'>
                        {CONSENT_DETAILS_EXPIRE}
                      </h6>
                      <h5 className='constent_detail_subTitle'>
                        {consentExpireDate}
                      </h5>
                    </div>

                    <div className='consent_bottom'>
                      <h6 className='constent_detail_title'>
                        {CONSENT_BASIC_INFO}
                      </h6>
                      <h5 className='constent_detail_subTitle consent-line'>
                        <p className='capitalize'>Account Information: {ConsentTypes}</p>
                        <p className='capitalize consent_bottom'>Account Type: {accountTypes}</p>
                      </h5>

                    </div>
                  </div>
                  <div
                    id='viewMoreDiv'
                    className='view-flex'
                    // View Consent Details Click
                    onClick={viewMoreClick}>
                    <div className=''>
                      {view ? <p className='view_more'> View Less</p> : <p className='view_more'>View More </p>}
                    </div>
                    {view
                      ? (
                        <img src={images.expend_false}></img>
                      )
                      : (
                        <img src={images.expend_true}></img>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='consent-button'>
          <Button onClick={handleClose} name='Got it!'></Button>
        </div>
      </div>
    </Modal>
  )
}
