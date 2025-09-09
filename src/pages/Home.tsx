import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ThumbsUp, Edit, Trash } from 'lucide-react';
import { store } from '../store';
import { Post, User } from '../types';

interface Props {
  user: User | null;
}

export default function Home({ user }: Props) {
  const [posts, setPosts] = useState<Post[]>(store.getPosts());
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setPosts(store.searchPosts(searchQuery));
    } else {
      setPosts(store.getPosts());
    }
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    store.toggleLike(postId);
    setPosts([...store.getPosts()]);
  };

  const handleDelete = (postId: string) => {
    if (store.deletePost(postId)) {
      setPosts([...store.getPosts()]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Link to={`/post/${post.id}`} className="hover:text-blue-600">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.substring(0, 200)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              {user && user.id === post.authorId && (
                <div className="flex space-x-2 ml-4">
                  <Link
                    to={`/edit/${post.id}`}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                By {post.author} • {post.createdAt}
              </div>
              <button
                onClick={() => handleLike(post.id)}
                disabled={!user}
                className={`flex items-center space-x-1 ${
                  user && post.likedBy.includes(user.id)
                    ? 'text-blue-600'
                    : 'text-gray-500'
                } hover:text-blue-600 disabled:cursor-not-allowed`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
 