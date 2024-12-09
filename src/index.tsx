import React from 'react'
import reportWebVitals from './reportWebVitals'
import { RecoilRoot } from 'recoil'
import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <RecoilRoot>
      <App></App>
    </RecoilRoot>
    </Provider>
  // </React.StrictMode>
)
reportWebVitals()
