// Rails API Configuration
// Configure your Rails backend API URL

export const railsConfig = {
  // Rails API Base URL
  baseUrl: process.env.RAILS_API_URL || process.env.NEXT_PUBLIC_RAILS_API_URL || 'http://localhost:3000/api',
};

// Validation function
export const validateCircleConfig = () => {
  if (!railsConfig.baseUrl) {
    console.warn('Rails API URL not configured. Please set RAILS_API_URL or NEXT_PUBLIC_RAILS_API_URL in your environment variables.');
    return false;
  }
  return true;
};
