const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const problems = require("./problems");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/run", (req, res) => {
  if (
    !req.body ||
    !req.body.code ||
    typeof req.body.code !== "string" ||
    !req.body.language
  ) {
    return res.status(400).send({ error: "Invalid request body" });
  }

  const { code, language, input } = req.body;

  let inputFileName = path.join(__dirname, `input-${uuidv4()}.txt`);
  fs.writeFileSync(inputFileName, input || "");

  let fileName, outputFile, command;

  switch (language) {
    case "c":
      fileName = path.join(__dirname, `code-${uuidv4()}.c`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `gcc -o "${outputFile}" "${fileName}"`;
      break;

    case "cpp":
      fileName = path.join(__dirname, `code-${uuidv4()}.cpp`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `g++ -o "${outputFile}" "${fileName}" -lstdc++`;
      break;

    case "java":
      fileName = path.join(__dirname, `code-${uuidv4()}.java`);
      command = `javac "${fileName}"`;
      break;

    case "python":
      fileName = path.join(__dirname, `code-${uuidv4()}.py`);
      command = `python3 "${fileName}"`; // Use python3 for Linux
      break;

    case "javascript":
      fileName = path.join(__dirname, `code-${uuidv4()}.js`);
      command = `node "${fileName}"`;
      break;

    default:
      return res.status(400).send({ error: "Unsupported language" });
  }

  fs.writeFile(fileName, code, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send({ error: "Error writing file" });
    }

    if (language === "java") {
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error("Compile error:", compileStderr);
          cleanupFiles(fileName);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: compileStderr });
        }

        const className = code.match(/class (\w+)/)[1];
        exec(
          `java ${className} < "${inputFileName}"`,
          (runErr, runStdout, runStderr) => {
            if (runErr) {
              console.error("Runtime error:", runStderr);
              cleanupFiles(fileName);
              setTimeout(() => cleanupFiles(inputFileName), 1000);
              return res.status(400).send({ error: runStderr });
            }

            res.send({ output: runStdout });
            setTimeout(
              () =>
                cleanupFiles(inputFileName, `${fileName.split(".")[0]}.class`),
              1000
            );
          }
        );
      });
    } else if (language === "python" || language === "javascript") {
      exec(
        `${command} < "${inputFileName}"`,
        (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.error("Runtime error:", runStderr);
            cleanupFiles(fileName);
            setTimeout(() => cleanupFiles(inputFileName), 1000);
            return res.status(400).send({ error: runStderr });
          }

          res.send({ output: runStdout });
          setTimeout(() => cleanupFiles(inputFileName, fileName), 1000);
        }
      );
    } else {
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error("Compile error:", compileStderr);
          cleanupFiles(fileName, outputFile);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: compileStderr });
        }

        exec(
          `"${outputFile}" < "${inputFileName}"`,
          (runErr, runStdout, runStderr) => {
            if (runErr) {
              console.error("Runtime error:", runStderr);
              cleanupFiles(fileName, outputFile);
              setTimeout(() => cleanupFiles(inputFileName), 1000);
              return res.status(400).send({ error: runStderr });
            }

            res.send({ output: runStdout });
            setTimeout(
              () => cleanupFiles(inputFileName, fileName, outputFile),
              1000
            );
          }
        );
      });
    }
  });
});

function cleanupFiles(...files) {
  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlink(file, (err) => {
        if (err) console.error(`Error deleting file: ${file}`);
        else console.log(`File deleted: ${file}`);
      });
    }
  });
}

// Problem of the day
app.get("/api/potd", (req, res) => {
  res.json(problems);
});

let fileName, outputFile, command;
app.post("/api/potd/submit", (req, res) => {
  if (
    !req.body ||
    !req.body.code ||
    typeof req.body.code !== "string" ||
    !req.body.language ||
    !req.body.id
  ) {
    return res.status(400).send({ error: "Invalid request body" });
  }

  const { code, language, id } = req.body;

  // Get problem details based on the id
  const problem = problems

  let inputFileName = path.join(__dirname, `input-${uuidv4()}.txt`);
  fs.writeFileSync(inputFileName, "" || ""); // Empty input for now

  switch (language) {
    case "c":
      fileName = path.join(__dirname, `code-${uuidv4()}.c`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `gcc -o "${outputFile}" "${fileName}"`;
      break;

    case "cpp":
      fileName = path.join(__dirname, `code-${uuidv4()}.cpp`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `gcc -mconsole -o "${outputFile}" "${fileName}" -lstdc++`;
      break;

    case "java":
      fileName = path.join(__dirname, `code-${uuidv4()}.java`);
      command = `javac "${fileName}"`;
      break;

    case "python":
      fileName = path.join(__dirname, `code-${uuidv4()}.py`);
      command = `python3 "${fileName}"`; // Use python3 for Linux
      break;

    case "javascript":
      fileName = path.join(__dirname, `code-${uuidv4()}.js`);
      command = `node "${fileName}"`;
      break;

    default:
      return res.status(400).send({ error: "Unsupported language" });
  }

  fs.writeFile(fileName, code, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send({ error: "Error writing file" });
    }

    // Compile and execute the code, then validate test cases
    compileAndExecuteCode(
      problem,
      fileName,
      inputFileName,
      language,
      command,
      res
    );
  });
});

