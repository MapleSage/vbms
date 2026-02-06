# Power Automate Flow: Check Booking Conflict

## Overview

This flow implements booking conflict detection to prevent double-booking of vans. It runs synchronously when a booking is created or modified, checking for time range overlaps with existing bookings for the same van.

**Flow Name**: Check Booking Conflict  
**Flow Type**: Automated Cloud Flow  
**Trigger**: When an item is created or modified (SharePoint)  
**Run Mode**: Synchronous (blocks until complete)  
**Requirements**: 3.4, 3.5, 3.9

## Flow Architecture

```
Trigger: Booking Created/Modified
    ↓
Get Current Booking Details
    ↓
Get All Active Bookings for Same Van
    ↓
Check for Time Range Overlaps
    ↓
    ├─→ Conflict Found
    │       ↓
    │   Delete New Booking
    │       ↓
    │   Return Error Response
    │
    └─→ No Conflict
            ↓
        Allow Booking to Proceed
            ↓
        Return Success Response
```

## Trigger Configuration

### SharePoint Trigger: When an item is created or modified

**Settings**:
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **Trigger Conditions**: None (runs for all creates/updates)
- **Run Mode**: Synchronous (critical for preventing race conditions)

**Trigger Outputs**:
- `triggerOutputs()?['body/ID']` - Booking ID
- `triggerOutputs()?['body/Van_ID/Id']` - Van ID (lookup)
- `triggerOutputs()?['body/Start_DateTime']` - Start date/time
- `triggerOutputs()?['body/End_DateTime']` - End date/time
- `triggerOutputs()?['body/Status']` - Booking status
- `triggerOutputs()?['body/Project_ID']` - Project ID
- `triggerOutputs()?['body/Driver_Name']` - Driver name

## Flow Steps

### Step 1: Initialize Variables

**Action**: Initialize variable  
**Purpose**: Store the current booking details for comparison

**Variables to Initialize**:

1. **varBookingID** (Integer)
   - Value: `triggerOutputs()?['body/ID']`

2. **varVanID** (Integer)
   - Value: `triggerOutputs()?['body/Van_ID/Id']`

3. **varStartDateTime** (String)
   - Value: `triggerOutputs()?['body/Start_DateTime']`

4. **varEndDateTime** (String)
   - Value: `triggerOutputs()?['body/End_DateTime']`

5. **varStatus** (String)
   - Value: `triggerOutputs()?['body/Status']`

6. **varConflictFound** (Boolean)
   - Value: `false`

7. **varConflictDetails** (String)
   - Value: `""`

### Step 2: Get Existing Bookings

**Action**: Get items (SharePoint)  
**Purpose**: Retrieve all bookings for the same van that could conflict

**Settings**:
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **Filter Query**: 
  ```
  Van_ID/Id eq @{variables('varVanID')} and 
  ID ne @{variables('varBookingID')} and 
  (Status eq 'Requested' or Status eq 'Confirmed' or Status eq 'Active')
  ```
- **Order By**: Start_DateTime ascending
- **Top Count**: 5000 (maximum)

**Filter Explanation**:
- Same Van_ID: Only check bookings for the same vehicle
- Exclude current booking: Don't compare booking to itself
- Active statuses only: Cancelled and Completed bookings don't cause conflicts

### Step 3: Check for Conflicts

**Action**: Apply to each  
**Purpose**: Loop through existing bookings and check for time overlaps

**Input**: `body('Get_items')?['value']`

**Inside the loop**:

#### Step 3.1: Parse Existing Booking Dates

**Action**: Compose (multiple)

1. **Existing Start**
   - Value: `items('Apply_to_each')?['Start_DateTime']`

2. **Existing End**
   - Value: `items('Apply_to_each')?['End_DateTime']`

#### Step 3.2: Check for Time Overlap

**Action**: Condition  
**Purpose**: Detect if time ranges overlap using the standard overlap formula

**Condition Logic**:
```
AND(
  @{variables('varStartDateTime')} < @{outputs('Existing_End')},
  @{variables('varEndDateTime')} > @{outputs('Existing_Start')}
)
```

