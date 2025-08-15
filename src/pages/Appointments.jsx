import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const mockAppointments = [
      {
        id: 1,
        patientName: 'Sarah Johnson',
        patientEmail: 'sarah.johnson@email.com',
        patientPhone: '+1 (555) 123-4567',
        date: '2024-01-15',
        time: '09:00 AM',
        duration: 30,
        type: 'Consultation',
        status: 'confirmed',
        notes: 'Follow-up appointment for chronic condition',
        address: '123 Medical Center Dr, Suite 100'
      },
      {
        id: 2,
        patientName: 'Michael Chen',
        patientEmail: 'michael.chen@email.com',
        patientPhone: '+1 (555) 234-5678',
        date: '2024-01-15',
        time: '10:30 AM',
        duration: 45,
        type: 'Follow-up',
        status: 'pending',
        notes: 'Post-surgery check-up',
        address: '123 Medical Center Dr, Suite 100'
      },
      {
        id: 3,
        patientName: 'Emily Davis',
        patientEmail: 'emily.davis@email.com',
        patientPhone: '+1 (555) 345-6789',
        date: '2024-01-15',
        time: '02:00 PM',
        duration: 60,
        type: 'Check-up',
        status: 'completed',
        notes: 'Annual physical examination',
        address: '123 Medical Center Dr, Suite 100'
      },
      {
        id: 4,
        patientName: 'Robert Wilson',
        patientEmail: 'robert.wilson@email.com',
        patientPhone: '+1 (555) 456-7890',
        date: '2024-01-16',
        time: '11:00 AM',
        duration: 30,
        type: 'Emergency',
        status: 'confirmed',
        notes: 'Urgent consultation required',
        address: '123 Medical Center Dr, Suite 100'
      },
      {
        id: 5,
        patientName: 'Lisa Brown',
        patientEmail: 'lisa.brown@email.com',
        patientPhone: '+1 (555) 567-8901',
        date: '2024-01-16',
        time: '03:30 PM',
        duration: 45,
        type: 'Consultation',
        status: 'pending',
        notes: 'New patient consultation',
        address: '123 Medical Center Dr, Suite 100'
      }
    ]
    setAppointments(mockAppointments)
    setFilteredAppointments(mockAppointments)
  }, [])

  useEffect(() => {
    let filtered = appointments.filter(appointment => {
      const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFilteredAppointments(filtered)
  }, [searchTerm, statusFilter, appointments])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed'
      case 'pending': return 'status-pending'
      case 'completed': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return 'Pending'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Emergency': return 'bg-red-100 text-red-800'
      case 'Consultation': return 'bg-blue-100 text-blue-800'
      case 'Follow-up': return 'bg-green-100 text-green-800'
      case 'Check-up': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and schedule patient appointments</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.patientEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{appointment.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                      {appointment.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{appointment.duration} min</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Appointment</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                className="input-field"
              />
              <input
                type="email"
                placeholder="Patient Email"
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Patient Phone"
                className="input-field"
              />
              <input
                type="date"
                className="input-field"
              />
              <input
                type="time"
                className="input-field"
              />
              <select className="input-field">
                <option>Select Type</option>
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Check-up</option>
                <option>Emergency</option>
              </select>
              <textarea
                placeholder="Notes"
                rows="3"
                className="input-field"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button className="btn-primary flex-1">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments 