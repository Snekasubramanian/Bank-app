import React, { useEffect, useState } from 'react'
import images from '../assets/images'
import { useNavigate } from 'react-router'
import {
    UUID as UUIDAtom,
    FIPDetailsList as FIPDetailsListAtom,
    redirectUrl as redirectUrlAtom,
    XORDecryptRes as XORDecryptResAtom,
    FiDetails as FiDetailsAtom
} from '../services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import Heading from '../component/heading/Heading'
import { useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import { BankState } from '../store/types/bankListType'
import { closeAndRedirect } from '../services/AaRedirection'

export default function RemindLater(): JSX.Element {
    const navigate = useNavigate()
    const checkValue: boolean = false;
    const [UUID] = useRecoilState(UUIDAtom)
    const [verifyLoader, setVerifyLoader] = useState(false);
    const { discoverBankResponse, consentData } = useSelector<RootStateType, BankState>((state) => state.bank);
    const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
    const [FIPDetailsList] = useRecoilState(FIPDetailsListAtom)
    const [redirectUrl] = useRecoilState(redirectUrlAtom)
    const [FiDetails] = useRecoilState<any>(FiDetailsAtom)

    // To generate Error Code based on MESSAGE
    const getErrorCode = (message: string) => {
        if (/Consent is rejected/i.test(message)) {
            return 2
        } else if (/Consent not available/i.test(message)) {
            return 2
        } else {
            return 2
        }
    }
    const close = () => {
        setVerifyLoader(true);
        closeAndRedirect({
            parentStatusMessage: 'REJECTED',
            delay: true,
            decrypt:XORDecryptRes,
            url: redirectUrl,
          });
    }

    return (
        <>
        <Heading
            checked={checkValue}
            Backbtn={false}
            closebtn={false}
        />
        <div className="some-wrong">
            <img src={images.Remind} alt="" className='remaind-img' />
            <div className="something-title">
                <h5>Thanks for your interest!</h5>
                <p>Will notify you shortly.</p>
            </div>
        </div>
        <div className="retry-button">
        {verifyLoader ? <button
          className='bottom-button'
        >    <img src={images.music} />
        </button> :
           <button onClick={()=> close()}>Close</button>}
        </div>
    </>
    )
}