**Overlap Formula Explanation**:
- New booking starts before existing booking ends: `new start < existing end`
- New booking ends after existing booking starts: `new end > existing start`
- Both conditions must be true for an overlap

**Examples**:
- ✅ Overlap: New [10:00-12:00], Existing [11:00-13:00] → Conflict
- ✅ Overlap: New [10:00-14:00], Existing [11:00-13:00] → Conflict (fully contains)
- ✅ Overlap: New [11:00-13:00], Existing [10:00-14:00] → Conflict (fully contained)
- ❌ No Overlap: New [10:00-11:00], Existing [11:00-12:00] → No conflict (adjacent)
- ❌ No Overlap: New [10:00-11:00], Existing [12:00-13:00] → No conflict (separate)

#### Step 3.3: If Conflict Found (Yes branch)

**Action 1**: Set variable (varConflictFound)
- Value: `true`

**Action 2**: Set variable (varConflictDetails)
- Value: 
  ```
  Booking conflict detected!
  
  Conflicting Booking ID: @{items('Apply_to_each')?['ID']}
  Driver: @{items('Apply_to_each')?['Driver_Name']}
  Project: @{items('Apply_to_each')?['Project_ID']}
  Start: @{items('Apply_to_each')?['Start_DateTime']}
  End: @{items('Apply_to_each')?['End_DateTime']}
  Status: @{items('Apply_to_each')?['Status']}
  
  This van is already booked during the requested time period.
  Please select a different time or van.
  ```

**Action 3**: Break (terminate loop)
- Purpose: Stop checking once first conflict is found

### Step 4: Handle Conflict Result

**Action**: Condition  
**Purpose**: Determine if conflict was found

**Condition**: `@{variables('varConflictFound')}` equals `true`

#### Step 4.1: If Conflict Found (Yes branch)

**Action 1**: Delete item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **ID**: `@{variables('varBookingID')}`
- **Purpose**: Remove the conflicting booking

**Action 2**: Create Audit Trail Record
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Audit_Trail
- **Fields**:
  - Entity_Type: `Booking`
  - Entity_ID: `@{variables('varBookingID')}`
  - Action: `Delete`
  - User: `@{triggerOutputs()?['body/Author/Email']}`
  - Timestamp: `@{utcNow()}`
  - Changed_Fields: `Conflict Detection`
  - Old_Values: `@{triggerOutputs()?['body']}`
  - New_Values: `Deleted due to conflict`

**Action 3**: Log Error
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Error_Log
- **Fields**:
  - Timestamp: `@{utcNow()}`
  - Component: `Booking`
  - Error_Type: `Conflict`
  - Error_Message: `@{variables('varConflictDetails')}`
  - User: `@{triggerOutputs()?['body/Author/Email']}`
  - Entity_Type: `Booking`
  - Entity_ID: `@{variables('varBookingID')}`
  - Resolved: `No`

**Action 4**: Terminate (with error)
- **Status**: Failed
- **Code**: `409`
- **Message**: `@{variables('varConflictDetails')}`

#### Step 4.2: If No Conflict (No branch)

**Action 1**: Create Audit Trail Record
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Audit_Trail
- **Fields**:
  - Entity_Type: `Booking`
  - Entity_ID: `@{variables('varBookingID')}`
  - Action: `@{if(equals(triggerOutputs()?['body/Created'], triggerOutputs()?['body/Modified']), 'Create', 'Update')}`
  - User: `@{triggerOutputs()?['body/Author/Email']}`
  - Timestamp: `@{utcNow()}`
  - Changed_Fields: `Conflict Check Passed`
  - Old_Values: `N/A`
  - New_Values: `@{triggerOutputs()?['body']}`

**Action 2**: Respond to PowerApp or Flow
- **Status Code**: `200`
- **Body**: 
  ```json
  {
    "success": true,
    "message": "Booking created successfully. No conflicts detected.",
    "bookingId": "@{variables('varBookingID')}",
    "vanId": "@{variables('varVanID')}",
    "startDateTime": "@{variables('varStartDateTime')}",
    "endDateTime": "@{variables('varEndDateTime')}"
  }
  ```

