import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/layout/Loader';
import ErrorBoundary from './components/layout/ErrorBoundary';
const Home = lazy(() => import('./pages/Home'));
import useLocationStore from './stores/locationStore';
import Nav from './components/layout/Nav';
import DoctorType from './pages/DoctorType';
import Page4 from './pages/page_4';
import Page3 from './pages/Page3'
import DoctorProfile from './pages/DoctorProfile'
import UserProfile from './pages/UserProfile'
import DoctorEdit from './pages/DoctorEdit'
import UserEdit from './pages/UserEdit'
import Signup from './pages/auth/Signup'
import Otp from './pages/auth/Otp'
import AboutPersona from './pages/auth/AboutPersona'
import LocationInfo from './pages/auth/LocationInfo'
import PersonalDetails from './pages/auth/PersonalDetails'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

// Admin imports
import AdminRoute from './components/admin/AdminRoute'
import Dashboard from './pages/admin/Dashboard'
import AdminHome from './pages/admin/Home'
import Users from './pages/admin/Users'
import Doctors from './pages/admin/Doctors'
import Appointments from './pages/admin/Appointments'
import AdminLogin from './pages/admin/Login'
// import NewsManagement from './pages/admin/NewsManagement'
// import BlogsManagement from './pages/admin/BlogsManagement'


function AppShell() {
  const location = useLocation();
  const hideNav = location.pathname.toLowerCase().includes('profile') || 
                  location.pathname.toLowerCase().includes('doctor/edit') ||
                  location.pathname.toLowerCase().includes('auth') ||
                  location.pathname.toLowerCase().includes('login') ||
                  location.pathname.toLowerCase().includes('admin');
  
  const initializeLocation = useLocationStore((state) => state.initializeLocation);

  useEffect(() => {
    console.log('🚀 App started - initializing location...');
    initializeLocation();
  }, [initializeLocation]);

  return (
    <ErrorBoundary>
      {!hideNav && <Nav/>}
      <div className="App">
        <Suspense fallback={<Loader />}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/x" element={<DoctorType />} />
            <Route path="/doctor-mapped" element={<Page4 />} />
            <Route path='/page-3' element={<Page3/>}/>
            <Route path='/Doctor-profile' element={<DoctorProfile/>}/>
            <Route path='/Doctor-profile/:doctorId' element={<DoctorProfile/>}/>
            <Route path='/doctor/edit' element={<DoctorEdit/>}/>
            <Route path='/user-profile' element={<UserProfile/>}/>
            <Route path='/user-edit' element={<UserEdit/>}/>
            <Route path='/auth/signup' element={<Signup/>}/>
            <Route path='/auth/otp' element={<Otp/>}/>
            <Route path='/auth/about' element={<AboutPersona/>}/>
            <Route path='/auth/location' element={<LocationInfo/>}/>
            <Route path='/auth/personal' element={<PersonalDetails/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/auth/forgot-password' element={<ForgotPassword/>}/>
            
            {/* Admin Routes */}
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin' element={<AdminRoute />}>
              <Route index element={<AdminHome />} />
              <Route path='users' element={<Users />} />
              <Route path='doctors' element={<Doctors />} />
              <Route path='appointments' element={<Appointments />} />
              {/* <Route path='news' element={<NewsManagement />} /> */}
              {/* <Route path='blogs' element={<BlogsManagement />} /> */}
            </Route>
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
