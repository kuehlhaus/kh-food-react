import React from 'react';
import './index.css';
import Home from './pages/Home';
import Foodspot from './pages/Foodspot';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

let qu = 'q';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={qu} element={<Foodspot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
