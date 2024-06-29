import React from "react";
import amazonimg from "../images/amazon.jpg"
import appleimg from "../images/apple.jpg"
import bankofamericaimg from "../images/bankofamerica.png"
import ciscoimg from "../images/cisco.png"
import facebookimg from "../images/facebook.jpeg"
import jetimg from "../images/jet.png"
import uberimg from "../images/uber.png"
import leapmotionimg from "../images/leapmotion.png"
import indianflagimg from "../images/indianflag.jpg"
import intelimg from "../images/intel.jpg"
import stripeimg from "../images/stripe.png"
import pinterestimg from "../images/pinterest.png"

function Footer() {
    return(
        <>
        {/* Footer starts here */}
      <footer className="w-full bg-slate-200 mt-8 p-2">

        <div className="w-full text-sm flex flex-col items-center justify-center text-center mt-1 mb-6 text-gray-400">
          <div>
            At LeetCode, our mission is to help you improve yourself and land
            your dream job.
          </div>
          <div>
            We have a sizable repository of interview resources for many
            companies. In the past
          </div>
          <div>
            few years, our users have landed jobs at top companies around the
            world.
          </div>
        </div>

        <div className="flex items-center justify-center mb-10">
          <div className="border-2 border-gray-500 w-[20%] rounded-2xl"></div>
        </div>

        <div className="w-full text-sm flex flex-col items-center justify-center text-center mt-1 mb-6 text-gray-400">
          <div>
            If you are passionate about tackling some of the most interesting
            problems
          </div>
          <div>around, we would love to hear from you.</div>
        </div>

        <div className="w-full text-sm flex flex-col items-center justify-center text-center mt-1 mb-6 text-gray-600">
          <span>
          "Let's rise together! We're committed to helping each other grow and making our mark in the industry's biggest companies."
          </span>
        </div>
        <div className="w-full mt-10 flex flex-wrap align-center justify-center mb-2 md:gap-4 gap-3">
          <img src={facebookimg} alt="" className="h-12" />
          <img src={leapmotionimg} alt="" className="h-12" />
          <img src={appleimg} alt="" className="h-12" />
          <img src={uberimg} alt="" className="h-12" />
          <img src={jetimg} alt="" className="h-12" />
          <img src={intelimg} alt="" className="h-12" />
          <img src={amazonimg} alt="" className="h-12" />
        </div>
        <div className="w-full mt-5 mb-10 flex flex-wrap align-center justify-center md:gap-4 gap-3">
          <img src={bankofamericaimg} alt="" className="h-11 w-25" />
          <img src={pinterestimg} alt="" className="h-11 w-25" />
          <img src={ciscoimg} alt="" className="h-11 w-25" />
          <img src={stripeimg} alt="" className="h-11 w-25" />
        </div>

        <div className="flex justify-around items-center p-2">
          <div className="text-sm text-gray-400">Copyright © 2024 LeetCodeClone</div>

          <div className="flex justify-around gap-4 text-gray-400 md:text-gray-600">
            <ul className="hidden md:flex ">
              <li className="mr-3">Help Center</li>
              <li className="mr-3">Jobs</li>
              <li className="mr-3">Students</li>
              <li className="mr-3">Terms</li>
              <li className="mr-3">Privacy Policy</li>
            </ul>

            <div className="flex align-center justify-center">
              <img
                src={indianflagimg}
                alt="Indian Flag"
                className="h-5 rounded-lg mr-1.5"
              />
              India | In
            </div>
          </div>
        </div>

      </footer>

      {/* Footer ends here */}

        </>
    )
}

export default Footer