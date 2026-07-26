import { Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-3xl border border-gray-100">
        <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden">
                {review.user?.avatar ? (
                  <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{review.user?.name || 'Anonymous'}</h4>
                <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'fill-current' : 'text-gray-200'}
                />
              ))}
            </div>
          </div>
          <h5 className="font-semibold text-gray-800 text-sm mb-1">{review.title}</h5>
          <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;
