import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import useLocationStore from './stores/locationStore';
import Nav from './components/Nav';
import DoctorType from './pages/DoctorType';
import Page4 from './pages/page_4';


function App() {
  const initializeLocation = useLocationStore((state) => state.initializeLocation);

  useEffect(() => {
    console.log('🚀 App started - initializing location...');
    initializeLocation();
  }, [initializeLocation]);

  return (
    <Router>
      <Nav/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/x" element={<DoctorType />} />
          <Route path="/doctor-mapped" element={<Page4 />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
