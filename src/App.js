import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { useEffect } from 'react';
import Camera from "./components/Camera";
import Gallery from "./components/Gallery";

function App() {

  useEffect(() => {
    Notification.requestPermission()
  },[])

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<Camera />} />
        <Route path='/gallery' element={<Gallery />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
