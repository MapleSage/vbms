# Task 1 Completion Checklist: SharePoint Site and Core Data Structures

## Overview

This checklist helps verify that Task 1 (Set up SharePoint site and core data structures) has been completed successfully for the Van Booking & Fleet Management System (VBMS).

## Prerequisites Verification

- [ ] Microsoft 365 tenant with SharePoint Online
- [ ] Site Collection Administrator or Global Administrator permissions
- [ ] PnP PowerShell module installed (`Install-Module PnP.PowerShell`)
- [ ] SharePoint site created at: `https://[tenant].sharepoint.com/sites/vbms`

## Setup Execution

### Option A: Automated Setup (Recommended)

- [ ] Ran `Setup-VBMSSharePointSite.ps1` script successfully
- [ ] Ran `Configure-VBMSPermissions.ps1` script successfully
- [ ] Ran `Validate-VBMSSetup.ps1` script with 100% pass rate
- [ ] Reviewed and addressed any warnings from validation script

### Option B: Manual Setup

- [ ] Created all 8 lists/libraries manually
- [ ] Added all required columns to each list
- [ ] Configured all column settings (required, indexed, unique, validation)
- [ ] Enabled versioning where required
- [ ] Enabled attachments where required
- [ ] Created SharePoint groups
- [ ] Configured permissions

## Data Structures Verification

### 1. Vans List

- [ ] List exists and is accessible
- [ ] Van_ID column (Text, Required, Indexed, Unique)
- [ ] Registration column (Text, Required, Indexed, Unique)
- [ ] Make column (Text, Required)
- [ ] Model column (Text, Required)
- [ ] Year column (Number, Required)
- [ ] VIN column (Text)
- [ ] Tier column (Choice: Standard, Premium, Specialized)
- [ ] Type column (Choice: Cargo, Passenger, Refrigerated)
- [ ] Daily_Rate column (Currency, Required)
- [ ] Mileage_Rate column (Currency, Required)
- [ ] Status column (Choice: Available, Booked, Active, Unavailable, Inactive)
- [ ] Configuration column (Multi-line text)
- [ ] Accessories column (Multi-line text)
- [ ] Versioning enabled (50 versions)

### 2. Van Documents Library

- [ ] Library exists and is accessible
- [ ] Van_ID column (Lookup to Vans list, Required)
- [ ] Document_Type column (Choice: Insurance, Registration, Inspection)
- [ ] Expiry_Date column (Date, Required)
- [ ] File upload functionality works

### 3. Bookings List

- [ ] List exists and is accessible
- [ ] Booking_ID column (Text, Indexed)
- [ ] Project_ID column (Text, Required, Indexed, Validation: 5 digits)
- [ ] Van_ID column (Lookup to Vans list, Required, Indexed)
- [ ] Driver_Name column (Text, Required)
- [ ] Driver_Contact column (Text, Required)
- [ ] Start_DateTime column (DateTime, Required, Indexed)
- [ ] End_DateTime column (DateTime, Required, Indexed)
- [ ] Status column (Choice: Requested, Confirmed, Active, Completed, Cancelled)
- [ ] Versioning enabled (50 versions)
- [ ] Project_ID validation formula works: `=AND(LEN([Project_ID])=5,ISNUMBER(VALUE([Project_ID])))`

### 4. Maintenance List

- [ ] List exists and is accessible
- [ ] Maintenance_ID column (Text, Indexed)
- [ ] Van_ID column (Lookup to Vans list, Required)
- [ ] Scheduled_Date column (DateTime, Required)
- [ ] Completed_Date column (DateTime)
- [ ] Description column (Multi-line text, Required)
- [ ] Cost column (Currency)
- [ ] Vendor column (Text)
- [ ] Maintenance_Type column (Choice: Date-based, Usage-based)
- [ ] Attachments enabled

### 5. Incidents List

- [ ] List exists and is accessible
- [ ] Incident_ID column (Text, Indexed)
- [ ] Van_ID column (Lookup to Vans list, Required)
- [ ] Incident_DateTime column (DateTime, Required, Indexed)
- [ ] Incident_Type column (Choice: Fine, Accident, Damage, Other)
- [ ] Description column (Multi-line text, Required)
- [ ] Amount column (Currency)
- [ ] Assigned_Driver column (Text)
- [ ] Assigned_Project_ID column (Text)
- [ ] Status column (Choice: Open, Assigned, Paid, Resolved, Disputed)
- [ ] Attachments enabled

