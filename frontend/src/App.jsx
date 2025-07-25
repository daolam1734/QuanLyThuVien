import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Contact from './pages/Contact';
import AdminDashboard from './features/admin/AdminDashboard';
import LibrarianDashboard from './features/librarian/LibrarianDashboard';
import BookManager from './features/librarian/books/BookManager';
import ReaderManager from './features/librarian/readers/ReaderManager';
import BorrowManager from './features/librarian/borrow/BorrowManager';
import BorrowedBooks from './features/reader/BorrowedBooks';
import Profile from './features/profile/Profile';

import ProtectedRoute from './components/routes/ProtectedRoute';
import ProtectedRouteAdmin from './components/routes/ProtectedRouteAdmin';
import ProtectedRouteLibrarian from './components/routes/ProtectedRouteLibrarian';

import { Toaster } from 'react-hot-toast';

function App() {
  // ✅ Gắn token mặc định vào mọi request Axios
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Người dùng */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminDashboard />
            </ProtectedRouteAdmin>
          }
        />

        {/* Librarian */}
        <Route
          path="/librarian"
          element={
            <ProtectedRouteLibrarian>
              <LibrarianDashboard />
            </ProtectedRouteLibrarian>
          }
        />
        <Route
          path="/librarian/books"
          element={
            <ProtectedRouteLibrarian>
              <BookManager />
            </ProtectedRouteLibrarian>
          }
        />
        <Route
          path="/librarian/readers"
          element={
            <ProtectedRouteLibrarian>
              <ReaderManager />
            </ProtectedRouteLibrarian>
          }
        />
        <Route
          path="/librarian/borrows"
          element={
            <ProtectedRouteLibrarian>
              <BorrowManager />
            </ProtectedRouteLibrarian>
          }
        />
        <Route path="/borrowed" element={<BorrowedBooks />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
