# Implementation Plan: Van Booking & Fleet Management System

## Overview

This implementation plan breaks down the VBMS into discrete configuration and development tasks. The system is built primarily using Power Platform configuration (SharePoint Lists, Power Apps, Power Automate) with minimal custom code. Tasks are organized to deliver incremental value, starting with core data structures, then booking management, followed by advanced features like maintenance scheduling and incident management.

## Tasks

- [x] 1. Set up SharePoint site and core data structures
  - Create new SharePoint site for VBMS
  - Configure site permissions for Project Representatives, Fleet Administrators, and Finance Managers
  - Create Vans list with all required columns (Van_ID, Registration, Make, Model, Year, VIN, Tier, Type, Daily_Rate, Mileage_Rate, Status, Configuration, Accessories)
  - Configure unique constraints on Van_ID and Registration columns
  - Enable versioning on Vans list for audit trail
  - Create Documents library with Van_ID lookup column and Document_Type, Expiry_Date columns
  - Create Bookings list with all required columns (Booking_ID, Project_ID, Van_ID lookup, Driver_Name, Driver_Contact, Start_DateTime, End_DateTime, Status)
  - Configure Project_ID column validation (5 digits regex)
  - Enable versioning on Bookings list
  - Create Maintenance list with all required columns (Maintenance_ID, Van_ID lookup, Scheduled_Date, Completed_Date, Description, Cost, Vendor, Maintenance_Type)
  - Create Incidents list with all required columns (Incident_ID, Van_ID lookup, Incident_DateTime, Incident_Type, Description, Amount, Assigned_Driver, Assigned_Project_ID, Status)
  - Create Costs list with all required columns (Cost_ID, Van_ID lookup, Project_ID, Driver, Cost_Type, Amount, Date, Description, Source_ID)
  - Create Audit_Trail list with all required columns (Audit_ID, Entity_Type, Entity_ID, Action, User, Timestamp, Changed_Fields, Old_Values, New_Values)
  - Configure Audit_Trail list permissions to prevent deletion and modification
  - Create Error_Log list for system error tracking
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

- [ ]* 1.1 Write property test for unique identifier enforcement
  - **Property 1: Unique Identifier Enforcement**
  - **Validates: Requirements 1.5, 1.6, 3.6**
  - Generate random Van records with duplicate Van_IDs and Registration numbers
  - Verify SharePoint rejects duplicates
  - Generate random Booking records with duplicate Booking_IDs
  - Verify system enforces uniqueness across all entity types

- [x] 2. Implement booking conflict detection
  - Create Power Automate flow "Check Booking Conflict"
  - Configure flow trigger: When Booking item is created or modified
  - Add action to get all bookings for the same Van_ID with status in [Requested, Confirmed, Active]
  - Add condition to check for time range overlap: (new start < existing end) AND (new end > existing start)
  - If conflict found, add action to delete the new booking and send error response
  - If no conflict, allow booking to proceed
  - Configure flow to run synchronously to prevent race conditions
  - _Requirements: 3.4, 3.5, 3.9_

- [ ]* 2.1 Write property test for booking conflict detection
  - **Property 5: Booking Conflict Detection**
  - **Validates: Requirements 3.4, 3.5, 3.9**
  - Generate 100 random booking scenarios with various time overlaps
  - For each scenario, verify system correctly identifies conflicts
  - Test edge cases: same start time, same end time, fully contained bookings, adjacent bookings

- [ ]* 2.2 Write unit tests for booking validation
  - Test booking with valid data succeeds
  - Test booking with invalid Project_ID (not 5 digits) fails
  - Test booking with end before start fails
  - Test booking with missing required fields fails
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Create booking management Power App
  - Create new Power Apps canvas app "VBMS Booking Manager"
  - Add connection to SharePoint Vans and Bookings lists
  - Create "Create Booking" screen with form controls for all required fields
  - Add dropdown for Van selection (filtered by availability)
  - Add date/time pickers for Start_DateTime and End_DateTime
  - Add text input for Project_ID with validation (5 digits)
  - Add text inputs for Driver_Name and Driver_Contact
  - Add submit button that creates Booking item in SharePoint
  - Configure form to display conflict errors from Power Automate flow
  - Create "My Bookings" screen with gallery showing current user's bookings
  - Add filter to show only bookings where Created_By = current user
  - Add edit and cancel buttons for each booking
  - Create "Booking Details" screen showing full booking information
  - Add navigation from gallery items to details screen
  - Configure role-based visibility: Project Representatives see only their bookings, Fleet Admins see all
  - _Requirements: 3.1, 3.2, 3.3, 14.1, 14.2, 14.4, 14.5, 14.6_

