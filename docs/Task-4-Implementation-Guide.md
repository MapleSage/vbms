# Task 4 Implementation Guide: Booking Lifecycle Management

## Introduction

This guide provides step-by-step instructions for implementing Task 4: Booking Lifecycle Management. You will create a Power Automate flow that automatically transitions booking statuses based on time, ensuring bookings move from Confirmed to Active when their start time arrives, and from Active to Completed when their end time passes.

**Estimated Time**: 30-45 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: Task 1 (SharePoint setup) complete

## What You'll Build

A scheduled Power Automate flow that:
- Runs every 15 minutes automatically
- Finds Confirmed bookings where start time has arrived → Updates to Active
- Finds Active bookings where end time has passed → Updates to Completed
- Creates audit trail records for all transitions
- Logs errors for troubleshooting
- Tracks execution metrics

## Prerequisites

Before starting, ensure you have:

1. ✅ Completed Task 1 (SharePoint site and lists created)
2. ✅ Access to Power Automate (flow.microsoft.com)
3. ✅ Power Automate Premium license
4. ✅ Service account with Contribute permissions on:
   - Bookings list
   - Audit_Trail list
   - Error_Log list
5. ✅ Basic understanding of Power Automate flows

## Step-by-Step Implementation

### Part 1: Create the Flow (5 minutes)

#### Step 1.1: Navigate to Power Automate

1. Open your web browser
2. Go to https://flow.microsoft.com
3. Sign in with your service account
4. Click "My flows" in the left navigation

#### Step 1.2: Create New Scheduled Flow

1. Click "+ New flow" button
2. Select "Scheduled cloud flow"
3. In the dialog:
   - **Flow name**: `Booking Status Transitions`
   - **Starting**: Select today's date
   - **Repeat every**: `15` `Minute`
4. Click "Create"

#### Step 1.3: Configure Recurrence Trigger

1. The Recurrence trigger is automatically added
2. Click on the Recurrence trigger to expand settings
3. Configure:
   - **Interval**: 15
   - **Frequency**: Minute
   - **Time zone**: (UTC) Coordinated Universal Time
   - **Start time**: Leave as default or set to 00:00:00
4. Click outside to collapse

**Why UTC?** Using UTC timezone avoids daylight saving time issues and ensures consistent behavior across regions.

### Part 2: Initialize Variables (5 minutes)

#### Step 2.1: Add Current DateTime Variable

1. Click "+ New step"
2. Search for "Initialize variable"
3. Select "Initialize variable" action
4. Configure:
   - **Name**: `varCurrentDateTime`
   - **Type**: String
   - **Value**: Click in the field, then click "Expression" tab
   - Enter: `utcNow()`
   - Click "OK"

**Purpose**: Stores the current UTC time for all comparisons in the flow.

#### Step 2.2: Add Counter Variables

Repeat the following for each counter:

**Counter 1: Confirmed to Active**
1. Click "+ New step"
2. Search for "Initialize variable"
3. Configure:
   - **Name**: `varConfirmedToActiveCount`
   - **Type**: Integer
   - **Value**: `0`

**Counter 2: Active to Completed**
1. Click "+ New step"
2. Search for "Initialize variable"
3. Configure:
   - **Name**: `varActiveToCompletedCount`
   - **Type**: Integer
   - **Value**: `0`

**Counter 3: Errors**
1. Click "+ New step"
2. Search for "Initialize variable"
3. Configure:
   - **Name**: `varErrorCount`
   - **Type**: Integer
   - **Value**: `0`

**Purpose**: These counters track how many bookings are transitioned and how many errors occur.

### Part 3: Confirmed to Active Branch (10 minutes)

#### Step 3.1: Get Confirmed Bookings

1. Click "+ New step"
2. Search for "Get items"
3. Select "Get items" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Bookings
5. Click "Show advanced options"
6. Configure:
   - **Filter Query**: 
     ```
     Status eq 'Confirmed' and Start_DateTime le datetime'@{variables('varCurrentDateTime')}'
     ```
   - **Order By**: `Start_DateTime`
   - **Top Count**: `5000`

**Filter Explanation**:
- `Status eq 'Confirmed'`: Only get Confirmed bookings
- `Start_DateTime le datetime'...'`: Start time is less than or equal to now
- The `@{variables('varCurrentDateTime')}` inserts the current time

**How to enter the Filter Query**:
1. Click in the Filter Query field
2. Type: `Status eq 'Confirmed' and Start_DateTime le datetime'`
3. Click "Add dynamic content"
4. Search for and select "varCurrentDateTime"
5. Type the closing single quote: `'`

#### Step 3.2: Process Each Confirmed Booking

