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
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from 'lucide-react'
import NewAppointmentModal from '../components/NewAppointmentModal'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Advanced filters state
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all',
    duration: 'all',
    timeFromHour: '',
    timeFromMinute: '',
    timeFromPeriod: '',
    timeToHour: '',
    timeToMinute: '',
    timeToPeriod: ''
  })

  // Form state for new appointment
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    country: '',
    date: '',
    timeHour: '',
    timeMinute: '',
    timePeriod: '',
    type: '',
    notes: ''
  })
  
  // Validation errors and real-time validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldTouched, setFieldTouched] = useState({})
  const [realTimeValidation, setRealTimeValidation] = useState({})

  // Country data with flag sprites
  const countries = [
    { code: 'US', name: 'United States', flagClass: 'flag-us', phoneCode: '+1' },
    { code: 'CA', name: 'Canada', flagClass: 'flag-ca', phoneCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flagClass: 'flag-gb', phoneCode: '+44' },
    { code: 'IN', name: 'India', flagClass: 'flag-in', phoneCode: '+91' },
    { code: 'AU', name: 'Australia', flagClass: 'flag-au', phoneCode: '+61' },
    { code: 'DE', name: 'Germany', flagClass: 'flag-de', phoneCode: '+49' },
    { code: 'FR', name: 'France', flagClass: 'flag-fr', phoneCode: '+33' },
    { code: 'JP', name: 'Japan', flagClass: 'flag-jp', phoneCode: '+81' },
    { code: 'BR', name: 'Brazil', flagClass: 'flag-br', phoneCode: '+55' },
    { code: 'MX', name: 'Mexico', flagClass: 'flag-mx', phoneCode: '+52' },
    { code: 'IT', name: 'Italy', flagClass: 'flag-it', phoneCode: '+39' },
    { code: 'ES', name: 'Spain', flagClass: 'flag-es', phoneCode: '+34' },
    { code: 'NL', name: 'Netherlands', flagClass: 'flag-nl', phoneCode: '+31' },
    { code: 'SE', name: 'Sweden', flagClass: 'flag-se', phoneCode: '+46' },
    { code: 'NO', name: 'Norway', flagClass: 'flag-no', phoneCode: '+47' },
    { code: 'DK', name: 'Denmark', flagClass: 'flag-dk', phoneCode: '+45' },
    { code: 'FI', name: 'Finland', flagClass: 'flag-fi', phoneCode: '+358' },
    { code: 'CH', name: 'Switzerland', flagClass: 'flag-ch', phoneCode: '+41' },
    { code: 'AT', name: 'Austria', flagClass: 'flag-at', phoneCode: '+43' },
    { code: 'BE', name: 'Belgium', flagClass: 'flag-be', phoneCode: '+32' },
    { code: 'IE', name: 'Ireland', flagClass: 'flag-ie', phoneCode: '+353' },
    { code: 'NZ', name: 'New Zealand', flagClass: 'flag-nz', phoneCode: '+64' },
    { code: 'SG', name: 'Singapore', flagClass: 'flag-sg', phoneCode: '+65' },
    { code: 'HK', name: 'Hong Kong', flagClass: 'flag-hk', phoneCode: '+852' },
    { code: 'KR', name: 'South Korea', flagClass: 'flag-kr', phoneCode: '+82' },
    { code: 'CN', name: 'China', flagClass: 'flag-cn', phoneCode: '+86' },
    { code: 'RU', name: 'Russia', flagClass: 'flag-ru', phoneCode: '+7' },
    { code: 'ZA', name: 'South Africa', flagClass: 'flag-za', phoneCode: '+27' },
    { code: 'EG', name: 'Egypt', flagClass: 'flag-eg', phoneCode: '+20' },
    { code: 'NG', name: 'Nigeria', flagClass: 'flag-ng', phoneCode: '+234' },
    { code: 'KE', name: 'Kenya', flagClass: 'flag-ke', phoneCode: '+254' },
    { code: 'GH', name: 'Ghana', flagClass: 'flag-gh', phoneCode: '+233' },
    { code: 'UG', name: 'Uganda', flagClass: 'flag-ug', phoneCode: '+256' },
    { code: 'TZ', name: 'Tanzania', flagClass: 'flag-tz', phoneCode: '+255' },
    { code: 'ET', name: 'Ethiopia', flagClass: 'flag-et', phoneCode: '+251' },
    { code: 'DZ', name: 'Algeria', flagClass: 'flag-dz', phoneCode: '+213' },
    { code: 'MA', name: 'Morocco', flagClass: 'flag-ma', phoneCode: '+212' },
    { code: 'TN', name: 'Tunisia', flagClass: 'flag-tn', phoneCode: '+216' },
    { code: 'LY', name: 'Libya', flagClass: 'flag-ly', phoneCode: '+218' },
    { code: 'SD', name: 'Sudan', flagClass: 'flag-sd', phoneCode: '+249' },
    { code: 'SS', name: 'South Sudan', flagClass: 'flag-ss', phoneCode: '+211' },
    { code: 'CF', name: 'Central African Republic', flagClass: 'flag-cf', phoneCode: '+236' },
    { code: 'TD', name: 'Chad', flagClass: 'flag-td', phoneCode: '+235' },
    { code: 'NE', name: 'Niger', flagClass: 'flag-ne', phoneCode: '+227' },
    { code: 'ML', name: 'Mali', flagClass: 'flag-ml', phoneCode: '+223' },
    { code: 'BF', name: 'Burkina Faso', flagClass: 'flag-bf', phoneCode: '+226' },
    { code: 'CI', name: 'Ivory Coast', flagClass: 'flag-ci', phoneCode: '+225' },
    { code: 'SN', name: 'Senegal', flagClass: 'flag-sn', phoneCode: '+221' },
    { code: 'GM', name: 'Gambia', flagClass: 'flag-gm', phoneCode: '+220' },
    { code: 'GW', name: 'Guinea-Bissau', flagClass: 'flag-gw', phoneCode: '+245' },
    { code: 'GN', name: 'Guinea', flagClass: 'flag-gn', phoneCode: '+224' },
    { code: 'SL', name: 'Sierra Leone', flagClass: 'flag-sl', phoneCode: '+232' },
    { code: 'LR', name: 'Liberia', flagClass: 'flag-lr', phoneCode: '+231' },
    { code: 'TG', name: 'Togo', flagClass: 'flag-tg', phoneCode: '+228' },
    { code: 'BJ', name: 'Benin', flagClass: 'flag-bj', phoneCode: '+229' },
    { code: 'CM', name: 'Cameroon', flagClass: 'flag-cm', phoneCode: '+237' },
    { code: 'GQ', name: 'Equatorial Guinea', flagClass: 'flag-gq', phoneCode: '+240' },
    { code: 'GA', name: 'Gabon', flagClass: 'flag-ga', phoneCode: '+241' },
    { code: 'CG', name: 'Republic of the Congo', flagClass: 'flag-cg', phoneCode: '+242' },
    { code: 'CD', name: 'Democratic Republic of the Congo', flagClass: 'flag-cd', phoneCode: '+243' },
    { code: 'AO', name: 'Angola', flagClass: 'flag-ao', phoneCode: '+244' },
    { code: 'ZM', name: 'Zambia', flagClass: 'flag-zm', phoneCode: '+260' },
    { code: 'ZW', name: 'Zimbabwe', flagClass: 'flag-zw', phoneCode: '+263' },
    { code: 'BW', name: 'Botswana', flagClass: 'flag-bw', phoneCode: '+267' },
    { code: 'NA', name: 'Namibia', flagClass: 'flag-na', phoneCode: '+264' },
    { code: 'LS', name: 'Lesotho', flagClass: 'flag-ls', phoneCode: '+266' },
    { code: 'SZ', name: 'Eswatini', flagClass: 'flag-sz', phoneCode: '+268' },
    { code: 'MG', name: 'Madagascar', flagClass: 'flag-mg', phoneCode: '+261' },
    { code: 'MU', name: 'Mauritius', flagClass: 'flag-mu', phoneCode: '+230' },
    { code: 'SC', name: 'Seychelles', flagClass: 'flag-sc', phoneCode: '+248' },
    { code: 'KM', name: 'Comoros', flagClass: 'flag-km', phoneCode: '+269' },
    { code: 'DJ', name: 'Djibouti', flagClass: 'flag-dj', phoneCode: '+253' },
    { code: 'SO', name: 'Somalia', flagClass: 'flag-so', phoneCode: '+252' },
    { code: 'ER', name: 'Eritrea', flagClass: 'flag-er', phoneCode: '+291' },
    { code: 'MW', name: 'Malawi', flagClass: 'flag-mw', phoneCode: '+265' },
    { code: 'MZ', name: 'Mozambique', flagClass: 'flag-mz', phoneCode: '+258' },
    { code: 'ST', name: 'São Tomé and Príncipe', flagClass: 'flag-st', phoneCode: '+239' },
    { code: 'CV', name: 'Cape Verde', flagClass: 'flag-cv', phoneCode: '+238' }
  ]

  // Get selected country data
  const getSelectedCountry = () => {
    return countries.find(country => country.code === formData.country) || countries[0]
  }

  // Get phone code for selected country
  const getPhoneCode = () => {
    const selectedCountry = getSelectedCountry()
    return selectedCountry ? selectedCountry.phoneCode : '+1'
  }

  // Flag component
  const Flag = ({ countryCode, className = '' }) => {
    const country = countries.find(c => c.code === countryCode)
    if (!country) return null
    
    return (
      <img 
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        alt={`${country.name} flag`}
        className={`w-6 h-4 object-cover rounded-sm ${className}`}
        onError={(e) => {
          // Fallback to a simple colored div if image fails to load
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
    )
  }

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
      
      // Advanced filters
      const matchesDateFrom = !advancedFilters.dateFrom || appointment.date >= advancedFilters.dateFrom
      const matchesDateTo = !advancedFilters.dateTo || appointment.date <= advancedFilters.dateTo
      const matchesType = advancedFilters.type === 'all' || appointment.type === advancedFilters.type
      const matchesDuration = advancedFilters.duration === 'all' || appointment.duration === parseInt(advancedFilters.duration)
      
      // Time filtering
      let matchesTimeFrom = true
      let matchesTimeTo = true
      
      if (advancedFilters.timeFromHour || advancedFilters.timeFromMinute || advancedFilters.timeFromPeriod ||
          advancedFilters.timeToHour || advancedFilters.timeToMinute || advancedFilters.timeToPeriod) {
        const appointmentTime = appointment.time
        const appointmentHour = parseInt(appointmentTime.split(':')[0])
        const appointmentPeriod = appointmentTime.includes('PM') ? 'PM' : 'AM'
        let appointment24Hour = appointmentHour
        
        if (appointmentPeriod === 'PM' && appointmentHour !== 12) {
          appointment24Hour += 12
        } else if (appointmentPeriod === 'AM' && appointmentHour === 12) {
          appointment24Hour = 0
        }
        
        if (advancedFilters.timeFromHour || advancedFilters.timeFromMinute || advancedFilters.timeFromPeriod) {
          const fromHour = parseInt(advancedFilters.timeFromHour || '0')
          const fromMinute = parseInt(advancedFilters.timeFromMinute || '0')
          const fromPeriod = advancedFilters.timeFromPeriod || 'AM'
          let from24Hour = fromHour
          
          if (fromPeriod === 'PM' && fromHour !== 12) {
            from24Hour += 12
          } else if (fromPeriod === 'AM' && fromHour === 12) {
            from24Hour = 0
          }
          
          matchesTimeFrom = appointment24Hour >= from24Hour
        }
        
        if (advancedFilters.timeToHour || advancedFilters.timeToMinute || advancedFilters.timeToPeriod) {
          const toHour = parseInt(advancedFilters.timeToHour || '23')
          const toMinute = parseInt(advancedFilters.timeToMinute || '59')
          const toPeriod = advancedFilters.timeToPeriod || 'PM'
          let to24Hour = toHour
          
          if (toPeriod === 'PM' && toHour !== 12) {
            to24Hour += 12
          } else if (toPeriod === 'AM' && toHour === 12) {
            to24Hour = 0
          }
          
          matchesTimeTo = appointment24Hour <= to24Hour
        }
      }
      
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo && 
             matchesType && matchesDuration && matchesTimeFrom && matchesTimeTo
    })
    setFilteredAppointments(filtered)
  }, [searchTerm, statusFilter, appointments, advancedFilters])

  // Handler for saving new appointments
  const handleSaveAppointment = (newAppointment) => {
    setAppointments(prev => [...prev, newAppointment])
  }

  // Filter handlers
  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearAllFilters = () => {
    setAdvancedFilters({
      dateFrom: '',
      dateTo: '',
      type: 'all',
      duration: 'all',
      timeFromHour: '',
      timeFromMinute: '',
      timeFromPeriod: '',
      timeToHour: '',
      timeToMinute: '',
      timeToPeriod: ''
    })
    setStatusFilter('all')
    setSearchTerm('')
  }

  const applyFilters = () => {
    setShowFilterModal(false)
  }

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

  // Appointment action handlers
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowViewModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    // Parse time from "09:30 AM" format to separate fields
    const timeMatch = appointment.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
    const timeHour = timeMatch ? timeMatch[1].padStart(2, '0') : ''
    const timeMinute = timeMatch ? timeMatch[2] : ''
    const timePeriod = timeMatch ? timeMatch[3] : ''
    
    setEditForm({
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      country: appointment.country || 'US',
      date: appointment.date,
      timeHour: timeHour,
      timeMinute: timeMinute,
      timePeriod: timePeriod,
      type: appointment.type,
      notes: appointment.notes || ''
    })
    setShowEditModal(true)
  }

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId))
    }
  }

  const handleUpdateAppointment = () => {
    // Combine time fields into a single time string
    const timeString = `${editForm.timeHour}:${editForm.timeMinute} ${editForm.timePeriod}`
    
    setAppointments(prev => prev.map(appointment => 
      appointment.id === selectedAppointment.id 
        ? {
            ...appointment,
            patientName: editForm.patientName,
            patientEmail: editForm.patientEmail,
            patientPhone: editForm.patientPhone,
            country: editForm.country,
            date: editForm.date,
            time: timeString,
            type: editForm.type,
            notes: editForm.notes
          }
        : appointment
    ))
    
    setShowEditModal(false)
    setSelectedAppointment(null)
    setEditForm({})
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
            <button 
              onClick={() => setShowFilterModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
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
                      <button 
                        onClick={() => handleViewAppointment(appointment)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Appointment"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditAppointment(appointment)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit Appointment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Appointment"
                      >
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

      {/* Reusable New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveAppointment}
        appointments={appointments}
      />

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <p className="text-gray-900">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedAppointment.patientEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedAppointment.patientPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-gray-900">{selectedAppointment.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <p className="text-gray-900">{selectedAppointment.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedAppointment.type)}`}>
                    {selectedAppointment.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`status-badge ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusText(selectedAppointment.status)}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <p className="text-gray-900">{selectedAppointment.notes || 'No notes'}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowViewModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false)
                  handleEditAppointment(selectedAppointment)
                }}
                className="btn-primary flex-1"
              >
                Edit Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Patient Name */}
              <div>
                <input
                  type="text"
                  placeholder="Patient Name *"
                  value={editForm.patientName || ''}
                  onChange={(e) => handleEditInputChange('patientName', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Patient Email */}
              <div>
                <input
                  type="email"
                  placeholder="Patient Email *"
                  value={editForm.patientEmail || ''}
                  onChange={(e) => handleEditInputChange('patientEmail', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Patient Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Patient Phone *"
                  value={editForm.patientPhone || ''}
                  onChange={(e) => handleEditInputChange('patientPhone', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Date */}
              <div>
                <input
                  type="date"
                  value={editForm.date || ''}
                  onChange={(e) => handleEditInputChange('date', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Time */}
              <div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <select
                      value={editForm.timeHour || ''}
                      onChange={(e) => handleEditInputChange('timeHour', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Hour</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                        <option key={hour} value={hour.toString().padStart(2, '0')}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={editForm.timeMinute || ''}
                      onChange={(e) => handleEditInputChange('timeMinute', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Minute</option>
                      {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                        <option key={minute} value={minute.toString().padStart(2, '0')}>
                          {minute.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={editForm.timePeriod || ''}
                      onChange={(e) => handleEditInputChange('timePeriod', e.target.value)}
                      className="input-field"
                    >
                      <option value="">AM/PM</option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <select 
                  value={editForm.type || ''}
                  onChange={(e) => handleEditInputChange('type', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Type *</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <textarea
                  placeholder="Notes (optional)"
                  rows="3"
                  value={editForm.notes || ''}
                  onChange={(e) => handleEditInputChange('notes', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateAppointment}
                className="btn-primary flex-1"
              >
                Update Appointment
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
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <input
                      type="date"
                      value={advancedFilters.dateFrom}
                      onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={advancedFilters.dateTo}
                      onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <div className="flex space-x-2">
                      <select
                        value={advancedFilters.timeFromHour || ''}
                        onChange={(e) => handleAdvancedFilterChange('timeFromHour', e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">Hour</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                          <option key={hour} value={hour.toString().padStart(2, '0')}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <select
                        value={advancedFilters.timeFromMinute || ''}
                        onChange={(e) => handleAdvancedFilterChange('timeFromMinute', e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">Minute</option>
                        {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                          <option key={minute} value={minute.toString().padStart(2, '0')}>
                            {minute.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <select
                        value={advancedFilters.timeFromPeriod || ''}
                        onChange={(e) => handleAdvancedFilterChange('timeFromPeriod', e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <div className="flex space-x-2">
                      <select
                        value={advancedFilters.timeToHour || ''}
                        onChange={(e) => handleAdvancedFilterChange('timeToHour', e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">Hour</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                          <option key={hour} value={hour.toString().padStart(2, '0')}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <select
                        value={advancedFilters.timeToMinute || ''}
                        onChange={(e) => handleAdvancedFilterChange('timeToMinute', e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">Minute</option>
                        {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                          <option key={minute} value={minute.toString().padStart(2, '0')}>
                            {minute.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <select
                        value={advancedFilters.timeToPeriod || ''}
                        onChange={(e) => handleAdvancedFilterChange('timeToPeriod', e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                <select
                  value={advancedFilters.type}
                  onChange={(e) => handleAdvancedFilterChange('type', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Types</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={advancedFilters.duration}
                  onChange={(e) => handleAdvancedFilterChange('duration', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Durations</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
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

export default Appointments 