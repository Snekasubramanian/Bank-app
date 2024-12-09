
export const BANK_LIST = 'BANK_LIST';
export const ADD_NEW_NUMBER = 'ADD_NEW_NUMBER';
export const SELECT_ACCOUNT = 'SELECT_ACCOUNT';
export const DISCOVER_REQUEST = 'DISCOVER_REQUEST';
export const DISCOVER_REPONSE = 'DISCOVER_REPONSE';
export const UPDATE_DISCOVER_REPONSE = 'UPDATE_DISCOVER_REPONSE';
export const DISCOVER_REQUEST_SUCCESS = 'DISCOVER_REQUEST_SUCCESS';

export const ADD_SELECTED_BANK_LIST = 'ADD_SELECTED_BANK_LIST';
export const SET_CONSUMER_DETAILS = 'SET_CONSUMER_DETAILS';
export const REMOVE_SELECTED_BANK_LIST = 'REMOVE_SELECTED_BANK_LIST';

export const LINK_ACCOUNT_SUCCESS = 'LINK_ACCOUNT_SUCCESS';
export const LINK_ACCOUNT_AUTHENTICATE_SUCCESS = 'LINK_ACCOUNT_AUTHENTICATE_SUCCESS';
export const PROVIDE_CONSENT_SUCCESS = 'PROVIDE_CONSENT_SUCCESS';
export const FixFIPNAME = 'FixFIPNAME';
export const ADD_AUTHENTICATED_BANK = 'ADD_AUTHENTICATED_BANK';
export const NO_ACCOUNTS_LIST = 'NO_ACCOUNTS_LIST';
export const CONSENT_DETAILS = 'CONSENT_DETAILS';
export const CHOOSE_BANK_LIST = 'CHOOSE_BANK';
export const UPDATE_CHOOSE_BANK = 'UPDATE_CHOOSE_BANK';
export const CLICK_OTP_VALUE = 'CLICK_OTP_VALUE';
export const LINKEDMOBILENUMBERS = 'LINKEDMOBILENUMBERS';
export const MULTI_CONSERN = 'MULTI_CONSERN';
export const MULTI_CONSENT_ARRAY = 'MULTI_consent_Array';
export const ERROR_VALUE = 'ERROR_VALUE';
export const MOBILE_ERROR_VALUE = 'MOBILE_ERROR_VALUE';
export const TRY_AGAIN_COUNT = 'TRY_AGAIN_COUNT';
export const FI_TYPES = 'FI_Types';
export const FI_CATEGORY = 'FI_CATEGORY';
export const Active_FI_CATEGORY = 'Active_FI_CATEGORY';
export const UPDATE_Loader = 'UPDATE_Loader';
export const REQUIRED = 'REQUIRED';
export const MultiFicloser = 'MultiFicloser';
export const GSTFlag = 'GSTFlag';
export const ConsentWithFIP = 'ConsentWithFIP';

export type BankState = {
  discoverBankResponse:any
  accountnotfoundResponse: any
  NewdiscoverBankResponse: any
  consentDetails: any
  choosebanklist:any
  clickCount: any
  LinkMobileNumber: any
  FixFIPNAME:any
  dynData: any
  consentData: any
  errorCount: any
  mobileErrorCount: any
  TryAgainCount: any
  FITypes: any
  FICategory: any
  ActiveFICategory: any
  BANK :any
  MF : any
  NPS : any
  EQUITIES : any
  INSURANCE_POLICIES : any
  GSTR : any
  RequiredValue: any
  closer: any
  gstflag:any
  consentFIP : any
};
