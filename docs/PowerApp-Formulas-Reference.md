# VBMS Booking Manager - Power App Formulas Reference

## Overview

This document provides a complete reference of all formulas used in the VBMS Booking Manager Power App. Use this as a quick reference when building or maintaining the app.

## App-Level Formulas

### App.OnStart

```powerFx
// Initialize global variables
Set(varCurrentUser, User());

// Check if user is Fleet Admin
// Option 1: Check by email (customize list)
Set(varIsFleetAdmin, 
    User().Email in [
        "admin@yourdomain.com",
        "fleetadmin@yourdomain.com"
    ]
);

// Option 2: Check by SharePoint group membership (requires additional setup)
// Set(varIsFleetAdmin, 
//     User().Email in Office365Groups.ListGroupMembers("VBMS Fleet Administrators").value.mail
// );

// Initialize other variables
Set(varEditMode, false);
Set(varSelectedBooking, Blank());
Set(varErrorMessage, "");

// Refresh data
Refresh(Vans);
Refresh(Bookings);
```

**Variables Created**:
- `varCurrentUser`: Current user object from User()
- `varIsFleetAdmin`: Boolean indicating if user is Fleet Admin
- `varEditMode`: Boolean indicating if in edit mode (vs create mode)
- `varSelectedBooking`: Currently selected booking record
- `varErrorMessage`: Error message to display to user

## Home Screen (scrHome)

### Screen Properties

**scrHome.Fill**:
```powerFx
RGBA(245, 245, 245, 1)  // Light gray background
```

**scrHome.OnVisible**:
```powerFx
// Refresh bookings when screen loads
Refresh(Bookings);
// Get current user info
Set(varCurrentUser, User());
// Check if user is Fleet Admin (customize based on your setup)
Set(varIsFleetAdmin, 
    User().Email in ["admin@yourdomain.com", "fleetadmin@yourdomain.com"]
);
```

### Header Section

**lblAppTitle.Text**:
```powerFx
"VBMS Booking Manager"
```

**lblUserInfo.Text**:
```powerFx
"Welcome, " & Office365Users.MyProfile().DisplayName & 
If(varIsFleetAdmin, " (Fleet Admin)", " (Project Rep)")
```

### Filter Controls

**ddStatus.Items**:
```powerFx
["All", "Requested", "Confirmed", "Active", "Completed", "Cancelled"]
```

**ddStatus.Default**:
```powerFx
"All"
```

### Bookings Gallery

**galBookings.Items**:
```powerFx
// Filter bookings based on user role and status filter
Filter(
    Bookings,
    // Role-based filter
    If(varIsFleetAdmin, 
        true,  // Admins see all
        Created.Email = varCurrentUser.Email  // Reps see only their own
    ),
    // Status filter
    If(ddStatus.Selected.Value = "All",
        true,
        Status.Value = ddStatus.Selected.Value
    )
)
```

**Alternative with performance optimization**:
```powerFx
// Use FirstN to limit results for better performance
FirstN(
    Filter(
        Bookings,
        If(varIsFleetAdmin, true, Created.Email = varCurrentUser.Email),
        If(ddStatus.Selected.Value = "All", true, Status.Value = ddStatus.Selected.Value)
    ),
    100  // Show max 100 items
)
```

**lblBookingID.Text** (in gallery):
```powerFx
"Booking #" & ThisItem.ID
```

**lblStatus.Text** (in gallery):
```powerFx
ThisItem.Status.Value
```

**lblStatus.Fill** (status badge color):
```powerFx
Switch(ThisItem.Status.Value,
    "Requested", RGBA(255, 193, 7, 1),    // Amber
    "Confirmed", RGBA(33, 150, 243, 1),   // Blue
    "Active", RGBA(255, 152, 0, 1),       // Orange
    "Completed", RGBA(76, 175, 80, 1),    // Green
    "Cancelled", RGBA(158, 158, 158, 1),  // Gray
    RGBA(158, 158, 158, 1)                // Default gray
)
```

**lblVanInfo.Text** (in gallery):
```powerFx
"Van: " & LookUp(Vans, ID = ThisItem.Van_ID.Id).Registration & 
" (" & LookUp(Vans, ID = ThisItem.Van_ID.Id).Make & " " & 
LookUp(Vans, ID = ThisItem.Van_ID.Id).Model & ")"
```

