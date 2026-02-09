# Sentry Error Monitoring Setup

## What's Configured

Sentry error monitoring has been integrated into the application to track production errors and crashes.

## Features Enabled

- **Error Tracking**: Automatic capture of all JavaScript errors
- **Performance Monitoring**: Track page load times and API calls
- **Session Replay**: Watch what users did before an error occurred (privacy-safe with masking)
- **Error Context**: Full stack traces and error details
- **Production Only**: Sentry only initializes in production builds, not during development

## Setup Instructions

1. **Create a Sentry Account**
   - Go to https://sentry.io
   - Sign up for a free account
   - Create a new project and select "React"

2. **Get Your DSN**
   - After creating the project, Sentry will show you a DSN (Data Source Name)
   - It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

3. **Add to Environment Variables**
   - Add to your `.env` file:
     ```bash
     VITE_SENTRY_DSN=your_sentry_dsn_here
     ```
   - Deploy with this environment variable set

4. **Verify Setup**
   - Deploy your app with the Sentry DSN configured
   - Trigger a test error
   - Check your Sentry dashboard for the error report

## What Gets Tracked

- All unhandled JavaScript errors
- React component errors (via ErrorBoundary)
- Failed API calls
- Navigation errors
- Performance metrics

## Privacy & Security

- User data is masked in session replays
- Passwords and sensitive inputs are never captured
- Only errors and performance data are sent to Sentry
- Configure data scrubbing rules in Sentry dashboard for additional protection

## Cost

- Free tier: 5,000 errors/month
- Good for most small to medium applications
- Upgrade if you need more capacity

## How It Works

When an error occurs:
1. The error is caught by the ErrorBoundary or automatic handlers
2. Error details are sent to Sentry (only in production)
3. You receive an email notification (configurable)
4. View full details in Sentry dashboard
5. See session replay of what user did before error
6. Get stack trace and breadcrumbs for debugging

## Optional: Configure Alerts

In Sentry dashboard, you can set up:
- Email alerts for new errors
- Slack notifications
- Issue assignment workflows
- Performance degradation alerts
