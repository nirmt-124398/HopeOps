import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import AnimalList from "./pages/AnimalList";
import AnimalDetails from "./pages/AnimalDetails";
import AdoptionForm from "./pages/AdoptionForm";
import IncidentReporting from "./pages/IncidentReporting";
import Donation from "./pages/Donation";
import PaymentForm from "./pages/PaymentForm";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile"; 
import { AuthProvider } from "./context/AuthContext";
import { AnimalsProvider } from "./context/AnimalsContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/ngoAdmin/Dashboard";
import RescueOperations from "./pages/ngoAdmin/RescueOperations";
import RescueAvailable from "./pages/ngoAdmin/RescueAvailable";
import RescueOngoing from "./pages/ngoAdmin/RescueOngoing";
import RescueCompleted from "./pages/ngoAdmin/RescueCompleted";
import { rescueAvailableLoader } from "./loaders/rescueAvailableLoader";
import { rescueOngoingLoader } from "./loaders/rescueOngoingLoader";
import { rescueCompletedLoader } from "./loaders/rescueCompletedLoader";
import SubscriptionPlans from "./components/SubscriptionPlans";
import CreateNGO from "./components/CreateNGO";
import UserAdoptionRequests from "./pages/UserAdoptionRequests";
import UserDonationsPage from "./pages/UserDonationsPage";
import Developers from "./pages/Developers";
import { useGTMTracking } from "./hooks/useGTMTracking";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimalsProvider>
          {" "}
          {/* Add AnimalsProvider here */}
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AnimatePresence exitBeforeEnter>
                <RoutesWrapper />
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </AnimalsProvider>
      </AuthProvider>
    </Router>
  );
}

const RoutesWrapper = () => {
  const location = useLocation();
  // Initialize GTM tracking - this will automatically track page views
  useGTMTracking();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageWrapper>
            <Home />
          </PageWrapper>
        }
      />
      <Route
        path="/animals"
        element={
          <PageWrapper>
            <AnimalList />
          </PageWrapper>
        }
      />
      <Route
        path="/developer"
        element={
          <PageWrapper>
            <Developers />
          </PageWrapper>
        }
      />
      <Route
        path="/animals/:id"
        element={
          <PageWrapper>
            <AnimalDetails />
          </PageWrapper>
        }
      />
      <Route
        path="/animal/:id"
        element={
          <PageWrapper>
            <AnimalDetails />
          </PageWrapper>
        }
      />
      <Route
        path="/adopt"
        element={
          <PageWrapper>
            <AdoptionForm />
          </PageWrapper>
        }
      />
      <Route
        path="/report-incident"
        element={
          <PageWrapper>
            <IncidentReporting />
          </PageWrapper>
        }
      />
      <Route
        path="/donate"
        element={
          <PageWrapper>
            <Donation />
          </PageWrapper>
        }
      />
      <Route
        path="/payment"
        element={
          <PageWrapper>
            <PaymentForm />
          </PageWrapper>
        }
      />
      <Route
        path="/login"
        element={
          <PageWrapper>
            <Login />
          </PageWrapper>
        }
      />
      <Route
        path="/signup"
        element={
          <PageWrapper>
            <Signup />
          </PageWrapper>
        }
      />
      <Route
        path="/admin/*"
        element={
          <PageWrapper>
            <AdminDashboard />
          </PageWrapper>
        }
      />
      <Route
        path="/profile"
        element={
          <PageWrapper>
            <Profile />
          </PageWrapper>
        }
      />
      <Route
        path="/ngo-admin"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo-admin/rescue-operations"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <RescueOperations />
            </PageWrapper>
          </ProtectedRoute>
        }
      >
        <Route
          path="available"
          element={<RescueAvailable />}
          loader={rescueAvailableLoader}
        />
        <Route
          path="ongoing"
          element={<RescueOngoing />}
          loader={rescueOngoingLoader}
        />
        <Route
          path="completed"
          element={<RescueCompleted />}
          loader={rescueCompletedLoader}
        />
      </Route>
      <Route
        path="/subscription-plans"
        element={
          <PageWrapper>
            <SubscriptionPlans />
          </PageWrapper>
        }
      />
      <Route
        path="/create-ngo"
        element={
            <PageWrapper>
              <CreateNGO />
            </PageWrapper>
        }
      />
      <Route
        path="/my-adoptions"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <UserAdoptionRequests />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-donations"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <UserDonationsPage />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
