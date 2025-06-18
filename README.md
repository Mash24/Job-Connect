# Job Connect - Grade Job Platform

A modern, full-stack job platform built with React, Firebase, and real-time data visualization. Features an **international-grade admin dashboard** with live analytics, dark mode support, and comprehensive user management.

## 🚀 Key Features

### 📊 **Real-Time Admin Dashboard**
- **Live Analytics**: Real-time charts showing applications, user signups, and job status breakdown
- **Interactive Filters**: Filter data by time periods (7 days, 30 days, all time)
- **KPI Tracking**: Automated percentage change calculations with trend indicators
- **Dark Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing

### 🎨 **Modern UI/UX**
- **Framer Motion Animations**: Smooth, professional transitions and micro-interactions
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Recharts Integration**: Beautiful, interactive data visualizations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### 🔥 **Real-Time Data**
- **Firestore Integration**: Live data updates across all charts and components
- **Auto-Refresh Indicators**: Visual feedback showing data freshness
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Performance Optimized**: Efficient data aggregation and caching

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern component-based architecture
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **Recharts** - Composable charting library built on React components

### Backend & Data
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Authentication** - Secure user authentication
- **Firebase Hosting** - Global CDN hosting

### Development Tools
- **Jest & React Testing Library** - Comprehensive testing suite
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## 📈 Admin Dashboard Features

### Real-Time Charts
1. **Applications Over Time** - Line chart showing daily application trends
2. **User Signups Over Time** - Area chart with gradient fill showing growth
3. **Job Status Breakdown** - Interactive pie chart with status filtering

### Advanced Features
- **Period Comparison**: Automatic calculation of growth rates vs previous periods
- **Live Refresh Badges**: Real-time indicators showing data freshness
- **Collapsible Sections**: Expandable/collapsible chart cards
- **Export Ready**: Clean layout optimized for screenshots and reports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/job-connect.git
cd job-connect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Firebase config

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📱 Responsive Design

The admin dashboard is fully responsive with breakpoints:
- **Mobile**: Single column layout with optimized touch interactions
- **Tablet**: Two-column grid layout
- **Desktop**: Three-column grid with full feature set

## 🌙 Dark Mode

- **System Preference Detection**: Automatically matches user's OS theme
- **Manual Toggle**: Theme toggle in the top navigation bar
- **Persistent Storage**: Remembers user preference across sessions
- **Smooth Transitions**: Animated theme switching

## 🔒 Security & Access Control

- **Role-Based Access**: Admin dashboard restricted to super-admin users
- **Firestore Rules**: Server-side security rules
- **Client-Side Validation**: Additional security checks
- **Error Boundaries**: Graceful error handling

## 📊 Performance Optimizations

- **Code Splitting**: Lazy-loaded components for faster initial load
- **Memoization**: Optimized re-renders with React.memo
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Service Worker**: Offline support and caching strategies

## 🎯 Investor Highlights

### Technical Excellence
- **Production-Ready Code**: Comprehensive error handling, testing, and documentation
- **Scalable Architecture**: Modular components and reusable utilities
- **Performance Focused**: Optimized for large datasets and real-time updates
- **Modern Stack**: Latest technologies and best practices

### Business Intelligence
- **Real-Time Insights**: Live data for immediate decision making
- **Trend Analysis**: Automated growth rate calculations
- **User Behavior Tracking**: Comprehensive analytics dashboard
- **Export Capabilities**: Ready for board presentations and reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@jobconnect.com or join our Slack channel.

---

**Built with ❤️ for the future of job platforms**
