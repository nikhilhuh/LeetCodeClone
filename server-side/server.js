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

function codeCompleter(language, code, problem) {
  let boilerplate;

  switch (language) {
    case "c":
      boilerplate = `
      #include <stdio.h>
      #include <stdlib.h>
      
      ${code}
      
      // Main function
      int main() {
          int* result;
          int returnSize;
      
      ${problem.cases.map((testCase, index) => {
          const numsArray = testCase.input.nums.join(", "); // Ensure numsArray is a valid C array initialization
          return `
          // Test case ${index + 1}
          int nums${index + 1}[] = {${numsArray}};
          int target${index + 1} = ${testCase.input.target};
          int numsSize${index + 1} = sizeof(nums${index + 1}) / sizeof(nums${index + 1}[0]);
      
          // Call the function
          result = twoSum(nums${index + 1}, numsSize${index + 1}, target${index + 1}, &returnSize);
      
          if (result) {
              printf("[%d, %d]\\n", result[0], result[1]);
              free(result); // Free allocated memory
          } else {
              printf("null\\n");
          }
          `;
      }).join("")}
      
          return 0;
      }
      `;
      
      break;
    
    
    default:
      boilerplate = "// Unsupported language";
  }

  return boilerplate;
}


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

   // Get problem details based on the id
   const problem = problems
  const { code, language, id } = req.body;
  const completeCode = codeCompleter(language,code,problem)
  // console.log(completeCode);
  
  // let inputFileName = path.join(__dirname, `input-${uuidv4()}.txt`);
  // fs.writeFileSync(inputFileName, "" || ""); // Empty input for now

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

  fs.writeFile(fileName, completeCode, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send({ error: "Error writing file" });
    }

    // Compile and execute the code, then validate test cases
    compileAndExecuteCode(
      problem,
      fileName,
      language,
      command,
      res
    );
  });
});

function compileAndExecuteCode(problem, fileName, language, command, res) {
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
        executeTestCases(problem, `java ${className}`, res);
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
      executeTestCases(problem, `"${outputFile}"`, res);
    });
  }
}

function executeTestCases(problem, runCommand, res) {
  let visibleResults = [];
  let failedTestCases = [];
  let passedTestCases = 0;
  let failedTestCaseCount = 0; 

  // Run the program with the test cases already injected in the code
  exec(runCommand, (runErr, runStdout, runStderr) => {
    if (runErr) {
      console.error("Runtime error:", runStderr);
      res.json({ error: runStderr });
      return;
    }

    // Log the raw output from the program
    console.log("Raw Output from C program:", runStdout);

    // Assume that each test case's result is printed in a structured format, e.g., 
    // Test case 1: Indices: [0, 1] or Test case 1: No solution found.
    const outputLines = runStdout.trim().split("\n");

    problem.cases.forEach((testCase, index) => {
      // Get the expected output for the test case
      const expectedOutput = String(testCase.output).trim();

      // Extract the result from the program's output 
      const userOutput = outputLines[index].trim();

      // Compare the output from the user with the expected output
      const passed = userOutput === expectedOutput || (userOutput === 'null' && expectedOutput === 'null');

      // Add the result of the test case to visibleResults
      visibleResults.push({
        testCase: index + 1,
        input: testCase.input,
        expectedOutput: expectedOutput,
        userOutput: userOutput,
        passed: passed,
      });

      // Count passed and failed test cases
      if (passed) {
        passedTestCases++;
      } else {
        failedTestCaseCount++;
        failedTestCases.push({
          testCase: index + 1,
          input: testCase.input,
          expectedOutput: expectedOutput,
          userOutput: userOutput,
        });
      }
    });

    // Send the final result in the response
    res.json({
      totalcases : passedTestCases + failedTestCaseCount,
      passedTestCases: passedTestCases,
      failedTestCases: failedTestCaseCount,
      failedTestCasesList: failedTestCases,
    });
    cleanupFiles(fileName, outputFile);
  });
}



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
