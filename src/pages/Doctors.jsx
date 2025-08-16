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
  Eye,
  X,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Advanced filters state
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    specialty: 'all',
    status: 'all',
    experience: 'all',
    rating: 'all'
  })

  // Form state for new doctor
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    education: '',
    certifications: '',
    address: ''
  })

  // Validation errors and real-time validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldTouched, setFieldTouched] = useState({})
  const [realTimeValidation, setRealTimeValidation] = useState({})

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    // Accepts various phone formats: +1 (555) 123-4567, (555) 123-4567, 555-123-4567, 5551234567
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[\(]?[1-9][\d]{2}[\)]?[\s-]?[\d]{3}[\s-]?[\d]{4}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  // Real-time validation functions
  const validateFieldRealTime = (field, value) => {
    let isValid = true
    let message = ''

    switch (field) {
      case 'name':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Doctor name is required'
        } else if (value.trim().length < 2) {
          isValid = false
          message = 'Name must be at least 2 characters'
        }
        break

      case 'email':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Email is required'
        } else if (!validateEmail(value)) {
          isValid = false
          message = 'Please enter a valid email address'
        }
        break

      case 'phone':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Phone number is required'
        } else if (!validatePhone(value)) {
          isValid = false
          message = 'Please enter a valid phone number'
        }
        break

      case 'specialty':
        if (!value) {
          isValid = false
          message = 'Specialty is required'
        }
        break

      case 'experience':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Experience is required'
        }
        break

      case 'education':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Education is required'
        }
        break

      case 'certifications':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Certifications are required'
        }
        break

      case 'address':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Address is required'
        }
        break

      default:
        break
    }

    return { isValid, message }
  }

  // Phone number formatting
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters except +, (, ), -, and space
    const cleaned = value.replace(/[^\d+\-\(\)\s]/g, '')
    
    // Limit length to prevent overly long numbers
    if (cleaned.length > 20) {
      return value.slice(0, 20)
    }
    
    return cleaned
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.specialty) {
      newErrors.specialty = 'Specialty is required'
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required'
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Education is required'
    }

    if (!formData.certifications.trim()) {
      newErrors.certifications = 'Certifications are required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    let processedValue = value

    // Special handling for phone field
    if (field === 'phone') {
      processedValue = formatPhoneNumber(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))
    
    // Mark field as touched
    setFieldTouched(prev => ({
      ...prev,
      [field]: true
    }))

    // Real-time validation
    if (fieldTouched[field] || processedValue.length > 0) {
      const validation = validateFieldRealTime(field, processedValue)
      setRealTimeValidation(prev => ({
        ...prev,
        [field]: validation
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleFieldBlur = (field) => {
    setFieldTouched(prev => ({
      ...prev,
      [field]: true
    }))

    const validation = validateFieldRealTime(field, formData[field])
    setRealTimeValidation(prev => ({
      ...prev,
      [field]: validation
    }))
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true)
      
      // Simulate API call
      setTimeout(() => {
        const newDoctor = {
          id: doctors.length + 1,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialty: formData.specialty,
          experience: formData.experience,
          education: formData.education,
          certifications: formData.certifications,
          address: formData.address,
          rating: 0,
          patientsSeen: 0,
          availability: 'Mon-Fri, 9AM-5PM',
          status: 'active'
        }
        
        setDoctors(prev => [...prev, newDoctor])
        setShowAddModal(false)
        resetForm()
        setIsSubmitting(false)
      }, 1000)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      experience: '',
      education: '',
      certifications: '',
      address: ''
    })
    setErrors({})
    setFieldTouched({})
    setRealTimeValidation({})
    setIsSubmitting(false)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  // Helper function to get field status
  const getFieldStatus = (field) => {
    const isTouched = fieldTouched[field]
    const hasValue = formData[field] && formData[field].trim().length > 0
    const validation = realTimeValidation[field]
    
    if (!isTouched && !hasValue) return 'default'
    if (validation && !validation.isValid) return 'error'
    if (validation && validation.isValid) return 'success'
    return 'default'
  }

  // Helper function to get field styling
  const getFieldClassName = (field) => {
    const status = getFieldStatus(field)
    const baseClass = 'input-field'
    
    switch (status) {
      case 'error':
        return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      case 'success':
        return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-500`
      default:
        return baseClass
    }
  }

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
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        phone: '+1 (555) 345-6789',
        specialty: 'Pediatrics',
        experience: '8 years',
        rating: 4.7,
        patientsSeen: 567,
        availability: 'Mon-Fri, 9AM-6PM',
        status: 'active',
        address: '123 Medical Center Dr, Suite 300',
        education: 'MD - Johns Hopkins Medical School',
        certifications: 'Board Certified Pediatrician'
      },
      {
        id: 4,
        name: 'Dr. David Thompson',
        email: 'david.thompson@hospital.com',
        phone: '+1 (555) 456-7890',
        specialty: 'Orthopedics',
        experience: '20 years',
        rating: 4.6,
        patientsSeen: 1892,
        availability: 'Mon-Fri, 8AM-5PM',
        status: 'active',
        address: '123 Medical Center Dr, Suite 400',
        education: 'MD - Yale Medical School',
        certifications: 'Board Certified Orthopedic Surgeon'
      }
    ]
    setDoctors(mockDoctors)
    setFilteredDoctors(mockDoctors)
  }, [])

  useEffect(() => {
    const filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Advanced filters
      const matchesSpecialty = advancedFilters.specialty === 'all' || doctor.specialty === advancedFilters.specialty
      const matchesStatus = advancedFilters.status === 'all' || doctor.status === advancedFilters.status
      const matchesExperience = advancedFilters.experience === 'all' || 
                               (advancedFilters.experience === '0-5' && parseInt(doctor.experience) <= 5) ||
                               (advancedFilters.experience === '6-10' && parseInt(doctor.experience) >= 6 && parseInt(doctor.experience) <= 10) ||
                               (advancedFilters.experience === '11-15' && parseInt(doctor.experience) >= 11 && parseInt(doctor.experience) <= 15) ||
                               (advancedFilters.experience === '16+' && parseInt(doctor.experience) >= 16)
      const matchesRating = advancedFilters.rating === 'all' || 
                           (advancedFilters.rating === '4.5+' && doctor.rating >= 4.5) ||
                           (advancedFilters.rating === '4.0-4.4' && doctor.rating >= 4.0 && doctor.rating < 4.5) ||
                           (advancedFilters.rating === '3.5-3.9' && doctor.rating >= 3.5 && doctor.rating < 4.0) ||
                           (advancedFilters.rating === '<3.5' && doctor.rating < 3.5)
      
      return matchesSearch && matchesSpecialty && matchesStatus && matchesExperience && matchesRating
    })
    setFilteredDoctors(filtered)
  }, [searchTerm, doctors, advancedFilters])

  // Filter handlers
  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearAllFilters = () => {
    setAdvancedFilters({
      specialty: 'all',
      status: 'all',
      experience: 'all',
      rating: 'all'
    })
    setSearchTerm('')
  }

  const applyFilters = () => {
    setShowFilterModal(false)
  }

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

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setShowViewModal(true)
  }

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setEditForm(doctor)
    setShowEditModal(true)
  }

  const handleUpdateDoctor = () => {
    setDoctors(doctors.map(doctor => 
      doctor.id === selectedDoctor.id ? editForm : doctor
    ))
    setShowEditModal(false)
    setSelectedDoctor(null)
    setEditForm({})
  }

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId))
    }
  }

  const handleEditInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
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
          <button 
            onClick={() => setShowFilterModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
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
              <button 
                onClick={() => handleViewDoctor(doctor)}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button 
                onClick={() => handleEditDoctor(doctor)}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDeleteDoctor(doctor.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Doctor Modal */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Doctor Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedDoctor.name}</h4>
                    <p className="text-gray-500">Doctor ID: {selectedDoctor.id}</p>
                    <span className={`status-badge ${getStatusColor(selectedDoctor.status)}`}>
                      {selectedDoctor.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedDoctor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedDoctor.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{selectedDoctor.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Specialty</label>
                    <span className={`status-badge ${getSpecialtyColor(selectedDoctor.specialty)}`}>
                      {selectedDoctor.specialty}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-gray-900">{selectedDoctor.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-gray-900 font-medium">{selectedDoctor.rating}/5.0</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Patients Seen</label>
                    <p className="text-gray-900">{selectedDoctor.patientsSeen.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Availability</label>
                    <p className="text-gray-900">{selectedDoctor.availability}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Education</label>
                    <p className="text-gray-900">{selectedDoctor.education}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Certifications</label>
                    <p className="text-gray-900">{selectedDoctor.certifications}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => {
                  setShowViewModal(false)
                  handleEditDoctor(selectedDoctor)
                }}
                className="btn-primary flex-1"
              >
                Edit Doctor
              </button>
              <button 
                onClick={() => setShowViewModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Doctor</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={editForm.name || ''}
                onChange={(e) => handleEditInputChange('name', e.target.value)}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={editForm.email || ''}
                onChange={(e) => handleEditInputChange('email', e.target.value)}
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={editForm.phone || ''}
                onChange={(e) => handleEditInputChange('phone', e.target.value)}
                className="input-field"
              />
              <select 
                value={editForm.specialty || ''}
                onChange={(e) => handleEditInputChange('specialty', e.target.value)}
                className="input-field"
              >
                <option value="">Select Specialty</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Psychiatry">Psychiatry</option>
              </select>
              <input
                type="text"
                placeholder="Experience (e.g., 10 years)"
                value={editForm.experience || ''}
                onChange={(e) => handleEditInputChange('experience', e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5)"
                value={editForm.rating || ''}
                onChange={(e) => handleEditInputChange('rating', e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Patients Seen"
                value={editForm.patientsSeen || ''}
                onChange={(e) => handleEditInputChange('patientsSeen', e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Availability (e.g., Mon-Fri, 9AM-5PM)"
                value={editForm.availability || ''}
                onChange={(e) => handleEditInputChange('availability', e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Education"
                rows="2"
                value={editForm.education || ''}
                onChange={(e) => handleEditInputChange('education', e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Certifications"
                rows="2"
                value={editForm.certifications || ''}
                onChange={(e) => handleEditInputChange('certifications', e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Address"
                rows="2"
                value={editForm.address || ''}
                onChange={(e) => handleEditInputChange('address', e.target.value)}
                className="input-field"
              />
              <select 
                value={editForm.status || ''}
                onChange={(e) => handleEditInputChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on leave">On Leave</option>
              </select>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateDoctor}
                className="btn-primary flex-1"
              >
                Update Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Doctor</h3>
            <div className="space-y-4">
              {/* Doctor Name */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                    className={getFieldClassName('name')}
                  />
                  {getFieldStatus('name') === 'success' && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.name && !realTimeValidation.name.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.name.message}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    className={getFieldClassName('email')}
                  />
                  {getFieldStatus('email') === 'success' && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.email && !realTimeValidation.email.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.email.message}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleFieldBlur('phone')}
                    className={getFieldClassName('phone')}
                  />
                  {getFieldStatus('phone') === 'success' && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.phone && !realTimeValidation.phone.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.phone.message}</span>
                  </div>
                )}
              </div>

              {/* Specialty */}
              <div>
                <div className="relative">
                  <select 
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    onBlur={() => handleFieldBlur('specialty')}
                    className={getFieldClassName('specialty')}
                  >
                    <option value="">Select Specialty *</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Psychiatry">Psychiatry</option>
                  </select>
                  {getFieldStatus('specialty') === 'success' && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
                  )}
                </div>
                {(realTimeValidation.specialty && !realTimeValidation.specialty.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.specialty.message}</span>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Experience (e.g., 10 years) *"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    onBlur={() => handleFieldBlur('experience')}
                    className={getFieldClassName('experience')}
                  />
                  {getFieldStatus('experience') === 'success' && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.experience && !realTimeValidation.experience.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.experience.message}</span>
                  </div>
                )}
              </div>

              {/* Education */}
              <div>
                <div className="relative">
                  <textarea
                    placeholder="Education *"
                    rows="2"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    onBlur={() => handleFieldBlur('education')}
                    className={getFieldClassName('education')}
                  />
                  {getFieldStatus('education') === 'success' && (
                    <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.education && !realTimeValidation.education.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.education.message}</span>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div>
                <div className="relative">
                  <textarea
                    placeholder="Certifications *"
                    rows="2"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    onBlur={() => handleFieldBlur('certifications')}
                    className={getFieldClassName('certifications')}
                  />
                  {getFieldStatus('certifications') === 'success' && (
                    <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.certifications && !realTimeValidation.certifications.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.certifications.message}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <div className="relative">
                  <textarea
                    placeholder="Address *"
                    rows="2"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleFieldBlur('address')}
                    className={getFieldClassName('address')}
                  />
                  {getFieldStatus('address') === 'success' && (
                    <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                  )}
                </div>
                {(realTimeValidation.address && !realTimeValidation.address.isValid) && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{realTimeValidation.address.message}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={handleCloseModal}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                  </div>
                ) : (
                  'Add Doctor'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Specialty</label>
                <select 
                  value={advancedFilters.specialty}
                  onChange={(e) => handleAdvancedFilterChange('specialty', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select 
                  value={advancedFilters.status}
                  onChange={(e) => handleAdvancedFilterChange('status', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Experience</label>
                <select 
                  value={advancedFilters.experience}
                  onChange={(e) => handleAdvancedFilterChange('experience', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Experience</option>
                  <option value="0-5">0-5 Years</option>
                  <option value="6-10">6-10 Years</option>
                  <option value="11-15">11-15 Years</option>
                  <option value="16+">16+ Years</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <select 
                  value={advancedFilters.rating}
                  onChange={(e) => handleAdvancedFilterChange('rating', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5+">4.5+</option>
                  <option value="4.0-4.4">4.0-4.4</option>
                  <option value="3.5-3.9">3.5-3.9</option>
                  <option value="<3.5">Less than 3.5</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={clearAllFilters}
                className="btn-secondary"
              >
                Clear All
              </button>
              <button 
                onClick={applyFilters}
                className="btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors 