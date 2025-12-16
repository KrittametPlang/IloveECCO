/**
 * Date Utilities
 * Shared date formatting functions for the borrow system
 */

/**
 * Format date string to Thai locale
 * @param {string} dateString - Date string in ISO format or similar
 * @returns {string} Formatted date in Thai locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date to short format (DD/MM/YYYY)
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};
