import TagManager from 'react-gtm-module';

// GTM configuration
const GTM_CONFIG = {
  gtmId: import.meta.env.VITE_GTM_CONTAINER_ID,
  dataLayerName: 'dataLayer', // optional
  auth: '', // optional - for GTM environments
  preview: '', // optional - for GTM environments
};

/**
 * Initialize Google Tag Manager
 */
export const initializeGTM = () => {
  if (!GTM_CONFIG.gtmId) {
    console.warn('GTM Container ID not found in environment variables');
    return;
  }

  if (GTM_CONFIG.gtmId === 'GTM-XXXXXXX') {
    console.warn('Please replace GTM-XXXXXXX with your actual GTM Container ID in .env file');
    return;
  }

  TagManager.initialize(GTM_CONFIG);
  console.log('Google Tag Manager initialized with container ID:', GTM_CONFIG.gtmId);
};

/**
 * Send custom events to GTM
 * @param {Object} eventData - Event data to send
 */
export const sendGTMEvent = (eventData) => {
  if (!GTM_CONFIG.gtmId || GTM_CONFIG.gtmId === 'GTM-XXXXXXX') {
    console.warn('GTM not properly configured');
    return;
  }

  TagManager.dataLayer({
    dataLayer: {
      ...eventData,
    },
  });
};

/**
 * Track page views
 * @param {string} page - Page path
 * @param {string} title - Page title
 */
export const trackPageView = (page, title) => {
  sendGTMEvent({
    event: 'page_view',
    page_title: title,
    page_location: page,
  });
};

/**
 * Track custom events
 * @param {string} action - Event action
 * @param {string} category - Event category
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (action, category, label = '', value = null) => {
  const eventData = {
    event: 'custom_event',
    event_action: action,
    event_category: category,
  };

  if (label) eventData.event_label = label;
  if (value !== null) eventData.event_value = value;

  sendGTMEvent(eventData);
};

/**
 * Track user interactions (donations, adoptions, etc.)
 * @param {string} interaction - Type of interaction
 * @param {Object} data - Additional data
 */
export const trackUserInteraction = (interaction, data = {}) => {
  sendGTMEvent({
    event: 'user_interaction',
    interaction_type: interaction,
    ...data,
  });
};

export default {
  initializeGTM,
  sendGTMEvent,
  trackPageView,
  trackEvent,
  trackUserInteraction,
};
