import { BrowserRouter, Route, Routes } from 'react-router';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/main/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
