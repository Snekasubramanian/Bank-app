import React from 'react'
import camsLogo from '../../assets/images/index'
export default function Footer (): ReturnType<React.FC> {
  return (
    <div className='footer_main'>
      <p className="footer_text">Powered by RBI regulated Account Aggregator
      </p>
      <img className='footer_image' src={camsLogo.camsLogo}></img>
    </div>
  )
}
