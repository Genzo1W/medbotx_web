import React, { useState, useEffect } from 'react'
import { 
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search
} from 'lucide-react'

const NewAppointmentModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  selectedDate = null,
  appointments = [] 
}) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearchTerm, setCountrySearchTerm] = useState('')
  
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

  // Initialize form with selected date
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }))
    }
  }, [selectedDate])

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest('.country-dropdown')) {
        setShowCountryDropdown(false)
        setCountrySearchTerm('') // Clear search term
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCountryDropdown])

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
      case 'patientName':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Patient name is required'
        } else if (value.trim().length < 2) {
          isValid = false
          message = 'Name must be at least 2 characters'
        }
        break

      case 'patientEmail':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Email is required'
        } else if (!validateEmail(value)) {
          isValid = false
          message = 'Please enter a valid email address'
        }
        break

      case 'patientPhone':
        if (value.trim().length === 0) {
          isValid = false
          message = 'Phone number is required'
        } else if (!validatePhone(value)) {
          isValid = false
          message = 'Please enter a valid phone number'
        }
        break

      case 'country':
        if (!value) {
          isValid = false
          message = 'Country is required'
        }
        break

      case 'date':
        if (!value) {
          isValid = false
          message = 'Date is required'
        } else {
          const selectedDate = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (selectedDate < today) {
            isValid = false
            message = 'Date cannot be in the past'
          }
        }
        break

      case 'timeHour':
        if (!value) {
          isValid = false
          message = 'Hour is required'
        } else if (parseInt(value) < 1 || parseInt(value) > 12) {
          isValid = false
          message = 'Hour must be between 1 and 12'
        }
        break

      case 'timeMinute':
        if (!value) {
          isValid = false
          message = 'Minute is required'
        } else if (parseInt(value) < 0 || parseInt(value) > 59) {
          isValid = false
          message = 'Minute must be between 0 and 59'
        }
        break

      case 'timePeriod':
        if (!value) {
          isValid = false
          message = 'AM/PM is required'
        }
        break

      case 'type':
        if (!value) {
          isValid = false
          message = 'Appointment type is required'
        }
        break

      default:
        break
    }

    return { isValid, message }
  }

  // Phone number formatting and validation
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
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required'
    }

    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'Email is required'
    } else if (!validateEmail(formData.patientEmail)) {
      newErrors.patientEmail = 'Please enter a valid email address'
    }

    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'Phone number is required'
    } else if (!validatePhone(formData.patientPhone)) {
      newErrors.patientPhone = 'Please enter a valid phone number'
    }

    if (!formData.country) {
      newErrors.country = 'Country is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    // Time validation
    if (!formData.timeHour || !formData.timeMinute || !formData.timePeriod) {
      newErrors.timeHour = 'Time is required'
    }

    if (!formData.type) {
      newErrors.type = 'Appointment type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    let processedValue = value

    // Special handling for phone field
    if (field === 'patientPhone') {
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

  const handleCountrySelect = (countryCode) => {
    setFormData(prev => ({
      ...prev,
      country: countryCode
    }))
    setShowCountryDropdown(false)
    setCountrySearchTerm('') // Clear search term
    
    // Mark field as touched and validate
    setFieldTouched(prev => ({
      ...prev,
      country: true
    }))
    
    const validation = validateFieldRealTime('country', countryCode)
    setRealTimeValidation(prev => ({
      ...prev,
      country: validation
    }))
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
      
      // Combine time fields into a single time string
      const timeString = `${formData.timeHour}:${formData.timeMinute} ${formData.timePeriod}`
      
      // Create new appointment object
      const newAppointment = {
        id: appointments.length + 1,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        country: formData.country,
        date: formData.date,
        time: timeString,
        duration: 30, // Default duration
        type: formData.type,
        status: 'pending',
        notes: formData.notes,
        address: '123 Medical Center Dr, Suite 100'
      }
      
      // Call the onSave callback
      onSave(newAppointment)
      
      // Reset form and close modal
      resetForm()
      onClose()
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      country: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      timeHour: '',
      timeMinute: '',
      timePeriod: '',
      type: '',
      notes: ''
    })
    setErrors({})
    setFieldTouched({})
    setRealTimeValidation({})
    setIsSubmitting(false)
  }

  const handleCloseModal = () => {
    onClose()
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">New Appointment</h3>
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
                placeholder="Patient Name *"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                onBlur={() => handleFieldBlur('patientName')}
                className={getFieldClassName('patientName')}
              />
              {getFieldStatus('patientName') === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {(realTimeValidation.patientName && !realTimeValidation.patientName.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.patientName.message}</span>
              </div>
            )}
          </div>

          {/* Patient Email */}
          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="Patient Email *"
                value={formData.patientEmail}
                onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                onBlur={() => handleFieldBlur('patientEmail')}
                className={getFieldClassName('patientEmail')}
              />
              {getFieldStatus('patientEmail') === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {(realTimeValidation.patientEmail && !realTimeValidation.patientEmail.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.patientEmail.message}</span>
              </div>
            )}
          </div>

          {/* Phone Number with Country Selection */}
          <div>
            <div className="flex space-x-2">
              {/* Country Selection */}
              <div className="relative country-dropdown flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  onBlur={() => handleFieldBlur('country')}
                  className={`w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent flex items-center justify-center ${getFieldClassName('country')}`}
                >
                  {formData.country ? (
                    <Flag countryCode={formData.country} />
                  ) : (
                    <span className="text-gray-500 text-sm">🌍</span>
                  )}
                </button>
                {getFieldStatus('country') === 'success' && (
                  <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                )}
                
                {/* Country Dropdown */}
                {showCountryDropdown && (
                  <div className="absolute z-50 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search countries..."
                          value={countrySearchTerm}
                          onChange={(e) => setCountrySearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {countries.filter(country => 
                        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                        country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
                      ).map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country.code)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                        >
                          <img 
                            src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                            alt={`${country.name} flag`}
                            className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <span className="flex-1 text-left text-sm">{country.name}</span>
                          <span className="text-gray-500 text-xs flex-shrink-0">({country.phoneCode})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="relative flex-1">
                <div className="flex">
                  <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm font-medium text-gray-700 min-w-[60px] justify-center">
                    {getPhoneCode()}
                  </div>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.patientPhone}
                    onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                    onBlur={() => handleFieldBlur('patientPhone')}
                    className={`flex-1 rounded-r-lg ${getFieldClassName('patientPhone').replace('input-field', 'px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent')}`}
                  />
                </div>
                {getFieldStatus('patientPhone') === 'success' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>
            
            {/* Error messages */}
            {(realTimeValidation.country && !realTimeValidation.country.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.country.message}</span>
              </div>
            )}
            {(realTimeValidation.patientPhone && !realTimeValidation.patientPhone.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.patientPhone.message}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Enter phone number without country code</p>
          </div>

          {/* Date */}
          <div>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                onBlur={() => handleFieldBlur('date')}
                className={getFieldClassName('date')}
              />
              {getFieldStatus('date') === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {(realTimeValidation.date && !realTimeValidation.date.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.date.message}</span>
              </div>
            )}
          </div>

          {/* Time */}
          <div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <select
                  value={formData.timeHour || ''}
                  onChange={(e) => handleInputChange('timeHour', e.target.value)}
                  onBlur={() => handleFieldBlur('timeHour')}
                  className={`w-full ${getFieldClassName('timeHour').replace('input-field', 'px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent')}`}
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
                  value={formData.timeMinute || ''}
                  onChange={(e) => handleInputChange('timeMinute', e.target.value)}
                  onBlur={() => handleFieldBlur('timeMinute')}
                  className={`w-full ${getFieldClassName('timeMinute').replace('input-field', 'px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent')}`}
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
                  value={formData.timePeriod || ''}
                  onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                  onBlur={() => handleFieldBlur('timePeriod')}
                  className={`w-full ${getFieldClassName('timePeriod').replace('input-field', 'px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent')}`}
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            
            {/* Error messages */}
            {(realTimeValidation.timeHour && !realTimeValidation.timeHour.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.timeHour.message}</span>
              </div>
            )}
            {(realTimeValidation.timeMinute && !realTimeValidation.timeMinute.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.timeMinute.message}</span>
              </div>
            )}
            {(realTimeValidation.timePeriod && !realTimeValidation.timePeriod.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.timePeriod.message}</span>
              </div>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <div className="relative">
              <select 
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                onBlur={() => handleFieldBlur('type')}
                className={getFieldClassName('type')}
              >
                <option value="">Select Type *</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
                <option value="Emergency">Emergency</option>
              </select>
              {getFieldStatus('type') === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
              )}
            </div>
            {(realTimeValidation.type && !realTimeValidation.type.isValid) && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{realTimeValidation.type.message}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <textarea
              placeholder="Notes (optional)"
              rows="3"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="input-field"
            />
          </div>
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
              <span>Create Appointment</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewAppointmentModal 