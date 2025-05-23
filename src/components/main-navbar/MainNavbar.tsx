import React from 'react';
import { Navbar, Nav, Container, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router';

import './MainNavbar.css';
import { useSpotifyAuth } from '../../providers/SpotifyAuthProvider';
import MainNavbarProfileDisplay from './MainNavbarProfileDisplay';
import { useServerApi } from '../../providers/ServerApiProvider';
import SpotifyAuthApi from '../api/SpotifyAuthApi';

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

    return <MainNavbarProfileDisplay user={user!} />;
};

const MainNavbar: React.FC = () => {
    const { isLoading, isAuthenticated } = useSpotifyAuth();
    const showUserLinks = !isLoading && isAuthenticated;

    const navigate = useNavigate();

    const serverApi = useServerApi();
    const spotifyAuthApi = new SpotifyAuthApi(serverApi);

    const handleLogout = async () => {
        try {
            const { cookieCleared } = await spotifyAuthApi.logout();

            if(cookieCleared) {
                navigate('/');
                navigate(0);
            }
            else {
                console.error('Error clearing cookie');
            }
        }
        catch(err) {
            console.error('Error logging out:', err);
        }
    }

    return (
        <Navbar className='main-navbar' sticky='top'>
            <Container fluid>
                <Nav>
                    <Nav.Link as={Link} className='main-navbar-link' to='/'>Home</Nav.Link>
                    {
                        showUserLinks && (
                            <>
                                <Nav.Link as={Link} className='main-navbar-link' to='/tournaments'>Tournaments</Nav.Link>
                                <Nav.Link as={'button'} className='main-navbar-link' onClick={() => handleLogout()}>Log Out</Nav.Link>
                            </>
                        )
                    }
                </Nav>
            </Container>
            <Container fluid className='main-navbar-right-aligned'>
                <RenderAuthSection />
            </Container>
        </Navbar>
    );
};

export default MainNavbar;