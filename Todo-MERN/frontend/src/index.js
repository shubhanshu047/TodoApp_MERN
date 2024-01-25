import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import Register from './Register';
import Todo from './Todo';
import EditTodo from './EditTodo';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Todo" element={<Todo/>}/>
      <Route path="/EditTodo" element={<EditTodo/>}/>
    </Routes>
  </BrowserRouter>
);

