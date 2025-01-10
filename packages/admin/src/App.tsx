import { useState } from 'react'
import './App.css'
import { useMatches } from 'react-router';
import { RouterProvider } from 'react-router-dom';
import routes from './routes'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
