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

// Add smooth scrolling
const styles = {
  body: {
    scrollBehavior: "smooth",
  },
};

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
        path="/animals/:id"
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
