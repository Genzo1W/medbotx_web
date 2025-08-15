import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const mockPatients = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        age: 34,
        gender: 'Female',
        lastVisit: '2024-01-10',
        nextAppointment: '2024-01-15',
        status: 'active',
        medicalHistory: 'Hypertension, Diabetes Type 2',
        address: '123 Oak Street, City, State 12345'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        age: 28,
        gender: 'Male',
        lastVisit: '2024-01-08',
        nextAppointment: '2024-01-15',
        status: 'active',
        medicalHistory: 'Asthma, Seasonal Allergies',
        address: '456 Pine Avenue, City, State 12345'
      },
      {
        id: 3,
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 345-6789',
        age: 42,
        gender: 'Female',
        lastVisit: '2024-01-12',
        nextAppointment: '2024-01-16',
        status: 'active',
        medicalHistory: 'Migraine, Insomnia',
        address: '789 Elm Road, City, State 12345'
      }
    ]
    setPatients(mockPatients)
    setFilteredPatients(mockPatients)
  }, [])

  useEffect(() => {
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'Female': return 'bg-pink-100 text-pink-800'
      case 'Male': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">ID: {patient.id}</p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{patient.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`status-badge ${getGenderColor(patient.gender)}`}>
                  {patient.gender}
                </span>
                <span className="text-sm text-gray-600">{patient.age} years</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Last Visit:</span>
                <span>{patient.lastVisit}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>Next Appointment:</span>
                <span className="text-primary-600 font-medium">{patient.nextAppointment}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Patient</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  className="input-field"
                />
                <select className="input-field">
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea
                placeholder="Address"
                rows="2"
                className="input-field"
              />
              <textarea
                placeholder="Medical History"
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
                Create Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients 