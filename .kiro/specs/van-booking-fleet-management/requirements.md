# Requirements Document: Van Booking & Fleet Management System

## Introduction

The Van Booking & Fleet Management System (VBMS) is a SharePoint-based solution designed to modernize the management of a shared fleet of vans used by 8 field Project Representatives. The system replaces manual Excel-based tracking with an automated platform that prevents booking conflicts, provides comprehensive audit trails, and enables real-time fleet management. Built on Microsoft 365 technologies (SharePoint, Power Apps, Power Automate, Azure), the system supports booking management, vehicle tracking, maintenance scheduling, incident management, cost tracking, and automated notifications.

## Glossary

- **VBMS**: Van Booking & Fleet Management System
- **Van_Master**: The central registry of all fleet vehicles with their attributes
- **Booking_System**: The subsystem responsible for creating, modifying, and managing van reservations
- **Calendar_View**: The visual interface displaying van availability and booking status
- **Maintenance_Scheduler**: The subsystem managing vehicle service schedules and maintenance logs
- **Incident_Manager**: The subsystem tracking fines and incidents
- **Notification_Engine**: The subsystem sending automated email and Teams notifications
- **Cost_Tracker**: The subsystem recording and aggregating running costs
- **Reporting_Module**: The subsystem generating utilization and cost reports
- **Project_Representative**: Field staff who book and use vans
- **Fleet_Administrator**: Staff with full system access to manage fleet operations
- **Conflict**: A situation where two bookings overlap for the same van
- **Booking_Lifecycle**: The progression of booking statuses (Requested, Confirmed, Active, Completed, Cancelled)
- **Vehicle_Status**: The operational state of a van (Available, Booked, Active, Unavailable, Inactive)
- **Project_ID**: A 5-digit identifier linking bookings and costs to specific projects
- **Audit_Trail**: A complete historical record of all changes to system entities

## Requirements

### Requirement 1: Van Master Data Management

**User Story:** As a Fleet Administrator, I want to maintain a central registry of all fleet vehicles with their attributes, so that I can track vehicle information and manage the fleet effectively.

#### Acceptance Criteria

1. THE Van_Master SHALL store vehicle identification including Van ID, registration number, make, model, year, and VIN
2. THE Van_Master SHALL store vehicle classification including tier and type
3. THE Van_Master SHALL store cost rates including daily rate and mileage rate
4. THE Van_Master SHALL store current operational status for each vehicle
5. WHEN a Fleet Administrator creates a new vehicle record, THE Van_Master SHALL validate that the Van ID is unique
6. WHEN a Fleet Administrator creates a new vehicle record, THE Van_Master SHALL validate that the registration number is unique
7. WHEN a Fleet Administrator updates vehicle information, THE Van_Master SHALL record the change in the Audit_Trail with timestamp and user

### Requirement 2: Vehicle Profile Management

**User Story:** As a Fleet Administrator, I want detailed profile pages for each vehicle, so that I can access comprehensive vehicle information and history in one place.

#### Acceptance Criteria

1. THE VBMS SHALL provide a detailed profile page for each vehicle in the Van_Master
2. WHEN a user views a vehicle profile, THE VBMS SHALL display configuration and accessories information
3. WHEN a user views a vehicle profile, THE VBMS SHALL display all associated documents including insurance certificates, registration documents, and inspection certificates
4. WHEN a user views a vehicle profile, THE VBMS SHALL display document expiry dates for compliance tracking
5. WHEN a user views a vehicle profile, THE VBMS SHALL display current operational status
6. WHEN a user views a vehicle profile, THE VBMS SHALL display complete booking history
7. WHEN a user views a vehicle profile, THE VBMS SHALL display all incidents and fines associated with the vehicle
8. WHEN a user views a vehicle profile, THE VBMS SHALL display maintenance history

### Requirement 3: Booking Creation and Management

**User Story:** As a Project Representative, I want to create and manage van bookings, so that I can reserve vehicles for my project work.

#### Acceptance Criteria

