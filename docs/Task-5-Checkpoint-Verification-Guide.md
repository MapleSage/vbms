# Task 5: Checkpoint Verification Guide - Core Booking Functionality

## Overview

This checkpoint verifies that the core booking functionality (Tasks 1-4) is working correctly before proceeding to advanced features. This is a critical validation point to ensure the foundation of the Van Booking & Fleet Management System is solid.

**Task**: 5. Checkpoint - Verify core booking functionality  
**Status**: In Progress  
**Prerequisites**: Tasks 1-4 must be implemented  
**Estimated Time**: 1-2 hours

## Purpose

This checkpoint ensures:
- ✅ SharePoint data structures are correctly configured
- ✅ Booking conflict detection prevents double-bookings
- ✅ Booking status transitions work automatically
- ✅ Power App provides intuitive booking management
- ✅ All components integrate correctly
- ✅ Core requirements are satisfied

## Prerequisites Checklist

Before starting verification, ensure the following are complete:

### Task 1: SharePoint Site and Data Structures
- [ ] SharePoint site created at: `https://[tenant].sharepoint.com/sites/vbms`
- [ ] All 8 lists/libraries created (Vans, Bookings, Maintenance, Incidents, Costs, Audit_Trail, Error_Log, Van Documents)
- [ ] All columns configured with correct types and validation
- [ ] Versioning enabled on Vans and Bookings lists
- [ ] Permissions configured for user groups
- [ ] Validation script run successfully

### Task 2: Booking Conflict Detection
- [ ] Power Automate flow "Check Booking Conflict" created
- [ ] Flow triggers on booking create/modify
- [ ] Flow runs synchronously (concurrency = 1)
- [ ] Flow checks for time range overlaps
- [ ] Flow deletes conflicting bookings
- [ ] Flow creates audit records
- [ ] Flow logs errors to Error_Log

### Task 3: Booking Management Power App
- [ ] Power App "VBMS Booking Manager" created
- [ ] Three screens implemented (Home, Create/Edit, Details)
- [ ] Data connections configured (Vans, Bookings, Office365Users)
- [ ] Van availability filtering works
- [ ] Date/time validation works
- [ ] Project ID validation works (5 digits)
- [ ] Role-based access control implemented
- [ ] App published and shared with users

### Task 4: Booking Lifecycle Management
- [ ] Power Automate flow "Booking Status Transitions" created
- [ ] Flow runs every 15 minutes on schedule
- [ ] Flow transitions Confirmed → Active at start time
- [ ] Flow transitions Active → Completed at end time
- [ ] Flow creates audit records for transitions
- [ ] Flow logs errors to Error_Log

## Verification Test Scenarios

### Test Group 1: Basic Booking Creation

#### Test 1.1: Create Valid Booking
**Objective**: Verify that a valid booking can be created successfully

**Steps**:
1. Open VBMS Booking Manager Power App
2. Click "New Booking" button
3. Select an available van from dropdown
4. Enter Project ID: `12345`
5. Enter Driver Name: `Test User`
6. Enter Driver Contact: `test@example.com`
7. Select Start Date: Tomorrow
8. Select Start Time: `09:00 AM`
9. Select End Date: Tomorrow
10. Select End Time: `05:00 PM`
11. Click "Create Booking"

**Expected Results**:
- ✅ Booking created successfully
- ✅ Success notification displayed
- ✅ Booking appears in "My Bookings" list
- ✅ Booking status is "Requested"
- ✅ All entered information is correct
- ✅ Audit record created in Audit_Trail list

**Validation Queries**:
```powershell
# Check booking exists
Get-PnPListItem -List "Bookings" -Query "<View><Query><Where><Eq><FieldRef Name='Project_ID'/><Value Type='Text'>12345</Value></Eq></Where></Query></View>"

# Check audit record
Get-PnPListItem -List "Audit_Trail" -Query "<View><Query><Where><And><Eq><FieldRef Name='Entity_Type'/><Value Type='Choice'>Booking</Value></Eq><Eq><FieldRef Name='Action'/><Value Type='Choice'>Create</Value></Eq></And></Where></Query></View>"
```

