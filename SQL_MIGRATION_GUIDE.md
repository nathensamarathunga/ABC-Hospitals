# ABC Hospital - Database Migration Guide
## From LocalStorage to MySQL Database

### Overview
This guide will help you migrate your ABC Hospital Management System from browser localStorage to a MySQL database when you deploy on aaPanel with Apache and MySQL 8.

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'receptionist') NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Doctors Table
```sql
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    doctor_id VARCHAR(20) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualifications TEXT,
    experience_years INT,
    consultation_fee DECIMAL(10,2),
    photo_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Patients Table
```sql
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Appointments Table
```sql
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id VARCHAR(20) UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no-show') DEFAULT 'scheduled',
    symptoms TEXT,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

#### Medical Records Table
```sql
CREATE TABLE medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT,
    visit_date DATE NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);
```

#### Contact Messages Table
```sql
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'in_progress', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### PHP Backend Structure

#### 1. Create `config/database.php`
```php
<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'abc_hospital';
    private $username = 'your_db_username';
    private $password = 'your_db_password';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                                $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

#### 2. Create API Endpoints

Create these PHP files in an `api/` folder:

- `api/login.php` - Handle user authentication
- `api/appointments.php` - CRUD operations for appointments
- `api/patients.php` - Patient management
- `api/doctors.php` - Doctor management
- `api/contact.php` - Contact form submissions

#### 3. Update JavaScript Files

Replace localStorage calls with AJAX calls to PHP endpoints:

```javascript
// Example: Replace localStorage appointment saving
// OLD:
localStorage.setItem('hospitalAppointments', JSON.stringify(appointments));

// NEW:
fetch('api/appointments.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData)
})
.then(response => response.json())
.then(data => {
    console.log('Appointment saved:', data);
});
```

### Migration Steps

#### Step 1: Database Setup
1. In aaPanel, create a new MySQL database named `abc_hospital`
2. Create a database user with full privileges
3. Run all the SQL CREATE TABLE statements above

#### Step 2: Create PHP Backend
1. Create the folder structure:
   ```
   /config/
   /api/
   /includes/
   ```
2. Add the database connection file
3. Create API endpoints for each functionality

#### Step 3: Update Frontend
1. Modify JavaScript files to use fetch() instead of localStorage
2. Add error handling for network requests
3. Update form submissions to send data to PHP endpoints

#### Step 4: Authentication
1. Implement proper password hashing using PHP's `password_hash()`
2. Use sessions for user authentication
3. Add JWT tokens for API security

#### Step 5: File Uploads
1. Create upload directory for doctor photos
2. Implement image upload handling in PHP
3. Update image paths in database

### Sample Data Insertion

```sql
-- Insert sample admin user
INSERT INTO users (username, password, role, email, full_name) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'admin@abchospital.lk', 'System Administrator');

-- Insert sample doctor
INSERT INTO users (username, password, role, email, full_name) 
VALUES ('dr.perera', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', 'rohan.perera@abchospital.lk', 'Dr. Rohan Perera');

INSERT INTO doctors (user_id, doctor_id, specialization, qualifications, experience_years, consultation_fee) 
VALUES (2, 'DOC001', 'Cardiology', 'MBBS, MD (Cardiology), FRCP', 15, 3500.00);
```

### Deployment Checklist

- [ ] Create MySQL database and user
- [ ] Upload all files to server
- [ ] Set proper file permissions (755 for directories, 644 for files)
- [ ] Configure database connection
- [ ] Test all API endpoints
- [ ] Import sample data
- [ ] Configure SSL certificate
- [ ] Set up regular database backups

### Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **SQL Injection**: Use prepared statements
3. **Password Security**: Use strong hashing algorithms
4. **File Uploads**: Validate file types and sizes
5. **Session Security**: Use secure session configurations
6. **HTTPS**: Ensure all data transmission is encrypted

### Performance Optimization

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis or Memcached
3. **Image Optimization**: Use WebP format for images
4. **CDN**: Consider using a CDN for static assets
5. **Database Connection Pooling**: Implement connection pooling

Would you like me to create the PHP backend files or help with any specific part of the migration?