// ABC Hospital Management System - Main JavaScript

// Global variables
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let doctors = JSON.parse(localStorage.getItem('doctors')) || [];
let receptionists = JSON.parse(localStorage.getItem('receptionists')) || [];
let patients = JSON.parse(localStorage.getItem('patients')) || [];

// Initialize default admin if doesn't exist
function initializeDefaultData() {
    if (!localStorage.getItem('adminUser')) {
        const defaultAdmin = {
            id: 'admin001',
            username: 'admin',
            password: 'admin123',
            email: 'admin@abchospital.com',
            role: 'admin',
            name: 'System Administrator'
        };
        localStorage.setItem('adminUser', JSON.stringify(defaultAdmin));
    }

    // Initialize sample doctors if none exist
    if (doctors.length === 0) {
        const sampleDoctors = [
            {
                id: 'DOC001',
                name: 'Dr. Sarah Johnson',
                specialization: 'Cardiology',
                email: 'sarah.johnson@abchospital.com',
                phone: '+1-555-0123',
                username: 'dr.sarah',
                password: 'doctor123',
                schedule: 'Mon-Fri: 9:00 AM - 5:00 PM',
                status: 'active',
                registeredBy: 'admin',
                registeredDate: new Date().toISOString()
            },
            {
                id: 'DOC002',
                name: 'Dr. Michael Chen',
                specialization: 'Neurology',
                email: 'michael.chen@abchospital.com',
                phone: '+1-555-0124',
                username: 'dr.michael',
                password: 'doctor123',
                schedule: 'Mon-Wed, Fri: 8:00 AM - 4:00 PM',
                status: 'active',
                registeredBy: 'admin',
                registeredDate: new Date().toISOString()
            },
            {
                id: 'DOC003',
                name: 'Dr. Emily Rodriguez',
                specialization: 'Pediatrics',
                email: 'emily.rodriguez@abchospital.com',
                phone: '+1-555-0125',
                username: 'dr.emily',
                password: 'doctor123',
                schedule: 'Mon-Fri: 8:00 AM - 6:00 PM',
                status: 'active',
                registeredBy: 'admin',
                registeredDate: new Date().toISOString()
            },
            {
                id: 'DOC004',
                name: 'Dr. James Wilson',
                specialization: 'Orthopedics',
                email: 'james.wilson@abchospital.com',
                phone: '+1-555-0126',
                username: 'dr.james',
                password: 'doctor123',
                schedule: 'Tue-Sat: 10:00 AM - 6:00 PM',
                status: 'active',
                registeredBy: 'admin',
                registeredDate: new Date().toISOString()
            }
        ];
        doctors = sampleDoctors;
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }

    // Initialize sample receptionists if none exist
    if (receptionists.length === 0) {
        const sampleReceptionists = [
            {
                id: 'REC001',
                name: 'Emily Davis',
                email: 'emily.davis@abchospital.com',
                phone: '+1-555-0125',
                username: 'emily.davis',
                password: 'reception123',
                shift: 'Morning (8:00 AM - 4:00 PM)',
                status: 'active',
                registeredBy: 'admin',
                registeredDate: new Date().toISOString()
            }
        ];
        receptionists = sampleReceptionists;
        localStorage.setItem('receptionists', JSON.stringify(receptionists));
    }

    // Initialize sample appointments if none exist
    if (appointments.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const sampleAppointments = [
            {
                id: 'APT001DEMO',
                patientName: 'John Smith',
                patientEmail: 'john.smith@email.com',
                patientPhone: '+1-555-0201',
                doctorId: 'DOC001',
                appointmentDate: today.toISOString().split('T')[0],
                appointmentTime: '10:00',
                reason: 'Regular cardiac checkup and blood pressure monitoring',
                status: 'confirmed',
                bookedDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                bookedBy: 'Patient Portal'
            },
            {
                id: 'APT002DEMO',
                patientName: 'Mary Johnson',
                patientEmail: 'mary.johnson@email.com',
                patientPhone: '+1-555-0202',
                doctorId: 'DOC002',
                appointmentDate: today.toISOString().split('T')[0],
                appointmentTime: '14:30',
                reason: 'Headache and dizziness symptoms for the past week',
                status: 'pending',
                bookedDate: new Date().toISOString(),
                bookedBy: 'Emily Davis'
            },
            {
                id: 'APT003DEMO',
                patientName: 'Robert Brown',
                patientEmail: 'robert.brown@email.com',
                patientPhone: '+1-555-0203',
                doctorId: 'DOC003',
                appointmentDate: tomorrow.toISOString().split('T')[0],
                appointmentTime: '09:30',
                reason: 'Child vaccination - 6 month checkup',
                status: 'confirmed',
                bookedDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                bookedBy: 'Patient Portal'
            },
            {
                id: 'APT004DEMO',
                patientName: 'Lisa Davis',
                patientEmail: 'lisa.davis@email.com',
                patientPhone: '+1-555-0204',
                doctorId: 'DOC004',
                appointmentDate: nextWeek.toISOString().split('T')[0],
                appointmentTime: '11:00',
                reason: 'Knee pain after sports injury',
                status: 'confirmed',
                bookedDate: new Date().toISOString(),
                bookedBy: 'Dr. James Wilson'
            },
            {
                id: 'APT005DEMO',
                patientName: 'David Wilson',
                patientEmail: 'david.wilson@email.com',
                patientPhone: '+1-555-0205',
                doctorId: 'DOC001',
                appointmentDate: tomorrow.toISOString().split('T')[0],
                appointmentTime: '15:00',
                reason: 'Follow-up appointment for hypertension treatment',
                status: 'pending',
                bookedDate: new Date().toISOString(),
                bookedBy: 'Patient Portal'
            }
        ];
        appointments = sampleAppointments;
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
}

// Authentication functions
function login(username, password, role = null) {
    // Check admin login
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (adminUser && username === adminUser.username && password === adminUser.password) {
        currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }

    // Check doctor login
    const doctor = doctors.find(doc => 
        doc.username === username && doc.password === password && doc.status === 'active'
    );
    if (doctor) {
        currentUser = { ...doctor, role: 'doctor' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }

    // Check receptionist login
    const receptionist = receptionists.find(rec => 
        rec.username === username && rec.password === password && rec.status === 'active'
    );
    if (receptionist) {
        currentUser = { ...receptionist, role: 'receptionist' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }

    return { success: false, message: 'Invalid username or password' };
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

function checkAuth() {
    if (!currentUser) {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

function hasRole(requiredRole) {
    return currentUser && currentUser.role === requiredRole;
}

// Doctor management functions
function registerDoctor(doctorData) {
    try {
        const newDoctor = {
            id: generateId('DOC'),
            ...doctorData,
            status: 'active',
            registeredBy: currentUser?.username || 'admin',
            registeredDate: new Date().toISOString()
        };
        
        doctors.push(newDoctor);
        localStorage.setItem('doctors', JSON.stringify(doctors));
        return { success: true, doctor: newDoctor };
    } catch (error) {
        return { success: false, message: 'Failed to register doctor' };
    }
}

function updateDoctor(doctorId, updatedData) {
    try {
        const index = doctors.findIndex(doc => doc.id === doctorId);
        if (index === -1) {
            return { success: false, message: 'Doctor not found' };
        }
        
        doctors[index] = { ...doctors[index], ...updatedData };
        localStorage.setItem('doctors', JSON.stringify(doctors));
        return { success: true, doctor: doctors[index] };
    } catch (error) {
        return { success: false, message: 'Failed to update doctor' };
    }
}

function deleteDoctor(doctorId) {
    try {
        const index = doctors.findIndex(doc => doc.id === doctorId);
        if (index === -1) {
            return { success: false, message: 'Doctor not found' };
        }
        
        doctors[index].status = 'inactive';
        localStorage.setItem('doctors', JSON.stringify(doctors));
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to delete doctor' };
    }
}

// Appointment management functions
function bookAppointment(appointmentData) {
    try {
        const newAppointment = {
            id: generateId('APT'),
            ...appointmentData,
            status: 'pending',
            bookedDate: new Date().toISOString(),
            bookedBy: currentUser?.name || 'Guest Patient'
        };
        
        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return { success: true, appointment: newAppointment };
    } catch (error) {
        return { success: false, message: 'Failed to book appointment' };
    }
}

function updateAppointmentStatus(appointmentId, status, scheduledDateTime = null) {
    try {
        const index = appointments.findIndex(apt => apt.id === appointmentId);
        if (index === -1) {
            return { success: false, message: 'Appointment not found' };
        }
        
        appointments[index].status = status;
        if (scheduledDateTime) {
            appointments[index].scheduledDateTime = scheduledDateTime;
        }
        appointments[index].lastUpdated = new Date().toISOString();
        appointments[index].updatedBy = currentUser?.name || 'System';
        
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return { success: true, appointment: appointments[index] };
    } catch (error) {
        return { success: false, message: 'Failed to update appointment' };
    }
}

function getAppointments(filter = {}) {
    let filteredAppointments = [...appointments];
    
    if (filter.doctorId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.doctorId === filter.doctorId);
    }
    
    if (filter.status) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === filter.status);
    }
    
    if (filter.date) {
        filteredAppointments = filteredAppointments.filter(apt => 
            apt.appointmentDate === filter.date
        );
    }
    
    return filteredAppointments.sort((a, b) => new Date(b.bookedDate) - new Date(a.bookedDate));
}

// Utility functions
function generateId(prefix = 'ID') {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${prefix}${timestamp}${randomStr}`.toUpperCase();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[-\s\(\)]/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// UI Helper functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="modal-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Insert at the top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function updateUserDisplay() {
    const userInfo = document.querySelector('.user-info');
    if (userInfo && currentUser) {
        const userAvatar = userInfo.querySelector('.user-avatar');
        const userNameSpan = userInfo.querySelector('.user-name');
        
        if (userAvatar) {
            userAvatar.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
        }
        
        if (userNameSpan) {
            userNameSpan.textContent = currentUser.name || currentUser.username;
        }
    }
}

function populateSelect(selectId, options, valueKey = 'id', textKey = 'name') {
    const select = document.getElementById(selectId);
    if (select) {
        select.innerHTML = '<option value="">Select...</option>';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option[valueKey];
            optionElement.textContent = option[textKey];
            select.appendChild(optionElement);
        });
    }
}

// Event listeners for common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize default data
    initializeDefaultData();
    
    // Update user display if logged in
    if (currentUser) {
        updateUserDisplay();
    }

    // Initialize images after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (window.ImageHelpers) {
            // Enhance service cards with images
            window.ImageHelpers.enhanceServiceCards();
            
            // Create hospital gallery
            const galleryContainer = document.getElementById('hospitalGallery');
            if (galleryContainer) {
                window.ImageHelpers.createHospitalGallery(galleryContainer);
            }
        }
    }, 100);
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
                submitBtn.disabled = true;
                
                // Restore button after 2 seconds (simulate processing)
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }, 2000);
            }
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            openModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Ctrl/Cmd + K for quick search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implement quick search functionality
    }
});

// Export functions for use in other scripts
window.HospitalMS = {
    // Auth
    login,
    logout,
    checkAuth,
    hasRole,
    
    // Doctors
    registerDoctor,
    updateDoctor,
    deleteDoctor,
    
    // Appointments
    bookAppointment,
    updateAppointmentStatus,
    getAppointments,
    
    // Utils
    generateId,
    formatDate,
    formatDateTime,
    validateEmail,
    validatePhone,
    validateRequired,
    showAlert,
    showModal,
    hideModal,
    updateUserDisplay,
    populateSelect,
    
    // Data
    get currentUser() { return currentUser; },
    get doctors() { return [...doctors]; },
    get appointments() { return [...appointments]; },
    get receptionists() { return [...receptionists]; },
    get patients() { return [...patients]; }
};