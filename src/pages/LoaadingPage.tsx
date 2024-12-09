import React, { useEffect, useState } from 'react'
import LottieAnima from '../component/lottie/LottieAnima'
import images from '../assets/images'
import { useLocation, useNavigate } from 'react-router'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import Encrypt from '../services/encrypt'
import {
  UUID as UUIDAtom,
  discoveredData as discoveredDataAtom,
  FiDetails as FiDetailsAtom,
  XORDecryptRes as XorDecryptResAtom,
  nolinkedAccount as nolinkedAccountAtom,
  AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { LOTTIE_LODER_CONST } from './constant'
import { EventtrackerApi } from '../services/api/event'
import Heading from '../component/heading/Heading'
import Skeleton from '@mui/material/Skeleton'
import Button from '../component/button/Button'
// import Button from '@mui/material/Button'
import Footer from '../component/footer/Footer'
import { BankState, CHOOSE_BANK_LIST, CONSENT_DETAILS, DISCOVER_REPONSE, FI_CATEGORY, FI_TYPES, NO_ACCOUNTS_LIST, TRY_AGAIN_COUNT } from '../store/types/bankListType'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import { Category } from '@mui/icons-material'

export type discoverBanksResponseBody = {
  AccountCount: number,
  FIPName: string,
  I_Mobile: number,
  MESSAGE: string,
  RESULT_CODE: string,
  SESSION_ID: string,
  UUID: string,
  fip_DiscoverLinkedlist: BankType[],
}
export type BankType = {
  ACCDISCOVERYDATE: string,
  AMCSHORTCODE: number,
  Consent: boolean,
  FIPACCLINKREF: string,
  FIPACCNUM: string,
  FIPACCREFNUM: string,
  FIPACCTYPE: string,
  FIPID: string,
  FIPNAME: string,
  FITYPE: string,
  Id: string,
  LINKEDDATE: string,
  Linked: boolean,
  Logo: string,
}

export default function LoadingPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const checkValue: boolean = false;
  let isPanRequired: any
  let asset_value: any
  // let tryAgainCount: any = 0
  const [UUID] = useRecoilState(UUIDAtom)
  let { discoverBankResponse, FixFIPNAME, choosebanklist, TryAgainCount, FITypes, ActiveFICategory,FICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [, setDiscoverData] = useRecoilState(discoveredDataAtom)
  const [, setNoLinkedAccount] = useRecoilState(nolinkedAccountAtom);
  const [AlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
  const [consentFIType, setConsentFIType] = useState<any>()
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const { dynData } = useSelector<RootStateType, BankState>((state) => state.bank);
  const fipIds = FiDetails.fipid;
  const dispatch = useDispatch();
  let pan = location?.state?.panNumber ? location?.state?.panNumber : XORDecryptRes.pan 
  isPanRequired = FICategory.includes('MF') || FICategory.includes('GSTR') || FICategory.includes('EQUITIES')
  asset_value = ActiveFICategory === "BANK"
      ? 'BANK'
      : ActiveFICategory === "MF"
        ? 'MF_ETF_OTHERS'
        : ActiveFICategory === "NPS"
          ? 'NPS'
          : ActiveFICategory === "EQUITIES"
            ? 'EQUITIES'
            : ActiveFICategory === 'INSURANCE_POLICIES'
              ? 'INSURANCE'
              : 'GSTR'

  // GetFipDiscoverAndLinkedAccounts API Call
  
  
  const GetFipDiscoverAndLinkedAccounts = async (fipId: any) => {
    const data = {
      I_MOBILENUMBER: AlreadyLinkedMobileNum ? AlreadyLinkedMobileNum : XORDecryptRes.mobileNumber,
      I_BROWSER: 'chrome',
      I_Identifier: Identifier(),
      I_FITYPE: FiDetails.fIType ? FiDetails.fIType : XORDecryptRes.fIType,
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
      const decryptedResponse: any = Decrypt('Decrypt', data)
      return decryptedResponse;
    } catch (error) {
    }
  }


  useEffect(() => { 
    if (!pan && isPanRequired) {
      navigate("/PanRequired")
    }
    else {
      preLoading();
    }
  }, [])

 

  const Identifier = () => {
    const identifiers = FICategory.includes("GSTR") || FICategory.includes('MF') || FICategory.includes("EQUITIES")
      ? [
        {
          I_Flag: 'MOBILE',
          DATA: XORDecryptRes!.mobileNumber ? XORDecryptRes!.mobileNumber : '',
          type: 'STRONG',
        },

        {
          I_Flag: 'PAN',
          DATA: pan ? pan : XORDecryptRes!.pan,
          type: 'WEAK',
        },
      ]
      : [
        {
          I_Flag: 'MOBILE',
          DATA: XORDecryptRes!.mobileNumber ? XORDecryptRes!.mobileNumber : '',
          type: 'STRONG',
        }
      ];
    return identifiers;
  }


  const getFip = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].FIPID : 'Not_found';
  }

  const getFiType = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].Flag == 'BANK' ? 'DEPOSIT' : FetchedFIP[0].Flag  == 'MF' ? 'MUTUAL_FUNDS' : FetchedFIP[0].Flag : 'Not_found';
  }
  const preLoading = async () => {
    const requests = fipIds.map((fipId: any) => {
      if(!!fipId){
        return GetFipDiscoverAndLinkedAccounts(fipId);
      }
    })
    const responses = await Promise.all(requests);
    let MergeArray: any = [];
    let accountCount: number = 0;
    if (!!FixFIPNAME) {
      let AlreadyhaveAccounts: [] = discoverBankResponse.filter((val: any) => val.FIPNAME !== FixFIPNAME);
      MergeArray = AlreadyhaveAccounts;
      accountCount = MergeArray.length;
    }
    responses.forEach(item => {
      if (!!item) {
        accountCount = accountCount + item.AccountCount;
        if (item.AccountCount > 0) {
          item.fip_DiscoverLinkedlist.map((val: any) => {
            MergeArray.push(val);
          })
        } else {
          MergeArray.push({
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
            'PartialLoader':false
          })
        }
      }
    })
    dispatch({
      type: NO_ACCOUNTS_LIST,
      body: MergeArray
    });
    setNoLinkedAccount(MergeArray);
    let Finalresult = MergeArray.reduce((unique: any, o: any) => {
      if (!unique.some((obj: any) => obj.FIPID === o.FIPID && obj.FIPNAME === o.FIPNAME && obj.FIPACCNUM === o.FIPACCNUM)) {
        unique.push(o);
      }
      return unique;
    }, []);
    Finalresult = Finalresult.map((item:any) => {
      return ({ ...item, mobileNumber:XORDecryptRes!.mobileNumber,pan :XORDecryptRes!.pan, sortFlag : item.FITYPE == 'Not_found' ? '2' :'1' });
    });
    setDiscoverData(Finalresult)
      if(FICategory.split(',').length > 1){
        dispatch({
          type: DISCOVER_REPONSE,
          body: Finalresult
        });
        navigate('/MultiFiUserAccount');
      }else if(FICategory.split(',').length == 1){
        if (accountCount === 0) {
        dispatch({
          type: TRY_AGAIN_COUNT,
          body: TryAgainCount
        })
        navigate('/warningPage')
      } else {
        dispatch({
          type: DISCOVER_REPONSE,
          body: Finalresult
        });
        navigate('/userAccount', { state: { panNumber: pan } })
      }
    } 
  }

  return (
    <>
      <div className="h-screen  card-shimmer">
        <Heading
          checked={checkValue}
          Backbtn={false}
          closebtn={false}
        ></Heading>
        <div className="scroll-loader ">

          <div className="loading-header">
            <h5>Discovering accounts...</h5>
            <div className="dis-paragraph">
              <div className="paragraph  "></div>
              <div className="paragraph-sub  "></div>
              <div className=" shimmerBG dicover-shimmer"></div>
            </div>
          </div>
          <div className="cards-link">
            <div className="discovering-card">
              <div className="discover-topbox">
                <div className="discover-page">
                  <div className="boxes  "></div>
                  <div className="discover-textograpy">
                    <div className="paragraph-three  "></div>
                    <div className="paragraph-four  "></div>
                  </div>
                </div>
                <div className="dicover-link">
                  <div className="button-links  ">
                    <div className="link-text  "></div>
                  </div>
                </div>
              </div>
              <div className="line-dicover"></div>
              <div className="discover-bottom">
                <div className="discover-pages">
                  <div className="paragraph-five  "></div>
                  <div className="dots-discover   "></div>
                  <div className="paragraph-six  "></div>
                </div>
                <div className="paragraph-dots  "></div>

              </div>
              <div className=" shimmerBG dicover-shimmer"></div>
            </div>
            <div className="discovering-card">
              <div className="discover-topbox">
                <div className="discover-page">
                  <div className="boxes  "></div>
                  <div className="discover-textograpy">
                    <div className="paragraph-three  "></div>
                    <div className="paragraph-four  "></div>
                  </div>
                </div>
                <div className="dicover-link">
                  <div className="button-links  ">
                    <div className="link-text  "></div>
                  </div>
                </div>
              </div>
              <div className="line-dicover"></div>
              <div className="discover-bottom">
                <div className="discover-pages">
                  <div className="paragraph-five  "></div>
                  <div className="dots-discover   "></div>
                  <div className="paragraph-six  "></div>
                </div>
                <div className="paragraph-dots  "></div>

              </div>
              <div className=" shimmerBG dicover-shimmer"></div>
            </div>

          </div>
        </div>
        <div className=" lottie-loader  ">
          <div className="discover-accouted">
            <div className="button-lottie  "></div>
            <div className="paragraph-button  "></div>
            <div className=" shimmerBG dicover-shimmer"></div>
          </div>
        </div>

      </div>
      
    </>
  )
}

