const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

  let inputFileName = path.join(__dirname, `input-${uuidv4()}.txt`);
  fs.writeFileSync(inputFileName, input || '');

  let fileName, outputFile, command;

  switch (language) {
    case 'c':
      fileName = path.join(__dirname, `code-${uuidv4()}.c`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `gcc -o "${outputFile}" "${fileName}"`;
      break;

    case 'cpp':
      fileName = path.join(__dirname, `code-${uuidv4()}.cpp`);
      outputFile = path.join(__dirname, `output-${uuidv4()}.exe`);
      command = `g++ -o "${outputFile}" "${fileName}" -lstdc++`;
      break;

    case 'java':
      fileName = path.join(__dirname, `code-${uuidv4()}.java`);
      command = `javac "${fileName}"`;
      break;

    case 'python':
      fileName = path.join(__dirname, `code-${uuidv4()}.py`);
      command = `python3 "${fileName}"`;  // Use python3 for Linux
      break;

    case 'javascript':
      fileName = path.join(__dirname, `code-${uuidv4()}.js`);
      command = `node "${fileName}"`;
      break;

    default:
      return res.status(400).send({ error: 'Unsupported language' });
  }

  fs.writeFile(fileName, code, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send({ error: 'Error writing file' });
    }

    if (language === 'java') {
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error('Compile error:', compileStderr);
          cleanupFiles(fileName);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: compileStderr });
        }

        const className = code.match(/class (\w+)/)[1];
        exec(`java ${className} < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.error('Runtime error:', runStderr);
            cleanupFiles(fileName);
            setTimeout(() => cleanupFiles(inputFileName), 1000);
            return res.status(400).send({ error: runStderr });
          }

          res.send({ output: runStdout });
          setTimeout(() => cleanupFiles(inputFileName, `${fileName.split('.')[0]}.class`), 1000);
        });
      });
    } else if (language === 'python' || language === 'javascript') {
      exec(`${command} < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
        if (runErr) {
          console.error('Runtime error:', runStderr);
          cleanupFiles(fileName);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: runStderr });
        }

        res.send({ output: runStdout });
        setTimeout(() => cleanupFiles(inputFileName, fileName), 1000);
      });
    } else {
      exec(command, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error('Compile error:', compileStderr);
          cleanupFiles(fileName, outputFile);
          setTimeout(() => cleanupFiles(inputFileName), 1000);
          return res.status(400).send({ error: compileStderr });
        }

        exec(`"${outputFile}" < "${inputFileName}"`, (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.error('Runtime error:', runStderr);
            cleanupFiles(fileName, outputFile);
            setTimeout(() => cleanupFiles(inputFileName), 1000);
            return res.status(400).send({ error: runStderr });
          }

          res.send({ output: runStdout });
          setTimeout(() => cleanupFiles(inputFileName, fileName, outputFile), 1000);
        });
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
