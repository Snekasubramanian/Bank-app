import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import VerifyMobileOtp from '../pages/VerifyMobileOtp'
import SuccessState from '../pages/successState'
import MobileNumberInput from '../pages/MobileNumberInput'
import UserBankAccount from '../pages/UserBankAccount'
import images from '../assets/images'
import WarningPage from '../pages/warningPage'
import ChooseBank from '../pages/ChooseBank'
import VerifyBank from '../pages/VerifyBank'
import LoadingPage from '../pages/LoaadingPage'
import LottieLoader from '../pages/LottieLoader'
import SecureConnection from '../pages/SecureConnection'
import AccountNotConnected from '../pages/AccountNotConnected'
import PanNumberInput from '../pages/PanNumberInput'
import SomethingWrong from '../pages/SomethingWrong'
import RemindLater from '../pages/RemindLater'
import Summary from '../pages/Summery'
import MultiFiUserAccount from '../pages/MultiFiUserAccount'
const router = createBrowserRouter([
  {
    path: '/mobileotpverification', // OTP Input Page // Secondary Phone Number Page
    element: <VerifyMobileOtp />
  },
  {
    path: '/MultiFiUserAccount', // Bank OTP Input Page
    element: <MultiFiUserAccount/>
  },
  {
    path: '/choose-bank',
    element: <ChooseBank />
  },
  {
    path: '/userAccount',
    element: <UserBankAccount />
  },
  {
    path: '/entermobilenumber', // Secondary Phone Number Page
    element: <MobileNumberInput />
  },
  {
    path: '/successState',
    element: <SuccessState imageUrl={images.AxisLogo}></SuccessState>
  },
  {
    path: '/warningPage',
    element: <WarningPage />
  },
  {
    path: '/loader',
    element: <WarningPage></WarningPage>
  },
  {
    path: '/lottieLoader',
    element: <LoadingPage></LoadingPage>
  },
  {
    path: '/lottie',
    element: <LottieLoader></LottieLoader>
  },
  {
    path: '*',
    element: <SecureConnection />
  }, // Default Path
  {
    path: '/accountNotConnected',
    element: <AccountNotConnected />
  },
  {
    path: '/PanRequired',
    element: <PanNumberInput />
  },
  {
    path: '/SomethingWrong',
    element: <SomethingWrong />
  },
  {
    path: '/RemindLater',
    element: <RemindLater />

  }, 
  {
    path: '/Summary',
    element: <Summary />
  },
 
])

export default router