- [ ]* 3.1 Write property tests for booking creation and management
  - **Property 2: Required Field Validation**
  - **Validates: Requirements 3.1**
  - **Property 3: Project ID Format Validation**
  - **Validates: Requirements 3.2**
  - **Property 4: Date Range Validation**
  - **Validates: Requirements 3.3**
  - **Property 6: Correct Initial Booking Status**
  - **Validates: Requirements 3.7**
  - Generate random booking data with various invalid combinations
  - Verify all validation rules are enforced

- [x] 4. Implement booking lifecycle management
  - Create Power Automate flow "Booking Status Transitions"
  - Configure flow trigger: Recurrence (every 15 minutes)
  - Add action to get all Confirmed bookings where Start_DateTime <= Now
  - For each booking, update Status to Active
  - Add action to get all Active bookings where End_DateTime < Now
  - For each booking, update Status to Completed
  - Add error handling and logging to Error_Log list
  - _Requirements: 4.2, 4.3_

- [ ]* 4.1 Write property test for time-based status transitions
  - **Property 8: Time-Based Booking Status Transitions**
  - **Validates: Requirements 4.2, 4.3**
  - Generate random bookings with various start and end times
  - Simulate time progression and verify status transitions occur correctly

- [ ]* 4.2 Write unit tests for booking cancellation
  - **Property 7: Booking Cancellation Status Transition**
  - **Validates: Requirements 3.11**
  - Test cancelling a Requested booking updates status to Cancelled
  - Test cancelling a Confirmed booking updates status to Cancelled
  - Test Cancelled status is terminal (no further transitions)

- [x] 5. Checkpoint - Verify core booking functionality
  - Test creating bookings through Power App
  - Verify conflict detection prevents double-bookings
  - Verify booking status transitions work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Create calendar visualization Power App
  - Create new Power Apps canvas app "VBMS Calendar View"
  - Add connection to SharePoint Vans and Bookings lists
  - Create calendar control using gallery with custom layout
  - Implement daily, weekly, and monthly view modes with toggle buttons
  - For each van and date, calculate status: Available, Booked, Active, Unavailable, Inactive
  - Apply color coding: Available (green), Booked (blue), Active (orange), Unavailable (red), Inactive (grey)
  - Add filter panel with dropdowns for Tier, Type, Representative, Project_ID, Status
  - Implement filter logic to show only matching vehicles and bookings
  - Add click handlers to navigate to booking details or vehicle profile
  - Configure responsive design for mobile and desktop
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 14.1, 14.6_

- [ ]* 6.1 Write property tests for calendar functionality
  - **Property 9: Calendar Color Mapping**
  - **Validates: Requirements 5.2**
  - **Property 10: Calendar Filter Correctness**
  - **Validates: Requirements 5.6**
  - Generate random vehicle and booking data
  - Verify color mapping is correct for all status values
  - Verify filters return only matching items

- [ ] 7. Create vehicle profile Power App
  - Create new Power Apps canvas app "VBMS Vehicle Profiles" or add screens to existing app
  - Create "Vehicle Profile" screen with tabs for Details, Documents, Bookings, Maintenance, Incidents
  - Details tab: Display all van information from Vans list
  - Documents tab: Gallery showing all documents from Documents library with expiry dates
  - Add upload functionality for new documents
  - Highlight documents expiring within 30 days in red
  - Bookings tab: Gallery showing all bookings for this van (past and future)
  - Maintenance tab: Gallery showing all maintenance records for this van
  - Incidents tab: Gallery showing all incidents for this van
  - Add navigation from calendar and booking screens to vehicle profile
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 8. Implement maintenance scheduling
  - Create Power Automate flow "Maintenance Vehicle Status Update"
  - Configure flow trigger: When Maintenance item is created
  - Add condition: If Scheduled_Date is in the future
  - Add action to update Van status to Unavailable
  - Create Power Automate flow "Maintenance Completion Status Restore"
  - Configure flow trigger: When Maintenance item is modified
  - Add condition: If Completed_Date is populated
  - Add action to update Van status to Available
  - Add Fleet Management screens to Power App for creating/editing maintenance records
  - Create form for scheduling maintenance with all required fields
  - Add calendar view showing scheduled maintenance
  - _Requirements: 6.4, 6.5, 6.6, 6.8_

