import React from 'react';
import './MainPage.css';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';

const MainPage: React.FC = () => {
    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />
        </div>
    );
};

export default MainPage;