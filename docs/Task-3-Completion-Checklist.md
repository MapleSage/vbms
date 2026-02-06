# Task 3 Completion Checklist: Booking Management Power App

## Overview

This checklist helps verify that Task 3 (Create booking management Power App) has been completed successfully for the Van Booking & Fleet Management System (VBMS).

**Task**: 3. Create booking management Power App  
**Requirements**: 3.1, 3.2, 3.3, 14.1, 14.2, 14.4, 14.5, 14.6  
**Estimated Time**: 2-3 hours

## Prerequisites Verification

- [ ] Task 1 completed (SharePoint site and lists created)
- [ ] Task 2 completed (Conflict detection flow created and tested)
- [ ] Vans list populated with test data (minimum 3 vans)
- [ ] At least one van has Status = "Available"
- [ ] Power Apps license available
- [ ] Power Apps Studio accessible
- [ ] Test user accounts available for different roles

## App Creation and Setup

### Initial Setup

- [ ] New canvas app created
- [ ] App named "VBMS Booking Manager"
- [ ] Format set to Tablet (16:9)
- [ ] App saved successfully

### Data Connections

- [ ] SharePoint connection added
- [ ] Vans list connected
- [ ] Bookings list connected
- [ ] Office365Users connector added
- [ ] All connections active (no errors)
- [ ] Data loads successfully in preview

### App Configuration

- [ ] App icon configured
- [ ] App description added
- [ ] Screen size and orientation configured
- [ ] Explicit column selection enabled
- [ ] Delayed load enabled
- [ ] App.OnStart logic implemented
- [ ] Global variables initialized (varCurrentUser, varIsFleetAdmin, etc.)

## Home Screen (scrHome) Implementation

### Screen Setup

- [ ] Screen renamed to "scrHome"
- [ ] Background color set
- [ ] OnVisible logic implemented
- [ ] Data refresh on screen load

### Header Section

- [ ] Header rectangle added
- [ ] App title label added
- [ ] User info label added
- [ ] User name displays correctly
- [ ] Role indicator shows (Project Rep or Fleet Admin)

### Filter Controls

- [ ] Filter container added
- [ ] Status dropdown added
- [ ] Status filter options correct (All, Requested, Confirmed, Active, Completed, Cancelled)
- [ ] Filter labels added
- [ ] Filters positioned correctly

### Bookings Gallery

- [ ] Gallery added (galBookings)
- [ ] Gallery Items formula filters by user role
- [ ] Gallery Items formula filters by status
- [ ] Project Reps see only their bookings
- [ ] Fleet Admins see all bookings
- [ ] Gallery template customized
- [ ] Booking card rectangle added
- [ ] Booking ID label added
- [ ] Status badge added with color coding
- [ ] Van info label added
- [ ] Date/time label added
- [ ] Project ID label added
- [ ] Driver label added
- [ ] View Details button added
- [ ] Gallery scrolls correctly
- [ ] Gallery displays data correctly

### Status Badge Colors

- [ ] Requested = Amber (RGBA(255, 193, 7, 1))
- [ ] Confirmed = Blue (RGBA(33, 150, 243, 1))
- [ ] Active = Orange (RGBA(255, 152, 0, 1))
- [ ] Completed = Green (RGBA(76, 175, 80, 1))
- [ ] Cancelled = Gray (RGBA(158, 158, 158, 1))

### New Booking Button

- [ ] Button added (btnNewBooking)
- [ ] Button positioned (floating action button style)
- [ ] Button text correct ("+ New Booking")
- [ ] Button styling correct (rounded corners)
- [ ] OnSelect navigates to create screen
- [ ] Variables reset on click


## Create Booking Screen (scrCreateBooking) Implementation

### Screen Setup

- [ ] Screen created and renamed to "scrCreateBooking"
- [ ] Background color set
- [ ] Screen accessible from home screen

### Header Section

- [ ] Header rectangle added
- [ ] Back button (icon) added
- [ ] Back button navigates to home
- [ ] Screen title label added
- [ ] Title changes based on mode (Create vs Edit)

### Form Container

- [ ] Form rectangle added
- [ ] Form centered on screen
- [ ] Form has border and rounded corners
- [ ] Form background is white

### Van Selection

