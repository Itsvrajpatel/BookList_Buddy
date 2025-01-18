import { FormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface BookFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const BookForm = ({ formData, setFormData, onSubmit, isEditing }: BookFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <Card className="border-0 shadow-lg bg-white backdrop-blur-lg bg-opacity-90">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-600">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Author"
                className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Publication Year"
                className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.publishedYear || ''}
                onChange={(e) => setFormData({...formData, publishedYear: parseInt(e.target.value)})}
                required
              />
              <textarea
                placeholder="Description"
                className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              {isEditing ? 'Update Book' : 'Add Book'}
            </motion.button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookForm;