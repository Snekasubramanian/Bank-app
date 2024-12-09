import React, { useEffect } from 'react'
import {
  SUCCESS_SUBTITLE,
  SUCCESS_ACCOUNT_NAME,
  SUCCESS_MESSAGE_1,
  SUCCESS_MESSAGE_2,
  SUCCESS_TITLE
} from './constant'
import {
  UUID as UUIDAtom,
  discoveredData as discoveredDataAtom,
  FiDetails as FiDetailsAtom,
  XORDecryptRes as XorDecryptResAtom
} from '../services/recoil-states/atom'
import ButtonNew from '../component/button/ButtonNew'
import images from '../assets/images'
import { useRecoilState } from 'recoil'
import Encrypt from '../services/encrypt'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import { EventtrackerApi } from '../services/api/event'
import { useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import { BankState } from '../store/types/bankListType'

interface Props {
  imageUrl: string
}
function SuccessState ({ imageUrl }: Props): JSX.Element {
  const userName = 'Vivek'
  const bankName = 'Axis'
  let bankList: string[] = []
  let bankDict: any = {}
  let eventList: any = {}
  let SubmittedeventList: any = {}
  const [UUID] = useRecoilState(UUIDAtom)
  const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [, setDiscoverData] = useRecoilState(discoveredDataAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const { dynData } = useSelector<RootStateType,BankState>((state) => state.bank);
    // GetFipDiscoverAndLinkedAccounts API Call
    const GetFipDiscoverAndLinkedAccounts = async (fipId: any) => {
      const data = {
        I_MOBILENUMBER: XORDecryptRes.mobileNumber,
        I_BROWSER: 'chrome',
        I_Identifier: [{ I_Flag: 'MOBILE', DATA: XORDecryptRes.mobileNumber, type: 'STRONG' }],
        I_FITYPE: FiDetails.fIType,
        I_FIPID: FiDetails.fipid.join(),
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
        return Decrypt('Decrypt', data)
      } catch (error) {
        console.log('There was an error', error)
      }
    }

  useEffect(() => {
    preLoading();
  }, [])

  const preLoading = async () => {
    const fipIds = FiDetails.fipid;
    const requests = fipIds.map((fipId: any) => {
      return GetFipDiscoverAndLinkedAccounts(fipId);
    })
    const responses = await Promise.all(requests);
    let MergeArray: any = [];
    responses.forEach((item:any) => {
      if (item.AccountCount > 0) {
        item.fip_DiscoverLinkedlist.map((val: any) => {
          MergeArray.push(val);
        })
      } else {
        MergeArray.push({
          "Consent": false,
          "Linked": false,
          "Id": "Not_found",
          "FIPID": "Not_found",
          "AMCSHORTCODE": "Not_found",
          "FIPNAME": item.FIPName,
          "FITYPE": "Not_found",
          "ACCDISCOVERYDATE": "Not_found",
          "FIPACCTYPE": "Not_found",
          "FIPACCREFNUM": "Not_found",
          "FIPACCNUM": "Not_found",
          "FIPACCLINKREF": "Not_found",
          "LINKEDDATE": "Not_found",
          "Logo": "/images/banks/cub.png"
        })
      }
    })
    let Finalresult = MergeArray.reduce((unique:any, o:any) => {
      if (!unique.some((obj:any) => obj.FIPID === o.FIPID && obj.FIPACCNUM === o.FIPACCNUM)) {
        unique.push(o);
      }
      return unique;
  },[]);

    if (Finalresult.length > 0) {
      Finalresult.forEach((item: any, index: any) => {
        if (item.Linked) {
        if (!bankList.includes(item.FIPID)) {
          bankList.push(item.FIPID)
          bankDict[item.FIPID] = []
          bankDict[item.FIPID].push(item)
        } else {
          bankDict[item.FIPID].push(item)
        }
      }
      })
      for (const [key, value] of Object.entries(bankDict)) {
        SubmittedeventList[key] = Object(value).reduce((a:any, { FIPACCNUM }:any) => a.concat(FIPACCNUM.split(',')), []);
      }
      const event = {
        "eventList": [
        {
        "event_timestamp": new Date().getTime(),
        "consent_handle_id": XORDecryptRes.consentId,
        "event_type": "page",
        "page_name": "aa_final_status_screen",
        "bank_name": FiDetails.fipid,
        "source": "",
        "num_of_available_accounts": bankList.length,
        "meta": SubmittedeventList,
        "event_name": "aa_linking_page_view"
        }
        ]
       }
       EventtrackerApi(event);
    }
  }

  const continuebtn = () => {
    const event = {
      "eventList": [
      {
      "event_timestamp": new Date().getTime(),
      "consent_handle_id": XORDecryptRes.consentId,
      "event_type": "click",
      "page_name": "aa_final_status_screen",
      "bank_name": FiDetails.fipid.join(),
      "source": "",
      "num_of_available_accounts": bankList.length,
      "meta": SubmittedeventList,
      "event_name": "aa_linking_cta_clicked"
      }
      ]
     }
     EventtrackerApi(event);
  }
  
  return (
    <div className="bg-[#33A34D] text-[var(--Text_color)] font-semibold h-screen flex flex-col justify-between overflow-y-auto">
      <div className="relative object-bottom resize">
        <img src={imageUrl} alt="Outer Image" className="w-full" />
        <img src={images.bankLogo} alt="Inner Image" className="absolute inset-0 m-auto max-w-full h-[32%] bg-[#33A34D]" />
      </div>
      <div className=''>
        <header className="container">
          <h1 className="text-center mb-[23px] text-[28px] font-[500] leading-[20px]">{SUCCESS_TITLE} {userName}!</h1>
          <h4 className="text-center mb-[5px] text-[14px] font-[400] text-[var(--Background_color)]">{SUCCESS_SUBTITLE}</h4>
          <h2 className="text-center font-[500] text-[18px] text-[var(--Background_color)] leading-[24px] h-[24px] top-[524px]">{bankName}{SUCCESS_ACCOUNT_NAME}</h2>
          <div className='h-[65px]'></div>
          <div className="flex flex-col items-center mb-4 text-[14px] font-[400]  text-gray-200 leading-[20px] h-[40px]">
            <p>{SUCCESS_MESSAGE_1}</p>
            <p>{SUCCESS_MESSAGE_2}</p>
          </div>
          <div className='h-[65px]'></div>
        </header>
      </div>
      <div>
        <div className='px-4 pb-[40px]'>
          <ButtonNew name='Continue' onClick={() => { continuebtn() }}></ButtonNew>
        </div>
      </div>
    </div>

  )
}
export default SuccessState
