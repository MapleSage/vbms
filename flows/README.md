# VBMS Power Automate Flows

## Overview

This directory contains documentation for all Power Automate flows used in the Van Booking & Fleet Management System (VBMS). Each flow is documented with complete configuration instructions, testing procedures, and troubleshooting guidance.

## About Power Automate Flows

Power Automate flows are cloud-based workflows that automate business processes. In VBMS, flows handle:
- Booking conflict detection
- Automatic status transitions
- Incident auto-assignment
- Notification delivery
- Audit trail creation
- Cost record auto-creation

## Flows in This Directory

### 1. Check Booking Conflict

**File**: `Check-Booking-Conflict.md`  
**Status**: ✅ Documented - Ready for Implementation  
**Task**: Task 2  
**Requirements**: 3.4, 3.5, 3.9

**Purpose**: Prevents double-booking of vans by detecting time range overlaps

**Key Features**:
- Runs synchronously when bookings are created or modified
- Checks for time range overlaps with existing bookings
- Rejects conflicting bookings with detailed error messages
- Creates audit trail for all operations
- Logs errors for troubleshooting
- Prevents race conditions with concurrency control

**When to Implement**: After Task 1 (SharePoint setup) is complete

**Estimated Implementation Time**: 45-60 minutes

**Related Documentation**:
- Implementation Guide: `docs/Task-2-Implementation-Guide.md`
- Completion Checklist: `docs/Task-2-Completion-Checklist.md`
- Summary: `docs/Task-2-Summary.md`

### 2. Booking Status Transitions

**File**: `Booking-Status-Transitions.md`  
**Status**: ✅ Documented - Ready for Implementation  
**Task**: Task 4  
**Requirements**: 4.2, 4.3, 4.4

**Purpose**: Automatically transitions booking statuses based on time

**Key Features**:
- Runs on schedule (every 15 minutes)
- Updates Confirmed bookings to Active when start time reached
- Updates Active bookings to Completed when end time passed
- Creates audit trail for all status changes
- Logs errors for troubleshooting
- Tracks execution metrics for monitoring

**When to Implement**: After Task 3 (Booking Management Power App) is complete

**Estimated Implementation Time**: 30-45 minutes

### 3. Incident Auto-Assignment (Future)

**Status**: 📋 Planned  
**Task**: Task 9  
**Requirements**: 7.2, 7.3, 7.4, 7.6, 7.7

**Purpose**: Automatically assigns incidents to drivers based on active bookings

**Key Features**:
- Runs when incident is created
- Finds active booking at incident timestamp
- Assigns incident to driver and project from booking
- Sets status to Assigned or Open based on booking existence

**When to Implement**: After Task 8 (Maintenance Scheduling) is complete

### 4. Maintenance Status Flows (Future)

**Status**: 📋 Planned  
**Task**: Task 8  
**Requirements**: 6.4, 6.5, 6.6, 6.8

**Purpose**: Updates vehicle status based on maintenance scheduling

**Key Features**:
- Marks vehicle Unavailable when maintenance scheduled
- Marks vehicle Available when maintenance completed
- Prevents bookings during maintenance periods

**When to Implement**: After Task 7 (Vehicle Profile Power App) is complete

### 5. Notification Flows (Future)

**Status**: 📋 Planned  
**Task**: Task 12  
**Requirements**: 9.1-9.12

**Purpose**: Sends automated email and Teams notifications

**Key Features**:
- Booking created/modified/cancelled notifications
- Booking reminder (24 hours before)
- Booking overdue notifications
- Vehicle status change notifications
- Compliance document expiry warnings
- Incident notifications

**When to Implement**: After Task 11 checkpoint is complete

### 6. Cost Auto-Creation Flows (Future)

**Status**: 📋 Planned  
**Task**: Task 10  
**Requirements**: 8.5, 8.6

**Purpose**: Automatically creates cost records from maintenance and incidents

**Key Features**:
- Creates cost record when maintenance is logged
- Creates cost record when incident is marked as Paid
- Links cost records to source entities

**When to Implement**: After Task 9 (Incident Management) is complete

### 7. Audit Trail Flows (Future)

**Status**: 📋 Planned  
**Task**: Task 13  
**Requirements**: 12.1, 12.2

**Purpose**: Creates comprehensive audit trail for all system changes

**Key Features**:
- Captures all create, update, delete operations
- Records user, timestamp, before/after values
- Separate flows for each entity type (Vans, Bookings, Maintenance, Incidents, Costs)

**When to Implement**: After Task 12 (Notification System) is complete

## Flow Documentation Structure

Each flow documentation file includes:

1. **Overview**: Purpose, requirements, and architecture
2. **Trigger Configuration**: How the flow is triggered
3. **Flow Steps**: Detailed step-by-step actions
4. **Variables**: All variables used in the flow
5. **Conditions**: Logic and decision points
6. **Error Handling**: Try-catch scopes and error logging
7. **Configuration Settings**: Concurrency, retry policy, etc.
8. **Testing**: Test scenarios and expected results
9. **Deployment**: Prerequisites and deployment steps
10. **Troubleshooting**: Common issues and solutions
11. **Monitoring**: Metrics and maintenance procedures

## Implementation Order

Flows should be implemented in this order:

1. ✅ **Check Booking Conflict** (Task 2) - Prevents double-booking
2. ✅ **Booking Status Transitions** (Task 4) - Automates status changes
3. **Maintenance Status Flows** (Task 8) - Manages vehicle availability
4. **Incident Auto-Assignment** (Task 9) - Assigns incidents to drivers
5. **Cost Auto-Creation Flows** (Task 10) - Creates cost records
6. **Notification Flows** (Task 12) - Sends notifications
7. **Audit Trail Flows** (Task 13) - Comprehensive audit logging

