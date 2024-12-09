import shajs from 'sha.js'
import * as CryptoJS from 'crypto-js'

// const Encryptionkey = "aGgRTenEUgoACtcOAr";
const Decryptionkey = 'AecECroRUgnGTa'

let hashstring = ''
let hashsubstring = ''
// let Encrypted = "";
// let Dencrypted:any = "";
const iv = CryptoJS.enc.Utf8.parse('globalaesvectors')

export default function Decrypt (Mode: any, InutString: any): ReturnType<React.FC> {
  let Dencrypted: any
  hashstring = shajs('sha256').update(Decryptionkey).digest('hex')
  hashsubstring = hashstring.substring(0, 32)
  const Enckey = CryptoJS.enc.Utf8.parse(hashsubstring)
  if (Mode === 'Decrypt') {
    let Dencryptedinput = InutString.split('-').join('+')
    Dencryptedinput = Dencryptedinput.split('_').join('/')
    Dencrypted = CryptoJS.AES.decrypt(Dencryptedinput, Enckey, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  }
  Dencrypted = Dencrypted.toString(CryptoJS.enc.Utf8)
  // console.log('utf8 = ' + Dencrypted)

  return JSON.parse(Dencrypted)
}
