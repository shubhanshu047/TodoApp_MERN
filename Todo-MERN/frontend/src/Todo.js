import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from './Card';

export default function Todo() {
    const [todos, settodos] = useState([])
    const navigate = useNavigate();
    const userToken = localStorage.getItem('user')
    const [msg, setmsg] = useState("")
    const [title, settitle] = useState("")
    const [des, setdes] = useState("")
    const [start, setstart] = useState(0)
    const [end, setend] = useState(4)
    const [search, setsearch] = useState("")
    const [dlt, setdlt] = useState(false)
    const [count, setcount] = useState(0)
    const [sr, setsr]=useState(false)


    useEffect(() => {
        if (!userToken) {
            alert("Please login first")
            navigate("/Login")
        }
        else {
            fetchTodo()
        }
    }, [dlt, start, end])

    let fetchTodo = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/getone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken
                },
                body: JSON.stringify({ start: start, end: end })
            })

            const data = await response.json();
            if (data.message) {
                setmsg(data.message)
                settodos([])
            }
            else {
                setmsg("")
                setsr(false)
                settodos(data.todolist)
                setcount(data.todocount)
            }

        } catch (error) {
            alert(error);
        }
    }

    function logout() {
        localStorage.clear();
        navigate("/Login");
    }

    async function addtask() {
        try {
            const response = await fetch(`http://localhost:4000/api/addtask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken
                },
                body: JSON.stringify({ title, des })
            })
            let msg = await response.json();
            if (!response.ok) {
                throw new Error(msg.message)
            }
            else {
                alert("Task added in Todo list !")
            }
        }
        catch (error) {
            alert("Can't add new task - " + error)
        }
    }

    function managepages(s, e) {
        setstart(s);
        if(count<e){
            setend(count);
        }
        else{
            setend(e)
        }
    }

    async function searchfunc() {
        try{
            if(search!=""){
                const response = await fetch(`http://localhost:4000/api/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: userToken
                    },
                    body: JSON.stringify({ word: search })
                })
                let data= await response.json();
                if(!response.ok){
                    setmsg(data.message)
                    settodos([])
                    setsr(true)
                }
                else{
                    setmsg("")
                    setstart(0)
                    setend(4)
                    settodos(data.todolist)
                    setcount(data.todocount)
                    setsr(true)
                }
            }
            else{
                fetchTodo()
            }
        }catch(error){
            alert("error while searching the task - "+error)
        }
    }
    return (
        <div className='main'>
            <div className='nav'>
                <input type='text' placeholder='Search Todos by title or description' style={{padding:"2px !important"}} value={search} onChange={(e) => { setsearch(e.target.value) }} />
                <button style={{ backgroundColor: "rgb(103 103 238)" }} onClick={() => { searchfunc() }}>Search</button>
                <button onClick={() => { logout() }}>Log Out</button>
            </div>
            <h3>Your tasks</h3>

            <div className='page'>
                <p>showing {todos.length} of {count} tasks...</p>
                <div className='pagebuttons'>
                    {
                        !sr && (start > 0) && <button onClick={() => { managepages(start - 4, end - todos.length) }}>&lt;&lt; Previous</button>
                    }
                    {
                        !sr && (end < count) && <button onClick={() => {managepages(start + 4, end + 4) }}>Load more &gt;&gt;</button>
                    }
                </div>
            </div>

            <div className='maintodo'>
                <div className='todos'>
                    <h5>{msg}</h5>
                    {
                        todos?.map((d, i) => {
                            return(
                                <Card key={i} num={start+(i+1)} data={d} dlt={dlt} setdlt={setdlt} />
                            )
                        })
                    }
                </div>
                <div className='addtodo'>
                    <h5>Add new task</h5>
                    <form onSubmit={() => { addtask() }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><p style={{ display: "inline" }}>Title : </p></td>
                                    <td><input type="text" value={title} onChange={(e) => { settitle(e.target.value) }} /></td>
                                </tr>
                                <tr>
                                    <td><p style={{ display: "inline" }}>Description : </p></td>
                                    <td><input type="text" value={des} onChange={(e) => { setdes(e.target.value) }} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <input className='submit' type="submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}
