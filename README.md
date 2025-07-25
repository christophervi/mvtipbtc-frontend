# AI-Driven Multi-Vector Threat Intelligence Platform for Bitcoin - Frontend

## Overview

This Angular application serves as the frontend for the AI-Driven Multi-Vector Threat Intelligence Platform for Bitcoin. It provides a user-friendly interface for analyzing Bitcoin addresses, monitoring transactions, and managing security alerts through a comprehensive dashboard.

## Features

- **User Authentication** - Secure login and registration
- **Home Dashboard** - Overview of key metrics and recent activities
- **Transaction Tracing** - Analyze Bitcoin addresses and transaction flows
- **Risk Management** - Visualize and assess cryptocurrency risks
- **Real-Time Monitoring** - Track Bitcoin network activities
- **Alert Management** - View and respond to security alerts
- **Report Generation** - Create and download detailed PDF reports
- **User Settings** - Customize profile and notification preferences

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 16.x or higher
- Backend API running (see backend README)

## Setup & Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mvtipbtc-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Update `src/environments/environment.ts` with your backend API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  // Other configuration options
};
```

### 4. Run Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Project Structure

```
src/
├── app/
│   ├── components/         # UI components
│   │   ├── alerts/         # Alert management
│   │   ├── auth/           # Login and registration
│   │   ├── dashboard/      # Main dashboard
│   │   ├── home/           # Home component
│   │   ├── reports/        # Report generation
│   │   └── settings/       # User settings
│   ├── services/           # API services
│   ├── models/             # Data models
│   ├── guards/             # Route guards
│   ├── app.routes.ts       # Application routes
│   └── app.config.ts       # App configuration
├── assets/                 # Static assets
└── environments/           # Environment configuration
```

## Key Components

### Home Component

The Home component provides a dashboard overview with:
- Summary statistics
- Recent activity feed
- Quick action buttons
- System status information

### Transaction Tracing

The Transaction Tracing tab allows users to:
- Search for Bitcoin addresses
- View transaction details
- Visualize transaction flows
- See related addresses (limited to 10 nodes)

### Risk Management

The Risk Management tab includes:
- Risk score visualization
- Pie chart of risk categories
- Risk assessment details
- Mitigation recommendations

## Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Testing

```bash
ng test
```

## Integration with Backend

The frontend communicates with the backend through RESTful API calls. Key services include:

- `AuthService` - Handles user authentication
- `ThreatIntelligenceService` - Manages Bitcoin address analysis
- `AlertsService` - Handles security alerts
- `ReportsService` - Manages report generation
