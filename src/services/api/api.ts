export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const UseApi = async (method: string = 'GET', name: string, payload: string) => {
  // const domain = location.hostname
  const requestOptions = {
    method,
    body: payload
  }
  const response = await fetch(`${API_BASE_URL}/api/aa/WPortalapiV1/${name}`, requestOptions)
  return await response.json()
}
