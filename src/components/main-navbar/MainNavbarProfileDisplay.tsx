import React from 'react';
import { User } from '../../api/types';
import { Container } from 'react-bootstrap';

interface MainNavbarProfileDisplayProps {
    user: User;
}

const MainNavbarProfileDisplay: React.FC<MainNavbarProfileDisplayProps> = ({ user }: MainNavbarProfileDisplayProps) => {
    return (
        <Container className='main-navbar-profile-display'>
            <div className='main-navbar-profile-text profile-name'>{user.name}</div>
            <div className='main-navbar-profile-text profile-email'>{user.email}</div>
        </Container>
    )
};

export default MainNavbarProfileDisplay;