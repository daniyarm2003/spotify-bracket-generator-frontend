import React from 'react';
import './MainPage.css';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';

const MainPage: React.FC = () => {
    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />

            <div className='default-page-content-container'>
                <h2>Welcome to Spotify Bracket Builder!</h2>
                <p>
                    Start creating your music brackets by selecting options from the navbar above.
                </p>
            </div>
        </div>
    );
};

export default MainPage;