- [ ]* 8.1 Write property tests for maintenance scheduling
  - **Property 11: Maintenance-Vehicle Relationship Integrity**
  - **Validates: Requirements 6.4**
  - **Property 12: Maintenance Scheduling Status Update**
  - **Validates: Requirements 6.5**
  - **Property 13: Unavailable Vehicle Booking Prevention**
  - **Validates: Requirements 6.6**
  - **Property 14: Maintenance Completion Status Restoration**
  - **Validates: Requirements 6.8**
  - Generate random maintenance records and verify vehicle status updates
  - Verify unavailable vehicles cannot be booked

- [ ] 9. Implement incident management and auto-assignment
  - Create Power Automate flow "Incident Auto-Assignment"
  - Configure flow trigger: When Incident item is created
  - Add action to get all Active bookings for the Van_ID where Start_DateTime <= Incident_DateTime <= End_DateTime
  - Add condition: If booking found
  - If yes: Update incident with Assigned_Driver, Assigned_Project_ID from booking, set Status to Assigned
  - If no: Leave incident unassigned, set Status to Open
  - Add Fleet Management screens to Power App for logging incidents
  - Create form for incident entry with all required fields
  - Add gallery showing all incidents with filtering by status, driver, van, project
  - Add functionality to manually update incident status
  - _Requirements: 7.2, 7.3, 7.4, 7.6, 7.7_

- [ ]* 9.1 Write property tests for incident management
  - **Property 15: Incident Booking Lookup**
  - **Validates: Requirements 7.2**
  - **Property 16: Incident Auto-Assignment**
  - **Validates: Requirements 7.3**
  - **Property 17: Incident Unassigned State**
  - **Validates: Requirements 7.4**
  - **Property 18: Correct Initial Incident Status**
  - **Validates: Requirements 7.6**
  - **Property 19: Incident Assignment Status Transition**
  - **Validates: Requirements 7.7**
  - Generate random incidents with and without matching bookings
  - Verify auto-assignment logic works correctly

- [ ] 10. Implement cost tracking and auto-creation
  - Create Power Automate flow "Maintenance Cost Auto-Creation"
  - Configure flow trigger: When Maintenance item is created
  - Add condition: If Cost field is populated
  - Add action to create Cost record with Cost_Type=Maintenance, linking to Maintenance_ID
  - Create Power Automate flow "Incident Cost Auto-Creation"
  - Configure flow trigger: When Incident item is modified
  - Add condition: If Status changed to Paid and Amount is populated
  - Add action to create Cost record with Cost_Type=Fine, linking to Incident_ID
  - Add Fleet Management screens to Power App for manual cost entry
  - Create form for recording fuel, tolls, and other costs
  - Add gallery showing all costs with filtering by van, project, driver, cost type
  - _Requirements: 8.3, 8.4, 8.5, 8.6_

- [ ]* 10.1 Write property tests for cost tracking
  - **Property 20: Cost Record Van Reference Validation**
  - **Validates: Requirements 8.3**
  - **Property 21: Cost Record Project ID Validation**
  - **Validates: Requirements 8.4**
  - **Property 22: Automatic Cost Record Creation**
  - **Validates: Requirements 8.5, 8.6**
  - Generate random cost records with invalid references
  - Verify validation rules are enforced
  - Verify automatic cost creation from maintenance and incidents

