# 🏥 MediCare - Hospital Appointment Management System

A modern, secure, and user-friendly web application for managing hospital appointments, designed specifically for doctors and healthcare centers.

## ✨ Features

### 🔐 **Secure Authentication System**
- **OTP-based Two-Factor Authentication**
- Email and password login
- 6-digit OTP verification
- Session management with JWT tokens
- Automatic logout on session expiry
- Protected routes - application only accessible after successful login

### 📊 **Dashboard**
- Real-time statistics and metrics
- Today's appointments overview
- Recent appointments list
- Quick action buttons
- Personalized greeting based on time of day

### 📅 **Appointment Management**
- Create, view, edit, and delete appointments
- Multiple appointment types (Consultation, Follow-up, Check-up, Emergency)
- Status tracking (Confirmed, Pending, Completed, Cancelled)
- Search and filter functionality
- Patient information management

### 👥 **Patient Management**
- Comprehensive patient profiles
- Medical history tracking
- Contact information management
- Appointment history
- Status management (Active, Inactive, Archived)

### 👨‍⚕️ **Doctor Management**
- Doctor profile management
- Specialty and experience tracking
- Availability scheduling
- Rating and review system
- Certification management

### 📅 **Calendar View**
- Monthly calendar interface
- Appointment visualization
- Date selection and navigation
- Quick appointment creation
- Appointment details sidebar

### ⚙️ **Settings & Configuration**
- User profile management
- Security settings
- Notification preferences
- Theme customization
- Data export functionality

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-appointments
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 **Demo Credentials**

### Doctor Account
- **Email:** `doctor@hospital.com`
- **Password:** `password123`
- **Role:** Doctor
- **Specialty:** Cardiology

### Administrator Account
- **Email:** `admin@hospital.com`
- **Password:** `admin123`
- **Role:** Administrator
- **Specialty:** Management

## 🔒 **Authentication Flow**

1. **Login Page**: Enter email and password
2. **OTP Verification**: Receive and enter 6-digit OTP
3. **Session Creation**: JWT token stored in localStorage
4. **Protected Access**: All application features become available
5. **Auto-logout**: Session expires after inactivity

## 🛡️ **Security Features**

- **Input Validation**: Comprehensive form validation
- **OTP Protection**: Two-factor authentication
- **Session Management**: Secure token-based sessions
- **Route Protection**: Unauthorized access prevention
- **Data Sanitization**: XSS and injection protection

## 🎨 **UI/UX Features**

- **Modern Design**: Clean, professional medical interface
- **Responsive Layout**: Works on all device sizes
- **Accessibility**: WCAG compliant design
- **Dark/Light Themes**: Customizable appearance
- **Smooth Animations**: Enhanced user experience
- **Intuitive Navigation**: Easy-to-use interface

## 🏗️ **Technical Architecture**

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom medical theme
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API
- **Build Tool**: Vite for fast development
- **Icons**: Lucide React icon library

## 📱 **Responsive Design**

- **Desktop**: Full-featured interface
- **Tablet**: Optimized for touch interaction
- **Mobile**: Mobile-first responsive design
- **Cross-browser**: Compatible with all modern browsers

## 🔧 **Customization**

### Colors
- **Primary**: Medical blue theme
- **Medical**: Healthcare green accents
- **Accent**: Purple highlights
- **Customizable**: Easy theme modification

### Components
- **Reusable**: Modular component architecture
- **Configurable**: Flexible component props
- **Extensible**: Easy to add new features

## 📊 **Data Management**

- **Mock Data**: Sample data for demonstration
- **Local Storage**: Session persistence
- **State Management**: Efficient React state handling
- **Data Validation**: Comprehensive input validation

## 🚀 **Deployment**

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 **Future Enhancements**

- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Detailed reporting and insights
- **Integration**: EHR system integration
- **Multi-language**: Internationalization support
- **Cloud Storage**: Secure cloud data storage

---

**Built with ❤️ for the healthcare community** 