import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Loader from "./components/layout/Loader";
import ErrorBoundary from "./components/layout/ErrorBoundary";
const Home = lazy(() => import("./pages/Home"));
import useLocationStore from "./stores/locationStore";
import Nav from "./components/layout/Nav";
import DoctorType from "./pages/DoctorType";
import Page4 from "./pages/page_4";
import Page3 from "./pages/Page3";
import DoctorProfile from "./pages/DoctorProfile";
import UserProfile from "./pages/UserProfile";
import DoctorEdit from "./pages/DoctorEdit";
import UserEdit from "./pages/UserEdit";
import Signup from "./pages/auth/Signup";
import Otp from "./pages/auth/Otp";
import AboutPersona from "./pages/auth/AboutPersona";
import LocationInfo from "./pages/auth/LocationInfo";
import PersonalDetails from "./pages/auth/PersonalDetails";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SearchResults from "./pages/SearchResults";
import SearchDoctors from "./pages/SearchDoctors";
import SearchHospitals from "./pages/SearchHospitals";
import SearchClinics from "./pages/SearchClinics";
import TermsAndConditions from "./pages/TermsAndConditions";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Developers from "./pages/Developers";
import Privacy from "./pages/Privacy";
import PCITerms from "./pages/PCITerms";
import Directory from "./pages/Directory";

// Admin imports
import AdminRoute from "./components/admin/AdminRoute";
import AdminHome from "./pages/admin/Home";

import AdminLogin from "./pages/admin/Login";
import AdminUsers from "./pages/admin/AdminUser";
import AdminDoctors from "./pages/admin/AdminDoctor";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminNews from "./pages/admin/AdminBlogs";
import AdminBlogs from "./pages/admin/AdminBlogs";
import ScrollToTop from "./utils/scrollOnTop";
// import NewsManagement from './pages/admin/NewsManagement'
// import BlogsManagement from './pages/admin/BlogsManagement'

function AppShell() {
  const location = useLocation();
  const hideNav =
    location.pathname.toLowerCase().includes("profile") ||
    location.pathname.toLowerCase().includes("doctor/edit") ||
    location.pathname.toLowerCase().includes("auth") ||
    location.pathname.toLowerCase().includes("login") ||
    location.pathname.toLowerCase().includes("admin");

  const initializeLocation = useLocationStore(
    (state) => state.initializeLocation
  );

  useEffect(() => {
    console.log("🚀 App started - initializing location...");
    initializeLocation();
  }, [initializeLocation]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      {!hideNav && <Nav />}
      <div className="App">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/x" element={<DoctorType />} />
            <Route path="/doctor-mapped" element={<Page4 />} />
            <Route path="/categories" element={<Page3 />} />
            <Route path="/Doctor-profile" element={<DoctorProfile />} />
            <Route
              path="/Doctor-profile/:doctorId"
              element={<DoctorProfile />}
            />
            {/* SEO Optimized Doctor Profile Route */}
            <Route
              path="/:location/doctor/:doctorSlug"
              element={<DoctorProfile />}
            />
            <Route path="/doctor/edit" element={<DoctorEdit />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-edit" element={<UserEdit />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/otp" element={<Otp />} />
            <Route path="/auth/about" element={<AboutPersona />} />
            <Route path="/auth/location" element={<LocationInfo />} />
            <Route path="/auth/personal" element={<PersonalDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/search-doctors" element={<SearchDoctors />} />
            <Route path="/search-hospitals" element={<SearchHospitals />} />
            <Route path="/search-clinics" element={<SearchClinics />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/pci-terms" element={<PCITerms />} />
            <Route path="/directory" element={<Directory />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="blogs" element={<AdminBlogs />} />
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