1. Click "+ New step"
2. Search for "Apply to each"
3. Select "Apply to each" action
4. Configure:
   - **Select an output from previous steps**: Click in field
   - Click "Add dynamic content"
   - Search for "value" from "Get items" action
   - Select "value"

**Purpose**: Loops through each Confirmed booking that needs to transition to Active.

#### Step 3.3: Add Try Scope

1. Inside the Apply to each, click "Add an action"
2. Search for "Scope"
3. Select "Scope" action
4. Click the "..." menu on the Scope
5. Select "Rename"
6. Name it: `Try Update to Active`

**Purpose**: Groups actions for error handling.

#### Step 3.4: Update Booking Status (Inside Try Scope)

1. Inside the Try scope, click "Add an action"
2. Search for "Update item"
3. Select "Update item" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Bookings
   - **Id**: Click field → Dynamic content → Search "ID" → Select "ID" from Apply to each
   - **Status Value**: `Active`

**Purpose**: Changes the booking status from Confirmed to Active.

#### Step 3.5: Create Audit Record (Inside Try Scope)

1. Inside the Try scope, click "Add an action"
2. Search for "Create item"
3. Select "Create item" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Audit_Trail
   - **Entity_Type Value**: `Booking`
   - **Entity_ID Value**: Click field → Dynamic content → Select "ID" from Apply to each
   - **Action Value**: `Status_Change`
   - **User Value**: `System`
   - **Timestamp**: Click field → Dynamic content → Select "varCurrentDateTime"
   - **Changed_Fields Value**: `{"Status": "Confirmed → Active"}`
   - **Old_Values Value**: 
     ```
     {"Status": "Confirmed", "Start_DateTime": "@{items('Apply_to_each')?['Start_DateTime']}"}
     ```
   - **New_Values Value**: 
     ```
     {"Status": "Active", "Transition_Time": "@{variables('varCurrentDateTime')}"}
     ```

**For Old_Values and New_Values**:
1. Click in the field
2. Switch to "Expression" tab
3. Copy and paste the expression above
4. Click "OK"

**Purpose**: Records the status change in the audit trail for compliance.

#### Step 3.6: Increment Success Counter (Inside Try Scope)

1. Inside the Try scope, click "Add an action"
2. Search for "Increment variable"
3. Select "Increment variable" action
4. Configure:
   - **Name**: varConfirmedToActiveCount
   - **Value**: `1`

**Purpose**: Tracks how many bookings were successfully transitioned.

#### Step 3.7: Add Catch Scope

1. Outside the Try scope (but still inside Apply to each), click "Add an action"
2. Search for "Scope"
3. Select "Scope" action
4. Rename it: `Catch Update to Active`
5. Click the "..." menu on the Catch scope
6. Select "Configure run after"
7. Check only "has failed" and "has timed out"
8. Click "Done"

**Purpose**: Handles errors if the update fails.

#### Step 3.8: Log Error (Inside Catch Scope)

1. Inside the Catch scope, click "Add an action"
2. Search for "Create item"
3. Select "Create item" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Error_Log
   - **Timestamp**: Expression: `utcNow()`
   - **Component Value**: `Booking`
   - **Error_Type Value**: `System`
   - **Error_Message Value**: `Failed to transition booking from Confirmed to Active`
   - **Stack_Trace Value**: Expression: `result('Try_Update_to_Active')`
   - **User Value**: `System`
   - **Entity_Type Value**: `Booking`
   - **Entity_ID Value**: Dynamic content → "ID" from Apply to each
   - **Resolved Value**: `No`

#### Step 3.9: Increment Error Counter (Inside Catch Scope)

1. Inside the Catch scope, click "Add an action"
2. Search for "Increment variable"
3. Select "Increment variable" action
4. Configure:
   - **Name**: varErrorCount
   - **Value**: `1`

### Part 4: Active to Completed Branch (10 minutes)

**Note**: This section is almost identical to Part 3, but for Active → Completed transitions.

#### Step 4.1: Get Active Bookings

1. Outside the Apply to each (at the main flow level), click "+ New step"
2. Search for "Get items"
3. Select "Get items" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Bookings
5. Click "Show advanced options"
6. Configure:
   - **Filter Query**: 
     ```
     Status eq 'Active' and End_DateTime lt datetime'@{variables('varCurrentDateTime')}'
     ```
   - **Order By**: `End_DateTime`
   - **Top Count**: `5000`

**Note the difference**: `lt` (less than) instead of `le` (less than or equal). We only complete bookings after the end time has passed, not at the exact end time.

#### Step 4.2: Process Each Active Booking

1. Click "+ New step"
2. Search for "Apply to each"
3. Select "Apply to each" action
4. Configure:
   - **Select an output**: Dynamic content → "value" from the second "Get items"

