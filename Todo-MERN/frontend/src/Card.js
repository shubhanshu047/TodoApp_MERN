import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Card(props) {
  const navigate = useNavigate()
  const userToken = localStorage.getItem('user')

  async function dlt(id){

    try {
      const response = await fetch(`http://localhost:4000/api/deletetask`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
               Authorization: userToken
          },
          body: JSON.stringify({ _id: id })
      })
      let msg = await response.json();
      if (!response.ok) {
          throw new Error(msg.message)
        }
        else {
          props.setdlt(!props.dlt)
      }
  }
  catch (error) {
      alert("Could not delete the task, try again - " + error)
  }
  }
  return (

    <div>
      <div className='card'>
        <h5 className='num'>{props.num}</h5>
        <h3>{props.data.title}</h3>
        <p style={{margin: "5px 0px 15px 0px"}}>{props.data.description}</p>
        <div className='btns'><button onClick={() => { navigate('/EditTodo', { state: props.data }) }}>Edit Task</button>
        <button onClick={() => { dlt(props.data._id) }}>Delete</button>
        </div>
      </div>
    </div>
  )
}
