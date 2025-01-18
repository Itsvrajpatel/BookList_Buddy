export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    publishedYear: number;
    userId: string;
    createdAt: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
  }
  
  export interface AuthResponse {
    token: string;
    userId: string;
  }
  
  export interface FormData {
    title: string;
    author: string;
    description: string;
    publishedYear: number;
  }