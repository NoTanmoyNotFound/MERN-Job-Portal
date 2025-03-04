import { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
      </Routes>
      
    </div>
  )
}

export default App
