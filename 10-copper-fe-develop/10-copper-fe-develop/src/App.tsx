import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Confirmation from "./pages/Confirmation";

function App() {
  return (
    <div>
      <nav></nav>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/confirm" element={<Confirmation />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/reset-password" element={<ResetPasswordPage/>}/>
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