- [ ] Van label added ("Select Van *")
- [ ] Van dropdown added (ddVan)
- [ ] Dropdown Items filters by availability
- [ ] Dropdown shows Registration field
- [ ] Dropdown searchable (Make, Model, Registration)
- [ ] Dropdown Default works in edit mode
- [ ] Van details label added
- [ ] Van details show Make, Model, Tier, Daily Rate
- [ ] Van details update when selection changes

### Date/Time Pickers

- [ ] Start Date/Time label added
- [ ] Start date picker added (dtpStartDate)
- [ ] Start time dropdown added (ddStartTime)
- [ ] Time slots from 6 AM to 10 PM in 30-min intervals
- [ ] Start date Default works in edit mode
- [ ] Start time Default works in edit mode
- [ ] End Date/Time label added
- [ ] End date picker added (dtpEndDate)
- [ ] End time dropdown added (ddEndTime)
- [ ] End date Default works in edit mode
- [ ] End time Default works in edit mode
- [ ] Date validation message label added
- [ ] Validation shows when end before start
- [ ] Validation message correct ("End date/time must be after start date/time")

### Project and Driver Information

- [ ] Project ID label added ("Project ID (5 digits) *")
- [ ] Project ID text input added (txtProjectID)
- [ ] Project ID MaxLength = 5
- [ ] Project ID Format = Number
- [ ] Project ID Default works in edit mode
- [ ] Project ID validation label added
- [ ] Validation shows for invalid format
- [ ] Validation message correct ("Project ID must be exactly 5 digits")
- [ ] Driver Name label added
- [ ] Driver Name text input added (txtDriverName)
- [ ] Driver Name defaults to current user in create mode
- [ ] Driver Name defaults to booking driver in edit mode
- [ ] Driver Contact label added
- [ ] Driver Contact text input added (txtDriverContact)
- [ ] Driver Contact defaults to current user email in create mode
- [ ] Driver Contact defaults to booking contact in edit mode

### Submit and Cancel Buttons

- [ ] Error message label added (lblError)
- [ ] Error message displays varErrorMessage
- [ ] Error message visible only when error exists
- [ ] Submit button added (btnSubmit)
- [ ] Submit button text changes based on mode
- [ ] Submit button disabled when validation fails
- [ ] Submit button enabled when all fields valid
- [ ] Submit button OnSelect creates/updates booking
- [ ] Submit button handles Van_ID lookup correctly
- [ ] Submit button combines date and time correctly
- [ ] Submit button navigates back on success
- [ ] Submit button shows notification on success
- [ ] Cancel button added (btnCancel)
- [ ] Cancel button navigates back to home
- [ ] Cancel button styling correct (white with border)

## Booking Details Screen (scrBookingDetails) Implementation

### Screen Setup

- [ ] Screen created and renamed to "scrBookingDetails"
- [ ] Background color set
- [ ] Screen accessible from gallery View Details button

### Header Section

- [ ] Header rectangle added
- [ ] Back button added
- [ ] Back button navigates to home
- [ ] Screen title label added ("Booking Details")

### Details Container

- [ ] Details rectangle added
- [ ] Container centered on screen
- [ ] Container has border and rounded corners

### Booking Information Display

- [ ] Booking ID label and value added
- [ ] Status label and value added
- [ ] Status badge with color coding added
- [ ] Van label and value added
- [ ] Van shows Registration, Make, Model
- [ ] Start Date/Time label and value added
- [ ] Start formatted correctly (full date/time)
- [ ] End Date/Time label and value added
- [ ] End formatted correctly (full date/time)
- [ ] Project ID label and value added
- [ ] Driver Name label and value added
- [ ] Driver Contact label and value added
- [ ] Created By label and value added
- [ ] Created Date label and value added
- [ ] All labels aligned consistently
- [ ] All values display correctly

### Action Buttons

- [ ] Edit button added (btnEdit)
- [ ] Edit button visible only when allowed
- [ ] Edit button checks user ownership or admin role
- [ ] Edit button checks status (Requested or Confirmed only)
- [ ] Edit button sets varEditMode = true
- [ ] Edit button navigates to create screen
- [ ] Cancel Booking button added (btnCancelBooking)
- [ ] Cancel button visible only when allowed
- [ ] Cancel button checks user ownership or admin role
- [ ] Cancel button checks status (not Cancelled or Completed)
- [ ] Cancel button shows confirmation dialog
- [ ] Cancel button updates status to Cancelled
- [ ] Cancel button refreshes data
- [ ] Cancel button navigates back to home
- [ ] Cancel button shows success notification
- [ ] Back to List button added (btnBackToList)
- [ ] Back button navigates to home
- [ ] Back button styling correct


