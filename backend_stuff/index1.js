const WebSocket= require('ws');
const {spawn} =require('child_process');
const path=require('path');
const fs=require('fs');
const cors=require('cors');
const express=require('express');

//creating server
const app=express();
app.use(cors({origin:'*'}));

//creating websocket connection
const wss=new WebSocket.Server({port:8000});

//creating terminal instance
let terminal;

//connection establishment
wss.on('connection',(ws)=>{
    console.log("connected"); //logging the connection status

    //on receiving req from user
    ws.on('message',(message)=>{
        let parsedMessage=JSON.parse(message);
        const {type,data,lang,extn}=parsedMessage; // unpacking the info given from frontend

        //logging the recived json
        console.log("type: ",type);
        console.log("code/input: ",data);

        //running code or feeding output acc to type parameter value
        if(type===1){
            RunCode(parsedMessage,ws);
        }
        else if(type===0){
            if(terminal){
                GiveInput(parsedMessage.data);
            }
            else{
                obj_data={s:"2",output:"no program given"};
                ws.send(JSON.stringify(obj_data));
            }
        }else if(type===2){
            if(terminal) terminal.kill();
        }else{
            console.error("some unknow type given");
        }
    });

    //closing after done giving outputs
    ws.on('close',()=>{
        console.log("connection terminated");
        if(terminal) terminal.kill();
    });
});
//running code in docker
let RunCode=(parsedMessage,ws)=>{
    let tempFilePath=path.join(__dirname,'files','temp'+parsedMessage.extension);
    let code=parsedMessage.data;

    //writing the code given into a file
    fs.writeFile(tempFilePath,code,(err)=>{
        if(err){
            console.error("error writing code to file: "+err);
            ws.send("error writing code to file.");
            return;
        }
        // getting the command to run in the docker acc to lang
        let dockerRunCommand=getdockerRunCommand(parsedMessage.language,tempFilePath);

        //intializing terminal instance
        terminal=spawn(dockerRunCommand[0],dockerRunCommand.slice(1),{stdio:['pipe','pipe','pipe']});

        terminal.stdout.on('data',(data)=>{
            obj_data={s:"1",output:data.toString()};
            ws.send(JSON.stringify(obj_data));
        });
        terminal.stderr.on('data',(data)=>{
            console.log(data.toString());
            obj_data={s:"2",output:data.toString()};
            ws.send(JSON.stringify(obj_data));
        });
        terminal.on('close',(code)=>{
            //obj_data={s:(code===0)?"1":"2",output:`\nProgram exited with code: ${code}\n==================================================\n`};
            if(code!==null)ws.send(`\nProgram exited with code: ${code}\n==================================================\n`);//JSON.stringify(obj_data));
        });
    });
};
// function for handling user inputs
let GiveInput=(data)=>{
    if(terminal){
        terminal.stdin.write(data+'\n');
    }
};
//function for getting corresponding docker command
const isWindows = process.platform === 'win32';
let getdockerRunCommand=(language,tempFilePath)=>{
    const volume=`${process.cwd()}:/usr/src/app`;
    const workdir='/usr/src/app/files';
    const filename=path.basename(tempFilePath);
    let cmd_ref;
    //return ['run','-it','--rm','-v',volume,'-w',workdir,'my-online-compiler','bash','-c',`gcc ${filename} -o program && ./program`];
    switch(language){
        case 'c':
            cmd_ref=`/usr/local/bin/wrapper.sh gcc ${filename}`;
            break;
        case 'cpp':
            cmd_ref=`/usr/local/bin/wrapper.sh g++ ${filename}`;
            break;
        case 'java':
            cmd_ref=`javac ${filename} && java Main`;
            break;
        case 'python':
            cmd_ref=`python3 -u ${filename}`;
            break;
        default:
            throw new Error('language not supported');    
    }
    const dockerCmd = isWindows 
        ? ['docker', 'run','-i', '--rm', '-v', volume, '-w', workdir, 'my-online-compiler', 'bash', '-c', cmd_ref]
        : ['docker', 'run', '-it', '--rm', '-v', volume, '-w', workdir, 'my-online-compiler', 'bash', '-c', cmd_ref];
    return dockerCmd;
}