# Job Connect - Modern Job Marketplace Platform

A full-stack job marketplace application built with React and Firebase, featuring real-time updates, role-based access control, and a modern UI.

## 🚀 Features

- **Real-time Updates**: Live activity feed and instant notifications
- **Role-based Access**: Separate interfaces for job seekers, employers, and administrators
- **Modern UI**: Built with Tailwind CSS and modern React practices
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Secure Authentication**: Firebase Authentication with role-based access
- **Real-time Database**: Firebase Firestore for instant data synchronization
- **Activity Monitoring**: Comprehensive logging system for all user actions

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Headless UI, Radix UI
- **State Management**: React Context, Custom Hooks
- **Backend**: Firebase (Firestore, Authentication)
- **Testing**: Jest, React Testing Library
- **Development**: ESLint, Prettier

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/mash24/job-connect.git
   cd job-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to `src/firebase/config.js`

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
├── context/       # React context providers
├── firebase/      # Firebase configuration
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── routes/        # Routing configuration
├── styles/        # Global styles
└── utils/         # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Follow the ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🔒 Security

- All sensitive data is stored securely in Firebase
- Role-based access control for all routes
- Input validation and sanitization
- Regular security audits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Jackson M Macharia - Work

## 🙏 Acknowledgments

- Firebase for backend services
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