## Functional Testing

### Test 1: Create Valid Booking

- [ ] Clicked "New Booking" button
- [ ] Selected available van from dropdown
- [ ] Selected start date (tomorrow)
- [ ] Selected start time (9:00 AM)
- [ ] Selected end date (tomorrow)
- [ ] Selected end time (5:00 PM)
- [ ] Entered valid Project ID (12345)
- [ ] Entered driver name
- [ ] Entered driver contact
- [ ] Submit button enabled
- [ ] Clicked "Create Booking"
- [ ] Booking created successfully
- [ ] Navigated back to home screen
- [ ] Success notification displayed
- [ ] Booking appears in gallery
- [ ] Booking has Status = "Requested"
- [ ] Verified in SharePoint Bookings list

### Test 2: Project ID Validation

- [ ] Entered 3-digit Project ID (123)
- [ ] Validation error displayed
- [ ] Submit button disabled
- [ ] Entered 6-digit Project ID (123456)
- [ ] Validation error displayed
- [ ] Submit button disabled
- [ ] Entered non-numeric Project ID (ABCDE)
- [ ] Validation error displayed
- [ ] Submit button disabled
- [ ] Entered valid 5-digit Project ID (12345)
- [ ] Validation error cleared
- [ ] Submit button enabled

### Test 3: Date/Time Validation

- [ ] Selected start date: Tomorrow
- [ ] Selected start time: 5:00 PM
- [ ] Selected end date: Tomorrow
- [ ] Selected end time: 3:00 PM (before start)
- [ ] Validation error displayed
- [ ] Submit button disabled
- [ ] Changed end time to 7:00 PM (after start)
- [ ] Validation error cleared
- [ ] Submit button enabled

### Test 4: Required Fields Validation

- [ ] Left Van dropdown empty
- [ ] Submit button disabled
- [ ] Selected van
- [ ] Submit button enabled
- [ ] Cleared Project ID
- [ ] Submit button disabled
- [ ] Entered Project ID
- [ ] Submit button enabled
- [ ] Cleared Driver Name
- [ ] Submit button disabled
- [ ] Entered Driver Name
- [ ] Submit button enabled

### Test 5: Van Availability Filter

- [ ] Set Van ABC-123 Status = "Available" in SharePoint
- [ ] Set Van XYZ-789 Status = "Unavailable" in SharePoint
- [ ] Refreshed app
- [ ] Opened Van dropdown
- [ ] ABC-123 appears in list
- [ ] XYZ-789 does NOT appear in list
- [ ] Only available vans shown

### Test 6: Booking Conflict Detection

**Setup**:
- [ ] Created booking: Van ABC-123, Today 10 AM - 2 PM, Status: Confirmed

**Test**:
- [ ] Attempted to create booking: Van ABC-123, Today 12 PM - 4 PM
- [ ] Booking initially created
- [ ] Conflict detection flow ran
- [ ] Booking deleted by flow (or error shown)
- [ ] Checked Error_Log in SharePoint
- [ ] Conflict details logged correctly

### Test 7: View Booking Details

- [ ] Clicked "View Details" on a booking
- [ ] Navigated to details screen
- [ ] All booking information displayed correctly
- [ ] Booking ID correct
- [ ] Status correct with color badge
- [ ] Van information correct
- [ ] Start date/time formatted correctly
- [ ] End date/time formatted correctly
- [ ] Project ID correct
- [ ] Driver name correct
- [ ] Driver contact correct
- [ ] Created by correct
- [ ] Created date correct

### Test 8: Edit Booking

**Setup**:
- [ ] Created booking with Status = "Requested"

**Test**:
- [ ] Viewed booking details
- [ ] Edit button visible
- [ ] Clicked "Edit Booking"
- [ ] Navigated to create screen
- [ ] Form pre-populated with booking data
- [ ] Van dropdown shows current van
- [ ] Date/time pickers show current values
- [ ] Project ID shows current value
- [ ] Driver info shows current values
- [ ] Changed end time to 6:00 PM
- [ ] Clicked "Save Changes"
- [ ] Booking updated successfully
- [ ] Navigated back to home
- [ ] Updated time reflected in gallery
- [ ] Verified in SharePoint

