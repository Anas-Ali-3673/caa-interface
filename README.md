# CAA Security Demo - Frontend

This is the frontend interface for the CAA (Confidentiality, Availability, Accountability) security demonstration application built with Next.js.

## Features

### 🔒 Confidentiality via Access Control
- **Role-based Authentication**: Admin and User roles with different permissions
- **Data Isolation**: Users can only see and modify their own tickets
- **Admin Override**: Admins can view and manage all tickets
- **Protected Routes**: Authentication required for all functional pages

### 🔧 Availability via Dual Database Setup
- **Primary/Secondary Database**: Automatic failover capability
- **Admin Controls**: Toggle primary database on/off to simulate failures
- **Seamless Operation**: Application continues working when primary DB is down
- **Status Monitoring**: Real-time database status display in admin panel

### 📝 Accountability via Audit Logs
- **Complete Audit Trail**: Every user action is logged with timestamps
- **User Identification**: Track who performed what action
- **Admin-Only Access**: Audit logs are only visible to administrators
- **Detailed Logging**: Action details, user roles, and metadata captured

## Project Structure

```
app/
├── (auth)/
│   ├── sign-in/
│   │   └── page.tsx                    # Sign-in page with authentication
│   └── sign-up/
│       └── page.tsx                    # Sign-up page with registration
├── admin/
│   ├── components/
│   │   ├── AdminHeader.tsx             # Admin panel header
│   │   ├── AuditLogs.tsx               # Audit logs display with pagination
│   │   ├── DatabaseControl.tsx         # Database availability controls
│   │   ├── ErrorDisplay.tsx            # Reusable error display component
│   │   └── SecuritySummary.tsx         # Security features summary
│   ├── hooks/
│   │   └── useAdminData.ts             # Custom hook for admin data management
│   └── page.tsx                        # Admin panel main page
├── dashboard/
│   ├── components/
│   │   ├── CreateTicketForm.tsx        # Ticket creation form
│   │   ├── DashboardHeader.tsx         # Dashboard header with navigation
│   │   └── TicketsList.tsx             # Tickets list with admin/user views
│   └── page.tsx                        # Main dashboard page
├── context/
│   ├── authContext.ts                  # Authentication context definitions
│   └── AuthProvider.tsx                # Authentication provider with API integration
├── lib/
│   ├── api.ts                          # API client and helper functions
│   └── auth.ts                         # Authentication utilities
├── layout.tsx                          # Root layout with AuthProvider
└── page.tsx                            # Home page with auto-redirect

```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running on port 3000 (adjust in .env.local if different)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

For testing purposes, use these credentials (ensure they exist in your backend):

**Admin User:**
- Email: admin@example.com
- Password: password123
- Role: admin

**Regular User:**
- Email: user@example.com
- Password: password123
- Role: user

## Usage Guide

### For Regular Users
1. **Login**: Use the login page to authenticate
2. **Dashboard**: View and manage your own tickets
3. **Create Tickets**: Submit new support requests
4. **Update Status**: Change ticket status (open, in-progress, closed)
5. **Delete Tickets**: Remove your own tickets

### For Administrators
1. **Login**: Use admin credentials to access full features
2. **Dashboard**: View and manage ALL tickets from all users
3. **Admin Panel**: Access via "Admin Panel" button in dashboard header
4. **Audit Logs**: View complete audit trail of all user actions
5. **Database Control**: Toggle primary database to test availability
6. **System Monitoring**: Monitor database status and system health

## Security Features Demonstration

### Testing Confidentiality
1. Login as a regular user and create some tickets
2. Note that you can only see your own tickets
3. Login as admin and observe you can see all tickets
4. Try accessing admin-only features as a regular user (should be blocked)

### Testing Availability
1. Login as admin and go to Admin Panel
2. Use "Simulate DB Failure" button to disable primary database
3. Continue using the application - it should work seamlessly
4. Check that all operations still function with secondary database
5. Restore primary database when testing is complete

### Testing Accountability
1. Perform various actions (login, create tickets, update, delete)
2. Login as admin and check the Audit Logs section
3. Verify all actions are logged with:
   - User identification
   - Action details
   - Timestamps
   - User roles

## Technical Implementation

### Authentication
- JWT-based authentication with localStorage storage
- Automatic token refresh and session management
- Protected routes with useAuth hook
- Role-based access control throughout the application

### API Integration
- RESTful API client with error handling
- Automatic retry logic for failed requests
- Token-based authentication for all API calls
- Type-safe API response handling

### State Management
- React Context for global authentication state
- Local state for component-specific data
- Automatic redirect handling for authentication flows

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Automatic fallback for network issues
- Database unavailability handling

## Troubleshooting

### Common Issues

1. **Login Issues**: Ensure backend is running on correct port (default: 3000)
2. **CORS Errors**: Check backend CORS configuration allows frontend origin
3. **API Errors**: Verify environment variables and network connectivity
4. **Role Case Sensitivity**: Backend returns 'Admin' role, frontend handles both 'Admin' and 'admin'

### Development Notes

- Component-based architecture for better maintainability
- Custom hooks for data fetching and state management
- Reusable components across admin and dashboard pages
- Type-safe with TypeScript interfaces
- Check browser console for detailed error messages
- Ensure backend API is running and accessible

## Building for Production

```bash
npm run build
npm start
```

## Architecture Highlights

### Component Structure
- **Modular Components**: Separated into smaller, reusable components
- **Custom Hooks**: useAdminData for admin-specific data management
- **Shared Components**: ErrorDisplay used across multiple pages
- **Type Safety**: Full TypeScript support with proper interfaces

### Features Implemented
- ✅ JWT-based authentication with auto-login
- ✅ Role-based access control (Admin/User)
- ✅ Pagination for audit logs (10 items per page)
- ✅ Real-time ticket management
- ✅ Database failover simulation
- ✅ Complete audit trail
- ✅ Form validation with Zod
- ✅ Responsive design with Tailwind CSS

## Next Steps

- Add unit and integration tests
- Implement real-time updates with WebSockets
- Add ticket filtering and search functionality
- Enhance UI/UX with animations
- Add proper logging and monitoring
- Implement refresh token mechanism