1. WHEN a Project Representative creates a booking, THE Booking_System SHALL require Project ID, driver name, driver contact, van selection, start date/time, and end date/time
2. WHEN a Project Representative creates a booking, THE Booking_System SHALL validate that the Project ID is exactly 5 digits
3. WHEN a Project Representative creates a booking, THE Booking_System SHALL validate that the end date/time is after the start date/time
4. WHEN a Project Representative creates a booking, THE Booking_System SHALL check for conflicts with existing bookings for the selected van
5. WHEN a booking conflict is detected, THE Booking_System SHALL prevent the booking creation and display the conflicting booking details
6. WHEN a booking is successfully created, THE Booking_System SHALL assign it a unique booking ID
7. WHEN a booking is successfully created, THE Booking_System SHALL set the initial status to Requested
8. WHEN a booking is created, THE Booking_System SHALL record the creating user and timestamp in the Audit_Trail
9. WHEN a Project Representative modifies their own booking, THE Booking_System SHALL validate the changes against conflicts
10. WHEN a booking is modified, THE Booking_System SHALL record the modification in the Audit_Trail with user and timestamp
11. WHEN a Project Representative cancels their own booking, THE Booking_System SHALL update the status to Cancelled
12. WHEN a booking is cancelled, THE Booking_System SHALL record the cancellation in the Audit_Trail with user and timestamp
13. WHERE a user is a Fleet Administrator, THE Booking_System SHALL allow modification of any booking
14. WHERE a user is a Fleet Administrator, THE Booking_System SHALL allow cancellation of any booking

### Requirement 4: Booking Lifecycle Management

**User Story:** As a Fleet Administrator, I want bookings to progress through defined lifecycle stages, so that I can track booking status accurately.

#### Acceptance Criteria

1. THE Booking_System SHALL support the following booking statuses: Requested, Confirmed, Active, Completed, Cancelled
2. WHEN a booking start time arrives, THE Booking_System SHALL automatically update the status from Confirmed to Active
3. WHEN a booking end time passes, THE Booking_System SHALL automatically update the status from Active to Completed
4. WHEN a booking status changes automatically, THE Booking_System SHALL record the change in the Audit_Trail

### Requirement 5: Calendar Visualization

**User Story:** As a Project Representative, I want to view van availability in a calendar format, so that I can quickly identify available vehicles for my booking needs.

#### Acceptance Criteria

1. THE Calendar_View SHALL display van availability in daily, weekly, and monthly views
2. WHEN displaying van status, THE Calendar_View SHALL use color coding: Available (green), Booked (blue), Active (orange), Unavailable (red), Inactive (grey)
3. THE Calendar_View SHALL provide filters for tier, type, Project Representative, Project ID, and status
4. WHEN a user clicks on a calendar entry, THE Calendar_View SHALL navigate to the booking details
5. WHEN a user clicks on a van in the calendar, THE Calendar_View SHALL navigate to the vehicle profile page
6. WHEN a user applies filters, THE Calendar_View SHALL update to show only matching vehicles and bookings

### Requirement 6: Maintenance and Service Scheduling

**User Story:** As a Fleet Administrator, I want to schedule and track vehicle maintenance, so that I can ensure fleet reliability and prevent booking conflicts during service periods.

#### Acceptance Criteria

1. THE Maintenance_Scheduler SHALL store maintenance records including date, description, cost, vendor, and attachments
2. THE Maintenance_Scheduler SHALL support date-based service schedules
3. THE Maintenance_Scheduler SHALL support usage-based service schedules
4. WHEN a maintenance record is created, THE Maintenance_Scheduler SHALL link it to the specific vehicle
5. WHEN a maintenance schedule is created with a future date, THE Maintenance_Scheduler SHALL automatically mark the vehicle as Unavailable for the scheduled period
6. WHEN a vehicle is marked Unavailable due to maintenance, THE Booking_System SHALL prevent new bookings for that vehicle during the unavailable period
7. WHEN maintenance is completed, THE Fleet Administrator SHALL update the maintenance record with completion date and actual cost
8. WHEN maintenance is completed, THE Maintenance_Scheduler SHALL restore the vehicle status to Available

### Requirement 7: Fines and Incidents Management

**User Story:** As a Fleet Administrator, I want to record and track fines and incidents, so that I can assign responsibility and ensure resolution.