function compileAndExecuteCode(problem, fileName, inputFileName, language, command, res) {
  // Compile the code first
  if (language === "java") {
    fs.readFile(fileName, 'utf-8', (err, code) => {
      if (err) {
        console.error("Error reading file:", err);
        cleanupFiles(fileName);
        return res.status(500).send({ error: "Error reading file" });
      }

      const match = code.match(/class (\w+)/);
      const className = match ? match[1] : null;
      if (!className) {
        console.error("Class name not found in Java code");
        cleanupFiles(fileName);
        return res.status(400).send({ error: "Class name not found in Java code" });
      }

      // Compile Java code
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error("Compile error:", compileStderr);
          cleanupFiles(fileName);
          return res.status(400).send({ error: compileStderr });
        }

        // Run each test case for Java
        executeTestCases(problem, `java ${className}`, inputFileName, res);
      });
    });
  } else {
    // Compile other languages
    exec(command, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        console.error("Compile error:", compileStderr);
        cleanupFiles(fileName, outputFile);
        return res.status(400).send({ error: compileStderr });
      }

      // Run each test case for non-Java languages
      executeTestCases(problem, `"${outputFile}"`, inputFileName, res);
    });
  }
}

function executeTestCases(problem, runCommand, inputFileName, res) {
  let visibleResults = [];
  let failedTestCases = [];
  let passedTestCases = 0;
  let failedTestCaseCount = 0; 

  function runTestCase(testCase, isHidden, callback) {
    const input = typeof testCase.input === 'object' ? JSON.stringify(testCase.input) : testCase.input;
  
    // Write the input to the file
    console.log("Writing input to file:", input);
    fs.writeFileSync(inputFileName, input);
  
    // Run the test case with the specified command
    exec(`${runCommand} < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
      if (runErr) {
        console.error("Runtime error:", runStderr);
        callback({ error: runStderr, passed: false });
      } else {
        // Debugging: Log the raw output
        console.log(`Test Case Input:`, input);
        console.log("Raw Output from C program:", runStdout);
  
        // Local variable for the user output specific to this test case
        let userOutput = runStdout.trim();
  
        // Compare the output from the user with the expected output
        const expectedOutput = String(testCase.output).trim();
  
        // Debugging: Log expected vs actual output comparison
        console.log(`Expected Output: ${expectedOutput}`);
        console.log(`User Output: ${userOutput}`);
  
        // If output is "null", compare it properly
        const passed = userOutput === expectedOutput || (userOutput === 'null' && expectedOutput === 'null');
  
        // Pass the result for this specific test case
        callback({ expectedOutput, userOutput, passed });
      }
    });
  }
  
  

  // Iterate through the 'cases' (hidden test cases) of the problem
  problem.cases.forEach((testCase, index) => {
    runTestCase(testCase, true, (result) => {
      // Add the result of the test case to visibleResults
      visibleResults.push({
        testCase: index + 1,
        input: testCase.input,
        expectedOutput: result.expectedOutput,
        userOutput: result.userOutput,
        passed: result.passed,
      });

      if (result.passed) passedTestCases++;
      else failedTestCaseCount++;

      // If a test case fails, add it to the failedTestCases list
      if (!result.passed) {
        failedTestCases.push({
          testCase: index + 1,
          input: testCase.input,
          expectedOutput: result.expectedOutput,
          userOutput: result.userOutput,
        });
      }

      // Check if all test cases are processed
      if (visibleResults.length === problem.cases.length) {
        // Send the final result in the response
        res.json({
          success: failedTestCaseCount === 0,
          passedTestCases: passedTestCases,
          failedTestCases: failedTestCaseCount,
          visibleResults: visibleResults,
          failedTestCasesList: failedTestCases,
        });
      }
    });
  });
}


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
