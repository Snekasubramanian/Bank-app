/* eslint-disable no-unused-vars */
// import { Box, Tab, Card, } from '@mui/material';
import { useNavigate } from 'react-router';
import React, { useState, useEffect, useRef, } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography ,Box} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Heading from '../component/heading/Heading';
import Button from '../component/button/Button';
import Footer from '../component/footer/Footer';
import images from '../assets/images';
import { RootStateType } from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Active_FI_CATEGORY, BankState } from '../store/types/bankListType';
import ConsentBottomSheet from '../modal/consentBottomSheet'
import { useRecoilState } from 'recoil';
import { EventtrackerApi } from '../services/api/event';
import ReactSwipeButton from 'react-swipe-button'
import {
    UUID as UUIDAtom,
    discoveredData as discoveredDataAtom,
    FiDetails as FiDetailsAtom,
    XORDecryptRes as XorDecryptResAtom
} from '../services/recoil-states/atom'
import Encrypt from '../services/encrypt';
import Decrypt from '../services/decrypt';
import { UseApi } from '../services/api/api';
import MultiConsentBottomSheet from '../modal/MulticonsentBottom';

const Summary = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false)
    const [lender, setLender] = useState(false);
    let bankList: any = []
    let bankDict: any = {}
    const [expanded, setExpanded] = React.useState<string | false>('');
    const [index, setIndex] = useState<any>();

    const [bankListState, setBankListState] = useState<any>([]);
    const [Banklist, setBanklist] = useState<any[]>([]);
    const [MFlist, setMFlist] = useState<any[]>([]);
    const [NPSlist, setNPSlist] = useState<any[]>([]);
    const [Equity, setEquity] = useState<any[]>([]);
    const [GST, setGST] = useState<any>([]);
    const [checked, setChecked] = useState(true)
    const [Insurance, setInsurance] = useState<any>([]);
    const [dicOfBank, setDicOfBank] = useState<any>([]);
    const { discoverBankResponse, consentData, consentDetails, FICategory, consentFIP } = useSelector<RootStateType, BankState>((state) => state.bank);
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    const groupedItems = (resp: any) => {
        return resp.reduce((ob: any, item: any) => ({ ...ob, [item.FIPID]: [...ob[item.FIPID] ?? [], item] }), {})
    }

    const groupedGST = (resp: any) => {
        return resp.reduce((ob: any, item: any) => ({ ...ob, [item.mobileNumber]: [...ob[item.mobileNumber] ?? [], item] }), {});
    }

    const [initialMouse, setInitialMouse] = useState(0);
    const [slideMovementTotal, setSlideMovementTotal] = useState(0);
    const [mouseIsDown, setMouseIsDown] = useState(false);
    const sliderRef = useRef(null);
    const buttonRef = useRef(null);

    const handleMouseDown = (event: any) => {
        setMouseIsDown(true);
        const sliderWidth = buttonRef.current.offsetWidth - sliderRef.current.offsetWidth - 3;
        setSlideMovementTotal(sliderWidth);
        setInitialMouse(event.clientX || event.touches[0].pageX);
    };

    const handleMouseUp = (event: any) => {
        if (!mouseIsDown) return;
        setMouseIsDown(false);
        const currentMouse = event.clientX || event.changedTouches[0].pageX;
        const relativeMouse = currentMouse - initialMouse;

        if (relativeMouse < (slideMovementTotal * 80 / 100)) {
            sliderRef.current.style.left = '4px';
            return;
        }

        sliderRef.current.classList.add('unlocked');
        buttonRef.current.querySelector('.slide-text').textContent = 'Consent submitted';
        confirmAccounts();
        setTimeout(() => {
            buttonRef.current.classList.add('bg-converted');
        }, 20);

        setTimeout(() => {
            sliderRef.current.addEventListener('click', handleSliderClick);
        }, 0);
    };

    const handleSliderClick = () => {
        if (!sliderRef.current.classList.contains('unlocked')) return;
        sliderRef.current.classList.remove('unlocked');
        buttonRef.current.classList.remove('bg-converted');
        sliderRef.current.removeEventListener('click', handleSliderClick);
    };

    const handleMouseMove = (event: any) => {
        if (!mouseIsDown) return;
        const currentMouse = event.clientX || event.touches[0].pageX;
        const relativeMouse = currentMouse - initialMouse;

        if (relativeMouse <= 0) {
            sliderRef.current.style.left = '4px';
            return;
        }
        if (relativeMouse >= slideMovementTotal - 8) {
            sliderRef.current.style.left = slideMovementTotal + 'px';
            return;
        }
        sliderRef.current.style.left = relativeMouse + 8 + 'px';
    };


    useEffect(() => {
        bankList = []
        bankDict = {}
        let FilterValidResponse = discoverBankResponse.filter((d: any) => d.isChecked && d.Linked && d.Id != 'Not_found');
        FilterValidResponse.map((val: any) => {
            if (val.FITYPE == 'DEPOSIT' || val.FITYPE == 'TERM-DEPOSIT') {
                setBanklist(Banklist => [...Banklist, val]);
            } else if (val.FITYPE == "MUTUAL_FUNDS" || val.FITYPE == "SIP") {
                setMFlist(MFlist => [...MFlist, val]);
            } else if (val.FITYPE == "NPS") {
                setNPSlist(NPSlist => [...NPSlist, val]);
            } else if (val.FITYPE.includes("GST")) {
                setGST((GST: any) => [...GST, val]);
            } else if (val.FITYPE == "EQUITIES" || val.FITYPE == "ETF") {
                setEquity(NPSlist => [...NPSlist, val]);
            } else if (val.FITYPE == "INSURANCE_POLICIES") {
                setInsurance((Insurance: any) => [...Insurance, val]);
            }
        })
        FilterValidResponse.forEach((item: any, index: any) => {
            if (!bankList.includes(item.FIPID)) {
                bankList.push(item.FIPID)
                bankDict[item.FIPID] = []
                bankDict[item.FIPID].push(item)
            } else {
                bankDict[item.FIPID].push(item)
            }
        })
        setBankListState(bankList);
        setDicOfBank(bankDict);
        dispatch({ type: Active_FI_CATEGORY, body: FICategory.split(',')[0] })
    }, [])

    const Capitalize = (str: any) => {
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const Linkedlength = (Flag: any) => {
        let FilterValidResponse = discoverBankResponse.filter((d: any) => d.isChecked && d.Linked && d.Id != 'Not_found');
        if (Flag == 'BANK') {
            return FilterValidResponse.filter((val: any) => (val.FITYPE == 'DEPOSIT' || val.FITYPE == 'TERM-DEPOSIT'));
        } else if (Flag == 'MF') {
            return FilterValidResponse.filter((val: any) => (val.FITYPE == 'MUTUAL_FUNDS' || val.FITYPE == 'SIP'));
        } else if (Flag == 'NPS') {
            return FilterValidResponse.filter((val: any) => (val.FITYPE == 'NPS'));
        } else if (Flag == 'GST') {
            return FilterValidResponse.filter((val: any) => (val.FITYPE.includes("GST")));
        } else if (Flag == 'ETF') {
            return FilterValidResponse.filter((val: any) => (val.FITYPE == "EQUITIES" || val.FITYPE == "ETF"));
        } else if (Flag == 'INSURANCE') {
            return FilterValidResponse.filter((val: any) => (val.FITYPE == 'INSURANCE_POLICIES'));
        }
    }

    const gettotalLength = (Flag: any) => {
        let FilterValidResponse = discoverBankResponse.filter((d: any) => d.isChecked && d.Linked && d.Id != 'Not_found');
        if (Flag == 'BANK') {
            return FilterValidResponse.filter((val: any) => val.FITYPE == 'DEPOSIT' || val.FITYPE == 'TERM-DEPOSIT');
        } else if (Flag == 'MF') {
            return FilterValidResponse.filter((val: any) => val.FITYPE == 'MUTUAL_FUNDS' || val.FITYPE == 'SIP');
        } else if (Flag == 'NPS') {
            return FilterValidResponse.filter((val: any) => val.FITYPE == 'NPS');
        } else if (Flag == 'GST') {
            return FilterValidResponse.filter((val: any) => val.FITYPE.includes("GST"));
        } else if (Flag == 'ETF') {
            return FilterValidResponse.filter((val: any) => val.FITYPE == "EQUITIES" || val.FITYPE == "ETF");
        } else if (Flag == 'INSURANCE') {
            return FilterValidResponse.filter((val: any) => val.FITYPE == 'INSURANCE_POLICIES');
        }
    }

    const [UUID] = useRecoilState(UUIDAtom)
    const [XORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
    const [, setDiscoverData] = useRecoilState(discoveredDataAtom)
    const [FiDetails] = useRecoilState<any>(FiDetailsAtom)

    const confirmAccounts = async () => {
        let FilterdiscoverBankResponse = discoverBankResponse.filter((d: any) => d.isChecked && d.Linked && d.Id != 'Not_found');
        if (FilterdiscoverBankResponse.length !== 0) {
            let Banklists: any = [];
            let bankDicts: any = [];
            const FIPDetailsListModified: any = []
            // To generate ConsentArtefact Payload
            FilterdiscoverBankResponse.forEach((item: any) => {
                if (item.Linked && item.isChecked) {
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
            const requests = consentData.map((consentvalue: any) => {
                return SubmitAccount(consentvalue, FIPDetailsListModified);
            })
            const responses = await Promise.all(requests)
            let success = responses?.filter((response: any) => {
                if (!!response) {
                    return response.RESULT_CODE === "200"
                }
            })
            if (success.length >= 1) {
                navigate('/lottie')
            } else {
                navigate('/accountNotConnected')
            }
        }
    }

    const SubmitAccount = (consentvalue: string, FIPDetailsListModified: any) => {
        let submitAccounts: any = []
        let FilterConsent: any = consentFIP.find((x: any) => x.includes(consentvalue));
        if (FilterConsent.split('|').length == 4) {
            if (FilterConsent.split('|')[3] != 'NULL' && FilterConsent.split('|')[3] != '') {
                submitAccounts = FIPDetailsListModified.filter((Item: any) => Item.FIPID == FilterConsent.split('|')[3]);
            } else {
                let filterAccounts = consentDetails?.filter((value: any) => value.CONSENTHANDLE === consentvalue)
                FIPDetailsListModified.filter((acc: any) => filterAccounts.map((value: any) => {
                    let fivalue = value.FITYPES.match(acc.FITYPE)
                    if (fivalue) {
                        submitAccounts.push(acc)
                    }
                }))
            }
        } else {
            let filterAccounts = consentDetails?.filter((value: any) => value.CONSENTHANDLE === consentvalue)
            FIPDetailsListModified.filter((acc: any) => filterAccounts.map((value: any) => {
                let fivalue = value.FITYPES.match(acc.FITYPE)
                if (fivalue) {
                    submitAccounts.push(acc)
                }
            }))
        }
        if (submitAccounts.length > 0) {
            return consentArtefact(consentvalue, submitAccounts);
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

    /* 10. View Consent Details Click -> On click Consent text popup of consent will open */
    const OnClickConsent = () => {
        setOpen((prev) => !prev);
    }

    return (
        <div className="summary-paged">
            <div className="accountList_container">

                <Heading
                    Backbtn={true}
                    closebtn={true} checked={false}
                ></Heading>
                <div className="main-body">
                    <div className="summary-body">
                        <div className="summary-head">
                            <h5>Summary</h5>
                            <p>Review below information before submit your consent.</p>
                        </div>
                        <div className="linked-accouted">
                            <h5>LINKED ACCOUNTS</h5>
                            <div className="summary-box">
                                {Banklist.length > 0 && (<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='accord-box'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className='accord-header'
                                    >
                                        <div className="according-header">
                                            <h6>Bank accounts</h6>
                                            <p>{Linkedlength('BANK').length}/{gettotalLength('BANK').length} {Linkedlength('BANK').length > 1 ? "Accounts" : "Account"} linked <span><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                            </svg>
                                            </span> <span>{Object.keys(groupedItems(Banklist)).length} {Object.keys(groupedItems(Banklist)).length > 1 ? "Banks" : "Bank"}</span></p>
                                        </div>

                                    </AccordionSummary>
                                    <AccordionDetails className='accord-details'>
                                        <div className="link-detailss">
                                            {Object.keys(groupedItems(Banklist)).map((item: any) => (
                                                <><div className="bank-linked">
                                                    <div className="according-subheader">
                                                        <div className="accord-small">
                                                            {!!groupedItems(Banklist)[item][0].Logo ? <img src={`https://uat.camsfinserv.com/newuat/assets${groupedItems(Banklist)[item][0]?.Logo}`} alt="bank-account" />
                                                                : <img src={images.Bank} alt="bank-account" />}
                                                            <h6>{groupedItems(Banklist)[item][0]?.FIPNAME}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="link-acoounted">
                                                        {groupedItems(Banklist)[item].map((list: any) => (<p>{Capitalize(list.FIPACCTYPE)} account<span className={`${list.FIPACCTYPE == 'SAVINGS' ? 'pd_lt' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                            <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                                        </svg>
                                                        </span> <span className='text-bolds'>{list.FIPACCNUM.substring(list.FIPACCNUM.length - 4)} </span></p>))}
                                                    </div>
                                                </div></>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>)}

                                {MFlist.length > 0 && (<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className='accord-box'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className='accord-header'
                                    >
                                        <div className="according-header">
                                            <h6>Mutual Fund</h6>
                                            <p>{Linkedlength('MF').length}/{gettotalLength('MF').length} {Linkedlength('MF').length > 1 ? "folios" : "folio"} linked</p>
                                        </div>

                                    </AccordionSummary>
                                    <AccordionDetails className='accord-details'>
                                        <div className="link-detailss">
                                            {Object.keys(groupedItems(MFlist)).map((item: any) => (
                                                <><div className="bank-linked">
                                                    <div className="according-subheader">
                                                        <div className="accord-small">
                                                            {!!groupedItems(MFlist)[item][0].Logo ? <img src={`https://uat.camsfinserv.com/newuat/assets${groupedItems(MFlist)[item][0]?.Logo}`} alt="bank-account" />
                                                                : <img src={images.Bank} alt="bank-account" />}
                                                            <h6>{groupedItems(MFlist)[item][0]?.FIPNAME}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="link-acoounted">
                                                        {groupedItems(MFlist)[item].map((list: any) => (<p>{list.AMCNAME} account<span className={`${list.FIPACCTYPE == 'SAVINGS' ? 'pd_lt' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                            <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                                        </svg>
                                                        </span> <span className='text-bolds'>{list.FIPACCNUM.substring(list.FIPACCNUM.length - 4)} </span></p>))}
                                                    </div>
                                                </div></>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>)}
                                {GST.length > 0 && (<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className='accord-box'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className='accord-header'
                                    >
                                        <div className="according-header">
                                            <h6>GST Accounts</h6>
                                            <p>{Linkedlength('GST').length}/{gettotalLength('GST').length} Accounts linked <span><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                            </svg>
                                            </span> <span>{Object.keys(groupedGST(GST)).length} Mobile number</span></p>
                                        </div>

                                    </AccordionSummary>
                                    <AccordionDetails className='accord-details'>
                                        <div className="link-detailss">
                                            {Object.keys(groupedGST(GST)).map((item: any) => (
                                                <><div className="bank-linked">
                                                    <div className="according-subheader">
                                                        <div className="accord-small">
                                                            {!!groupedGST(GST)[item][0].Logo ? <img src={`https://uat.camsfinserv.com/newuat/assets${groupedGST(GST)[item][0]?.Logo}`} alt="bank-account" />
                                                                : <img src={images.Bank} alt="bank-account" />}
                                                            <h6>{groupedGST(GST)[item][0]?.mobileNumber}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="link-acoounted">
                                                        {groupedGST(GST)[item].map((list: any) => (<p>{list.StateName}<span className={`${list.FIPACCTYPE == 'SAVINGS' ? 'pd_lt' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                            <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                                        </svg>
                                                        </span> <span className='text-bolds'>{list.FIPACCNUM.substring(list.FIPACCNUM.length - 3)} </span></p>))}
                                                    </div>
                                                </div></>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>)}
                                {Equity.length > 0 && (<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className='accord-box'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className='accord-header'
                                    >
                                        <div className="according-header">
                                            <h6>Equity</h6>
                                            <p>{Linkedlength('ETF').length}/{gettotalLength('ETF').length} {Linkedlength('ETF').length > 1 ? "stocks" : "stock"} linked </p>
                                        </div>

                                    </AccordionSummary>
                                    <AccordionDetails className='accord-details'>
                                        <div className="link-detailss">
                                            {Object.keys(groupedItems(Equity)).map((item: any) => (
                                                <><div className="bank-linked">
                                                    <div className="according-subheader">
                                                        <div className="accord-small">
                                                            {!!groupedItems(Equity)[item][0].Logo ? <img src={`https://uat.camsfinserv.com/newuat/assets${groupedItems(Equity)[item][0]?.Logo}`} alt="bank-account" />
                                                                : <img src={images.Bank} alt="bank-account" />}
                                                            <h6>{groupedItems(Equity)[item][0]?.FIPNAME}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="link-acoounted">
                                                        {groupedItems(Equity)[item].map((list: any) => (<p>DP ID<span className={`${list.FIPACCTYPE == 'SAVINGS' ? 'pd_lt' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                            <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                                        </svg>
                                                        </span> <span className='text-bolds'>{list.FIPACCNUM.substring(list.FIPACCNUM.length - 4)} </span></p>))}
                                                    </div>
                                                </div></>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>)}

                                {NPSlist.length > 0 && (<Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} className='accord-box'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className='accord-header'
                                    >
                                        <div className="according-header">
                                            <h6>NPS</h6>
                                            <p>{Linkedlength('NPS').length}/{gettotalLength('NPS').length} {Linkedlength('NPS').length > 1 ? "Accounts" : "Account"} linked </p>
                                        </div>

                                    </AccordionSummary>
                                    <AccordionDetails className='accord-details'>
                                        <div className="link-detailss">
                                            {Object.keys(groupedItems(NPSlist)).map((item: any) => (
                                                <><div className="bank-linked">
                                                    <div className="according-subheader">
                                                        <div className="accord-small">
                                                            {!!groupedItems(NPSlist)[item][0].Logo ? <img src={`https://uat.camsfinserv.com/newuat/assets${groupedItems(NPSlist)[item][0]?.Logo}`} alt="bank-account" />
                                                                : <img src={images.Bank} alt="bank-account" />}
                                                            <h6>{groupedItems(NPSlist)[item][0]?.FIPNAME}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="link-acoounted">
                                                        {groupedItems(NPSlist)[item].map((list: any) => (<p>PRAN<span className={`${list.FIPACCTYPE == 'SAVINGS' ? 'pd_lt' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                            <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                                        </svg>
                                                        </span> <span className='text-bolds'>{list.FIPACCNUM.substring(list.FIPACCNUM.length - 4)} </span></p>))}
                                                    </div>
                                                </div></>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>)}

                                {Insurance.length > 0 && (<Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} className='accord-box'>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className='accord-header'
                                    >
                                        <div className="according-header">
                                            <h6>Insurance</h6>
                                            <p>{Linkedlength('INSURANCE').length}/{gettotalLength('INSURANCE').length} {Linkedlength('INSURANCE').length > 1 ? "Policies" : "policy"} linked</p>
                                        </div>

                                    </AccordionSummary>
                                    <AccordionDetails className='accord-details'>
                                        <div className="link-detailss">
                                            {Object.keys(groupedItems(Insurance)).map((item: any) => (
                                                <><div className="bank-linked">
                                                    <div className="according-subheader">
                                                        <div className="accord-small">
                                                            {!!groupedItems(Insurance)[item][0].Logo ? <img src={`https://uat.camsfinserv.com/newuat/assets${groupedItems(Insurance)[item][0]?.Logo}`} alt="bank-account" />
                                                                : <img src={images.Bank} alt="bank-account" />}
                                                            <h6>{groupedItems(Insurance)[item][0]?.FIPNAME}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="link-acoounted">
                                                        {groupedItems(Insurance)[item].map((list: any) => (<p>Policy no<span className={`${list.FIPACCTYPE == 'SAVINGS' ? 'pd_lt' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                                            <circle cx="2" cy="2.5" r="2" fill="#999999" />
                                                        </svg>
                                                        </span> <span className='text-bolds'>{list.FIPACCNUM.substring(list.FIPACCNUM.length - 4)} </span></p>))}
                                                    </div>
                                                </div></>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>)}

                            </div>
                            {/* boxdesign */}
                            <div className="cams-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                                    <path d="M9.17355 9.16282L0.676287 17.7034C0.676287 17.7034 0.0113093 18.2869 0.000144884 18.7837C-0.0107787 19.2698 0.59962 19.8767 0.59962 19.8767L9.71022 28.9383L18.4965 38V34.0347V30.0567L16.0097 27.3116C14.0291 25.3416 13.2625 24.5028 13.2625 24.2868C13.2625 24.0707 14.0164 23.2446 15.9202 21.3255C17.3769 19.864 18.4965 18.6058 18.4965 18.6058V15.2887V13.6746V12.0605L14.4508 16.4452C10.5919 20.3342 10.0424 20.8426 9.69744 20.8426C9.46744 20.8426 9.18633 20.7282 9.04577 20.5884C8.44521 19.9911 8.45799 19.9784 13.7736 14.6786L18.4965 9.70932V5.17213V0.634953V0C18.1531 0.23008 17.9793 0.362793 17.6708 0.634953L9.17355 9.16282Z" fill="#159640" />
                                    <path d="M19.5034 9.55312C19.5034 17.7751 19.5034 18.7774 19.5034 18.7774C19.6313 18.9551 21.1015 20.2492 22.5078 21.6703C23.914 23.0914 25.1541 24.3983 25.2564 24.5886C25.3842 24.817 25.4482 25.2991 25.4482 26.0731C25.4482 27.4434 25.2564 27.9256 24.2976 28.8772C23.4154 29.7527 22.5333 30.0826 20.8202 30.1714L19.5034 30.2348V34.1174V38L26.1513 31.3387C31.8915 25.591 32.7992 24.6267 32.7992 24.2968C32.7992 23.9796 32.16 23.2944 28.005 19.1581C22.8785 14.0574 22.8785 14.0574 23.5049 13.4738C24.1186 12.9028 24.1186 12.8901 29.2196 17.9527C33.3745 22.0637 34.0776 22.7108 34.3972 22.7108C34.7169 22.7108 35.0365 22.4443 36.3277 21.1501C38.0152 19.4626 38.1559 19.1834 37.9002 18.2191C37.7851 17.7624 36.6984 16.6458 29.1812 9.15978L20.5901 0.633335C20.19 0.339767 19.9473 0.208469 19.5034 0V0.633335V9.55312Z" fill="#154096" />
                                </svg>
                                <h4>To view and manage your consents, use  <span className='text-cams'>CAMS</span><span className='text-finserve'>Finserv</span>
                                    website/mobile app.</h4>
                            </div>
                            {/* boxdesign */}

                        </div>
                    </div>
                </div>
            </div>
            <div className="bottomSpace">
                <div className="consent choose-design">
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
                    <p className="consentDetails">
                        I consent to share my banking information with {XORDecryptRes.fiuName}
                        <span onClick={() => { OnClickConsent() }} className="viewConsentDetails">
                            View Consent details.
                        </span>
                    </p>
                </div>
                <div className="swipe-position">
                    {/* <ReactSwipeButton
                        text='Swipe to submit consent'
                        color='#2F9446'
                        text_unlocked="Submitted"
                        onSuccess={confirmAccounts}
                    /> */}
                    <div className="Swipe_main">
                        <div className="d-md-none">
                        <button disabled={!checked} className="swiper-button " id="swiper-button" type="button" ref={buttonRef}>
                              <span className="slide-text">Swipe Submit consent</span>  
                                {checked ? <div className="slider" id="slider" ref={sliderRef} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp} onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
                                    <i className="swiper-arrow default"></i>
                                </div> :
                                    <div className="slider" id="slider" ref={sliderRef} >
                                        <i className="swiper-arrow default"></i>
                                    </div>} 
                        </button>
                        </div>
                        <div className="d-md-block">
                        <button  className="swiper-button "  type="button"  >
                              <span className="slide-text"> Submit consent</span>  
                                
                        </button>
                        </div>
                    </div>
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
        </div>

    );
};
export default Summary;