#### Acceptance Criteria

1. THE Incident_Manager SHALL store incident records including date/time, van, incident type, description, amount, and attachments
2. WHEN a Fleet Administrator creates an incident record, THE Incident_Manager SHALL determine the active booking at the incident timestamp
3. WHEN an active booking exists at the incident timestamp, THE Incident_Manager SHALL automatically assign the incident to the driver and Project ID from that booking
4. WHEN no active booking exists at the incident timestamp, THE Incident_Manager SHALL leave the incident unassigned for manual review
5. THE Incident_Manager SHALL support the following incident statuses: Open, Assigned, Paid, Resolved, Disputed
6. WHEN an incident is created, THE Incident_Manager SHALL set the initial status to Open
7. WHEN an incident is automatically assigned, THE Incident_Manager SHALL update the status to Assigned
8. WHEN a Fleet Administrator updates an incident status, THE Incident_Manager SHALL record the change in the Audit_Trail

### Requirement 8: Running Costs Tracking

**User Story:** As a Fleet Administrator, I want to track all vehicle running costs, so that I can analyze fleet expenses and allocate costs to projects.

#### Acceptance Criteria

1. THE Cost_Tracker SHALL store cost records including date, cost type, amount, van, driver, and Project ID
2. THE Cost_Tracker SHALL support the following cost types: fuel, tolls, maintenance, fines
3. WHEN a cost record is created, THE Cost_Tracker SHALL require a valid van reference
4. WHEN a cost record is created, THE Cost_Tracker SHALL require a valid Project ID
5. WHEN a maintenance record is created, THE Cost_Tracker SHALL automatically create a corresponding cost record
6. WHEN an incident with an amount is marked as Paid, THE Cost_Tracker SHALL automatically create a corresponding cost record

### Requirement 9: Event-Driven Notifications

**User Story:** As a system user, I want to receive automated notifications for important events, so that I can stay informed and take timely action.

#### Acceptance Criteria

1. WHEN a booking is created, THE Notification_Engine SHALL send an email notification to the booking creator
2. WHEN a booking is modified, THE Notification_Engine SHALL send an email notification to the booking creator
3. WHEN a booking is cancelled, THE Notification_Engine SHALL send an email notification to the booking creator
4. WHEN a booking start time is 24 hours away, THE Notification_Engine SHALL send a reminder notification to the driver
5. WHEN a booking end time has passed and the status is still Active, THE Notification_Engine SHALL send an overdue notification to the driver and Fleet Administrators
6. WHEN a vehicle is marked as Unavailable, THE Notification_Engine SHALL send a notification to Fleet Administrators
7. WHEN a vehicle is marked as Available after maintenance, THE Notification_Engine SHALL send a notification to Fleet Administrators
8. WHEN a vehicle compliance document expiry date is within 30 days, THE Notification_Engine SHALL send a notification to Fleet Administrators
9. WHEN an incident is logged, THE Notification_Engine SHALL send a notification to Fleet Administrators
10. WHEN an incident is assigned to a driver, THE Notification_Engine SHALL send a notification to the assigned driver
11. WHEN an incident is marked as Resolved, THE Notification_Engine SHALL send a notification to the assigned driver
12. THE Notification_Engine SHALL support both email and Microsoft Teams notifications

### Requirement 10: Utilization and Cost Reporting

**User Story:** As a Finance Manager, I want to generate reports on van utilization and costs, so that I can analyze fleet performance and project expenses.

#### Acceptance Criteria

1. THE Reporting_Module SHALL generate van utilization reports by van, month, and project
2. THE Reporting_Module SHALL generate summary reports showing booked hours versus available hours
3. THE Reporting_Module SHALL generate fine reports by driver, van, and project
4. THE Reporting_Module SHALL generate cost reports by van, project, and cost type
5. WHEN a report is generated, THE Reporting_Module SHALL calculate utilization percentage as (booked hours / available hours) * 100
6. THE Reporting_Module SHALL support export to Excel format
7. WHEN a user exports a report, THE Reporting_Module SHALL include all relevant data fields for external analysis

### Requirement 11: Role-Based Access Control

