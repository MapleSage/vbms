# VBMS SharePoint Setup Scripts

This directory contains PowerShell scripts for automating the setup and configuration of the Van Booking & Fleet Management System (VBMS) SharePoint site.

## Prerequisites

Before running these scripts, ensure you have:

1. **PnP PowerShell Module** installed:
   ```powershell
   Install-Module -Name PnP.PowerShell -Scope CurrentUser
   ```

2. **SharePoint Online** access with appropriate permissions:
   - Site Collection Administrator or
   - Global Administrator

3. **SharePoint Site** created (or use the setup script to create lists on an existing site)

## Scripts Overview

### 1. Setup-VBMSSharePointSite.ps1

**Purpose**: Creates all SharePoint lists and libraries with required columns and settings.

**Usage**:
```powershell
.\Setup-VBMSSharePointSite.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms"
```

**Parameters**:
- `-SiteUrl` (Required): The URL of your SharePoint site
- `-SiteTitle` (Optional): The title for the site (default: "Van Booking & Fleet Management System")
- `-AdminEmail` (Optional): Administrator email for notifications

**What it creates**:
- Vans list with all required columns and unique constraints
- Van Documents library with lookup columns
- Bookings list with validation and versioning
- Maintenance list with attachments enabled
- Incidents list with status tracking
- Costs list with project tracking
- Audit_Trail list for system audit
- Error_Log list for error tracking

**Estimated time**: 5-10 minutes

### 2. Configure-VBMSPermissions.ps1

**Purpose**: Configures SharePoint groups and permissions for role-based access control.

**Usage**:
```powershell
.\Configure-VBMSPermissions.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms" `
    -ProjectRepresentatives @("user1@domain.com", "user2@domain.com") `
    -FleetAdministrators @("admin1@domain.com") `
    -FinanceManagers @("finance1@domain.com")
```

**Parameters**:
- `-SiteUrl` (Required): The URL of your SharePoint site
- `-ProjectRepresentatives` (Optional): Array of user emails to add to Project Representatives group
- `-FleetAdministrators` (Optional): Array of user emails to add to Fleet Administrators group
- `-FinanceManagers` (Optional): Array of user emails to add to Finance Managers group

**What it configures**:
- Creates three SharePoint groups (Project Representatives, Fleet Administrators, Finance Managers)
- Assigns appropriate permission levels to each group
- Configures Audit_Trail list as read-only
- Sets up list-level permissions

**Estimated time**: 2-3 minutes

**Note**: Some configurations (like Bookings list item-level permissions) must be done manually through SharePoint UI.

### 3. Validate-VBMSSetup.ps1

**Purpose**: Validates that all lists, columns, and permissions are configured correctly.

**Usage**:
```powershell
.\Validate-VBMSSetup.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms"
```

**Parameters**:
- `-SiteUrl` (Required): The URL of your SharePoint site

**What it checks**:
- All required lists exist
- All required columns exist in each list
- Column types and settings are correct
- Unique constraints are configured
- Versioning is enabled where required
- Attachments are enabled where required
- SharePoint groups exist
- Permissions are configured correctly

**Estimated time**: 1-2 minutes

## Recommended Setup Workflow

Follow these steps for a complete setup:

### Step 1: Create SharePoint Site
1. Navigate to SharePoint Admin Center
2. Create a new Team Site named "Van Booking & Fleet Management System"
3. Note the site URL

### Step 2: Run Setup Script
```powershell
cd scripts
.\Setup-VBMSSharePointSite.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms"
```

### Step 3: Run Permissions Script
```powershell
.\Configure-VBMSPermissions.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms" `
    -ProjectRepresentatives @("rep1@domain.com", "rep2@domain.com") `
    -FleetAdministrators @("admin@domain.com") `
    -FinanceManagers @("finance@domain.com")
```

### Step 4: Manual Configuration
1. Configure Bookings list item-level permissions:
   - Go to Bookings list > List settings > Advanced settings
   - Set "Read access": Read all items
   - Set "Create and Edit access": Create items and edit items that were created by the user

2. Verify Audit_Trail permissions:
   - Ensure only Fleet Administrators have Read access
   - Ensure Power Automate service account has Contribute access

### Step 5: Validate Setup
```powershell
.\Validate-VBMSSetup.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms"
```

### Step 6: Test with Sample Data
1. Create a test van record
2. Create a test booking
3. Verify validations work (try invalid Project_ID, duplicate Van_ID, etc.)
4. Test permissions with different user accounts

## Troubleshooting

### Authentication Issues

If you encounter authentication errors:

```powershell
# Connect manually first
Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/vbms" -Interactive

# Then run the script
.\Setup-VBMSSharePointSite.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms"
```

### Permission Errors

If you get permission errors:
- Ensure you have Site Collection Administrator or Global Administrator rights
- Check that you're connected to the correct tenant
- Verify the site URL is correct

### Script Execution Policy

If scripts won't run:

```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy to allow scripts (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found

If PnP PowerShell module is not found:

```powershell
# Install the module
Install-Module -Name PnP.PowerShell -Scope CurrentUser -Force

# Import the module
Import-Module PnP.PowerShell
```

## Script Outputs

All scripts provide colored console output:
- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warnings or manual steps required
- 🔴 **Red**: Errors
- 🔵 **Cyan**: Section headers and informational messages

## Logging

Scripts output to console only. To capture output to a file:

```powershell
.\Setup-VBMSSharePointSite.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/vbms" | Tee-Object -FilePath "setup-log.txt"
```

## Safety Features

- **Idempotent**: Scripts can be run multiple times safely
- **Existence checks**: Scripts check if items exist before creating
- **Error handling**: Scripts catch and report errors without stopping
- **Confirmation**: Scripts provide summary of actions taken

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the setup guide: `docs/SharePoint-Setup-Guide.md`
3. Check script output for specific error messages
4. Verify prerequisites are met

## Version History

- **v1.0** (2024): Initial release
  - Setup script for lists and libraries
  - Permissions configuration script
  - Validation script

## Related Documentation

- [SharePoint Setup Guide](../docs/SharePoint-Setup-Guide.md) - Detailed manual setup instructions
- [Requirements Document](../.kiro/specs/van-booking-fleet-management/requirements.md) - System requirements
- [Design Document](../.kiro/specs/van-booking-fleet-management/design.md) - System design and architecture
- [Tasks Document](../.kiro/specs/van-booking-fleet-management/tasks.md) - Implementation tasks

## Next Steps

After completing the SharePoint setup:

1. **Create Power Automate Flows** (Task 2):
   - Booking conflict detection
   - Status transitions
   - Incident auto-assignment
   - Notifications
   - Audit trail

2. **Create Power Apps** (Task 3):
   - Booking Management App
   - Calendar View App
   - Vehicle Profile App
   - Fleet Management App
   - Reporting App

3. **Integration Testing**:
   - Test end-to-end workflows
   - Verify permissions work correctly
   - Test with realistic data volumes
