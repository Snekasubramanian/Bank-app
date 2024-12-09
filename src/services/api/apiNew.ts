import Decrypt from '../decrypt'
import Encrypt from '../encrypt'

export const UseApi = async (
  name: string,
  payload: any,
  method: string = 'GET'
) => {
  // const domain = location.hostname
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'text/plain')
  const requestOptions = {
    method,
    headers: myHeaders,
    body: Encrypt('Encrypt', JSON.stringify(payload))

  }
  const response = await fetch(
    `https://uat.camsfinserv.com/api/aa/WPortalapiV1/${name}`,
    requestOptions
  )
    .then(async (response) => await response.json())
    .then((result) => {
      const encryptedResponse = result
      console.log(encryptedResponse)
      return Decrypt('Decrypt', encryptedResponse)
    })
    .catch((error) => {
      console.log('error', error)
    })
  return response
}
