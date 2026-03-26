// Global error handler to suppress common fetch errors for images

export function initializeErrorHandler() {
  // Suppress image loading errors from cluttering the console
  const originalError = console.error;
  
  console.error = (...args: unknown[]) => {
    // Filter out common image loading errors
    const message = args.join(' ');
    
    // Ignore image fetch errors
    if (
      message.includes('Failed to fetch') ||
      message.includes('NetworkError') ||
      message.includes('Failed to load resource') ||
      message.includes('ERR_BLOCKED_BY_CLIENT') ||
      message.includes('net::ERR_')
    ) {
      // Silently ignore these - images will use fallback
      return;
    }
    
    // Call original error for everything else
    originalError.apply(console, args);
  };

  // Add global error event listener for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason);
    
    // Suppress image-related promise rejections
    if (
      message.includes('Failed to fetch') ||
      message.includes('NetworkError') ||
      message.includes('Failed to load')
    ) {
      event.preventDefault();
      // Silently handle - images will use fallback
      return;
    }
  });

  // Add global error event listener
  window.addEventListener('error', (event) => {
    // Suppress resource loading errors (like images)
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
      return;
    }
    
    const message = event.message || '';
    if (
      message.includes('Failed to fetch') ||
      message.includes('NetworkError')
    ) {
      event.preventDefault();
      return;
    }
  }, true);
}
