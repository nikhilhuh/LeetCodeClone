import React, { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import { useEffect } from "react";
import { backend_url } from "../App";
import axios from "axios";
import { CodeSnippets } from "../components/CodeSnippets";
import { ClipLoader } from "react-spinners";
import Swal from 'sweetalert2'

function POTD() {
  const [language, setLanguage] = useState("c");
  const [code, setcode] = useState(CodeSnippets[language]);
  const [codeEditorTheme, setCodeEditorTheme] = useState("vs-dark");
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    axios
      .get(`${backend_url}/api/potd`)
      .then((response) => {
        setProblem(response.data); // Set the fetched data to state
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  function handleCodeEditorTheme() {
    if (codeEditorTheme == "vs-dark") setCodeEditorTheme("vs-light");
    else setCodeEditorTheme("vs-dark");
  }
  function handleLanguageClick(event) {
    const selectedLanguage = event.target.value;
    // console.log(selectedLanguage);
    setLanguage(selectedLanguage);
    setcode(CodeSnippets[selectedLanguage]);
  }

  function handleSubmit() {
    setLoading(true);
    let id = problem.id;
    axios
      .post(`${backend_url}/api/potd/submit`, { code, language, id })
      .then((response) => {
        const {
          totalcases,
          passedTestCases,
          failedTestCases,
          failedTestCasesList,
        } = response.data;
        const alertIcon = failedTestCases > 0 ? "warning" : "success";
         // Optionally, log or display the results
         Swal.fire({
          icon: alertIcon,
          title: "Test Case Results",
          text: `${passedTestCases} / ${totalcases} test cases passed`,
          customClass: {
            popup: "max-w-[80vw] md:max-w-[60vw] p-4",  // Ensures it is responsive
            title: "text-xl text-center",  // Centers the title
            confirmButton: "bg-green-400 text-black font-bold hover:bg-green-600 outline-none",
            footer: "text-sm text-left max-h-[50vh] overflow-auto text-center"
          },
          footer: failedTestCases > 0
            ? `<strong>Failed Test Cases:</strong><br>
                ${failedTestCasesList.map((testCase, index) => {
                  return `Test Case ${testCase.testCase}: 
                          <pre>Input: ${JSON.stringify(testCase.input)}</pre>
                          <pre>Expected Output: ${testCase.expectedOutput}</pre>
                          <pre>Your Output: ${testCase.userOutput}</pre><br><br>`;
                }).join("")}`
            : "All test cases passed!",
        });
        
        
      })
      .catch((error) => {
        console.log("Error:", error);
        setOutput(
          error.response ? error.response.data.error : "Error executing code"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 mt-6 w-full lg:min-h-[85vh] lg:space-y-0 space-y-4">
      {/* Problem */}
      <div className="p-4 bg-zinc-800 ml-2 mr-2 text-white lg:min-h-full lg:max-h-full overflow-auto rounded-lg space-y-4">
        <div className="lg:text-2xl text-lg font-bold flex gap-2">
          <div>{problem.id}.</div>
          <div>{problem.title}</div>
        </div>
        <div className="space-y-4 ml-6">
          <div className="border-2 border-zinc-600 bg-zinc-600 rounded-full w-max px-2 py-1">
            Difficulty: {problem.difficulty}
          </div>
          <div className="lg:text-lg text-sm">{problem.description}</div>
          <div>{problem.assumption}</div>
        </div>
        <div className="space-y-2 ml-6">
          {problem.examples?.map((example, index) => (
            <div key={index} className="mt-6">
              <div className="font-bold">Example {index + 1}</div>
              <div className="mt-2 mb-4 border-l-2 border-gray-500 px-4">
                <div className="text-gray-400">
                  <span className="font-bold text-white">Input: </span>nums = [
                  {example.input.nums.join(", ")}], target ={" "}
                  {example.input.target}
                </div>
                <div className="text-gray-400">
                  <span className="font-bold text-white">Output: </span>[
                  {example.output.join(", ")}]
                </div>
                <div className="text-gray-400">
                  <span className="font-bold text-white">Explanation: </span>
                  {example.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 ml-6">
          <div className="font-bold">Constraints</div>
          <ul className="list-disc ml-6">
            {problem.constraints?.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* code- Editor */}
      <div className="flex flex-col p-4 ml-2 mr-2 rounded-lg bg-zinc-800 space-y-4 text-white min-h-[80vh] lg:min-h-full lg:max-h-full overflow-auto">
        <div className="flex justify-between items-center">
          <div className="text-lg lg:text-xl">&lt;/&gt;Code</div>
          <abbr
            title={`${
              codeEditorTheme === "vs-dark" ? "Light Mode" : "Dark Mode"
            }`}
          >
            <button
              className="text-white text-sm border-2 border-white p-1 w-8"
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
        <div className="flex justify-between items-center">
          <label htmlFor="language" className="font-bold cursor-pointer">
            Select Language :{" "}
          </label>
          <select
            name="language"
            id="language"
            className="text-white rounded-lg px-1 outline-none bg-zinc-600"
            value={language}
            onChange={handleLanguageClick}
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className="flex-grow relative">
          <CodeEditor
            codeEditorTheme={codeEditorTheme}
            language={language}
            code={code}
            setcode={setcode}
            fontSize={12}
          />
          <button
            onClick={handleSubmit}
            className={`z-99 absolute top-[90%] right-[10%] min-h-[40px] min-w-[86px] bg-green-600 px-4 py-2 rounded-lg font-bold text-black ${
              loading ? "cursor-wait" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={10} color={"#123abc"} loading={loading} />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default POTD;