**Optimized version using With()**:
```powerFx
With({
    van: LookUp(Vans, ID = ThisItem.Van_ID.Id)
},
    "Van: " & van.Registration & " (" & van.Make & " " & van.Model & ")"
)
```

**lblDateTime.Text** (in gallery):
```powerFx
Text(ThisItem.Start_DateTime, "ddd, mmm dd, yyyy h:mm AM/PM") & 
" - " & 
Text(ThisItem.End_DateTime, "h:mm AM/PM")
```

**lblProjectID.Text** (in gallery):
```powerFx
"Project: " & ThisItem.Project_ID
```

**lblDriver.Text** (in gallery):
```powerFx
"Driver: " & ThisItem.Driver_Name
```

**btnViewDetails.OnSelect** (in gallery):
```powerFx
Set(varSelectedBooking, ThisItem);
Navigate(scrBookingDetails, ScreenTransition.Fade)
```

### New Booking Button

**btnNewBooking.OnSelect**:
```powerFx
// Reset form variables
Set(varEditMode, false);
Set(varSelectedBooking, Blank());
Navigate(scrCreateBooking, ScreenTransition.Fade)
```


## Create/Edit Booking Screen (scrCreateBooking)

### Screen Properties

**scrCreateBooking.Fill**:
```powerFx
RGBA(245, 245, 245, 1)  // Light gray background
```

### Header Section

**icnBack.OnSelect**:
```powerFx
Navigate(scrHome, ScreenTransition.Fade)
```

**lblCreateTitle.Text**:
```powerFx
If(varEditMode, "Edit Booking", "Create New Booking")
```

### Van Selection

**ddVan.Items**:
```powerFx
// Filter vans by availability (Status = Available)
// For edit mode, include the currently selected van
Filter(Vans, 
    Status.Value = "Available" || 
    (varEditMode && ID = varSelectedBooking.Van_ID.Id)
)
```

**ddVan.Default**:
```powerFx
If(varEditMode, 
    LookUp(Vans, ID = varSelectedBooking.Van_ID.Id),
    Blank()
)
```

**lblVanDetails.Text**:
```powerFx
If(!IsBlank(ddVan.Selected),
    ddVan.Selected.Make & " " & ddVan.Selected.Model & 
    " | " & ddVan.Selected.Tier.Value & 
    " | Daily Rate: " & Text(ddVan.Selected.Daily_Rate, "$#,##0.00"),
    ""
)
```

### Date/Time Pickers

**dtpStartDate.DefaultDate**:
```powerFx
If(varEditMode, 
    DateValue(varSelectedBooking.Start_DateTime),
    Today()
)
```

**ddStartTime.Items**:
```powerFx
// Generate time slots from 6 AM to 10 PM in 30-minute intervals
["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
 "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
 "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
 "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
 "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
 "09:00 PM", "09:30 PM", "10:00 PM"]
```

**Alternative using collection** (better performance):
```powerFx
// In App.OnStart or Screen.OnVisible
ClearCollect(colTimeSlots,
    {Time: "06:00 AM"}, {Time: "06:30 AM"}, {Time: "07:00 AM"}, {Time: "07:30 AM"},
    {Time: "08:00 AM"}, {Time: "08:30 AM"}, {Time: "09:00 AM"}, {Time: "09:30 AM"},
    {Time: "10:00 AM"}, {Time: "10:30 AM"}, {Time: "11:00 AM"}, {Time: "11:30 AM"},
    {Time: "12:00 PM"}, {Time: "12:30 PM"}, {Time: "01:00 PM"}, {Time: "01:30 PM"},
    {Time: "02:00 PM"}, {Time: "02:30 PM"}, {Time: "03:00 PM"}, {Time: "03:30 PM"},
    {Time: "04:00 PM"}, {Time: "04:30 PM"}, {Time: "05:00 PM"}, {Time: "05:30 PM"},
    {Time: "06:00 PM"}, {Time: "06:30 PM"}, {Time: "07:00 PM"}, {Time: "07:30 PM"},
    {Time: "08:00 PM"}, {Time: "08:30 PM"}, {Time: "09:00 PM"}, {Time: "09:30 PM"},
    {Time: "10:00 PM"}
);

// Then in dropdown
ddStartTime.Items: colTimeSlots
```

