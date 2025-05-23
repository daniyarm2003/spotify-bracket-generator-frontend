import React from 'react';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';

const TournamentsPage: React.FC = () => {
    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />
            <div className='default-page-content-container'>
                <h2 className='page-heading'>My Tournaments</h2>
            </div>
        </div>
    );
}

export default TournamentsPage;