import React from 'react';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';

const NotFoundPage: React.FC = () => {
    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />
            <div className='default-page-content-container'>
                <h2 className='page-heading'>404: This Page Does Not Exist</h2>
                <p className='page-text'>The page you are looking for does not exist. Please check the URL or return to the home page.</p>
            </div>
        </div>
    );
};

export default NotFoundPage;