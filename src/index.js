import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
<<<<<<< Updated upstream
import App from './App';
import reportWebVitals from './reportWebVitals';
=======
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Foodspot from './pages/Foodspot';
import Header from './components/Header';

const queryClient = new QueryClient();
>>>>>>> Stashed changes

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="/foodspot/*" element={<Foodspot />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
