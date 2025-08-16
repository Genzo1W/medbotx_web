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
  Eye,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Advanced filters state
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    status: 'all',
    gender: 'all',
    ageRange: 'all'
  })

  // Form state for new patient
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    medicalHistory: ''
  })

  // Validation errors and real-time validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldTouched, setFieldTouched] = useState({})
  const [realTimeValidation, setRealTimeValidation] = useState({})

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
    const filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.phone.includes(searchTerm)
      
      // Advanced filters
      const matchesStatus = advancedFilters.status === 'all' || patient.status === advancedFilters.status
      const matchesGender = advancedFilters.gender === 'all' || patient.gender === advancedFilters.gender
      const matchesAgeRange = advancedFilters.ageRange === 'all' || 
                             (advancedFilters.ageRange === '0-18' && patient.age >= 0 && patient.age <= 18) ||
                             (advancedFilters.ageRange === '19-30' && patient.age >= 19 && patient.age <= 30) ||
                             (advancedFilters.ageRange === '31-50' && patient.age >= 31 && patient.age <= 50) ||
                             (advancedFilters.ageRange === '51-65' && patient.age >= 51 && patient.age <= 65) ||
                             (advancedFilters.ageRange === '65+' && patient.age >= 65)
      
      return matchesSearch && matchesStatus && matchesGender && matchesAgeRange
    })
    setFilteredPatients(filtered)
  }, [searchTerm, patients, advancedFilters])

  // Filter handlers
  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearAllFilters = () => {
    setAdvancedFilters({
      status: 'all',
      gender: 'all',
      ageRange: 'all'
    })
    setSearchTerm('')
  }

  const applyFilters = () => {
    setShowFilterModal(false)
  }

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
          message = 'Patient name is required'
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

      case 'age':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Age is required'
        } else if (parseInt(value) < 0 || parseInt(value) > 150) {
          isValid = false
          message = 'Age must be between 0 and 150'
        }
        break

      case 'gender':
        if (!value) {
          isValid = false
          message = 'Gender is required'
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
      newErrors.name = 'Patient name is required'
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

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required'
    } else if (parseInt(formData.age) < 0 || parseInt(formData.age) > 150) {
      newErrors.age = 'Age must be between 0 and 150'
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
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
        const newPatient = {
          id: patients.length + 1,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          lastVisit: '',
          nextAppointment: '',
          status: 'active',
          medicalHistory: formData.medicalHistory || '',
          address: formData.address || ''
        }
        
        setPatients(prev => [...prev, newPatient])
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
      age: '',
      gender: '',
      address: '',
      medicalHistory: ''
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

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setEditForm(patient)
    setShowEditModal(true)
  }

  const handleUpdatePatient = () => {
    setPatients(patients.map(patient => 
      patient.id === selectedPatient.id ? editForm : patient
    ))
    setShowEditModal(false)
    setSelectedPatient(null)
    setEditForm({})
  }

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(patient => patient.id !== patientId))
    }
  }

  const handleInputChangeEdit = (field, value) => {
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
          <button 
            onClick={() => setShowFilterModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
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
              <button 
                onClick={() => handleViewPatient(patient)}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button 
                onClick={() => handleEditPatient(patient)}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDeletePatient(patient.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Patient Details</h3>
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
                    <h4 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h4>
                    <p className="text-gray-500">Patient ID: {selectedPatient.id}</p>
                    <span className={`status-badge ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Age & Gender</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`status-badge ${getGenderColor(selectedPatient.gender)}`}>
                        {selectedPatient.gender}
                      </span>
                      <span className="text-gray-900">{selectedPatient.age} years old</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Visit</label>
                    <p className="text-gray-900">{selectedPatient.lastVisit}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Next Appointment</label>
                    <p className="text-primary-600 font-medium">{selectedPatient.nextAppointment}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Medical History</label>
                    <p className="text-gray-900">{selectedPatient.medicalHistory}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => {
                  setShowViewModal(false)
                  handleEditPatient(selectedPatient)
                }}
                className="btn-primary flex-1"
              >
                Edit Patient
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

      {/* Edit Patient Modal */}
      {showEditModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Patient</h3>
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
                onChange={(e) => handleInputChangeEdit('name', e.target.value)}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={editForm.email || ''}
                onChange={(e) => handleInputChangeEdit('email', e.target.value)}
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={editForm.phone || ''}
                onChange={(e) => handleInputChangeEdit('phone', e.target.value)}
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  value={editForm.age || ''}
                  onChange={(e) => handleInputChangeEdit('age', e.target.value)}
                  className="input-field"
                />
                <select 
                  value={editForm.gender || ''}
                  onChange={(e) => handleInputChangeEdit('gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <textarea
                placeholder="Address"
                rows="2"
                value={editForm.address || ''}
                onChange={(e) => handleInputChangeEdit('address', e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Medical History"
                rows="3"
                value={editForm.medicalHistory || ''}
                onChange={(e) => handleInputChangeEdit('medicalHistory', e.target.value)}
                className="input-field"
              />
              <select 
                value={editForm.status || ''}
                onChange={(e) => handleInputChangeEdit('status', e.target.value)}
                className="input-field"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
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
                onClick={handleUpdatePatient}
                className="btn-primary flex-1"
              >
                Update Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">New Patient</h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Patient Name */}
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

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Age *"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      onBlur={() => handleFieldBlur('age')}
                      className={getFieldClassName('age')}
                    />
                    {getFieldStatus('age') === 'success' && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {(realTimeValidation.age && !realTimeValidation.age.isValid) && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{realTimeValidation.age.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <select 
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      onBlur={() => handleFieldBlur('gender')}
                      className={getFieldClassName('gender')}
                    >
                      <option value="">Select Gender *</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldStatus('gender') === 'success' && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
                    )}
                  </div>
                  {(realTimeValidation.gender && !realTimeValidation.gender.isValid) && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{realTimeValidation.gender.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <textarea
                placeholder="Address (optional)"
                rows="2"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="input-field"
              />

              {/* Medical History */}
              <textarea
                placeholder="Medical History (optional)"
                rows="3"
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={handleCloseModal}
                className="btn-secondary flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Patient</span>
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
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select 
                  value={advancedFilters.status}
                  onChange={(e) => handleAdvancedFilterChange('status', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select 
                  value={advancedFilters.gender}
                  onChange={(e) => handleAdvancedFilterChange('gender', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Age Range</label>
                <select 
                  value={advancedFilters.ageRange}
                  onChange={(e) => handleAdvancedFilterChange('ageRange', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Ages</option>
                  <option value="0-18">0-18</option>
                  <option value="19-30">19-30</option>
                  <option value="31-50">31-50</option>
                  <option value="51-65">51-65</option>
                  <option value="65+">65+</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={clearAllFilters}
                className="btn-secondary flex-1"
              >
                Clear All
              </button>
              <button 
                onClick={applyFilters}
                className="btn-primary flex-1"
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

export default Patients 