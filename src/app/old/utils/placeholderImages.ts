// Placeholder images using data URIs to avoid fetch errors
// These are lightweight SVG placeholders that will always work

export const createPlaceholderImage = (
  width: number = 1080,
  height: number = 720,
  text: string = 'Image',
  bgColor: string = '#1d293d',
  textColor: string = '#5cdfff'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="48"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Pre-generated placeholder images for tournaments
export const PLACEHOLDER_IMAGES = {
  cricket: createPlaceholderImage(1080, 720, '🏏 Cricket', '#0f172b', '#5cdfff'),
  football: createPlaceholderImage(1080, 720, '⚽ Football', '#0f172b', '#5cdfff'),
  trophy: createPlaceholderImage(1080, 720, '🏆 Trophy', '#0f172b', '#5cdfff'),
  stadium: createPlaceholderImage(1080, 720, '🏟️ Stadium', '#0f172b', '#5cdfff'),
  analytics: createPlaceholderImage(1080, 720, '📊 Analytics', '#0f172b', '#5cdfff'),
  strategy: createPlaceholderImage(1080, 720, '🎯 Strategy', '#0f172b', '#5cdfff'),
  blog: createPlaceholderImage(1200, 630, '📝 Blog Post', '#0f172b', '#5cdfff'),
};

// Fallback image loader that tries Unsplash first, then falls back to placeholder
export const getImageWithFallback = (
  unsplashUrl: string,
  placeholderType: keyof typeof PLACEHOLDER_IMAGES = 'blog'
): string => {
  // For now, return the Unsplash URL
  // The ImageWithFallback component will handle the error and show a fallback
  return unsplashUrl;
};
