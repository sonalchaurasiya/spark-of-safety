import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import FeaturesPage from './pages/FeaturesPage';
import SettingPage from './pages/SettingPage';
import Footer from './components/Footer'; 
import ContactPage from './pages/ContactPage';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route path='/login' element={<Login />} />
          <Route index element={<HomePage />} />
          <Route path='/features' element={<FeaturesPage />} />
          <Route path='/settings' element={<SettingPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
      <Footer />  
    </Router>
  );
} 

export default App;