**User Story:** As a System Administrator, I want to enforce role-based access control, so that users can only perform actions appropriate to their role.

#### Acceptance Criteria

1. THE VBMS SHALL support the following user roles: Project Representative, Fleet Administrator, Finance Manager
2. WHERE a user is a Project Representative, THE VBMS SHALL allow creation of bookings
3. WHERE a user is a Project Representative, THE VBMS SHALL allow modification of their own bookings
4. WHERE a user is a Project Representative, THE VBMS SHALL allow cancellation of their own bookings
5. WHERE a user is a Project Representative, THE VBMS SHALL allow read-only access to calendar and vehicle profiles
6. WHERE a user is a Fleet Administrator, THE VBMS SHALL allow all Project Representative actions
7. WHERE a user is a Fleet Administrator, THE VBMS SHALL allow management of Van Master data
8. WHERE a user is a Fleet Administrator, THE VBMS SHALL allow management of all bookings
9. WHERE a user is a Fleet Administrator, THE VBMS SHALL allow creation and management of maintenance records
10. WHERE a user is a Fleet Administrator, THE VBMS SHALL allow creation and management of incident records
11. WHERE a user is a Finance Manager, THE VBMS SHALL allow read-only access to all reports
12. WHERE a user is a Finance Manager, THE VBMS SHALL allow read-only access to cost data

### Requirement 12: Data Integrity and Audit Trail

**User Story:** As a System Administrator, I want complete audit trails for all system changes, so that I can track accountability and troubleshoot issues.

#### Acceptance Criteria

1. THE VBMS SHALL record all create, update, and delete operations in the Audit_Trail
2. WHEN an audit record is created, THE VBMS SHALL capture the user identity, timestamp, entity type, entity ID, action type, and changed fields
3. THE VBMS SHALL prevent deletion of audit records
4. THE VBMS SHALL prevent modification of audit records
5. WHERE a user is a Fleet Administrator, THE VBMS SHALL provide access to view audit trails

### Requirement 13: SharePoint List Data Storage

**User Story:** As a System Architect, I want data stored in SharePoint Lists, so that the system leverages native Microsoft 365 capabilities for security, backup, and integration.

#### Acceptance Criteria

1. THE VBMS SHALL store Van Master data in a SharePoint List
2. THE VBMS SHALL store Booking data in a SharePoint List
3. THE VBMS SHALL store Incident data in a SharePoint List
4. THE VBMS SHALL store Maintenance data in a SharePoint List
5. THE VBMS SHALL store Cost data in a SharePoint List
6. THE VBMS SHALL use SharePoint List relationships to link related entities
7. THE VBMS SHALL use SharePoint column validation for data integrity
8. THE VBMS SHALL use SharePoint versioning for audit trail support

### Requirement 14: Power Apps User Interface

**User Story:** As a system user, I want an intuitive Power Apps interface, so that I can efficiently perform my tasks without extensive training.

#### Acceptance Criteria

1. THE VBMS SHALL provide a Power Apps canvas app for booking management
2. THE VBMS SHALL provide a Power Apps canvas app for calendar visualization
3. THE VBMS SHALL provide a Power Apps canvas app for vehicle profile viewing
4. WHEN a user accesses the Power Apps interface, THE VBMS SHALL authenticate using Microsoft 365 credentials
5. WHEN a user accesses the Power Apps interface, THE VBMS SHALL display only actions permitted by their role
6. THE VBMS SHALL provide responsive design for mobile and desktop access

### Requirement 15: Power Automate Workflow Automation

**User Story:** As a System Architect, I want automated workflows using Power Automate, so that the system handles routine tasks without manual intervention.

#### Acceptance Criteria

1. THE VBMS SHALL use Power Automate flows for booking status transitions
2. THE VBMS SHALL use Power Automate flows for notification delivery
3. THE VBMS SHALL use Power Automate flows for automatic incident assignment
4. THE VBMS SHALL use Power Automate flows for maintenance-based vehicle status updates
5. THE VBMS SHALL use Power Automate flows for compliance document expiry monitoring
6. WHEN a Power Automate flow fails, THE VBMS SHALL log the error for administrator review