### 6. Costs List

- [ ] List exists and is accessible
- [ ] Cost_ID column (Text, Indexed)
- [ ] Van_ID column (Lookup to Vans list, Required)
- [ ] Project_ID column (Text, Required, Indexed, Validation: 5 digits)
- [ ] Driver column (Text)
- [ ] Cost_Type column (Choice: Fuel, Tolls, Maintenance, Fine)
- [ ] Amount column (Currency, Required)
- [ ] Date column (Date, Required)
- [ ] Description column (Multi-line text)
- [ ] Source_ID column (Text)
- [ ] Project_ID validation formula works: `=AND(LEN([Project_ID])=5,ISNUMBER(VALUE([Project_ID])))`

### 7. Audit_Trail List

- [ ] List exists and is accessible
- [ ] Audit_ID column (Text, Indexed)
- [ ] Entity_Type column (Choice: Van, Booking, Maintenance, Incident, Cost)
- [ ] Entity_ID column (Text, Required, Indexed)
- [ ] Action column (Choice: Create, Update, Delete, Status_Change)
- [ ] User column (Person, Required)
- [ ] Timestamp column (DateTime, Required)
- [ ] Changed_Fields column (Multi-line text)
- [ ] Old_Values column (Multi-line text)
- [ ] New_Values column (Multi-line text)
- [ ] Permissions configured to prevent deletion and modification by non-admins

### 8. Error_Log List

- [ ] List exists and is accessible
- [ ] Error_ID column (Text, Indexed)
- [ ] Timestamp column (DateTime, Required)
- [ ] Component column (Choice: Booking, Maintenance, Incident, Cost, Notification, Calendar)
- [ ] Error_Type column (Choice: Validation, Conflict, Authorization, NotFound, System)
- [ ] Error_Message column (Multi-line text, Required)
- [ ] Stack_Trace column (Multi-line text)
- [ ] User column (Person)
- [ ] Entity_Type column (Text)
- [ ] Entity_ID column (Text)
- [ ] Resolved column (Yes/No)
- [ ] Resolution_Notes column (Multi-line text)

## Permissions Configuration

### SharePoint Groups

- [ ] "VBMS Project Representatives" group created
- [ ] "VBMS Fleet Administrators" group created
- [ ] "VBMS Finance Managers" group created
- [ ] Users added to appropriate groups

### Site-Level Permissions

- [ ] Fleet Administrators have Full Control
- [ ] Project Representatives have Contribute
- [ ] Finance Managers have Read

### List-Level Permissions

- [ ] Bookings list: Item-level permissions configured (users can only edit own items)
- [ ] Audit_Trail list: Read-only for all except system/admins
- [ ] All other lists inherit site permissions

## Validation Testing

### Unique Constraints

- [ ] Tested: Cannot create van with duplicate Van_ID (should fail)
- [ ] Tested: Cannot create van with duplicate Registration (should fail)
- [ ] Tested: Can create van with unique Van_ID and Registration (should succeed)

### Column Validation

- [ ] Tested: Cannot create booking with Project_ID "123" (should fail - not 5 digits)
- [ ] Tested: Cannot create booking with Project_ID "ABCDE" (should fail - not numeric)
- [ ] Tested: Can create booking with Project_ID "12345" (should succeed)
- [ ] Tested: Same validation works for Costs list

### Lookup Columns

- [ ] Tested: Van_ID lookup in Bookings shows available vans
- [ ] Tested: Van_ID lookup in Maintenance shows available vans
- [ ] Tested: Van_ID lookup in Incidents shows available vans
- [ ] Tested: Van_ID lookup in Costs shows available vans
- [ ] Tested: Van_ID lookup in Van Documents shows available vans

### Versioning

- [ ] Tested: Creating/editing van record creates version history
- [ ] Tested: Creating/editing booking record creates version history
- [ ] Tested: Version history is accessible and shows changes

### Attachments

