import React, { useEffect, useState } from 'react'
import OtpInputComponent from '../component/otp-input/OtpInput'
import Footer from '../component/footer/Footer'
import Heading from '../component/heading/Heading'
import { useInterval } from 'usehooks-ts'
import BackButton from '../component/back-button/BackButton'
import { useRecoilState } from 'recoil'
import {
    UUID as UUIDAtom,
    FIPDetailsList as FIPDetailsListAtom,
    refNumber as refNumberAtom,
    FiDetails as FiDetailsAtom,
    CurrentFip as CurrentFipAtom,
    AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom,
    discoveredData as discoveredDataAtom,
    XORDecryptRes as XORDecryptResAtom
} from '../services/recoil-states/atom'
import { useNavigate } from 'react-router'
import { UseApi } from '../services/api/api'
import Encrypt from '../services/encrypt'
import Decrypt from '../services/decrypt'
import DenyTracking from '../modal/DenyTracking'
import { EventtrackerApi } from '../services/api/event'
import Button from '../component/button/Button'
import Modal from 'react-modal'
import { BankState, CLICK_OTP_VALUE, DISCOVER_REPONSE, ERROR_VALUE, GSTFlag, LINKEDMOBILENUMBERS, MultiFicloser, UPDATE_DISCOVER_REPONSE, UPDATE_Loader } from '../store/types/bankListType'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import { TransitionProps } from '@mui/material/transitions';
import { Dialog, Slide } from '@mui/material'
interface modalProps {
    handleClose?: React.MouseEventHandler
    OnExit?: React.MouseEventHandler
    isOpen: boolean
    setIsOpen: any
    Name: any
    list: any
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Modifydrawer({
    handleClose,
    isOpen,
    setIsOpen,
    Name,
    list
}: // OnExit
    modalProps): any {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const [otpValid, setOtpValid] = useState<any>(undefined)
    const navigate = useNavigate()
    const [timer, setTimer] = useState(0)
    const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
    const [discoverData, setDiscoverData] = useRecoilState<any>(discoveredDataAtom)
    const [otpSendNotificationClass, setOtpSendNotificationClass] = useState('hidden opacity-0')
    const [UUID] = useRecoilState(UUIDAtom)
    const [currentfip] = useRecoilState(CurrentFipAtom)
    const [, setFIPDetailsList] = useRecoilState<any>(FIPDetailsListAtom)
    const [AlreadyLinkedMobileNum, setAlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
    const [refNumber, setRefNumber] = useRecoilState(refNumberAtom)
    const [bank, setBank] = useState('')
    const [isModalTrack, setIsModalTrack] = useState(false)
    const [FiDetails] = useRecoilState<any>(FiDetailsAtom)
    const fipIds = FiDetails.fipid;
    const [message, setMessage] = useState("")
    const [click, setClick] = useState(0)
    const [isDisable, setIsDisable] = useState<any>(false)
    const [errorClick, setErrorClick] = useState(0)
    const [verifyLoader, setVerifyLoader] = useState(false)
    const { discoverBankResponse, dynData, clickCount, errorCount, ActiveFICategory, choosebanklist } = useSelector<RootStateType, BankState>((state) => state.bank);

    const [enableotp, setEnableotp] = useState(false);
    const [mobileNumber, setmobileNumber] = useState("");
    const [LinkMobilenumber, setLinkMobilenumber] = useState<any>([]);
    // AuthenticateToken API Call
    const authenticateToken = async (data: any) => {
    }


    const Verifymobile = () => {
        const result: any = LinkMobilenumber?.filter((val: any, index: number) => val?.MobileNumber === mobileNumber);
        setAlreadyLinkedMobileNum(result && result[0]?.MobileNumber);
        setXORDecryptRes((prev: any) => ({ ...prev, SecondarymobileNumber: mobileNumber }));
        if (result.length > 0) {
            let bankList: any = []
            if (ActiveFICategory === 'GSTR') {
                dispatch({
                    type: GSTFlag,
                    body: "Addmobile"
                })
                discoverBankResponse.forEach((item: any, index: any) => {
                    if (item.FITYPE.includes('GST')) {
                        if (!bankList.includes(item.FIPNAME)) {
                            bankList.push(item.FIPNAME)
                        }
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
                        "FITYPE": "GSTR",
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
                    type: DISCOVER_REPONSE,
                    body: discoverBankResponse
                })
                dispatch({
                    type: MultiFicloser,
                    body: "modifyCloser"
                });
            } else {
                dispatch({
                    type: MultiFicloser,
                    body: "modifyCloser"
                });
            }
            setIsOpen(false);
        } else {
            Resendotp();
            setTimer(15);
            setEnableotp(true);
        }

    }

    const getFip = (event: any) => {
        let FetchedFIP = choosebanklist.filter((fip: any) => fip.FIPNAME === event);
        return FetchedFIP.length > 0 ? FetchedFIP[0].FIPID : 'Not_found';
    }


    const Resendotp = async () => {
        // Resend Using Generate OTP API When new mobile number is registered
        let data = {
            I_SECONDARY_MOBILE_NUMBER: mobileNumber,
            I_MOBILENUMBER: XORDecryptRes.mobileNumber,
            I_BROWSER: 'chrome',
            I_SESSION: XORDecryptRes.sessionId,
            I_USERID: XORDecryptRes.mobileNumber,
            UUID,
            I_ConsentHandle: dynData
        }

        const encryptData = Encrypt('Encrypt', JSON.stringify(data))
        try {
            const apiData = UseApi('POST', 'GENERATEOTP', encryptData)
            const reponse = await apiData
            const decryptedResponse = Decrypt('Decrypt', reponse)
        } catch (error) {
        }
    }


    const getMobileNumber = async (data: any) => {
        const encryptData = Encrypt('Encrypt', JSON.stringify(data));
        try {
            const apiData = UseApi('POST', 'GETMOBILENUMBERS', encryptData)
            const data = await apiData;
            const decryptedResponse: any = Decrypt('Decrypt', data);
            setLinkMobilenumber(decryptedResponse.lst);
            dispatch({
                type: LINKEDMOBILENUMBERS,
                body: decryptedResponse.lst
            })
        }
        catch (error) {
        }
    }


    useEffect(() => {
        setmobileNumber("");
        setEnableotp(false);
        if (isOpen) {
            getMobileNumber({
                I_MOBILENUMBER: XORDecryptRes.mobileNumber,
                I_BROWSER: "chrome",
                I_SESSION: XORDecryptRes.sessionId,
                I_USERID: XORDecryptRes.mobileNumber,
                I_ConsentHandle: dynData,
                UUID
            })
        }
    }, [isOpen])

    useEffect(() => {
        // On Entering 6 digit OTP, authenticate Token API is triggered
        if (otp.length === 6) {
            addNewMobile({ I_BROWSER: 'chrome', I_MOBILENUMBER: XORDecryptRes.mobileNumber, I_SECONDARY_MOBILE_NUMBER: mobileNumber, I_MOBOTP: otp, I_Flag: 'M', I_SESSION: XORDecryptRes.sessionId, I_USERID: XORDecryptRes.mobileNumber, UUID, I_ConsentHandle: dynData })
        }
    }, [otp])

    const addNewMobile = async (data: any) => {
        const encryptData = Encrypt('Encrypt', JSON.stringify(data))
        try {
            const apiData = UseApi('POST', 'ADDNEWMOBILE', encryptData)
            const data = await apiData
            const decryptedResponse: any = Decrypt('Decrypt', data)
            setXORDecryptRes((prev: any) => ({ ...prev, mobileNumber: mobileNumber }))
            if (decryptedResponse.RESULT_CODE === '200') {
                let bankList: any = []
                if (ActiveFICategory === 'GSTR') {
                    discoverBankResponse.forEach((item: any, index: any) => {
                        if (item.FITYPE.includes('GSTR')) {
                            if (!bankList.includes(item.FIPNAME)) {
                                bankList.push(item.FIPNAME)
                            }
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
                            "FITYPE": "GSTR",
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
                    dispatch({
                        type: MultiFicloser,
                        body: "modifyCloser"
                    });
                } else {
                    dispatch({
                        type: MultiFicloser,
                        body: "modifyCloser"
                    });
                }
                setOtpValid(true);
                setIsOpen(false);
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


    const countdownTimer = (timer: number, delay: number) => {
        return timer - delay
    }
    useInterval(
        () => {
            setTimer(countdownTimer(timer, 1))
        },
        timer !== 0 ? 1000 : null
    )
    const falseID = () => {
        if (otp.length === 6) {
            return false;
        } else {
            return true;
        }
    }

    const disablebtn = () => {
        if (mobileNumber.length > 9) {
            return false;
        } else {
            return true;
        }
    }


    return (
        <Dialog
            open={isOpen}
            onClose={() => {
                setIsOpen(false)
                dispatch({
                    type: UPDATE_Loader,
                    body: { selectedAccount: list[0].FIPNAME }
                });
            }}
            TransitionComponent={Transition}
            sx={{
                top: 'auto',

                '& .MuiPaper-root': {
                    // margin: 0,
                    width: '100%',
                    maxWidth: '100%',
                    margin: 'auto !important',
                    borderRadius: '20px 20px 0 0',
                },
            }}
            className='verifyBankScreen'
        >
            {!enableotp && <div className="verify-modal">
                <h6> Modify mobile number</h6>
                <div className="modify-otpmodal">
                    <p className="otp-text">Enter mobile number which registered with selected {list[0].FIPNAME}</p>
                    <input type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                            if (
                                !isNaN(Number(e.target.value)) &&
                                !(e.target.value.length > 10)
                            ) {
                                setmobileNumber(e.target.value)
                            }
                        }}
                        placeholder='Enter mobile number' />

                </div>
                <div className='otpSubmitButton'>
                    <Button name={'Verify number'} disabled={disablebtn()} otpValue={otp} onClick={Verifymobile} />
                </div>
            </div>}
            {/*Enter the mobile number end*/}

            {enableotp && <div className="verify-modal">
                <h6> Modify mobile number</h6>
                <div className="verify-account">
                    <p className="otp-text">
                        You will receive a 6-digit code on your phone number{' '}
                        <span className="otp-mobileNumber">+91 {mobileNumber}</span> from {list[0].FIPNAME}
                    </p>
                    <div className="otp-inputField">
                        <OtpInputComponent otp={otp} setOtp={setOtp} otpValid={otpValid} disable={isDisable} verifyLoader={verifyLoader} />
                        {otpValid === true || otpValid === undefined || otpValid === null
                            ? <p className="text-center text-[#DF3C27] success-opt">message</p>
                            : <p className="text-center text-[#DF3C27] success-msg">{message}</p>
                        }
                        <div className='ResendOtpText'>
                            <span style={{ marginRight: '3px' }}>Didn’t receive it?</span>
                            {timer === 0
                                ? (
                                    <button
                                        className="ResendOTP_txt"

                                        onClick={() => {
                                            // Resend OTP Function for Bank OTP Page will come here
                                            Resendotp()
                                            setTimer(15)
                                            setClick(click + 1)
                                            setOtpSendNotificationClass('transition-all duration-1000 ease-in block opacity-1')
                                            setTimeout(() => {
                                                setOtpSendNotificationClass('transition-all duration-1000 ease-in opacity-0  translate-y-[-200px]')
                                            }, 1000)
                                            setTimeout(() => {
                                                setOtpSendNotificationClass('hidden')
                                            }, 1500)
                                        }}
                                        disabled={clickCount > 2 || message == "Account Locked , Try again after 30 minutes" || errorCount >= 5}
                                    >
                                        {' '}
                                        Resend
                                    </button>
                                )
                                : (
                                    <span>Resend in <span className='Timer'>{timer}</span></span>
                                )}
                        </div>
                    </div>
                </div>
                <div className='otpSubmitButton'>
                    <Button name={'Confirm'} disabled={falseID()} otpValue={otp} onClick={authenticateToken} />
                </div>
                {/*  */}
            </div>}

        </Dialog>

    )
}