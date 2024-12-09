import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

interface modalProps {
    handleClose?: React.MouseEventHandler
    OnExit?: React.MouseEventHandler
    isOpen: boolean
    setIsOpen: any
}

export default function VerifyLottie({
    handleClose,
    isOpen,
    setIsOpen
}: // OnExit
    modalProps): ReturnType<React.FC> {


    return (
        <div className="">
            <Modal
                isOpen={isOpen}
                onRequestClose={handleClose}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }

                }}
                className='verify-lotter'
            >
                <div className="cards-link">
                    <div className="verifyBank">
                        <h6>  Link accounts</h6>
                        <div className="loading-title">
                            <div className="paragraph "></div>
                            <div className="paragraph-sub "></div>
                            <div className=" shimmerBG dicover-shimmer"></div>

                        </div>
                        <div className="otp-boxlottie">
                            <div className="otp-lotties">
                                <div className="boxes-otp "></div>
                                <div className="boxes-otp "></div>
                                <div className="boxes-otp "></div>
                                <div className="boxes-otp "></div>
                                <div className="boxes-otp "></div>
                                <div className="boxes-otp "></div>
                            </div>
                            <div className="paragraph-resent "></div>
                            <div className=" shimmerBG dicover-shimmer"></div>
                        </div>
                        <div className="verify-shimmer">
                            <div className="button-lottie  verify-lottie-bottom"></div>
                            <div className=" shimmerBG dicover-shimmer"></div>
                        </div>
                    </div>
                </div>
            </Modal >
        </div>
        // <DenyTracking
        //     isOpen={isModalTrack}
        //     OnExit={onClickDenyTrack}
        //     handleClose={onClickDenyTrack}
        //   ></DenyTracking>
    )
}
