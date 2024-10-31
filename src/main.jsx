import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Box from './Box.jsx'
import Music from './Music.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)

createRoot(document.getElementById('box')).render(
  <>
    <Box />
  </>
)

createRoot(document.getElementById('music-box')).render(
  <>
    <Music />
  </>
)