## Prerequisites

Before implementing any flow:

1. **SharePoint Site**: Task 1 must be completed
2. **Lists Created**: All required SharePoint lists must exist
3. **Permissions**: Service account with appropriate permissions
4. **License**: Power Automate Premium license (for SharePoint connector)
5. **Access**: Permissions to create flows in Power Automate

## General Flow Settings

All flows should use these standard settings:

### Concurrency Control

- **Enabled**: Yes (for flows that modify data)
- **Degree of Parallelism**: 1 (for conflict-sensitive flows)
- **Purpose**: Prevents race conditions

### Retry Policy

- **Type**: Exponential
- **Count**: 3
- **Interval**: PT10S (10 seconds)
- **Purpose**: Handles transient errors

### Error Handling

- **Try-Catch Scopes**: All flows should use try-catch
- **Error Logging**: Log to Error_Log list
- **User Messages**: Clear, actionable error messages

### Audit Trail

- **All Operations**: Create audit records
- **User Identity**: Capture user email
- **Timestamp**: Use UTC time
- **Before/After**: Store old and new values

## Testing Guidelines

### Test Each Flow

1. **Unit Testing**: Test individual actions
2. **Integration Testing**: Test with SharePoint lists
3. **End-to-End Testing**: Test complete workflows
4. **Performance Testing**: Verify speed targets
5. **Error Testing**: Test error handling
6. **Concurrency Testing**: Test with multiple users

### Test Scenarios

Each flow documentation includes:
- 5-10 test scenarios
- Expected results
- Verification steps
- Performance targets

### Test Environment

- Use separate SharePoint site for testing
- Populate with realistic test data
- Test with different user roles
- Test with concurrent operations

## Monitoring and Maintenance

### Daily Monitoring

- Check Error_Log for flow errors
- Review flow run history
- Monitor success rates
- Investigate failures

### Weekly Monitoring

- Review performance metrics
- Check audit trail completeness
- Verify all flows running correctly
- Update documentation if needed

### Monthly Maintenance

- Review error trends
- Optimize slow flows
- Apply flow updates
- Archive old error logs

## Troubleshooting

### Common Issues

1. **Flow doesn't trigger**:
   - Check flow is turned On
   - Verify trigger configuration
   - Check connection is valid
   - Wait 1-2 minutes for trigger delay

2. **Permission errors**:
   - Grant service account Contribute permissions
   - Reconnect SharePoint connection
   - Check list-level permissions

3. **Filter query errors**:
   - Verify OData syntax
   - Check column names (case-sensitive)
   - Test query in SharePoint list view

4. **Performance issues**:
   - Add indexes to queried columns
   - Optimize filter queries
   - Reduce data transfer
   - Consider pagination

5. **Race conditions**:
   - Enable concurrency control
   - Set degree of parallelism to 1
   - Use synchronous execution

### Getting Help

1. Check flow documentation troubleshooting section
2. Review Error_Log list for error details
3. Check flow run history for failure details
4. Consult Power Automate documentation
5. Contact VBMS implementation team

## Best Practices

### Flow Design

- **Keep it simple**: Avoid complex nested logic
- **Use variables**: Store values for reuse
- **Add comments**: Document complex logic
- **Use scopes**: Group related actions
- **Handle errors**: Always include error handling

### Performance

- **Filter early**: Limit data retrieved
- **Break loops**: Exit loops when condition met
- **Use indexes**: Query indexed columns
- **Minimize actions**: Reduce unnecessary steps
- **Batch operations**: Group similar actions

### Maintainability

- **Document everything**: Clear, comprehensive docs
- **Use naming conventions**: Consistent action names
- **Version control**: Track flow changes
- **Test thoroughly**: All scenarios before deployment
- **Monitor continuously**: Watch for issues

### Security

- **Least privilege**: Minimum required permissions
- **Audit everything**: Log all operations
- **Protect data**: No sensitive data in error messages
- **Validate input**: Check all user input
- **Secure connections**: Use service accounts

## Resources

### Microsoft Documentation

- [Power Automate Documentation](https://docs.microsoft.com/en-us/power-automate/)
- [SharePoint Connector Reference](https://docs.microsoft.com/en-us/connectors/sharepointonline/)
- [Flow Best Practices](https://docs.microsoft.com/en-us/power-automate/guidance/planning/best-practices)

### VBMS Documentation

- **Requirements**: `.kiro/specs/van-booking-fleet-management/requirements.md`
- **Design**: `.kiro/specs/van-booking-fleet-management/design.md`
- **Tasks**: `.kiro/specs/van-booking-fleet-management/tasks.md`
- **Implementation Guides**: `docs/Task-*-Implementation-Guide.md`
- **Completion Checklists**: `docs/Task-*-Completion-Checklist.md`

### Training Resources

- Power Automate Learning Path (Microsoft Learn)
- SharePoint Online Training (Microsoft Learn)
- VBMS User Documentation (to be created)

## Contributing

When adding new flow documentation:

1. Use the same structure as existing docs
2. Include all required sections
3. Provide comprehensive test scenarios
4. Add troubleshooting guidance
5. Update this README with flow details

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024 | Initial version with Check Booking Conflict flow | VBMS Team |
| 1.1 | 2024 | Added Booking Status Transitions flow documentation | VBMS Team |

---

**Directory Status**: 🚀 Active Development  
**Flows Documented**: 2 of 7  
**Flows Implemented**: 0 of 7  
**Next Flow**: Maintenance Status Flows (Task 8)