**Pass Criteria**: Booking created, visible in app, audit record exists

---

#### Test 1.2: Invalid Project ID Validation
**Objective**: Verify that Project ID validation prevents invalid entries

**Test Cases**:

**Case A: Too Few Digits**
1. Open Create Booking screen
2. Enter Project ID: `123` (3 digits)
3. Observe validation message

**Expected**: 
- ✅ Error message: "⚠ Project ID must be exactly 5 digits"
- ✅ Submit button disabled

**Case B: Too Many Digits**
1. Enter Project ID: `123456` (6 digits)
2. Observe validation message

**Expected**:
- ✅ Error message: "⚠ Project ID must be exactly 5 digits"
- ✅ Submit button disabled

**Case C: Non-Numeric**
1. Enter Project ID: `ABCDE` (letters)
2. Observe validation message

**Expected**:
- ✅ Error message: "⚠ Project ID must be exactly 5 digits"
- ✅ Submit button disabled

**Case D: Valid**
1. Enter Project ID: `12345` (5 digits)
2. Observe validation

**Expected**:
- ✅ No error message
- ✅ Submit button enabled (if other fields valid)

**Pass Criteria**: All validation cases work correctly

---

#### Test 1.3: Date Range Validation
**Objective**: Verify that end date/time must be after start date/time

**Test Cases**:

**Case A: End Before Start**
1. Open Create Booking screen
2. Select Start Date: Tomorrow
3. Select Start Time: `05:00 PM`
4. Select End Date: Tomorrow
5. Select End Time: `09:00 AM`
6. Observe validation

**Expected**:
- ✅ Error message: "⚠ End date/time must be after start date/time"
- ✅ Submit button disabled

**Case B: Same Date and Time**
1. Select Start Date: Tomorrow
2. Select Start Time: `09:00 AM`
3. Select End Date: Tomorrow
4. Select End Time: `09:00 AM`
5. Observe validation

**Expected**:
- ✅ Error message displayed
- ✅ Submit button disabled

**Case C: Valid Range**
1. Select Start Date: Tomorrow
2. Select Start Time: `09:00 AM`
3. Select End Date: Tomorrow
4. Select End Time: `05:00 PM`
5. Observe validation

**Expected**:
- ✅ No error message
- ✅ Submit button enabled (if other fields valid)

**Pass Criteria**: Date/time validation works correctly

---

### Test Group 2: Conflict Detection

#### Test 2.1: Overlapping Booking Conflict
**Objective**: Verify that overlapping bookings are prevented

**Setup**:
1. Create Booking A:
   - Van: Van 1
   - Start: Tomorrow 10:00 AM
   - End: Tomorrow 2:00 PM
   - Status: Confirmed

**Test**:
1. Attempt to create Booking B:
   - Van: Van 1 (same van)
   - Start: Tomorrow 12:00 PM (overlaps)
   - End: Tomorrow 4:00 PM
2. Click "Create Booking"

**Expected Results**:
- ✅ Booking B is rejected
- ✅ Booking B does not appear in bookings list
- ✅ Error logged to Error_Log list with conflict details
- ✅ Audit record shows booking was deleted
- ✅ User can see Booking A still exists

**Validation**:
```powershell
# Check only Booking A exists
Get-PnPListItem -List "Bookings" -Query "<View><Query><Where><Eq><FieldRef Name='Van_ID'/><Value Type='Lookup'>1</Value></Eq></Where></Query></View>"

# Check error log
Get-PnPListItem -List "Error_Log" -Query "<View><Query><Where><Eq><FieldRef Name='Error_Type'/><Value Type='Choice'>Conflict</Value></Eq></Where><OrderBy><FieldRef Name='Created' Ascending='FALSE'/></OrderBy></Query><RowLimit>1</RowLimit></View>"
```

**Pass Criteria**: Conflict detected, second booking rejected, error logged

---

#### Test 2.2: Fully Contained Booking Conflict
**Objective**: Verify that a booking fully inside another is detected

**Setup**:
1. Create Booking A:
   - Van: Van 2
   - Start: Tomorrow 9:00 AM
   - End: Tomorrow 5:00 PM

