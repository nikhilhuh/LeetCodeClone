import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CodeEditor from "../components/CodeEditor.jsx";

function Home() {
    
    return (
        <>
            <Navbar />
            {/* page body starts here */}
            <CodeEditor />
            {/* page body ends here */}
            <Footer />
        </>
    );
}

export default Home;