import React from 'react';
const Header = ({theme}) => {
  let styling={
    fontSize:"40px",
    background: 'linear-gradient(to right, #3b82f6, #3f3df5 25%, #a855f7 50%, #d3415b 75%, #fb7185)',
    WebkitBackgroundClip: 'text',
    fontFamily: '"Poppins", sans-serif', 
    WebkitTextFillColor: 'transparent',
    display:"flex",
    //color:"green",
    justifyContent:"center"}
  return (
    <div style={{backgroundColor:(theme==1)?"#121212":"#F1F3F5"}}><h1 style={styling}>Online Code Compiler/Interpreter</h1></div>
  );
};
export default Header;