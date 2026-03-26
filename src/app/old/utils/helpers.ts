/**
 * Smooth scroll to a section by ID
 */
export const scrollToSection = (id: string, callback?: () => void) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    callback?.();
  }
};

/**
 * Get icon component by name string
 */
export const getIconByName = (iconName: string) => {
  // This will be used for dynamic icon imports
  return iconName;
};
