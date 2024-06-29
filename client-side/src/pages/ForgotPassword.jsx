import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import submitButtonDisabled from "./SignIn.jsx";
import handleSubmission from "./SignIn.jsx";
import { toast } from "react-toastify";

function ForgotPassword() {
  const handlereset = () => {
    navigate("/reset");
  };

  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(auth, emailVal)
      .then(() => {
        toast.success("Email sent");
        history("/SignIn");
      })
      .catch((error) => {
        toast.error("Error sending email");
      });
  };
  return (
    
    <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h1 className="text-3xl text-center p-10">RESET PASSWORD</h1>
          <label htmlFor="Email" className="">Enter Your Email</label>
        <form onSubmit={(e) => handleSubmit(e)}>
          
          <div className="pt-4">
            <input
            placeholder="Email"
            name="email"
            className="flex h-10 w-full mt-1 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
          <br />
          <br />
          <div className="flex justify-center items-center">
          <button className="inline-flex w-24 justify-center items-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80">
            Reset
          </button>
          </div>
        </form>
      </div>

    </div>
    
  );
}

export default ForgotPassword;