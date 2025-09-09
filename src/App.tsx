import  { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { store } from './store';
import { User } from './types';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(store.getCurrentUser());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/create" element={<CreatePost user={user} />} />
        <Route path="/edit/:id" element={<EditPost user={user} />} />
        <Route path="/post/:id" element={<PostDetail user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
 