Create Database Gym;
use Gym;

CREATE TABLE login_auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin', 'trainer') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Admin
INSERT INTO login_auth (userName, password, role)
VALUES ('admin', 'admin', 'admin');
-- Trainer
INSERT INTO login_auth (userName, password, role)
VALUES ('trainer', 'trainer', 'trainer');

-- Create Branch table
CREATE TABLE Branch (
  branchId INT PRIMARY KEY AUTO_INCREMENT,
  branchName VARCHAR(100) NOT NULL,
  location VARCHAR(100)
);

-- Create Fingerprint table
CREATE TABLE Fingerprint (
  fingerPrintID INT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(50),
  fingerPrint1 longtext,
  fingerPrint2 longtext,
  fingerPrint3 longtext,
  createdDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Service (
  serviceId INT PRIMARY KEY AUTO_INCREMENT,
  serviceName VARCHAR(100)
);

CREATE TABLE Package (
  packageId INT PRIMARY KEY AUTO_INCREMENT,
  packageName VARCHAR(100),
  packageAmount DECIMAL(10, 2)
);

-- Create Trainer table
CREATE TABLE Trainer (
  trainerId INT PRIMARY KEY AUTO_INCREMENT,
  password VARCHAR(255),
  name VARCHAR(255),
  mobileNumber VARCHAR(20),
  age INT,
  address TEXT,
  joiningDate DATE,
  isActive BOOLEAN DEFAULT TRUE,
  fingerPrintID INT,
  branchId INT,
  createdDate DATE,
  FOREIGN KEY (fingerPrintID) REFERENCES Fingerprint(fingerPrintID),
  FOREIGN KEY (branchId) REFERENCES Branch(branchId)
);

CREATE TABLE Candidate (
  candidateId INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  gender VARCHAR(20),
  address TEXT,
  mobileNumber VARCHAR(20),
  doj DATE,
  serviceId INT,
  packageId INT,
  branchId INT,
  packageMonths INT,
  packageAmount DECIMAL(10, 2),
  balanceAmount DECIMAL(10, 2),
  fromDate DATE,
  toDate DATE,
  paymentStatus VARCHAR(20),
  fingerPrintID INT,
  isActive BOOLEAN DEFAULT TRUE,
  createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Key Constraints
  FOREIGN KEY (serviceId) REFERENCES Service(serviceId) ON DELETE SET NULL,
  FOREIGN KEY (packageId) REFERENCES Package(packageId) ON DELETE SET NULL,
  FOREIGN KEY (fingerPrintID) REFERENCES Fingerprint(fingerPrintID) ON DELETE SET NULL,
  FOREIGN KEY (branchId) REFERENCES Branch(branchId) ON DELETE SET NULL
);

CREATE TABLE Payment (
  paymentId INT PRIMARY KEY AUTO_INCREMENT,
  candidateId INT,
  name VARCHAR(100),
  serviceId INT,
  balanceAmount DECIMAL(10,2),
  paymentAmount DECIMAL(10,2),
  paymentmode VARCHAR(20),
  collectedby VARCHAR(100),
  sessionId VARCHAR(100),
  createdDate DATE,
  updatedDate DATE,
  paymentReceiptNo VARCHAR(50),
  FOREIGN KEY (candidateId) REFERENCES Candidate(candidateId),
  FOREIGN KEY (serviceId) REFERENCES Service(serviceId)
);

UPDATE Payment 
SET paymentReceiptNo = CONCAT('RCPT-', LPAD(paymentId, 5, '0')) 
WHERE paymentId = LAST_INSERT_ID();

CREATE TABLE Attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidateId INT,
  attendanceDate DATE,
  inTime TIME,
  createdAt DATETIME,
  FOREIGN KEY (candidateId) REFERENCES Candidate(candidateId)
);





