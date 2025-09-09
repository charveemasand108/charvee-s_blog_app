export  interface User {
  id: string;
  username: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: string;
  createdAt: string;
  tags: string[];
  likes: number;
  likedBy: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
}

export type UserRole = 'user' | 'admin';
 