**Test**:
1. Attempt to create Booking B:
   - Van: Van 2 (same van)
   - Start: Tomorrow 11:00 AM (inside)
   - End: Tomorrow 1:00 PM (inside)

**Expected Results**:
- ✅ Booking B is rejected
- ✅ Conflict detected by flow
- ✅ Error logged with conflict details

**Pass Criteria**: Fully contained conflict detected

---

#### Test 2.3: Fully Containing Booking Conflict
**Objective**: Verify that a booking fully containing another is detected

**Setup**:
1. Create Booking A:
   - Van: Van 3
   - Start: Tomorrow 11:00 AM
   - End: Tomorrow 1:00 PM

**Test**:
1. Attempt to create Booking B:
   - Van: Van 3 (same van)
   - Start: Tomorrow 9:00 AM (before)
   - End: Tomorrow 5:00 PM (after)

**Expected Results**:
- ✅ Booking B is rejected
- ✅ Conflict detected by flow
- ✅ Error logged with conflict details

**Pass Criteria**: Fully containing conflict detected

---

#### Test 2.4: Adjacent Bookings (No Conflict)
**Objective**: Verify that adjacent bookings (end = start) are allowed

**Setup**:
1. Create Booking A:
   - Van: Van 4
   - Start: Tomorrow 9:00 AM
   - End: Tomorrow 12:00 PM

**Test**:
1. Create Booking B:
   - Van: Van 4 (same van)
   - Start: Tomorrow 12:00 PM (exactly when A ends)
   - End: Tomorrow 3:00 PM

**Expected Results**:
- ✅ Booking B is created successfully
- ✅ No conflict detected
- ✅ Both bookings exist in list

**Pass Criteria**: Adjacent bookings allowed

---

#### Test 2.5: Different Vans (No Conflict)
**Objective**: Verify that same time on different vans is allowed

**Test**:
1. Create Booking A:
   - Van: Van 5
   - Start: Tomorrow 10:00 AM
   - End: Tomorrow 2:00 PM

2. Create Booking B:
   - Van: Van 6 (different van)
   - Start: Tomorrow 10:00 AM (same time)
   - End: Tomorrow 2:00 PM (same time)

**Expected Results**:
- ✅ Both bookings created successfully
- ✅ No conflict detected
- ✅ Both bookings exist in list

**Pass Criteria**: Different vans allowed at same time

---

#### Test 2.6: Cancelled Booking (No Conflict)
**Objective**: Verify that cancelled bookings don't block new bookings

**Setup**:
1. Create Booking A:
   - Van: Van 7
   - Start: Tomorrow 10:00 AM
   - End: Tomorrow 2:00 PM
2. Cancel Booking A (Status = Cancelled)

**Test**:
1. Create Booking B:
   - Van: Van 7 (same van)
   - Start: Tomorrow 10:00 AM (same time)
   - End: Tomorrow 2:00 PM (same time)

**Expected Results**:
- ✅ Booking B created successfully
- ✅ No conflict detected (Cancelled status ignored)
- ✅ Both bookings exist in list

**Pass Criteria**: Cancelled bookings don't cause conflicts

---

### Test Group 3: Booking Status Transitions

#### Test 3.1: Confirmed to Active Transition
**Objective**: Verify automatic status transition when start time arrives

**Setup**:
1. Create a booking with:
   - Status: Confirmed
   - Start: Current time + 5 minutes
   - End: Current time + 2 hours

**Test**:
1. Wait for start time to pass (or manually adjust start time to past)
2. Wait for scheduled flow to run (up to 15 minutes)
3. Refresh bookings list

**Expected Results**:
- ✅ Booking status changed from "Confirmed" to "Active"
- ✅ Audit record created with:
  - Action: Status_Change
  - Old_Values: "Confirmed"
  - New_Values: "Active"
  - User: System
- ✅ Change visible in Power App

