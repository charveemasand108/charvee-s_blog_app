import  { User, Post, Comment } from './types';

class BlogStore {
  private users: User[] = [
    { id: '1', username: 'johndoe', email: 'john@example.com' },
    { id: '2', username: 'janedoe', email: 'jane@example.com' }
  ];
  
  private posts: Post[] = [
    {
      id: '1',
      title: 'Getting Started with React',
      content: 'React is a powerful library for building user interfaces...',
      authorId: '1',
      author: 'johndoe',
      createdAt: '2024-01-15',
      tags: ['react', 'javascript'],
      likes: 5,
      likedBy: ['2']
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      content: 'TypeScript adds type safety to JavaScript applications...',
      authorId: '2',
      author: 'janedoe',
      createdAt: '2024-01-16',
      tags: ['typescript', 'javascript'],
      likes: 3,
      likedBy: ['1']
    }
  ];
  
  private comments: Comment[] = [];
  private currentUser: User | null = null;

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  signup(username: string, email: string, password: string): boolean {
    const exists = this.users.find(u => u.username === username || u.email === email);
    if (exists) return false;
    
    const user: User = {
      id: Date.now().toString(),
      username,
      email
    };
    this.users.push(user);
    this.currentUser = user;
    return true;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPost(id: string): Post | undefined {
    return this.posts.find(p => p.id === id);
  }

  createPost(title: string, content: string, tags: string[]): string {
    if (!this.currentUser) throw new Error('Not authenticated');
    
    const post: Post = {
      id: Date.now().toString(),
      title,
      content,
      authorId: this.currentUser.id,
      author: this.currentUser.username,
      createdAt: new Date().toISOString().split('T')[0],
      tags,
      likes: 0,
      likedBy: []
    };
    this.posts.unshift(post);
    return post.id;
  }

  updatePost(id: string, title: string, content: string, tags: string[]): boolean {
    const post = this.posts.find(p => p.id === id);
    if (!post || post.authorId !== this.currentUser?.id) return false;
    
    post.title = title;
    post.content = content;
    post.tags = tags;
    return true;
  }

  deletePost(id: string): boolean {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1 || this.posts[index].authorId !== this.currentUser?.id) return false;
    
    this.posts.splice(index, 1);
    this.comments = this.comments.filter(c => c.postId !== id);
    return true;
  }

  toggleLike(postId: string): void {
    if (!this.currentUser) return;
    
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    
    const index = post.likedBy.indexOf(this.currentUser.id);
    if (index === -1) {
      post.likedBy.push(this.currentUser.id);
      post.likes++;
    } else {
      post.likedBy.splice(index, 1);
      post.likes--;
    }
  }

  addComment(postId: string, content: string): void {
    if (!this.currentUser) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      authorId: this.currentUser.id,
      author: this.currentUser.username,
      content,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.comments.push(comment);
  }

  getComments(postId: string): Comment[] {
    return this.comments.filter(c => c.postId === postId);
  }

  searchPosts(query: string): Post[] {
    return this.posts.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const store = new BlogStore();
 