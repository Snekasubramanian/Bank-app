import React, { useEffect } from 'react'
import Button from '../component/button/Button'
import images from '../assets/images/index'
import Modal from 'react-modal'
import moment from 'moment'
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
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
interface buttonProps {
  handleClose?: any
  open: boolean
  index: any
}
export default function MultiConsentBottomSheet({
  handleClose,
  open,
  index
}: buttonProps): JSX.Element {
  const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [view, setView] = React.useState(false)
  const { consentData, consentDetails, RequiredValue } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [checkedItems, setCheckedItems] = React.useState<any>({});
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const requiredList: any = []
  const disableList: any = []

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

  useEffect(() => {
    // Set default checked items (e.g., items with id 1 and 2)
    const defaultCheckedItems: any = {}
    consentDetails.map((value: any, index: number) => {
      defaultCheckedItems[`item_${index + 1}`] = true
    })
    // { 'item_1': true, 'item_2': true };
    setCheckedItems(defaultCheckedItems);
  }, []);

  useEffect(() => {
    let validationRequired = requiredList.filter((item: any) => item == true).length;
    if (validationRequired > 0) {
      requiredList.map((value: any, index: number) => {
        if (value === true) {
          if (checkedItems[`item_${index + 1}`] === true) {
            disableList.push(true)
          } else {
            disableList.push(false)
          }
        } else {
          disableList.push(true)
        }
      })
      const isDisabled = disableList.every((value: any) => value === true) ? false : true;
      setButtonDisabled(isDisabled)
    } else {
      requiredList.map((value: any, index: number) => {
        disableList.push(checkedItems[`item_${index + 1}`])
      })
      const isDisabled = disableList.filter((value: any) => value == true).length;
      setButtonDisabled(isDisabled > 0 ? false : true)
    }

  }, [checkedItems])

 

  const handleCheckboxChange = (itemId: any) => {
    setCheckedItems((prevCheckedItems: any) => ({
      ...prevCheckedItems,
      [`${itemId}`]: !prevCheckedItems[`${itemId}`],
    }));
  };

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
          width: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'fit-content',
          border: 'none',
          borderRadius: '20px 20px 0 0',
          background: 'var(--Background_color)',
          overflow: 'auto',
          padding: '0',
          boxShadow:
            '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 6px 12px rgba(0, 0, 0, 0.12), 0px 1px 16px rgba(0, 0, 0, 0.12)',
          bottom: '0',
          // top: 'auto',
          marginTop: 'auto',
        }
      }}
    >
      <div className="multi-consent">
        <div className='consent-bottom'>
          <img className=' secure_icon' src={images.lockInfo} alt='tick' />
          <h2 className='consent_header'>
            {CONSENT_HEADER}
          </h2>
          <h4 className='consent_subTitle'>
            RBI Regulated CAMSfinserv enables you to securely share your financial data with {XORDecryptRes.fiuName}, ensuring 100% safety through end-to-end encryption.
          </h4>
        </div>
        <div className='carousel-side'>
          <AliceCarousel mouseTracking items={
            consentDetails.map((consent: any, index: any) => {
              const consentDetailsUpdate = `${consent?.FETCHTYPE ? consent?.FETCHTYPE[0].toUpperCase() + consent?.FETCHTYPE.substring(1).toLowerCase() : ''}`
              let ConsentTypes = ""
              let accountTypes = ""
              const consentType = consent.CONSENTTYPES?.split(",")
              const consentTypes = consentType?.map((value: any, index: number) => {
                if (index === consentType.length - 1) {
                  ConsentTypes = ConsentTypes + value[0].toUpperCase() + value.substring(1).toLowerCase()
                } else {
                  ConsentTypes = ConsentTypes + value[0].toUpperCase() + value.substring(1).toLowerCase() + ", "
                }
              })
              const AccountType = consent.FITYPES?.split(",")
              const AccountTypes = AccountType?.map((value: any, index: number) => {
                if (index === AccountType.length - 1) {
                  accountTypes = accountTypes + value[0].toUpperCase() + value.substring(1).toLowerCase()
                } else {
                  accountTypes = accountTypes + value[0].toUpperCase() + value.substring(1).toLowerCase() + ", "
                }
              })
              const required = RequiredValue[consent.CONSENTHANDLE] === "N" ? false : true;
              requiredList.push(required)
              return (
                <div className='consent-card'>
                  <div className="consent_height">
                    <div className="consent-header">
                      <div className='checkbox-consent' key={index}>
                        <input
                          type="checkbox"
                          name="list-radio"
                          className='radio-design'
                          // defaultChecked
                          id={`item_${index + 1}`}
                          checked={checkedItems[`item_${index + 1}`] || false}
                          onChange={() => handleCheckboxChange(`item_${index + 1}`)}
                        />
                        <h6>Consent {index + 1}</h6>
                      </div>
                      <p>{required ? "Required" : "Optional"}</p>
                    </div>
                    <div className="link-boxx">
                      <div className='consent_box'>
                        {/* <div className='top_consent'>
                    <h6 className='constent_detail_title'>
                      Your details shared with
                    </h6>
                    <h5 className='constent_detail_subTitle'>
                      Shriram, ABSL, PPFAS, TATA
                    </h5>
                  </div> */}
                        <div className='top_consent'>
                          <h6 className='constent_detail_title'>
                            {CONSENT_PURPOSE}
                          </h6>
                          <h5 className='constent_detail_subTitle'>
                            {consent.PURPOSEDESC}
                          </h5>
                        </div>
                        <div className='top_consent'>
                          <h6 className='constent_detail_title'>
                            {CONSENT_DETAILS_SHARED}
                          </h6>
                          <h5 className='constent_detail_subTitle'>
                            {moment(consent.FIDATAFROMDATE).format('l')} to {moment(consent.FIDATATODATE).format('l')}
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
                              {moment(consent.CONSENTSTARTDATETIME).format('l')}
                            </h5>
                          </div>
                          <div className='consent_bottom'>
                            <h6 className='constent_detail_title'>
                              {CONSENT_DETAILS_EXPIRE}
                            </h6>
                            <h5 className='constent_detail_subTitle'>
                              {moment(consent.CONSENTEXPIRYDATETIME).format('l')}
                            </h5>
                          </div>

                          <div className='consent_bottom'>
                            <h6 className='constent_detail_title'>
                              {CONSENT_BASIC_INFO}
                            </h6>
                            <h5 className='constent_detail_subTitle'>
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
              )
            })
          }
          />
        </div>
        <div className='consent-button'>
          <Button
            onClick={handleClose}
            name='Got it!'
            disabled={buttonDisabled}
          ></Button>
        </div>
      </div>
    </Modal >
  )
}
export type CarouselProps = {
  toggleCarousel: React.Dispatch<React.SetStateAction<boolean>>;
  isConsentDrawerVisible: boolean;
  carouselType: 'preLogin' | 'postLogin';
};
