import React, { useEffect, useRef, useState } from 'react'
import Editor from "@monaco-editor/react";
import axios from 'axios';
import { CodeSnippets } from './CodeSnippets';
import cimg from "../images/c.jpg";
import cppimg from "../images/c++.jpg";
import pyhtonimg from "../images/python.jpg";
import javaimg from "../images/java.jpg";
import jsimg from "../images/js.jpg";
import {ClipLoader} from "react-spinners"

function CodeEditor() {
    const editorRef = useRef(null)
    const [code, setcode] = useState('')
    const [language, setLanguage] = useState("");
    const [output , setOutput] = useState("")
    const [input, setInput] = useState("");
    const [CodeButton , setCodeButton] = useState(true)
    const [OutputButton , setOutputButton] = useState(false)
    const [loading , setLoading] = useState(false)

    function codeButtonClicked() {
      setCodeButton(true)
      setOutputButton(false)
    }
    function outputButtonClicked() {
      setCodeButton(false)
      setOutputButton(true)
    }

    function onMount(editor) {
        editorRef.current=editor;
        editor.focus();
    }
    
    function handleLanguageClick(language) {
      setLanguage(language);
      setcode(CodeSnippets[language])
    }


    const submitCode = ()=>{
        // console.log(code)
        setLoading(true)
        axios.post('http://localhost:3000/run', { code , language , input })
        .then(response => {
          console.log("Response: ",response.data)
            setOutput(response.data.output);
        })
        .catch(error => {
          console.log("Error:",error);
            setOutput(error.response ? error.response.data.error : 'Error executing code');
        }).finally(()=>{
          setLoading(false)
        })
        
    }

  return (
      <div className="flex md:flex-row flex-wrap mt-6 w-full" style={{ height: "85vh" }}>
        <div className="sidebar ml-1 p-1 flex md:flex-col flex-wrap space-evenly gap-3">
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

          <div className={`md:hidden ${ language === ""? 'hidden' : 'inline'} text-black font-mono text-md mt-2`}>
              main.{language}
          </div>


        </div>

        <div className="ml-2 h-5/6 md:h-full md:w-[calc(100%-4rem)] w-[calc(100%-3rem)] lg:flex justify-center lg:flex-row lg:justify-around">
          
          {/* For lg screens and above */}
          <div className="hidden lg:block bg-gray-200 h-[calc(100%-4rem)] w-1/2">
            <div className="bg-black p-2 h-14 flex justify-between align-center">
              <div className={`${ language === ""? 'hidden' : 'inline'}`}>
                <div className="text-white font-mono text-lg mt-1">
                  main.{language}
                </div>
              </div>
              <div className={`${ language === ""? 'hidden' : 'inline'}`}>
                <div id="run_button">
                  <button className="border-2 border-blue-500 w-12 p-1 text-md font-bold text-white bg-blue-500" onClick={()=>{
                   submitCode()
                  }}>
                    Run
                  </button>
                </div>
              </div>  
            </div>

            <div className="h-full w-full">
            <Editor
            height="100%"
            width="100%"
             theme="vs-dark"
             language={language}
             defaultValue={CodeSnippets[language]}
             onMount={onMount}
             value={code}
             onChange={(e) => setcode(e)}
              />
            </div>
          </div>

          {/* input-and-output-area */}
          <div className="hidden lg:block bg-gray-200 lg:h-[calc(100%-4rem)] lg:w-1/2 ml-2">
            <div className="bg-black p-2 h-14 flex justify-between align-center">
              <div className="text-white font-mono text-lg mt-1">Output</div>
              <div id="clear_output_button">
                <button className="border-2 border-white w-15 p-1 text-md font-bold text-black bg-white" onClick={() => setOutput('')}
                >
                  Clear Output
                </button>
              </div>
            </div>
            {/* Input area */}
            <div className='flex justify-between'>
              <textarea
                          name="input"
                          id="input"
                          placeholder="Enter input here..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="h-16 w-full p-4 text-lg font-mono resize-none bg-white border-2 border-gray-300"
                      >
                      </textarea>
                  <div id='clear_input_button'>
                          <button className="border-2 border-white bg-black h-16 w-max p-2 text-md font-bold text-white" onClick={() => setInput('')}
                            >
                            Clear Input
                          </button>
                  </div>
            </div>

                    {/* Output area */}
                    {loading ? (
                      <div className='h-[calc(100%-4rem)] w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-200'>
                      <ClipLoader size = {50}
                      color={'#123abc'}
                      loading={loading} />
                      </div>
                    ) : (<textarea
                        name="output_text_area"
                        id="output_text_area"
                        value={output}
                        placeholder="---Your Code Execution Area---"
                        readOnly
                        className="h-[calc(100%-4rem)] w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-200"
                    ></textarea>)}
                    
          </div>

          {/* for medium screens */}
          <div className="md:block bg-gray-200 h-[calc(100%-4rem)] w-full lg:hidden hidden">

                  {/* Top Black bar */}
                <div className={`bg-black p-2 h-16 flex justify-between align-center w-full`}>
                  <div className={`${ language === ""? 'hidden' : 'inline'} text-white font-mono text-lg mt-2`}>
                    main.{language}
                  </div>

                  <div className={`flex justify-center`}>
                      {/* code-area button */}
                      <div>
                        <button className={`${CodeButton === true ? 'bg-gray-600 font-bold text-white' : 'bg-white text-black'} border-2 border-white w-max p-2 text-md`} onClick={()=>{
                          codeButtonClicked()
                        }}>
                          Code
                        </button>
                      </div>
                  
                      {/* output-area button */}
                      <div className='ml-1'>
                        <button className={`${OutputButton === true ? 'bg-gray-600 font-bold text-white' : 'bg-white text-black'} border-2 border-white w-max p-2 text-md`} onClick={()=>{
                          outputButtonClicked()
                        }}>
                          Output
                        </button>
                      </div>

                  </div>

                  
                  {/* Clear Output Button */}
                  <div id="clear_output_button">
                    <button className={`${OutputButton === true ? '' : 'hidden'} border-2 border-white w-15 p-1 text-md font-bold text-black bg-white mt-2`} onClick={() => setOutput('')}
                      >
                        Clear Output
                    </button>
                  </div>

                    {/* run button */}
                  <div className='flex place-content-end'>
                    <button className='border-2 border-blue-500 bg-blue-500 w-max p-2 text-md max-h-max text-white font-bold' onClick={()=>{
                        submitCode()
                        }}>
                         Run
                    </button>
                  </div>

                </div>

                {/* code-editor */}
                <div className={`${CodeButton === true ? '' : 'hidden'} h-full w-full text-sm relative z-0`}>
                  <Editor
                      height="100%"
                      width="100%"
                      theme="vs-dark"
                      language={language}
                      defaultValue={CodeSnippets[language]}
                      onMount={onMount}
                      value={code}
                      onChange={(e) => setcode(e)}
                  />
                </div>

                {/* input-and-output-area */}
                <div className={`${OutputButton === true ? '' : 'hidden'} bg-gray-200 h-full w-full`}>
                  
                  {/* Input area */}
                  <div className='flex justify-between'>
                    <textarea
                          name="input"
                          id="input"
                          placeholder="Enter input here..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="h-16 w-full p-4 text-lg font-mono resize-none bg-white border-2 border-black"
                      >
                    </textarea>
                    <div id='clear_input_button'>
                        <button className="border-2 border-black bg-black h-16 w-max p-2 text-md font-bold text-white" onClick={() => setInput('')}
                          >
                            Clear Input
                        </button>
                    </div>
                  </div>

                  {/* Output area */}
                  {loading ? (
                      <div className='h-[calc(100%-4rem)] w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-950 text-white'>
                      <ClipLoader size = {50}
                      color={'#123abc'}
                      loading={loading} />
                      </div>
                    ) : (<textarea
                        name="output_text_area"
                        id="output_text_area"
                        value={output}
                        placeholder="---Your Code Execution Area---"
                        readOnly
                        className="h-[calc(100%-4rem)] w-full p-4 text-lg font-mono resize-none overflow-auto bg-gray-950 text-white"
                    ></textarea>)}
                 </div>
          
          </div>


          {/* for smaller screens */}
          <div className="block bg-gray-200 h-[calc(100%-4rem)] w-full md:hidden ">

                  {/* Top Black bar */}
                <div className={`bg-black p-2 h-16 flex justify-between align-center w-full`}>
                  <div className={`flex justify-center`}>
                      {/* code-area button */}
                      <div>
                        <button className={`${CodeButton === true ? 'bg-gray-600 font-bold text-white' : 'bg-white text-black'} border-2 border-white w-max p-2 text-sm`} onClick={()=>{
                          codeButtonClicked()
                        }}>
                          Code
                        </button>
                      </div>
                  
                      {/* output-area button */}
                      <div className='ml-1'>
                        <button className={`${OutputButton === true ? 'bg-gray-600 font-bold text-white' : 'bg-white text-black'} border-2 border-white w-max p-2 text-sm`} onClick={()=>{
                          outputButtonClicked()
                        }}>
                          Output
                        </button>
                      </div>

                  </div>


                    {/* run button */}
                  <div className='flex place-content-end'>
                    <button className='border-2 border-blue-500 bg-blue-500 w-max p-2 text-sm max-h-max text-white font-bold' onClick={()=>{
                        submitCode()
                        }}>
                         Run
                    </button>
                  </div>

                </div>

                {/* code-editor */}
                <div className={`${CodeButton === true ? '' : 'hidden'} h-full w-full relative z-0`}>
                  <Editor
                      fontsize = "12"
                      height="100%"
                      width="100%"
                      theme="vs-dark"
                      language={language}
                      defaultValue={CodeSnippets[language]}
                      onMount={onMount}
                      value={code}
                      onChange={(e) => setcode(e)}
                      options={{
                        fontSize: 12,
                        minimap: {
                          enabled: false, // Add this line to hide the minimap
                        },
                      }}
                  />
                </div>

                {/* input-and-output-area */}
                <div className={`${OutputButton === true ? '' : 'hidden'} bg-gray-200 h-full w-full`}>
                  
                  {/* Input area */}
                  <div className='flex justify-between'>
                    <textarea
                          name="input"
                          id="input"
                          placeholder="Enter input here..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="h-16 w-full p-4 text-sm font-mono resize-none bg-white border-2 border-black"
                      >
                    </textarea>
                  </div>

                  {/* Output area */}
                  {loading ? (
                      <div className='h-[calc(100%-4rem)] w-full p-4 text-sm font-mono resize-none overflow-auto bg-gray-950 text-white'>
                      <ClipLoader size = {50}
                      color={'#123abc'}
                      loading={loading} />
                      </div>
                    ) : (<textarea
                        name="output_text_area"
                        id="output_text_area"
                        value={output}
                        placeholder="---Your Code Execution Area---"
                        readOnly
                        className="h-[calc(100%-4rem)] w-full p-4 text-sm font-mono resize-none overflow-auto bg-gray-950 text-white"
                    ></textarea>)}
                 </div>
          
          </div>


        </div>
      </div>
  )
}

export default CodeEditor