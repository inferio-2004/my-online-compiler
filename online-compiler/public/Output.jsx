import { ChakraProvider,Box,Button} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

function Output({lang,code,version,extension}){
    let [op,Setop]=useState("//Get your Output here by clicking run");
    let [isLoading,SetLoading]=useState(false);
    let [border_clr,Setborder_clr]=useState(0);
    let [inputs,SetInputs]=useState("");
    
    const RunCode=async ()=>{
        console.log(inputs);
        SetInputs('');
        try{
            SetLoading(true);
            let response=await axios.post("https://emkc.org/api/v2/piston/execute",
                {
                    language:lang,
                    version:version,
                    files:[
                    {
                        name:"main"+extension,
                        content: code,
                    },
                    ],
                    
                }
            );
            let ans=response.data;
            if(ans['run']['stderr']){
                Setborder_clr(2);
                Setop("Runtime Error:\n"+ans['run']['stderr']);
            }
            else{
                Setborder_clr(1);
                Setop(ans['run']['stdout']);
            }
            try{
                if(ans['compile']['stderr']){
                    Setborder_clr(2);
                    Setop("Compile Error:\n"+ans['compile']['stderr']);
                }
            }catch{}
        }catch (error) {
            // Log detailed error messages
            console.error("API Error Details:", error.response ? error.response.data : error.message);
            Setop("API Error Details:"+error.message);
        }finally{
            SetLoading(false);
        };
        //let output="lang: "+lang+"\nversion: "+version+"\nCode:"+"\n"+code;
        // console.log(output);
        //Setop(output);
        
    }
    const handle_ip_val=(event)=>{
        SetInputs(event.value);
    }
    const handleInputs=(event)=>{
        if(event.key=="Enter") RunCode();
        else console.log("key entered")
    }     
    return(
        <ChakraProvider>
            <Box width="47vw" marginTop={"2%"} style={{display:"flex",flexDirection:"column"}} marginLeft={"1vw"}>
            <div style={{display:"flex",flexDirection:"row"}}>
                <Button bgGradient="linear-gradient(135deg, #3498db, #2ecc71)" 
                color="white" variant='solid' width={"10%"} marginBottom="17px"
                isLoading={isLoading}
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
                style={{marginLeft:"10vw"}}
                transition="transform 0.01s ease-in-out" 
                _hover={{transform:"scale(1.10)"}}
                onClick={()=>{Setop("")}}
                >Clear</Button>
            </div>
                <Box id="op" height="90vh" style={{color:"white",whiteSpace:"pre-wrap"}} 
                border="1px solid" 
                borderColor={border_clr===0?"#333":border_clr==1?"#90EE90":"red"} 
                borderRadius="20px" p={"20px"} fontSize={"25px"}>
                    {op}
                    <input id="user_inputs" type='text' style={{backgroundColor:"#121212",color:"white",marginLeft:"5px",outline:"none"}} value={inputs} onChange={handle_ip_val}
                    onKeyDown={handleInputs}></input>
                </Box>
            </Box>
        </ChakraProvider>
    )
}
export default Output;