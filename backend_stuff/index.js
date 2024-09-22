const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const server = express();

server.use(cors({ origin: '*' }));

const wss = new WebSocket.Server({ port: 8000 });
let terminal;

wss.on('connection', (ws) => {
  console.log("connected");
  
  ws.on('message', (message) => {
    let parsedMessage = JSON.parse(message);
    console.log("type: " + parsedMessage.type);
    console.log("received:\n" + parsedMessage.data);

    if (parsedMessage.type == 1) {
      RunCode(parsedMessage, ws);
    } else if (parsedMessage.type == 0) {
      if (terminal) {
        GiveInput(parsedMessage.data);
      } else {
        ws.send("No program given");
      }
    } else {
      console.error("unknown type");
    }
  });

  ws.on('close', () => {
    console.log("connection closed");
    if (terminal) terminal.kill();
  });
});

let RunCode = (parsedMessage, ws) => {

  let tempFilePath = path.join(__dirname, 'files', 'temp' + parsedMessage.extension);
  let code=parsedMessage.data;
  code= code.replace(/main\(([^)]*)\)\s*\{/, 'main($1){\nsetvbuf(stdout, NULL, _IONBF, 0);\n');
  // Debugging to ensure file writing is correct
  fs.writeFile(tempFilePath, code, (err) => {
    if (err) {
      console.error("Error writing the code to the file: " + err);
      ws.send("Error writing the code to the file.");
      return;
    }
    
    console.log("File written successfully. Contents:\n" + parsedMessage.data);

    // Ensure the correct file is being compiled
    terminal = spawn('gcc', ['temp' + parsedMessage.extension, '-o', 'a.exe'], { cwd: './files' });

    terminal.stderr.on('data', (data) => {
      ws.send(`Compile Error: ${data}`);
    });

    terminal.on('close', (code) => {
      if (code === 0) {
        runProgram(ws);
      } else {
        ws.send(`\nCompilation failed with code ${code}\n`);
      }
    });
  });
};

let runProgram = (ws) => {
  //terminal = spawn('./a.exe', [], { cwd: './files' });
  terminal = spawn('./a.exe', [], { cwd: './files', stdio: ['pipe', 'pipe', 'pipe'] });
  // Ensuring output is sent in proper order
  terminal.stdout.on('data', (data) => {
    console.log("Program output:\n" + data);
    ws.send(data.toString()); // Convert to string to avoid raw buffer output
  });

  terminal.stderr.on('data', (data) => {
    ws.send(`Program error: ${data}`);
  });

  terminal.on('close', (code) => {
    ws.send(`\nProgram exited with code: ${code}\n`);
  });
};

let GiveInput = (data) => {
  if (terminal) {
    console.log("Providing input to the program: " + data);
    terminal.stdin.write(data + '\n');  // Ensure proper input with newline
  }
};
