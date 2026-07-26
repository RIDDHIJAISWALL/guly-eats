import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';

const NotFound = () => {
  return (
    <>
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.span
            className="text-8xl block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🍛
          </motion.span>
          <h1
            className="text-6xl font-black mb-2 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            404
          </h1>
          <h2
            className="text-xl font-semibold mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            This plate is empty!
          </h2>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
            The page you're looking for doesn't exist or has been moved. Let's get you back to the feast.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => window.history.back()} className="btn btn-secondary">
              <ArrowLeft size={16} /> Go Back
            </button>
            <Link to="/" className="btn btn-primary">
              <Home size={16} /> Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
