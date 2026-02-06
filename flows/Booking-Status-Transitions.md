# Power Automate Flow: Booking Status Transitions

## Overview

This flow implements automatic booking lifecycle management by transitioning bookings through their lifecycle stages based on time. It runs on a scheduled basis (every 15 minutes) to update booking statuses from Confirmed to Active when the start time arrives, and from Active to Completed when the end time passes.

**Flow Name**: Booking Status Transitions  
**Flow Type**: Scheduled Cloud Flow  
**Trigger**: Recurrence (every 15 minutes)  
**Run Mode**: Asynchronous  
**Requirements**: 4.2, 4.3

## Flow Architecture

```
Trigger: Recurrence (Every 15 Minutes)
    ↓
Get Current DateTime
    ↓
┌─────────────────────────────────────────┐
│ Branch 1: Confirmed → Active            │
│   ↓                                     │
│ Get Confirmed Bookings (Start <= Now)   │
│   ↓                                     │
│ For Each Booking                        │
│   ↓                                     │
│ Update Status to Active                 │
│   ↓                                     │
│ Create Audit Trail Record               │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Branch 2: Active → Completed            │
│   ↓                                     │
│ Get Active Bookings (End < Now)         │
│   ↓                                     │
│ For Each Booking                        │
│   ↓                                     │
│ Update Status to Completed              │
│   ↓                                     │
│ Create Audit Trail Record               │
└─────────────────────────────────────────┘
    ↓
Log Completion Summary
```

## Trigger Configuration

### Recurrence Trigger

**Settings**:
- **Interval**: 15
- **Frequency**: Minute
- **Time Zone**: (UTC) Coordinated Universal Time
- **Start Time**: 00:00:00 (midnight)
- **Run Mode**: Asynchronous (non-blocking)

**Trigger Explanation**:
- Runs every 15 minutes to check for status transitions
- 15-minute interval balances timeliness with system load
- Ensures bookings transition within 15 minutes of their scheduled time
- Uses UTC timezone for consistency across regions

**Alternative Configurations**:
- **Every 5 minutes**: More responsive but higher system load
- **Every 30 minutes**: Lower load but less responsive
- **Every hour**: Minimal load but significant delays in status updates

## Flow Steps

### Step 1: Initialize Variables

**Action**: Initialize variable  
**Purpose**: Store current time and counters for tracking

**Variables to Initialize**:

1. **varCurrentDateTime** (String)
   - Value: `@{utcNow()}`
   - Purpose: Reference time for all comparisons

2. **varConfirmedToActiveCount** (Integer)
   - Value: `0`
   - Purpose: Count bookings transitioned from Confirmed to Active

3. **varActiveToCompletedCount** (Integer)
   - Value: `0`
   - Purpose: Count bookings transitioned from Active to Completed

4. **varErrorCount** (Integer)
   - Value: `0`
   - Purpose: Count errors encountered during processing

### Step 2: Transition Confirmed Bookings to Active

**Scope**: Confirmed to Active Transitions

#### Step 2.1: Get Confirmed Bookings Ready to Start

**Action**: Get items (SharePoint)  
**Purpose**: Retrieve all Confirmed bookings where start time has arrived

**Settings**:
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **Filter Query**: 
  ```
  Status eq 'Confirmed' and Start_DateTime le datetime'@{variables('varCurrentDateTime')}'
  ```
- **Order By**: Start_DateTime ascending
- **Top Count**: 5000 (maximum)

**Filter Explanation**:
- Status = 'Confirmed': Only process bookings in Confirmed status
- Start_DateTime <= Now: Start time has arrived or passed
- Results ordered by start time to process oldest first

#### Step 2.2: Process Each Confirmed Booking

**Action**: Apply to each  
**Purpose**: Loop through confirmed bookings and update status

**Input**: `body('Get_Confirmed_Bookings')?['value']`

**Inside the loop**:

##### Step 2.2.1: Try to Update Booking Status

**Scope**: Try Update to Active

**Action 1**: Update item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **ID**: `@{items('Apply_to_each_Confirmed')?['ID']}`
- **Fields**:
  - Status: `Active`

