// We're bringing in some special tools we need
import React from 'react';
// These help us create different pages in our app
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// This makes our app look pretty using Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// This brings in our Todo list component that we made in another file
import Todo from './components/Todo';


// This is our main App - like the container for our whole website
function App() {
  // This makes our title look nice and centered
  const headStyle = {
    textAlign: "center",
  }
  
  // Everything between return ( ) is what shows up on the screen
  return (
    <div>
      {/* This is our main title at the top */}
      <h1 style={headStyle}>Todo List</h1>
      
      {/* BrowserRouter is like a magic box that helps us show different pages */}
      <BrowserRouter>
        {/* Routes is like a map that tells our app which page to show */}
        <Routes>
          {/* This says: when someone goes to our homepage ('/'), show the Todo list */}
          <Route path='/' element={<Todo/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// This lets other files use our App
export default App;