import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Foodspot from './pages/Foodspot';
// import Header from './components/Header';
import Error from './pages/Error';
// import Footer from './components/Footer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Header />}> */}
          <Route index element={<Home />} />
          <Route path="/foodspot/*" element={<Foodspot />} />
          <Route path="*" element={<Error />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
