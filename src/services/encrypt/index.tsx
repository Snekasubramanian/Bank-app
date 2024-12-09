import shajs from 'sha.js'
import * as CryptoJS from 'crypto-js'

const Encryptionkey = 'aGgRTenEUgoACtcOAr'
// const Decryptionkey = "AecECroRUgnGTa";

let hashstring = ''
let hashsubstring = ''
// let Encrypted = "";
// let Dencrypted = "";
const iv = CryptoJS.enc.Utf8.parse('globalaesvectors')

export default function Encrypt (Mode: any, InputString: any) {
  hashstring = shajs('sha256').update(Encryptionkey).digest('hex')
  hashsubstring = hashstring.substring(0, 32)
  const Enckey = CryptoJS.enc.Utf8.parse(hashsubstring)

  if (Mode === 'Encrypt') {
    let Encrypted: any = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(InputString),
      Enckey,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )
    Encrypted = Encrypted.ciphertext.toString(CryptoJS.enc.Base64)

    Encrypted = Encrypted.split('+').join('-')
    Encrypted = Encrypted.split('/').join('_')
    return Encrypted
  } else if (Mode === 'Decrypt') {
    if (InputString !== null) {
      let Dencryptedinput = InputString.split('-').join('+')
      Dencryptedinput = Dencryptedinput.split('_').join('/')

      let Dencrypted: any = CryptoJS.AES.decrypt(Dencryptedinput, Enckey, {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      console.log('Dencrypted utf8 = ', Dencrypted)
      console.log('utf8 = ', Dencrypted.toString(CryptoJS.enc.Utf8))

      Dencrypted = Dencrypted.toString(CryptoJS.enc.Utf8)
      console.log('stringgg', JSON.stringify(Dencrypted))

      return Dencrypted
    } else {
      return null
    }
  }
}
