const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');;

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "*"
}));

app.post('/run', (req, res) => {
  if (!req.body || !req.body.code || typeof req.body.code !== 'string' || !req.body.language) {
    return res.status(400).send({ error: 'Invalid request body' });
  }

  const { code, language, input } = req.body;
  // console.log("Input:", input);

  let inputFileName;
  inputFileName = path.join(__dirname, `input-${uuidv4()}.txt`);
  // Save the input to a file
  fs.writeFileSync(inputFileName, input || '');
  //  console.log(`Input written to file: ${inputFileName}`);


  let fileName, outputFile, command;

  switch (language) {

    case 'c':
      fileName = path.join(__dirname, `code-${uuidv4()}.c`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `gcc -o "${outputFile}" "${fileName}"`;
      break;

    case 'cpp':
      fileName = path.join(__dirname, `codet-${uuidv4()}.cpp`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `g++ -o "${outputFile}" "${fileName}" -lstdc++`;
      break;

    case 'java':
      fileName = path.join(__dirname, `code-${uuidv4()}.java`);
      command = `javac "${fileName}"`;
      break;

    case 'python':
      fileName = path.join(__dirname, `code-${uuidv4()}.py`);
      command = `"C:/Program Files/Python312/python.exe" "${fileName}"`;
      break;

    case 'javascript':
      fileName = path.join(__dirname,`code-${uuidv4()}.js`);
      command = `node "${fileName}"`;
      break;

    default:
      return res.status(400).send({ error: 'Unsupported language' });
  }

  // Save the code to a file
  fs.writeFile(fileName, code, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send({ error: 'Error writing file' });
    }

    // console.log(`Code written to file: ${fileName}`);

    // Compile or directly execute depending on the language
    if (language === 'java') {
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error('Compile error:', compileStderr);
          cleanupFiles(fileName);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: compileStderr });
        }

        console.log("Compilation Successful");

        // Execute the compiled Java program
        const javaCode = code
        const className = javaCode.match(/class (\w+)/)[1];
        // console.log("ClassName: ",className)
        const ExecutionfileName = path.join(__dirname,`${className}.class`);
        // console.log("Execution File Name:",ExecutionfileName);
        exec(`java ${className} < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.error('Runtime error:', runStderr);
            cleanupFiles(ExecutionfileName);
            setTimeout(() => cleanupFiles(inputFileName), 1000);
            return res.status(400).send({ error: runStderr });
          }

          console.log("Execution Successful");
          res.send({ output: runStdout });
          cleanupFiles(ExecutionfileName);
           // Cleanup: Delete the input files with a delay
           setTimeout(() => cleanupFiles(inputFileName), 1000);

          // Cleanup: Delete the files with a delay
          setTimeout(() => cleanupFiles(fileName, `${fileName.split('.')[0]}.class`), 1000);
        });
      });
    } else if (language === 'python') {
      // For Python, execute directly
      exec(`${command} < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
        if (runErr) {
          console.error('Runtime error:', runStderr);
          cleanupFiles(fileName);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: runStderr });
        }

        console.log("Execution Successful");
        res.send({ output: runStdout });
        // Cleanup: Delete the input files with a delay
        setTimeout(() => cleanupFiles(inputFileName), 1000);

        // Cleanup: Delete the files with a delay
        setTimeout(() => cleanupFiles(fileName), 1000);
      });
    } else if (language === 'javascript') {
      // For JavaScript, execute directly
      exec(`${command} < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
        if (runErr) {
          console.error('Runtime error:', runStderr);
          cleanupFiles(fileName);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: runStderr });
        }

        console.log("Execution Successful");
        res.send({ output: runStdout });
        // Cleanup: Delete the input files with a delay
        setTimeout(() => cleanupFiles(inputFileName), 1000);

        // Cleanup: Delete the files with a delay
        setTimeout(() => cleanupFiles(fileName), 1000);
      });
    }
    else    {
      // For C and C++, compile and then execute
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error('Compile error:', compileStderr);
          cleanupFiles(fileName, outputFile);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: compileStderr });
        }

        console.log("Compilation Successful");

        // Execute the compiled program
        exec(`"${outputFile}" < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.error('Runtime error:', runStderr);
            cleanupFiles(fileName, outputFile);
            setTimeout(() => cleanupFiles(inputFileName), 1000);
            return res.status(400).send({ error: runStderr });
          }

          console.log("Execution Successful");
          res.send({ output: runStdout });

          // Cleanup: Delete the input files with a delay
          setTimeout(() => cleanupFiles(inputFileName), 1000);

          // Cleanup: Delete the files with a delay
          setTimeout(() => cleanupFiles(fileName, outputFile), 1000);
        })
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});