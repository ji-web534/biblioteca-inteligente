import Home from './pantallas/Home'
import NewBook from './pantallas/NewBook'
import Register from './pantallas/Register'
import Login from './pantallas/Login'
import ProfileLayout from './pantallas/profile/ProfileLayout'
import MisLibros from './pantallas/profile/MisLibros'
import Favoritos from './pantallas/profile/Favoritos'
import EditarPerfil from './pantallas/profile/EditarPerfil'
import BookSearch from './pantallas/BookSearch'
import BookDetail from './pantallas/BookDetail'
import AdminUsers from './pantallas/AdminUsers'
import AdminBooks from './pantallas/AdminBooks'
import AdminCategories from './pantallas/AdminCategories'
import ChangePassword from './pantallas/ChangePassword'
import ConfirmAccount from './pantallas/ConfirmAccount'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { cargando } = useAuth()

  if (cargando) {
    return (
      <div className="library-app">
        <header className="library-header">
          <h1 className="library-header__title">Biblioteca</h1>
          <p className="library-header__subtitle">Catálogo de obras y registros</p>
        </header>
        <main className="library-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <p>Cargando...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="library-app">
      <header className="library-header">
        <h1 className="library-header__title">Biblioteca</h1>
        <p className="library-header__subtitle">Catálogo de obras y registros</p>
      </header>

      <main className="library-main no-scrollbar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/nuevo-libro" element={<NewBook />} />
          <Route path="/nuevo-usuario" element={<Register />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/perfil" element={<ProfileLayout />}>
            <Route index element={<MisLibros />} />
            <Route path="mis-libros" element={<MisLibros />} />
            <Route path="favoritos" element={<Favoritos />} />
            <Route path="editar-perfil" element={<EditarPerfil />} />
          </Route>
          <Route path="/buscador" element={<BookSearch />} />
          <Route path="/libro/:id" element={<BookDetail />} />
          <Route path="/admin/libros" element={<AdminBooks />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="/cambiar-contrasena" element={<ChangePassword />} />
          <Route path="/confirmar-cuenta" element={<ConfirmAccount />} />
        </Routes>
      </main>

      <footer className="library-footer">
        Archivo bibliográfico — registro clásico de libros
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