**ddStartTime.Default**:
```powerFx
If(varEditMode,
    Text(TimeValue(varSelectedBooking.Start_DateTime), "hh:mm AM/PM"),
    "08:00 AM"
)
```

**dtpEndDate.DefaultDate**:
```powerFx
If(varEditMode,
    DateValue(varSelectedBooking.End_DateTime),
    Today()
)
```

**ddEndTime.Default**:
```powerFx
If(varEditMode,
    Text(TimeValue(varSelectedBooking.End_DateTime), "hh:mm AM/PM"),
    "05:00 PM"
)
```

**lblDateValidation.Text**:
```powerFx
If(
    DateAdd(dtpStartDate.SelectedDate, 
            Hour(TimeValue(ddStartTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddStartTime.Selected.Value)) >= 
    DateAdd(dtpEndDate.SelectedDate, 
            Hour(TimeValue(ddEndTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddEndTime.Selected.Value)),
    "⚠ End date/time must be after start date/time",
    ""
)
```

**lblDateValidation.Visible**:
```powerFx
DateAdd(dtpStartDate.SelectedDate, 
        Hour(TimeValue(ddStartTime.Selected.Value)), Hours) + 
Minute(TimeValue(ddStartTime.Selected.Value)) >= 
DateAdd(dtpEndDate.SelectedDate, 
        Hour(TimeValue(ddEndTime.Selected.Value)), Hours) + 
Minute(TimeValue(ddEndTime.Selected.Value))
```

### Project and Driver Information

**txtProjectID.Default**:
```powerFx
If(varEditMode, varSelectedBooking.Project_ID, "")
```

**lblProjectIDValidation.Text**:
```powerFx
If(
    Len(txtProjectID.Text) > 0 && 
    (Len(txtProjectID.Text) <> 5 || !IsNumeric(txtProjectID.Text)),
    "⚠ Project ID must be exactly 5 digits",
    ""
)
```

**lblProjectIDValidation.Visible**:
```powerFx
Len(txtProjectID.Text) > 0 && 
(Len(txtProjectID.Text) <> 5 || !IsNumeric(txtProjectID.Text))
```

**txtDriverName.Default**:
```powerFx
If(varEditMode, 
    varSelectedBooking.Driver_Name, 
    Office365Users.MyProfile().DisplayName
)
```

**txtDriverContact.Default**:
```powerFx
If(varEditMode, 
    varSelectedBooking.Driver_Contact, 
    Office365Users.MyProfile().Mail
)
```

### Submit Button

**btnSubmit.Text**:
```powerFx
If(varEditMode, "Save Changes", "Create Booking")
```

**btnSubmit.DisplayMode**:
```powerFx
If(
    // All required fields filled
    !IsBlank(ddVan.Selected) &&
    !IsBlank(txtProjectID.Text) &&
    Len(txtProjectID.Text) = 5 &&
    IsNumeric(txtProjectID.Text) &&
    !IsBlank(txtDriverName.Text) &&
    !IsBlank(txtDriverContact.Text) &&
    // End after start
    DateAdd(dtpStartDate.SelectedDate, 
            Hour(TimeValue(ddStartTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddStartTime.Selected.Value)) < 
    DateAdd(dtpEndDate.SelectedDate, 
            Hour(TimeValue(ddEndTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddEndTime.Selected.Value)),
    DisplayMode.Edit,
    DisplayMode.Disabled
)
```

