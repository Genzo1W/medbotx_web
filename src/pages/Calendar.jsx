import React, { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Edit,
  Trash2
} from 'lucide-react'
import NewAppointmentModal from '../components/NewAppointmentModal'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Generate mock appointments for current month and next month
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    
    const mockAppointments = [
      {
        id: 1,
        patientName: 'Sarah Johnson',
        time: '09:00 AM',
        duration: 30,
        type: 'Consultation',
        status: 'confirmed',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      },
      {
        id: 2,
        patientName: 'Michael Chen',
        time: '10:30 AM',
        duration: 45,
        type: 'Follow-up',
        status: 'pending',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 1).padStart(2, '0')}`
      },
      {
        id: 3,
        patientName: 'Emily Davis',
        time: '02:00 PM',
        duration: 60,
        type: 'Check-up',
        status: 'confirmed',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 2).padStart(2, '0')}`
      },
      {
        id: 4,
        patientName: 'Robert Wilson',
        time: '11:15 AM',
        duration: 30,
        type: 'Emergency',
        status: 'confirmed',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 3).padStart(2, '0')}`
      },
      {
        id: 5,
        patientName: 'Lisa Brown',
        time: '04:30 PM',
        duration: 45,
        type: 'Consultation',
        status: 'pending',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 5).padStart(2, '0')}`
      },
      {
        id: 6,
        patientName: 'David Thompson',
        time: '08:45 AM',
        duration: 30,
        type: 'Follow-up',
        status: 'completed',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() - 1).padStart(2, '0')}`
      },
      {
        id: 7,
        patientName: 'Maria Garcia',
        time: '01:20 PM',
        duration: 60,
        type: 'Check-up',
        status: 'confirmed',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 7).padStart(2, '0')}`
      },
      {
        id: 8,
        patientName: 'James Miller',
        time: '03:45 PM',
        duration: 30,
        type: 'Consultation',
        status: 'pending',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 10).padStart(2, '0')}`
      }
    ]
    setAppointments(mockAppointments)
  }, [])

  // Handler for saving new appointments
  const handleSaveAppointment = (newAppointment) => {
    setAppointments(prev => [...prev, newAppointment])
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getAppointmentsForDate = (date) => {
    if (!date) return []
    const dateString = date.toISOString().split('T')[0]
    return appointments.filter(apt => apt.date === dateString)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Emergency': return 'border-l-red-500'
      case 'Consultation': return 'border-l-blue-500'
      case 'Follow-up': return 'border-l-green-500'
      case 'Check-up': return 'border-l-purple-500'
      default: return 'border-l-gray-500'
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date) => {
    if (!date || !selectedDate) return false
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateAppointments = getAppointmentsForDate(selectedDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage appointments by date</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDate(currentDate)}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousMonth}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const today = new Date()
                    setCurrentDate(today)
                    setSelectedDate(today)
                  }}
                  className="btn-secondary text-sm"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`bg-white min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isToday(day) ? 'ring-2 ring-primary-500' : ''
                  } ${isSelected(day) ? 'bg-primary-50' : ''}`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {getAppointmentsForDate(day).slice(0, 2).map(appointment => (
                          <div
                            key={appointment.id}
                            className={`text-xs p-1 rounded truncate ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.time} - {appointment.patientName}
                          </div>
                        ))}
                        {getAppointmentsForDate(day).length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{getAppointmentsForDate(day).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          {/* Selected Date Header */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Select a date'}
              </h3>
            </div>
            
            {selectedDateAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
            ) : (
              <div className="space-y-3">
                {selectedDateAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className={`p-3 rounded-lg border-l-4 ${getTypeColor(appointment.type)} bg-white border border-gray-200`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{appointment.time}</span>
                      </div>
                      <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{appointment.patientName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{appointment.type}</span>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Appointments</span>
                <span className="font-semibold text-gray-900">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold text-gray-900">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date)
                    return aptDate.getMonth() === currentDate.getMonth() &&
                           aptDate.getFullYear() === currentDate.getFullYear()
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {appointments.filter(apt => apt.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveAppointment}
        selectedDate={selectedDate}
        appointments={appointments}
      />
    </div>
  )
}

export default Calendar 