**Validation**:
```powershell
# Check booking status
$booking = Get-PnPListItem -List "Bookings" -Id [BookingID]
$booking["Status"]  # Should be "Active"

# Check audit record
Get-PnPListItem -List "Audit_Trail" -Query "<View><Query><Where><And><Eq><FieldRef Name='Entity_ID'/><Value Type='Text'>[BookingID]</Value></Eq><Eq><FieldRef Name='Action'/><Value Type='Choice'>Status_Change</Value></Eq></And></Where></Query></View>"
```

**Pass Criteria**: Status transitions automatically, audit record created

---

#### Test 3.2: Active to Completed Transition
**Objective**: Verify automatic status transition when end time passes

**Setup**:
1. Create a booking with:
   - Status: Active
   - Start: Current time - 2 hours
   - End: Current time - 5 minutes

**Test**:
1. Wait for scheduled flow to run (up to 15 minutes)
2. Refresh bookings list

**Expected Results**:
- ✅ Booking status changed from "Active" to "Completed"
- ✅ Audit record created with:
  - Action: Status_Change
  - Old_Values: "Active"
  - New_Values: "Completed"
  - User: System
- ✅ Change visible in Power App

**Pass Criteria**: Status transitions automatically, audit record created

---

#### Test 3.3: Multiple Transitions in One Run
**Objective**: Verify flow handles multiple bookings correctly

**Setup**:
1. Create 5 bookings with Status: Confirmed, Start: Past
2. Create 5 bookings with Status: Active, End: Past

**Test**:
1. Wait for scheduled flow to run
2. Check all bookings

**Expected Results**:
- ✅ All 5 Confirmed bookings → Active
- ✅ All 5 Active bookings → Completed
- ✅ 10 audit records created
- ✅ Flow execution log shows 10 transitions

**Pass Criteria**: All transitions occur correctly

---

### Test Group 4: Power App Functionality

#### Test 4.1: Role-Based Access (Project Representative)
**Objective**: Verify Project Reps see only their own bookings

**Setup**:
1. Create bookings as User A (Project Rep)
2. Create bookings as User B (Project Rep)

**Test**:
1. Log in as User A
2. Open VBMS Booking Manager
3. View bookings list

**Expected Results**:
- ✅ User A sees only their own bookings
- ✅ User A does not see User B's bookings
- ✅ User A can edit their own bookings
- ✅ User A can cancel their own bookings

**Pass Criteria**: Role-based filtering works correctly

---

#### Test 4.2: Role-Based Access (Fleet Administrator)
**Objective**: Verify Fleet Admins see all bookings

**Setup**:
1. Create bookings as multiple users

**Test**:
1. Log in as Fleet Admin
2. Open VBMS Booking Manager
3. View bookings list

**Expected Results**:
- ✅ Fleet Admin sees all bookings from all users
- ✅ Fleet Admin can edit any booking
- ✅ Fleet Admin can cancel any booking
- ✅ User info shows "(Fleet Admin)" label

**Pass Criteria**: Admin access works correctly

---

#### Test 4.3: Edit Booking
**Objective**: Verify booking can be edited successfully

**Setup**:
1. Create a booking with Status: Requested

**Test**:
1. Open booking details
2. Click "Edit" button
3. Change Project ID to `54321`
4. Change End Time to `06:00 PM`
5. Click "Save Changes"

**Expected Results**:
- ✅ Booking updated successfully
- ✅ Changes visible in booking details
- ✅ Audit record created with old and new values
- ✅ Success notification displayed

**Pass Criteria**: Edit functionality works correctly

---

#### Test 4.4: Cancel Booking
**Objective**: Verify booking can be cancelled

**Setup**:
1. Create a booking with Status: Requested

**Test**:
1. Open booking details
2. Click "Cancel Booking" button
3. Confirm cancellation in dialog

**Expected Results**:
- ✅ Booking status changed to "Cancelled"
- ✅ Status badge shows gray color
- ✅ Edit and Cancel buttons no longer visible
- ✅ Audit record created
- ✅ Success notification displayed

**Pass Criteria**: Cancel functionality works correctly

---

#### Test 4.5: Status Filter
**Objective**: Verify status filter works correctly

**Setup**:
1. Create bookings with various statuses

