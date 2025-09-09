import  { Link, useNavigate } from 'react-router-dom';
import { User, Search, Plus, LogOut } from 'lucide-react';
import { store } from '../store';
import { User as UserType } from '../types';

interface Props {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export default function Header({ user, setUser }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    store.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BlogHub
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Post</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
 