import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function EditTodo() {

    const navigate = useNavigate()

    const [title,settitle] = useState(useLocation().state.title)
    const [des,setdes] = useState(useLocation().state.description)
    const userToken = localStorage.getItem('user')
    const id= useLocation().state._id;

    const edittask = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/edittask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken
                },
                body: JSON.stringify({ id, title, des })
            })
            const data= await res.json();
            if(!res.ok){
                throw new Error(data.message)
            }
            else{
                alert("Update - "+data.message);
                navigate('/Todo')
            }
        } catch (error) {
            alert("error while updating - " + error)
            navigate("/Todo")
        }
    }

    return (
        <div className='addtodo'>
            <h3>Edit this Task</h3>
            <form onSubmit={edittask}>
                <div><p style={{display:"inline"}}>Title : </p><input type="text" value={title} onChange={(e) => { settitle(e.target.value) }} /></div>
                <div><p style={{display:"inline"}}>Description : </p><input type="text" value={des} onChange={(e) => { setdes(e.target.value) }} /></div>
                <input className="submit" type="submit" value="Edit"/>
            </form>
        </div>
    )
}
