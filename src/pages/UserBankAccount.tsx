import React, { type ChangeEvent, useEffect, useState } from 'react'
import BackButton from '../component/back-button/BackButton'
import images from '../assets/images'
import Heading from '../component/heading/Heading'
import Footer from '../component/footer/Footer'
import Button from '../component/button/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import Encrypt from '../services/encrypt'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import {
  UUID as UUIDAtom,
  discoveredData as discoveredDataAtom,
  XORDecryptRes as XorDecryptResAtom,
  refNumber as refNumberAtom,
  CurrentFip as CurrentFipAtom,
  FIPDetailsList as FIPDetailsListAtom,
  FiDetails as FiDetailsAtom,
  bankList as bankListAtom,
  redirectUrl as redirectUrlAtom
} from '../services/recoil-states/atom'
import { useDispatch, useSelector } from 'react-redux';
import { useRecoilState } from 'recoil'
import MultiConsentBottomSheet from '../modal/MulticonsentBottom'
import ConsentBottomSheet from '../modal/consentBottomSheet'
import DenyAndExit from '../modal/DenyAndExit'
import DenyTracking from '../modal/DenyTracking'
import { closeAndRedirect } from '../services/AaRedirection'
import { EventtrackerApi } from '../services/api/event'
import VerifyBank from './VerifyBank'
import { BankState, DISCOVER_REPONSE, GSTFlag, UPDATE_Loader } from '../store/types/bankListType'
import { RootStateType } from '../store/reducers'
import ImportentModal from '../modal/ImportentModal'
import VerifyLottie from '../pages/VerifyLottie';
import MulticonsentBottom from '../modal/MulticonsentBottom'
import BankCard from '../component/bank-card/BankCard'
const UserBankAccount = () => {
  let concentData: any
  let bankList: string[] = []
  let bankDict: any = {}
  let eventList: any = {}
  let SubmittedeventList: any = {}
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  let { discoverBankResponse, consentDetails, consentData, dynData,consentFIP, FixFIPNAME, gstflag, FICategory, choosebanklist, ActiveFICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [selectedBank, setSelectedBank] = useState<any>([])
  const [discoverData, setDiscoverData] = useRecoilState<any>(discoveredDataAtom)
  const [UUID] = useRecoilState(UUIDAtom)
  const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [, setRefNumber] = useRecoilState(refNumberAtom)
  const [, setLinkingRefNumber] = useRecoilState(refNumberAtom)
  const [, setFIPAccLinkRef] = useRecoilState(refNumberAtom)
  const [currentfip, setCurrentfip] = useRecoilState(CurrentFipAtom)
  const [FiDetails, setFiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [redirectUrl] = useRecoilState(redirectUrlAtom)
  const [FIPDetailsList, setFIPDetailsList] =
    useRecoilState<any>(FIPDetailsListAtom)
  const [consent, setConsent] = useState<any>(true)
  const [bankListState, setBankListState] = useState<any>([])
  const [CurrentLinkBank, setCurrentLinkBank] = useState([])
  const [dicOfBank, setDicOfBank] = useState<any>([])
  const [open, setOpen] = React.useState(false)
  const [isModal, setIsModal] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenLoader, setIsOpenLoader] = useState(false);
  const [bankListName, setBankListName] = useState<any>();
  const [isChecked, setIsChecked] = useState<any>();
  const [index, setIndex] = useState<any>();
  const [checked, setChecked] = useState(true)
  const [verifyLoader, setVerifyLoader] = useState(false)
  const fipLength: any = FiDetails?.fipid.length;
  let falseLinkedFipid: any = {};
  const checkValue: boolean = false;
  let pan = location?.state?.panNumber
  let mobileNumber = location?.state?.mobileNumber
  // const getConcentHandelPayload = {
  //   I_MOBILENUMBER: XORDecryptRes.mobileNumber,
  //   I_BROWSER: 'chrome',
  //   I_ConsentHandle: XORDecryptRes.consentId,
  //   I_SESSION: XORDecryptRes.sessionId,
  //   I_USERID: XORDecryptRes.mobileNumber,
  //   UUID
  // }
  // const encryptConsent = Encrypt(
  //   'Encrypt',
  //   JSON.stringify(getConcentHandelPayload)
  // )

  // useEffect(()=>{
  //   function customSort(a: any, b:any) {
  //     return a === "not found" ? 1 : b === "not found" ? -1 : 0;
  //   }
  //   bankListState.sort(customSort)
  // },[bankListState])

  discoverBankResponse.map((item: any) => {
    if (item.Linked === false) {
      falseLinkedFipid = item.FIPID;

    }
  })


  const RenderMultipleBanks = () => {
    const primaryBank = FiDetails.fipid
    bankList = []
    bankDict = {}
    eventList = {}
    setBankListState([]);
    discoverBankResponse = discoverBankResponse.sort((a: any, b: any) => parseFloat(a.sortFlag) - parseFloat(b.sortFlag));
    discoverBankResponse.forEach((item: any, index: any) => {
      if (FICategory === 'GSTR') {
        if (!bankList.includes(item.mobileNumber)) {
          bankList.push(item.mobileNumber)
          bankDict[item.mobileNumber] = []
          bankDict[item.mobileNumber].push(item)
        } else {
          bankDict[item.mobileNumber].push(item)
        }
      } else {
        if (!bankList.includes(item.FIPID)) {
          bankList.push(item.FIPID)
          bankDict[item.FIPID] = []
          bankDict[item.FIPID].push(item)
        } else {
          bankDict[item.FIPID].push(item)
        }
      }
    })
    bankList = []
    let descending = Object.keys(bankDict).sort((a, b) => bankDict[b].length - bankDict[a].length).reduce((acc: any, key) => ((acc[key] = bankDict[key]), acc), {});
    Object.keys(descending).map((item: any) => {
      bankList.push(item)
    })
    setDicOfBank(descending);
    for (const [key, value] of Object.entries(bankDict)) {
      eventList[key] = Object(value).length;
    }
    for (const [key, value] of Object.entries(bankDict)) {
      SubmittedeventList[key] = Object(value).reduce((a: any, { FIPACCNUM }: any) => a.concat(FIPACCNUM.split(',')), []);
    }
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "page",
          "page_name": "aa_consent_screen",
          "bank_name": FiDetails.fipid,
          "source": "",
          "num_of_available_accounts": bankList.length,
          "meta": eventList,
          "event_name": "aa_linking_page_view"
        }
      ]
    }
    EventtrackerApi(event);
    // const indexOfPrimary = bankList.indexOf(primaryBank[0])
    // bankList[indexOfPrimary] = bankList[0]
    // bankList[0] = primaryBank[0] 
    setBankListState(bankList) // SetBankObjectState here
  }
  /* 10. View Consent Details Click -> On click Consent text popup of consent will open */
  const OnClickConsent = () => {
    setOpen((prev) => !prev);
    // let consentValue = consentDetails.filter((val: any, index: number) =>
    //   screfindex === index
    // )
    // setConsent(consentValue[0])
    // setIndex(screfindex)
    if (!open) {
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "click",
            "page_name": "aa_consent_screen",
            "bank_name": FiDetails.fipid,
            "source": "",
            "cta_text": "View Consent Details",
            "event_name": "aa_linking_cta_clicked"
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
            "page_name": "aa_consent_details_bottomsheet",
            "bank_name": FiDetails.fipid,
            "source": "",
            "cta_text": "Continue",
            "event_name": "aa_linking_cta_clicked"
          }
        ]
      }
      EventtrackerApi(event);
    }
  }
  /* 7.	On deny click -> here on Deny button click popup modal will Open */
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

  const finalSubmit = () => {
    let FilterValidResponse = discoverBankResponse.filter((d: any) => d.FIPACCREFNUM !== "Not_found");
    if (FilterValidResponse.filter((d: any) => !d.Linked).length == 0) {
      onSubmit();
    } else {
      setIsImportant(true);
    }
  }

  const handleSubmit = async (FIPDetailsListModified: any) => {
    setVerifyLoader(true)
    const requests = consentData.map((consentvalue: any) => {
      let submitAccounts: any= []
      let FilterConsent :any = consentFIP.find((x:any) => x.includes(consentvalue));
      if(FilterConsent.split('|').length == 4){
        if(FilterConsent.split('|')[3] != 'NULL' && FilterConsent.split('|')[3] != ''){
          submitAccounts = FIPDetailsListModified.filter((Item:any)=> Item.FIPID == FilterConsent.split('|')[3]);
        }else{
          let filterAccounts =  consentDetails?.filter((value:any) => value.CONSENTHANDLE === consentvalue)
          FIPDetailsListModified.filter((acc: any)=> filterAccounts.map((value: any) => {
          let fivalue= value.FITYPES.match(acc.FITYPE)
          if(fivalue){
            submitAccounts.push(acc)
          }
        }))
        }
      }else{
        let filterAccounts =  consentDetails?.filter((value:any) => value.CONSENTHANDLE === consentvalue)
        FIPDetailsListModified.filter((acc: any)=> filterAccounts.map((value: any) => {
        let fivalue= value.FITYPES.match(acc.FITYPE)
        if(fivalue){
          submitAccounts.push(acc)
        }
      }))
      }
      return consentArtefact(consentvalue, submitAccounts);
    })
    const responses = await Promise.all(requests)
    let success = responses?.filter((response: any) => {
      return response.RESULT_CODE === "200"
    })
    if (success.length >= 1) {
      setVerifyLoader(false)
      navigate('/lottie')
    } else {
      setVerifyLoader(false)
      navigate('/accountNotConnected')
    }
  }

  const consentArtefact = async (consentvalue: any, FIPDetailsListModified: any) => {
    const consentBody = {
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_MPIN: '111111',
      I_BROWSER: 'chrome',
      I_ConsentHandle: consentvalue,
      FIPDetailsList: FIPDetailsListModified,
      I_SESSION: XORDecryptRes.sessionId,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID
    }

    const encryptData = Encrypt('Encrypt', JSON.stringify(consentBody))

    try {
      const apiData = UseApi('POST', 'ConsentArtefact_V1', encryptData)
      const data = await apiData
      const decryptedResponse: any = Decrypt('Decrypt', data)
      return decryptedResponse
    } catch (error) {
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const toLinkBank: any = []
    const checkedVal = JSON.parse(event.target.value)
    setIsChecked(checkedVal.isChecked);
    // dispatch({
    //   type: 'SELECT_ACCOUNT',
    //   body: { selectedAccount: checkedVal }
    // });
    if (event.target.checked) {
      // Account is Linked but Consent is false

      if (checkedVal.Consent === false && checkedVal.Linked === false) {
        const data = {
          FIPACCNUM: checkedVal.FIPACCNUM,
          FIPACCREFNUM: checkedVal.FIPACCREFNUM,
          FIPACCTYPE: checkedVal.FIPACCTYPE,
          FIPTYPE: checkedVal.FITYPE,
          FIPID: checkedVal.FIPID,
          Logo: checkedVal.Logo
        }
        toLinkBank.push({ ...data })
        setSelectedBank((prev: any) => [...prev, ...toLinkBank])
        // Both Linked but Consent is false
      } else if (checkedVal.Consent === false && checkedVal.Linked === true) {
        setFIPDetailsList((prev: any) => [...prev, checkedVal])
      }
    }

    if (!event.target.checked) {

      if (checkedVal.Consent === false && checkedVal.Linked === false) {
        setSelectedBank(
          selectedBank.filter(
            (item: any) => item.FIPACCREFNUM !== event.target.id
          )
        )
      } else if (checkedVal.Consent === false && checkedVal.Linked === true) {
        setFIPDetailsList(
          FIPDetailsList.filter(
            (item: any) => item.FIPACCREFNUM !== event.target.id
          )
        )
      }
    }
  }
  // const getConcentHandelDetails = async () => {
  //   try {
  //     const apiData = UseApi('POST', 'GETCONSENTHANDLEDETAILS', encryptConsent)
  //     const data = await apiData
  //     concentData = Decrypt('Decrypt', data)
  //     setConsent(concentData)
  //   } catch (error) {
  //   }
  // }
  const getBankDetails = () => {
    const linkedAccount: any = [];
    discoverBankResponse.forEach((item: any) => {
      const selectedData: any = []
      if (item.Linked === false && item.Consent === false) {
        const data = {
          FIPACCNUM: item.FIPACCNUM,
          FIPACCREFNUM: item.FIPACCREFNUM,
          FIPACCTYPE: item.FIPACCTYPE,
          FIPTYPE: item.FITYPE,
          FIPID: item.FIPID,
          Logo: ''
        }
        selectedData.push({ ...data })
        setSelectedBank((prev: any) => [...prev, ...selectedData])
      } else if (item.Linked === true && item.Consent === false) {
        selectedData.push({ ...item })
        setFIPDetailsList((prev: any) => [...prev, ...selectedData])
      }

      if (item.Linked) {
        linkedAccount.push({
          "userId": XORDecryptRes.userId,
          "fipId": item.FIPID,
          "fipName": item.FIPNAME,
          "maskedAccNumber": item.FIPACCNUM,
          "accRefNumber": "",
          "linkRefNumber": item.FIPACCREFNUM,
          "consentIdList": null,
          "FIType": XORDecryptRes.FITYPE,
          "accType": item.FIPACCTYPE,
          "linkedAccountUpdateTimestamp": item.LINKEDDATE,
          "AuthenticatorType": "TOKEN"
        })
      }
    })
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "background",
          "event_name": "account_linked",
          "page_name": "linked_accounts_api",
          "bank_name": FiDetails.fipid,
          "source": "",
          "meta": {
            "linkedAccounts": linkedAccount
          }
        }
      ]
    }
    EventtrackerApi(event);
  }
  /*   13.	On Continue Click on the Account Discovery & Linked Screen -> On this click Link Api is called */
  const onClickTrackNow = async (event: any) => {
    setIsOpenLoader(true);
    event = event.length ? event : discoverBankResponse
    const toLinkBank: any = []
    setCurrentLinkBank(!!event ? event : []);
    setBankListName(event[0].FIPNAME);
    event.forEach((item: any) => {
      if (item.Consent === false && item.Linked === false && item.isChecked) {
        const data = {
          FIPACCNUM: item.FIPACCNUM,
          FIPACCREFNUM: item.FIPACCREFNUM,
          FIPACCTYPE: item.FIPACCTYPE,
          FIPTYPE: item.FITYPE,
          FIPID: item.FIPID,
          Logo: item.Logo,
          Mobile: item.mobileNumber
        }
        toLinkBank.push({ ...data })
      }
    })
    setCurrentfip(toLinkBank[0].FIPID);
    const inputBankpayload = {
      I_MOBILENUMBER: toLinkBank[0].Mobile,
      I_BROWSER: 'Chrome',
      I_FIPID: toLinkBank[0].FIPID,
      ACCOUNTS_TO_LINK: toLinkBank,
      I_SESSION: XORDecryptRes.sessionId,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID,
      I_ConsentHandle: dynData
    }
    if (toLinkBank.length > 0) {
      const encryptedData = Encrypt(
        'Encrypt',
        JSON.stringify(inputBankpayload)
      )
      try {
        const event = {
          "eventList": [
            {
              "event_timestamp": new Date().getTime(),
              "consent_handle_id": XORDecryptRes.consentId,
              "event_type": "click",
              "page_name": "aa_consent_screen",
              "bank_name": FiDetails.fipid,
              "cta_text": "Continue",
              "source": "",
              "num_of_available_accounts": bankList.length,
              "meta": SubmittedeventList,
              "event_name": "aa_linking_cta_clicked"
            }
          ]
        }
        EventtrackerApi(event);
        const apiResponse = UseApi('POST', 'Link', encryptedData)
        const data = await apiResponse

        const decryptedResponse: any = Decrypt('Decrypt', data)
        if (decryptedResponse?.RESULT_CODE === '200') {
          setRefNumber(decryptedResponse?.RefNumber ?? '')
          setIsOpen(true)
          setIsOpenLoader(false);
        } else {
          setIsOpen(false)
          setIsOpenLoader(false);
        }
      } catch (error) {
        setIsOpen(false)
        setIsOpenLoader(false);
      }
    }
  }

  const onSubmit = async () => {
    setIsImportant(false)
    if (discoverBankResponse.length !== 0) {
      let Banklists: any = [];
      let bankDicts: any = [];
      const FIPDetailsListModified: any = []
      // To generate ConsentArtefact Payload
      discoverBankResponse.forEach((item: any) => {
        if (item.Linked && item.isChecked && item.FIPACCNUM !== "Not_found") {
          const temporaryDict = {
            CUSTID: XORDecryptRes.mobileNumber,
            FIPID: item.FIPID,
            FIPACCREFNUM: item.FIPACCREFNUM,
            LINKEDDATE: item.LINKEDDATE ?? '',
            FIPACCTYPE: item.FIPACCTYPE,
            FIPACCNUM: item.FIPACCNUM,
            FITYPE: item.FITYPE,
            LOGO: item.Logo,
            FIPNAME: item.FIPNAME,
            FIPACCLINKREF: item.FIPACCLINKREF,
            LINKINGREFNUM: item.FIPACCLINKREF,
            isCardSelected: true,
            CONSENTDATE: new Date().toISOString(),
            CONSENTCOUNT: 1
          }
          FIPDetailsListModified.push(temporaryDict)
        }
      })
      handleSubmit(FIPDetailsListModified)
      FIPDetailsListModified.forEach((item: any, index: any) => {
        if (!Banklists.includes(item.FIPID)) {
          Banklists.push(item.FIPID)
          bankDicts[item.FIPID] = []
          bankDicts[item.FIPID].push(item)
        } else {
          bankDicts[item.FIPID].push(item)
        }
      })
      for (const [key, value] of Object.entries(bankDicts)) {
        SubmittedeventList[key] = Object(value).reduce((a: any, { FIPACCNUM }: any) => a.concat(FIPACCNUM.split(',')), []);
      }
      const event = {
        "eventList": [
          {
            "event_timestamp": new Date().getTime(),
            "consent_handle_id": XORDecryptRes.consentId,
            "event_type": "click",
            "page_name": "aa_consent_screen",
            "bank_name": FiDetails.fipid,
            "cta_text": "Continue",
            "source": "",
            "num_of_available_accounts": Banklists.length,
            "meta": SubmittedeventList,
            "event_name": "aa_linking_cta_clicked"
          }
        ]
      }
      EventtrackerApi(event);
      // navigate('/lottie')
    }
    else if (FIPDetailsList.length === 0 && selectedBank.length === 0) {
      closeAndRedirect({
        parentStatusMessage: 'ACCEPTED',
        delay: true,
        decrypt: XORDecryptRes,
        url: redirectUrl,
      });
    }
  }

  const RecoverAccount = async (FipName: any) => {
    let fip = choosebanklist.filter((val: any) => val.FIPNAME === FipName);
    const data = {
      I_MOBILENUMBER: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber,
      I_BROWSER: 'chrome',
      I_Identifier: [
        {
          I_Flag: 'MOBILE',
          DATA: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber,
          type: 'STRONG'
        },
        {
          I_Flag: 'PAN',
          DATA: pan ? pan : XORDecryptRes!.pan,
          type: 'WEAK',
        }],
      I_FITYPE: FiDetails.fIType,
      I_FIPID: fip[0]?.FIPID,
      I_FIPNAME: '', // ASK
      I_SESSION: XORDecryptRes.sessionId,
      I_USERID: XORDecryptRes.mobileNumber,
      UUID,
      I_ConsentHandle: dynData
    }
    const encryptData = Encrypt('Encrypt', JSON.stringify(data))

    try {
      const apiData = UseApi(
        'POST',
        'GetFipDiscoverAndLinkedAccounts',
        encryptData
      )
      const data = await apiData
      let decryptedResponse: any = Decrypt('Decrypt', data);
      if (decryptedResponse.AccountCount > 0) {
        let AlreadyhaveAccounts: any = [];
        if (FICategory === 'GSTR') {
          AlreadyhaveAccounts = discoverBankResponse.filter((val: any) => val.PartialLoader != true);
        } else {
          AlreadyhaveAccounts = discoverBankResponse.filter((val: any) => val.FIPNAME !== decryptedResponse.FIPName);
        }
        decryptedResponse?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push({ ...val, mobileNumber: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber, pan: XORDecryptRes!.pan }));
        discoverBankResponse = AlreadyhaveAccounts;
        dispatch({
          type: DISCOVER_REPONSE,
          body: AlreadyhaveAccounts
        })
      } else {
        const updatedAccounts = discoverBankResponse.map((acc: any) => {
          if (acc.FIPNAME === FipName) {
            return { ...acc, mobileNumber: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber, pan: XORDecryptRes!.pan, sortFlag: acc.FITYPE == 'Not_found' ? '2' : '1' };
          }
          return { ...acc, sortFlag: acc.FITYPE == 'Not_found' ? '2' : '1' };
        });
        dispatch({
          type: DISCOVER_REPONSE,
          body: updatedAccounts
        })
      }
      dispatch({
        type: UPDATE_Loader,
        body: { selectedAccount: FipName }
      });
      return decryptedResponse;
    } catch (error) {
    }
  }

  const Changefipanddiscover = async (fipIds: any) => {
    const requests = fipIds.map(async (fipId: any) => {
      const data = {
        I_MOBILENUMBER: XORDecryptRes.mobileNumber,
        I_BROWSER: 'chrome',
        I_Identifier: [
          {
            I_Flag: 'MOBILE',
            DATA: XORDecryptRes.mobileNumber,
            type: 'STRONG'
          },
          {
            I_Flag: 'PAN',
            DATA: pan ? pan : XORDecryptRes!.pan,
            type: 'WEAK',
          }],
        I_FITYPE: FiDetails.fIType,
        I_FIPID: fipId,
        I_FIPNAME: '', // ASK
        I_SESSION: XORDecryptRes.sessionId,
        I_USERID: XORDecryptRes.mobileNumber,
        UUID,
        I_ConsentHandle: dynData
      }
      const encryptData = Encrypt('Encrypt', JSON.stringify(data))

      try {
        const apiData = UseApi(
          'POST',
          'GetFipDiscoverAndLinkedAccounts',
          encryptData
        )
        const data = await apiData
        const decryptedResponse: any = Decrypt('Decrypt', data);
        return decryptedResponse;
      } catch (error) {
      }
    })
    const responses = await Promise.all(requests);
    let accountCount: number = 0;
    let AlreadyhaveAccounts: any = [];
    if (!!FixFIPNAME) {
      AlreadyhaveAccounts = discoverBankResponse.filter((val: any) => val.FIPNAME !== FixFIPNAME);
      accountCount = AlreadyhaveAccounts.length;
    }
    dispatch({
      type: UPDATE_Loader,
      body: { selectedAccount: FixFIPNAME }
    });
    responses.forEach(item => {
      if (item) {
        if (item.AccountCount > 0) {
          item?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push({ ...val, mobileNumber: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber, pan: XORDecryptRes!.pan, sortFlag: val.FITYPE == 'Not_found' ? '2' : '1' }));
        } else {
          AlreadyhaveAccounts.push({
            "Consent": false,
            "Linked": true,
            "Id": "Not_found",
            "FIPID": getFip(item.FIPName),
            "AMCSHORTCODE": "Not_found",
            "FIPNAME": item.FIPName,
            "FITYPE": "Not_found",
            "ACCDISCOVERYDATE": "Not_found",
            "FIPACCTYPE": "Not_found",
            "FIPACCREFNUM": "Not_found",
            "FIPACCNUM": "Not_found",
            "FIPACCLINKREF": "Not_found",
            "LINKEDDATE": "Not_found",
            "Logo": item.Logo,
            'PartialLoader': false
          })
        }
      }
    })
    let Finalresult = AlreadyhaveAccounts.reduce((unique: any, o: any) => {
      if (!unique.some((obj: any) => obj.FIPID === o.FIPID && obj.FIPNAME === o.FIPNAME && obj.FIPACCNUM === o.FIPACCNUM)) {
        unique.push(o);
      }
      return unique;
    }, []);
    Finalresult = Finalresult.map((item: any) => {
      return ({ ...item, mobileNumber: XORDecryptRes!.mobileNumber, pan: XORDecryptRes!.pan });
    });
    discoverBankResponse = Finalresult;
    setFiDetails((prev: any) => ({ ...prev, fixFipid: [] }));
    dispatch({
      type: DISCOVER_REPONSE,
      body: Finalresult
    })
  }

  const ModifyPanfunc = async (filterResp: any) => {
    let FilterFip: any = [];
    let FiltermobileNumber: any = [];
    let requests: any;
    FilterFip = filterResp.map((item: any) => item.FIPID).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
    FiltermobileNumber = filterResp.map((item: any) => item.mobileNumber).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
    requests = FilterFip.map(async (fipId: any) => {
      return await Promise.all(FiltermobileNumber.map(async (mobileNumber: any) => {
        const data = {
          I_MOBILENUMBER: mobileNumber,
          I_BROWSER: 'chrome',
          I_Identifier: [
            {
              I_Flag: 'MOBILE',
              DATA: mobileNumber,
              type: 'STRONG'
            },
            {
              I_Flag: 'PAN',
              DATA: XORDecryptRes!.pan,
              type: 'WEAK',
            }],
          I_FITYPE: FiDetails.fIType,
          I_FIPID: fipId,
          I_FIPNAME: '', // ASK
          I_SESSION: XORDecryptRes.sessionId,
          I_USERID: XORDecryptRes.mobileNumber,
          UUID,
          I_ConsentHandle: dynData
        }
        const encryptData = Encrypt('Encrypt', JSON.stringify(data))

        try {
          const apiData = UseApi(
            'POST',
            'GetFipDiscoverAndLinkedAccounts',
            encryptData
          )
          const data = await apiData
          const decryptedResponse: any = Decrypt('Decrypt', data);
          return decryptedResponse;
        } catch (error) {
        }
      }))
    })
    const responses = await Promise.all(requests);
    let AlreadyhaveAccounts = discoverBankResponse.filter((val: any) => !val.PartialLoader);
    responses.forEach((item: any) => {
      item.forEach((subitem: any) => {
        if (!!subitem) {
          if (subitem.AccountCount > 0) {
            subitem?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push({ ...val, mobileNumber: subitem.I_Mobile, pan: subitem.I_PAN }));
          } else {
            AlreadyhaveAccounts.push({
              "Consent": false,
              "Linked": true,
              "Id": "Not_found",
              "FIPID": getFip(subitem.FIPName),
              "AMCSHORTCODE": "Not_found",
              "FIPNAME": subitem.FIPName,
              "FITYPE": getFiType(subitem.FIPName),
              "ACCDISCOVERYDATE": "Not_found",
              "FIPACCTYPE": "Not_found",
              "FIPACCREFNUM": "Not_found",
              "FIPACCNUM": "Not_found",
              "FIPACCLINKREF": "Not_found",
              "LINKEDDATE": "Not_found",
              "Logo": subitem.Logo,
              "mobileNumber": subitem.I_Mobile,
              'PartialLoader': false
            })
          }
        }
      })
    })
    let Finalresult = AlreadyhaveAccounts.reduce((unique: any, o: any) => {
      if (!unique.some((obj: any) => obj.FIPID === o.FIPID && obj.mobileNumber === o.mobileNumber && obj.FIPACCNUM === o.FIPACCNUM)) {
        unique.push(o);
      }
      return unique;
    }, []);
    Finalresult = Finalresult.map((item: any) => {
      return ({ ...item, sortFlag: item.FITYPE == 'Not_found' ? '2' : '1' });
    });
    discoverBankResponse = Finalresult;
    setVerifyLoader(false);
    setFiDetails((prev: any) => ({ ...prev, fixFipid: [] }));
    dispatch({
      type: DISCOVER_REPONSE,
      body: Finalresult
    })
  }

  const getFiType = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].Flag == 'BANK' ? 'DEPOSIT' : FetchedFIP[0].Flag == 'MF' ? 'MUTUAL_FUNDS' : FetchedFIP[0].Flag : 'Not_found';
  }

  const isDisabled = () => {
    if (!!discoverBankResponse) {
      let FilterValidResponse = discoverBankResponse.filter((d: any) => d.FIPACCREFNUM !== "Not_found");
      // let isLinked = FilterValidResponse.filter((d:any) =>  d.isChecked).length;
      let isLinkedChecked = FilterValidResponse.filter((d: any) => d.isChecked && d.Linked).length;
      return (isLinkedChecked > 0 && checked) ? false : true;
    }
  };

  const getFip = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].FIPID : 'Not_found';
  }

  useEffect(() => {
    let recoverAccount: any = [];
    recoverAccount = discoverBankResponse.filter((x: any) => !!x.PartialLoader && x.PartialLoader);
    if (ActiveFICategory == 'GSTR') {
      dispatch({
        type: GSTFlag,
        body: null
      })
      if (recoverAccount.length > 0 && gstflag == 'Addmobile') {
        RecoverAccount(recoverAccount[0].FIPNAME)
      } else if (recoverAccount.length > 0 && gstflag == 'ModifyPan') {
        ModifyPanfunc(recoverAccount);
      }
    } else {
      if (recoverAccount.length > 0 && FiDetails.fixFipid.length == 0) {
        RecoverAccount(recoverAccount[0].FIPNAME)
      } else if (recoverAccount.length > 0 && FiDetails.fixFipid.length > 0) {
        Changefipanddiscover(FiDetails.fixFipid)
      }
    }
  }, [])

  const closeDrawer = () => {
    setIsOpen(false);
  }
  useEffect(() => {
    if (Object.keys(discoverData).length > 0) {
      // getConcentHandelDetails()
      getBankDetails()
      RenderMultipleBanks()
    }
  }, [isOpen])


  useEffect(() => {
    if (Object.keys(discoverData).length > 0) {
      RenderMultipleBanks()
    }
  }, [selectedBank, FIPDetailsList, discoverBankResponse])

  return (
    <>
      <div className="accounts_design">
        <Heading
          checked={checkValue}
          Backbtn={false}
          closebtn={true}
        ></Heading>

        <div className="main-body">
          <div className="user-account">
            <h5>We found your accounts</h5>
            <p>Select and confirm the accounts you want to connect!</p>
          </div>
          {FICategory === 'GSTR' && <div className="pan-edit">
            <h5>PAN: {pan ? pan.toUpperCase() : XORDecryptRes.pan.toUpperCase()}</h5>
            <button onClick={() => {
              navigate("/PanRequired")
            }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3333 2.66666H2.66668C1.92668 2.66666 1.34001 3.25999 1.34001 3.99999L1.33334 12C1.33334 12.74 1.92668 13.3333 2.66668 13.3333H13.3333C14.0733 13.3333 14.6667 12.74 14.6667 12V3.99999C14.6667 3.25999 14.0733 2.66666 13.3333 2.66666ZM13.3333 12H2.66668V7.99999H13.3333V12ZM13.3333 5.33332H2.66668V3.99999H13.3333V5.33332Z" />
              </svg>Edit PAN</button>
          </div>}
          <div className="bankcard">
            {bankListState.map((item: any) => (

              <BankCard
                handleClickPopupBtn={onClickTrackNow}
                key={item}
                PartialLoader={dicOfBank[item][0]?.PartialLoader}
                logo={dicOfBank[item][0]?.Logo}
                indicator={dicOfBank[item][0]?.AMCSHORTCODE}
                onSelect={handleChange}
                bankName={ActiveFICategory === 'GSTR' ? dicOfBank[item][0]?.mobileNumber : dicOfBank[item][0]?.FIPNAME}
                fipid={dicOfBank[item][0]?.FIPID}
                bankCounts={dicOfBank[item]?.length}
                list={dicOfBank[item]}
                pan={XORDecryptRes.pan}
              ></BankCard>

            ))}
            {FICategory === 'GSTR' && <div className="add-mobile">
              <button
                onClick={() => {
                  navigate("/entermobilenumber")
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.99998 1.33334C6.68144 1.33334 5.39251 1.72434 4.29618 2.45688C3.19985 3.18942 2.34537 4.23061 1.84079 5.44879C1.3362 6.66696 1.20418 8.00741 1.46141 9.30061C1.71865 10.5938 2.35359 11.7817 3.28594 12.7141C4.21829 13.6464 5.40617 14.2813 6.69938 14.5386C7.99259 14.7958 9.33303 14.6638 10.5512 14.1592C11.7694 13.6546 12.8106 12.8001 13.5431 11.7038C14.2757 10.6075 14.6666 9.31855 14.6666 8.00001C14.6666 7.12453 14.4942 6.25762 14.1592 5.44879C13.8241 4.63995 13.3331 3.90502 12.714 3.28596C12.095 2.66691 11.36 2.17584 10.5512 1.84081C9.74237 1.50578 8.87546 1.33334 7.99998 1.33334ZM7.99998 13.3333C6.94515 13.3333 5.914 13.0205 5.03694 12.4345C4.15988 11.8485 3.47629 11.0155 3.07263 10.041C2.66896 9.06645 2.56334 7.99409 2.76913 6.95953C2.97492 5.92496 3.48287 4.97465 4.22875 4.22877C4.97463 3.48289 5.92494 2.97494 6.9595 2.76916C7.99407 2.56337 9.06642 2.66899 10.041 3.07265C11.0155 3.47632 11.8485 4.15991 12.4345 5.03697C13.0205 5.91403 13.3333 6.94518 13.3333 8.00001C13.3333 9.4145 12.7714 10.7711 11.7712 11.7712C10.771 12.7714 9.41447 13.3333 7.99998 13.3333ZM10.6666 7.33334H8.66665V5.33334C8.66665 5.15653 8.59641 4.98696 8.47139 4.86194C8.34636 4.73691 8.17679 4.66668 7.99998 4.66668C7.82317 4.66668 7.6536 4.73691 7.52858 4.86194C7.40355 4.98696 7.33332 5.15653 7.33332 5.33334V7.33334H5.33332C5.1565 7.33334 4.98694 7.40358 4.86191 7.52861C4.73689 7.65363 4.66665 7.8232 4.66665 8.00001C4.66665 8.17682 4.73689 8.34639 4.86191 8.47141C4.98694 8.59644 5.1565 8.66668 5.33332 8.66668H7.33332V10.6667C7.33332 10.8435 7.40355 11.0131 7.52858 11.1381C7.6536 11.2631 7.82317 11.3333 7.99998 11.3333C8.17679 11.3333 8.34636 11.2631 8.47139 11.1381C8.59641 11.0131 8.66665 10.8435 8.66665 10.6667V8.66668H10.6666C10.8435 8.66668 11.013 8.59644 11.1381 8.47141C11.2631 8.34639 11.3333 8.17682 11.3333 8.00001C11.3333 7.8232 11.2631 7.65363 11.1381 7.52861C11.013 7.40358 10.8435 7.33334 10.6666 7.33334Z" />
                </svg>Add mobile number</button>
            </div>}
          </div>
          {/* <img src={ dicOfBank[0].logo } style={{ width:25, height:25 }}></img> */}

        </div>

        <div className="bottomSpace">
          {/* {consentData.map((value: any, index: number) => */}
          <div className="consent choose-design">
            {/* {consentData.length > 1 &&  */}
            <div className='checkbox-swipe'>
              <input
                type="checkbox"
                id="consentCheckbox"
                name="list-radio"
                className='radio-design'
                defaultChecked
                checked={checked}
                onChange={() => {
                  setChecked(!checked)
                }}
              />
            </div>
            {/* } */}
            <p className="consentDetails">
              I consent to share my banking information with {XORDecryptRes.fiuName}.

              <span
                onClick={() => {
                  OnClickConsent()
                }}
                className="viewConsentDetails"
              >
                View Consent details.
              </span>
            </p>
          </div>
          {/* )} */}

          <div className="user-bankfooter">
            {verifyLoader ? <button
              className='bottom-button'
            >    <img src={images.music} />
            </button> :
              discoverBankResponse.length !== 1 ? <Button
                // name= {fipLength === 1 && falseLinkedFipid  && checkedAccounts.filter((val: any) => !val.Linked ).length ? 'Link accounts' : 'Submit'}
                name={'Submit consent'}
                onClick={finalSubmit}
                disabled={isDisabled()}
              ></Button> :
                <Button
                  name={discoverBankResponse.filter((val: any) => !val.Linked).length ? 'Link account' : 'Submit consent'}
                  onClick={discoverBankResponse.filter((val: any) => !val.Linked).length ? onClickTrackNow : finalSubmit}
                  disabled={discoverBankResponse.filter((val: any) => !val.isChecked).length || !checked}
                ></Button>
            }
            <Footer />
          </div>
        </div>
      </div>
      {consentDetails !== undefined && consentDetails.length > 1 ? (
        <MultiConsentBottomSheet
          handleClose={OnClickConsent}
          open={open}
          index={index}
        />
      ) : <ConsentBottomSheet
        handleClose={OnClickConsent}
        open={open}
        index={index}
      />}{' '}

      <VerifyLottie
        isOpen={isOpenLoader}
        setIsOpen={setIsOpenLoader}
      // handleClose={ () => { closeDrawer() }}
      ></VerifyLottie>

      <VerifyBank
        CurrentLinkBank={CurrentLinkBank}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // OnExit={onClickDenyTrack}
        handleClose={() => { closeDrawer() }}
        bankName={bankListName}
      // list={dicOfBank[item]}
      ></VerifyBank>


      {/* On deny click */}
      <DenyAndExit
        handleClose={onClickDeny}
        isOpen={isModal}
        pageName={'Account_Discovery'}
        OnExit={onClickDeny}
      ></DenyAndExit>
      <DenyTracking
        isOpen={isModalTrack}
        handleClose={onClickDenyTrack}
        pageName={'Account_Discovery'}
      ></DenyTracking>
      <ImportentModal isOpen={isImportant} onSubmitbtn={onSubmit} handleClose={() => { setIsImportant(false) }}></ImportentModal>
    </>
  )
}
export default UserBankAccount
