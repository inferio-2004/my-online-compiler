import { ChakraProvider,Select,Box, Button} from '@chakra-ui/react'
import Editor from '@monaco-editor/react';
import { useState} from 'react';
import Output from './Output';
import Header from './Header';
function Input(){
  let [thm,SetThm]=useState(1);
  const style_box={
    width:"100vw",
    height:"100vh",
    backgroundColor:(thm==1)?"#121212":"#F1F3F5",
    display:"flex",
    flexDirection:"row",
  }

  const editor_options={
    fontSize:"23px",
    lineNumbers: "on",            // Optional: to show line numbers
    padding: { top: 20, bottom: 20 }, // Internal line padding
  }

  let def_lines={
    c:'#include<stdio.h>\nvoid main(){\nprintf("Hello World");\n}',
    cpp:'#include <iostream>\nusing namespace std;\nint main(){\n // Write C++ code here\n  cout << "Try programiz.pro";\n  return 0;\n}',
    python:"print('hello world')",
    java:'class Main{\n  public static void main(String[] args) {\n    System.out.println("Try programiz.pro");\n  }\n}'
  }
  let lang_extension={
    c:".c",
    python:".py",
    java:".java",
    cpp:".cpp",
  }
  let [lang,Setlanguage]=useState("c");
  let [defval,Setdefval]=useState(def_lines["c"]);

  const handleLangChange=(event)=>{
    let val=event.target.value;
    event.placeholder="";
    console.log(val);
    Setlanguage(val);
    Setdefval(def_lines[val]);
  }

  const TypeCode=(value)=>{
    Setdefval(value);
  }

  const downloadCode=(defval,lang,lang_extension)=>{
    console.log(lang_extension[lang]);
    const blob = new Blob([defval], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'my_code' + lang_extension[lang]; // You can change the filename here
    link.click();
    URL.revokeObjectURL(link.href); // Clean up the URL.createObjectURL
  }

  return (
    
    <ChakraProvider>
      <Box>
        <Header theme={thm}/>
        <Box style={style_box}>
          <Box style={{marginTop:"39px",marginLeft:"5px"}}>
            <div style={{display:"flex",flexDirection:"row"}}>
            <p style={{backgroundColor:(thm==1)?"#121212":"#F1F3F5",color:"#40C4FF",
              width:"40%",marginLeft:"12px",fontSize:"20px",marginRight:"0px"}}>Langauge selected</p>

              <Select style={{backgroundColor:(thm==1)?"#2C2C2C":"#EDEDED",color:"#40C4FF",
              width:"18%",marginTop:"0px",marginBottom:"px", marginLeft:"0px"}}
              variant={'unstyle'}
              icon={'None'}
              onChange={handleLangChange} 
              _hover={{cursor:"pointer",transform:"scale(1.10)"}}
              >
              <option value="c" style={{backgroundColor:(thm==1)?"#2C2C2C":"white",color:"#40C4FF"}} >{"C "}</option>
              <option value="cpp" style={{backgroundColor:(thm==1)?"#2C2C2C":"white",color:"#40C4FF"}} >{"C++"}</option>
              <option value="python" style={{backgroundColor:(thm==1)?"#2C2C2C":"white",color:"#40C4FF"}} >{"Python "}</option>
              <option value="java" style={{backgroundColor:(thm==1)?"#2C2C2C":"white",color:"#40C4FF"}} >{"Java"}</option>
              </Select>

              <Button
              bgGradient="linear-gradient(135deg, #3498db, #2ecc71)" 
                color="white" variant='solid' width={"25%"} marginBottom="17px"
                style={{transition: "transform 0.3s ease-in-out"}}
                marginRight={"10px"}
                borderRadius={"60px"}
                transition="transform 0.01s ease-in-out" 
                _hover={{transform:"scale(1.10)"}}
                onClick={()=>SetThm(1-thm)}
                >Switch theme</Button>

              <Button
              bgGradient="linear-gradient(135deg, #3498db, #2ecc71)" 
                color="white" variant='solid' width={"25%"} marginBottom="17px"
                style={{transition: "transform 0.3s ease-in-out"}}
                marginLeft={"0px"}
                borderRadius={"60px"}
                transition="transform 0.01s ease-in-out" 
                _hover={{transform:"scale(1.10)"}}
                onClick={()=>downloadCode(defval,lang,lang_extension)}
                >Download code</Button>
            </div>
            
            <Box width="50vw" borderRadius="20px" overflow={"hidden"} _hover={{transform:"scale(1.01)",boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.25)"}}
            border="2px solid"
            borderColor={"#333"} 
            style={{transition: "transform 0.2s ease-in-out",border:"1px solid"}}
            >
                <Editor width="50vw" 
                height="90vh" 
                theme={(thm==1)?"vs-dark":"vs"}
                language={lang} 
                options={editor_options} 
                value={defval} onChange={TypeCode}/> 
            </Box>
            
          </Box>
          <Output theme={thm} code={defval} lang={lang} extension={lang_extension[lang]} />
        </Box>
      </Box> 
    </ChakraProvider> 
    )
}
export default Input;
