import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import useAuthStore from '@/stores/authStore';

const ReviewForm = ({ placeId, onReviewAdded }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
        <p className="text-gray-600 mb-3">Please log in to share your experience.</p>
        <button className="btn btn-primary rounded-xl px-6 py-2">Log In to Review</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!title.trim() || !text.trim()) {
      setError('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/reviews/${placeId}`, { rating, title, text });
      onReviewAdded(res.data.data);
      setRating(0);
      setTitle('');
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <h3 className="text-lg font-bold font-heading mb-4 text-gray-800">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700 mr-2">Your Rating:</span>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
            >
              <Star
                size={24}
                className={`transition-colors ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Summary of your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          maxLength={100}
        />
        <textarea
          placeholder="Tell others what you loved or what could be better..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none h-28"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary rounded-xl px-6 py-2.5 flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              Submit Review <Send size={16} />
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default ReviewForm;
