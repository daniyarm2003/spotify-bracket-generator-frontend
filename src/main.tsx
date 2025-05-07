import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TopLevelProviderWrapper from './providers/TopLevelProviderWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TopLevelProviderWrapper>
      <App />
    </TopLevelProviderWrapper>
  </StrictMode>,
);