**btnSubmit.OnSelect**:
```powerFx
// Clear previous error
Set(varErrorMessage, "");

// Combine date and time
Set(varStartDateTime, 
    DateAdd(dtpStartDate.SelectedDate, 
            Hour(TimeValue(ddStartTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddStartTime.Selected.Value))
);
Set(varEndDateTime, 
    DateAdd(dtpEndDate.SelectedDate, 
            Hour(TimeValue(ddEndTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddEndTime.Selected.Value))
);

// Create or update booking
If(varEditMode,
    // Update existing booking
    Patch(Bookings, varSelectedBooking, {
        Van_ID: {
            '@odata.type': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
            Id: ddVan.Selected.ID,
            Value: ddVan.Selected.Registration
        },
        Project_ID: txtProjectID.Text,
        Driver_Name: txtDriverName.Text,
        Driver_Contact: txtDriverContact.Text,
        Start_DateTime: varStartDateTime,
        End_DateTime: varEndDateTime
    }),
    // Create new booking
    Patch(Bookings, Defaults(Bookings), {
        Van_ID: {
            '@odata.type': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
            Id: ddVan.Selected.ID,
            Value: ddVan.Selected.Registration
        },
        Project_ID: txtProjectID.Text,
        Driver_Name: txtDriverName.Text,
        Driver_Contact: txtDriverContact.Text,
        Start_DateTime: varStartDateTime,
        End_DateTime: varEndDateTime,
        Status: {Value: "Requested"}
    })
);

// Check for errors (conflict detection flow will delete if conflict)
If(IsError(Bookings),
    // Error occurred
    Set(varErrorMessage, "An error occurred. Please try again."),
    // Success - wait a moment for flow to run
    Set(varErrorMessage, "");
    // Refresh to check if booking still exists (not deleted by conflict flow)
    Refresh(Bookings);
    // Navigate back to home
    Navigate(scrHome, ScreenTransition.Fade);
    Notify("Booking " & If(varEditMode, "updated", "created") & " successfully!", 
           NotificationType.Success)
)
```

**btnCancel.OnSelect**:
```powerFx
Navigate(scrHome, ScreenTransition.Fade)
```


## Booking Details Screen (scrBookingDetails)

### Screen Properties

**scrBookingDetails.Fill**:
```powerFx
RGBA(245, 245, 245, 1)  // Light gray background
```

### Header Section

**icnBack.OnSelect**:
```powerFx
Navigate(scrHome, ScreenTransition.Fade)
```

### Booking Information Display

**lblBookingIDValue.Text**:
```powerFx
varSelectedBooking.ID
```

**lblStatusValue.Text**:
```powerFx
varSelectedBooking.Status.Value
```

**lblStatusValue.Fill** (status badge):
```powerFx
Switch(varSelectedBooking.Status.Value,
    "Requested", RGBA(255, 193, 7, 1),    // Amber
    "Confirmed", RGBA(33, 150, 243, 1),   // Blue
    "Active", RGBA(255, 152, 0, 1),       // Orange
    "Completed", RGBA(76, 175, 80, 1),    // Green
    "Cancelled", RGBA(158, 158, 158, 1),  // Gray
    RGBA(158, 158, 158, 1)                // Default
)
```

**lblVanValue.Text**:
```powerFx
LookUp(Vans, ID = varSelectedBooking.Van_ID.Id).Registration & 
" (" & LookUp(Vans, ID = varSelectedBooking.Van_ID.Id).Make & " " & 
LookUp(Vans, ID = varSelectedBooking.Van_ID.Id).Model & ")"
```

**Optimized version**:
```powerFx
With({
    van: LookUp(Vans, ID = varSelectedBooking.Van_ID.Id)
},
    van.Registration & " (" & van.Make & " " & van.Model & ")"
)
```

**lblStartValue.Text**:
```powerFx
Text(varSelectedBooking.Start_DateTime, "dddd, mmmm dd, yyyy h:mm AM/PM")
```

**lblEndValue.Text**:
```powerFx
Text(varSelectedBooking.End_DateTime, "dddd, mmmm dd, yyyy h:mm AM/PM")
```

**lblProjectIDValue.Text**:
```powerFx
varSelectedBooking.Project_ID
```

**lblDriverValue.Text**:
```powerFx
varSelectedBooking.Driver_Name
```

**lblContactValue.Text**:
```powerFx
varSelectedBooking.Driver_Contact
```

**lblCreatedByValue.Text**:
```powerFx
varSelectedBooking.Created.DisplayName
```

**lblCreatedDateValue.Text**:
```powerFx
Text(varSelectedBooking.Created, "mmm dd, yyyy h:mm AM/PM")
```

### Action Buttons

**btnEdit.Visible**:
```powerFx
// Show if user owns booking or is admin, and status allows editing
(varSelectedBooking.Created.Email = varCurrentUser.Email || varIsFleetAdmin) &&
varSelectedBooking.Status.Value in ["Requested", "Confirmed"]
```

**btnEdit.OnSelect**:
```powerFx
Set(varEditMode, true);
Navigate(scrCreateBooking, ScreenTransition.Fade)
```

