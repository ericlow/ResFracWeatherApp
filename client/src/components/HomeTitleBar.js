import React from 'react';
import GoogleLogoutButton from './GoogleLogoutButton';
import NavigateButton from './NavigateButton';


const HomeTitleBar = () => {
    return (
            <div className="bg-primary text-white p-3 fixed-top">
            <div className="container d-flex justify-content-between align-items-center">
            <h1 className="m-0">ResFrac Weather</h1>
            <div>
                <NavigateButton className="btn btn-light me-2" path="/settings" label="settings" />
                <GoogleLogoutButton className="btn btn-light"/>

            </div>
            </div>
            </div>
    )};

export default HomeTitleBar
