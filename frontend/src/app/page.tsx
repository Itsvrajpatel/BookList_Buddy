"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert'; 
import { BookOpen, Plus, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from '@/components/auth/AuthForm';
import BookCard from '@/components/books/BookCard';
import BookForm from '@/components/books/BookForm';
import { useAuth } from '@/components/hooks/useAuth';
import { Book, FormData } from '@/components/types';
import BookList from '@/components/books/BookList';



export default function Home() {
  const { token, login, logout, loading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    description: '',
    publishedYear: new Date().getFullYear()
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'publishedYear'>('title');

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setMessage('Error fetching books');
      if (error.message === 'Invalid token') {
        logout();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:3001/api/books/${editingId}`
        : 'http://localhost:3001/api/books';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',  
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingId ? 'Book updated successfully' : 'Book added successfully');
        setFormData({ title: '', author: '', description: '', publishedYear: new Date().getFullYear() });
        setEditingId(null);
        setShowForm(false);
        fetchBooks();
      }
    } catch (error) {
      setMessage('Error saving book');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Book deleted successfully');
        fetchBooks();
      }
    } catch (error) {
      setMessage('Error deleting book');
    }
  };

  function handleLogout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    logout();
    localStorage.removeItem('token');
  }

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      publishedYear: book.publishedYear
    });
    setEditingId(book._id);
    setShowForm(true);
  };
  <BookList
  books={books}
  onEdit={handleEdit}
  onDelete={handleDelete}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  sortBy={sortBy}
  setSortBy={setSortBy}
/>

  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'publishedYear') return b.publishedYear - a.publishedYear;
      return a[sortBy].localeCompare(b[sortBy]);
    });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <AuthForm onLogin={login} />;
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-purple-600 h-10 w-auto" />
            BookList Buddy
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-purple-700 transition-colors"
          >
            {showForm ? <X /> : <Plus />}
            {showForm ? 'Close Form' : 'Add New Book'}
          </motion.button>
        </div>
        <div className="mb-6 flex gap-4 flex justify-end">
        <button
            onClick={handleLogout}
            className="bg-red-500 flex justify-end text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
          </div>
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'publishedYear')}
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="publishedYear">Sort by Year</option>
          </select>
        </div>

        <AnimatePresence>
          {showForm && (
            <BookForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isEditing={!!editingId}
            />
          )}
        </AnimatePresence>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            </motion.div>
          )}
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredBooks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-lg p-8 shadow-lg inline-block">
                <p className="text-gray-500 text-lg">
                  {searchTerm 
                    ? "No books found matching your search. Try different keywords."
                    : "Your library is empty. Start by adding some books!"}
                </p>
              </div>
            </motion.div>
          )}
        </div>
        <footer className="mt-auto py-10 text-center text-gray-600">
          &copy; {(new Date().getFullYear())} BookList Buddy. All rights reserved.
        </footer>
      </div>
    );
  }