## Error Handling

### Try-Catch Scope

Wrap all actions in a scope with error handling:

**Scope**: Try
- Contains all flow steps above

**Scope**: Catch (runs if Try fails)

**Action 1**: Log System Error
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Error_Log
- **Fields**:
  - Timestamp: `@{utcNow()}`
  - Component: `Booking`
  - Error_Type: `System`
  - Error_Message: `Flow execution failed`
  - Stack_Trace: `@{result('Try')}`
  - User: `@{triggerOutputs()?['body/Author/Email']}`
  - Entity_Type: `Booking`
  - Entity_ID: `@{variables('varBookingID')}`
  - Resolved: `No`

**Action 2**: Terminate (with error)
- **Status**: Failed
- **Code**: `500`
- **Message**: `An error occurred while checking for booking conflicts. Please try again or contact support.`

## Configuration Settings

### Flow Settings

**General**:
- **Name**: Check Booking Conflict
- **Description**: Prevents double-booking by detecting time range overlaps
- **Solution**: VBMS (if using solutions)

**Run Mode**:
- **Asynchronous Pattern**: Off (must run synchronously)
- **High Performance**: On
- **Concurrency Control**: On
  - **Degree of Parallelism**: 1 (prevent race conditions)

**Retry Policy**:
- **Type**: Exponential
- **Count**: 3
- **Interval**: PT10S (10 seconds)
- **Minimum Interval**: PT10S
- **Maximum Interval**: PT1H

### Connection References

**SharePoint Connection**:
- **Authentication**: OAuth
- **Account**: Service account with Contribute permissions on all lists
- **Permissions Required**:
  - Read: Bookings, Vans
  - Write: Bookings (delete), Audit_Trail, Error_Log

## Testing

### Test Scenarios

#### Test 1: No Conflict - Separate Time Ranges
**Setup**:
- Existing booking: Van 1, 10:00-12:00, Status: Confirmed
- New booking: Van 1, 13:00-15:00, Status: Requested

**Expected Result**: ✅ Booking allowed, no conflict

#### Test 2: Conflict - Overlapping Time Ranges
**Setup**:
- Existing booking: Van 1, 10:00-14:00, Status: Confirmed
- New booking: Van 1, 12:00-16:00, Status: Requested

**Expected Result**: ❌ Booking rejected, conflict detected

#### Test 3: Conflict - Fully Contained
**Setup**:
- Existing booking: Van 1, 10:00-16:00, Status: Active
- New booking: Van 1, 12:00-14:00, Status: Requested

**Expected Result**: ❌ Booking rejected, conflict detected

#### Test 4: Conflict - Fully Contains
**Setup**:
- Existing booking: Van 1, 12:00-14:00, Status: Confirmed
- New booking: Van 1, 10:00-16:00, Status: Requested

**Expected Result**: ❌ Booking rejected, conflict detected

#### Test 5: No Conflict - Adjacent Times
**Setup**:
- Existing booking: Van 1, 10:00-12:00, Status: Confirmed
- New booking: Van 1, 12:00-14:00, Status: Requested

**Expected Result**: ✅ Booking allowed, no conflict (end time = start time is not an overlap)

#### Test 6: No Conflict - Different Van
**Setup**:
- Existing booking: Van 1, 10:00-14:00, Status: Confirmed
- New booking: Van 2, 10:00-14:00, Status: Requested

**Expected Result**: ✅ Booking allowed, different vans

#### Test 7: No Conflict - Cancelled Booking
**Setup**:
- Existing booking: Van 1, 10:00-14:00, Status: Cancelled
- New booking: Van 1, 10:00-14:00, Status: Requested

**Expected Result**: ✅ Booking allowed, cancelled bookings don't conflict

#### Test 8: Modification - No New Conflict
**Setup**:
- Existing booking A: Van 1, 10:00-12:00, Status: Confirmed
- Existing booking B: Van 1, 14:00-16:00, Status: Confirmed
- Modify booking A: Change end time to 13:00

**Expected Result**: ✅ Modification allowed, no conflict

