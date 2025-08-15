import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    appointments: [],
    patients: [],
    doctors: []
  })
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // Mock data for search
  const mockData = {
    appointments: [
      {
        id: 1,
        patientName: 'Sarah Johnson',
        patientEmail: 'sarah.johnson@email.com',
        patientPhone: '+1 (555) 123-4567',
        date: '2024-01-15',
        time: '09:00 AM',
        type: 'Consultation',
        status: 'confirmed',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: 2,
        patientName: 'Michael Chen',
        patientEmail: 'michael.chen@email.com',
        patientPhone: '+1 (555) 234-5678',
        date: '2024-01-15',
        time: '10:30 AM',
        type: 'Follow-up',
        status: 'pending',
        doctorName: 'Dr. Michael Chen'
      },
      {
        id: 3,
        patientName: 'Emily Davis',
        patientEmail: 'emily.davis@email.com',
        patientPhone: '+1 (555) 345-6789',
        date: '2024-01-15',
        time: '02:00 PM',
        type: 'Check-up',
        status: 'completed',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: 4,
        patientName: 'Robert Wilson',
        patientEmail: 'robert.wilson@email.com',
        patientPhone: '+1 (555) 456-7890',
        date: '2024-01-16',
        time: '11:00 AM',
        type: 'Emergency',
        status: 'confirmed',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: 5,
        patientName: 'Lisa Brown',
        patientEmail: 'lisa.brown@email.com',
        patientPhone: '+1 (555) 567-8901',
        date: '2024-01-16',
        time: '03:30 PM',
        type: 'Consultation',
        status: 'pending',
        doctorName: 'Dr. Michael Chen'
      }
    ],
    patients: [
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
        medicalHistory: 'Hypertension, Diabetes Type 2'
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
        medicalHistory: 'Asthma, Seasonal Allergies'
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
        medicalHistory: 'Migraine, Insomnia'
      },
      {
        id: 4,
        name: 'Robert Wilson',
        email: 'robert.wilson@email.com',
        phone: '+1 (555) 456-7890',
        age: 45,
        gender: 'Male',
        lastVisit: '2024-01-14',
        nextAppointment: '2024-01-16',
        status: 'active',
        medicalHistory: 'Heart Disease, High Cholesterol'
      },
      {
        id: 5,
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        phone: '+1 (555) 567-8901',
        age: 31,
        gender: 'Female',
        lastVisit: '2024-01-13',
        nextAppointment: '2024-01-16',
        status: 'active',
        medicalHistory: 'Pregnancy, Gestational Diabetes'
      }
    ],
    doctors: [
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
        status: 'active'
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
        status: 'active'
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
        status: 'active'
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
        status: 'active'
      }
    ]
  }

  const performSearch = useCallback((query) => {
    console.log('Performing search for:', query) // Debug log
    
    if (!query.trim()) {
      setSearchResults({ appointments: [], patients: [], doctors: [] })
      return
    }

    setIsSearching(true)
    const lowerQuery = query.toLowerCase()

    // Search appointments
    const filteredAppointments = mockData.appointments.filter(apt => 
      apt.patientName.toLowerCase().includes(lowerQuery) ||
      apt.patientEmail.toLowerCase().includes(lowerQuery) ||
      apt.patientPhone.includes(lowerQuery) ||
      apt.type.toLowerCase().includes(lowerQuery) ||
      apt.doctorName.toLowerCase().includes(lowerQuery) ||
      apt.date.includes(lowerQuery) ||
      apt.time.toLowerCase().includes(lowerQuery)
    )

    // Search patients
    const filteredPatients = mockData.patients.filter(patient => 
      patient.name.toLowerCase().includes(lowerQuery) ||
      patient.email.toLowerCase().includes(lowerQuery) ||
      patient.phone.includes(lowerQuery) ||
      patient.medicalHistory.toLowerCase().includes(lowerQuery) ||
      patient.status.toLowerCase().includes(lowerQuery)
    )

    // Search doctors
    const filteredDoctors = mockData.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(lowerQuery) ||
      doctor.email.toLowerCase().includes(lowerQuery) ||
      doctor.phone.includes(lowerQuery) ||
      doctor.specialty.toLowerCase().includes(lowerQuery) ||
      doctor.status.toLowerCase().includes(lowerQuery)
    )

    console.log('Search results:', { // Debug log
      appointments: filteredAppointments.length,
      patients: filteredPatients.length,
      doctors: filteredDoctors.length
    })

    setSearchResults({
      appointments: filteredAppointments,
      patients: filteredPatients,
      doctors: filteredDoctors
    })

    setIsSearching(false)
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, performSearch])

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults({ appointments: [], patients: [], doctors: [] })
    setActiveTab('all')
  }

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    activeTab,
    setActiveTab,
    clearSearch,
    performSearch
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
} 