### Test 9: Cancel Booking

**Setup**:
- [ ] Created booking with Status = "Requested"

**Test**:
- [ ] Viewed booking details
- [ ] Cancel button visible
- [ ] Clicked "Cancel Booking"
- [ ] Confirmation dialog appeared
- [ ] Clicked "Yes" to confirm
- [ ] Status changed to "Cancelled"
- [ ] Navigated back to home
- [ ] Success notification displayed
- [ ] Booking still visible in gallery
- [ ] Status shows "Cancelled" with gray badge
- [ ] Verified in SharePoint
- [ ] Viewed cancelled booking details
- [ ] Edit button NOT visible
- [ ] Cancel button NOT visible

### Test 10: Role-Based Access (Project Representative)

**Setup**:
- [ ] Signed in as Project Representative (non-admin)
- [ ] Created 2 bookings as this user
- [ ] Had another user create 2 bookings

**Test**:
- [ ] Opened app
- [ ] Gallery shows only own bookings (2 items)
- [ ] Other users' bookings NOT visible
- [ ] Viewed own booking details
- [ ] Edit button visible (if status allows)
- [ ] Cancel button visible (if status allows)
- [ ] Attempted to view another user's booking (if possible)
- [ ] Cannot edit other users' bookings

### Test 11: Role-Based Access (Fleet Administrator)

**Setup**:
- [ ] Signed in as Fleet Administrator
- [ ] Multiple bookings exist from different users

**Test**:
- [ ] Opened app
- [ ] Gallery shows ALL bookings (all users)
- [ ] User info shows "(Fleet Admin)"
- [ ] Viewed any booking details
- [ ] Edit button visible for all bookings
- [ ] Cancel button visible for all bookings
- [ ] Successfully edited another user's booking
- [ ] Successfully cancelled another user's booking

### Test 12: Status Filter

- [ ] Set status filter to "All"
- [ ] Gallery shows all bookings
- [ ] Set status filter to "Requested"
- [ ] Gallery shows only Requested bookings
- [ ] Set status filter to "Confirmed"
- [ ] Gallery shows only Confirmed bookings
- [ ] Set status filter to "Active"
- [ ] Gallery shows only Active bookings
- [ ] Set status filter to "Completed"
- [ ] Gallery shows only Completed bookings
- [ ] Set status filter to "Cancelled"
- [ ] Gallery shows only Cancelled bookings

### Test 13: Navigation Flow

- [ ] Started on home screen
- [ ] Clicked "New Booking"
- [ ] Navigated to create screen
- [ ] Clicked back button
- [ ] Returned to home screen
- [ ] Clicked "View Details" on booking
- [ ] Navigated to details screen
- [ ] Clicked "Edit Booking"
- [ ] Navigated to create screen (edit mode)
- [ ] Clicked "Cancel"
- [ ] Returned to home screen
- [ ] All navigation smooth with transitions

### Test 14: Data Refresh

- [ ] Opened app
- [ ] Noted current bookings
- [ ] Created new booking in SharePoint directly
- [ ] Navigated away and back to home screen
- [ ] New booking appeared in gallery
- [ ] Updated booking in SharePoint directly
- [ ] Refreshed app
- [ ] Changes reflected in gallery

### Test 15: Error Handling

- [ ] Disconnected from network
- [ ] Attempted to create booking
- [ ] Error message displayed (or appropriate handling)
- [ ] Reconnected to network
- [ ] Attempted to create booking again
- [ ] Booking created successfully
- [ ] Tested with invalid data in SharePoint
- [ ] App handled gracefully (no crash)


## Performance Testing

### Load Time

- [ ] App loads in < 5 seconds on desktop
- [ ] App loads in < 10 seconds on mobile
- [ ] Data loads without noticeable delay
- [ ] Gallery populates quickly (< 2 seconds)

### Responsiveness

- [ ] All buttons respond immediately to clicks
- [ ] Dropdowns open quickly
- [ ] Date pickers open quickly
- [ ] Navigation transitions are smooth
- [ ] No lag when typing in text inputs

### Data Volume

- [ ] Tested with 10 bookings - performs well
- [ ] Tested with 50 bookings - performs well
- [ ] Tested with 100 bookings - performs acceptably
- [ ] Gallery scrolling smooth with many items
- [ ] Filters apply quickly even with many items

