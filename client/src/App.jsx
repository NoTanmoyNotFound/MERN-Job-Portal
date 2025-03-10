import { useContext, useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'


function App() {
  const [count, setCount] = useState(0)

  const {showRecruiterLogin} = useContext(AppContext)

  return (
    <div>

      { showRecruiterLogin && <RecruiterLogin />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
      </Routes>
      
    </div>
  )
}

export default App