- [ ] 11. Checkpoint - Verify advanced features
  - Test maintenance scheduling and vehicle status updates
  - Test incident auto-assignment logic
  - Test cost auto-creation from maintenance and incidents
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement notification system
  - Create Power Automate flow "Booking Created Notification"
  - Configure flow trigger: When Booking item is created
  - Add action to send email to Created_By user with booking details
  - Create Power Automate flow "Booking Modified Notification"
  - Configure flow trigger: When Booking item is modified
  - Add action to send email to Created_By user with updated details
  - Create Power Automate flow "Booking Cancelled Notification"
  - Configure flow trigger: When Booking Status changes to Cancelled
  - Add action to send email to Created_By user
  - Create Power Automate flow "Booking Reminder Notification"
  - Configure flow trigger: Recurrence (daily)
  - Add action to get all Confirmed bookings where Start_DateTime is 24 hours away
  - For each booking, send email to driver
  - Create Power Automate flow "Booking Overdue Notification"
  - Configure flow trigger: Recurrence (hourly)
  - Add action to get all Active bookings where End_DateTime < Now
  - For each booking, send email to driver and Fleet Admins
  - Create Power Automate flow "Vehicle Unavailable Notification"
  - Configure flow trigger: When Van Status changes to Unavailable
  - Add action to send email to Fleet Admins
  - Create Power Automate flow "Vehicle Available Notification"
  - Configure flow trigger: When Van Status changes to Available (from Unavailable)
  - Add action to send email to Fleet Admins
  - Create Power Automate flow "Compliance Expiring Notification"
  - Configure flow trigger: Recurrence (daily)
  - Add action to get all Documents where Expiry_Date is within 30 days
  - For each document, send email to Fleet Admins
  - Create Power Automate flow "Incident Logged Notification"
  - Configure flow trigger: When Incident item is created
  - Add action to send email to Fleet Admins
  - Create Power Automate flow "Incident Assigned Notification"
  - Configure flow trigger: When Incident Status changes to Assigned
  - Add action to send email to Assigned_Driver
  - Create Power Automate flow "Incident Resolved Notification"
  - Configure flow trigger: When Incident Status changes to Resolved
  - Add action to send email to Assigned_Driver
  - Add error handling to all notification flows (retry 3 times, log failures)
  - Configure Teams notifications as alternative to email (optional)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.12_

- [ ] 13. Implement audit trail system
  - Create Power Automate flow "Audit Trail - Vans"
  - Configure flow trigger: When Van item is created, modified, or deleted
  - Add action to create Audit_Trail record with all required fields
  - Capture before and after values in JSON format
  - Create Power Automate flow "Audit Trail - Bookings"
  - Configure flow trigger: When Booking item is created, modified, or deleted
  - Add action to create Audit_Trail record
  - Create Power Automate flow "Audit Trail - Maintenance"
  - Configure flow trigger: When Maintenance item is created, modified, or deleted
  - Add action to create Audit_Trail record
  - Create Power Automate flow "Audit Trail - Incidents"
  - Configure flow trigger: When Incident item is created, modified, or deleted
  - Add action to create Audit_Trail record
  - Create Power Automate flow "Audit Trail - Costs"
  - Configure flow trigger: When Cost item is created, modified, or deleted
  - Add action to create Audit_Trail record
  - Add Fleet Admin screen to Power App for viewing audit trails
  - Create gallery with filtering by entity type, entity ID, user, date range
  - _Requirements: 1.7, 3.8, 3.10, 3.12, 4.4, 7.8, 12.1, 12.2, 12.5_

- [ ]* 13.1 Write property tests for audit trail
  - **Property 24: Comprehensive Audit Trail Creation**
  - **Validates: Requirements 12.1**
  - **Property 25: Audit Record Completeness**
  - **Validates: Requirements 12.2**
  - **Property 26: Audit Record Immutability**
  - **Validates: Requirements 12.3, 12.4**
  - Generate random CRUD operations on all entity types
  - Verify audit records are created for all operations
  - Verify audit records contain all required fields
  - Verify audit records cannot be modified or deleted

