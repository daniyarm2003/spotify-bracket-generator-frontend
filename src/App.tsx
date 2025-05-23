import { BrowserRouter, Route, Routes } from 'react-router';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/main/MainPage';
import TournamentsPage from './pages/tournaments/TournamentsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
