# Van Booking & Fleet Management System - Permissions Configuration Script
# This script configures SharePoint permissions for VBMS user groups
# Prerequisites: PnP PowerShell module installed and site already created

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory=$false)]
    [string[]]$ProjectRepresentatives = @(),
    
    [Parameter(Mandatory=$false)]
    [string[]]$FleetAdministrators = @(),
    
    [Parameter(Mandatory=$false)]
    [string[]]$FinanceManagers = @()
)

# Import PnP PowerShell module
Import-Module PnP.PowerShell -ErrorAction Stop

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VBMS Permissions Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Connect to SharePoint
Write-Host "Connecting to SharePoint..." -ForegroundColor Yellow
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-Host "✓ Connected successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to connect: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Configuring SharePoint groups and permissions..." -ForegroundColor Yellow
Write-Host ""

#region Create SharePoint Groups

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Creating SharePoint Groups" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create Project Representatives Group
Write-Host "Creating 'VBMS Project Representatives' group..." -ForegroundColor Cyan
try {
    $prGroup = Get-PnPGroup -Identity "VBMS Project Representatives" -ErrorAction SilentlyContinue
    if ($null -eq $prGroup) {
        New-PnPGroup -Title "VBMS Project Representatives" -Description "Project Representatives who can create and manage their own bookings"
        Write-Host "✓ Group created" -ForegroundColor Green
        
        # Add members if provided
        if ($ProjectRepresentatives.Count -gt 0) {
            foreach ($user in $ProjectRepresentatives) {
                Add-PnPGroupMember -LoginName $user -Identity "VBMS Project Representatives"
                Write-Host "  ✓ Added user: $user" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠ Group already exists" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Failed to create group: $_" -ForegroundColor Red
}

# Create Fleet Administrators Group
Write-Host "Creating 'VBMS Fleet Administrators' group..." -ForegroundColor Cyan
try {
    $faGroup = Get-PnPGroup -Identity "VBMS Fleet Administrators" -ErrorAction SilentlyContinue
    if ($null -eq $faGroup) {
        New-PnPGroup -Title "VBMS Fleet Administrators" -Description "Fleet Administrators with full control over all VBMS data"
        Write-Host "✓ Group created" -ForegroundColor Green
        
        # Add members if provided
        if ($FleetAdministrators.Count -gt 0) {
            foreach ($user in $FleetAdministrators) {
                Add-PnPGroupMember -LoginName $user -Identity "VBMS Fleet Administrators"
                Write-Host "  ✓ Added user: $user" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠ Group already exists" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Failed to create group: $_" -ForegroundColor Red
}

# Create Finance Managers Group
Write-Host "Creating 'VBMS Finance Managers' group..." -ForegroundColor Cyan
try {
    $fmGroup = Get-PnPGroup -Identity "VBMS Finance Managers" -ErrorAction SilentlyContinue
    if ($null -eq $fmGroup) {
        New-PnPGroup -Title "VBMS Finance Managers" -Description "Finance Managers with read-only access to reports and cost data"
        Write-Host "✓ Group created" -ForegroundColor Green
        
        # Add members if provided
        if ($FinanceManagers.Count -gt 0) {
            foreach ($user in $FinanceManagers) {
                Add-PnPGroupMember -LoginName $user -Identity "VBMS Finance Managers"
                Write-Host "  ✓ Added user: $user" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠ Group already exists" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Failed to create group: $_" -ForegroundColor Red
}

#endregion

#region Configure Site-Level Permissions

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Configuring Site-Level Permissions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Grant permissions to Fleet Administrators (Full Control)
Write-Host "Granting Full Control to Fleet Administrators..." -ForegroundColor Cyan
try {
    Set-PnPGroupPermissions -Identity "VBMS Fleet Administrators" -AddRole "Full Control"
    Write-Host "✓ Full Control granted" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to grant permissions: $_" -ForegroundColor Red
}

# Grant permissions to Project Representatives (Contribute)
Write-Host "Granting Contribute to Project Representatives..." -ForegroundColor Cyan
try {
    Set-PnPGroupPermissions -Identity "VBMS Project Representatives" -AddRole "Contribute"
    Write-Host "✓ Contribute granted" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to grant permissions: $_" -ForegroundColor Red
}

# Grant permissions to Finance Managers (Read)
Write-Host "Granting Read to Finance Managers..." -ForegroundColor Cyan
try {
    Set-PnPGroupPermissions -Identity "VBMS Finance Managers" -AddRole "Read"
    Write-Host "✓ Read granted" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to grant permissions: $_" -ForegroundColor Red
}

#endregion

#region Configure Bookings List Permissions

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. Configuring Bookings List Permissions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Setting item-level permissions for Bookings list..." -ForegroundColor Cyan
try {
    # Break inheritance on Bookings list
    Set-PnPList -Identity "Bookings" -BreakRoleInheritance -CopyRoleAssignments
    Write-Host "✓ Inheritance broken" -ForegroundColor Green
    
    # Configure item-level permissions (users can only edit their own items)
    # Note: This must be done through SharePoint UI or REST API
    Write-Host "⚠ Item-level permissions must be configured manually:" -ForegroundColor Yellow
    Write-Host "  1. Go to Bookings list > List settings > Advanced settings" -ForegroundColor White
    Write-Host "  2. Set 'Read access': Read all items" -ForegroundColor White
    Write-Host "  3. Set 'Create and Edit access': Create items and edit items that were created by the user" -ForegroundColor White
    
} catch {
    Write-Host "✗ Failed to configure list permissions: $_" -ForegroundColor Red
}

#endregion

#region Configure Audit_Trail List Permissions

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "4. Configuring Audit_Trail List Permissions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Setting read-only permissions for Audit_Trail list..." -ForegroundColor Cyan
try {
    # Break inheritance on Audit_Trail list
    Set-PnPList -Identity "Audit_Trail" -BreakRoleInheritance -ClearSubscopes
    Write-Host "✓ Inheritance broken" -ForegroundColor Green
    
    # Remove all existing permissions
    $auditList = Get-PnPList -Identity "Audit_Trail"
    $roleAssignments = Get-PnPProperty -ClientObject $auditList -Property RoleAssignments
    
    # Grant View Only to Fleet Administrators
    Set-PnPListPermission -Identity "Audit_Trail" -Group "VBMS Fleet Administrators" -AddRole "Read"
    Write-Host "✓ Read permission granted to Fleet Administrators" -ForegroundColor Green
    
    # Note: Power Automate service account needs Contribute permissions
    Write-Host "⚠ Important: Ensure Power Automate service account has Contribute permissions" -ForegroundColor Yellow
    
} catch {
    Write-Host "✗ Failed to configure Audit_Trail permissions: $_" -ForegroundColor Red
}

#endregion

#region Configure Other Lists Permissions

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "5. Configuring Other Lists Permissions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Lists that should inherit site permissions
$inheritLists = @("Vans", "Van Documents", "Maintenance", "Incidents", "Costs", "Error_Log")

foreach ($listName in $inheritLists) {
    Write-Host "Ensuring $listName inherits site permissions..." -ForegroundColor Cyan
    try {
        $list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
        if ($null -ne $list) {
            # Reset inheritance if broken
            Set-PnPList -Identity $listName -ResetRoleInheritance
            Write-Host "✓ $listName inherits site permissions" -ForegroundColor Green
        } else {
            Write-Host "⚠ List $listName not found" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Failed to configure $listName : $_" -ForegroundColor Red
    }
}

#endregion

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Permissions Configuration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "✓ SharePoint groups created" -ForegroundColor Green
Write-Host "✓ Site-level permissions configured" -ForegroundColor Green
Write-Host "✓ Audit_Trail list set to read-only" -ForegroundColor Green
Write-Host "⚠ Bookings list item-level permissions require manual configuration" -ForegroundColor Yellow
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Manually configure Bookings list item-level permissions" -ForegroundColor White
Write-Host "2. Add users to the appropriate SharePoint groups" -ForegroundColor White
Write-Host "3. Test permissions with different user accounts" -ForegroundColor White
Write-Host "4. Configure Power Automate service account permissions" -ForegroundColor White
Write-Host ""

# Display group membership
Write-Host "Current Group Membership:" -ForegroundColor Yellow
Write-Host ""

Write-Host "VBMS Project Representatives:" -ForegroundColor Cyan
$prMembers = Get-PnPGroupMember -Identity "VBMS Project Representatives"
if ($prMembers.Count -gt 0) {
    foreach ($member in $prMembers) {
        Write-Host "  - $($member.Title)" -ForegroundColor White
    }
} else {
    Write-Host "  (No members)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "VBMS Fleet Administrators:" -ForegroundColor Cyan
$faMembers = Get-PnPGroupMember -Identity "VBMS Fleet Administrators"
if ($faMembers.Count -gt 0) {
    foreach ($member in $faMembers) {
        Write-Host "  - $($member.Title)" -ForegroundColor White
    }
} else {
    Write-Host "  (No members)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "VBMS Finance Managers:" -ForegroundColor Cyan
$fmMembers = Get-PnPGroupMember -Identity "VBMS Finance Managers"
if ($fmMembers.Count -gt 0) {
    foreach ($member in $fmMembers) {
        Write-Host "  - $($member.Title)" -ForegroundColor White
    }
} else {
    Write-Host "  (No members)" -ForegroundColor Gray
}

Write-Host ""

Disconnect-PnPOnline
