import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onEdit, onDelete }: BookCardProps) => {
  const getRandomColor = () => {
    const colors = ['bg-purple-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-yellow-100'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className={`${getRandomColor()} border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-gray-500 mb-2">Published: {book.publishedYear}</p>
            {book.description && (
              <p className="text-gray-600 text-sm">{book.description}</p>
            )}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(book)}
              className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={16} />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(book._id)}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookCard;