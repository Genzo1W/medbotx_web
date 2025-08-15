import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '+1 (555) 123-4567',
        specialty: 'Cardiology',
        experience: '15 years',
        rating: 4.8,
        patientsSeen: 1247,
        availability: 'Mon-Fri, 9AM-5PM',
        status: 'active',
        address: '123 Medical Center Dr, Suite 100',
        education: 'MD - Harvard Medical School',
        certifications: 'Board Certified Cardiologist'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        phone: '+1 (555) 234-5678',
        specialty: 'Neurology',
        experience: '12 years',
        rating: 4.9,
        patientsSeen: 892,
        availability: 'Mon-Fri, 8AM-4PM',
        status: 'active',
        address: '123 Medical Center Dr, Suite 200',
        education: 'MD - Stanford Medical School',
        certifications: 'Board Certified Neurologist'
      }
    ]
    setDoctors(mockDoctors)
    setFilteredDoctors(mockDoctors)
  }, [])

  useEffect(() => {
    const filtered = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDoctors(filtered)
  }, [searchTerm, doctors])

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Neurology': 'bg-blue-100 text-blue-800',
      'Pediatrics': 'bg-green-100 text-green-800',
      'Orthopedics': 'bg-purple-100 text-purple-800',
      'Psychiatry': 'bg-pink-100 text-pink-800'
    }
    return colors[specialty] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'on leave': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage doctor profiles and schedules</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Doctor</span>
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
                placeholder="Search doctors by name, specialty, or email..."
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

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">ID: {doctor.id}</p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(doctor.status)}`}>
                {doctor.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{doctor.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`status-badge ${getSpecialtyColor(doctor.specialty)}`}>
                {doctor.specialty}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Experience:</span>
                <span className="font-medium">{doctor.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Patients Seen:</span>
                <span className="font-medium">{doctor.patientsSeen.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Availability:</span>
                <span className="font-medium">{doctor.availability}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="text-xs text-gray-500 mb-2">
                <strong>Education:</strong> {doctor.education}
              </div>
              <div className="text-xs text-gray-500">
                <strong>Certifications:</strong> {doctor.certifications}
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

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Doctor</h3>
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
              <select className="input-field">
                <option>Select Specialty</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
                <option>Orthopedics</option>
                <option>Psychiatry</option>
              </select>
              <input
                type="text"
                placeholder="Experience (e.g., 10 years)"
                className="input-field"
              />
              <textarea
                placeholder="Education"
                rows="2"
                className="input-field"
              />
              <textarea
                placeholder="Certifications"
                rows="2"
                className="input-field"
              />
              <textarea
                placeholder="Address"
                rows="2"
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
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors 