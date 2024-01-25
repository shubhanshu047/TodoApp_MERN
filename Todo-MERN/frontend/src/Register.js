import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {

  let outer = {
    width:'100%',
    height:"100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
 let inner={
    border: "2px solid green",
    borderRadius:"10px",
    padding:"10px 30px 30px 30px",
    marginTop:"5%"
  }
 let form={
    height:"100%",
    display: "flex",
    flexDirection:"column",
    justifyContent: "center",
    alignItems: "center"
 }
    const navigate= useNavigate()

    const [uname, setuname] = useState("")
    const [pass, setpass] = useState("")

    const func = async ()=>{
        try {
            const response = await fetch('http://localhost:4000/api/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uname, pass }),
              });
        
              let data = await response.json();
              
              if (!response.ok) {                                       //status ranging between 200-299, means success and then will return true in response.ok, otherwise false.
                throw new Error(data.message);
              }
              else{
                  alert("You are registered successfully ! Please Login")
                  navigate("/Login")
              }
      
          } catch (error) {
            alert("Registration error - "+error)
          }
    }


  return (
    <div style={outer}>
      <div style={inner}>
        <h3 style={{ textAlign: "center" }}>Register here -</h3>
        <form style={form} onSubmit={func}>
          <div><h3 style={{display:"inline"}}>Username : </h3><input type="email" value={uname} onChange={(e)=>{setuname(e.target.value)}} /></div>
          <div><h3 style={{display:"inline"}}>Password : </h3><input type="password" value={pass} onChange={(e)=>{setpass(e.target.value)}} /></div>
          <button type="submit" className='but'>Register</button>
          <div style={{padding:"20px 0px 20px 0px"}}><Link to="/Login">Already Registered ?</Link></div>
        </form>
      </div>
    </div>
  )
}