- [ ] 14. Create reporting Power App
  - Create new Power Apps canvas app "VBMS Reports"
  - Add connection to SharePoint lists
  - Create "Report Selection" screen with buttons for different report types
  - Create "Utilization Report" screen
  - Add filters for date range, grouping (van/month/project)
  - Calculate Total_Available_Hours, Total_Booked_Hours, Utilization_Percentage
  - Display results in data table with sorting
  - Add export to Excel button
  - Create "Fine Report" screen
  - Add filters for date range, grouping (driver/van/project)
  - Aggregate fines by selected grouping
  - Display results in data table
  - Add export to Excel button
  - Create "Cost Report" screen
  - Add filters for date range, grouping (van/project/cost_type)
  - Aggregate costs by selected grouping
  - Display results in data table
  - Add export to Excel button
  - Configure role-based access: Finance Managers have read-only access
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ]* 14.1 Write property test for utilization calculation
  - **Property 23: Utilization Calculation Correctness**
  - **Validates: Requirements 10.5**
  - Generate random booking data with known hours
  - Verify utilization percentage calculation is correct
  - Test edge cases: 0% utilization, 100% utilization, partial hours

- [ ]* 14.2 Write unit tests for reporting
  - Test utilization report with known data produces correct results
  - Test fine report aggregates correctly by driver, van, project
  - Test cost report aggregates correctly by van, project, cost type
  - Test date range filtering works correctly
  - Test Excel export includes all required fields

- [ ] 15. Configure role-based security
  - Configure SharePoint site permissions
  - Create "Project Representatives" group with contribute access to Bookings list (own items only)
  - Create "Fleet Administrators" group with full control on all lists
  - Create "Finance Managers" group with read-only access to all lists
  - Configure Power Apps to check user roles and show/hide features accordingly
  - Add role checks in Power Automate flows where needed
  - Test each role can only perform allowed actions
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11, 11.12, 14.5_

- [ ] 16. Implement error handling and logging
  - Add try-catch scopes to all Power Automate flows
  - Configure flows to log errors to Error_Log list
  - Add retry logic (3 attempts) to critical flows
  - Configure notification flows to fail gracefully without blocking operations
  - Add error display in Power Apps with user-friendly messages
  - Create Fleet Admin screen for viewing Error_Log
  - Add filtering and resolution tracking
  - Test error scenarios and verify proper logging
  - _Requirements: Error Handling section_

- [ ] 17. Performance optimization and testing
  - Add indexes to frequently queried columns (Van_ID, Project_ID, Start_DateTime, End_DateTime, Incident_DateTime)
  - Optimize Power Apps formulas for calendar view
  - Test with 1000+ bookings to ensure performance targets are met
  - Configure Power Automate flow concurrency settings
  - Test concurrent booking creation scenarios
  - Verify conflict detection works under load
  - _Requirements: Performance Testing section_

- [ ] 18. Final checkpoint and user acceptance testing
  - Populate test environment with realistic data (10 vans, 100 bookings, 20 maintenance records, 30 incidents)
  - Conduct user acceptance testing with Project Representatives
  - Verify booking creation takes < 2 minutes
  - Verify calendar loads in < 5 seconds
  - Conduct user acceptance testing with Fleet Administrators
  - Verify maintenance scheduling takes < 3 minutes
  - Verify incident logging and auto-assignment works correctly
  - Conduct user acceptance testing with Finance Managers
  - Verify reports generate in < 15 seconds
  - Verify Excel exports work correctly
  - Verify zero double-bookings in all test scenarios
  - Verify 100% audit trail coverage
  - Verify all notifications are delivered within 5 minutes
  - Document any issues and resolve before production deployment
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Deployment and training
  - Create production SharePoint site
  - Deploy all SharePoint lists and libraries
  - Deploy all Power Apps
  - Deploy all Power Automate flows
  - Configure production permissions and security groups
  - Migrate initial van data from Excel
  - Create user documentation for Project Representatives
  - Create user documentation for Fleet Administrators
  - Create user documentation for Finance Managers
  - Conduct training sessions for all user groups
  - Provide support during initial rollout period

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- This is primarily a configuration-based implementation using Power Platform
- Custom code is minimal (mainly Power Fx formulas in Power Apps)
- Property-based testing can be implemented using PnP PowerShell scripts with randomized test data
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation follows an incremental approach: core booking → calendar → maintenance → incidents → costs → reporting
- Role-based security is configured using SharePoint groups and Power Apps role checks
- Audit trail and error logging provide complete operational visibility