**Important**: Make sure you select "value" from the correct "Get items" action (the one for Active bookings).

#### Step 4.3: Add Try Scope

1. Inside the Apply to each, click "Add an action"
2. Search for "Scope"
3. Select "Scope" action
4. Rename it: `Try Update to Completed`

#### Step 4.4: Update Booking Status (Inside Try Scope)

1. Inside the Try scope, click "Add an action"
2. Search for "Update item"
3. Select "Update item" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Bookings
   - **Id**: Dynamic content → "ID" from the second Apply to each
   - **Status Value**: `Completed`

#### Step 4.5: Create Audit Record (Inside Try Scope)

1. Inside the Try scope, click "Add an action"
2. Search for "Create item"
3. Select "Create item" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Audit_Trail
   - **Entity_Type Value**: `Booking`
   - **Entity_ID Value**: Dynamic content → "ID" from second Apply to each
   - **Action Value**: `Status_Change`
   - **User Value**: `System`
   - **Timestamp**: Dynamic content → "varCurrentDateTime"
   - **Changed_Fields Value**: `{"Status": "Active → Completed"}`
   - **Old_Values Value**: 
     ```
     {"Status": "Active", "End_DateTime": "@{items('Apply_to_each_2')?['End_DateTime']}"}
     ```
   - **New_Values Value**: 
     ```
     {"Status": "Completed", "Transition_Time": "@{variables('varCurrentDateTime')}"}
     ```

**Note**: The Apply to each name might be "Apply_to_each_2" - adjust the expression accordingly.

#### Step 4.6: Increment Success Counter (Inside Try Scope)

1. Inside the Try scope, click "Add an action"
2. Search for "Increment variable"
3. Select "Increment variable" action
4. Configure:
   - **Name**: varActiveToCompletedCount
   - **Value**: `1`

#### Step 4.7: Add Catch Scope

1. Outside the Try scope (but inside Apply to each), click "Add an action"
2. Search for "Scope"
3. Select "Scope" action
4. Rename it: `Catch Update to Completed`
5. Configure run after: Check only "has failed" and "has timed out"

#### Step 4.8: Log Error (Inside Catch Scope)

1. Inside the Catch scope, click "Add an action"
2. Search for "Create item"
3. Select "Create item" (SharePoint)
4. Configure:
   - **Site Address**: Select your VBMS SharePoint site
   - **List Name**: Error_Log
   - **Timestamp**: Expression: `utcNow()`
   - **Component Value**: `Booking`
   - **Error_Type Value**: `System`
   - **Error_Message Value**: `Failed to transition booking from Active to Completed`
   - **Stack_Trace Value**: Expression: `result('Try_Update_to_Completed')`
   - **User Value**: `System`
   - **Entity_Type Value**: `Booking`
   - **Entity_ID Value**: Dynamic content → "ID" from second Apply to each
   - **Resolved Value**: `No`

#### Step 4.9: Increment Error Counter (Inside Catch Scope)

1. Inside the Catch scope, click "Add an action"
2. Search for "Increment variable"
3. Select "Increment variable" action
4. Configure:
   - **Name**: varErrorCount
   - **Value**: `1`

### Part 5: Configure Flow Settings (5 minutes)

#### Step 5.1: Save the Flow

1. Click "Save" button at the top
2. Wait for "Your flow is ready to go" message

#### Step 5.2: Configure Flow Settings

1. Click "..." menu next to flow name
2. Select "Settings"
3. Configure:
   - **Run only users**: Service account
   - **Concurrency Control**: Off (not needed for scheduled flows)
4. Click "Save"

#### Step 5.3: Configure Retry Policy

1. For each SharePoint action (Get items, Update item, Create item):
   - Click the "..." menu on the action
   - Select "Settings"
   - Configure:
     - **Timeout**: PT1M (1 minute)
     - **Retry Policy**: Exponential Interval
     - **Retry Count**: 3
     - **Retry Interval**: PT10S (10 seconds)
   - Click "Done"

**Note**: This is optional but recommended for production reliability.

### Part 6: Testing (10 minutes)

#### Step 6.1: Create Test Bookings

1. Go to your SharePoint site
2. Open the Bookings list
3. Create test booking 1:
   - Project_ID: 12345
   - Van_ID: Select any van
   - Driver_Name: Test Driver 1
   - Driver_Contact: test1@example.com
   - Start_DateTime: 2 hours ago
   - End_DateTime: 1 hour from now
   - Status: Confirmed
4. Create test booking 2:
   - Project_ID: 12346
   - Van_ID: Select any van
   - Driver_Name: Test Driver 2
   - Driver_Contact: test2@example.com
   - Start_DateTime: 3 hours ago
   - End_DateTime: 1 hour ago
   - Status: Active

