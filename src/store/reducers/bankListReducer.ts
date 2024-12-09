import { AnyAction } from 'redux';

import {
  BANK_LIST,
  BankState,
  DISCOVER_REPONSE,
  SELECT_ACCOUNT,
  UPDATE_DISCOVER_REPONSE,
  NO_ACCOUNTS_LIST,
  CONSENT_DETAILS,
  CHOOSE_BANK_LIST,
  UPDATE_CHOOSE_BANK,
  CLICK_OTP_VALUE,
  LINKEDMOBILENUMBERS,
  FixFIPNAME,
  MULTI_CONSERN,
  MULTI_CONSENT_ARRAY,
  ERROR_VALUE,
  MOBILE_ERROR_VALUE,
  TRY_AGAIN_COUNT,
  FI_TYPES,
  FI_CATEGORY,
  UPDATE_Loader,
  Active_FI_CATEGORY,
  REQUIRED,
  MultiFicloser,
  GSTFlag,
  ConsentWithFIP
} from '../types/bankListType';

const initialState: BankState = {
  discoverBankResponse:[],
  NewdiscoverBankResponse:{},
  accountnotfoundResponse: [],
  consentDetails: null,
  choosebanklist:[],
  clickCount: null,
  LinkMobileNumber:[],
  FixFIPNAME:"",
  dynData : null,
  consentData : [],
  errorCount: null,
  mobileErrorCount : null,
  TryAgainCount: 0,  
  FITypes: null,
  ActiveFICategory: null,
  FICategory: null,
  BANK : [],
  MF : [],
  NPS : [],
  EQUITIES : [],
  INSURANCE_POLICIES : [],
  GSTR : [],
  RequiredValue:null,
  closer:null,
  gstflag:null,
  consentFIP:null
};

export default function bankListReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    
    case DISCOVER_REPONSE:{
      return { ...state,discoverBankResponse:action.body.map((acc: any) => (acc = { ...acc, isChecked: acc.FITYPE === "Not_found" ? false : true })) };
    }

    case NO_ACCOUNTS_LIST: {
      return{
        ...state,accountnotfoundResponse: action.body
      }
    }

    case SELECT_ACCOUNT: {
      const { selectedAccount } = action.body;
      const accounts = state.discoverBankResponse;
      const isChecked = accounts && accounts.find((acc: any) => acc.FIPACCREFNUM === selectedAccount.FIPACCREFNUM)?.isChecked;
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.FIPACCREFNUM === selectedAccount.FIPACCREFNUM) {
          return { ...acc, isChecked: !isChecked };
        }
        return acc;
      });
      return { ...state, discoverBankResponse: updatedAccounts };
    }

    case CONSENT_DETAILS:{
      return{
        ...state,consentDetails: action.body
      }
    }

    case UPDATE_DISCOVER_REPONSE:{
      return { ...state,discoverBankResponse:action.body };
    }

    case CHOOSE_BANK_LIST :{
      return { ...state,choosebanklist:action.body.map((acc: any) => (acc = { ...acc, isChecked: false })) };
    }

    case CLICK_OTP_VALUE:{
      return{
        ...state,
        clickCount: action.body
      }
    }

    case ERROR_VALUE : {
      return{
        ...state,
        errorCount: action.body
      }
    }

    case MOBILE_ERROR_VALUE : {
      return{
        ...state,
        mobileErrorCount : action.body
      }
    }

    case UPDATE_CHOOSE_BANK: {
      const { selectedAccount } = action.body;
      const accounts = state.choosebanklist;
      const isChecked = accounts && accounts.find((acc: any) => acc.FIPNAME === selectedAccount)?.isChecked;
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.FIPNAME === selectedAccount) {
          return { ...acc, isChecked: !isChecked };
        }
        return acc;
      });
      return { ...state, choosebanklist: updatedAccounts };
    }

    case UPDATE_Loader: {
      const { selectedAccount } = action.body;
      const accounts = state.discoverBankResponse;
      const isChecked = accounts && accounts.find((acc: any) => acc.FIPNAME === selectedAccount)?.PartialLoader;
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.FIPNAME === selectedAccount) {
          return { ...acc, PartialLoader: !isChecked };
        }
        return acc;
      });
      return { ...state, discoverBankResponse: updatedAccounts };
    }

    case LINKEDMOBILENUMBERS: {
      return{
        ...state,
        LinkMobileNumber:action.body
      }
    }

    case FixFIPNAME:{
      return{
      ...state,
      FixFIPNAME:action.body
      }
    }

    case MULTI_CONSERN: {
      return{
        ...state,
        dynData: action.body.dynData
      }
    }

    case MULTI_CONSENT_ARRAY: {
      return{
        ...state,
        consentData: action.body.consentData
      }
    }

    case TRY_AGAIN_COUNT: {
      return{
        ...state,
        TryAgainCount: action.body + 1
      }
    }

    case FI_TYPES: {
      return{
        ...state,
        FITypes: action.body
      }
    }

    case FI_CATEGORY: {
      return{
        ...state,
        FICategory: action.body
      }
    }

    case Active_FI_CATEGORY: {
      return{
        ...state,
        ActiveFICategory: action.body
      }
    }

    case "BANK": {
      return{
        ...state,
        BANK: action.body
      }
    }
    
    case "MF": {
      return{
        ...state,
        MF: action.body
      }
    }

    case "NPS": {
      return{
        ...state,
        NPS: action.body
      }
    }

    case "EQUITIES": {
      return{
        ...state,
        EQUITIES: action.body
      }
    }

    case "INSURANCE_POLICIES": {
      return{
        ...state,
        INSURANCE_POLICIES: action.body
      }
    }

    case "GSTR": {
      return{
        ...state,
        GSTR: action.body
      }
    }


    case REQUIRED: {
      return{
        ...state,
        RequiredValue: action.body
      }
    }

    
    case MultiFicloser: {
      return{
        ...state,
        closer: action.body
      }
    }

    case GSTFlag : {
      return{
        ...state,
        gstflag: action.body
      }
    }
    case ConsentWithFIP : {
      return{
        ...state, consentFIP :action.body
      }
    }
    default: {
      return state;
    }
  }
}
