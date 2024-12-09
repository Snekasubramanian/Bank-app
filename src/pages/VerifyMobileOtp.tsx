import React, { useEffect, useState } from 'react'
import OtpInputComponent from '../component/otp-input/OtpInput'
import Footer from '../component/footer/Footer'
import Heading from '../component/heading/Heading'
import { useInterval } from 'usehooks-ts'
import BackButton from '../component/back-button/BackButton'
import { useRecoilState } from 'recoil'
import {
  UUID as UUIDAtom,
  FiDetails as FiDetailsAtom,
  XORDecryptRes as XORDecryptResAtom,
  LinkedMobileNum as linkedMobileNumAtom,
  AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom
} from '../services/recoil-states/atom'
import images from '../assets/images'
import { useNavigate, useLocation } from 'react-router'
import { UseApi } from '../services/api/api'
import Encrypt from '../services/encrypt'
import Decrypt from '../services/decrypt'
import DenyTracking from '../modal/DenyTracking'
import { EventtrackerApi } from '../services/api/event'
import Header from '../component/header'
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '../store/reducers'
import { Active_FI_CATEGORY, BankState, CHOOSE_BANK_LIST, CONSENT_DETAILS, DISCOVER_REPONSE, FI_CATEGORY, FI_TYPES, GSTFlag, MOBILE_ERROR_VALUE } from '../store/types/bankListType'