#### Step 6.2: Run Flow Manually

1. Go back to Power Automate
2. Open your "Booking Status Transitions" flow
3. Click "Test" button
4. Select "Manually"
5. Click "Test"
6. Click "Run flow"
7. Click "Done"
8. Wait for flow to complete (should take < 10 seconds)

#### Step 6.3: Verify Results

1. Go to SharePoint Bookings list
2. Refresh the page
3. Verify:
   - ✅ Test booking 1 status changed to Active
   - ✅ Test booking 2 status changed to Completed

4. Go to Audit_Trail list
5. Verify:
   - ✅ Two new audit records created
   - ✅ One for Confirmed → Active transition
   - ✅ One for Active → Completed transition
   - ✅ Both have User = "System"
   - ✅ Both have correct timestamps

6. Go to Error_Log list
7. Verify:
   - ✅ No new error records (if test was successful)

#### Step 6.4: Check Flow Run History

1. In Power Automate, view the flow run
2. Verify:
   - ✅ All actions succeeded (green checkmarks)
   - ✅ Variables show correct counts
   - ✅ No errors in any action

### Part 7: Enable Scheduled Runs (2 minutes)

#### Step 7.1: Turn On the Flow

1. In Power Automate, open your flow
2. Click "Turn on" button at the top
3. Verify status shows "On"

#### Step 7.2: Verify Scheduled Runs

1. Wait 15 minutes
2. Go to flow run history
3. Verify:
   - ✅ Flow ran automatically
   - ✅ Run was successful
   - ✅ Timestamp shows it ran on schedule

## Troubleshooting

### Issue: Filter query error

**Symptom**: "Get items" action fails with filter query error

**Solution**:
1. Check filter query syntax carefully
2. Ensure single quotes around 'Confirmed' and 'Active'
3. Ensure datetime format: `datetime'@{variables('varCurrentDateTime')}'`
4. Verify column names match exactly (case-sensitive)

### Issue: Dynamic content not available

**Symptom**: Can't find "ID" or other fields in dynamic content

**Solution**:
1. Make sure you're inside the correct "Apply to each" loop
2. Look for "Current item" section in dynamic content
3. If still not visible, type the expression manually:
   - For first loop: `items('Apply_to_each')?['ID']`
   - For second loop: `items('Apply_to_each_2')?['ID']`

### Issue: Audit record creation fails

**Symptom**: Audit_Trail create action fails

**Solution**:
1. Verify Audit_Trail list exists
2. Check all column names match exactly
3. Verify service account has Contribute permissions
4. Check that Changed_Fields, Old_Values, New_Values are Multi-line Text columns

### Issue: Flow doesn't run on schedule

**Symptom**: No automatic runs after 15 minutes

**Solution**:
1. Verify flow is turned On
2. Check recurrence trigger is configured correctly
3. Verify service account credentials are valid
4. Check flow run history for errors

## Best Practices

### Do's ✅

- ✅ Use UTC timezone for consistency
- ✅ Test thoroughly before enabling scheduled runs
- ✅ Monitor flow run history regularly
- ✅ Review Error_Log list daily
- ✅ Use service account (not personal account)
- ✅ Document any customizations

### Don'ts ❌

- ❌ Don't use personal account for production flows
- ❌ Don't skip error handling
- ❌ Don't forget to test with real data
- ❌ Don't enable flow without testing
- ❌ Don't ignore errors in Error_Log
- ❌ Don't modify flow without testing changes

## Next Steps

After completing this implementation:

1. ✅ Complete the Task 4 Completion Checklist
2. ✅ Monitor flow for 24 hours
3. ✅ Proceed to Task 4.1: Write property test for time-based status transitions
4. ✅ Proceed to Task 4.2: Write unit tests for booking cancellation
5. ✅ Proceed to Task 5: Checkpoint - Verify core booking functionality

## Additional Resources

- **Flow Documentation**: `flows/Booking-Status-Transitions.md`
- **Task Summary**: `docs/Task-4-Summary.md`
- **Completion Checklist**: `docs/Task-4-Completion-Checklist.md`
- **Requirements**: `.kiro/specs/van-booking-fleet-management/requirements.md`
- **Design**: `.kiro/specs/van-booking-fleet-management/design.md`

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review the detailed flow documentation
3. Check Power Automate community forums
4. Contact VBMS implementation team

---

**Guide Status**: Ready for Use  
**Last Updated**: 2024  
**Version**: 1.0

**Congratulations!** You've successfully implemented booking lifecycle management. The flow will now automatically transition bookings every 15 minutes, ensuring accurate booking statuses throughout the system.
