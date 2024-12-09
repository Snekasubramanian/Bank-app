import React, { useEffect, useState } from 'react'
import Footer from '../component/footer/Footer'
import Heading from '../component/heading/Heading'
import BackButton from '../component/back-button/BackButton'
import Button from '../component/button/Button'
import { useNavigate } from 'react-router-dom'
import image from '../assets/images/index'
import DenyTracking from '../modal/DenyTracking'
import { EventtrackerApi } from '../services/api/event'
import {
  UUID as UUIDAtom,
  XORDecryptRes as XorDecryptResAtom,
  FiDetails as FiDetailsAtom,
  LinkedMobileNum as linkedMobileNumAtom,
  AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import Encrypt from '../services/encrypt'
import { UseApi } from '../services/api/api'
import Decrypt from '../services/decrypt'
import { BankState, DISCOVER_REPONSE, GSTFlag, LINKEDMOBILENUMBERS } from '../store/types/bankListType'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'

export default function MobileNumberInput(): ReturnType<React.FC> {
  const [mobileNumber, setMobileNumber] = useState('')
  const [newData, setNewData] = useState<any>();
  const [error, setError] = useState(false)
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [UUID] = useRecoilState(UUIDAtom)
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [LinkedMobileNum, setLinkedMobileNum] = useRecoilState<any>(linkedMobileNumAtom)
  const [AlreadyLinkedMobileNum, setAlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
  const dispatch = useDispatch();
  const { LinkMobileNumber, dynData, discoverBankResponse, ActiveFICategory, choosebanklist } = useSelector<RootStateType, BankState>((state) => state.bank);
  const checkValue: boolean = false;
  // const resgisterNums : any = [];
  const [resgisterNums, setResgisterNum] = useState();
  const newLink = localStorage.getItem("linkedNumber")




  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }
  const navigate = useNavigate()


  const getMobileNumber = async (data: any) => {
    const encryptData = Encrypt('Encrypt', JSON.stringify(data));
    try {
      const apiData = UseApi('POST', 'GETMOBILENUMBERS', encryptData)
      const data = await apiData;
      const decryptedResponse: any = Decrypt('Decrypt', data)
      dispatch({
        type: LINKEDMOBILENUMBERS,
        body: decryptedResponse.lst
      })

      // if(decryptedResponse)
      //   {
      //   setLinkedMobileNum(decryptedResponse.lst);
      // }
    }
    catch (error) {
    }
  }
  const Eventtracker = () => {
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "click",
          "page_name": "aa_edit_mobile_number",
          "bank_name": FiDetails.fipid,
          "source": "",
          "cta_text": "Continue",
          "event_name": "aa_linking_cta_clicked"
        }
      ]
    }
    EventtrackerApi(event);
  }
  useEffect(() => {
    const event = {
      "eventList": [
        {
          "event_timestamp": new Date().getTime(),
          "consent_handle_id": XORDecryptRes.consentId,
          "event_type": "page",
          "page_name": "aa_edit_mobile_number",
          "bank_name": FiDetails.fipid,
          "source": "",
          "event_name": "aa_linking_page_view"
        }
      ]
    }
    EventtrackerApi(event);

    getMobileNumber({
      I_MOBILENUMBER: XORDecryptRes.mobileNumber,
      I_BROWSER: "chrome",
      I_SESSION: XORDecryptRes.sessionId,
      I_USERID: XORDecryptRes.mobileNumber,
      I_ConsentHandle: dynData,
      UUID
    })


  }, [])
  // useEffect(() => {
  //   if(LinkMobileNumber){
  //     setResgisterNum(LinkMobileNumber && LinkMobileNumber[0]?.MobileNumber)
  //   }
  // },[LinkMobileNumber, mobileNumber])
  const getFip = (event: any) => {
    let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
    return FetchedFIP.length > 0 ? FetchedFIP[0].FIPID : 'Not_found';
  }

  const handleClick = () => {
    let bankList: any = [];
    // const newState : any = true;
    const result: any = LinkMobileNumber?.filter((val: any, index: number) => val?.MobileNumber === mobileNumber);
    setAlreadyLinkedMobileNum(result && result[0]?.MobileNumber);
    setXORDecryptRes((prev: any) => ({ ...prev, SecondarymobileNumber: mobileNumber }));
    if (result.length > 0) {
      if (discoverBankResponse.length == 0) {
        navigate("/lottieLoader")
      } else {
        if (ActiveFICategory === 'GSTR') {
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
        navigate("/userAccount",{ state: { mobileNumber: mobileNumber } });
      }
    } else {
      navigate(`/mobileotpverification/?mobilenumber=${mobileNumber}&newuser=true`,
        { state: { newState: true } }
      );
    }
    // return result;
  }

  // JSON.stringify(result);

  return (
    <div className="h-screen bg-[var(--Background_color)]">
      <div className="container-fluid flex flex-col h-full">
        <Heading
          checked={checkValue}
          Backbtn={true}
          closebtn={false}
        />
        <div className="mobile_page"> {/* my-[24px] pb-[120%] */}
          <label
            htmlFor="mobileNumber"
            className="Modify_no"
          >
            Modify mobile number
          </label>
          <div className="flex flex-row items-center">
            {/* <input
                disabled
                value="+91"
                size={3}
                className="inline text-[20px] bg-transparent  border-none"
              ></input>
              - */}
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              autoFocus
              placeholder="Enter mobile number"
              onChange={(e) => {
                if (
                  !isNaN(Number(e.target.value)) &&
                  !(e.target.value.length > 10)
                ) {
                  setMobileNumber(e.target.value)
                }
              }}
              className="input_mobile"
            ></input>
            {/* {
                mobileNumber.length > 0
                  ? <div onClick={() => { setMobileNumber('') }}>
                <img src={image.closeButton}></img>
              </div>
                  : <></>
              } */}
          </div>
          {error
            ? (
              <div className="text-[#DF3C27] text-[11px] flex flex-row mt-[9px]">
                <img
                  src={image.errorsvg}
                  alt="errorLogo"
                  className="max-w-[100%] max-h-[100%] mr-[5px]"
                ></img>
                <div>
                  Please enter a valid 10-digit mobile number
                </div>
              </div>
            )
            : (
              <></>
            )}
        </div>

        <div className='bottom-card '>
          {/* After Entering the modified number and pressing Proceed CTA		 */}
          <Button
            name={'Verify number'}
            disabled={mobileNumber.length < 10 ? true : false}
            onClick={() => {
              handleClick()

            }}
          />
          <Footer />
        </div>
      </div>
      <DenyTracking isOpen={isModalTrack}
        OnExit={onClickDenyTrack}
        handleClose={onClickDenyTrack}></DenyTracking>
    </div>
  )
}

// navigate(`/mobileotpverification/?mobilenumber=${mobileNumber}&newuser=true`);