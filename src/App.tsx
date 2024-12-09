import React, { useEffect } from 'react'
import './fonts/AvenirNext-Regular.otf'
import './fonts/BasierCircle-Regular.ttf'
import './App.css'
import { imgUrl as imgUrlAtom } from './services/recoil-states/atom'
import { useRecoilState } from 'recoil'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/Routes'
import blender from './pages/blender'

const App: React.FC = () => {
  const [image, setImage] = useRecoilState<any>(imgUrlAtom)
const readJsonFileFromAzureStorage = async () => {
    try {
        // Replace your Azure Storage URL here
        const azureStorageUrl = 'https://camsdata.blob.core.windows.net/jsondata/dummydata1.json';
          const response = await fetch(azureStorageUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch JSON file');
          }
          
          let r:any = document.querySelector(':root');
          let link:any = document.getElementById('dynamicStylesheet');
          const jsonContent = await response.text();
          const jsonData = JSON.parse(jsonContent);
          Object.keys(jsonData).forEach((style) => {
            if (style === 'FIU_Logo'){
              setImage(jsonData.FIU_Logo)
            } else if (style === 'Heading_font') {
              r.style.setProperty(`--${style}`, jsonData[style]);
              link.href = `https://fonts.googleapis.com/css2?family=${jsonData[style]}:wght@100;200;300;400;500;600;700;800;900&display=swap`
            } else {
              r.style.setProperty(`--${style}`, jsonData[style]);
            }
          })      
          return jsonData;
        } catch (error) {
          console.error('Error reading JSON file from Azure Storage:', error);
          throw error;
        }
      }

  useEffect(() => {
    let r:any = document.querySelector(':root');
    r.style.setProperty(`--Brand`, "#1684FB");
    r.style.setProperty(`--Primary-50`, blender('#ffffff', '#1684FB', 9));
    r.style.setProperty(`--Primary-100`, blender('#ffffff', '#1684FB', 31));
    r.style.setProperty(`--Primary-200`, blender('#ffffff', '#1684FB', 46));
    r.style.setProperty(`--Primary-300`, blender('#ffffff', '#1684FB', 67));
    r.style.setProperty(`--Primary-400`, blender('#ffffff', '#1684FB', 80));
    r.style.setProperty(`--Primary-500`, blender('#ffffff', '#1684FB', 100));
    r.style.setProperty(`--Primary-600`, blender('#000000', '#1684FB', 91));
    r.style.setProperty(`--Primary-700`, blender('#000000', '#1684FB', 71));
    r.style.setProperty(`--Primary-800`, blender('#000000', '#1684FB', 55));
    r.style.setProperty(`--Primary-900`, blender('#000000', '#1684FB', 42));

    // readJsonFileFromAzureStorage();
  },[])
  return <RouterProvider router={router} />
}

export default App
