import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, trackUserInteraction } from '../utils/gtm';

/**
 * Custom hook for GTM tracking
 */
export const useGTMTracking = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    const pageTitle = document.title || 'HopeOps NGO';
    const pagePath = location.pathname + location.search;
    
    trackPageView(pagePath, pageTitle);
  }, [location]);

  return {
    trackEvent,
    trackUserInteraction,
    trackPageView,
  };
};

/**
 * Higher-order component to wrap components with GTM tracking
 */
export const withGTMTracking = (WrappedComponent, componentName) => {
  return function GTMTrackedComponent(props) {
    const tracking = useGTMTracking();

    useEffect(() => {
      tracking.trackEvent('component_mount', 'navigation', componentName);
    }, [tracking]);

    return React.createElement(WrappedComponent, { ...props, tracking });
  };
};

export default useGTMTracking;
