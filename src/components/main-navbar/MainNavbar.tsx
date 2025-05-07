import React from 'react';
import { Navbar, Nav, Container, Spinner } from 'react-bootstrap';

import './MainNavbar.css';
import { useSpotifyAuth } from '../../providers/SpotifyAuthProvider';

const RenderAuthSection: React.FC = () => {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL;
    const loginUrl = `${backendUrl}/auth/login`;

    const { isLoading, isAuthenticated, user, error } = useSpotifyAuth();

    if (isLoading || error) {
        return <Spinner animation='border' className='me-2' />;
    }

    if (!isAuthenticated) {
        return (
            <Nav>
                <Nav.Link className='main-navbar-link' href={loginUrl}>Login</Nav.Link>
            </Nav>
        );
    }

    return <div>{user!.name}</div>;
};

const MainNavbar: React.FC = () => {
    return (
        <Navbar className='main-navbar' sticky='top'>
            <Container fluid>
                <Nav>
                    <Nav.Link className='main-navbar-link' href='/'>Home</Nav.Link>
                </Nav>
            </Container>
            <Container fluid className='main-navbar-right-aligned'>
                <RenderAuthSection />
            </Container>
        </Navbar>
    );
};

export default MainNavbar;