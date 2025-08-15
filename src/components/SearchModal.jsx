import React from 'react'
import { 
  X, 
  Search, 
  Calendar, 
  Users, 
  UserCheck, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Eye,
  Edit
} from 'lucide-react'
import { useSearch } from '../contexts/SearchContext'

const SearchModal = ({ isOpen, onClose }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    activeTab, 
    setActiveTab,
    clearSearch 
  } = useSearch()

  if (!isOpen) return null

  const handleClose = () => {
    clearSearch()
    onClose()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const totalResults = searchResults.appointments.length + 
                     searchResults.patients.length + 
                     searchResults.doctors.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments, patients, doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-hidden">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Start typing to search</h3>
              <p className="text-sm">Search across appointments, patients, and doctors</p>
            </div>
          ) : isSearching ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'appointments' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Appointments ({searchResults.appointments.length})
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'patients' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Patients ({searchResults.patients.length})
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'doctors' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Doctors ({searchResults.doctors.length})
                </button>
              </div>

              {/* Results Content */}
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Appointments */}
                {(activeTab === 'all' || activeTab === 'appointments') && 
                 searchResults.appointments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                      Appointments ({searchResults.appointments.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.appointments.map((apt) => (
                        <div key={apt.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{apt.patientName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{apt.date} at {apt.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(apt.type)}`}>
                                {apt.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserCheck className="w-4 h-4" />
                              <span>{apt.doctorName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{apt.patientEmail}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patients */}
                {(activeTab === 'all' || activeTab === 'patients') && 
                 searchResults.patients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary-600" />
                      Patients ({searchResults.patients.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.patients.map((patient) => (
                        <div key={patient.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{patient.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                              {patient.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{patient.age} years, {patient.gender}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Next: {patient.nextAppointment}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctors */}
                {(activeTab === 'all' || activeTab === 'doctors') && 
                 searchResults.doctors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-primary-600" />
                      Doctors ({searchResults.doctors.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.doctors.map((doctor) => (
                        <div key={doctor.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                              {doctor.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{doctor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserCheck className="w-4 h-4" />
                              <span>{doctor.specialty}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{doctor.rating} ({doctor.patientsSeen} patients)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal 