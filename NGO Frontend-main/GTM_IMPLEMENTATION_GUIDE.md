# Google Tag Manager (GTM) Implementation Guide

This guide explains how Google Tag Manager is implemented in the HopeOps NGO Frontend application.

## Setup

### 1. Environment Variables

The GTM Container ID is configured using environment variables in the `.env` file:

```properties
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
```

**Important:** Replace `GTM-XXXXXXX` with your actual GTM Container ID from Google Tag Manager.

### 2. Installation

The required package is already installed:

```bash
npm install react-gtm-module
```

### 3. Configuration Files

#### GTM Utility (`src/utils/gtm.js`)
- Initializes GTM with environment variables
- Provides functions for tracking events and page views
- Handles error cases when GTM is not configured

#### GTM Tracking Hook (`src/hooks/useGTMTracking.js`)
- Automatically tracks page views on route changes
- Provides tracking functions for components
- Can be used as a Higher-Order Component

## Usage

### Automatic Page Tracking

Page views are automatically tracked when users navigate between routes. This is handled in the `RoutesWrapper` component in `App.jsx`.

### Manual Event Tracking

#### In Components

```jsx
import { trackEvent, trackUserInteraction } from '../utils/gtm';

// Track button clicks
const handleButtonClick = () => {
  trackEvent('button_click', 'engagement', 'donate_button');
};

// Track user interactions
const handleDonation = (amount, type) => {
  trackUserInteraction('donation_completed', {
    amount: amount,
    donation_type: type,
    timestamp: new Date().toISOString()
  });
};
```

#### Using the Hook

```jsx
import { useGTMTracking } from '../hooks/useGTMTracking';

const MyComponent = () => {
  const { trackEvent, trackUserInteraction } = useGTMTracking();
  
  const handleAction = () => {
    trackEvent('custom_action', 'user_engagement', 'action_label');
  };
  
  return <button onClick={handleAction}>Click me</button>;
};
```

## Available Tracking Functions

### `trackEvent(action, category, label, value)`
- **action**: The action that was performed (e.g., 'click', 'download')
- **category**: The category of the event (e.g., 'engagement', 'navigation')
- **label**: Optional label for additional context
- **value**: Optional numeric value

### `trackUserInteraction(interaction, data)`
- **interaction**: Type of interaction (e.g., 'donation', 'adoption_request')
- **data**: Additional data object with relevant information

### `trackPageView(page, title)`
- **page**: The page path
- **title**: The page title

## Common Tracking Examples

### Donation Tracking
```jsx
// When a donation is initiated
trackUserInteraction('donation_initiated', {
  amount: donationAmount,
  donation_type: donationType,
  user_type: user ? 'logged_in' : 'guest'
});

// When a donation is completed
trackUserInteraction('donation_completed', {
  amount: finalAmount,
  payment_method: 'razorpay',
  transaction_id: paymentId
});
```

### Adoption Tracking
```jsx
// When adoption form is submitted
trackUserInteraction('adoption_request_submitted', {
  animal_id: animalId,
  animal_type: animalType,
  user_id: userId
});
```

### Navigation Tracking
```jsx
// Track specific navigation events
trackEvent('navigation', 'menu_click', 'rescue_operations');
```

## GTM Container Setup

### Required Tags in GTM

1. **Google Analytics 4 (GA4)** - For web analytics
2. **Facebook Pixel** - For social media tracking (if needed)
3. **Custom HTML Tags** - For any additional tracking

### Recommended Triggers

1. **Page View** - Fires on all pages
2. **Custom Events** - Based on the events sent from the application
3. **User Interactions** - For donation and adoption tracking

### Custom Variables

Set up these variables in GTM to capture data from the application:

- `page_title` - Page title
- `page_location` - Page URL
- `event_action` - Action performed
- `event_category` - Event category
- `event_label` - Event label
- `interaction_type` - Type of user interaction
- `donation_amount` - Amount donated
- `animal_id` - ID of animal involved in interaction

## Testing

### Development Testing

1. Use GTM Preview mode to test tags
2. Check browser console for GTM initialization messages
3. Verify that events are being sent using GTM Preview

### Production Verification

1. Use Google Tag Assistant browser extension
2. Check Google Analytics Real-time reports
3. Verify events in GTM's real-time view

## Troubleshooting

### Common Issues

1. **GTM not initializing**: Check that `VITE_GTM_CONTAINER_ID` is set correctly
2. **Events not firing**: Verify that GTM container ID is not the placeholder `GTM-XXXXXXX`
3. **Page views not tracking**: Ensure `useGTMTracking` hook is called in `RoutesWrapper`

### Debug Mode

The GTM utility includes console warnings when:
- GTM Container ID is not found
- GTM Container ID is still the placeholder value
- Events are sent without proper GTM configuration

## Performance Considerations

- GTM is initialized only once when the app starts
- Events are sent asynchronously and don't block the UI
- Page view tracking happens automatically on route changes
- Failed GTM calls are handled gracefully without breaking the app

## Security Notes

- GTM Container ID is safe to expose in client-side code
- Sensitive user data should not be sent to GTM
- Always validate and sanitize data before sending to GTM
