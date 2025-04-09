const client = require('prom-client');

// Create a Registry to register metrics
const register = new client.Registry();

// Add a default label to all metrics
client.collectDefaultMetrics({
  register,
  prefix: 'travelplanner_'
});

// Create a counter for HTTP requests
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// Create the middleware function
const requestCountMiddleware = (req, res, next) => {
  // Record the start time
  const start = Date.now();
  
  // Override res.end to capture the status code
  const originalEnd = res.end;
  res.end = function(...args) {
    // Calculate request duration
    const duration = Date.now() - start;
    
    // Increment counter with appropriate labels
    httpRequestsTotal.inc({
      method: req.method,
      route: req.originalUrl || req.url,
      status: res.statusCode
    });
    
    // Call the original end method
    return originalEnd.apply(res, args);
  };
  
  // Continue to the next middleware
  next();
};

// Export both the middleware and the register
module.exports = requestCountMiddleware;
module.exports.register = register;