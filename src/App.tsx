import { BrowserRouter, Route, Routes } from 'react-router';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/main/MainPage';
import TournamentsPage from './pages/tournaments/TournamentsPage';
import AuthRedirect from './components/auth-redirect/AuthRedirect';
import NotFoundPage from './pages/not-found/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tournaments" element={<AuthRedirect>
          <TournamentsPage />
        </AuthRedirect>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