**btnCancelBooking.Visible**:
```powerFx
// Show if user owns booking or is admin, and not already cancelled/completed
(varSelectedBooking.Created.Email = varCurrentUser.Email || varIsFleetAdmin) &&
!(varSelectedBooking.Status.Value in ["Cancelled", "Completed"])
```

**btnCancelBooking.OnSelect**:
```powerFx
// Confirm cancellation
If(
    Confirm("Are you sure you want to cancel this booking?"),
    // Update status to Cancelled
    Patch(Bookings, varSelectedBooking, {
        Status: {Value: "Cancelled"}
    });
    Refresh(Bookings);
    Navigate(scrHome, ScreenTransition.Fade);
    Notify("Booking cancelled successfully", NotificationType.Success),
    // User clicked No, do nothing
    false
)
```

**btnBackToList.OnSelect**:
```powerFx
Navigate(scrHome, ScreenTransition.Fade)
```

## Common Patterns and Utilities

### Date/Time Combination

**Combine date picker and time dropdown**:
```powerFx
// Store in variable
Set(varCombinedDateTime,
    DateAdd(dtpDate.SelectedDate, 
            Hour(TimeValue(ddTime.Selected.Value)), Hours) + 
    Minute(TimeValue(ddTime.Selected.Value))
);
```

### SharePoint Lookup Column Format

**For Patch() operations with lookup columns**:
```powerFx
Van_ID: {
    '@odata.type': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
    Id: ddVan.Selected.ID,
    Value: ddVan.Selected.Registration
}
```

### SharePoint Choice Column Format

**For Patch() operations with choice columns**:
```powerFx
Status: {Value: "Requested"}
```

### Conditional Visibility Based on Role and Ownership

```powerFx
// Show if user owns item OR is admin
(ThisItem.Created.Email = varCurrentUser.Email || varIsFleetAdmin)

// Show if user owns item AND is not admin
(ThisItem.Created.Email = varCurrentUser.Email && !varIsFleetAdmin)

// Show only for admins
varIsFleetAdmin

// Show only for non-admins
!varIsFleetAdmin
```

### Status-Based Visibility

```powerFx
// Show if status is Requested or Confirmed
ThisItem.Status.Value in ["Requested", "Confirmed"]

// Show if status is NOT Cancelled or Completed
!(ThisItem.Status.Value in ["Cancelled", "Completed"])

// Show only for Active bookings
ThisItem.Status.Value = "Active"
```

### Validation Patterns

**Required field validation**:
```powerFx
!IsBlank(txtField.Text)
```

**Numeric validation**:
```powerFx
IsNumeric(txtField.Text)
```

**Length validation**:
```powerFx
Len(txtField.Text) = 5
```

**Combined validation**:
```powerFx
!IsBlank(txtField.Text) && 
Len(txtField.Text) = 5 && 
IsNumeric(txtField.Text)
```

**Email validation** (basic):
```powerFx
!IsBlank(txtEmail.Text) && 
"@" in txtEmail.Text && 
"." in txtEmail.Text
```

### Performance Optimization Patterns

**Cache lookup results with With()**:
```powerFx
With({
    van: LookUp(Vans, ID = ThisItem.Van_ID.Id)
},
    van.Registration & " - " & van.Make & " " & van.Model
)
```

**Concurrent data loading**:
```powerFx
Concurrent(
    Refresh(Vans),
    Refresh(Bookings),
    Set(varCurrentUser, User())
)
```

**Limit gallery items**:
```powerFx
FirstN(
    Filter(Bookings, /* conditions */),
    100  // Limit to 100 items
)
```

**Use collections for static data**:
```powerFx
// In App.OnStart
ClearCollect(colStaticData,
    {Value: "Option1"},
    {Value: "Option2"}
);

// In control
Items: colStaticData
```

## Color Reference

### Primary Colors

```powerFx
// Microsoft Blue (primary actions)
RGBA(0, 120, 212, 1)

// White (text on blue, card backgrounds)
RGBA(255, 255, 255, 1)

// Light Gray (screen backgrounds)
RGBA(245, 245, 245, 1)

// Medium Gray (borders, secondary text)
RGBA(200, 200, 200, 1)

// Dark Gray (text)
RGBA(100, 100, 100, 1)

// Red (cancel, errors)
RGBA(244, 67, 54, 1)
```