**Action 2**: Create Audit Trail Record
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Audit_Trail
- **Fields**:
  - Entity_Type: `Booking`
  - Entity_ID: `@{items('Apply_to_each_Confirmed')?['ID']}`
  - Action: `Status_Change`
  - User: `System`
  - Timestamp: `@{variables('varCurrentDateTime')}`
  - Changed_Fields: `{"Status": "Confirmed → Active"}`
  - Old_Values: `{"Status": "Confirmed", "Start_DateTime": "@{items('Apply_to_each_Confirmed')?['Start_DateTime']}"}`
  - New_Values: `{"Status": "Active", "Transition_Time": "@{variables('varCurrentDateTime')}"}`

**Action 3**: Increment Success Counter
- **Action**: Increment variable
- **Name**: varConfirmedToActiveCount
- **Value**: 1

##### Step 2.2.2: Catch Update Errors

**Scope**: Catch Update to Active (runs if Try fails)

**Action 1**: Log Error
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Error_Log
- **Fields**:
  - Timestamp: `@{utcNow()}`
  - Component: `Booking`
  - Error_Type: `System`
  - Error_Message: `Failed to transition booking from Confirmed to Active`
  - Stack_Trace: `@{result('Try_Update_to_Active')}`
  - User: `System`
  - Entity_Type: `Booking`
  - Entity_ID: `@{items('Apply_to_each_Confirmed')?['ID']}`
  - Resolved: `No`

**Action 2**: Increment Error Counter
- **Action**: Increment variable
- **Name**: varErrorCount
- **Value**: 1

### Step 3: Transition Active Bookings to Completed

**Scope**: Active to Completed Transitions

#### Step 3.1: Get Active Bookings That Have Ended

**Action**: Get items (SharePoint)  
**Purpose**: Retrieve all Active bookings where end time has passed

**Settings**:
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **Filter Query**: 
  ```
  Status eq 'Active' and End_DateTime lt datetime'@{variables('varCurrentDateTime')}'
  ```
- **Order By**: End_DateTime ascending
- **Top Count**: 5000 (maximum)

**Filter Explanation**:
- Status = 'Active': Only process bookings in Active status
- End_DateTime < Now: End time has passed (strictly less than, not equal)
- Results ordered by end time to process oldest first

#### Step 3.2: Process Each Active Booking

**Action**: Apply to each  
**Purpose**: Loop through active bookings and update status

**Input**: `body('Get_Active_Bookings')?['value']`

**Inside the loop**:

##### Step 3.2.1: Try to Update Booking Status

**Scope**: Try Update to Completed

**Action 1**: Update item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Bookings
- **ID**: `@{items('Apply_to_each_Active')?['ID']}`
- **Fields**:
  - Status: `Completed`

**Action 2**: Create Audit Trail Record
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Audit_Trail
- **Fields**:
  - Entity_Type: `Booking`
  - Entity_ID: `@{items('Apply_to_each_Active')?['ID']}`
  - Action: `Status_Change`
  - User: `System`
  - Timestamp: `@{variables('varCurrentDateTime')}`
  - Changed_Fields: `{"Status": "Active → Completed"}`
  - Old_Values: `{"Status": "Active", "End_DateTime": "@{items('Apply_to_each_Active')?['End_DateTime']}"}`
  - New_Values: `{"Status": "Completed", "Transition_Time": "@{variables('varCurrentDateTime')}"}`

**Action 3**: Increment Success Counter
- **Action**: Increment variable
- **Name**: varActiveToCompletedCount
- **Value**: 1

##### Step 3.2.2: Catch Update Errors

**Scope**: Catch Update to Completed (runs if Try fails)

**Action 1**: Log Error
- **Action**: Create item (SharePoint)
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Error_Log
- **Fields**:
  - Timestamp: `@{utcNow()}`
  - Component: `Booking`
  - Error_Type: `System`
  - Error_Message: `Failed to transition booking from Active to Completed`
  - Stack_Trace: `@{result('Try_Update_to_Completed')}`
  - User: `System`
  - Entity_Type: `Booking`
  - Entity_ID: `@{items('Apply_to_each_Active')?['ID']}`
  - Resolved: `No`

