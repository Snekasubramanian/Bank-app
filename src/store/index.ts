import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { rootReducer } from './reducers';

// const isSitEnv = !(import.meta.env.MODE === 'prod' || import.meta.env.MODE === 'uat');

// Enable Redux Dev tools only for SIT
const composeEnhancers =
  ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
