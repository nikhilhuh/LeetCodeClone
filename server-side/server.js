const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { c, cpp, node, python, java } = require('compile-run');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "*"
}));

app.post('https://leetcodeclone.onrender.com/run', async (req, res) => {
  if (!req.body || !req.body.code || typeof req.body.code !== 'string' || !req.body.language) {
    return res.status(400).send({ error: 'Invalid request body' });
  }

  const { code, language, input } = req.body;

  let fileName, executionPromise;

  switch (language) {
    case 'c':
      fileName = `code-${uuidv4()}.c`;
      executionPromise = c.runFile(fileName, { stdin: input });
      break;

    case 'cpp':
      fileName = `code-${uuidv4()}.cpp`;
      executionPromise = cpp.runFile(fileName, { stdin: input });
      break;

    case 'java':
      fileName = `code-${uuidv4()}.java`;
      executionPromise = java.runFile(fileName, { stdin: input });
      break;

    case 'python':
      fileName = `code-${uuidv4()}.py`;
      executionPromise = python.runFile(fileName, { stdin: input });
      break;

    case 'javascript':
      fileName = `code-${uuidv4()}.js`;
      executionPromise = node.runFile(fileName, { stdin: input });
      break;

    default:
      return res.status(400).send({ error: 'Unsupported language' });
  }

  // Save the code to a file
  fs.writeFile(fileName, code, async (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send({ error: 'Error writing file' });
    }

    try {
      const { stdout, stderr } = await executionPromise;
      res.send({ output: stdout || stderr });
    } catch (execError) {
      console.error('Execution error:', execError);
      res.status(400).send({ error: execError.toString() });
    } finally {
      // Cleanup: Delete the file
      fs.unlink(fileName, (unlinkErr) => {
        if (unlinkErr) console.error(`Error deleting file: ${fileName}`);
        else console.log(`File deleted: ${fileName}`);
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
