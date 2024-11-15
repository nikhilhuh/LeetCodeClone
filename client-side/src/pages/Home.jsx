import React, { useState } from "react";
import axios from "axios";
import { CodeSnippets } from "../components/CodeSnippets";
import cimg from "../images/c.jpg";
import cppimg from "../images/c++.jpg";
import pyhtonimg from "../images/python.jpg";
import javaimg from "../images/java.jpg";
import jsimg from "../images/js.jpg";
import { ClipLoader } from "react-spinners";
import { backend_url } from "../App";
import CodeEditor from "../components/CodeEditor.jsx"

function Home() {
  const [code, setcode] = useState("");
  const [language, setLanguage] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [CodeButton, setCodeButton] = useState(true);
  const [OutputButton, setOutputButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeEditorTheme, setCodeEditorTheme] = useState("vs-dark");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  function handleCodeEditorTheme() {
    if (codeEditorTheme == "vs-dark") setCodeEditorTheme("vs-light");
    else setCodeEditorTheme("vs-dark");
  }

  function codeButtonClicked() {
    setCodeButton(true);
    setOutputButton(false);
  }
  function outputShow() {
    setCodeButton(false);
    setOutputButton(true);
  }


  function handleLanguageClick(language) {
    setLanguage(language);
    setcode(CodeSnippets[language]);
    codeButtonClicked()
  }

  const submitCode = () => {
    setIsButtonDisabled(true);
    setLoading(true);
    axios
      .post(`${backend_url}/run`, { code, language, input })
      .then((response) => {
        console.log("Response: ", response.data);
        setOutput(response.data.output);
      })
      .catch((error) => {
        console.log("Error:", error);
        setOutput(
          error.response ? error.response.data.error : "Error executing code"
        );
      })
      .finally(() => {
        setLoading(false);
        setIsButtonDisabled(false);
      });
  };

  return (
    <div
      className="flex lg:flex-row flex-col mt-6 w-full"
      style={{ height: "85vh" }}
    >
      <div className="sidebar ml-1 p-1 flex lg:flex-col flex-wrap space-evenly gap-3">
        <abbr title="C compiler">
          <img
            src={cimg}
            alt="C compiler"
            className={`h-10 w-10 p-2 cursor-pointer border-2 ${
              language === "c" ? "bg-black" : "border-gray-400"
            }`}
            onClick={() => handleLanguageClick("c")}
          />
        </abbr>
        <abbr title="C++ compiler">
          <img
            src={cppimg}
            alt="C++ compiler"
            className={`h-10 w-10 p-2 cursor-pointer border-2 ${
              language === "cpp" ? "bg-black" : "border-gray-400"
            }`}
            onClick={() => handleLanguageClick("cpp")}
          />
        </abbr>
        <abbr title="Python compiler">
          <img
            src={pyhtonimg}
            alt="Python compiler"
            className={`h-10 w-10 p-2 cursor-pointer border-2 ${
              language === "python" ? "bg-black" : "border-gray-400"
            }`}
            onClick={() => handleLanguageClick("python")}
          />
        </abbr>
        <abbr title="Java compiler">
          <img
            src={javaimg}
            alt="Java compiler"
            className={`h-10 w-10 p-2 cursor-pointer border-2 ${
              language === "java" ? "bg-black" : "border-gray-400"
            }`}
            onClick={() => handleLanguageClick("java")}
          />
        </abbr>
        <abbr title="JavaScript compiler">
          <img
            src={jsimg}
            alt="JavaScript compiler"
            className={`h-10 w-10 p-2 cursor-pointer border-2 ${
              language === "javascript" ? "bg-black" : "border-gray-400"
            }`}
            onClick={() => handleLanguageClick("javascript")}
          />
        </abbr>
      </div>
      <div className="lg:hidden ml-1 p-1 text-black font-mono text-md mt-2">
        {language === "" ? "No language Selected" : language}
      </div>

      <div className="ml-2 h-full mr-2 w-[calc(100%-1rem)] lg:flex justify-center lg:flex-row lg:justify-around">
        {/* For lg screens and above */}
        <div className="hidden lg:block bg-gray-200 h-[calc(100%-4rem)] w-1/2">
          <div className="bg-black p-2 h-14 flex justify-between align-center">
            <div className={`${language === "" ? "hidden" : ""}`}>
              <div className="text-white font-mono text-lg mt-1">
                main.{language}
              </div>
            </div>
            <div>
              <abbr
                title={`${
                  codeEditorTheme === "vs-dark" ? "Light Mode" : "Dark Mode"
                }`}
              >
                <button
                  className="text-white text-md border-2 border-white p-1 w-8"
                  onClick={handleCodeEditorTheme}
                >
                  <i
                    className={`${
                      codeEditorTheme === "vs-light" ? "fa-regular" : "fa-solid"
                    } fa-moon`}
                  ></i>
                </button>
              </abbr>
            </div>
            <div className={`${language === "" ? "hidden" : ""}`}>
              <div id="run_button">
                <button
                  className={`${
                    isButtonDisabled
                      ? "border-gray-500 bg-gray-500"
                      : "border-blue-500 bg-blue-500"
                  } border-2 w-12 p-1 text-md font-bold text-white`}
                  disabled={isButtonDisabled}
                  onClick={() => {
                    submitCode();
                  }}
                >
                  Run
                </button>
              </div>
            </div>
          </div>

          <div className="h-full w-full">
            <CodeEditor 
            codeEditorTheme={codeEditorTheme} 
            language={language} 
            code={code}
            setcode={setcode}
            fontSize = {16}
            />
          </div>
        </div>

        {/* input-and-output-area */}
        <div className="hidden lg:block bg-gray-200 lg:h-[calc(100%-4rem)] lg:w-1/2 ml-2">
          <div className="bg-black p-2 h-14 flex justify-between align-center">
            <div className="text-white font-mono text-lg mt-1">Output</div>
            <div id="clear_output_button">
              <button
                className="border-2 border-white w-15 p-1 text-md font-bold text-black bg-white"
                onClick={() => setOutput("")}
              >
                Clear Output
              </button>
            </div>
          </div>
          {/* Input area */}
          <div className="flex justify-between">
            <textarea
              name="input"
              id="input"
              placeholder="If your program contains any input, Enter here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-16 w-full p-4 text-lg font-mono resize-none bg-white border-2 border-gray-300"
            ></textarea>
            <div id="clear_input_button">
              <button
                className="border-2 border-white bg-black h-16 w-max p-2 text-md font-bold text-white"
                onClick={() => setInput("")}
              >
                Clear Input
              </button>
            </div>
          </div>

          {/* Output area */}
          {loading ? (
            <div className="h-[calc(100%-4rem)] w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-200">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            <textarea
              name="output_text_area"
              id="output_text_area"
              value={output}
              placeholder="---Your Code Execution Area---"
              readOnly
              className="h-[calc(100%-4rem)] w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-200"
            ></textarea>
          )}
        </div>

        {/* for mobile screens */}
        <div className="bg-gray-200 h-[calc(100%-6rem)] lg:hidden ">
          {/* Top Black bar */}
          <div
            className={`bg-black p-2 h-16 flex justify-between items-center w-full`}
          >
            <div className={`flex justify-center`}>
              {/* code-area button */}
              <div>
                <button
                  className={`${
                    CodeButton === true
                      ? "bg-gray-600 font-bold text-white"
                      : "bg-white text-black"
                  } border-2 border-white w-max p-2 text-sm`}
                  onClick={() => {
                    codeButtonClicked();
                  }}
                >
                  Code
                </button>
              </div>

              {/* output-area button */}
              <div className="ml-1">
                <button
                  className={`${
                    OutputButton === true
                      ? "bg-gray-600 font-bold text-white"
                      : "bg-white text-black"
                  } border-2 border-white w-max p-2 text-sm`}
                  onClick={() => {
                    outputShow();
                  }}
                >
                  Output
                </button>
              </div>
            </div>
            <div
              className={`${CodeButton === true ? "" : "hidden"} items-center`}
            >
              <abbr
                title={`${
                  codeEditorTheme === "vs-dark" ? "Light Mode" : "Dark Mode"
                }`}
              >
                <button
                  className="text-white text-md border-2 border-white p-1 w-8"
                  onClick={handleCodeEditorTheme}
                >
                  <i
                    className={`${
                      codeEditorTheme === "vs-light" ? "fa-regular" : "fa-solid"
                    } fa-moon`}
                  ></i>
                </button>
              </abbr>
            </div>

            {/* run button */}
            <div className={`${language === "" ? "hidden" : ""}`}>
              <button
                className={`${
                  isButtonDisabled
                    ? "border-gray-500 bg-gray-500"
                    : "border-blue-500 bg-blue-500"
                } border-2 w-12 p-1 text-md font-bold text-white items-center`}
                disabled={isButtonDisabled}
                onClick={() => {
                  submitCode();
                  outputShow();
                }}
              >
                Run
              </button>
            </div>
          </div>

          {/* code-editor and input-area */}
          {/* Input area */}
          <div className="flex justify-between">
            <textarea
              name="input"
              id="input"
              placeholder="If your program contains any input, Enter here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-16 w-full p-4 text-sm font-mono resize-none bg-white border-2 border-black"
            ></textarea>
          </div>
          <div
            className={`${
              CodeButton === true ? "" : "hidden"
            } h-[calc(100%-4rem)] w-full relative z-0`}
          >
            <CodeEditor 
            codeEditorTheme={codeEditorTheme} 
            language={language} 
            code={code}
            setcode={setcode}
            fontSize = {12}
            />
          </div>

          {/* input-and-output-area */}
          <div
            className={`${
              OutputButton === true ? "" : "hidden"
            } bg-gray-200 h-[calc(100%-4rem)] w-full`}
          >
            {/* Output area */}
            {loading ? (
              <div className="h-full w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-950 text-white">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
              </div>
            ) : (
              <textarea
                name="output_text_area"
                id="output_text_area"
                value={output}
                placeholder="---Your Code Execution Area---"
                readOnly
                className="h-full w-full p-4 text-md font-mono resize-none overflow-auto bg-gray-950 text-white"
              ></textarea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
