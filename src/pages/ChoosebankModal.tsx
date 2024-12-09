
import Modal from 'react-modal'
import React, { type ChangeEvent, useEffect, useState } from 'react'
import images from '../assets/images'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    FiDetails as FiDetailsAtom,
    XORDecryptRes as XorDecryptResAtom
} from '../services/recoil-states/atom'
import { Active_FI_CATEGORY, BankState, CHOOSE_BANK_LIST, DISCOVER_REPONSE, MultiFicloser, UPDATE_CHOOSE_BANK, UPDATE_Loader } from '../store/types/bankListType'
import { InputAdornment, Box, Grid, Typography, CardMedia, Card, TextField, Autocomplete, Button, Slide, Dialog, Paper } from '@mui/material';
import Decrypt from '../services/decrypt'
import { UseApi } from '../services/api/api'
import Encrypt from '../services/encrypt'
import { useRecoilState } from 'recoil'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import ListofBankModal from '../modal/ListofBankModal';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TransitionProps } from '@mui/material/transitions';
import { Height } from '@mui/icons-material'

const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {

            color: "var(--text-icon-light-tertiary, #717784)",
            fontFamily: "Inter",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: '100%',
            opacity: '1',
        }
    }
});
interface modalProps {
    closeModal?: React.MouseEventHandler
    OnExit?: React.MouseEventHandler
    isOpenbank: boolean
    setIsOpenbank: any
    list?: any
    setlabel?:any
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChoosebankModal({
    closeModal,
    isOpenbank,
    setIsOpenbank,
    list,
    setlabel
}: // OnExit
    modalProps): any {
    const [fiDetails, setFiDetails] = useRecoilState(FiDetailsAtom);
    const dispatch = useDispatch();
    const [Fipid, SetFipid] = useState<any>([]);
    const [popularBank, setPopularBank] = useState<any>([])
    const [nonpopularBank, setnonPopularBank] = useState<any>([])
    const [selectedBank, setselectedBank] = useState<any>([])
    const [bankList, setbankList] = useState<any>([])
    const [filter, setFilter] = useState("")
    // let selectnonPopular : any = [] 
    const [selectnonPopular, setSelectnonPopular] = useState([])
    let { discoverBankResponse, choosebanklist,  ActiveFICategory, FICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
    const [searchLoader, setSearchLoader] = useState(false)


    const isDisable = () => {
        let findLength: any = [];
        findLength = choosebanklist.filter((value: any) => value.isChecked === true);
        return findLength.length > 0 ? false : true;
    }

    const Discoveraccount = () => {
        if(list == undefined){
            discoverBankResponse.push({
                "Consent": false,
                "Linked": true,
                "Id": "Not_found",
                "FIPID": "Bank",
                "AMCSHORTCODE": "Not_found",
                "FIPNAME": "bank",
                "FITYPE": ActiveFICategory == 'BANK' ? "DEPOSIT" : ActiveFICategory,
                "ACCDISCOVERYDATE": "Not_found",
                "FIPACCTYPE": "Not_found",
                "FIPACCREFNUM": "Not_found",
                "FIPACCNUM": "Not_found",
                "FIPACCLINKREF": "Not_found",
                "LINKEDDATE": "Not_found",
                "Logo": "bank",
                'PartialLoader': true
            })
            dispatch({
                type: DISCOVER_REPONSE,
                body: discoverBankResponse
            })
        }
        setFiDetails((prev: any) => ({ ...prev, fixFipid: Fipid }));
        dispatch({
            type: MultiFicloser,
            body: "modifyCloser"
        });
        setIsOpenbank(false);
    }


    useEffect(() => {
        if(choosebanklist.filter((x: any) => x.Flag == ActiveFICategory).length > 0){
            setbankList(choosebanklist.filter((x: any) => x.Flag == ActiveFICategory));
        }
    }, [ActiveFICategory, choosebanklist])

    const Skip = () => {
        const Ficategories = FICategory.split(',');
        let index =  Ficategories.findIndex((obj:any)=> obj == ActiveFICategory);
        dispatch({type: Active_FI_CATEGORY,body: Ficategories[index+1]});
        setlabel(Ficategories[index+1]);
        setIsOpenbank(false);
    }

    useEffect(() => {
        const banks = bankList.filter((x: any) => x.POPULARBANK == 'Y');
        setPopularBank(banks);
        const bank = bankList.filter((x: any) => x.POPULARBANK == 'N');
        setnonPopularBank(bank);
        let selectbank: any = [];
        let setFIP: any = [];
        bankList.forEach((x: any) => {
            if (x.isChecked) {
                selectbank.push(x.FIPNAME);
                setFIP.push(x.FIPID);
            }
        })
        SetFipid(setFIP)
        setselectedBank(selectbank)
    }, [choosebanklist, bankList])

    useEffect(() => {
        let selectnonPopular = nonpopularBank.filter((bank: any) => (
            Fipid.includes(bank.FIPID)
        ))
        setSelectnonPopular(selectnonPopular)
    }, [Fipid]);

    const dialogClose = () =>{
        if(!!list){
            setIsOpenbank(false)
            dispatch({
                type: UPDATE_Loader,
                body: { selectedAccount: list[0].FIPNAME }
            });
        }
    }

    const classes = useStyles();

    // const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog
            open={isOpenbank}
            onClose={() => {
                dialogClose()
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
        >

            <div className="verify-modal">
                <h6>Choose {ActiveFICategory === 'INSURANCE_POLICIES' ? "insurer" : "bank"} accounts</h6>
            </div>
            <div className={popularBank.length > 0 ? "choose-bank-modal page-container" : "choose-bank-modal page-container insure_list"}>
                <div className="search-gap">
                    <Autocomplete
                        // open={isOpen}
                        // onOpen={() => setIsOpen(true)}
                        className='design-box'
                        freeSolo
                        value={selectedBank}
                        options={bankList}
                        getOptionLabel={option => option.FIPNAME}
                        multiple={true}
                        onChange={(e: any, newInputValue) => {
                            setSearchLoader(false)
                            dispatch({
                                type: UPDATE_CHOOSE_BANK,
                                body: { selectedAccount: e.target.innerText }
                            });
                        }}
                        renderInput={(params) => (
                            <div className="search-box">
                                <TextField
                                    classes={{ root: classes.customTextField }}
                                    placeholder={ActiveFICategory === 'INSURANCE_POLICIES' ? "Search insurer" : "Search banks"}
                                    {...params}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                        setSearchLoader(true)
                                        setTimeout(() => {
                                            setSearchLoader(false)
                                        }, 2000)
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        // type: 'search',
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clip-path="url(#clip0_4053_1332)">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.08301 7.33325C2.08301 4.43376 4.43351 2.08325 7.33301 2.08325C10.2325 2.08325 12.583 4.43376 12.583 7.33325C12.583 10.2327 10.2325 12.5833 7.33301 12.5833C4.43351 12.5833 2.08301 10.2327 2.08301 7.33325ZM7.33301 0.583252C3.60509 0.583252 0.583008 3.60533 0.583008 7.33325C0.583008 11.0612 3.60509 14.0833 7.33301 14.0833C8.92677 14.0833 10.3915 13.5309 11.5463 12.6072L13.8027 14.8636C14.0956 15.1565 14.5704 15.1565 14.8633 14.8636C15.1562 14.5707 15.1562 14.0958 14.8633 13.8029L12.6069 11.5465C13.5307 10.3918 14.083 8.92701 14.083 7.33325C14.083 3.60533 11.0609 0.583252 7.33301 0.583252Z" fill="#717784" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_4053_1332">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </InputAdornment>
                                                {searchLoader && <img src={images.Loaders} alt="" />}
                                            </>
                                        ),

                                    }}

                                >

                                </TextField>
                            </div>
                        )}

                        disableCloseOnSelect
                    />


                </div>
                <div className="choose_bank_height">
                    {popularBank.length > 0 && (<div className="popular-bank">
                        <Typography className='popular-title'>{ActiveFICategory === 'INSURANCE_POLICIES' ? "Popular Insurer" : "Popular banks"}</Typography>
                        <Grid className='d-flex-wrap bank-child'>
                            {popularBank.map((bank: any) => (
                                <div className={ActiveFICategory === 'INSURANCE_POLICIES' ? "card-bank" : "card-bank"}>
                                    <Card sx={{ cursor: 'pointer' }} className={`${bank.isChecked === true ? 'warning-fips' : ''}  ${bank.isChecked === true ? ' bank-colors' : 'warning-fips'
                                        }`}
                                        onClick={() => {
                                            dispatch({
                                                type: UPDATE_CHOOSE_BANK,
                                                body: { selectedAccount: bank.FIPNAME }
                                            });
                                        }}
                                    >
                                        <div className="" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <div className="choose-img ">
                                                {bank.LOGO ?
                                                    <CardMedia
                                                        component="img"
                                                        src={`https://uat.camsfinserv.com/newuat/assets${bank.LOGO}`}
                                                        alt="icon"
                                                    />
                                                    :
                                                    <CardMedia
                                                        component="img"
                                                        src={images.Bank}
                                                        alt="icon"
                                                    />
                                                }
                                            </div>
                                            <p className='bank-names'>{bank.FIPNAME}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            // checked={selectedCard === 'Check1'}
                                            checked={bank.isChecked}
                                            className="  borders-bank   "
                                        />
                                    </Card>
                                </div>))}
                        </Grid>
                    </div>)}
                    {selectnonPopular.length > 0 && (<div className="popular-bank selected-bank">
                        <Typography className='popular-title'>{ActiveFICategory === 'INSURANCE_POLICIES' ? "Selected Insurer" : "Selected Bank"}</Typography>
                        <Grid className='d-flex-wrap bank-child'>
                            {selectnonPopular.map((value: any) => (
                                <div className={ActiveFICategory === 'INSURANCE_POLICIES' ? "card-bank" : "card-bank"}>
                                    <Card className='warning-fips bank-colors'
                                        onClick={() => {
                                            dispatch({
                                                type: UPDATE_CHOOSE_BANK,
                                                body: { selectedAccount: value.FIPNAME }
                                            });
                                        }}
                                    >
                                        <div className="choose-cards">
                                            <div className="choose-img">
                                                <CardMedia
                                                    component="img"
                                                    src={value.LOGO ? `https://uat.camsfinserv.com/newuat/assets${value.LOGO}` : images.Bank}
                                                    alt="icon"
                                                />
                                            </div>
                                            <p className='bank-names'>{value.FIPNAME}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            // defaultChecked
                                            className="borders-bank"
                                            checked={value.isChecked}
                                        />
                                    </Card>
                                </div>))}
                        </Grid>

                    </div>)}
                </div>

            </div>
            {!!setlabel ? (<div className="modal-btn choose_modal_btn skip_design">
                <Button className='skip_button' onClick={Skip}>Skip</Button>
                <Button name={'Discover accounts'} onClick={() => { Discoveraccount() }} disabled={isDisable()}>Discover accounts</Button>
            </div>):(<div className="modal-btn choose_modal_btn">
                <Button name={'Discover accounts'} onClick={() => { Discoveraccount() }} disabled={isDisable()}>Discover accounts</Button>
            </div>)}
        </Dialog>

    )
}