### Mobile Performance

- [ ] Tested on mobile device or emulator
- [ ] App scales correctly to mobile screen
- [ ] All controls accessible on mobile
- [ ] Touch interactions work correctly
- [ ] Performance acceptable on mobile

## Requirements Validation

### Requirement 3.1: Booking Creation Fields

- [ ] Project ID field present and required
- [ ] Driver name field present and required
- [ ] Driver contact field present and required
- [ ] Van selection field present and required
- [ ] Start date/time field present and required
- [ ] End date/time field present and required
- [ ] All fields validated before submission

### Requirement 3.2: Project ID Validation

- [ ] Project ID must be exactly 5 digits
- [ ] Non-numeric values rejected
- [ ] Less than 5 digits rejected
- [ ] More than 5 digits rejected
- [ ] Validation message clear and helpful

### Requirement 3.3: Date Range Validation

- [ ] End date/time must be after start date/time
- [ ] Validation prevents invalid date ranges
- [ ] Validation message clear and helpful
- [ ] Submit button disabled for invalid ranges

### Requirement 14.1: Power Apps Canvas App

- [ ] App is a Power Apps canvas app
- [ ] App provides booking management functionality
- [ ] App accessible to authorized users

### Requirement 14.2: Calendar Visualization

- [ ] (Deferred to Task 6 - Calendar View App)
- [ ] This task focuses on booking management only

### Requirement 14.4: Microsoft 365 Authentication

- [ ] App uses Microsoft 365 credentials
- [ ] No separate login required
- [ ] User identity captured correctly
- [ ] Office365Users connector provides user info

### Requirement 14.5: Role-Based Actions

- [ ] Project Representatives see only their bookings
- [ ] Project Representatives can create bookings
- [ ] Project Representatives can edit own bookings
- [ ] Project Representatives can cancel own bookings
- [ ] Fleet Administrators see all bookings
- [ ] Fleet Administrators can edit any booking
- [ ] Fleet Administrators can cancel any booking
- [ ] Role-based visibility enforced

### Requirement 14.6: Responsive Design

- [ ] App works on desktop (1366x768 and larger)
- [ ] App works on tablet (iPad, Surface)
- [ ] App works on mobile (iPhone, Android)
- [ ] Layout adapts to different screen sizes
- [ ] All controls accessible on all devices
- [ ] Text readable on all devices

## Integration Verification

### SharePoint Integration

- [ ] App reads from Vans list correctly
- [ ] App reads from Bookings list correctly
- [ ] App creates bookings in SharePoint
- [ ] App updates bookings in SharePoint
- [ ] Lookup columns handled correctly (Van_ID)
- [ ] Choice columns handled correctly (Status)
- [ ] Date/time columns handled correctly
- [ ] Person columns handled correctly (Created)

### Power Automate Integration

- [ ] Conflict detection flow triggers on booking creation
- [ ] Conflict detection flow triggers on booking update
- [ ] Flow runs synchronously (blocks until complete)
- [ ] Conflicting bookings deleted by flow
- [ ] Error_Log populated with conflict details
- [ ] Audit_Trail populated with booking operations
- [ ] App handles flow results appropriately

### Office 365 Integration

- [ ] Current user info retrieved correctly
- [ ] User display name shown in app
- [ ] User email used for default driver contact
- [ ] User identity used for role checking

## User Experience Verification

### Usability

- [ ] App is intuitive and easy to use
- [ ] Navigation is clear and logical
- [ ] Labels are descriptive and helpful
- [ ] Error messages are clear and actionable
- [ ] Success notifications are informative
- [ ] Required fields marked with asterisk (*)
- [ ] Form layout is clean and organized

### Visual Design

- [ ] Consistent color scheme throughout app
- [ ] Microsoft blue used for primary actions
- [ ] Status colors match design (Amber, Blue, Orange, Green, Gray)
- [ ] Adequate spacing between controls
- [ ] Rounded corners on cards and buttons
- [ ] Professional appearance
- [ ] Branding consistent with organization

### Accessibility

- [ ] Text is readable (adequate size and contrast)
- [ ] Controls are large enough to tap/click
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Error messages associated with fields
- [ ] Color not sole indicator of status (text labels present)

