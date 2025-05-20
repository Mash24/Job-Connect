import analytics from 'analytics';
import { getAuth } from 'firebase/auth';

// Initialize analytics
const analyticsInstance = analytics({
  app: 'job-connect',
  version: '1.0.0',
  plugins: [
    // Add your analytics plugins here
  ]
});

// Track page views
export const trackPageView = (pageName) => {
  analyticsInstance.page({
    name: pageName,
    url: window.location.href,
    title: document.title
  });
};

// Track user actions
export const trackUserAction = (action, properties = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  analyticsInstance.track(action, {
    ...properties,
    userId: user?.uid,
    timestamp: new Date().toISOString()
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName, properties = {}) => {
  trackUserAction('feature_used', {
    feature: featureName,
    ...properties
  });
};

// Track job search
export const trackJobSearch = (searchParams) => {
  trackUserAction('job_search', {
    query: searchParams.query,
    filters: searchParams.filters,
    resultsCount: searchParams.resultsCount
  });
};

// Track job application
export const trackJobApplication = (jobId, status) => {
  trackUserAction('job_application', {
    jobId,
    status,
    timestamp: new Date().toISOString()
  });
};

// Track profile updates
export const trackProfileUpdate = (updateType) => {
  trackUserAction('profile_update', {
    updateType,
    timestamp: new Date().toISOString()
  });
};

// Track section visibility
export const trackSectionVisibility = (sectionName) => {
  trackUserAction('section_viewed', {
    section: sectionName,
    timestamp: new Date().toISOString()
  });
};

export default analyticsInstance; 