**Test**:
1. Open VBMS Booking Manager
2. Select "Requested" from status filter
3. Observe filtered results
4. Select "Active" from status filter
5. Observe filtered results
6. Select "All" from status filter
7. Observe all results

**Expected Results**:
- ✅ Filter shows only matching bookings
- ✅ Filter updates immediately
- ✅ "All" shows all bookings

**Pass Criteria**: Filter works correctly

---

#### Test 4.6: Van Availability Filter
**Objective**: Verify only available vans shown in dropdown

**Setup**:
1. Set Van 1 Status: Available
2. Set Van 2 Status: Unavailable
3. Set Van 3 Status: Inactive

**Test**:
1. Open Create Booking screen
2. Click Van dropdown

**Expected Results**:
- ✅ Van 1 appears in dropdown
- ✅ Van 2 does not appear
- ✅ Van 3 does not appear

**Pass Criteria**: Only available vans shown

---

### Test Group 5: Integration Testing

#### Test 5.1: End-to-End Booking Lifecycle
**Objective**: Verify complete booking lifecycle

**Test**:
1. Create booking (Status: Requested)
2. Manually change status to Confirmed
3. Wait for start time to pass
4. Verify status changes to Active
5. Wait for end time to pass
6. Verify status changes to Completed

**Expected Results**:
- ✅ All status transitions occur correctly
- ✅ Audit records created for each transition
- ✅ Booking visible in Power App at each stage
- ✅ Status colors update correctly

**Pass Criteria**: Complete lifecycle works

---

#### Test 5.2: Conflict Detection with Edit
**Objective**: Verify conflict detection works when editing

**Setup**:
1. Create Booking A: Van 1, Tomorrow 10:00 AM - 2:00 PM
2. Create Booking B: Van 1, Tomorrow 3:00 PM - 5:00 PM

**Test**:
1. Edit Booking B
2. Change End Time to 6:00 PM (no conflict)
3. Save - should succeed
4. Edit Booking B again
5. Change Start Time to 12:00 PM (creates conflict with A)
6. Save - should fail

**Expected Results**:
- ✅ Non-conflicting edit succeeds
- ✅ Conflicting edit is rejected
- ✅ Error logged for conflict

**Pass Criteria**: Conflict detection works on edit

---

#### Test 5.3: Audit Trail Completeness
**Objective**: Verify all operations create audit records

**Test**:
1. Create a booking
2. Edit the booking
3. Cancel the booking
4. Wait for status transition

**Expected Results**:
- ✅ Audit record for Create action
- ✅ Audit record for Update action
- ✅ Audit record for Status_Change (cancel)
- ✅ Audit record for Status_Change (automatic)
- ✅ All records contain required fields
- ✅ All records have correct timestamps

**Validation**:
```powershell
# Get all audit records for booking
Get-PnPListItem -List "Audit_Trail" -Query "<View><Query><Where><Eq><FieldRef Name='Entity_ID'/><Value Type='Text'>[BookingID]</Value></Eq></Where><OrderBy><FieldRef Name='Timestamp' Ascending='TRUE'/></OrderBy></Query></View>"
```

**Pass Criteria**: Complete audit trail exists

---

## Performance Verification

### Performance Test 1: App Load Time
**Objective**: Verify app loads within acceptable time

**Test**:
1. Clear browser cache
2. Open VBMS Booking Manager
3. Measure time to fully loaded state

**Expected**: < 5 seconds on desktop

**Pass Criteria**: Meets performance target

---

### Performance Test 2: Gallery Load Time
**Objective**: Verify bookings gallery loads quickly

**Test**:
1. Create 50 test bookings
2. Open VBMS Booking Manager
3. Measure time for gallery to display

**Expected**: < 2 seconds

**Pass Criteria**: Meets performance target

---

### Performance Test 3: Conflict Detection Speed
**Objective**: Verify conflict detection completes quickly

**Test**:
1. Create 100 bookings for various vans
2. Attempt to create conflicting booking
3. Measure time from submit to rejection

**Expected**: < 1 second

**Pass Criteria**: Meets performance target

---