#### Test 9: Modification - Creates Conflict
**Setup**:
- Existing booking A: Van 1, 10:00-12:00, Status: Confirmed
- Existing booking B: Van 1, 14:00-16:00, Status: Confirmed
- Modify booking A: Change end time to 15:00

**Expected Result**: ❌ Modification rejected, creates conflict with booking B

#### Test 10: Race Condition Prevention
**Setup**:
- Two users simultaneously create bookings for Van 1, 10:00-12:00

**Expected Result**: ✅ First booking succeeds, second booking rejected (concurrency control prevents race condition)

### Performance Testing

**Target**: Conflict check completes in < 1 second

**Test with**:
- 10 existing bookings: Should complete in < 500ms
- 100 existing bookings: Should complete in < 1 second
- 1000 existing bookings: Should complete in < 2 seconds

**Optimization**: Filter query limits results to same van and active statuses only

## Deployment

### Prerequisites

1. SharePoint site with Bookings, Audit_Trail, and Error_Log lists created
2. Service account with appropriate permissions
3. Power Automate license (Premium connector for SharePoint)

### Deployment Steps

1. **Create Flow**:
   - Go to Power Automate (flow.microsoft.com)
   - Create new automated cloud flow
   - Name: "Check Booking Conflict"

2. **Configure Trigger**:
   - Add SharePoint trigger: "When an item is created or modified"
   - Select your VBMS site and Bookings list
   - Set to run synchronously

3. **Add Actions**:
   - Follow the flow steps documented above
   - Configure all variables, conditions, and actions

4. **Configure Settings**:
   - Set concurrency control to 1
   - Enable retry policy
   - Configure error handling

5. **Test Flow**:
   - Run all test scenarios
   - Verify conflict detection works correctly
   - Check audit trail and error log entries

6. **Enable Flow**:
   - Turn on the flow
   - Monitor for first 24 hours

### Monitoring

**Key Metrics**:
- Flow run success rate: Target > 99%
- Average run duration: Target < 1 second
- Conflict detection accuracy: Target 100%

**Monitoring Actions**:
- Review Error_Log list daily
- Check flow run history for failures
- Monitor performance metrics

## Troubleshooting

### Issue: Flow times out

**Cause**: Too many existing bookings to check  
**Solution**: Add pagination or optimize filter query

### Issue: Race condition - two bookings created simultaneously

**Cause**: Concurrency control not set  
**Solution**: Set degree of parallelism to 1 in flow settings

### Issue: Conflict not detected

**Cause**: Incorrect overlap logic or filter query  
**Solution**: Verify filter query includes all active statuses, check overlap formula

### Issue: False positive - conflict detected when none exists

**Cause**: Incorrect date/time comparison  
**Solution**: Ensure date/time formats are consistent, check timezone handling

### Issue: Flow fails with permission error

**Cause**: Service account lacks permissions  
**Solution**: Grant Contribute permissions on Bookings, Audit_Trail, Error_Log lists

## Maintenance

### Regular Tasks

**Weekly**:
- Review Error_Log for conflict-related errors
- Check flow run history for failures

**Monthly**:
- Review performance metrics
- Optimize filter queries if needed
- Update documentation with any changes

### Updates

When updating the flow:
1. Create a copy of the existing flow
2. Make changes to the copy
3. Test thoroughly
4. Disable old flow
5. Enable new flow
6. Monitor for 24 hours
7. Delete old flow if successful

## Related Documentation

- **Requirements**: `.kiro/specs/van-booking-fleet-management/requirements.md` (3.4, 3.5, 3.9)
- **Design**: `.kiro/specs/van-booking-fleet-management/design.md` (Property 5: Booking Conflict Detection)
- **Tasks**: `.kiro/specs/van-booking-fleet-management/tasks.md` (Task 2)
- **SharePoint Setup**: `docs/SharePoint-Setup-Guide.md`

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024 | Initial implementation | VBMS Team |

---

**Status**: ✅ DOCUMENTED - Ready for Implementation  
**Next Step**: Create the flow in Power Automate following this documentation