export default function VerifyMobileOtp(): ReturnType<React.FC> {
  let concentData: any
  let consentFI: any = ""
  let fitypes: any = []
  let fiCategory: any = []
  let isPanRequired: any
  // let asset_value: any
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { state } = useLocation();
  const checkValue = state?.newState;
  const [timer, setTimer] = useState(0)
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const [FiDetails, setFiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [, setAlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
  const [isDisable, setIsDisable] = useState<any>(false);
  const [otp, setOtp] = useState('')
  const [otpValid, setOtpValid] = useState<any>(undefined)
  const [otpSendNotificationClass, setOtpSendNotificationClass] = useState('hidden opacity-0')
  const [UUID] = useRecoilState(UUIDAtom)
  const urlParams = new URLSearchParams(window.location.search)
  const mobileNumberTemp: any = urlParams.get('mobilenumber')
  const [newNumber, setNewNumber] = useState();
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("")
  const [errorClick, setErrorClick] = useState(0)
  const [verifyLoader, setVerifyLoader] = useState(false)
  const { dynData, choosebanklist, mobileErrorCount, discoverBankResponse, FICategory,ActiveFICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
  // let pan = location?.state?.panNumber ? location?.state?.panNumber : XORDecryptRes.pan 
  
  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }

  // TRIGGEROTP API call
  // debugger
  const triggerOtp = async (data: any) => {
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))

    try {
      const apiData = UseApi('POST', 'TRIGGEROTP', encryptData)
      const data = await apiData
      const decryptedResponse: any = Decrypt('Decrypt', data)
      if (decryptedResponse?.RESULT_CODE === '400' && decryptedResponse?.MESSAGE === "Account Locked , Try again after 30 minutes") {
        setMessage("Account Locked , Try again after 30 minutes")
        const otpInputs: any = document.getElementsByClassName('otpContainerClass')
        setOtpValid(false)
        setTimeout(() => {
          setOtp('')
        }, 3000)
      }
    } catch (error) {
    }
  }

  // GENERATEOTP API call
  const generateOtp = async (data: any) => {
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))
    try {
      const apiData = UseApi('POST', 'GENERATEOTP', encryptData)
      const data = await apiData
      const decryptedResponse = Decrypt('Decrypt', data)
    } catch (error) {
    }
  }

  // ADDNEWMOBILE API call
  // debugger
  const addNewMobile = async (data: any) => {
    setVerifyLoader(true)
    setIsDisable(true)
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))
    try {
      const apiData = UseApi('POST', 'ADDNEWMOBILE', encryptData)
      const data = await apiData
      const decryptedResponse: any = Decrypt('Decrypt', data)
      // If success
      setXORDecryptRes((prev: any) => ({ ...prev, mobileNumber: urlParams.get('mobilenumber') ?? '' }))
      if (decryptedResponse.RESULT_CODE === '200') {
        setOtpValid(true)
        // setLinkedMobileNum(urlParams.get('mobilenumber'));
        setAlreadyLinkedMobileNum(urlParams.get('mobilenumber'));
        sessionStorage.clear();
        // setOtp('');
        // setTimeout(() => {
          setVerifyLoader(false)
          if(discoverBankResponse.length == 0){
            navigate("/lottieLoader")
          }else{
            if (ActiveFICategory === 'GSTR') {
              let bankList : any =[]
              discoverBankResponse.forEach((item: any, index: any) => {
                if (!bankList.includes(item.FIPNAME)) {
                  bankList.push(item.FIPNAME)
                }
              })
              bankList.forEach((x: any) => {
                discoverBankResponse.push({
                  "Consent": false,
                  "Linked": true,
                  "Id": "Not_found",
                  "FIPID": getFip(x),
                  "AMCSHORTCODE": "Not_found",
                  "FIPNAME": x,
                  "FITYPE": "Not_found",
                  "ACCDISCOVERYDATE": "Not_found",
                  "FIPACCTYPE": "Not_found",
                  "FIPACCREFNUM": "Not_found",
                  "FIPACCNUM": "Not_found",
                  "FIPACCLINKREF": "Not_found",
                  "LINKEDDATE": "Not_found",
                  "Logo": "",
                  'PartialLoader': true
                })
              });
              dispatch({
                type: GSTFlag,
                body: "Addmobile"
            })
              dispatch({
                type: DISCOVER_REPONSE,
                body: discoverBankResponse
              })
            }
              navigate("/userAccount",{ state: { mobileNumber: urlParams.get('mobilenumber') } })
          }
          setIsDisable(false)
        // }, 3000)
      } else if (decryptedResponse.RESULT_CODE === '400' && decryptedResponse.MESSAGE === "Account Locked , Try again after 30 minutes") {
        const otpInputs: any = document.getElementsByClassName('otpContainerClass')
        setMessage("Account Locked , Try again after 30 minutes")
        setIsDisable(true);
        setOtp('')
        setTimeout(() => {
          setVerifyLoader(false)
          otpInputs.item(0).querySelector('input').focus()
          setOtpValid(undefined)
        }, 2000)
        setOtpValid('')
        setIsDisable(false)
      } else {
        // Error Flow
        setMessage("You have entered incorrect OTP!");
        setErrorClick(errorClick + 1)
        const otpInputs: any = document.getElementsByClassName('otpContainerClass')
        setOtp('')
        setTimeout(() => {
          setVerifyLoader(false)
          otpInputs.item(0).querySelector('input').focus()
          setOtpValid(undefined)
          setMessage("")
        }, 2000)
        setOtpValid(false)
        setIsDisable(false)
      }
    } catch (error) {
      setOtpValid(false)
    }
  }

  // VERIFYOTP_V1 API call
  const verifyOtp = async (data: any) => {
    setVerifyLoader(true)
    setIsDisable(true);
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))
    try {
      const apiData = UseApi('POST', 'VERIFYOTP_V1', encryptData)
      apiData.then((result) => {
        const decryptedResponse: any = Decrypt('Decrypt', result)
        if (decryptedResponse.RESULT_CODE === '200') {
          setOtpValid(true)
          // navigate('/userAccount')
           setXORDecryptRes((prev: any) => ({ ...prev, sessionId: decryptedResponse.SESSION_ID }))
           getConcentHandelDetails(decryptedResponse.SESSION_ID)
          // setTimeout(() => {
           
          // }, 1000)
        } else if (decryptedResponse.RESULT_CODE === '400' && decryptedResponse.MESSAGE === "Account Locked , Try again after 30 minutes") {
          const otpInputs: any = document.getElementsByClassName('otpContainerClass')
          setMessage("Account Locked , Try again after 30 minutes")
          setIsDisable(true);
          setOtp('')
          setTimeout(() => {
            setVerifyLoader(false)
            otpInputs.item(0).querySelector('input').focus()
          }, 2000)
          setOtpValid(false)
          setIsDisable(false);
        }
        else {
          // Error Flow
          setMessage("You have entered incorrect OTP!")
          setVerifyLoader(false)
          const otpInputs: any = document.getElementsByClassName('otpContainerClass')
          setOtp('')
          setTimeout(() => {
            otpInputs.item(0).querySelector('input').focus()
            setOtpValid(undefined)
            setMessage("")
          }, 2000)
          setOtpValid(false)
          setIsDisable(false);
        }
      })
    } catch (error) {
    }
  }

  const getFip = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].FIPID : 'Not_found';
  }

  const getConcentHandelDetails = async (SESSION_ID: any) => {
    const getConcentHandelPayload = {
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_BROWSER: 'chrome',
      I_ConsentHandle: dynData,
      I_SESSION: SESSION_ID,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID
    }
    const encryptConsent = Encrypt(
      'Encrypt',
      JSON.stringify(getConcentHandelPayload)
    )
    try {
      const apiData = UseApi('POST', 'GETCONSENTHANDLEDETAILS', encryptConsent)
      const data = await apiData
      concentData = Decrypt('Decrypt', data)
      if(concentData.RESULT_CODE === "200"){
        dispatch({
          type: CONSENT_DETAILS,
          body: concentData?.lst
        })
        concentData.lst.map((value: any, consentIndex: any) => {
          let FIvalue = value.FITYPES?.split(",")
          FIvalue.map((type: any, typeIndex: any)=> {
            if(!consentFI.includes(type)){
              if(consentIndex === concentData.lst.length-1 && typeIndex === FIvalue.length-1){
                consentFI = consentFI + type 
              }else{
              consentFI = consentFI + type + ","
            }}
          })
        })
        // setConsentFIType(consentFI)
        getFiCategoryByType(consentFI,SESSION_ID)
      }
    } catch (error) {
    }
  }

  const FetchFip = async (asset_value: any, SESSION_ID: any) => {
    let Array :any= [];
    const bankListRequestBody = {
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_MPIN: '111111',
      I_BROWSER: 'chrome',
      I_asset_class_id: asset_value,
      I_SEARCHKEY: '',
      I_SESSION: SESSION_ID,
      I_ConsentHandle: dynData,
      I_SEARCHPAGENATION: 'All',
    };
    const encryptData = Encrypt('Encrypt', JSON.stringify(bankListRequestBody))
    try {
      const apiData = UseApi('POST', 'SearchFIP', encryptData)
      const data = await apiData
      const decryptedResponse: any = Decrypt('Decrypt', data)
      if (decryptedResponse?.RESULT_CODE == 200) {
        decryptedResponse.lst.map((item:any)=>{
          Array.push({...item,Flag:fiCategory.toString()})
        })
        
        dispatch({
          type: CHOOSE_BANK_LIST,
          body: Array
        });
        // navigate('/lottieLoader')
        setVerifyLoader(false)
        setIsDisable(false);
        isPanRequired = fiCategory.toString().includes('MF') || fiCategory.toString().includes('GSTR') || fiCategory.toString().includes('EQUITIES')
        if(XORDecryptRes.fipid === ""  ){
          if(fiCategory.length == 1){
          if(fiCategory.toString() === "BANK" || fiCategory.toString() === 'INSURANCE_POLICIES'){
             navigate("/choose-bank")
          }else{
            const Fipid: any = []
            decryptedResponse.lst.map((value: any) => {
              Fipid.push(value.FIPID)
            })
            setFiDetails((prev: any) => ({ ...prev, fixFipid: Fipid,fipid : Fipid}));
            setXORDecryptRes((prev: any) => ({ ...prev, fipid: Fipid.toString() }));
            navigate('/lottieLoader')
          }
        }else{
          if(XORDecryptRes.pan == '' && isPanRequired){
            navigate("/PanRequired")
          }else{
            navigate('/lottieLoader')
          }
        }
      }
      }
    } catch (error) {
    }
  }


  const getFiCategoryByType = async (consentFI: any, SESSION_ID: any) => {
    let Array : any =[];
    const getFiCategoryByTypePayload = {
      I_BROWSER: 'chrome',
      I_FIPTYPES: XORDecryptRes.fIType ? XORDecryptRes.fIType.split(",") : consentFI?.split(","),
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_SESSION: SESSION_ID,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID
    }
    const encryptFiCategoryByType = Encrypt(
      'Encrypt',
      JSON.stringify(getFiCategoryByTypePayload)
    )

    try {
      const apiData = UseApi('POST', 'GetFICategoryByType', encryptFiCategoryByType)
      const data = await apiData
      let catogaryData: any = Decrypt('Decrypt', data)
      if(catogaryData.RESULT_CODE === "200"){
      let FItypes = catogaryData?.FICategories.map((value: any, index: number) => {
         if(!fitypes.includes(value.FI_TYPE)){
          fitypes.push(value.FI_TYPE)
         }
        //  if(fiCategory.includes(value.FI_CATEGORY)){
        //   fiCategory = fiCategory
        //  }else{
        //   if(index === catogaryData?.FICategories.length-1){
        //     fiCategory = fiCategory + value.FI_CATEGORY 
        //   }else{
        //     fiCategory = fiCategory + value.FI_CATEGORY + ","
        //   } 
        //  }
        if(!fiCategory.includes(value.FI_CATEGORY)){
          fiCategory.push(value.FI_CATEGORY)
        }
      })
      dispatch({
        type: FI_TYPES,
        body: fitypes.toString()
      })
      dispatch({
        type: FI_CATEGORY,
        body: fiCategory.toString()
      })
      dispatch({
        type: Active_FI_CATEGORY,
        body: fiCategory[0]
      })
      let asset_value = fiCategory.toString() === "BANK"
      ? 'BANK'
      : fiCategory.toString() === "MF"
        ? 'MF_ETF_OTHERS'
        : fiCategory.toString() === "NPS"
          ? 'NPS'
          :fiCategory.toString() === "EQUITIES"
            ? 'EQUITIES'
            : fiCategory.toString() === 'INSURANCE_POLICIES'
              ? 'INSURANCE'
              : 'GSTR'
          
                if(XORDecryptRes.fipid === ""){
                  if(fiCategory.length == 1){
                    FetchFip(asset_value,SESSION_ID)
                  }else{
                    fiCategory.map((item:any,index:any)=>{
                      FetchFipids(item,SESSION_ID,Array,index);
                       })
                   }
                }else{
                  fiCategory.map((item:any,index:any)=>{
                    FetchFipids(item,SESSION_ID,Array,index);
                     })
               }

          } } catch (error) {
          } 
        }   

        const FetchFipids = async (key:any,SESSION_ID :any,Array:any,index:any) => {
          const bankListRequestBody = {
            I_MOBILENUMBER: XORDecryptRes.mobileNumber,
            I_MPIN: '111111',
            I_BROWSER: 'chrome',
            I_asset_class_id:  key == 'MF' ? 'MF_ETF_OTHERS' : key == 'INSURANCE_POLICIES' ?'INSURANCE' : key,
            I_SEARCHKEY: '',
            I_SESSION: SESSION_ID,
            I_ConsentHandle: dynData,
            I_SEARCHPAGENATION: 'All',
          };
          const encryptData = Encrypt('Encrypt', JSON.stringify(bankListRequestBody))
          try {
            const apiData = UseApi('POST', 'SearchFIP', encryptData)
            const data = await apiData
            const decryptedResponse: any = Decrypt('Decrypt', data)
            if (decryptedResponse?.RESULT_CODE == 200) {
              decryptedResponse.lst.map((item:any)=>{
                Array.push({...item,Flag:key})
              })
              dispatch({
                type: CHOOSE_BANK_LIST,
                body: Array
              });
            }

            isPanRequired = fiCategory.toString().includes('MF') || fiCategory.toString().includes('GSTR') || fiCategory.toString().includes('EQUITIES')
            if((fiCategory.length - 1) == index){
              setVerifyLoader(false)
              setIsDisable(false);
              if(XORDecryptRes.pan == '' && isPanRequired){
                navigate("/PanRequired")
              }else{
                navigate('/lottieLoader')
              }
            }
          } catch (error) {
            if((fiCategory.length - 1) == index){
              setVerifyLoader(false)
              setIsDisable(false);
              if(XORDecryptRes.fipid === "" && fiCategory.length > 1){
                navigate('/MultiFiUserAccount')
              }else{
                navigate('/lottieLoader')
              }
            }
          }
        }
                 
  useEffect(() => {
    if (mobileNumberTemp == null) {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "page",
            "page_name": "aa_finvu_otp",
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
            "event_type": "page",
            "page_name": "aa_edit_mobile_finvu_otp",
            "bank_name": FiDetails.fipid,
            "source": "",
            "event_name": "aa_linking_page_view"
          }
        ]
      }
      EventtrackerApi(event);
    }
    // To Trigger OTP When Launched
    if (otp === '') {
      setTimer(15)
      setMessage("")
      if (urlParams.get('newuser') === null) {
        triggerOtp({
          I_MOBILENUMBER: XORDecryptRes.mobileNumber,
          I_CLIENTIP: '116.50.59.201',
          I_BROWSER: 'chrome',
          I_MPIN: '123456',
          I_USERID: XORDecryptRes.mobileNumber,
          UUID,
          I_ConsentHandle: dynData
        })
      } else {
        // Using Generate OTP API When new mobile number is registered
        generateOtp({
          I_SECONDARY_MOBILE_NUMBER: mobileNumberTemp,
          I_MOBILENUMBER: XORDecryptRes.mobileNumber,
          I_BROWSER: 'chrome',
          I_SESSION: XORDecryptRes.sessionId,
          I_USERID: XORDecryptRes.mobileNumber,
          UUID,
          I_ConsentHandle: dynData
        })
      }
    }
    console.log(FICategory)
  }, [])

  useEffect(() => {
    dispatch({
      type: MOBILE_ERROR_VALUE,
      body: errorClick
    })
  }, [errorClick])

  useEffect(() => {
    if (mobileErrorCount >= 5) {
      setOtpValid(false)
      setMessage("OTP limit has been exceeded. Please try again after 30 mins")
      setOtp("")
      setIsDisable(true);
    }


  }, [mobileErrorCount])

  useEffect(() => {
    window.addEventListener("storage", () => {
      setOtp(JSON.parse(JSON.stringify(sessionStorage.getItem("otp"))));
    });
  }, [])

  // Runs After every OTP digit Input
  useEffect(() => {
    // On entering 6 digit OTP, Verify or addNewMobile is automatically triggered
    if (otp.length === 6) {
      if (urlParams.get('newuser') === null) {
        const event = {
          "eventList": [
            {
              "event_timestamp": new Date().getTime(),
              "consent_handle_id": XORDecryptRes.consentId,
              "event_type": "click",
              "page_name": "aa_finvu_otp",
              "bank_name": FiDetails.fipid,
              "source": "",
              "cta_text": "Confirm",
              "event_name": "aa_linking_cta_clicked"
            }
          ]
        }
        EventtrackerApi(event);
        verifyOtp({ I_MOBILENUMBER: XORDecryptRes.mobileNumber, I_MOBOTP: otp, I_BROWSER: 'chrome', I_CLIENTIP: '116.50.59.201', I_Flag: 'M', I_USERID: XORDecryptRes.mobileNumber, UUID, I_ConsentHandle: dynData })
      } else {
        // In Case coming from Add new mobile number page
        const event = {
          "eventList": [
            {
              "event_timestamp": new Date().getTime(),
              "consent_handle_id": XORDecryptRes.consentId,
              "event_type": "click",
              "page_name": "aa_edit_mobile_finvu_otp",
              "bank_name": FiDetails.fipid,
              "source": "",
              "cta_text": "Confirm",
              "event_name": "aa_linking_cta_clicked"
            }
          ]
        }
        EventtrackerApi(event);
        addNewMobile({ I_BROWSER: 'chrome', I_MOBILENUMBER: XORDecryptRes.mobileNumber, I_SECONDARY_MOBILE_NUMBER: mobileNumberTemp, I_MOBOTP: otp, I_Flag: 'M', I_SESSION: XORDecryptRes.sessionId, I_USERID: XORDecryptRes.mobileNumber, UUID, I_ConsentHandle: dynData })
      }
    }
  }, [otp])

  const countdownTimer = (timer: number, delay: number) => {
    return timer - delay
  }

  useEffect(() => {
    if (mobileErrorCount >= 5) {
      setOtpValid(false)
      setOtp('');
      setMessage("OTP limit has been exceededsss. Please try again after 30 mins");
      // setIsDisable(true);
    }

  }, [count])

  const Resendotp = () => {
    setMessage("")
    // Update state with incremented value
    setCount(count + 1);
    if (mobileNumberTemp == null) {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "click",
            "page_name": "aa_finvu_otp",
            "bank_name": FiDetails.fipid,
            "source": "",
            "cta_text": "Resend",
            "event_name": "aa_linking_cta_clicked"
          }
        ]
      }
      EventtrackerApi(event);
    }
  }
  useInterval(
    () => {
      setTimer(countdownTimer(timer, 1))
    },
    timer !== 0
      ? 1000
      : null
  )

  return (
    <div className="">


      {/* Back Icon in OTP screen */}
      {/* <BackButton
            imageUrl={''}
            onClickBack={() => {
              // Trigger Modal
              onClickDenyTrack()
            }}
          /> */}
      <Heading
        checked={checkValue}
        Backbtn={true}
        closebtn={false}
      />
      {/* <Header /> */}
      <div className="main-body">
      <div className="verify-mobile">
        <h5>Verify your mobile number</h5>
        <p>
          You will receive a 6-digit code on your phone number{' '}
          <span className="mobileNumber">+91 {mobileNumberTemp !== null
            ? mobileNumberTemp
            : XORDecryptRes.mobileNumber}</span> from CAMSfinserv
        </p>
      </div>
      <div className="verify-otpbox">
        <div className="otpinput">
          <OtpInputComponent
            otp={otp}
            setOtp={setOtp}
            otpValid={otpValid}
            disable={isDisable}
            verifyLoader={verifyLoader}
          />
          {otpValid === true || otpValid === undefined
            ? <p className=" success-opt">message</p>
            : <p className=" success-msg">{message}</p>
          }
        </div>
        {/* Resend OTP Functionality */}
        <div className="receive_txt">
          <span className='OTP_txt'>Didn’t receive it?</span> 
          &nbsp; 
          {timer === 0
            ? (
              <button
                className="ResendOTP_txt" disabled={count > 2 || message == "Account Locked , Try again after 30 minutes" || mobileErrorCount >= 5}
                onClick={() => {
                  // Resend OTP
                  // To Focus OTP Input to first OTP input
                  const otpInputs: any = document.getElementsByClassName('otpContainerClass')
                  otpInputs.item(0).querySelector('input').focus()
                  setOtp('')
                  Resendotp()
                  // Resend Trigger OTP
                  if (urlParams.get('newuser') === null) {
                    triggerOtp({
                      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
                      I_CLIENTIP: '116.50.59.201',
                      I_BROWSER: 'chrome',
                      I_MPIN: '123456',
                      I_USERID: XORDecryptRes.mobileNumber,
                      UUID,
                      I_ConsentHandle: dynData
                    })
                  } else {
                    // Resend Using Generate OTP API When new mobile number is registered
                    generateOtp({
                      I_SECONDARY_MOBILE_NUMBER: mobileNumberTemp,
                      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
                      I_BROWSER: 'chrome',
                      I_SESSION: XORDecryptRes.sessionId,
                      I_USERID: XORDecryptRes.mobileNumber,
                      UUID,
                      I_ConsentHandle: dynData
                    })
                  }

                  // For OTP UI Notification
                  setTimer(15)
                  setOtpSendNotificationClass('transition-all duration-1000 ease-in block opacity-1')
                  setTimeout(() => {
                    setOtpSendNotificationClass('transition-all duration-1000 ease-in opacity-0  translate-y-[-200px]')
                  }, 1000)
                  setTimeout(() => {
                    setOtpSendNotificationClass('hidden')
                  }, 1500)
                }}
              > Resend
              </button>
            )
            : (
              <span className='OTP_txt'>Resend in <span className='OTP_timer'>{timer}</span></span>
            )}
        </div>
      </div>
      </div>
      <div className="verify-otpages footer_botom">
        {verifyLoader ? <button
          className='bottom-button'
        >    <img src={images.music} />
        </button> : <button
          className='bottom-button'
          disabled
        >  Confirm
        </button>
        }
             <Footer />
      </div>
      <DenyTracking
        isOpen={isModalTrack}
        OnExit={onClickDenyTrack}
        handleClose={onClickDenyTrack}
        pageName={'Cams_otp'}
      ></DenyTracking>
    </div>
  )
}
