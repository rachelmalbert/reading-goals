import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks";
import { UserProvider } from "./context/UserContext";
import "./App.css";

// import pages
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import BookshelfPage from "./pages/BookshelfPage";
import SearchPage from "./pages/SearchPage";

// import top nav
import TopNav from "./components/Navbar";

const queryClient = new QueryClient();

function NotFound() {
  return <h1>404: not found</h1>;
}

function Main() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return (
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bookshelf" element={<BookshelfPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <div className="layout">
              <TopNav></TopNav>
              <Main></Main>
            </div>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
