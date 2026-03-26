// Image caching and preloading utility to prevent fetch errors

const imageCache = new Map<string, boolean>();

export function preloadImage(src: string): Promise<void> {
  // Check if already cached
  if (imageCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      imageCache.set(src, true);
      resolve();
    };

    img.onerror = () => {
      imageCache.set(src, false);
      reject(new Error(`Failed to load image: ${src}`));
    };

    // Add crossOrigin to prevent CORS issues
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map((url) => preloadImage(url).catch(() => {})));
}

export function isImageCached(src: string): boolean {
  return imageCache.has(src) && imageCache.get(src) === true;
}

// Preload critical images on app start
export function preloadCriticalImages() {
  const criticalImages: string[] = [
    // Add any hero images or above-the-fold images here
  ];

  return preloadImages(criticalImages);
}
