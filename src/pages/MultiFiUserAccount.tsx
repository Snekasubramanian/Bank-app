import React, { type ChangeEvent, useEffect, useState } from 'react'
import BackButton from '../component/back-button/BackButton'
import images from '../assets/images'
import Heading from '../component/heading/Heading'
import BankCard from '../component/bank-card/BankCard'
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
import ConsentBottomSheet from '../modal/consentBottomSheet'
import DenyAndExit from '../modal/DenyAndExit'
import DenyTracking from '../modal/DenyTracking'
import { EventtrackerApi } from '../services/api/event'
import VerifyBank from './VerifyBank'
import { Active_FI_CATEGORY, BankState, DISCOVER_REPONSE, UPDATE_Loader,MultiFicloser, GSTFlag } from '../store/types/bankListType'
import { RootStateType } from '../store/reducers'
import ImportentModal from '../modal/ImportentModal'
import VerifyLottie from '../pages/VerifyLottie';
import MulticonsentBottom from '../modal/MulticonsentBottom'
import MultiConsentBottomSheet from '../modal/MulticonsentBottom'
import ChoosebankModal from './ChoosebankModal'
import DiscoverTemplate from './DiscoverTemplate'
import NotifyModal from '../modal/NotifyModal'
import Modifydrawer from './Modifydrawer'
import PanMultifi from './Pan_multifi'
const MultiFiUserAccount = () => {
  let concentData: any
  let bankList: string[] = []
  let bankDict: any = {}
  let eventList: any = {}
  let SubmittedeventList: any = {}
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  let { discoverBankResponse, consentDetails, consentData, dynData, FixFIPNAME, ActiveFICategory, FICategory, choosebanklist,closer,gstflag} = useSelector<RootStateType, BankState>((state) => state.bank);
  const [selectedBank, setSelectedBank] = useState<any>([])
  const [discoverData, setDiscoverData] = useRecoilState<any>(discoveredDataAtom)
  const [UUID] = useRecoilState(UUIDAtom)
  const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [, setRefNumber] = useRecoilState(refNumberAtom)
  const [currentfip, setCurrentfip] = useRecoilState(CurrentFipAtom)
  const [FiDetails, setFiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [FIPDetailsList, setFIPDetailsList] =
    useRecoilState<any>(FIPDetailsListAtom)
  const [consent, setConsent] = useState<any>(true)
  const [bankListState, setBankListState] = useState<any>([])
  const [CurrentLinkBank, setCurrentLinkBank] = useState([])
  const [FilterdiscoverBankResponse, setFilterdiscoverBankResponse] = useState([])
  const [Ficategories, setFicategories] = useState([])
  const [Activelabel, setActivelabel] = useState("");
  const [Lastlabel, setLastlabel] = useState("")
  const [dicOfBank, setDicOfBank] = useState<any>([])
  const [open, setOpen] = React.useState(false)
  const [isModal, setIsModal] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [isOpenbank, setIsOpenbank] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenLoader, setIsOpenLoader] = useState(false);
  const [bankListName, setBankListName] = useState<any>();
  const [index, setIndex] = useState<any>();
  const [Servicecall, setServicecall] = useState<any>(false);
  const [disablebtn, setdisablebtn] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false)
  const [isOpenModify, setIsOpenModify] = useState(false);
  const [showBank, setShowBank] = useState(true);
  const fipLength: any = FiDetails?.fipid.length;
  let falseLinkedFipid: any = {};
  const checkValue: boolean = false;
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
    FilterdiscoverBankResponse.forEach((item: any, index: any) => {
      if (ActiveFICategory === 'GSTR') {
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
    bankList = [];
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
    setBankListState(bankList) // SetBankObjectState here
  }
  /* 10. View Consent Details Click -> On click Consent text popup of consent will open */
  const OnClickConsent = () => {
    setOpen((prev) => !prev);
  }

  const ChoosecloseDrawer = () => {
    setIsOpenbank(false);
  }

  const ModifycloseDrawer = () => {
    setIsOpenModify(false);
  }

  /* 7.	On deny click -> here on Deny button click popup modal will Open */
  const onClickDeny = () => {
    setIsModal((prev: boolean) => !prev);
  }

  /* 5.	Back Pressed and Exit Clicked ->here on back button click popup modal will Open */
  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }



  const navigatenext = () => {
   let index =  Ficategories.findIndex(obj=> obj == Activelabel);
   if(index == (Ficategories.length - 1)){
    let FilterValidResponse = discoverBankResponse.filter((d: any) => d.FIPACCREFNUM !== "Not_found");
    if (FilterValidResponse.length === FilterValidResponse.filter((d: any) => d.isChecked && d.Linked).length) {
      navigate('/Summary');
    } else {
      setIsImportant(true);
    }
   }else if(index < Ficategories.length){
    setActivelabel(Ficategories[index+1]);
    dispatch({type: Active_FI_CATEGORY,body: Ficategories[index+1]})
   }
  }



  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const toLinkBank: any = []
    const checkedVal = JSON.parse(event.target.value)
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

  /*   13.	On Continue Click on the Account Discovery & Linked Screen -> On this click Link Api is called */
  const onClickTrackNow = async (event: any) => {
    setIsOpenLoader(true);
    event = event.length ? event : FilterdiscoverBankResponse
    const toLinkBank: any = []
    setCurrentLinkBank(!!event ? event : []);
    setBankListName(event[0].FIPNAME);
    event.forEach((item: any) => {
      if (item.Consent === false && item.Linked === false && item.isChecked) {
        console.log("item", item)
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
    console.log("toLinkBank", toLinkBank)
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
        const apiResponse = UseApi('POST', 'Link', encryptedData)
        const data = await apiResponse

        const decryptedResponse: any = Decrypt('Decrypt', data)
        if (decryptedResponse?.RESULT_CODE === '200') {
          setRefNumber(decryptedResponse?.RefNumber ?? '')
          setIsOpen(true)
          setIsOpenLoader(false);
        }
      } catch (error) {
        setIsOpen(false)
        setIsOpenLoader(false);
      }
    }
  }

  const summaryNavigate = () => {
    navigate('/Summary');
  }

  const RecoverAccount = async (value: any) => {
    let fip: any = [];
    if (value.FIPID == 'Not_found') {
      fip = choosebanklist.filter((val: any) => val.FIPNAME === value.FIPNAME);
    }
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
          DATA: XORDecryptRes!.pan,
          type: 'WEAK',
        }],
      I_FITYPE: FiDetails.fIType,
      I_FIPID: value.FIPID == 'Not_found' ? fip[0]?.FIPID : value.FIPID,
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
        if (ActiveFICategory === 'GSTR') {
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
          if (acc.FIPNAME === value.FIPNAME) {
            return { ...acc, mobileNumber: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber, pan: XORDecryptRes!.pan, PartialLoader: false, sortFlag: acc.FITYPE == 'Not_found' ? '2' : '1' };
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
        body: { selectedAccount: value.FipName }
      });
      setServicecall(false);
      setVerifyLoader(false);
      return decryptedResponse;
    } catch (error) {
      setServicecall(false);
      setVerifyLoader(false);
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
    })
    const responses = await Promise.all(requests);
    let accountCount: number = 0;
    let AlreadyhaveAccounts = discoverBankResponse.length > 0 ? discoverBankResponse : [];
    if (!!FixFIPNAME) {
      AlreadyhaveAccounts = discoverBankResponse.filter((val: any) => val.FIPNAME !== FixFIPNAME);
      accountCount = AlreadyhaveAccounts.length;
    }
    dispatch({
      type: UPDATE_Loader,
      body: { selectedAccount: FixFIPNAME }
    });
    responses.forEach(item => {
      if(!!item){
        AlreadyhaveAccounts = AlreadyhaveAccounts.filter((val: any) => !val.PartialLoader);
      if (item.AccountCount > 0) {
        AlreadyhaveAccounts = AlreadyhaveAccounts.filter((val: any) => val.FIPNAME !== item.FIPName && !val.PartialLoader);
        item?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push({ ...val, mobileNumber: XORDecryptRes.SecondarymobileNumber ? XORDecryptRes.SecondarymobileNumber : XORDecryptRes.mobileNumber, pan: XORDecryptRes!.pan }));
      } else {
        AlreadyhaveAccounts.push({
          "Consent": false,
          "Linked": true,
          "Id": "Not_found",
          "FIPID": getFip(item.FIPName),
          "AMCSHORTCODE": "Not_found",
          "FIPNAME": item.FIPName,
          "FITYPE": getFiType(item.FIPName),
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
      return ({ ...item, mobileNumber: XORDecryptRes!.mobileNumber, pan: XORDecryptRes!.pan, sortFlag: item.FITYPE == 'Not_found' ? '2' : '1' });
    });
    discoverBankResponse = Finalresult;
    setServicecall(false);
    setVerifyLoader(false);
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
    setServicecall(false);
    setVerifyLoader(false);
    setFiDetails((prev: any) => ({ ...prev, fixFipid: [] }));
    dispatch({
      type: DISCOVER_REPONSE,
      body: Finalresult
    })
  }

  const getFip = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].FIPID : 'Not_found';
  }

  const getFiType = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].Flag == 'BANK' ? 'DEPOSIT' : FetchedFIP[0].Flag  == 'MF' ? 'MUTUAL_FUNDS' : FetchedFIP[0].Flag : 'Not_found';
  }

  useEffect(() => {
    setFicategories(FICategory.split(','));
    let recoverAccount: any = [];
    recoverAccount = discoverBankResponse.filter((x: any) => !!x.PartialLoader && x.PartialLoader);
    if (recoverAccount.length > 0 && FiDetails.fixFipid.length == 0) {
      RecoverAccount(recoverAccount[0])
    } else if (recoverAccount.length > 0 && FiDetails.fixFipid.length > 0) {
      Changefipanddiscover(FiDetails.fixFipid)
    }
  }, [])

  useEffect(() => {
    if(!!closer){
      setServicecall(true);
      setVerifyLoader(true);
      dispatch({
        type: MultiFicloser,
        body: null
    });
      let recoverAccount: any = [];
      recoverAccount = discoverBankResponse.filter((x: any) => !!x.PartialLoader && x.PartialLoader);
      if(ActiveFICategory == 'GSTR' ){
          dispatch({
            type: GSTFlag,
            body: null
        })
        if (recoverAccount.length > 0 && gstflag == 'Addmobile' ){
          RecoverAccount(recoverAccount[0])
        }else if (recoverAccount.length > 0 && gstflag == 'ModifyPan' ){
          ModifyPanfunc(recoverAccount);
        }
      }else{
        if (recoverAccount.length > 0 && FiDetails.fixFipid.length == 0) {
          RecoverAccount(recoverAccount[0])
        } else if (recoverAccount.length > 0 && FiDetails.fixFipid.length > 0) {
          Changefipanddiscover(FiDetails.fixFipid)
        }
      }
    }
  }, [closer,isOpenbank])

  useEffect(() => {
    setActivelabel(ActiveFICategory);
    setLastlabel(Ficategories[Ficategories.length - 1]);
  }, [Ficategories])

  useEffect(() => {
    discoverBankResponse = discoverBankResponse.sort((a: any, b: any) => parseFloat(a.sortFlag) - parseFloat(b.sortFlag));
    if (Activelabel == 'BANK') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "DEPOSIT" || d.FITYPE == "TERM-DEPOSIT"));
    } else if (Activelabel == 'MF') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "MUTUAL_FUNDS" || d.FITYPE == "SIP"));
    } else if (Activelabel == 'EQUITIES') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "EQUITIES"));
    } else if (Activelabel == 'NPS') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "NPS"));
    } else if (Activelabel == 'GSTR') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE.includes("GST")));
    } else if (Activelabel == 'INSURANCE_POLICIES') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "INSURANCE_POLICIES"));
    }
    let index =  Ficategories.findIndex(obj=> obj == Activelabel);
    if(index == (Ficategories.length - 1)){
      let btnlength = discoverBankResponse.filter((x:any) => x.Id !='Not_found' && x.Linked && x.isChecked).length;
      setdisablebtn(btnlength > 0 ? false : true);
    }else{
      setdisablebtn(false);
    }
    setShowBank(true);
  }, [Activelabel])

  const reloadresponse = () =>{
    discoverBankResponse = discoverBankResponse.sort((a: any, b: any) => parseFloat(a.sortFlag) - parseFloat(b.sortFlag));
    if (Activelabel == 'BANK') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "DEPOSIT" || d.FITYPE == "TERM-DEPOSIT"));
    } else if (Activelabel == 'MF') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "MUTUAL_FUNDS" || d.FITYPE == "SIP"));
    } else if (Activelabel == 'EQUITIES') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "EQUITIES"));
    } else if (Activelabel == 'NPS') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "NPS"));
    } else if (Activelabel == 'GSTR') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE.includes("GST")));
    } else if (Activelabel == 'INSURANCE_POLICIES') {
      setFilterdiscoverBankResponse(discoverBankResponse.filter((d: any) => d.FITYPE == "INSURANCE_POLICIES"));
    }
    let index =  Ficategories.findIndex(obj=> obj == Activelabel);
    if(index == (Ficategories.length - 1)){
      let btnlength = discoverBankResponse.filter((x:any) => x.Id !='Not_found' && x.Linked && x.isChecked).length;
      setdisablebtn(btnlength > 0 ? false : true);
    }else{
      setdisablebtn(false);
    }
  }

  useEffect(() => {
    let Array :any =[];
    if(!!Activelabel){
    if(FilterdiscoverBankResponse.length == 0 && (Activelabel == 'BANK' || Activelabel == 'INSURANCE_POLICIES' )){
      setIsOpenbank(true);
    }else if(FilterdiscoverBankResponse.length == 0 && (Activelabel != 'BANK' && Activelabel != 'INSURANCE_POLICIES' )){
      choosebanklist.map((item:any)=>{
        if(item.Flag == Activelabel){
          Array.push(item.FIPID)
        }
      })
      setServicecall(true);
      setVerifyLoader(true);
      
      Changefipanddiscover(Array);
    }
  }
  }, [FilterdiscoverBankResponse]);


  const closeDrawer = () => {
    setIsOpen(false);
  }
  useEffect(() => {
    reloadresponse();
  }, [isOpen])

  useEffect(() => {
    console.log(showBank)
  }, [showBank])

  useEffect(()=>{
    RenderMultipleBanks();
  },[FilterdiscoverBankResponse])

  useEffect(() => {
    reloadresponse();
  }, [selectedBank, FIPDetailsList, discoverBankResponse])

  return (
    <>
        <div className="account_container">
          <Heading
            checked={checkValue}
            Backbtn={false}
            closebtn={true}
          ></Heading>
          <div className="main-body">
            {/* multifi card design */}
              <div className="multify-design">
              {/* <button className='active-button inactive-button sucess-button'> */}
              {Ficategories.map((label: any) => (<>
                {label == 'BANK' && <button disabled={Servicecall} className={Activelabel == label ? 'active-button' : 'inactive-button'} onClick={() => { setActivelabel(label); dispatch({ type: Active_FI_CATEGORY, body: label }) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.9999 6.66662C14.0875 6.66665 14.1742 6.64942 14.2551 6.61592C14.336 6.58243 14.4095 6.53332 14.4714 6.47141C14.5333 6.4095 14.5824 6.336 14.6159 6.25511C14.6494 6.17421 14.6666 6.08751 14.6666 5.99996V3.99996C14.6666 3.86007 14.6227 3.72373 14.5408 3.61025C14.459 3.49678 14.3436 3.41195 14.2109 3.3678L8.21086 1.3678C8.07392 1.32222 7.92591 1.32222 7.78898 1.3678L1.78898 3.3678C1.65625 3.41195 1.54079 3.49678 1.45899 3.61025C1.37719 3.72373 1.33319 3.86007 1.33325 3.99996V5.99996C1.33323 6.08751 1.35046 6.17421 1.38395 6.25511C1.41745 6.336 1.46655 6.4095 1.52846 6.47141C1.59037 6.53332 1.66388 6.58243 1.74477 6.61592C1.82566 6.64942 1.91236 6.66665 1.99992 6.66662H2.66659V11.4561C2.27774 11.5931 1.94083 11.8471 1.7021 12.1832C1.46336 12.5193 1.33452 12.921 1.33325 13.3333V14.6666C1.33323 14.7542 1.35046 14.8409 1.38395 14.9218C1.41745 15.0027 1.46655 15.0762 1.52846 15.1381C1.59037 15.2 1.66388 15.2491 1.74477 15.2826C1.82566 15.3161 1.91236 15.3333 1.99992 15.3333H13.9999C14.0875 15.3333 14.1742 15.3161 14.2551 15.2826C14.336 15.2491 14.4095 15.2 14.4714 15.1381C14.5333 15.0762 14.5824 15.0027 14.6159 14.9218C14.6494 14.8409 14.6666 14.7542 14.6666 14.6666V13.3333C14.6653 12.921 14.5365 12.5193 14.2977 12.1832C14.059 11.8471 13.7221 11.5931 13.3333 11.4561V6.66662H13.9999ZM13.3333 14H2.66659V13.3333C2.66676 13.1565 2.73706 12.9871 2.86204 12.8621C2.98703 12.7371 3.1565 12.6668 3.33325 12.6666H12.6666C12.8433 12.6668 13.0128 12.7371 13.1378 12.8621C13.2628 12.9871 13.3331 13.1565 13.3333 13.3333V14ZM3.99992 11.3333V6.66662H5.33325V11.3333H3.99992ZM6.66659 11.3333V6.66662H9.33325V11.3333H6.66659ZM10.6666 11.3333V6.66662H11.9999V11.3333H10.6666ZM2.66659 5.33329V4.48042L7.99992 2.70242L13.3333 4.48042V5.33329H2.66659Z" fill="white" />
                  </svg>Banks</button>}
                {label == 'MF' && <button disabled={Servicecall} className={Activelabel == label ? 'active-button' : 'inactive-button'} onClick={() => { setActivelabel(label); dispatch({ type: Active_FI_CATEGORY, body: label }) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4.66667 10.6667C4.93188 10.6667 5.18624 10.5614 5.37377 10.3738C5.56131 10.1863 5.66667 9.93192 5.66667 9.66671C5.66992 9.63345 5.66992 9.59996 5.66667 9.56671L7.52667 7.70671H7.68H7.83333L8.90667 8.78004C8.90667 8.78004 8.90667 8.81337 8.90667 8.83337C8.90667 9.09859 9.01202 9.35294 9.19956 9.54048C9.3871 9.72802 9.64145 9.83337 9.90667 9.83337C10.1719 9.83337 10.4262 9.72802 10.6138 9.54048C10.8013 9.35294 10.9067 9.09859 10.9067 8.83337V8.78004L13.3333 6.33337C13.5311 6.33337 13.7245 6.27473 13.8889 6.16484C14.0534 6.05496 14.1815 5.89878 14.2572 5.71606C14.3329 5.53333 14.3527 5.33226 14.3141 5.13828C14.2755 4.9443 14.1803 4.76612 14.0404 4.62627C13.9006 4.48641 13.7224 4.39117 13.5284 4.35259C13.3344 4.314 13.1334 4.33381 12.9507 4.40949C12.7679 4.48518 12.6117 4.61335 12.5019 4.7778C12.392 4.94225 12.3333 5.13559 12.3333 5.33337C12.3301 5.36663 12.3301 5.40012 12.3333 5.43337L9.92667 7.84004H9.82L8.66667 6.66671C8.66667 6.40149 8.56131 6.14714 8.37377 5.9596C8.18624 5.77206 7.93188 5.66671 7.66667 5.66671C7.40145 5.66671 7.1471 5.77206 6.95956 5.9596C6.77202 6.14714 6.66667 6.40149 6.66667 6.66671L4.66667 8.66671C4.40145 8.66671 4.1471 8.77206 3.95956 8.9596C3.77202 9.14714 3.66667 9.40149 3.66667 9.66671C3.66667 9.93192 3.77202 10.1863 3.95956 10.3738C4.1471 10.5614 4.40145 10.6667 4.66667 10.6667ZM13.6667 13.3334H2.33333V2.00004C2.33333 1.82323 2.2631 1.65366 2.13807 1.52864C2.01305 1.40361 1.84348 1.33337 1.66667 1.33337C1.48986 1.33337 1.32029 1.40361 1.19526 1.52864C1.07024 1.65366 1 1.82323 1 2.00004V14C1 14.1769 1.07024 14.3464 1.19526 14.4714C1.32029 14.5965 1.48986 14.6667 1.66667 14.6667H13.6667C13.8435 14.6667 14.013 14.5965 14.1381 14.4714C14.2631 14.3464 14.3333 14.1769 14.3333 14C14.3333 13.8232 14.2631 13.6537 14.1381 13.5286C14.013 13.4036 13.8435 13.3334 13.6667 13.3334Z" />
                  </svg>MF
                </button>}
                {label == 'EQUITIES' && <button disabled={Servicecall} className={Activelabel == label ? 'active-button' : 'inactive-button'} onClick={() => { setActivelabel(label); dispatch({ type: Active_FI_CATEGORY, body: label }) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33341 8.00004C3.1566 8.00004 2.98703 8.07028 2.86201 8.1953C2.73699 8.32033 2.66675 8.4899 2.66675 8.66671V14C2.66675 14.1769 2.73699 14.3464 2.86201 14.4714C2.98703 14.5965 3.1566 14.6667 3.33341 14.6667C3.51023 14.6667 3.67979 14.5965 3.80482 14.4714C3.92984 14.3464 4.00008 14.1769 4.00008 14V8.66671C4.00008 8.4899 3.92984 8.32033 3.80482 8.1953C3.67979 8.07028 3.51023 8.00004 3.33341 8.00004ZM6.66675 1.33337C6.48994 1.33337 6.32037 1.40361 6.19534 1.52864C6.07032 1.65366 6.00008 1.82323 6.00008 2.00004V14C6.00008 14.1769 6.07032 14.3464 6.19534 14.4714C6.32037 14.5965 6.48994 14.6667 6.66675 14.6667C6.84356 14.6667 7.01313 14.5965 7.13815 14.4714C7.26318 14.3464 7.33341 14.1769 7.33341 14V2.00004C7.33341 1.82323 7.26318 1.65366 7.13815 1.52864C7.01313 1.40361 6.84356 1.33337 6.66675 1.33337ZM13.3334 10.6667C13.1566 10.6667 12.987 10.7369 12.862 10.862C12.737 10.987 12.6667 11.1566 12.6667 11.3334V14C12.6667 14.1769 12.737 14.3464 12.862 14.4714C12.987 14.5965 13.1566 14.6667 13.3334 14.6667C13.5102 14.6667 13.6798 14.5965 13.8048 14.4714C13.9298 14.3464 14.0001 14.1769 14.0001 14V11.3334C14.0001 11.1566 13.9298 10.987 13.8048 10.862C13.6798 10.7369 13.5102 10.6667 13.3334 10.6667ZM10.0001 5.33337C9.82327 5.33337 9.6537 5.40361 9.52868 5.52864C9.40365 5.65366 9.33341 5.82323 9.33341 6.00004V14C9.33341 14.1769 9.40365 14.3464 9.52868 14.4714C9.6537 14.5965 9.82327 14.6667 10.0001 14.6667C10.1769 14.6667 10.3465 14.5965 10.4715 14.4714C10.5965 14.3464 10.6667 14.1769 10.6667 14V6.00004C10.6667 5.82323 10.5965 5.65366 10.4715 5.52864C10.3465 5.40361 10.1769 5.33337 10.0001 5.33337Z" />
                  </svg>Equity
                </button>}
                {label == 'NPS' && <button disabled={Servicecall} className={Activelabel == label ? 'active-button' : 'inactive-button'} onClick={() => { setActivelabel(label); dispatch({ type: Active_FI_CATEGORY, body: label }) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14.1466 8C14.4784 7.63491 14.6636 7.16004 14.6666 6.66667C14.6666 6.13623 14.4559 5.62753 14.0808 5.25245C13.7057 4.87738 13.197 4.66667 12.6666 4.66667H9.21325C9.31975 4.36545 9.35254 4.04311 9.30887 3.72662C9.2652 3.41013 9.14634 3.10871 8.96225 2.84759C8.77816 2.58647 8.5342 2.37325 8.25078 2.22579C7.96736 2.07832 7.65274 2.0009 7.33325 2H3.33325C2.80282 2 2.29411 2.21071 1.91904 2.58579C1.54397 2.96086 1.33325 3.46957 1.33325 4C1.33619 4.49337 1.52139 4.96824 1.85325 5.33333C1.52528 5.70002 1.34396 6.17471 1.34396 6.66667C1.34396 7.15862 1.52528 7.63332 1.85325 8C1.52528 8.36668 1.34396 8.84138 1.34396 9.33333C1.34396 9.82529 1.52528 10.3 1.85325 10.6667C1.52139 11.0318 1.33619 11.5066 1.33325 12C1.33325 12.5304 1.54397 13.0391 1.91904 13.4142C2.29411 13.7893 2.80282 14 3.33325 14H12.6666C13.0518 13.9979 13.4281 13.8847 13.7505 13.6739C14.0729 13.4631 14.3275 13.1637 14.4838 12.8116C14.6401 12.4596 14.6915 12.0699 14.6316 11.6894C14.5718 11.3089 14.4034 10.9538 14.1466 10.6667C14.4746 10.3 14.6559 9.82529 14.6559 9.33333C14.6559 8.84138 14.4746 8.36668 14.1466 8ZM7.33325 12.6667H3.33325C3.15644 12.6667 2.98687 12.5964 2.86185 12.4714C2.73682 12.3464 2.66659 12.1768 2.66659 12C2.66659 11.8232 2.73682 11.6536 2.86185 11.5286C2.98687 11.4036 3.15644 11.3333 3.33325 11.3333H7.33325C7.51006 11.3333 7.67963 11.4036 7.80466 11.5286C7.92968 11.6536 7.99992 11.8232 7.99992 12C7.99992 12.1768 7.92968 12.3464 7.80466 12.4714C7.67963 12.5964 7.51006 12.6667 7.33325 12.6667ZM7.33325 10H3.33325C3.15644 10 2.98687 9.92976 2.86185 9.80474C2.73682 9.67971 2.66659 9.51014 2.66659 9.33333C2.66659 9.15652 2.73682 8.98695 2.86185 8.86193C2.98687 8.73691 3.15644 8.66667 3.33325 8.66667H7.33325C7.51006 8.66667 7.67963 8.73691 7.80466 8.86193C7.92968 8.98695 7.99992 9.15652 7.99992 9.33333C7.99992 9.51014 7.92968 9.67971 7.80466 9.80474C7.67963 9.92976 7.51006 10 7.33325 10ZM7.33325 7.33333H3.33325C3.15644 7.33333 2.98687 7.2631 2.86185 7.13807C2.73682 7.01305 2.66659 6.84348 2.66659 6.66667C2.66659 6.48986 2.73682 6.32029 2.86185 6.19526C2.98687 6.07024 3.15644 6 3.33325 6H7.33325C7.51006 6 7.67963 6.07024 7.80466 6.19526C7.92968 6.32029 7.99992 6.48986 7.99992 6.66667C7.99992 6.84348 7.92968 7.01305 7.80466 7.13807C7.67963 7.2631 7.51006 7.33333 7.33325 7.33333ZM7.33325 4.66667H3.33325C3.15644 4.66667 2.98687 4.59643 2.86185 4.4714C2.73682 4.34638 2.66659 4.17681 2.66659 4C2.66659 3.82319 2.73682 3.65362 2.86185 3.5286C2.98687 3.40357 3.15644 3.33333 3.33325 3.33333H7.33325C7.51006 3.33333 7.67963 3.40357 7.80466 3.5286C7.92968 3.65362 7.99992 3.82319 7.99992 4C7.99992 4.17681 7.92968 4.34638 7.80466 4.4714C7.67963 4.59643 7.51006 4.66667 7.33325 4.66667ZM13.1266 12.4733C13.0675 12.5357 12.9961 12.585 12.9169 12.6183C12.8377 12.6516 12.7525 12.6681 12.6666 12.6667H9.21325C9.37312 12.2366 9.37312 11.7634 9.21325 11.3333H12.6666C12.8434 11.3333 13.013 11.4036 13.138 11.5286C13.263 11.6536 13.3333 11.8232 13.3333 12C13.332 12.0887 13.3131 12.1762 13.2776 12.2575C13.2421 12.3388 13.1908 12.4121 13.1266 12.4733ZM13.1266 9.80667C13.0675 9.869 12.9961 9.91837 12.9169 9.95165C12.8377 9.98493 12.7525 10.0014 12.6666 10H9.21325C9.37312 9.56993 9.37312 9.09674 9.21325 8.66667H12.6666C12.8434 8.66667 13.013 8.73691 13.138 8.86193C13.263 8.98695 13.3333 9.15652 13.3333 9.33333C13.332 9.42201 13.3131 9.50955 13.2776 9.59083C13.2421 9.6721 13.1908 9.74548 13.1266 9.80667ZM13.1266 7.14C13.0675 7.20233 12.9961 7.2517 12.9169 7.28499C12.8377 7.31827 12.7525 7.33473 12.6666 7.33333H9.21325C9.37312 6.90327 9.37312 6.43007 9.21325 6H12.6666C12.8434 6 13.013 6.07024 13.138 6.19526C13.263 6.32029 13.3333 6.48986 13.3333 6.66667C13.332 6.75534 13.3131 6.84288 13.2776 6.92416C13.2421 7.00544 13.1908 7.07882 13.1266 7.14Z" />
                  </svg>NPS
                </button>}
                {label == 'GSTR' && <button disabled={Servicecall} className={Activelabel == label ? 'active-button' : 'inactive-button'} onClick={() => { setActivelabel(label); dispatch({ type: Active_FI_CATEGORY, body: label }) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.66659 10.6667H4.66659C4.48978 10.6667 4.32021 10.7369 4.19519 10.8619C4.07016 10.987 3.99992 11.1565 3.99992 11.3333C3.99992 11.5101 4.07016 11.6797 4.19519 11.8047C4.32021 11.9298 4.48978 12 4.66659 12H8.66659C8.8434 12 9.01297 11.9298 9.13799 11.8047C9.26302 11.6797 9.33326 11.5101 9.33326 11.3333C9.33326 11.1565 9.26302 10.987 9.13799 10.8619C9.01297 10.7369 8.8434 10.6667 8.66659 10.6667ZM5.99992 6.66667H7.33326C7.51007 6.66667 7.67964 6.59643 7.80466 6.47141C7.92969 6.34639 7.99992 6.17682 7.99992 6C7.99992 5.82319 7.92969 5.65362 7.80466 5.5286C7.67964 5.40358 7.51007 5.33334 7.33326 5.33334H5.99992C5.82311 5.33334 5.65354 5.40358 5.52852 5.5286C5.4035 5.65362 5.33326 5.82319 5.33326 6C5.33326 6.17682 5.4035 6.34639 5.52852 6.47141C5.65354 6.59643 5.82311 6.66667 5.99992 6.66667ZM13.9999 8.00001H11.9999V2C12.0004 1.88253 11.9698 1.76702 11.9113 1.66517C11.8527 1.56332 11.7683 1.47874 11.6666 1.42C11.5652 1.36149 11.4503 1.33069 11.3333 1.33069C11.2162 1.33069 11.1013 1.36149 10.9999 1.42L8.99992 2.56667L6.99992 1.42C6.89858 1.36149 6.78361 1.33069 6.66659 1.33069C6.54957 1.33069 6.4346 1.36149 6.33326 1.42L4.33326 2.56667L2.33326 1.42C2.23191 1.36149 2.11695 1.33069 1.99992 1.33069C1.8829 1.33069 1.76794 1.36149 1.66659 1.42C1.56485 1.47874 1.48044 1.56332 1.42191 1.66517C1.36337 1.76702 1.33279 1.88253 1.33326 2V12.6667C1.33326 13.1971 1.54397 13.7058 1.91904 14.0809C2.29412 14.456 2.80282 14.6667 3.33326 14.6667H12.6666C13.197 14.6667 13.7057 14.456 14.0808 14.0809C14.4559 13.7058 14.6666 13.1971 14.6666 12.6667V8.66667C14.6666 8.48986 14.5964 8.32029 14.4713 8.19527C14.3463 8.07024 14.1767 8.00001 13.9999 8.00001ZM3.33326 13.3333C3.15645 13.3333 2.98688 13.2631 2.86185 13.1381C2.73683 13.0131 2.66659 12.8435 2.66659 12.6667V3.15334L3.99992 3.91334C4.10282 3.96708 4.21718 3.99515 4.33326 3.99515C4.44934 3.99515 4.5637 3.96708 4.66659 3.91334L6.66659 2.76667L8.66659 3.91334C8.76948 3.96708 8.88384 3.99515 8.99992 3.99515C9.116 3.99515 9.23036 3.96708 9.33326 3.91334L10.6666 3.15334V12.6667C10.6684 12.8941 10.709 13.1196 10.7866 13.3333H3.33326ZM13.3333 12.6667C13.3333 12.8435 13.263 13.0131 13.138 13.1381C13.013 13.2631 12.8434 13.3333 12.6666 13.3333C12.4898 13.3333 12.3202 13.2631 12.1952 13.1381C12.0702 13.0131 11.9999 12.8435 11.9999 12.6667V9.33334H13.3333V12.6667ZM8.66659 8.00001H4.66659C4.48978 8.00001 4.32021 8.07024 4.19519 8.19527C4.07016 8.32029 3.99992 8.48986 3.99992 8.66667C3.99992 8.84348 4.07016 9.01305 4.19519 9.13808C4.32021 9.2631 4.48978 9.33334 4.66659 9.33334H8.66659C8.8434 9.33334 9.01297 9.2631 9.13799 9.13808C9.26302 9.01305 9.33326 8.84348 9.33326 8.66667C9.33326 8.48986 9.26302 8.32029 9.13799 8.19527C9.01297 8.07024 8.8434 8.00001 8.66659 8.00001Z" />
                  </svg>GST
                </button>}
                {label == 'INSURANCE_POLICIES' && <button disabled={Servicecall} className={Activelabel == label ? 'active-button' : 'inactive-button'} onClick={() => { setActivelabel(label); dispatch({ type: Active_FI_CATEGORY, body: label }) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.0868 2.43338C13.0093 2.37072 12.9188 2.32623 12.8219 2.30315C12.725 2.28008 12.6241 2.27902 12.5268 2.30004C11.8144 2.44934 11.079 2.45124 10.3658 2.30563C9.6527 2.16002 8.97691 1.86999 8.38008 1.45338C8.26849 1.37596 8.13591 1.33447 8.00008 1.33447C7.86426 1.33447 7.73168 1.37596 7.62009 1.45338C7.02326 1.86999 6.34747 2.16002 5.63433 2.30563C4.92119 2.45124 4.18579 2.44934 3.47342 2.30004C3.37604 2.27902 3.2752 2.28008 3.17829 2.30315C3.08138 2.32623 2.99087 2.37072 2.91342 2.43338C2.83607 2.49612 2.77377 2.5754 2.73108 2.66539C2.68839 2.75537 2.66641 2.85378 2.66675 2.95338V7.92004C2.66616 8.87587 2.89393 9.81802 3.33111 10.668C3.76828 11.518 4.4022 12.2513 5.18008 12.8067L7.61342 14.54C7.72633 14.6204 7.86148 14.6636 8.00008 14.6636C8.13869 14.6636 8.27384 14.6204 8.38675 14.54L10.8201 12.8067C11.598 12.2513 12.2319 11.518 12.6691 10.668C13.1062 9.81802 13.334 8.87587 13.3334 7.92004V2.95338C13.3338 2.85378 13.3118 2.75537 13.2691 2.66539C13.2264 2.5754 13.1641 2.49612 13.0868 2.43338ZM12.0001 7.92004C12.0006 8.66321 11.8236 9.39576 11.4839 10.0567C11.1441 10.7177 10.6514 11.2879 10.0468 11.72L8.00008 13.18L5.95342 11.72C5.34878 11.2879 4.85607 10.7177 4.51632 10.0567C4.17656 9.39576 3.99957 8.66321 4.00009 7.92004V3.72004C5.3977 3.83966 6.79745 3.51539 8.00008 2.79338C9.20272 3.51539 10.6025 3.83966 12.0001 3.72004V7.92004Z" />
                  </svg>Insurance
                </button>}</>))}
            </div>
            {/* multifi card design end */}
            {(FilterdiscoverBankResponse.length > 0 && showBank ) ? <div>
            <div className="user-account">
              <h5>We found your accounts</h5>
              <p>Select and confirm the accounts you want to connect!</p>
            </div>
            {(ActiveFICategory === 'GSTR' && consent) && <div className="pan-edit">
              <h5>PAN: {XORDecryptRes.pan.toUpperCase()}</h5>
              <button onClick={() => {
                setShowBank(false);
              }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3333 2.66666H2.66668C1.92668 2.66666 1.34001 3.25999 1.34001 3.99999L1.33334 12C1.33334 12.74 1.92668 13.3333 2.66668 13.3333H13.3333C14.0733 13.3333 14.6667 12.74 14.6667 12V3.99999C14.6667 3.25999 14.0733 2.66666 13.3333 2.66666ZM13.3333 12H2.66668V7.99999H13.3333V12ZM13.3333 5.33332H2.66668V3.99999H13.3333V5.33332Z" />
                </svg>Edit PAN</button>
            </div>}
            <div className={(consent) ? "bankcard" : ""}>
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
                  showflag={setShowBank}
                ></BankCard>

              ))}
              {ActiveFICategory === 'GSTR' && <div className="add-mobile">
                <button
                  onClick={() => {
                    setIsOpenModify(true)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99998 1.33334C6.68144 1.33334 5.39251 1.72434 4.29618 2.45688C3.19985 3.18942 2.34537 4.23061 1.84079 5.44879C1.3362 6.66696 1.20418 8.00741 1.46141 9.30061C1.71865 10.5938 2.35359 11.7817 3.28594 12.7141C4.21829 13.6464 5.40617 14.2813 6.69938 14.5386C7.99259 14.7958 9.33303 14.6638 10.5512 14.1592C11.7694 13.6546 12.8106 12.8001 13.5431 11.7038C14.2757 10.6075 14.6666 9.31855 14.6666 8.00001C14.6666 7.12453 14.4942 6.25762 14.1592 5.44879C13.8241 4.63995 13.3331 3.90502 12.714 3.28596C12.095 2.66691 11.36 2.17584 10.5512 1.84081C9.74237 1.50578 8.87546 1.33334 7.99998 1.33334ZM7.99998 13.3333C6.94515 13.3333 5.914 13.0205 5.03694 12.4345C4.15988 11.8485 3.47629 11.0155 3.07263 10.041C2.66896 9.06645 2.56334 7.99409 2.76913 6.95953C2.97492 5.92496 3.48287 4.97465 4.22875 4.22877C4.97463 3.48289 5.92494 2.97494 6.9595 2.76916C7.99407 2.56337 9.06642 2.66899 10.041 3.07265C11.0155 3.47632 11.8485 4.15991 12.4345 5.03697C13.0205 5.91403 13.3333 6.94518 13.3333 8.00001C13.3333 9.4145 12.7714 10.7711 11.7712 11.7712C10.771 12.7714 9.41447 13.3333 7.99998 13.3333ZM10.6666 7.33334H8.66665V5.33334C8.66665 5.15653 8.59641 4.98696 8.47139 4.86194C8.34636 4.73691 8.17679 4.66668 7.99998 4.66668C7.82317 4.66668 7.6536 4.73691 7.52858 4.86194C7.40355 4.98696 7.33332 5.15653 7.33332 5.33334V7.33334H5.33332C5.1565 7.33334 4.98694 7.40358 4.86191 7.52861C4.73689 7.65363 4.66665 7.8232 4.66665 8.00001C4.66665 8.17682 4.73689 8.34639 4.86191 8.47141C4.98694 8.59644 5.1565 8.66668 5.33332 8.66668H7.33332V10.6667C7.33332 10.8435 7.40355 11.0131 7.52858 11.1381C7.6536 11.2631 7.82317 11.3333 7.99998 11.3333C8.17679 11.3333 8.34636 11.2631 8.47139 11.1381C8.59641 11.0131 8.66665 10.8435 8.66665 10.6667V8.66668H10.6666C10.8435 8.66668 11.013 8.59644 11.1381 8.47141C11.2631 8.34639 11.3333 8.17682 11.3333 8.00001C11.3333 7.8232 11.2631 7.65363 11.1381 7.52861C11.013 7.40358 10.8435 7.33334 10.6666 7.33334Z" />
                  </svg>Add mobile number</button>
              </div>}
            </div>
            </div> : Servicecall? <DiscoverTemplate></DiscoverTemplate>: !showBank ? <PanMultifi
        BankFlag={setShowBank}
        ></PanMultifi>:<></>}
          </div>
          
        </div>
        <div className="bottomSpace">
          <div className="user-bankfooter">
            {verifyLoader ? <button
              className='bottom-button '
            >    <img src={images.music} />
            </button> :
                <button  disabled={disablebtn} className={(showBank) ? "bottom-button" : "multi_pan_button"}
                onClick={navigatenext}
              >  Next 
              </button>}
            <Footer />
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
      ></VerifyLottie>

      <VerifyBank
        CurrentLinkBank={CurrentLinkBank}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={() => { closeDrawer() }}
        bankName={bankListName}
      ></VerifyBank>

              { isOpenbank &&  <ChoosebankModal 
                isOpenbank={isOpenbank}
                list={undefined}
                setlabel={setActivelabel}
                setIsOpenbank={setIsOpenbank}
                closeModal={() => { ChoosecloseDrawer() }}/>}


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

        {isOpenModify && <Modifydrawer
                isOpen={isOpenModify}
                setIsOpen={setIsOpenModify}
                handleClose={() => { ModifycloseDrawer() }} Name={'MobileNumber'} list={bankListState[0]}
            ></Modifydrawer>}
     
     <NotifyModal
         isOpen={isImportant}
         handleClose={() => { setIsImportant(false) }}
         nextNavigate={summaryNavigate}
      ></NotifyModal>
    </>
  )
}
export default MultiFiUserAccount
