import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import leetcodeimg from "../images/leetcode.png";
import { auth , firestore } from "../firebase.js";
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [username, setUsername] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true); 
        setUsername(user.displayName || 'Anonymous');  
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = (e) => {
    if(confirm("Are you sure you want to logout?")){
      console.log("Logging Out");
    }
    else{
      return;
    }
    e.preventDefault();
    auth.signOut().then(() => {
      console.log("Logged Out");
      toast.success("Logged Out Successfully");
    }).catch(error => {
      toast.error("Error Logging Out");
      console.log(error.message);
    });
  };

  return (
    <>
      <div className="relative w-full bg-slate-700 h-14">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <NavLink to="/home">
            <div className="h-10 w-10 flex items-center">
              <img src={leetcodeimg} alt="logo" className="h-8 w-8" />
              <div className="text-white ml-1 text-md md:text-2xl font-bold">LeetCodeClone</div>  
            </div>
          </NavLink>
          <div className="hidden lg:block">
            <ul className="inline-flex space-x-8 text-white gap-4 cursor-pointer">
              <li className="hover:font-bold">
                <NavLink
                  to="/home"
                  className={({ isActive }) => `text-md ${isActive || location.pathname === '/' ? 'underline' : ''} underline-offset-4`}
                >
                  Home
                </NavLink>
              </li>
              <li className="hover:font-bold">
                <NavLink
                  to="/about"
                  className={({ isActive }) => `text-md ${isActive || location.pathname === '/about' ? 'underline' : ''} underline-offset-4`}
                >
                  About
                </NavLink>
              </li>
              <li className="hover:font-bold">
                <NavLink
                  to="/contactus"
                  className={({ isActive }) => `text-md ${isActive || location.pathname === '/contactus' ? 'underline' : ''} underline-offset-4`}
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="hidden lg:block">
            {isLoggedIn ? (
            <div className='flex gap-3 items-center'>
                <span className='text-white font-mono'>Hi, {username} </span>
                <button
                  type="button"
                  className="border-2 border-red-500 rounded-2xl p-2 bg-red-500 text-white cursor-pointer sm:inline text-sm md:text-md"
                  onClick={logout}
                >
                  LogOut
                </button>
            </div>
            ) : (
              <button
                type="button"
                className="border-2 border-blue-500 rounded-2xl p-2 bg-blue-500 text-white cursor-pointer sm:inline text-sm md:text-md"
              >
                <NavLink to="/signin">
                  <i className="fa-solid fa-user mr-2"></i>
                  Sign in
                </NavLink>
              </button>
            )}
          </div>
          <div className="lg:hidden">
            {isOpen ? (
              <svg
                onClick={toggleDropdown}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 cursor-pointer text-white"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                onClick={toggleDropdown}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 cursor-pointer text-white"
              >
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden bg-slate-700 text-white relative z-10">
            <ul className="flex flex-col space-y-4 p-4">
              <li className="hover:font-bold">
                <NavLink
                  to="/home"
                  className={({ isActive }) => `text-sm ${isActive || location.pathname === '/' ? 'underline' : ''}`}
                >
                  Home
                </NavLink>
              </li>
              <li className="hover:font-bold">
                <NavLink
                  to="/about"
                  className={({ isActive }) => `text-sm ${isActive || location.pathname === '/about' ? 'underline' : ''}`}
                >
                  About
                </NavLink>
              </li>
              <li className="hover:font-bold">
                <NavLink
                  to="/contactus" className="text-sm">Contact Us</NavLink>
              </li>
              <li>
                {isLoggedIn ? (
                  <button
                    type="button"
                    className="border-2 w-full border-red-500 rounded-2xl p-2 bg-red-500 text-white font-bold cursor-pointer text-sm md:text-md"
                    onClick={logout}
                  >
                    LogOut
                  </button>
                ) : (
                  <button
                    type="button"
                    className="border-2 w-full border-blue-500 rounded-2xl p-2 bg-blue-500 text-white font-bold cursor-pointer text-sm md:text-md"
                  >
                    <NavLink to="/signin">
                      <i className="fa-solid fa-user mr-2"></i>
                      Sign in
                    </NavLink>
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;