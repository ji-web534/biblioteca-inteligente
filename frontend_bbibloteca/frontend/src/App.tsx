import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Pantalla_principal from './pantallas/Pantalla_principal'
import Nuevo_libro from './pantallas/Nuevo_libro'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'

function App() {
  

  return (
    <div
    >
    <Routes>
        <Route path="/" element={<Pantalla_principal />} />
        <Route path="/nuevo-libro" element={<Nuevo_libro />} />
      </Routes> 
      </div>
  )
}

export default App
