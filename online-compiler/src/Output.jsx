import { ChakraProvider,Box,Button} from '@chakra-ui/react';
import { useState,useEffect,useRef } from 'react';

function Output({theme,lang,code,extension}){
    let [op,Setop]=useState("//get output here by clicking Run");
    let [isLoading,SetLoading]=useState(false);
    let [border_clr,Setborder_clr]=useState(0);
    let [inputs,SetInputs]=useState("");
    let [clr,Setclr]=useState(1);
    let socketRef=useRef(null);
    useEffect(()=>{
        socketRef.current=new WebSocket("ws://localhost:8000/");
        socketRef.current.onopen=()=>{console.log("connection established");}
        socketRef.current.onmessage=async (event)=>{
            try {
                // Check the type of event.data
                if (event.data instanceof Blob) {
                    // Convert Blob to text
                    const text = await event.data.text();
                    Setop(prevState => prevState + text);
                } 
                else if (typeof event.data === 'string') {
                    try{
                        let parsed_msg=JSON.parse(event.data);
                        console.log(parsed_msg.s);
                        Setborder_clr(parsed_msg.s);
                        console.log(parsed_msg.output);
                        // Handle string data directly
                        Setop(prevState => prevState +" "+parsed_msg.output);
                    }catch(error){
                        console.error("might be a string: "+error);
                        Setop(prevState => prevState +" "+event.data);
                        Setclr(1);
                    }
                }
            } catch (error) {
                Setborder_clr(2);
                console.error('Error processing WebSocket message:', error);
            }
        }
        socketRef.current.onerror=(error)=>{console.log("websocket error: "+error);}
        socketRef.current.onclose=()=>{console.log("connection closed");}
        return ()=>{socketRef.current.close();};
    },[]);
    let style_output_box={
        color:(theme==1)?"white":"black",
        whiteSpace:"pre-wrap",
        backgroundColor:(theme==1)?"#1e1e1e":"white",
        transition: "transform 0.2s ease-in-out"
    }
    let style_inp={
        backgroundColor:(theme==1)?"#1e1e1e":"white",
        color:(theme==1)?"white":"balck",
        marginLeft:"5px",
        outline:"none"
    }
    const RunCode=()=>{
        if(clr==1){
            Setop('');
            Setclr(0);
        }
        console.log(inputs+" "+lang+" "+extension);
        let msg={
            type:inputs===""?1:0,
            data:inputs==""?code:inputs,
            language:lang,
            extension:extension,
        };
        console.log("Message to be sent:", JSON.stringify(msg, null, 2));
        if(inputs!==""){
            Setop(prevState=>prevState+inputs+'\n');
            SetInputs('');
        }
        try{
            SetLoading(true);
            // sendMessage(code);
            // Setborder_clr(1);
            // Setop(lastMessage);
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(msg));  // Send the code to the server
            }else{
                console.log('WebSocket is not open');
            }
            
        }catch (error) {
            // Log detailed error messages
            Setop("server error");
        }finally{
            SetLoading(false);
        };
        //let output="lang: "+lang+"\nversion: "+version+"\nCode:"+"\n"+code;
        // console.log(output);
        //Setop(output);
        
    };
    // const handle_ip_val=(event)=>{
    //     if(event.key=="Enter"){
    //         console.log(inputs);
    //         RunCode();
    //     }
    //     else SetInputs(event.value);
    // }
    const handleInputs=(event)=>{
        if(event.key=="Enter"){
            console.log(inputs);
            RunCode();
        }
    }   
    const clear_event=()=>{
        let close_terminal={type:2,data:"",lang:"",extension:""};
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(close_terminal));  // Send the code to the server
        }else{
            console.log('WebSocket is not open');
        }
        Setborder_clr(0);
        Setop("");
    }  
    return(
        <ChakraProvider>
            <Box width="47vw" marginTop={"2%"} style={{display:"flex",flexDirection:"column"}} marginLeft={"1vw"}>
            <div style={{display:"flex",flexDirection:"row"}}>
                <Button bgGradient="linear-gradient(135deg, #3498db, #2ecc71)" 
                color="white" variant='solid' width={"10%"} marginBottom="17px"
                isLoading={isLoading}
                style={{transition: "transform 0.3s ease-in-out"}}
                marginLeft={"1vw"}
                borderRadius={"60px"}
                transition="transform 0.01s ease-in-out" 
                _hover={{transform:"scale(1.10)"}}
                onClick={RunCode}
                >Run</Button>

                <Button bgGradient="linear-gradient(135deg, #3498db, #2ecc71)" 
                color="white" variant='solid' width={"10%"} marginBottom="17px"
                marginLeft={"1vw"}
                borderRadius={"60px"}
                style={{marginLeft:"10vw",transition: "transform 0.2s ease-in-out"}}
                transition="transform 0.01s ease-in-out" 
                _hover={{transform:"scale(1.10)"}}
                onClick={clear_event}
                >Clear</Button>
            </div>
                <Box id="op" height="90vh" style={style_output_box}
                maxHeight="300vh" // Set the max height as needed
                overflowY="auto"   // Enable vertical scrolling 
                _hover={{transform:"scale(1.01)",boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.25)"}}
                border="1px solid" 
                borderColor={border_clr===0?"#333":border_clr==1?"#90EE90":"red"} 
                borderRadius="20px" p={"20px"} fontSize={"25px"}>
                    {op}
                    <input id="user_inputs" type='text' style={style_inp} value={inputs} 
                    onChange={event=>{SetInputs(event.target.value);}}
                    autoComplete='off'
                    onKeyDown={handleInputs}></input>
                </Box>
            </Box>
        </ChakraProvider>
    )
}
export default Output;