- [ ] Tested: Can attach files to Maintenance records
- [ ] Tested: Can attach files to Incidents records

## Sample Data Testing

### Test Van Record

- [ ] Created test van with all required fields
- [ ] Van appears in all lookup dropdowns
- [ ] Van can be edited and version history is created

### Test Booking Record

- [ ] Created test booking with valid data
- [ ] Booking appears in Bookings list
- [ ] Status defaults to "Requested"
- [ ] Version history is created

### Test Document

- [ ] Uploaded test document to Van Documents library
- [ ] Document is linked to test van
- [ ] Expiry date is set correctly

## Requirements Validation

This task validates the following requirements:

- [ ] **Requirement 13.1**: Van Master data stored in SharePoint List
- [ ] **Requirement 13.2**: Booking data stored in SharePoint List
- [ ] **Requirement 13.3**: Incident data stored in SharePoint List
- [ ] **Requirement 13.4**: Maintenance data stored in SharePoint List
- [ ] **Requirement 13.5**: Cost data stored in SharePoint List
- [ ] **Requirement 13.6**: SharePoint List relationships configured (lookup columns)
- [ ] **Requirement 13.7**: SharePoint column validation configured (Project_ID)
- [ ] **Requirement 13.8**: SharePoint versioning enabled for audit trail support

## Documentation

- [ ] Setup scripts created and tested
- [ ] Setup guide documentation created
- [ ] Validation script created and tested
- [ ] Permissions configuration documented
- [ ] Manual setup instructions documented

## Known Limitations / Manual Steps Required

Document any items that require manual configuration:

- [ ] Bookings list item-level permissions (must be set in SharePoint UI)
- [ ] Audit_Trail list read-only permissions (must be verified manually)
- [ ] Power Automate service account permissions (will be configured in Task 2)
- [ ] Unique constraints verification (must be tested manually)

## Sign-Off

### Completed By

- **Name**: ___________________________
- **Date**: ___________________________
- **Role**: ___________________________

### Verified By

- **Name**: ___________________________
- **Date**: ___________________________
- **Role**: ___________________________

### Notes

Document any issues encountered, workarounds applied, or deviations from the plan:

```
[Add notes here]
```

## Next Steps

After completing this checklist:

1. **Proceed to Task 2**: Implement booking conflict detection
   - Create Power Automate flow for conflict detection
   - Test with overlapping bookings
   - Verify error messages are clear

2. **Proceed to Task 3**: Create booking management Power App
   - Connect Power App to SharePoint lists
   - Create booking forms
   - Test end-to-end booking creation

3. **Integration Testing**: Test data flow between lists
   - Create van → Create booking → Verify lookup works
   - Test validation rules across different scenarios
   - Verify permissions work for different user roles

## Troubleshooting Reference

If any checks fail, refer to:

- **Setup Guide**: `docs/SharePoint-Setup-Guide.md`
- **Scripts README**: `scripts/README.md`
- **Validation Script Output**: Review detailed error messages
- **SharePoint Logs**: Check SharePoint ULS logs for detailed errors

## Appendix: Quick Commands

### Run Validation
```powershell
.\scripts\Validate-VBMSSetup.ps1 -SiteUrl "https://[tenant].sharepoint.com/sites/vbms"
```

### Check List Permissions
```powershell
Connect-PnPOnline -Url "https://[tenant].sharepoint.com/sites/vbms" -Interactive
Get-PnPList -Identity "Bookings" | Select-Object Title, HasUniqueRoleAssignments
Get-PnPListPermissions -Identity "Bookings"
```

### Check Group Membership
```powershell
Get-PnPGroupMember -Identity "VBMS Project Representatives"
Get-PnPGroupMember -Identity "VBMS Fleet Administrators"
Get-PnPGroupMember -Identity "VBMS Finance Managers"
```

### Test Column Validation
```powershell
# Create test booking with invalid Project_ID (should fail)
Add-PnPListItem -List "Bookings" -Values @{
    "Project_ID" = "123"
    "Van_ID" = 1
    "Driver_Name" = "Test"
    "Driver_Contact" = "test@test.com"
    "Start_DateTime" = (Get-Date).AddDays(1)
    "End_DateTime" = (Get-Date).AddDays(2)
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active
