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


export default function PanNumberInput (): ReturnType<React.FC> {
    const navigate = useNavigate()
  const [mobileNumber, setMobileNumber] = useState('')
  const [panNumber, setpanNumber] = useState<any>('')
  const [newData,setNewData] = useState<any>();
  const [error, setError] = useState(false)
  const [isModalTrack, setIsModalTrack] = useState(false)
  const [UUID] = useRecoilState(UUIDAtom)
  // const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
  const [LinkedMobileNum,setLinkedMobileNum] = useRecoilState<any>(linkedMobileNumAtom)
  const [AlreadyLinkedMobileNum,setAlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
  const dispatch = useDispatch();
  const { ActiveFICategory, discoverBankResponse,FICategory } = useSelector<RootStateType,BankState>((state) => state.bank);
  const checkValue : boolean  = false;
  // const resgisterNums : any = [];
  const [resgisterNums , setResgisterNum] = useState();
  const newLink = localStorage.getItem("linkedNumber")

  
  const onClickDenyTrack = () => {
    setIsModalTrack((prev: boolean) => !prev)
  }

 

//   const getMobileNumber = async ( data : any) => {
//     const encryptData = Encrypt('Encrypt', JSON.stringify(data));
//     try{
//       const apiData = UseApi('POST', 'GETMOBILENUMBERS',encryptData)
//       const data = await apiData;
//       const decryptedResponse : any = Decrypt('Decrypt',data)
//       dispatch({
//         type: LINKEDMOBILENUMBERS,
//         body: decryptedResponse.lst
//       })
      
//       // if(decryptedResponse)
//       //   {
//       //   setLinkedMobileNum(decryptedResponse.lst);
//       // }
//     }
//     catch(error){
//     }
//   }
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
//   useEffect(() => {
//     const event = {
//       "eventList": [
//       {
//         "event_timestamp": new Date().getTime(),
//         "consent_handle_id": XORDecryptRes.consentId,
//       "event_type": "page",
//       "page_name": "aa_edit_mobile_number",
//       "bank_name": FiDetails.fipid,
//       "source": "",
//       "event_name": "aa_linking_page_view"
//       }
//       ]
//      }
//      EventtrackerApi(event);
      
//      getMobileNumber({
//       I_MOBILENUMBER: XORDecryptRes.mobileNumber,
//       I_BROWSER: "chrome",
//       I_SESSION: XORDecryptRes.sessionId,
//       I_USERID: XORDecryptRes.mobileNumber,
//       I_ConsentHandle: dynData,
//       UUID
//      })
     
     
//   },[])
  // useEffect(() => {
  //   if(LinkMobileNumber){
  //     setResgisterNum(LinkMobileNumber && LinkMobileNumber[0]?.MobileNumber)
  //   }
  // },[LinkMobileNumber, mobileNumber])

  const handleClick = () => {
    // const newState : any = true;
    // const result : any = LinkMobileNumber?.filter((val : any, index: number) => val?.MobileNumber === mobileNumber );
    // setAlreadyLinkedMobileNum(result && result[0]?.MobileNumber)
      // if(panNumber.length === 10 && XORDecryptRes.fiCategory === 'GSTR'){
      //   if(panNumber[3] === 'c' || panNumber[3] === 'C'){
      //     navigate("/lottieLoader", { state: { panNumber: panNumber } });
      //   }else{
      //     setError(true)
      //   }
      // }else{
        setXORDecryptRes((prev: any) => ({ ...prev, pan: panNumber }))
        if (ActiveFICategory === 'GSTR') {
          const updatedAccounts = discoverBankResponse.map((acc: any) => {
            if (acc.FITYPE.includes('GST')) {
              return { ...acc, PartialLoader: true};
            }else{
              return acc;
            }
            
          });
          dispatch({
            type: DISCOVER_REPONSE,
            body: updatedAccounts
          })
          dispatch({
            type: GSTFlag,
            body: "ModifyPan"
        })
        if(discoverBankResponse.length == 0){
          if(FICategory.split(',').length > 1 && XORDecryptRes.fipid == ''){
            navigate('/MultiFiUserAccount');
          }else{
            navigate("/lottieLoader")
          }
        }else{
          navigate("/userAccount")
        }
        }else{
          if(discoverBankResponse.length == 0){
            if(FICategory.split(',').length > 1 && XORDecryptRes.fipid == ''){
              navigate('/MultiFiUserAccount');
            }else{
              navigate("/lottieLoader")
            }
          }else{
            navigate("/userAccount")
          }
        }
        
      
  // }
    // return result;
  }

  const handlePanChange = (e: any) =>{
    const value = e.target.value;
    const panLength = value.length;
    if((panLength<=5 && /^[a-zA-Z]+$/.test(value)) || value===""){
      setpanNumber(value);
    }else{
      if((panLength>5 && panLength<=9 && /^\d+$/.test(value.slice(5,9)))){
        setpanNumber(value)
      }else{
        if(panLength===10 && /^[a-zA-Z]+$/.test(value[9])){
          setpanNumber(value)
        }
      };
    }
  }
   
    // JSON.stringify(result);
  
  return (
    <div className="h-screen bg-[var(--Background_color)]">
      <div className="container-fluid flex flex-col h-full">
          <Heading  
                       checked= {checkValue}
                       Backbtn={true}
                       closebtn={false}
          />
          <div className="mobile_page"> {/* my-[24px] pb-[120%] */}
            {/* {XORDecryptRes.fiCategory === 'GSTR' ?
            <label
            htmlFor="mobileNumber"
            className="Modify_no"
          >
            Enter company's PAN
           </label> :  */}
              <label
              htmlFor="mobileNumber"
              className="Modify_no"
            >
              Enter your PAN
            </label>
            {/* } */}
            <div className="flex flex-row items-center">
              {/* <input
                disabled
                value="+91"
                size={3}
                className="inline text-[20px] bg-transparent  border-none"
              ></input>
              - */}
              <input
                type="text"
                id="panNumber"
                value={panNumber}
                pattern='[A-Za-z]{5}[0-9]{4}[A-Za-z]'
                autoFocus
                placeholder="Enter PAN"
                onChange={handlePanChange}
                className="input_mobile pan-text"
              ></input>
              {/* {
                mobileNumber.length > 0
                  ? <div onClick={() => { setMobileNumber('') }}>
                <img src={image.closeButton}></img>
              </div>
                  : <></>
              } */}
            </div>
            {/* {error
              ? (
                <div className="text-[#DF3C27] text-[11px] flex flex-row mt-[9px]">
                  <div>
                    Please enter company's PAN
                  </div>
                </div>
                )
              : (
                <></>
                )} */}
          </div>
      
        <div className='bottom-card footer-btm'>
        {/* After Entering the modified number and pressing Proceed CTA		 */}
          <Button
            name={'Discover account'}
            disabled={panNumber.length < 10 ? true : false}
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