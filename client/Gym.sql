create database Bio;
use Bio;
create table Login (
	LoginId int auto_increment primary key,
	Role varchar(25),
	UserName varchar(25),
	Password varchar(25));
INSERT INTO Login (UserName, Password, Role)
VALUES ('admin', 'admin', 'admin');

CREATE TABLE FingerprintNew (
    fingerPrintID INT PRIMARY KEY AUTO_INCREMENT,
    Role VARCHAR(255),
    fingerPrint1 longblob,
    fingerPrint2 longblob,
    fingerPrint3 longblob,
    CreatedDate DATE
);

create table Servicetable(
	ServiceId  int  AUTO_INCREMENT PRIMARY KEY,
	ServiceName nvarchar(255),
	CreateAt date) ;

create table Packagetable (
	PackageId int  AUTO_INCREMENT PRIMARY KEY,
	PackageName nvarchar(255),
	PackageAmount decimal(18,2),
	CreatedAt date );

CREATE TABLE CandidateEnrollment (
    CandidateId INT AUTO_INCREMENT PRIMARY KEY,
    Name NVARCHAR(255),
    Gender NVARCHAR(50),
    Address NVARCHAR(500),
    MobileNumber VARCHAR(15),
    DOB DATE,
    ServiceId INT,
    PackageId INT,
    PackageAmount DECIMAL(18,2),
    BalanceAmount DECIMAL(18,2),
    FromDate DATE,
    ToDate DATE,
    PaymentStatus VARCHAR(50),
    FingerPrintID INT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate DATETIME,

    CONSTRAINT FK_Candidate_Service FOREIGN KEY (ServiceId) REFERENCES Servicetable(ServiceId),
    CONSTRAINT FK_Candidate_Package FOREIGN KEY (PackageId) REFERENCES Packagetable(PackageId),
    CONSTRAINT FK_Candidate_FingerPrint FOREIGN KEY (FingerPrintID) REFERENCES fingerprintnew(fingerPrintID)
);



CREATE TABLE TrainerEnrollment (
    TrainerId INT AUTO_INCREMENT PRIMARY KEY,
    Password VARCHAR(255),
    Name NVARCHAR(255),
    Age INT,
    Address NVARCHAR(255),
    MobileNumber VARCHAR(15),
    JoiningDate DATE,
    FingerPrintID INT,
    IsActive BOOLEAN ,
    CreatedDate DateTime,
    FOREIGN KEY (FingerPrintID) REFERENCES fingerprintnew(fingerPrintID)
);     

create table EquipmentEnrollment(
	EquipmentId int ,
	EquipmentName nvarchar(255),
	EquipmentPurchaseDate datetime ,
	EquipmentCount int ,
	EquipmentCondition nvarchar(255),
	CreatedDate datetime);    
                    

CREATE TABLE Payment (
    PaymentReceiptNo INT AUTO_INCREMENT PRIMARY KEY,
    CandidateId INT,
    Name NVARCHAR(255),
    ServiceId INT,
    BalanceAmount DECIMAL(10,2),
    PaymentAmount DECIMAL(10,2),
    Paymentmode VARCHAR(50),
    collectedby NVARCHAR(255),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate DateTime,
    UpdatedDate DateTime);


create table AttendanceTable (
    AttendanceId int AUTO_INCREMENT primary key ,
    CandidateId int,
    CandidateName nvarchar(255),
    fingerPrintID int ,
    AttendanceDate datetime,
    InTime time,
    IsActive Boolean,
    FOREIGN KEY (fingerPrintID) REFERENCES fingerprintnew(fingerPrintID));

Create table ServiceMaster(
	ServiceId int, 
	ServiceName varchar(30),
	PlanDuration  varchar(30),
	PlanAmount decimal(10,0),
	CreatedDate  date,
	UpdatedDate date);