### Performance Test 4: Status Transition Flow
**Objective**: Verify flow completes within acceptable time

**Test**:
1. Create 50 bookings eligible for transition
2. Trigger flow manually
3. Measure execution time

**Expected**: < 30 seconds for 50 bookings

**Pass Criteria**: Meets performance target

---

## Requirements Validation

### Requirement 3.1: Booking Creation Fields
- [ ] Project ID required and validated
- [ ] Driver name required
- [ ] Driver contact required
- [ ] Van selection required
- [ ] Start date/time required
- [ ] End date/time required

### Requirement 3.2: Project ID Validation
- [ ] Must be exactly 5 digits
- [ ] Must be numeric only
- [ ] Validation enforced in Power App
- [ ] Validation enforced in SharePoint

### Requirement 3.3: Date Range Validation
- [ ] End must be after start
- [ ] Validation enforced in Power App
- [ ] Clear error message displayed

### Requirement 3.4: Conflict Detection on Creation
- [ ] Flow checks for conflicts
- [ ] Overlapping bookings rejected
- [ ] Conflict details provided

### Requirement 3.5: Conflict Prevention and Display
- [ ] Conflicting booking prevented
- [ ] Conflict details logged
- [ ] User can see error

### Requirement 3.6: Unique Booking ID
- [ ] Booking ID auto-generated
- [ ] Booking ID is unique

### Requirement 3.7: Initial Status
- [ ] New bookings have Status: Requested
- [ ] Status set automatically

### Requirement 3.9: Modification Conflict Check
- [ ] Edits checked for conflicts
- [ ] Conflicting edits rejected

### Requirement 4.2: Confirmed to Active Transition
- [ ] Automatic transition at start time
- [ ] Occurs within 15 minutes

### Requirement 4.3: Active to Completed Transition
- [ ] Automatic transition at end time
- [ ] Occurs within 15 minutes

### Requirement 4.4: Audit Trail for Transitions
- [ ] All transitions create audit records
- [ ] Audit records contain required fields

### Requirement 14.1: Power Apps Canvas App
- [ ] Canvas app exists
- [ ] Booking management functionality

### Requirement 14.4: Microsoft 365 Authentication
- [ ] Uses M365 credentials
- [ ] No separate login required

### Requirement 14.5: Role-Based Actions
- [ ] Project Reps see own bookings
- [ ] Fleet Admins see all bookings
- [ ] Actions based on role

### Requirement 14.6: Responsive Design
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile

---

## Issue Tracking

### Issues Found

| # | Issue Description | Severity | Status | Resolution |
|---|-------------------|----------|--------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severity Levels**:
- **Critical**: Blocks core functionality, must fix before proceeding
- **High**: Significant impact, should fix before proceeding
- **Medium**: Moderate impact, can fix in next phase
- **Low**: Minor issue, can defer

---

## Sign-Off

### Test Execution

**Executed By**: ___________________________  
**Date**: ___________________________  
**Environment**: ___________________________

### Test Results Summary

**Total Tests**: 30  
**Passed**: ___  
**Failed**: ___  
**Blocked**: ___  
**Pass Rate**: ___%

### Requirements Validation

**Total Requirements**: 16  
**Satisfied**: ___  
**Not Satisfied**: ___  
**Satisfaction Rate**: ___%

### Decision

- [ ] **PASS**: All critical tests passed, proceed to Task 6
- [ ] **PASS WITH ISSUES**: Minor issues found, document and proceed
- [ ] **FAIL**: Critical issues found, must resolve before proceeding

### Approvals

**Project Representative**: ___________________________  
**Date**: ___________________________

**Fleet Administrator**: ___________________________  
**Date**: ___________________________

**Technical Lead**: ___________________________  
**Date**: ___________________________

---

## Next Steps

### If Checkpoint Passes

1. **Document Results**:
   - Complete this verification guide
   - Update task status to complete
   - Archive test data

2. **Proceed to Task 6**:
   - Create calendar visualization Power App
   - Implement daily/weekly/monthly views
   - Add filtering and navigation

3. **Monitor Production**:
   - Watch for any issues in first week
   - Collect user feedback
   - Address any minor issues

