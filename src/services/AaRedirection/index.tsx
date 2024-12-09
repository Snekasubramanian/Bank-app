import cryptoJs from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import { useRecoilState } from 'recoil';
import {
  XORDecryptRes as XORDecryptResAtom
} from '../recoil-states/atom'
import Encrypt from '../encrypt';


const AAId = 'AA00022222'
export function closeAndRedirect({
  url,
  parentStatusMessage,
  delay = true,
  decrypt
}: {
  url?: string;
  parentStatusMessage?: 'ACCEPTED' | 'REJECTED' | 'N';
  delay?: boolean;
  decrypt?: any;
}) {
  // Send the status to parent window.
  const statusMessageMap = {
    ACCEPTED: 'S',
    REJECTED: 'F',
    N: 'N',
  };

  const statusCode: 'S' | 'F' | 'N' = (statusMessageMap[parentStatusMessage || 'N'] ||
    'N') as 'S' | 'F' | 'N';


  const postMessageParams = {
    status: statusCode,
    txnid: decrypt?.txnid,
    sessionid: decrypt?.sessionId,
  };

  if (window.opener) {
    window.opener.postMessage(postMessageParams, document.referrer);
  }
  async function doClose() {
    if (url && decrypt) {
      const encryptedUrl = await generateEncryptedUrl(url, decrypt, statusCode);
      window.location.replace(encryptedUrl);
    } else {
      if (window.opener) {
        window.close();
      }
    }
  }
  if (delay) {
    setTimeout(doClose, 3000);
  } else {
    doClose();
  }
}

const checkIfURLHasQueryParams = (url: string): boolean => {
  const formattedURL = new URL(url);
  return Boolean(formattedURL.search);
};


async function generateEncryptedUrl(
  url: string,
  decrypt: any,
  statusCode: string,
): Promise<string> {
  const { encryptResponse, reqDate } = await getEncryptedEcRes(url,decrypt, statusCode);
  const constructedURL = `ecres=${
    encryptResponse
  }&resdate=${reqDate}&fi=${Base64.stringify(
    xorEncryptWordArray(String(AAId), String(reqDate)),
  )}`;
  if (checkIfURLHasQueryParams(url)) {
    return `${url}&${constructedURL}`;
  }
  return `${url}?${constructedURL}`;
}

async function getEncryptedEcRes(
  url:any,
  decrypt: any,
  statusString: string,
): Promise<{
  url? : any;
  reqDate: number;
  encryptResponse: any;
}> {

  const ecRequest: any = {
    addfip: decrypt.addfip,
    status: statusString,
    errorCode: statusString === 'S' ? 0 : 1,
    fipid: decrypt.fipid,
    redirect: url,
    sessionid: decrypt.sessionId,
    srcref: decrypt.consentId,
    txnid: decrypt.txnid,
    userid: decrypt.mobileNumber ? decrypt.mobileNumber + '@CAMSAA' : decrypt.userId,
  };
  const ecRequestValue = Object.keys(ecRequest).reduce(
    (currentValue, ecRequestKey, index) => {
      if (index === 0) {
        currentValue += `${ecRequestKey}=${ecRequest[ecRequestKey]}`;
      } else {
        currentValue += `&${ecRequestKey}=${ecRequest[ecRequestKey]}`;
      }
      return currentValue;
    },
    '',
  );
  const reqDate = formatDateNew(new Date());
  const encryptReq: any = {
    fiuid: decrypt.fiuid,
    AAId: AAId,
    ecRequest: ecRequestValue,
    reqDate,
  };
  const encryptResponse = await encryptParameters('POST',encryptReq);
  return { encryptResponse, reqDate };
}

const encryptParameters = async (method: string = 'POST', payload: any) => {
  console.log('payload', payload)
  const requestOptions = {
    method,
    body: Encrypt('Encrypt', JSON.stringify(payload))
  // sendSessionID_login: false,
  // sendUserId: false,
  // sendConsentHandle: false
  }
  const response = await fetch(
    'https://uat.camsfinserv.com/api/aa/WPortalapiV1/AES256_XOR_Encrypt',
    requestOptions
  )

  return await response.json()
}

function formatDateNew(date: Date): number {
  const padStartZero = (len: number, str: string) => {
    return str.padStart(len, '0');
  };
  const day = padStartZero(2, String(date.getDate()));
  const month = padStartZero(2, String(date.getMonth()));
  const year = padStartZero(2, String(date.getFullYear()));
  const hour = padStartZero(2, String(date.getHours()));
  const minutes = padStartZero(2, String(date.getMinutes()));
  const millis = padStartZero(3, String(date.getMilliseconds()));
  return Number(`${day}${month}${year}${hour}${minutes}${millis}`);
}

export function xorEncryptWordArray(data: string, key: string): cryptoJs.lib.WordArray {
  function keyCharAt(key: string, i: number) {
    return key.charCodeAt(Math.floor(i % key.length));
  }
  function byteArrayToWordArray(ba: any) {
    const wa: any[] = [];
    for (let i = 0; i < ba.length; i++) {
      wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
    }
    return cryptoJs.lib.WordArray.create(wa, ba.length);
  }
  const res = data.split('').map(function (c, i) {
    return c.charCodeAt(0) ^ keyCharAt(key, i);
  });
  return byteArrayToWordArray(res);
}

export const differenceInMonths = (dt1: string, dt2: string) => {
  if (!dt1 || !dt2) return '';
  const x = new Date(dt1);
  const y = new Date(dt2);
  if (isNaN(x.getTime() || y.getTime())) return '';

  return y.getMonth() - x.getMonth() + 12 * (y.getFullYear() - x.getFullYear());
};
