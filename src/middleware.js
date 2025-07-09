import { defineMiddleware } from 'astro:middleware';

// Track IP addresses and their download timestamps
const downloadTracker = new Map();
// Set download limits
const DOWNLOAD_LIMIT = 4;         // Downloads allowed
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const CV_PATH = '/CV-Ignacio-new-design.pdf';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = new URL(context.request.url);

  // Only apply rate limiting to CV downloads
  if (pathname === CV_PATH) {
    // Get IP address from headers
    const ip = context.request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Get download history for this IP
    const history = downloadTracker.get(ip) || [];
    
    // Clean up old entries outside our time window
    const recentDownloads = history.filter(time => (now - time) < TIME_WINDOW);
    
    // Check if download limit has been reached
    if (recentDownloads.length >= DOWNLOAD_LIMIT) {
      // Return a 429 Too Many Requests response
      return new Response('Too many download requests. Please try again later.', {
        status: 429,
        headers: {
          'Retry-After': '3600', // Try again in 1 hour
          'Content-Type': 'text/plain',
        },
      });
    }
    
    // Allow the download and update history
    recentDownloads.push(now);
    downloadTracker.set(ip, recentDownloads);
    
    // Regularly clean up the map to prevent memory leaks
    // This is a simple approach; a production system would use a more robust solution
    if (downloadTracker.size > 10000) {
      // Clean up IPs with no recent downloads
      for (const [ip, times] of downloadTracker.entries()) {
        const hasRecentDownload = times.some(time => (now - time) < TIME_WINDOW);
        if (!hasRecentDownload) {
          downloadTracker.delete(ip);
        }
      }
    }
  }

  // Always allow the request to continue for non-CV paths or if within rate limits
  return next();
}); 