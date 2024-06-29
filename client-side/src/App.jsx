import { useState } from "react";
import {BrowserRouter , Routes, Route} from "react-router-dom"
import Home from "./pages/Home.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import NoPage from "./pages/NoPage.jsx"
import { auth } from "./firebase.js";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [userName , setUsername] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
      } else setUsername("");
    });
  }, []);
  return (

    <>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/ContactUs" element={<ContactUs />}/>
        <Route path="/About" element={<About />}/>
        <Route path="/SignIn" element={<SignIn />}/>
        <Route path="/SignUp" element={<SignUp />}/>
        <Route path="/reset" element={<ForgotPassword />}/>
        <Route path="*" element={<NoPage />}/>
      </Routes>
    </BrowserRouter>
      
    </>
  );
}

export default App;