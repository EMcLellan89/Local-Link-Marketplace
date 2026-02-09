# Admin Appointment & Calendar System Guide

## Overview

Your Local Link platform now includes a comprehensive admin system with appointment booking and calendar management. When customers select a plan on the "Drive Repeat Business" page, they book an appointment that goes directly to your admin calendar.

## Key Features

### 1. Customer Booking Flow
- Customers select a Drive Repeat Business plan (Starter, Growth, or Scale)
- A booking modal appears for them to schedule an appointment
- They provide their name, email, and phone number
- They select an available date and time from weekdays 9 AM - 5:30 PM
- System checks for double-booking automatically
- Confirmation is sent upon successful booking

### 2. Admin Dashboard
- Access at: `/admin/dashboard`
- Login credentials:
  - **Email:** admin@locallink.com
  - **Password:** admin123
- Free access (no payment required)

### 3. Dashboard Features

#### Overview Tab
- Total merchants, customers, deals, and revenue
- Active subscriptions count
- Upcoming appointments counter
- Printing orders and CRM leads
- Platform health metrics
- Quick actions panel

#### Calendar Tab
- View all appointments (past and upcoming)
- Complete appointment details including:
  - Customer name, email, and phone
  - Appointment type and duration
  - Date and time
  - Special notes
- Action buttons to complete or cancel appointments
- Visual status indicators (scheduled, completed, cancelled)

#### Other Tabs
- Merchants: View and manage merchant accounts
- Customers: Customer management
- Financials: Revenue tracking and subscription metrics

## How Appointments Work

### For Customers
1. Customer visits "Drive Repeat Business" page
2. Selects a plan (Starter $79, Growth $99, or Scale $159)
3. Fills out their information
4. Chooses available date and time
5. Receives confirmation immediately

### For Admins
1. Notification sent to apptpipeline@gmail.com (via edge function)
2. Appointment appears in admin calendar instantly
3. View full details in Calendar tab
4. Mark as complete after the call
5. Track all appointment history

### Double-Booking Prevention
- System automatically checks for existing appointments at selected time
- Blocks duplicate bookings
- Shows error message if slot is taken
- Ensures no scheduling conflicts

## Admin Login Instructions

1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: admin@locallink.com
   - Password: admin123
3. Access full admin dashboard
4. Sessions last 7 days before requiring re-login

## Database Tables

### appointments
- Stores all customer appointments
- Fields: customer info, appointment date/time, type, status, notes
- Indexed for fast retrieval

### admin_users
- Stores admin credentials
- Separate from regular user authentication
- Secure session management

### admin_sessions
- Manages admin login sessions
- Automatic expiration after 7 days
- Token-based authentication

## Email Notifications

An edge function sends appointment details to apptpipeline@gmail.com including:
- Customer name and contact info
- Selected plan type
- Appointment date and time
- Appointment ID for reference

## Statistics Tracked

The admin dashboard pulls data from all platform tables:
- Total merchants and customers
- Active vs pending deals
- Revenue and purchases
- Subscriptions
- Appointments
- Printing orders
- CRM leads
- Reviews and ratings

## Security Features

- Separate authentication system for admins
- Row-level security policies on all tables
- Session expiration
- Protected admin routes
- No public access to admin functions

## Best Practices

1. Check the calendar daily for new appointments
2. Mark appointments as complete after calls
3. Review appointment notes before calls
4. Use the contact information provided
5. Update appointment status to keep calendar accurate

## Future Enhancements

The system is designed to be expanded with:
- Email reminders for appointments
- Calendar sync with Google Calendar
- SMS notifications
- Rescheduling capabilities
- Video call integration
- Appointment history analytics