### Status Colors

```powerFx
// Requested - Amber
RGBA(255, 193, 7, 1)

// Confirmed - Blue
RGBA(33, 150, 243, 1)

// Active - Orange
RGBA(255, 152, 0, 1)

// Completed - Green
RGBA(76, 175, 80, 1)

// Cancelled - Gray
RGBA(158, 158, 158, 1)
```

## Common Issues and Solutions

### Issue: Lookup column not saving

**Problem**: Van_ID not saving correctly

**Solution**: Use correct format with @odata.type
```powerFx
Van_ID: {
    '@odata.type': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
    Id: ddVan.Selected.ID,
    Value: ddVan.Selected.Registration
}
```

### Issue: Date/time not combining correctly

**Problem**: Date and time not merging properly

**Solution**: Use DateAdd with Hour and Minute
```powerFx
DateAdd(dtpDate.SelectedDate, 
        Hour(TimeValue(ddTime.Selected.Value)), Hours) + 
Minute(TimeValue(ddTime.Selected.Value))
```

### Issue: Delegation warning on gallery

**Problem**: Yellow warning on gallery Items property

**Solution**: For < 500 items, can be ignored. For larger datasets:
```powerFx
// Option 1: Use FirstN to limit
FirstN(Filter(Bookings, /* conditions */), 100)

// Option 2: Use SharePoint view
// Create view in SharePoint with filters, then:
'Bookings (ViewName)'
```

### Issue: Role detection not working

**Problem**: varIsFleetAdmin always false

**Solution**: Check email addresses match exactly
```powerFx
// Debug: Show current user email
lblDebug.Text: User().Email

// Ensure emails in list match exactly (case-sensitive)
Set(varIsFleetAdmin, 
    User().Email in [
        "admin@yourdomain.com",  // Must match exactly
        "fleetadmin@yourdomain.com"
    ]
);
```

### Issue: Booking disappears after creation

**Problem**: Booking created but then vanishes

**Cause**: Conflict detection flow deleted it

**Solution**: Check Error_Log in SharePoint for conflict details
```powerFx
// Add delay before navigation to allow flow to complete
If(!IsError(Bookings),
    Set(varErrorMessage, "");
    Refresh(Bookings);
    // Add 1 second delay
    Set(varWait, Now());
    While(DateDiff(varWait, Now(), Seconds) < 1, false);
    Navigate(scrHome, ScreenTransition.Fade);
    Notify("Booking created successfully!", NotificationType.Success)
)
```

## Best Practices

### Formula Organization

1. **Use variables for complex calculations**:
   ```powerFx
   // Good
   Set(varStartDateTime, DateAdd(...));
   Patch(Bookings, ..., {Start_DateTime: varStartDateTime})
   
   // Avoid
   Patch(Bookings, ..., {Start_DateTime: DateAdd(...)})
   ```

2. **Cache lookup results**:
   ```powerFx
   // Good
   With({van: LookUp(Vans, ...)}, van.Registration & van.Make)
   
   // Avoid
   LookUp(Vans, ...).Registration & LookUp(Vans, ...).Make
   ```

3. **Use meaningful variable names**:
   ```powerFx
   // Good
   Set(varIsFleetAdmin, ...)
   
   // Avoid
   Set(var1, ...)
   ```

### Performance

1. **Load data concurrently**:
   ```powerFx
   Concurrent(Refresh(Vans), Refresh(Bookings))
   ```

2. **Limit gallery items**:
   ```powerFx
   FirstN(Filter(...), 100)
   ```

3. **Use OnVisible instead of OnStart when possible**:
   ```powerFx
   // Screen.OnVisible (better)
   Refresh(Bookings)
   
   // App.OnStart (loads everything upfront)
   ```

### User Experience

1. **Provide clear feedback**:
   ```powerFx
   Notify("Booking created successfully!", NotificationType.Success)
   ```

2. **Disable buttons during validation**:
   ```powerFx
   DisplayMode: If(/* all valid */, DisplayMode.Edit, DisplayMode.Disabled)
   ```

3. **Show helpful error messages**:
   ```powerFx
   "⚠ Project ID must be exactly 5 digits"
   ```

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Related**: Task 3 Implementation Guide

