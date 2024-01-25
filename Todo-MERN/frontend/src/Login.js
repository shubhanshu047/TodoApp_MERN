import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();
  const [uname, setuname] = useState("")
  const [pass, setpass] = useState("")

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
  const func = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uname, pass }),
      });
      const data = await response.json();

      if (!response.ok) {                                       //status ranging between 200-299, means success and then will return true in response.ok, otherwise false.
        throw new Error(data.message);
      }
      else {
        await localStorage.setItem('user', data.token)
        navigate('/Todo')
      }

    } catch (error) {
      alert("Connection error - " + error)
    }
  }


  return (
    <div style={outer}>
      <div style={inner}>
        <h3 style={{ textAlign: "center" }}>Login</h3>
        <form style={form} onSubmit={func}>
          <div><h4 style={{display:"inline"}} >Username : </h4><input type="email" value={uname} style={{display:"inline"}} onChange={(e) => { setuname(e.target.value) }} /></div>
          <div><h4 style={{display:"inline"}} >Password : </h4><input type="password" value={pass} style={{display:"inline"}} onChange={(e) => { setpass(e.target.value) }} /></div>
          <button type="submit" className='but'>Login</button>
          <div style={{padding:"20px 0px 20px 0px"}}><Link to="/Register">Not Registered yet ?</Link></div>
        </form>
      </div>
    </div>
  )
}