## Documentation Verification

- [ ] Implementation guide created
- [ ] Completion checklist created (this document)
- [ ] All formulas documented
- [ ] All controls documented
- [ ] Testing scenarios documented
- [ ] Troubleshooting guide included
- [ ] Requirements mapping documented

## Deployment Verification

### App Publishing

- [ ] App saved with version notes
- [ ] App published successfully
- [ ] Published version tested
- [ ] No errors in published version

### App Sharing

- [ ] App shared with VBMS Project Representatives group
- [ ] App shared with VBMS Fleet Administrators group
- [ ] Permissions set correctly (Can use)
- [ ] Users can access app from make.powerapps.com
- [ ] Users can access app from Power Apps mobile

### User Communication

- [ ] Users notified of app availability
- [ ] User guide provided
- [ ] Training session scheduled (if needed)
- [ ] Support contact information provided

## Security Verification

### Data Security

- [ ] Users can only see authorized data
- [ ] Project Reps cannot see others' bookings
- [ ] Fleet Admins can see all bookings
- [ ] SharePoint permissions enforced
- [ ] No data leakage through formulas

### Action Security

- [ ] Users can only perform authorized actions
- [ ] Project Reps cannot edit others' bookings
- [ ] Project Reps cannot cancel others' bookings
- [ ] Fleet Admins can perform all actions
- [ ] Role checks implemented correctly

### Audit Trail

- [ ] All booking creations logged
- [ ] All booking updates logged
- [ ] All booking cancellations logged
- [ ] User identity captured in logs
- [ ] Timestamps captured in logs

## Known Issues and Limitations

Document any known issues or limitations:

- [ ] Issue 1: _________________________________
  - Impact: _________________________________
  - Workaround: _________________________________
  - Resolution plan: _________________________________

- [ ] Issue 2: _________________________________
  - Impact: _________________________________
  - Workaround: _________________________________
  - Resolution plan: _________________________________

## Sign-Off

### Completed By

- **Name**: ___________________________
- **Date**: ___________________________
- **Role**: ___________________________
- **Signature**: ___________________________

### Tested By

- **Name**: ___________________________
- **Date**: ___________________________
- **Role**: ___________________________
- **Signature**: ___________________________

### Approved By

- **Name**: ___________________________
- **Date**: ___________________________
- **Role**: ___________________________
- **Signature**: ___________________________

## Notes

Document any additional notes, observations, or recommendations:

```
[Add notes here]
```

## Next Steps

After completing this checklist:

1. **Address any failed checks**:
   - Review and fix any items not checked
   - Retest after fixes
   - Document resolutions

2. **Proceed to Task 4**: Implement booking lifecycle management
   - Create Power Automate flow for status transitions
   - Test automatic status changes
   - Verify integration with booking app

3. **User Acceptance Testing**:
   - Conduct UAT with Project Representatives
   - Conduct UAT with Fleet Administrators
   - Gather feedback and make improvements

4. **Training and Rollout**:
   - Conduct user training sessions
   - Provide user documentation
   - Monitor usage and provide support

## Appendix: Quick Reference

### App URL

- **Make Portal**: https://make.powerapps.com
- **App ID**: _________________________________
- **Direct Link**: _________________________________

### SharePoint Lists

- **Site URL**: https://[tenant].sharepoint.com/sites/vbms
- **Vans List**: https://[tenant].sharepoint.com/sites/vbms/Lists/Vans
- **Bookings List**: https://[tenant].sharepoint.com/sites/vbms/Lists/Bookings

### Key Formulas

**Gallery Filter (Project Rep)**:
```powerFx
Filter(Bookings, Created.Email = varCurrentUser.Email)
```

**Gallery Filter (Fleet Admin)**:
```powerFx
Filter(Bookings, true)  // Show all
```

**Van Dropdown Filter**:
```powerFx
Filter(Vans, Status.Value = "Available")
```

**Date/Time Combination**:
```powerFx
DateAdd(dtpStartDate.SelectedDate, 
        Hour(TimeValue(ddStartTime.Selected.Value)), Hours) + 
Minute(TimeValue(ddStartTime.Selected.Value))
```

### Support Contacts

- **Technical Support**: _________________________________
- **Power Apps Admin**: _________________________________
- **SharePoint Admin**: _________________________________
- **VBMS Project Lead**: _________________________________

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active

