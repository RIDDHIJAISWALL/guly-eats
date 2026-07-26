import morgan from 'morgan';

// Custom token for response time with color
morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // red
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // yellow
  if (status >= 300) return `\x1b[36m${status}\x1b[0m`; // cyan
  return `\x1b[32m${status}\x1b[0m`; // green
});

// Custom format: method url status responseTime
const logFormat = ':method :url :colored-status :response-time ms';

const logger = morgan(logFormat, {
  skip: (req) => {
    // Skip health check logs to reduce noise
    return req.url === '/api/health';
  },
});

export default logger;
