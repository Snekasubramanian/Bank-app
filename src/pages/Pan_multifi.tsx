import React, { useEffect, useState } from 'react'
import Button from '../component/button/Button'
import { useNavigate } from 'react-router-dom'
import {
  UUID as UUIDAtom,
  XORDecryptRes as XorDecryptResAtom,
  FiDetails as FiDetailsAtom,
  LinkedMobileNum as linkedMobileNumAtom,
  AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { BankState, DISCOVER_REPONSE, GSTFlag, MultiFicloser } from '../store/types/bankListType'
import {useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'


export default function PanMultifi ({
  BankFlag
}: {
  BankFlag : any
}): ReturnType<React.FC> {
    const navigate = useNavigate()
    const dispatch = useDispatch();
  const [panNumber, setpanNumber] = useState<any>('')
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const { ActiveFICategory, discoverBankResponse } = useSelector<RootStateType,BankState>((state) => state.bank);

  const handleClick = () => {
      if(ActiveFICategory == 'GSTR'){
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
      }
        setXORDecryptRes((prev: any) => ({ ...prev, pan: panNumber }))
        BankFlag(true);
        dispatch({
          type: GSTFlag,
          body: "ModifyPan"
      })
        dispatch({
          type: MultiFicloser,
          body: "modifyCloser"
      });
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
   
  
  return (
    <div className="multifi_pan"> 
          <div className="mobile_page">
              <label
              htmlFor="mobileNumber"
              className="Modify_no"
            >
              Enter your PAN
            </label>
            <div className="flex flex-row items-center">
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
            </div>
          </div>
          <Button  
            name={'Discover account'}
            disabled={panNumber.length < 10 ? true : false}
            onClick={() => {
             handleClick() 
            }}
          /> 
      </div> 
  )
}