import  { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ThumbsUp, Edit, Trash, Send } from 'lucide-react';
import { store } from '../store';
import { Post, Comment, User } from '../types';

interface Props {
  user: User | null;
}

export default function PostDetail({ user }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    const foundPost = store.getPost(id);
    if (!foundPost) {
      navigate('/');
      return;
    }
    
    setPost(foundPost);
    setComments(store.getComments(id));
  }, [id, navigate]);

  const handleLike = () => {
    if (!user || !id) return;
    store.toggleLike(id);
    setPost(store.getPost(id)!);
  };

  const handleDelete = () => {
    if (!id) return;
    if (store.deletePost(id)) {
      navigate('/');
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;
    
    store.addComment(id, newComment);
    setComments(store.getComments(id));
    setNewComment('');
  };

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
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
                <Edit className="w-5 h-5" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="prose max-w-none mb-6">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div>
            By {post.author} • {post.createdAt}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
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
        </div>
      </article>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        
        {user && (
          <form onSubmit={handleComment} className="mb-6">
            <div className="flex space-x-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
        
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-gray-500">{comment.createdAt}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No comments yet. {user ? 'Be the first to comment!' : 'Login to add a comment.'}
          </p>
        )}
      </div>
    </div>
  );
}
 