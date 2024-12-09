import { combineReducers } from 'redux';

import { BankState } from '../types/bankListType';
import bankListReducer from './bankListReducer';

export interface RootStateType {
  bank: BankState;
}

export const rootReducer = combineReducers({
  bank: bankListReducer
});

export type RootState = ReturnType<typeof rootReducer>;
