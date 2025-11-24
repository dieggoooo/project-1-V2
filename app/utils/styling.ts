/**
 * CrewGalley - Shared Styling Utilities
 * 
 * Centralized functions for consistent styling across the application
 */

// ======================
// STOCK LEVEL UTILITIES
// ======================

/**
 * Get stock level badge class based on percentage
 * @param percentage - Stock percentage (0-100)
 * @returns Tailwind class string for badge
 */
export const getStockLevelClass = (percentage: number): string => {
  if (percentage === 0) return 'stock-empty';
  if (percentage <= 25) return 'stock-low';
  if (percentage <= 50) return 'stock-medium';
  return 'stock-full';
};

/**
 * Get stock level background class based on percentage
 * @param percentage - Stock percentage (0-100)
 * @returns Tailwind class string for background
 */
export const getStockLevelBg = (percentage: number): string => {
  if (percentage === 0) return 'bg-stock-empty';
  if (percentage <= 25) return 'bg-stock-low';
  if (percentage <= 50) return 'bg-stock-medium';
  return '';
};

/**
 * Get stock level text color class based on percentage
 * @param percentage - Stock percentage (0-100)
 * @returns Tailwind class string for text color
 */
export const getStockLevelTextClass = (percentage: number): string => {
  if (percentage === 0) return 'text-stock-empty';
  if (percentage <= 25) return 'text-stock-low';
  if (percentage <= 50) return 'text-stock-medium';
  return 'text-stock-full';
};

/**
 * Get progress bar color class based on percentage
 * @param percentage - Stock percentage (0-100)
 * @returns Tailwind class string for progress bar
 */
export const getProgressBarClass = (percentage: number): string => {
  if (percentage >= 70) return 'progress-full';
  if (percentage >= 40) return 'progress-medium';
  return 'progress-low';
};

/**
 * Get stock level category label
 * @param percentage - Stock percentage (0-100)
 * @returns Category label string
 */
export const getStockLevelLabel = (percentage: number): string => {
  if (percentage === 0) return 'Empty';
  if (percentage <= 25) return 'Low';
  if (percentage <= 50) return 'Medium';
  if (percentage <= 75) return 'Good';
  return 'Full';
};

// ======================
// SEVERITY UTILITIES
// ======================

/**
 * Get severity badge class
 * @param severity - 'low' | 'medium' | 'high'
 * @returns Tailwind class string
 */
export const getSeverityClass = (severity: 'low' | 'medium' | 'high'): string => {
  switch (severity) {
    case 'low': return 'severity-low';
    case 'medium': return 'severity-medium';
    case 'high': return 'severity-high';
    default: return 'severity-medium';
  }
};

// ======================
// STATUS UTILITIES
// ======================

/**
 * Get status badge class
 * @param status - 'open' | 'resolved'
 * @returns Tailwind class string
 */
export const getStatusClass = (status: 'open' | 'resolved'): string => {
  return status === 'open' ? 'status-open' : 'status-resolved';
};

// ======================
// PASSENGER IMPACT UTILITIES
// ======================

type PassengersAffected = 'NA' | '0-10' | '10-25' | '25-50' | '50-75' | '75-100';

/**
 * Get passengers affected badge class
 * @param passengers - Passenger range
 * @returns Tailwind class string
 */
