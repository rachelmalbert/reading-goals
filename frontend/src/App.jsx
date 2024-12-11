import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import TopNav from "./components/TopNav";

const queryClient = new QueryClient();

function Main() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return (
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bookshelf" element={<BookshelfPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
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
              {/* <div className="main"> */}
              <Main></Main>
            </div>
            {/* </div> */}
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
