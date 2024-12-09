import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  AppBar,
  Box,
  CardMedia,
  Grid,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import arrow_back from '../../assets/images/arrow_back.svg'
import close from '../../assets/images/close.svg'
import dummylogo from '../../assets/images/dummylogo.svg'

import { useRecoilState } from 'recoil'
import {
  XORDecryptRes as XORDecryptResAtom
} from '../../services/recoil-states/atom'

export default function Header({ label,clearSession }: any) {
  const location = useLocation();
  const [XORDecryptRes, setXORDecryptRes] = useRecoilState<any>(XORDecryptResAtom)
  const navigate = useNavigate();
  const [reject, setReject] = useState(false);
  const [loader, setLoader] = useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: ''
  })

  return (
    <Grid item xs={12}>
      <AppBar
        sx={{
          boxShadow: 'none',
          backgroundColor: 'var(--Background_color)'
        }}
      >
        <Box
          sx={{
            height: '56px',
            backgroundColor: 'var(--Background_color)',
            borderBottom: '1px solid #F5F5F5'
          }}
        >
            <Box
              sx={{
                width: '100%',
                height:'56px',
                display: 'flex',
                padding:'13px 16px 13px 16px',
                alignItems: 'center'
              }}
            >
               <Box sx={{width: '10%'}}>
                <CardMedia 
                 component="img"
                 src={arrow_back}
                 alt="icon"
                 sx={{ maxHeight: '24px', width: '24px', display: 'inline' }}
                />
                </Box>
              <Box
                sx={{
                 width: '80%',
                 margin: 'auto',
                 display: 'flex'
                }}
              >
                <CardMedia
                 component="img"
                 image={
                  // XORDecryptRes?.logo ?  XORDecryptRes.logo : 
                  dummylogo
                 }
                alt="logo"
                sx={{ maxHeight: '35px', width: '115.5px', display: 'inline',margin: 'auto' }}
                 />  
              </Box>
              <Box sx={{ width: '10%',float: 'right' }}>
              <CardMedia 
                 component="img"
                 src={close}
                 alt="icon"
                 sx={{ maxHeight: '24px', width: '24px', display: 'inline' }}
                />
              </Box>
            </Box>
          </Box>
      </AppBar>
    </Grid>
  );
}
