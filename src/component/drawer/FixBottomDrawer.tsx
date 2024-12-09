import React, { useEffect, useState } from 'react'

import { Box, Grid, Typography, CardMedia, Card } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import warning from '../../assets/images/warning.gif'
import Footer from '../footer/Footer'
import { useNavigate } from 'react-router-dom';
import {
    UUID as UUIDAtom,
    FiDetails as FiDetailsAtom,
    XORDecryptRes as XORDecryptResAtom,
    LinkedMobileNum as linkedMobileNumAtom,
    AlreadyLinkedMobileNum as alreadylinkedMobileNumAtom
} from '../../services/recoil-states/atom';
import { useRecoilState } from 'recoil';
import { EventtrackerApi } from '../../services/api/event';

import Encrypt from '../../services/encrypt'
import { UseApi } from '../../services/api/api'
import Decrypt from '../../services/decrypt'
import { BankState, CHOOSE_BANK_LIST, DISCOVER_REPONSE, FixFIPNAME, UPDATE_Loader } from '../../store/types/bankListType';
import { RootStateType } from '../../store/reducers';
import Button from '../button/Button';
import { useDispatch, useSelector } from 'react-redux';
import Modifydrawer from '../../pages/Modifydrawer';
import ChoosebankModal from '../../pages/ChoosebankModal';
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function FixBottomDrawer({
    list,
    confirm,
    setConfirm,
    type,
    sentvalue,
    bankNameList,
    fipid,
    pan,
    BankFlag
}: {
    list: any
    confirm: boolean;
    type: string;
    sentvalue: 0 | 1;
    setConfirm: any;
    bankNameList: any
    fipid: any
    BankFlag : any
    pan: any
}) {

    let buttonName = 'Retry'
    const [isClick, setIsClick] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedCard, setSelectedCard] = useState('Check1')
    const [selectedButton, setSelectedButton] = useState('Check1')
    const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
    const { discoverBankResponse, choosebanklist, dynData, ActiveFICategory, FICategory,BANK,INSURANCE_POLICIES } = useSelector<RootStateType, BankState>((state) => state.bank);
    const [UUID] = useRecoilState(UUIDAtom)
    const [LinkedMobileNum] = useRecoilState<any>(linkedMobileNumAtom)
    const [AlreadyLinkedMobileNum] = useRecoilState<any>(alreadylinkedMobileNumAtom)
    const [isOpenModify, setIsOpenModify] = useState(false);
    const [isOpenbank, setIsOpenbank] = useState(false);
    const [FiDetails] = useRecoilState<any>(FiDetailsAtom)



    
  const ModifycloseDrawer = () => {
    setIsOpenModify(false);
  }

  const ChoosecloseDrawer = () => {
    setIsOpenbank(false);
  }

    const notifyMePayload = {
        I_MOBILENUMBER: XORDecryptRes.mobileNumber,
        I_BROWSER: 'Chrome',
        I_SESSION: XORDecryptRes.sessionId,
        I_USERID: XORDecryptRes.mobileNumber,
        I_FIPNAME: 'finsharebank', // Ask
        UUID,
        I_FIUNAME: FiDetails.fiuName
    }
    const handleCardClick = (value: string) => {
        setSelectedCard(value);
    }
    useEffect(() => {
        if (!confirm) {
            setSelectedCard('');
        } else {
            setSelectedButton('Check1')
            setSelectedCard('Check1');
        }
    }, [confirm])
    const handleButtonClick = (value: string) => {
        setSelectedButton(value)
    }
    if (selectedButton === 'Check1') {
        buttonName = 'Try again'
    } else if (selectedButton === 'Check2') {
        buttonName = 'Modify number'
    } else if (ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') {
        buttonName = 'Modify PAN'
    } else if (ActiveFICategory === 'INSURANCE_POLICIES') {
        buttonName = 'Change insurer'
    } else {
        buttonName = 'Change bank'
    }
    const onClickNotifyButton = () => {
        // setisNotifyModal((prev: boolean) => !prev)
    }
    // on click notify button
    const getNotifyMe = async () => {
        const encryptedPayload = Encrypt(
            'Encrypt',
            JSON.stringify(notifyMePayload)
        )
        try {
            const apiData = UseApi('POST', 'NotifyMe', encryptedPayload)
            const data = await apiData
            const decryptedResponse = Decrypt('Decrypt', data)
        } catch (error) {
        }
    }

    const onClickBtn = async () => {
        dispatch({
            type: FixFIPNAME,
            body: bankNameList
        });
        setConfirm(false)
        if (selectedButton === 'Check1') {
            BankFlag(true);
            let fip: any = "";
            let Ficategories = FICategory.split(',');
            if (Ficategories.length == 1) {
                fip = choosebanklist.filter((val: any) => val.FIPNAME === bankNameList);
            }

            const data = {
                I_MOBILENUMBER: list[0].mobileNumber,
                I_BROWSER: 'chrome',
                I_Identifier: [
                    {
                        I_Flag: 'MOBILE',
                        DATA: list[0].mobileNumber,
                        type: 'STRONG'
                    },
                    {
                        I_Flag: 'PAN',
                        DATA: list[0].pan,
                        type: 'WEAK',
                    }],
                I_FITYPE: FiDetails.fIType,
                I_FIPID: Ficategories.length > 1 ? fipid : fip[0]?.FIPID,
                I_FIPNAME: '', // ASK
                I_SESSION: XORDecryptRes.sessionId,
                I_USERID: list[0].mobileNumber,
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
                if (decryptedResponse.AccountCount === 0) {
                    dispatch({
                        type: UPDATE_Loader,
                        body: { selectedAccount: list[0].FIPNAME }
                    });
                    setConfirm(false)
                } else {
                    let AlreadyhaveAccounts = discoverBankResponse.filter((val: any) => val.FIPNAME !== decryptedResponse.FIPName)
                    decryptedResponse?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push({ ...val, mobileNumber: XORDecryptRes!.mobileNumber, pan: XORDecryptRes!.pan }));
                    dispatch({
                        type: DISCOVER_REPONSE,
                        body: AlreadyhaveAccounts
                    })
                    setConfirm(false)
                }
                return decryptedResponse;
            } catch (error) {
            }
            // navigate('/lottieLoader')
        } else if (selectedButton === 'Check2') {
            if(FICategory.split(',').length > 1){
                setIsOpenModify(true);
                BankFlag(true);
            }else{
                navigate('/entermobilenumber')
            }
        }
        else if (selectedButton === 'Check3') {
            if (ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') {
                if(FICategory.split(',').length > 1){
                    setConfirm(false);
                    BankFlag(false);
                }else{
                    navigate("/PanRequired")
                }
            } else {
                if(FICategory.split(',').length > 1){
                    setIsOpenbank(true);
                }else{
                    FetchFip();
                }
            }
        }

    }
    const FetchFip = async () => {
        const bankListRequestBody = {
            I_MOBILENUMBER: XORDecryptRes.mobileNumber,
            I_MPIN: '111111',
            I_BROWSER: 'chrome',
            I_asset_class_id: ActiveFICategory == 'INSURANCE_POLICIES' ? 'INSURANCE' : 'BANK',
            I_SEARCHKEY: '',
            I_SESSION: XORDecryptRes.sessionId,
            I_ConsentHandle: dynData,
            I_SEARCHPAGENATION: 'All',
        };
        const encryptData = Encrypt('Encrypt', JSON.stringify(bankListRequestBody))
        try {
            const apiData = UseApi('POST', 'SearchFIP', encryptData)
            const data = await apiData
            const decryptedResponse: any = Decrypt('Decrypt', data)
            if (decryptedResponse?.RESULT_CODE == 200) {
                dispatch({
                    type: CHOOSE_BANK_LIST,
                    body: decryptedResponse.lst
                });
                navigate('/choose-bank', { state: { fixFlow: true } });
            }
        } catch (error) {
        }
    }

    return (
        <Box sx={{ top: '0' }}>
            <Dialog className='fixdrawer-modal'
                open={confirm}
                onClose={() => {
                    setConfirm(false)
                    dispatch({
                        type: UPDATE_Loader,
                        body: { selectedAccount: list[0].FIPNAME }
                    });
                }
                }
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
            >
                {/* <div className="fixed-drawer"> */}
                <Box className=" ">
                    <div className="box-grid">
                        <CardMedia
                            component="img"
                            src={warning}
                            alt="icon"

                        />
                        <h6
                        >Oh no! We were unable to find your {bankNameList} account</h6>
                        {/* <p >There were no accounts linked to +91 {list[0].mobileNumber} </p> */}
                        {XORDecryptRes.fiCategory === 'BANK' || ActiveFICategory === 'BANK' && <p>
                            There are no accounts linked to +91 {list[0].mobileNumber}
                        </p>}
                        {ActiveFICategory === 'GSTR' && <p>
                            There are no GST linked to {list[0].pan} and +91 {list[0].mobileNumber}
                        </p>}
                        {ActiveFICategory === 'MF' && <p>
                            There are no mutual fund linked to {list[0].pan} and +91 {list[0].mobileNumber}
                        </p>}
                        {ActiveFICategory === 'EQUITIES' && <p>
                            There are no investments linked to {list[0].pan} and +91 {list[0].mobileNumber}
                        </p>}
                        {ActiveFICategory === 'NPS' && <p>
                            Your NPS account is not linked to +91 {list[0].mobileNumber}
                        </p>}
                        {ActiveFICategory === 'INSURANCE_POLICIES' && <p>
                            There are no policy linked to +91 {list[0].mobileNumber}
                        </p>}
                    </div>
                    <div className="card-box">
                        <Card className={`${selectedCard === 'Check1' ? 'warning-fip' : ''}  ${selectedCard === 'Check1' ? 'border-colors' : 'warning-fip'
                            }`} onClick={() => {
                                if (confirm) {
                                    handleCardClick('Check1')
                                    handleButtonClick('Check1')
                                }
                                else {
                                    setSelectedCard('')
                                }
                            }}>
                            {(ActiveFICategory === 'BANK' || ActiveFICategory === 'NPS' || ActiveFICategory === 'EQUITIES' || ActiveFICategory === 'INSURANCE_POLICIES') &&
                                <div className="warning-gap">
                                    <h6> My mobile number is correct!</h6>
                                    {ActiveFICategory === 'BANK' && <p >Retry with the same bank accounts</p>}
                                    {(ActiveFICategory === 'EQUITIES' || ActiveFICategory === 'NPS') && <p >
                                        Retry with the same number
                                    </p>}
                                    {ActiveFICategory === 'INSURANCE_POLICIES' && <p >
                                        Retry with the same insurer
                                    </p>}
                                </div>}
                            {ActiveFICategory === 'GSTR' &&
                                <div className="warning-gap">
                                    <h6>  GST is linked with same information</h6>
                                    <p> Retry with the same mobile/PAN</p>
                                </div>}
                            {ActiveFICategory === 'MF' &&
                                <div className="warning-gap">
                                    <h6> MF is linked with same information</h6>
                                    <p> Retry with the same mobile/PAN</p>
                                </div>}
                            <input
                                type="checkbox"
                                checked={selectedCard === 'Check1'}
                                onChange={() => {
                                    setSelectedCard('Check1')
                                }}
                                className="check-account"
                                value="Check1"
                            />
                        </Card>
                        <Card className={`${selectedCard === 'Check2' ? 'warning-fip' : ''}  ${selectedCard === 'Check2' ? ' border-colors' : 'warning-fip '
                            }`} onClick={() => {
                                if (confirm) {
                                    handleCardClick('Check2')
                                    handleButtonClick('Check2')
                                }
                                else {
                                    setSelectedCard('')
                                }
                            }}>
                            {(ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES' || ActiveFICategory === 'NPS' || ActiveFICategory === 'INSURANCE_POLICIES' || ActiveFICategory === 'BANK') && <div className="warning-gap">
                                <h6  >Try with another number</h6>
                                <p>Quickly change your number and discover</p>
                            </div>}
                            <input
                                type="checkbox"
                                checked={selectedCard === 'Check2'}
                                onChange={() => {
                                    setSelectedCard('Check2')
                                }}
                                className="check-account"
                                value="Check2"
                            />
                        </Card>
                        {ActiveFICategory != 'NPS' && (<Card className={`${selectedCard === 'Check3' ? 'warning-fip' : ''}  ${selectedCard === 'Check3' ? 'border-colors  ' : 'warning-fip'
                            }`} onClick={() => {
                                handleCardClick('Check3')
                                handleButtonClick('Check3')
                            }}>
                            {ActiveFICategory === 'BANK' && <div className="warning-gap">
                                <h6  > It is a joint account?</h6>
                                <p className='joint-account'>Joint accounts are not supported yet. Choose another bank you have an account.</p>
                            </div>}
                            {(ActiveFICategory === 'GSTR' || ActiveFICategory === 'MF' || ActiveFICategory === 'EQUITIES') && <div className="warning-gap">
                                <h6  >Try with another PAN</h6>
                                <p >Change your PAN and discover</p>
                            </div>}
                            {(ActiveFICategory === 'INSURANCE_POLICIES') && <div className="warning-gap">
                                <h6  >Try with another insurer</h6>
                                <p >Change policy insurer and discover</p>
                            </div>}
                            <input
                                type="checkbox"
                                checked={selectedCard === 'Check3'}
                                onChange={() => {
                                    setSelectedCard('Check3')
                                }}
                                className="check-account"
                                value="Check3"
                            />
                        </Card>)}
                    </div>
                </Box>
                {/* </div> */}
                <div className={`bottom_card ${selectedCard === '' ? 'bgColor' : 'modal-btn'}`}>
                    <Button onClick={onClickBtn} name={buttonName}></Button>
                    {/* <Footer></Footer> */}
                </div>
            </Dialog >
            <Modifydrawer
                isOpen={isOpenModify}
                setIsOpen={setIsOpenModify}
                handleClose={() => { ModifycloseDrawer() }} Name={selectedButton == 'Check2' ? 'MobileNumber' : 'PAN'} list={list}
            ></Modifydrawer>

            {isOpenbank && <ChoosebankModal isOpenbank={isOpenbank}
                list={list}
                setIsOpenbank={setIsOpenbank}
                closeModal={() => { ChoosecloseDrawer() }}/>}
        </Box >

    )

}