import React, { useState, type ChangeEventHandler, useEffect } from 'react'
import FixBottomDrawer from '../drawer/FixBottomDrawer'
import { useRecoilState } from 'recoil'
import {
  XORDecryptRes as XORDecryptResAtom

} from '../../services/recoil-states/atom';
import { useDispatch, useSelector } from 'react-redux'
import { BankState, FixFIPNAME, UPDATE_Loader } from '../../store/types/bankListType'
import images from '../../assets/images/index'
import { RootStateType } from '../../store/reducers';
import PanMultifi from '../../pages/Pan_multifi';
interface bankProps {
  logo: string
  handleClickPopupBtn: any
  onSelect: ChangeEventHandler<HTMLInputElement>
  list?: any
  bankName: string
  fipid: string
  indicator: string
  bankCounts: number
  width?: string
  isLinked?: string
  PartialLoader?: boolean
  pan: any
  showflag?:any
}
export default function BankCard({
  logo,
  list,
  bankName,
  fipid,
  bankCounts,
  indicator,
  pan,
  PartialLoader,
  handleClickPopupBtn,
  showflag,
  width = '32px',
  onSelect
}: bankProps): ReturnType<React.FC> {
  const [isOpen, setIsOpen] = useState<any>(false)
  const [confirm, setConfirm] = useState(false);
  const LabelName = list.length === list.filter((d: any) => d.Linked).length ? 'Linked' : 'Link';
  const [XORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const { discoverBankResponse, ActiveFICategory, FITypes } = useSelector<RootStateType, BankState>((state) => state.bank);
  let Logo: any = ""
  const dispatch = useDispatch()
  const isDisabled = () => {
    return list.filter((d: any) => !d.Linked && d.isChecked).length > 0 ? false : true;
  };

const changeCheck = (event:any,item : any)  =>{
  event.preventDefault();
  dispatch({
    type: 'SELECT_ACCOUNT',
    body: { selectedAccount: item }
  });
}
  const Fixhandler = () => {
    setConfirm(true)
    dispatch({
      type: UPDATE_Loader,
      body: { selectedAccount: list[0].FIPNAME }
    });
  }

  if (ActiveFICategory === 'GSTR') {
    Logo = images.GST
  }
  else if (ActiveFICategory === 'MF') {
    Logo = images.MF
  } else if (ActiveFICategory === 'NPS') {
    Logo = images.NPS
  } else if (ActiveFICategory === 'EQUITIES') {
    Logo = images.Equities
  } else if (ActiveFICategory === 'INSURANCE_POLICIES') {
    Logo = images.Insurance
  } else if (ActiveFICategory === 'BANK') {
    Logo = images.Bank
  } else {
    Logo = images.Bank
  }


  return (
    <>
      {(indicator === 'Not_found' ) && <div className='Bank_details'>
        {!PartialLoader ? <div className="card">
          <div className='bankLogo'>
            {!!logo ? <img
              className="bank-logo"
              src={`https://uat.camsfinserv.com/newuat/assets${logo}`}
              alt="image"
            /> :
              <img
                className="bank-logo"
                src={Logo}
                alt="image"
              />}
          </div>
          <div className="bankName">
            <p className="bankName-text">{bankName}</p>
            {ActiveFICategory === 'MF' ?
              <p className="bankAccountCount error_txt">
                No folios found
              </p> :
              <p className="bankAccountCount error_txt">
                No accounts found
              </p>
            }
          </div>
          <div className='link'>
            {/* <button className="fix_btn"  
             >Fix</button> */}
            <button className="fix_btn"
              onClick={() => {
                Fixhandler();
              }}
            >Fix</button>
          </div>
        </div> :
          <div className="bank-discover">
            <div className="discovering-card">
              <div className="discover-topbox">
                <div className="discover-page">
                  <div className="boxes  "></div>
                  <div className="discover-textograpy">
                    <div className="paragraph-three  "></div>
                    <div className="paragraph-four  "></div>
                  </div>
                </div>
                <div className="dicover-link">
                  <div className="button-links  ">
                    <div className="link-text  "></div>
                  </div>
                </div>
              </div>
              <div className="line-dicover"></div>
              <div className="discover-bottom">
                <div className="discover-pages">
                  <div className="paragraph-five  "></div>
                  <div className="dots-discover   "></div>
                  <div className="paragraph-six  "></div>
                </div>
                <div className="paragraph-dots  "></div>
              </div>
              <div className=" shimmerBG dicover-shimmer"></div>
            </div>
          </div>
        }
      </div>}

      {/* {indicator !== 'Not_found' && <div className={bankCounts >= 3 ? 'Bank_details card_height' : 'Bank_details'}> */}
      {indicator !== 'Not_found' && <div className="Bank_details">
        <div className="card">
          <div className='bankLogo'>
            {!!logo ? <img
              className="bank-logo"
              src={`https://uat.camsfinserv.com/newuat/assets${logo}`}
              alt="image"
            /> :
              <img
                className="bank-logo"
                src={Logo}
                alt="image"
              />}
          </div>
            <div className="bankName">
              <p className="bankName-text">{bankName}</p>
              {bankCounts > 1 ?
                <p className="bankAccountCount">
                  {ActiveFICategory !== 'MF' ? `Found ${bankCounts} accounts to link` : `Found ${bankCounts} folios to link`}
                </p>
                : <p className="bankAccountCount">
                  {ActiveFICategory !== 'MF' ? `Found ${bankCounts} account to link` :  `Found ${bankCounts} folio to link`}
                </p>
              }
            </div> 
          {discoverBankResponse.length !== 1 && <div className='link'>
            {LabelName === 'Link'
              ? (<button className="Link_btn" disabled={isDisabled()} onClick={() => handleClickPopupBtn(list)}>Link</button>)
              : (<button className="Linked_btn">Linked</button>)
            }

          </div>}
        </div>
        <div className="ListofAccounts">

          <ul>
            {list?.map((item: any, index: any) => (
              <li onClick={() => changeCheck(event,item)}
                key={item.FIPACCREFNUM}
                className="BankList"
              >
                <div className='account-link'>
                  <div className="account">
                    {/* <div className='accountList'> */}
                    <div className={(item.Linked) ? "accountName_success accountList" : "accountName accountList"}>

                      {(item.FITYPE == "DEPOSIT" || item.FITYPE == "TERM-DEPOSIT") && <label htmlFor={item.FIPACCREFNUM}>
                        {item.FIPACCTYPE.charAt(0)}{item.FIPACCTYPE.slice(1).toLowerCase()} account
                        <span className='dot_style'>
                        </span>
                        <span>
                          {item.FIPACCNUM.substring(item.FIPACCNUM.length - 4)}
                        </span>
                      </label>}

                      {(item.FITYPE == "MUTUAL_FUNDS" || item.FITYPE == "SIP") && <label htmlFor={item.FIPACCNUM}>
                        {item.AMCNAME}
                        <span className='dot_style'>
                        </span>
                        <span>
                          {item.FIPACCNUM.substring(item.FIPACCNUM.length - 4)}
                        </span>
                      </label>}

                      {item.FITYPE == "NPS" && <label htmlFor={item.FIPACCREFNUM}>
                        PRAN
                        <span className='dot_style'>
                        </span>
                        <span>
                          {item.FIPACCNUM.substring(item.FIPACCNUM.length - 4)}
                        </span>
                      </label>}

                      {item.FITYPE.includes("GST") && <label htmlFor={item.FIPACCREFNUM}>
                        {item.StateName}
                        <span className='dot_style'>
                        </span>
                        <span>
                          {item.FIPACCNUM.substring(item.FIPACCNUM.length - 3)}
                        </span>
                      </label>}

                      {(item.FITYPE == "EQUITIES" || item.FITYPE == "ETF") && <label htmlFor={item.FIPACCREFNUM}>
                        DP ID
                        <span className='dot_style'>
                        </span>
                        <span>
                          {item.FIPACCNUM.substring(item.FIPACCNUM.length - 4)}
                        </span>
                      </label>}
                      {(item.FITYPE == "INSURANCE_POLICIES") && <label htmlFor={item.FIPACCREFNUM}>
                        Policy no
                        <span className='dot_style'>
                        </span>
                        <span>
                          {item.FIPACCNUM.substring(item.FIPACCNUM.length - 4)}
                        </span>
                      </label>}
                      <div className='checkbox-style'>
                        <input
                          checked={item.isChecked}
                          id={item.FIPACCREFNUM}
                          type="checkbox"
                          value={JSON.stringify(item)}
                          name="list-radio"
                          onChange={onSelect}
                          // disabled={item.Linked}
                          className={(item.Linked === true) ? 'text-[#68D982] linked-checkbox' : ' linked-accounts '}
                        />
                      </div>
                    </div>

                    {/* </div> */}

                  </div>

                  {item.Linked === true
                    ? (
                      <div className="already-linked">
                        <label
                          htmlFor={item.FIPACCREFNUM}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.3333 4.66675H8.66668V6.00008H11.3333C12.4333 6.00008 13.3333 6.90008 13.3333 8.00008C13.3333 9.10008 12.4333 10.0001 11.3333 10.0001H8.66668V11.3334H11.3333C13.1733 11.3334 14.6667 9.84008 14.6667 8.00008C14.6667 6.16008 13.1733 4.66675 11.3333 4.66675ZM7.33334 10.0001H4.66668C3.56668 10.0001 2.66668 9.10008 2.66668 8.00008C2.66668 6.90008 3.56668 6.00008 4.66668 6.00008H7.33334V4.66675H4.66668C2.82668 4.66675 1.33334 6.16008 1.33334 8.00008C1.33334 9.84008 2.82668 11.3334 4.66668 11.3334H7.33334V10.0001ZM5.33334 7.33341H10.6667V8.66675H5.33334V7.33341Z" fill="#2F9446" />
                          </svg>
                          Linked with CAMSfinserv
                        </label>
                      </div>
                    )
                    : (
                      <> </>

                    )}


                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      }
      <FixBottomDrawer
        list={list}
        confirm={confirm}
        setConfirm={setConfirm}
        type={'reject'}
        bankNameList={list[0].FIPNAME}
        fipid={fipid}
        sentvalue={0}
        BankFlag={showflag}
        pan={pan}
      />
    </>
  )
}
