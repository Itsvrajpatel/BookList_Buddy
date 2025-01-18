import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Book } from '@/types';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[]; 
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'title' | 'author' | 'publishedYear';
  setSortBy: (sortBy: 'title' | 'author' | 'publishedYear') => void;
}

const BookList = ({
  books,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy
}: BookListProps) => {
  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'publishedYear') return b.publishedYear - a.publishedYear;
      return a[sortBy].localeCompare(b[sortBy]);
    });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author, or description..."
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg inline-block">
            <p className="text-gray-600 text-lg">
              {searchTerm 
                ? "No books found matching your search. Try different keywords."
                : "Your library is empty. Start by adding some books!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 text-center text-gray-500"
      >
        {filteredBooks.length > 0 && (
          <p>Showing {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}</p>
        )}
      </motion.div>
    </div>
  );
};

export default BookList;
