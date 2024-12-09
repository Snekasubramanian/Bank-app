import React, { type ChangeEvent, useEffect, useState } from 'react'
import images from '../assets/images'
import Heading from '../component/heading/Heading'
import BankCard from '../component/bank-card/BankCard'
import Footer from '../component/footer/Footer'
import Button from '../component/button/Button'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  FiDetails as FiDetailsAtom,
  XORDecryptRes as XorDecryptResAtom
} from '../services/recoil-states/atom'
import { BankState, CHOOSE_BANK_LIST, UPDATE_CHOOSE_BANK } from '../store/types/bankListType'
import { InputAdornment, Box, Grid, Typography, CardMedia, Card, TextField, Autocomplete } from '@mui/material';
import Decrypt from '../services/decrypt'
import { UseApi } from '../services/api/api'
import Encrypt from '../services/encrypt'
import { useRecoilState } from 'recoil'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../store/reducers'
import ListofBankModal from '../modal/ListofBankModal';
import makeStyles from "@material-ui/core/styles/makeStyles";
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
const UserBankAccount = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const checkValue: boolean = false;
  const [fiDetails, setFiDetails] = useRecoilState(FiDetailsAtom);
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XorDecryptResAtom)
  const dispatch = useDispatch();
  const [Fipid, SetFipid] = useState<any>([]);
  const [popularBank, setPopularBank] = useState<any>([])
  const [nonpopularBank, setnonPopularBank] = useState<any>([])
  const [selectedBank, setselectedBank] = useState<any>([])
  const [filter, setFilter] = useState("")
  // let selectnonPopular : any = [] 
  const [selectnonPopular, setSelectnonPopular] = useState([])
  let { discoverBankResponse, choosebanklist, ActiveFICategory } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [checked, setChecked] = useState(true)
  const [searchLoader, setSearchLoader] = useState(false)
  let fixFlow = location?.state?.fixFlow
  console.log("fixFlow", fixFlow)
  const isDisable = () => {
    let findLength: any = [];
    findLength = choosebanklist.filter((value: any) => value.isChecked === true);
    return findLength.length > 0 ? false : true;
  }

  const handleSearch = () => {
    return choosebanklist?.filter((bankName: any) =>
      bankName?.FIPNAME.toLowerCase().includes(filter.toLocaleLowerCase()),
    );
  };

  const Discoveraccount = () => {
    setFiDetails((prev: any) => ({ ...prev, fixFipid: Fipid,fipid : Fipid}));
    dispatch({
      type: CHOOSE_BANK_LIST,
      body: choosebanklist
    });
    if(XORDecryptRes.fipid === "" || discoverBankResponse.length == 0){
    setXORDecryptRes((prev: any) => ({ ...prev, fipid: Fipid.toString() }));
    navigate("/lottieLoader");
    }else if(discoverBankResponse.length == 0){
      navigate("/lottieLoader");
    }else if(!!discoverBankResponse && fixFlow){
      navigate(`/userAccount`);
    }
    else{
      navigate(`/userAccount`);
    }
  }
  useEffect(() => {
    const banks = choosebanklist.filter((x: any) => x.POPULARBANK == 'Y');
    setPopularBank(banks);
    const bank = choosebanklist.filter((x: any) => x.POPULARBANK == 'N');
    setnonPopularBank(bank);
    let selectbank: any = [];
    let setFIP: any = [];
    choosebanklist.forEach((x: any) => {
      if (x.isChecked) {
        selectbank.push(x.FIPNAME);
        setFIP.push(x.FIPID);
      }
    })
    SetFipid(setFIP)
    setselectedBank(selectbank)
  }, [choosebanklist])

  useEffect(() => {
    let selectnonPopular = nonpopularBank.filter((bank: any) => (
      Fipid.includes(bank.FIPID)
    ))
    setSelectnonPopular(selectnonPopular)
  }, [Fipid]);


  const [isOpen, setIsOpen] = useState(false)
  const closeDrawer = () => {
    setIsOpen(false);
  }
  const classes = useStyles();

  return (
    <>
      <div className=" ">

        <Heading
          checked={checkValue}
          Backbtn={true}
          closebtn={false}
        />

        <div className="page-container main-body">
          {ActiveFICategory === 'BANK' &&
            <h6>Choose bank accounts</h6>
          }
          {ActiveFICategory === 'INSURANCE_POLICIES' &&
            <h6>Choose your policy insurer</h6>
          }
          <div className="search-gap">
            <Autocomplete
              className='design-box'
              freeSolo
              value={selectedBank}
              options={choosebanklist}
              getOptionLabel={option => option.FIPNAME}
              multiple={true}
              onChange={(e: any, newInputValue) => {
                console.log(newInputValue)
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

            <Typography className='show-text' onClick={() => setIsOpen(true)}>{ActiveFICategory === 'INSURANCE_POLICIES' ? "Show available insurer" : "Show available banks"}</Typography>
          </div>
          <div className="choose-heights">
            {popularBank.length > 0 && (<div className="popular-bank">
              <Typography className='popular-title'>{ActiveFICategory === 'INSURANCE_POLICIES' ? "Popular Insurer" : "Popular banks"}</Typography>
              <Grid className='d-flex-wrap bank-child'>
                {popularBank.map((bank: any) => (
                  <div className={ActiveFICategory === 'INSURANCE_POLICIES' ? "card-insurance" : "card-bank"}>
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
                  <div className={ActiveFICategory === 'INSURANCE_POLICIES' ? "card-insurance" : "card-bank"}>
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
        <div className={`discover-card choose-footer  ${isDisable() ? ' ' : 'modal-btn'}`}>
          <Button name={'Discover accounts'} onClick={() => { Discoveraccount() }} disabled={isDisable()}></Button>
          <Footer />

        </div>
      </div>

      <ListofBankModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        choosebanklist={choosebanklist}
        handleClose={() => { closeDrawer() }}
      />
    </>
  )
}
export default UserBankAccount
