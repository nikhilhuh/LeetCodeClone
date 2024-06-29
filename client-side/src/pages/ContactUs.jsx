import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export const ContactUs = () => {
  const form = useRef();
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
    if(form.current.from_name.value === "" || form.current.email.value === "" || form.current.message.value === ""){
      toast.warn("Please fill all the fields");
      return;
    }
    emailjs
    .sendForm("service_n74nitw", "template_595gip6", form.current, "lsgnsKPsV4Ywoq-ix")
    .then(
      (result) => {
        console.log(result.text);
        form.current.reset();
        toast.success("Message sent successfully");
      },
        (error) => {
          console.log(error.text);
          toast.error("Error sending message");
        }
      );
  };
  return (
    <>
      <Navbar />

      {/*Body starts here  */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col space-y-8 pb-10 pt-12 md:pt-24">
          <p className="text-center text-3xl font-bold text-gray-900 md:text-5xl md:leading-10">
            Love to hear from you
          </p>
          <p className="mx-auto max-w-4xl text-center text-base text-gray-600 md:text-xl">
            Reach out to us anytime! We're here to listen, help, and provide you
            with an exceptional experience. Your feedback and questions are
            valuable to us
          </p>
        </div>
        <div className="mx-auto max-w-7xl py-12 md:py-24">
          <div className="grid items-center justify-items-center gap-x-4 gap-y-10 lg:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="px-2 md:px-12">
                <p className="text-2xl font-bold text-gray-900 md:text-4xl">
                  Get in touch
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  Our friendly team would love to hear from you.
                </p>
                <form ref={form}  onSubmit={ sendEmail } className="mt-8 space-y-4">
                  <div className="grid w-full gap-y-4 md:gap-x-4 lg:grid-cols-2">
                    <div className="grid w-full  items-center gap-1.5">
                      <label
                        className="text-sm font-medium leading-none text-gray-700"
                        for="first_name"
                      >
                        First Name
                      </label>
                      <input
                        name="from_name"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        id="first_name"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="grid w-full  items-center gap-1.5">
                      <label
                        className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="last_name"
                      >
                        Last Name
                      </label>
                      <input
                        name="last_name"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        id="last_name"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div className="grid w-full  items-center gap-1.5">
                    <label
                    typeof="email"
                      className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="email"
                    >
                      Email
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      typeof="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="grid w-full  items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="phone_number"
                    >
                      Phone number
                    </label>
                    <input
                      name="phone_number"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="tel"
                      id="phone_number"
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="grid w-full  items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="message"
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      id="message"
                      placeholder="Leave us a message"
                      cols="3"
                    ></textarea>
                  </div>
                  <input
                    type="submit"
                    value="Send Message"
                    className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                  </input>                  
                </form>
              </div>
            </div>
            <img
              alt="Contact us"
              className="hidden max-h-[450px] w-full rounded-xl object-cover lg:block"
              src="https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=687&amp;h=800&amp;q=80"
              />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
