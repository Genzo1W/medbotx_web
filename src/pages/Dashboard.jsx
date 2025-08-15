import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  })

  const [recentAppointments, setRecentAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalAppointments: 156,
      todayAppointments: 8,
      pendingAppointments: 23,
      completedAppointments: 133
    })

    setRecentAppointments([
      {
        id: 1,
        patientName: 'Sarah Johnson',
        time: '09:00 AM',
        status: 'confirmed',
        type: 'Consultation'
      },
      {
        id: 2,
        patientName: 'Michael Chen',
        time: '10:30 AM',
        status: 'pending',
        type: 'Follow-up'
      },
      {
        id: 3,
        patientName: 'Emily Davis',
        time: '02:00 PM',
        status: 'completed',
        type: 'Check-up'
      }
    ])

    setUpcomingAppointments([
      {
        id: 4,
        patientName: 'Robert Wilson',
        time: '11:00 AM',
        date: 'Today',
        type: 'Emergency'
      },
      {
        id: 5,
        patientName: 'Lisa Brown',
        time: '03:30 PM',
        date: 'Today',
        type: 'Consultation'
      }
    ])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed'
      case 'pending': return 'status-pending'
      case 'completed': return 'status-completed'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'completed': return 'Completed'
      default: return 'Pending'
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {getGreeting()}, {user?.name || 'Doctor'}. Here's what's happening today.
          </p>
          {user?.specialty && (
            <p className="text-sm text-primary-600 mt-1">
              {user.role}: {user.specialty}
            </p>
          )}
        </div>
        <button 
          onClick={() => navigate('/appointments')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-medical-100 rounded-lg">
              <Clock className="w-6 h-6 text-medical-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                  <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Today</h3>
            <button 
              onClick={() => navigate('/calendar')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Calendar
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                  <p className="text-xs text-primary-600">{appointment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/patients')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-200"
          >
            <Plus className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-primary-700">New Patient</span>
          </button>
          <button 
            onClick={() => navigate('/calendar')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-medical-50 to-medical-100 rounded-lg hover:from-medical-100 hover:to-medical-200 transition-all duration-200"
          >
            <Calendar className="w-8 h-8 text-medical-600 mb-2" />
            <span className="text-sm font-medium text-medical-700">Schedule</span>
          </button>
          <button 
            onClick={() => navigate('/patients')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg hover:from-accent-100 hover:to-accent-200 transition-all duration-200"
          >
            <Users className="w-8 h-8 text-accent-600 mb-2" />
            <span className="text-sm font-medium text-accent-700">Patients</span>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
          >
            <TrendingUp className="w-8 h-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 