**Action 2**: Increment Error Counter
- **Action**: Increment variable
- **Name**: varErrorCount
- **Value**: 1

### Step 4: Log Completion Summary

**Action**: Create item (SharePoint)  
**Purpose**: Record flow execution summary for monitoring

**Settings**:
- **Site Address**: Your VBMS SharePoint site URL
- **List Name**: Flow_Execution_Log (create this list if it doesn't exist)
- **Fields**:
  - Flow_Name: `Booking Status Transitions`
  - Execution_Time: `@{variables('varCurrentDateTime')}`
  - Confirmed_To_Active: `@{variables('varConfirmedToActiveCount')}`
  - Active_To_Completed: `@{variables('varActiveToCompletedCount')}`
  - Errors: `@{variables('varErrorCount')}`
  - Status: `@{if(equals(variables('varErrorCount'), 0), 'Success', 'Completed with Errors')}`

**Note**: The Flow_Execution_Log list is optional but recommended for monitoring. Create it with these columns:
- Flow_Name (Single line of text)
- Execution_Time (Date and Time)
- Confirmed_To_Active (Number)
- Active_To_Completed (Number)
- Errors (Number)
- Status (Choice: Success, Completed with Errors, Failed)

## Error Handling

### Error Handling Strategy

**Individual Booking Errors**:
- Each booking update is wrapped in a try-catch scope
- Errors are logged to Error_Log list
- Flow continues processing remaining bookings
- Error counter tracks total failures

**Flow-Level Errors**:
- If entire flow fails, no status transitions occur
- Flow will retry on next scheduled run (15 minutes later)
- Critical errors should trigger admin notification

### Error Recovery

**Automatic Recovery**:
- Failed bookings will be retried on next flow run
- Filter queries ensure only eligible bookings are processed
- No risk of duplicate transitions (status check prevents re-processing)

**Manual Recovery**:
- Review Error_Log list for persistent failures
- Manually update booking status if needed
- Investigate root cause (permissions, data corruption, etc.)

## Configuration Settings

### Flow Settings

**General**:
- **Name**: Booking Status Transitions
- **Description**: Automatically transitions booking statuses based on time
- **Solution**: VBMS (if using solutions)

**Run Mode**:
- **Asynchronous Pattern**: On (non-blocking)
- **High Performance**: On
- **Concurrency Control**: Off (not needed for scheduled flow)

**Retry Policy**:
- **Type**: Exponential
- **Count**: 3
- **Interval**: PT5M (5 minutes)
- **Minimum Interval**: PT5M
- **Maximum Interval**: PT1H

### Connection References

**SharePoint Connection**:
- **Authentication**: OAuth
- **Account**: Service account with Contribute permissions on all lists
- **Permissions Required**:
  - Read: Bookings
  - Write: Bookings (update status), Audit_Trail, Error_Log, Flow_Execution_Log

## Testing

### Test Scenarios

#### Test 1: Confirmed to Active Transition
**Setup**:
- Create booking with Status: Confirmed, Start_DateTime: 2 hours ago
- Run flow manually

**Expected Result**: 
- ✅ Booking status updated to Active
- ✅ Audit trail record created
- ✅ Counter incremented

#### Test 2: Active to Completed Transition
**Setup**:
- Create booking with Status: Active, End_DateTime: 1 hour ago
- Run flow manually

**Expected Result**: 
- ✅ Booking status updated to Completed
- ✅ Audit trail record created
- ✅ Counter incremented

#### Test 3: Multiple Transitions in One Run
**Setup**:
- Create 3 bookings with Status: Confirmed, Start_DateTime: past
- Create 2 bookings with Status: Active, End_DateTime: past
- Run flow manually

**Expected Result**: 
- ✅ 3 bookings transitioned to Active
- ✅ 2 bookings transitioned to Completed
- ✅ 5 audit trail records created
- ✅ Counters show 3 and 2 respectively

#### Test 4: No Eligible Bookings
**Setup**:
- All bookings have future start times or are already Completed/Cancelled
- Run flow manually

**Expected Result**: 
- ✅ Flow completes successfully
- ✅ Counters show 0 transitions
- ✅ No errors logged

#### Test 5: Booking at Exact Start Time
**Setup**:
- Create booking with Status: Confirmed, Start_DateTime: exactly now
- Run flow manually

**Expected Result**: 
- ✅ Booking transitioned to Active (Start_DateTime <= Now includes equal)

#### Test 6: Booking at Exact End Time
**Setup**:
- Create booking with Status: Active, End_DateTime: exactly now
- Run flow manually

**Expected Result**: 
- ❌ Booking NOT transitioned (End_DateTime < Now excludes equal)
- ✅ Will transition on next run (15 minutes later)

#### Test 7: Error Handling - Invalid Booking ID
**Setup**:
- Manually corrupt a booking record (invalid data)
- Run flow manually

**Expected Result**: 
- ✅ Error logged to Error_Log
- ✅ Error counter incremented
- ✅ Other bookings still processed

#### Test 8: Scheduled Run
**Setup**:
- Enable flow
- Wait for scheduled run (every 15 minutes)

**Expected Result**: 
- ✅ Flow runs automatically
- ✅ Eligible bookings transitioned
- ✅ Execution log created

#### Test 9: Timezone Handling
**Setup**:
- Create booking with Start_DateTime in different timezone
- Ensure UTC conversion is correct

**Expected Result**: 
- ✅ Transition occurs at correct UTC time
- ✅ No premature or delayed transitions

#### Test 10: Large Volume
**Setup**:
- Create 100 bookings eligible for transition
- Run flow manually

**Expected Result**: 
- ✅ All 100 bookings processed
- ✅ Flow completes in < 2 minutes
- ✅ All audit records created

### Performance Testing

**Target**: Flow completes in < 2 minutes for typical load

**Test with**:
- 10 bookings to transition: Should complete in < 10 seconds
- 50 bookings to transition: Should complete in < 30 seconds
- 100 bookings to transition: Should complete in < 1 minute
- 500 bookings to transition: Should complete in < 2 minutes

**Optimization**: Use parallel processing for Apply to each loops if performance is insufficient

## Deployment

### Prerequisites

1. SharePoint site with Bookings, Audit_Trail, and Error_Log lists created
2. (Optional) Flow_Execution_Log list for monitoring
3. Service account with appropriate permissions
4. Power Automate license (Premium connector for SharePoint)

### Deployment Steps

1. **Create Flow**:
   - Go to Power Automate (flow.microsoft.com)
   - Create new scheduled cloud flow
   - Name: "Booking Status Transitions"
   - Recurrence: Every 15 minutes

2. **Configure Trigger**:
   - Set interval to 15 minutes
   - Set timezone to UTC
   - Set start time to midnight

3. **Add Actions**:
   - Follow the flow steps documented above
   - Configure all variables, queries, and actions
   - Add error handling scopes

4. **Configure Settings**:
   - Enable retry policy
   - Configure error handling
   - Set high performance mode

5. **Test Flow**:
   - Create test bookings with past start/end times
   - Run flow manually
   - Verify status transitions work correctly
   - Check audit trail and error log entries

6. **Enable Flow**:
   - Turn on the flow
   - Monitor for first 24 hours
   - Verify scheduled runs occur every 15 minutes

### Monitoring

**Key Metrics**:
- Flow run success rate: Target > 99%
- Average run duration: Target < 1 minute
- Transition accuracy: Target 100%
- Average transition delay: Target < 15 minutes

**Monitoring Actions**:
- Review Flow_Execution_Log list daily
- Check Error_Log list for failures
- Monitor flow run history for errors
- Verify bookings transition within 15 minutes of scheduled time

**Alerts to Configure**:
- Flow run failure (send email to admins)
- Error count > 5 in single run (send email to admins)
- Flow hasn't run in > 30 minutes (send email to admins)

## Troubleshooting

### Issue: Flow times out

**Cause**: Too many bookings to process in single run  
**Solution**: 
- Enable parallel processing in Apply to each loops
- Increase timeout limit in flow settings
- Consider reducing recurrence interval to process smaller batches

### Issue: Bookings not transitioning

**Cause**: Filter query not matching bookings  
**Solution**: 
- Verify datetime format in filter query
- Check timezone settings (should be UTC)
- Manually run flow and check query results

### Issue: Duplicate transitions

**Cause**: Flow running multiple times simultaneously  
**Solution**: 
- Verify concurrency control is off (not needed for scheduled flows)
- Check flow run history for overlapping runs
- Ensure recurrence interval is longer than typical run duration

### Issue: Transitions delayed by more than 15 minutes

**Cause**: Flow not running on schedule  
**Solution**: 
- Check flow is enabled
- Verify recurrence trigger is configured correctly
- Check for flow run failures in history
- Ensure service account has valid credentials

### Issue: Audit trail records not created

**Cause**: Permission error or list doesn't exist  
**Solution**: 
- Verify Audit_Trail list exists
- Grant service account Contribute permissions
- Check error log for specific error messages

### Issue: Flow fails with permission error

**Cause**: Service account lacks permissions  
**Solution**: 
- Grant Contribute permissions on Bookings, Audit_Trail, Error_Log lists
- Verify service account credentials are valid
- Check SharePoint site permissions

## Maintenance

### Regular Tasks

**Daily**:
- Review Flow_Execution_Log for errors
- Check Error_Log for persistent failures
- Verify bookings are transitioning on schedule

**Weekly**:
- Review flow run history for failures
- Check performance metrics
- Verify audit trail completeness

**Monthly**:
- Review and optimize filter queries if needed
- Update documentation with any changes
- Archive old Flow_Execution_Log entries

### Updates

When updating the flow:
1. Create a copy of the existing flow
2. Make changes to the copy
3. Test thoroughly with manual runs
4. Disable old flow
5. Enable new flow
6. Monitor for 24 hours
7. Delete old flow if successful

## Business Logic Details

### Status Transition Rules

**Confirmed → Active**:
- **Trigger**: Start_DateTime <= Current Time
- **Condition**: Status must be exactly "Confirmed"
- **Effect**: Status changes to "Active"
- **Timing**: Within 15 minutes of start time
- **Reversible**: No (manual intervention required)

**Active → Completed**:
- **Trigger**: End_DateTime < Current Time (strictly less than)
- **Condition**: Status must be exactly "Active"
- **Effect**: Status changes to "Completed"
- **Timing**: Within 15 minutes of end time
- **Reversible**: No (terminal state)

### Edge Cases

**Booking starts and ends within 15-minute window**:
- First run: Confirmed → Active
- Second run (15 min later): Active → Completed
- Result: Booking may be Active for only 15 minutes even if actual duration was shorter

**Booking created with past start time**:
- If created as Confirmed with Start_DateTime in past
- Next flow run will immediately transition to Active
- This is expected behavior for backdated bookings

**Booking cancelled after start time**:
- Status changes to Cancelled (manual action)
- Flow will not process Cancelled bookings
- No automatic transition to Active or Completed

**System clock changes**:
- Flow uses UTC time to avoid DST issues
- If system clock is adjusted, transitions may occur early/late
- Audit trail records actual transition time for troubleshooting

### Audit Trail Format

**Confirmed → Active Audit Record**:
```json
{
  "Entity_Type": "Booking",
  "Entity_ID": "123",
  "Action": "Status_Change",
  "User": "System",
  "Timestamp": "2024-01-15T10:15:00Z",
  "Changed_Fields": "{\"Status\": \"Confirmed → Active\"}",
  "Old_Values": "{\"Status\": \"Confirmed\", \"Start_DateTime\": \"2024-01-15T10:00:00Z\"}",
  "New_Values": "{\"Status\": \"Active\", \"Transition_Time\": \"2024-01-15T10:15:00Z\"}"
}
```

**Active → Completed Audit Record**:
```json
{
  "Entity_Type": "Booking",
  "Entity_ID": "123",
  "Action": "Status_Change",
  "User": "System",
  "Timestamp": "2024-01-15T14:15:00Z",
  "Changed_Fields": "{\"Status\": \"Active → Completed\"}",
  "Old_Values": "{\"Status\": \"Active\", \"End_DateTime\": \"2024-01-15T14:00:00Z\"}",
  "New_Values": "{\"Status\": \"Completed\", \"Transition_Time\": \"2024-01-15T14:15:00Z\"}"
}
```

## Integration Points

### Upstream Dependencies

**Booking Creation**:
- Bookings must be created with Status = "Requested" or "Confirmed"
- Start_DateTime and End_DateTime must be valid
- This flow assumes bookings are already validated

**Manual Status Changes**:
- Fleet Admins may manually change status to Confirmed
- This flow will then handle automatic transitions
- Manual changes to Active or Completed bypass this flow

### Downstream Dependencies

**Notification Flows**:
- Booking Reminder flow checks for Confirmed bookings 24 hours before start
- Booking Overdue flow checks for Active bookings past end time
- These flows depend on accurate status transitions

**Vehicle Status Updates**:
- Vehicle status (Available/Booked/Active) may depend on booking status
- Ensure vehicle status logic accounts for automatic transitions

**Reporting**:
- Utilization reports depend on accurate booking statuses
- Ensure reports use Completed status to calculate actual usage

## Performance Optimization

### Query Optimization

**Indexed Columns**:
- Ensure Start_DateTime and End_DateTime are indexed
- Ensure Status column is indexed
- This improves filter query performance

**Filter Query Best Practices**:
- Use specific status values (avoid "not equal")
- Use datetime comparison operators (le, lt, ge, gt)
- Order results to process oldest first

### Parallel Processing

**Apply to Each Settings**:
- Enable "Concurrency Control" in Apply to each loops
- Set "Degree of Parallelism" to 10-20 for faster processing
- Monitor for race conditions if enabled

**Batch Processing**:
- Consider processing in batches of 100 bookings
- Use pagination if more than 5000 bookings need transition
- Implement batch processing if performance is insufficient

## Security Considerations

### Service Account

**Permissions Required**:
- Read access to Bookings list
- Write access to Bookings list (update status only)
- Write access to Audit_Trail list
- Write access to Error_Log list
- Write access to Flow_Execution_Log list (if used)

**Best Practices**:
- Use dedicated service account (not personal account)
- Grant minimum required permissions
- Rotate credentials regularly
- Monitor service account activity

### Data Privacy

**Audit Trail**:
- Audit records contain booking details
- Ensure Audit_Trail list has appropriate permissions
- Consider data retention policies

**Error Logs**:
- Error logs may contain sensitive booking information
- Restrict access to Fleet Administrators only
- Implement log retention and cleanup

## Compliance and Audit

### Audit Requirements

**Requirement 4.4**: "When a booking status changes automatically, the system shall record the change in the Audit_Trail"

**Compliance**:
- ✅ Every status transition creates an audit record
- ✅ Audit record includes old and new status
- ✅ Audit record includes timestamp and user (System)
- ✅ Audit record includes booking ID for traceability

**Verification**:
- Query Audit_Trail for Action = "Status_Change" and User = "System"
- Verify count matches booking transitions
- Verify all required fields are populated

### Regulatory Compliance

**Data Retention**:
- Audit trail records should be retained per organizational policy
- Consider archiving old audit records (e.g., after 7 years)
- Ensure archived records remain accessible for compliance

**Change Tracking**:
- All status changes are tracked with timestamp
- System user is identified as "System" for automatic changes
- Manual changes are tracked with actual user identity

## Related Documentation

- **Requirements**: `.kiro/specs/van-booking-fleet-management/requirements.md` (4.2, 4.3, 4.4)
- **Design**: `.kiro/specs/van-booking-fleet-management/design.md` (Property 8: Time-Based Booking Status Transitions)
- **Tasks**: `.kiro/specs/van-booking-fleet-management/tasks.md` (Task 4)
- **SharePoint Setup**: `docs/SharePoint-Setup-Guide.md`
- **Related Flows**: 
  - `flows/Check-Booking-Conflict.md` (Booking creation)
  - `flows/Booking-Reminder-Notification.md` (Depends on Confirmed status)
  - `flows/Booking-Overdue-Notification.md` (Depends on Active status)

## Frequently Asked Questions

### Q: Why every 15 minutes instead of real-time?

**A**: Real-time triggers (when item is modified) would require external system to update bookings at exact start/end times. Scheduled flow is simpler and more reliable. 15 minutes balances responsiveness with system load.

### Q: What happens if a booking is manually changed to Active before start time?

**A**: The flow will not change it back. Manual status changes take precedence. The booking will transition to Completed normally when end time passes.

### Q: Can I change the recurrence interval?

**A**: Yes, but consider the trade-offs:
- Shorter interval (5 min): More responsive but higher load
- Longer interval (30 min): Lower load but less responsive
- 15 minutes is recommended balance

### Q: What if the flow fails to run?

**A**: Bookings will remain in their current status until the next successful run. The flow will catch up on next run since it queries all eligible bookings, not just new ones.

### Q: How do I know if the flow is working correctly?

**A**: 
1. Check Flow_Execution_Log for recent runs
2. Review flow run history in Power Automate
3. Verify bookings are transitioning within 15 minutes
4. Check Error_Log for any failures

### Q: Can bookings skip statuses (e.g., Requested → Active)?

**A**: No, this flow only handles Confirmed → Active and Active → Completed. Bookings must be manually changed from Requested to Confirmed first.

### Q: What happens during daylight saving time changes?

**A**: Flow uses UTC time, which doesn't observe DST. All transitions are based on UTC, avoiding DST-related issues.

### Q: How do I test the flow without waiting for scheduled runs?

**A**: Use the "Test" button in Power Automate to run the flow manually. Create test bookings with past start/end times to trigger transitions immediately.

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024 | Initial implementation | VBMS Team |

---

**Status**: ✅ DOCUMENTED - Ready for Implementation  
**Next Step**: Create the flow in Power Automate following this documentation

## Implementation Checklist

Use this checklist when implementing the flow:

- [ ] Create scheduled cloud flow with 15-minute recurrence
- [ ] Configure UTC timezone
- [ ] Initialize all variables (varCurrentDateTime, counters)
- [ ] Add "Get Confirmed Bookings" action with correct filter
- [ ] Add "Apply to each" loop for Confirmed bookings
- [ ] Add try-catch scope for Confirmed → Active updates
- [ ] Add update action to change status to Active
- [ ] Add audit trail creation for Confirmed → Active
- [ ] Add error logging for failed updates
- [ ] Add "Get Active Bookings" action with correct filter
- [ ] Add "Apply to each" loop for Active bookings
- [ ] Add try-catch scope for Active → Completed updates
- [ ] Add update action to change status to Completed
- [ ] Add audit trail creation for Active → Completed
- [ ] Add error logging for failed updates
- [ ] Add execution summary logging (optional)
- [ ] Configure retry policy (3 attempts, exponential backoff)
- [ ] Test with manual run and test bookings
- [ ] Verify audit trail records are created
- [ ] Verify error handling works correctly
- [ ] Enable flow and monitor for 24 hours
- [ ] Document any customizations or deviations

## Quick Reference

**Filter Query - Confirmed to Active**:
```
Status eq 'Confirmed' and Start_DateTime le datetime'@{variables('varCurrentDateTime')}'
```

**Filter Query - Active to Completed**:
```
Status eq 'Active' and End_DateTime lt datetime'@{variables('varCurrentDateTime')}'
```

**Audit Trail Fields**:
- Entity_Type: `Booking`
- Action: `Status_Change`
- User: `System`
- Changed_Fields: `{"Status": "Old → New"}`

**Error Log Fields**:
- Component: `Booking`
- Error_Type: `System`
- User: `System`
- Entity_Type: `Booking`
