import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { NavLink } from "react-router-dom";
import nikhilimg from "../images/nikhil.jpeg.jpg";
import himanshuimg from "../images/himanshu.jpg";

function About() {
  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col space-y-8 pb-10 pt-12 md:pt-24">
          <p className="text-3xl font-bold text-gray-900 md:text-5xl md:leading-10">
            Made with love, right here in India
          </p>
          <p className="max-w-4xl text-base text-gray-600 md:text-xl">
            Code, create, and innovate with us! Our online compiler is
            constantly evolving to meet your needs. Stay tuned for exciting new
            features and updates coming soon!
          </p>
        </div>
        <div className="w-full space-y-4"></div>
        <div className="my-8 flex flex-col gap-y-6 md:flex-row lg:justify-around">
          <div className="flex flex-col space-y-3 md:w-2/4 lg:w-1/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-5 w-5"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p className="w-full text-xl font-semibold  text-gray-900">
              Kanpur
            </p>
            <p className="w-full text-base text-gray-700">
              Mon-Sat 9am to 5pm.
            </p>
            <p className="text-sm font-medium">
              Contact us online , through{" "}
              <span className="cursor-pointer hover:underline underline-offset-2">
                <NavLink to="/contactus">Contact Us</NavLink>
              </span>{" "}
              page. Cheers!
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center mt-20">
          <div className="border-2 border-gray-300 w-[80%] rounded-2xl"></div>
        </div>

        <div className="mt-16 flex items-center">
          <div className="space-y-6 md:w-3/4">
            <div className="max-w-max rounded-full border bg-gray-50 p-1 px-3"></div>
            <p className="text-3xl font-bold text-gray-900 md:text-4xl">
              Meet our team
            </p>
            <p className="max-w-4xl text-base text-gray-700 md:text-xl">
              Get to know the talented individuals behind our company. From
              diverse backgrounds and experiences, we come together to create
              something truly special. Meet our team and discover the passion,
              expertise, and dedication that drives us forward.
            </p>
          </div>
        </div>
        <div className="mt-8 mb-8 flex flex-wrap md:justify-around justify-center gap-3">
          <a href="https://www.linkedin.com/in/nikhilhuh" target="_blank">
            <div className="rounded-md border mb-5 md:mb-0 ">
              <img
                src={nikhilimg}
                alt="Nikhil Tiwari"
                className="h-[300px] w-full rounded-lg object-cover "
              />
              <p className="mt-6 w-full px-2 text-xl mb-2 font-semibold text-gray-900">
                Nikhil Tiwari
              </p>
              
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/himanshu-verma2710"
            target="_blank"
          >
            <div className="rounded-md border mb-5 md:mb-0 ">
              <img
                src={himanshuimg}
                alt="Nikhil Tiwari"
                className="h-[300px] w-full rounded-lg object-cover "
              />
              <p className="mt-6 w-full px-2 text-xl mb-2 font-semibold text-gray-900">
                Himanshu Verma
              </p>
              
            </div>
          </a>
          <div className="w-full flex justify-center mt-20">
            <div className="border-2 border-gray-300 w-[80%] rounded-2xl"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-x-4 gap-y-4 py-16 md:flex-row">
          <div className="space-y-6">
            <p className="text-3xl font-bold md:text-4xl">
              We&#x27;re just getting started
            </p>
            <p className="text-base text-gray-600 md:text-lg">
              Our philosophy is simple — hire a team of diverse, passionate
              people and foster a culture that empowers you to do your best
              work.
            </p>
            <button
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <NavLink to="/contactus">Join Now</NavLink>
            </button>
          </div>
          <div className="md:mt-o mt-10 w-full">
            <img
              src="https://images.unsplash.com/photo-1605165566807-508fb529cf3e?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2340&amp;q=80"
              alt="Getting Started"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default About;
