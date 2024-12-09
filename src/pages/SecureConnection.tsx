import Footer from "../component/footer/Footer"
import React, { useEffect } from 'react'
import image from '../assets/images/index'
import Heading from "../component/heading/Heading"
import Encrypt from '../services/encrypt'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import {
  UUID as UUIDAtom,
  FiDetails as FiDetailsAtom,
  ResgisterNum as resgisterNumAtom,
  redirectUrl as redirectUrlAtom,
  XORDecryptRes as XORDecryptResAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { useNavigate } from "react-router-dom"
import { parse } from "path"
import { useDispatch } from "react-redux"
import { MULTI_CONSERN, MULTI_CONSENT_ARRAY, REQUIRED, ConsentWithFIP } from "../store/types/bankListType"

const SecureConnection = () => {
  const navigate = useNavigate();
  const checkValue: boolean = false;
  const dispatch = useDispatch()
  const [, setFiDetails] = useRecoilState(FiDetailsAtom);
  const [ResgisterNum, setResgisterNum] = useRecoilState(resgisterNumAtom);
  const [UUID] = useRecoilState(UUIDAtom);
  const [, setRedirectUrl] = useRecoilState(redirectUrlAtom);
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)

  const authentication = () => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      fiuID: 'STERLING-FIU-UAT',
      redirection_key: 'DSTKnxbUAlPukv',
      userId: 'athira.j@camsonline.com'
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    }

    fetch('https://uatapp.finduit.in/api/FIU/Authentication', requestOptions)
      .then(async (response) => await response.json())
      .then((result) => {
        redirectionAA(result.sessionId, result.token)
      })
      .catch((error) => { console.log('error', error) })
  }
  const redirectionAA = (session: any, token: any) => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${token}`)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      clienttrnxid: '04502d0c9c4b400388450c65fd01bd23',
      fiuID: 'STERLING-FIU-UAT',
      userId: 'athira.j@camsonline.com',
      aaCustomerHandleId: '8124566682@CAMSAA', /* 8870960823 */
      aaCustomerMobile: '8124566682',
      sessionId: session,
      useCaseid: '389',
      pan:"ABCTY1234F",
      fipid: 'fipuat@citybank'
      //  fipid: 'HAMC,CAMC'
      //  fipid: 'Cams ENPS'
      //  fipid: 'Cams_insurance,FUTUREGENFIP_GI_UAT'
      // fipid: "Cams Depository"
      // fipid: 'HDFC' /* HDFC */
      // fipid: "ETLIFIP_UAT",
    })
    const onj: any = JSON.parse(raw)
    setResgisterNum(onj.aaCustomerMobile)
    console.log('raw', onj.aaCustomerMobile);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    }

    fetch('https://uatapp.finduit.in/api/FIU/RedirectAA', requestOptions)
      .then(async response => await response.json())
      .then(result => {
        console.log(result.redirectionurl)
        // setSessionId(result.sessionId)
        // setConsentId(result.consentHandle)
        let pattern = result.redirectionurl.indexOf("?")
        let matchPattern = result.redirectionurl.substring(0, pattern)
        const newUrl = result.redirectionurl.replace(matchPattern, 'http://localhost:3000');
        // window.open(newUrl);
        window.history.replaceState({}, 'http://localhost:3000', newUrl);
        XORDecrypt(window.location.search)
      })
      .catch(error => { console.log('error', error) })
  }

  const XORDecrypt = async (url: any) => {
    const urlParams = new URLSearchParams(url)
    const fiuId = urlParams.get('fi') ?? ''
    const ecRequest = urlParams.get('ecreq') ?? ''
    const reqDate = urlParams.get('reqdate') ?? ''
    const data = {
      fiuId,
      ecRequest,
      reqDate,
      flag: 'user_validation',
      UUID
    }
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))
    try {
      const apiData = UseApi('POST', 'AES256_XOR_Decrypt', encryptData)
      apiData.then((result) => {
        const decryptedResponse: any = Decrypt('Decrypt', result)
        console.log("decryptedResponse", decryptedResponse);
        setXORDecryptRes({
          logo: decryptedResponse.logo,
          sessionId: decryptedResponse.sessionid,
          userId: decryptedResponse.userid,
          consentId: decryptedResponse.srcref,
          mobileNumber: decryptedResponse.mobile,
          txnid: decryptedResponse.txnid,
          addfip: decryptedResponse.addfip,
          fiuName: decryptedResponse.fiuName,
          fipid: decryptedResponse.fipid,
          pan: decryptedResponse.pan,
          fiCategory: decryptedResponse.fiCategory,
          fIType: decryptedResponse.fIType,
        })
        setRedirectUrl(decryptedResponse.redirect ?? '')
        setFiDetails({
          fIType: decryptedResponse.fIType,
          fiCategory: decryptedResponse.fiCategory,
          fipid: decryptedResponse.fipid.split(','),
          fixFipid:[],
          fiuid: decryptedResponse.fiuid,
          userid: decryptedResponse.userid,
          fiuName: decryptedResponse.fiuName
        })
        if (typeof (decryptedResponse?.srcref) === 'object') {
          let dynValue: any = [];
          let RequiredValue: any = {}
          dispatch({
            type: ConsentWithFIP,
            body:  decryptedResponse?.srcref
       })
          decryptedResponse?.srcref.map((val: any, index: number) => {
            const newValue = val.split('|');
            // console.log(val.split('|'))
            dynValue.push(newValue[2]);
            RequiredValue[newValue[2]] = newValue[1]
            // console.log('val',newValue[2]) 
          })
          dispatch({
            type: MULTI_CONSENT_ARRAY,
            body: { consentData: dynValue },
          })
          dispatch({
            type: REQUIRED,
            body: RequiredValue
          })
          // console.log("dynValue",dynValue);
          let consentValue = ""
          dynValue.map((val: any, index: any) => {
            consentValue = consentValue + val
            if (index === dynValue.length - 1) {
              consentValue = consentValue
            } else {
              consentValue = consentValue + ","
            }
          })
          //  console.log("consentValue",consentValue)

          dispatch({
            type: MULTI_CONSERN,
            body: { dynData: consentValue },
          })
        } else {
          let dynValue: any = [];
          dynValue.push(decryptedResponse?.srcref)
          dispatch({
            type: ConsentWithFIP,
            body:  dynValue
       })
          dispatch({
            type: MULTI_CONSENT_ARRAY,
            body: { consentData: dynValue },
          })
          dispatch({
            type: MULTI_CONSERN,
            body: { dynData: decryptedResponse?.srcref },
          })
        }
        if(decryptedResponse?.status === "S"){
          navigate('/mobileotpverification')
        }else{
          navigate('/lottie', { state: { statusfailed: true }})
        }
      })
    } catch (error) {
      console.log('There was an error', error)
    }
  }

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      const urlParams = new URLSearchParams(window.location.search)
      const fiuId = urlParams.get('fi') ?? ''
      if(!!fiuId){
        XORDecrypt(window.location.search);
      }else{
        authentication();
      }
    } else {
      if (!!window.location.search) {
        XORDecrypt(window.location.search)
      }
    }
  }, [])

  return (
    <>
      <div>
        {/* <Heading
        checked= {checkValue}
          Backbtn={true}
          closebtn={false}
        /> */}
      </div>
      <div className="secure_main">
        <img className="securegif" src={image.secureGif}>
        </img>
        <div className="secure_text">
          Securely connecting with CAMSfinserv for fetching your data
        </div>
      </div>
      <div className="secure-connect">
        <Footer />
      </div>
    </>
  )
}

export default SecureConnection