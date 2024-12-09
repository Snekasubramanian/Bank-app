import { atom } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

export const UUID = atom({
  key: 'UUID',
  default: uuidv4()
})

export const XORDecryptRes = atom({
  key: 'XORDecryptRes',
  default: {}
})

export const ResgisterNum = atom({
  key:'ResgisterNum',
  default:{}
})

export const CurrentFip = atom({
  key: 'CurrentFip',
  default: {}
})
export const FiDetails = atom({
  key: 'FiDetails',
  default: {}
})
export const discoveredData = atom({
  key: 'discoveredData',
  default: {}
})
export const FIPDetailsList = atom({
  key: 'FIPDetailsList',
  default: []
})
export const bankList = atom({
  key: 'bankList',
  default: []
})
export const refNumber = atom({
  key: 'refNumber',
  default: {}
})
export const redirectUrl = atom({
  key: 'redirectUrl',
  default: ''
})

export const imgUrl = atom({
  key: 'imgUrl',
  default: ''
})

export const nolinkedAccount = atom({
  key: 'nolinkedAccount',
  default:''
})

export const LinkedMobileNum = atom({
  key: 'LinkedMobileNum',
  default: ''
})
export const AlreadyLinkedMobileNum = atom({
  key: 'AlreadyLinkedMobileNum',
  default: ''
})

export const ModifyFipNum = atom({
  key: 'ModifyFipNum',
  default: ''
})
