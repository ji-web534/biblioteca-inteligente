import Pantalla_principal from './pantallas/Pantalla_principal'
import Nuevo_libro from './pantallas/Nuevo_libro'
import Nuevo_usuario from './pantallas/nuevo_usuario'
import Iniciar_sesion from './pantallas/Iniciar_sesion'
import Perfil from './pantallas/Perfil'
import Buscador from './pantallas/Buscador'
import Cambiar_contraseña from './pantallas/Cambiar_contraseña'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="library-app">
        <header className="library-header">
          <h1 className="library-header__title">Biblioteca</h1>
          <p className="library-header__subtitle">Catálogo de obras y registros</p>
        </header>

        <main className="library-main">
          <Routes>
            <Route path="/" element={<Pantalla_principal />} />
            <Route path="/registro" element={<Nuevo_usuario />} />
            <Route path="/nuevo-libro" element={<Nuevo_libro />} />
            <Route path="/nuevo-usuario" element={<Nuevo_usuario />} />
            <Route path="/iniciar-sesion" element={<Iniciar_sesion />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/buscador" element={<Buscador />} />
            <Route path="/cambiar-contrasena" element={<Cambiar_contraseña />} />
          </Routes>
        </main>

        <footer className="library-footer">
          Archivo bibliográfico — registro clásico de libros
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