### If Checkpoint Fails

1. **Document Issues**:
   - Record all failing tests
   - Capture error messages and logs
   - Take screenshots of issues

2. **Prioritize Fixes**:
   - Critical issues first
   - High priority issues next
   - Medium/low can be deferred

3. **Fix and Retest**:
   - Implement fixes
   - Rerun failing tests
   - Verify fixes don't break passing tests

4. **Re-execute Checkpoint**:
   - Run full verification again
   - Update results
   - Seek approval

---

## Appendix A: Quick Test Commands

### PowerShell Commands

```powershell
# Connect to SharePoint
Connect-PnPOnline -Url "https://[tenant].sharepoint.com/sites/vbms" -Interactive

# Get all bookings
Get-PnPListItem -List "Bookings"

# Get bookings for specific van
Get-PnPListItem -List "Bookings" -Query "<View><Query><Where><Eq><FieldRef Name='Van_ID'/><Value Type='Lookup'>1</Value></Eq></Where></Query></View>"

# Get audit records
Get-PnPListItem -List "Audit_Trail" | Select-Object -First 10

# Get error log
Get-PnPListItem -List "Error_Log" | Select-Object -First 10

# Check flow runs
Get-PnPFlow | Where-Object {$_.DisplayName -like "*Booking*"}

# Get flow run history
Get-PnPFlowRun -Flow [FlowID] | Select-Object -First 10
```

### Test Data Creation

```powershell
# Create test van
Add-PnPListItem -List "Vans" -Values @{
    "Title" = "Test Van 1"
    "Van_ID" = "VAN001"
    "Registration" = "ABC123"
    "Make" = "Ford"
    "Model" = "Transit"
    "Year" = 2023
    "Tier" = "Standard"
    "Type" = "Cargo"
    "Daily_Rate" = 100
    "Mileage_Rate" = 0.50
    "Status" = "Available"
}

# Create test booking
Add-PnPListItem -List "Bookings" -Values @{
    "Project_ID" = "12345"
    "Van_ID" = 1  # Lookup ID
    "Driver_Name" = "Test User"
    "Driver_Contact" = "test@example.com"
    "Start_DateTime" = (Get-Date).AddDays(1).AddHours(9)
    "End_DateTime" = (Get-Date).AddDays(1).AddHours(17)
    "Status" = "Requested"
}
```

### Cleanup Commands

```powershell
# Delete all test bookings
Get-PnPListItem -List "Bookings" -Query "<View><Query><Where><BeginsWith><FieldRef Name='Project_ID'/><Value Type='Text'>99</Value></BeginsWith></Where></Query></View>" | ForEach-Object {
    Remove-PnPListItem -List "Bookings" -Identity $_.Id -Force
}

# Clear error log
Get-PnPListItem -List "Error_Log" | ForEach-Object {
    Remove-PnPListItem -List "Error_Log" -Identity $_.Id -Force
}
```

---

## Appendix B: Troubleshooting Guide

### Issue: Booking Created But Immediately Disappears

**Cause**: Conflict detection flow deleted it

**Solution**:
1. Check Error_Log for conflict details
2. Verify no overlapping bookings exist
3. Check flow run history
4. Review conflict detection logic

### Issue: Status Not Transitioning

**Cause**: Flow not running or failing

**Solution**:
1. Check flow is enabled
2. Check flow run history for errors
3. Verify booking has correct status and times
4. Manually trigger flow to test

### Issue: Power App Not Showing Bookings

**Cause**: Data connection or filter issue

**Solution**:
1. Check data connection is active
2. Verify user has permissions
3. Check gallery filter formula
4. Refresh data sources

### Issue: Validation Not Working

**Cause**: Formula error or control issue

**Solution**:
1. Check formula syntax
2. Verify control properties
3. Test with simple values
4. Check error messages in app

---

**Document Version**: 1.0  
**Created**: 2024  
**Related Documents**:
- Task 1 Completion Checklist
- Task 2 Implementation Guide
- Task 3 Implementation Guide
- Task 4 Summary
- Requirements Document
- Design Document