export const getPassengersAffectedClass = (passengers: PassengersAffected): string => {
  switch (passengers) {
    case 'NA': return 'bg-gray-100 text-gray-700';
    case '0-10': return 'bg-green-100 text-green-700';
    case '10-25': return 'bg-yellow-100 text-yellow-700';
    case '25-50': return 'bg-orange-100 text-orange-700';
    case '50-75': return 'bg-red-100 text-red-700';
    case '75-100': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Get passengers affected label
 * @param passengers - Passenger range
 * @returns Formatted label string
 */
export const getPassengersAffectedLabel = (passengers: PassengersAffected): string => {
  return passengers === 'NA' ? 'No PAX Impact' : `${passengers}% PAX`;
};

// ======================
// GALLEY TYPE UTILITIES
// ======================

type GalleyType = 'First Class' | 'Business Class' | 'Economy' | 'Utility';

/**
 * Get galley type color class
 * @param type - Galley type
 * @returns Tailwind class string
 */
export const getGalleyTypeClass = (type: GalleyType): string => {
  switch (type) {
    case 'First Class': return 'bg-purple-500 border-purple-600 text-white';
    case 'Business Class': return 'bg-blue-500 border-blue-600 text-white';
    case 'Economy': return 'bg-green-500 border-green-600 text-white';
    case 'Utility': return 'bg-gray-500 border-gray-600 text-white';
    default: return 'bg-gray-400 border-gray-500 text-white';
  }
};

// ======================
// CATEGORY UTILITIES
// ======================

type CategoryType = 'liquids' | 'food' | 'miscellaneous' | 'bar' | 'otros' | 'empty';

/**
 * Get category color class
 * @param category - Category type
 * @returns Tailwind class string
 */
export const getCategoryClass = (category: CategoryType): string => {
  switch (category) {
    case 'liquids': return 'bg-blue-200 border-blue-300 text-blue-800';
    case 'food': return 'bg-orange-200 border-orange-300 text-orange-800';
    case 'miscellaneous': return 'bg-green-200 border-green-300 text-green-800';
    case 'bar': return 'bg-red-200 border-red-300 text-red-800';
    case 'otros': return 'bg-purple-200 border-purple-300 text-purple-800';
    case 'empty': return 'bg-gray-100 border-gray-300 text-gray-600';
    default: return 'bg-gray-100 border-gray-300 text-gray-600';
  }
};

// ======================
// POSITION SIZE UTILITIES
// ======================

type PositionSize = 'small' | 'medium' | 'large';

/**
 * Get position size class
 * @param size - Position size
 * @returns Tailwind class string
 */
export const getPositionSizeClass = (size: PositionSize): string => {
  switch (size) {
    case 'small': return 'h-16';
    case 'medium': return 'h-20';
    case 'large': return 'h-32';
    default: return 'h-20';
  }
};

// ======================
// ICON UTILITIES
// ======================

type IssueType = 'misplacement' | 'damage' | 'missing' | 'monetary-consumption' | 'customer-impact' | 'other';

/**
 * Get issue type icon class
 * @param type - Issue type
 * @returns RemixIcon class string
 */
export const getIssueTypeIcon = (type: IssueType): string => {
  switch (type) {
    case 'misplacement': return 'ri-map-pin-line';
    case 'damage': return 'ri-tools-line';
    case 'missing': return 'ri-error-warning-line';
    case 'monetary-consumption': return 'ri-money-dollar-circle-line';
    case 'customer-impact': return 'ri-user-heart-line';
    case 'other': return 'ri-question-line';
    default: return 'ri-alert-line';
  }
};

/**
 * Get issue type label
 * @param type - Issue type
 * @returns Formatted label string
 */
export const getIssueTypeLabel = (type: IssueType): string => {
  switch (type) {
    case 'misplacement': return 'Item Misplacement';
    case 'damage': return 'Damage/Broken';
    case 'missing': return 'Missing Item';
    case 'monetary-consumption': return 'Monetary Consumption';
    case 'customer-impact': return 'Customer Impact';
    case 'other': return 'Other Issue';
    default: return type;
  }
};

// ======================
// SORTING UTILITIES
// ======================

/**
 * Get sort icon based on current sort state
 * @param column - Column being sorted
 * @param sortBy - Current sort column
 * @param sortOrder - Current sort order
 * @returns RemixIcon class string
 */
export const getSortIcon = (column: string, sortBy: string, sortOrder: 'asc' | 'desc'): string => {
  if (sortBy !== column) return 'ri-arrow-up-down-line';
  return sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
};

// ======================
// FORMAT UTILITIES
// ======================

/**
 * Format percentage for display
 * @param value - Decimal value (0-1) or percentage (0-100)
 * @param asDecimal - Whether input is decimal (default: false)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, asDecimal: boolean = false): string => {
  const percentage = asDecimal ? value * 100 : value;
  return `${Math.round(percentage)}%`;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format date for display
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

// ======================
// VALIDATION UTILITIES
// ======================

/**
 * Check if item is alcohol based on properties
 * @param item - Item with category/type/subcategory
 * @returns Boolean indicating if item is alcohol
 */
export const isAlcoholItem = (item: {
  subcategory?: string;
  type?: string;
  category?: string;
}): boolean => {
  return (
    item.subcategory === 'alcoholic' ||
    item.type === 'Champagne' ||
    item.type === 'Cognac' ||
    item.type === 'Whisky' ||
    item.type === 'Vodka' ||
    item.category === 'alcoholic'
  );
};