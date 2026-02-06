# Van Booking & Fleet Management System - Setup Validation Script
# This script validates that all SharePoint lists, columns, and permissions are configured correctly
# Prerequisites: PnP PowerShell module installed

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl
)

# Import PnP PowerShell module
Import-Module PnP.PowerShell -ErrorAction Stop

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VBMS Setup Validation" -ForegroundColor Cyan
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

# Validation counters
$totalChecks = 0
$passedChecks = 0
$failedChecks = 0
$warnings = 0

# Function to validate list exists
function Test-ListExists {
    param([string]$ListName)
    
    $global:totalChecks++
    $list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if ($null -ne $list) {
        Write-Host "  ✓ List '$ListName' exists" -ForegroundColor Green
        $global:passedChecks++
        return $true
    } else {
        Write-Host "  ✗ List '$ListName' NOT FOUND" -ForegroundColor Red
        $global:failedChecks++
        return $false
    }
}

# Function to validate field exists
function Test-FieldExists {
    param(
        [string]$ListName,
        [string]$FieldName,
        [string]$ExpectedType = $null
    )
    
    $global:totalChecks++
    try {
        $field = Get-PnPField -List $ListName -Identity $FieldName -ErrorAction SilentlyContinue
        if ($null -ne $field) {
            if ($ExpectedType -and $field.TypeAsString -ne $ExpectedType) {
                Write-Host "    ⚠ Field '$FieldName' exists but type is $($field.TypeAsString), expected $ExpectedType" -ForegroundColor Yellow
                $global:warnings++
                $global:passedChecks++
            } else {
                Write-Host "    ✓ Field '$FieldName' exists" -ForegroundColor Green
                $global:passedChecks++
            }
            return $true
        } else {
            Write-Host "    ✗ Field '$FieldName' NOT FOUND" -ForegroundColor Red
            $global:failedChecks++
            return $false
        }
    } catch {
        Write-Host "    ✗ Error checking field '$FieldName': $_" -ForegroundColor Red
        $global:failedChecks++
        return $false
    }
}

# Function to validate group exists
function Test-GroupExists {
    param([string]$GroupName)
    
    $global:totalChecks++
    $group = Get-PnPGroup -Identity $GroupName -ErrorAction SilentlyContinue
    if ($null -ne $group) {
        Write-Host "  ✓ Group '$GroupName' exists" -ForegroundColor Green
        $global:passedChecks++
        return $true
    } else {
        Write-Host "  ✗ Group '$GroupName' NOT FOUND" -ForegroundColor Red
        $global:failedChecks++
        return $false
    }
}

Write-Host ""
Write-Host "Starting validation..." -ForegroundColor Yellow
Write-Host ""

#region Validate Vans List

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Validating Vans List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Vans") {
    Test-FieldExists -ListName "Vans" -FieldName "Van_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Vans" -FieldName "Registration" -ExpectedType "Text"
    Test-FieldExists -ListName "Vans" -FieldName "Make" -ExpectedType "Text"
    Test-FieldExists -ListName "Vans" -FieldName "Model" -ExpectedType "Text"
    Test-FieldExists -ListName "Vans" -FieldName "Year" -ExpectedType "Number"
    Test-FieldExists -ListName "Vans" -FieldName "VIN" -ExpectedType "Text"
    Test-FieldExists -ListName "Vans" -FieldName "Tier" -ExpectedType "Choice"
    Test-FieldExists -ListName "Vans" -FieldName "Type" -ExpectedType "Choice"
    Test-FieldExists -ListName "Vans" -FieldName "Daily_Rate" -ExpectedType "Currency"
    Test-FieldExists -ListName "Vans" -FieldName "Mileage_Rate" -ExpectedType "Currency"
    Test-FieldExists -ListName "Vans" -FieldName "Status" -ExpectedType "Choice"
    Test-FieldExists -ListName "Vans" -FieldName "Configuration" -ExpectedType "Note"
    Test-FieldExists -ListName "Vans" -FieldName "Accessories" -ExpectedType "Note"
    
    # Check versioning
    $totalChecks++
    $vansList = Get-PnPList -Identity "Vans"
    if ($vansList.EnableVersioning) {
        Write-Host "  ✓ Versioning enabled" -ForegroundColor Green
        $passedChecks++
    } else {
        Write-Host "  ✗ Versioning NOT enabled" -ForegroundColor Red
        $failedChecks++
    }
}

#endregion

#region Validate Van Documents Library

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Validating Van Documents Library" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Van Documents") {
    Test-FieldExists -ListName "Van Documents" -FieldName "Van_ID" -ExpectedType "Lookup"
    Test-FieldExists -ListName "Van Documents" -FieldName "Document_Type" -ExpectedType "Choice"
    Test-FieldExists -ListName "Van Documents" -FieldName "Expiry_Date" -ExpectedType "DateTime"
}

#endregion

#region Validate Bookings List

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. Validating Bookings List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Bookings") {
    Test-FieldExists -ListName "Bookings" -FieldName "Booking_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Bookings" -FieldName "Project_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Bookings" -FieldName "Van_ID" -ExpectedType "Lookup"
    Test-FieldExists -ListName "Bookings" -FieldName "Driver_Name" -ExpectedType "Text"
    Test-FieldExists -ListName "Bookings" -FieldName "Driver_Contact" -ExpectedType "Text"
    Test-FieldExists -ListName "Bookings" -FieldName "Start_DateTime" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Bookings" -FieldName "End_DateTime" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Bookings" -FieldName "Status" -ExpectedType "Choice"
    
    # Check versioning
    $totalChecks++
    $bookingsList = Get-PnPList -Identity "Bookings"
    if ($bookingsList.EnableVersioning) {
        Write-Host "  ✓ Versioning enabled" -ForegroundColor Green
        $passedChecks++
    } else {
        Write-Host "  ✗ Versioning NOT enabled" -ForegroundColor Red
        $failedChecks++
    }
}

#endregion

#region Validate Maintenance List

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "4. Validating Maintenance List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Maintenance") {
    Test-FieldExists -ListName "Maintenance" -FieldName "Maintenance_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Maintenance" -FieldName "Van_ID" -ExpectedType "Lookup"
    Test-FieldExists -ListName "Maintenance" -FieldName "Scheduled_Date" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Maintenance" -FieldName "Completed_Date" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Maintenance" -FieldName "Description" -ExpectedType "Note"
    Test-FieldExists -ListName "Maintenance" -FieldName "Cost" -ExpectedType "Currency"
    Test-FieldExists -ListName "Maintenance" -FieldName "Vendor" -ExpectedType "Text"
    Test-FieldExists -ListName "Maintenance" -FieldName "Maintenance_Type" -ExpectedType "Choice"
    
    # Check attachments
    $totalChecks++
    $maintenanceList = Get-PnPList -Identity "Maintenance"
    if ($maintenanceList.EnableAttachments) {
        Write-Host "  ✓ Attachments enabled" -ForegroundColor Green
        $passedChecks++
    } else {
        Write-Host "  ✗ Attachments NOT enabled" -ForegroundColor Red
        $failedChecks++
    }
}

#endregion

#region Validate Incidents List

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "5. Validating Incidents List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Incidents") {
    Test-FieldExists -ListName "Incidents" -FieldName "Incident_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Incidents" -FieldName "Van_ID" -ExpectedType "Lookup"
    Test-FieldExists -ListName "Incidents" -FieldName "Incident_DateTime" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Incidents" -FieldName "Incident_Type" -ExpectedType "Choice"
    Test-FieldExists -ListName "Incidents" -FieldName "Description" -ExpectedType "Note"
    Test-FieldExists -ListName "Incidents" -FieldName "Amount" -ExpectedType "Currency"
    Test-FieldExists -ListName "Incidents" -FieldName "Assigned_Driver" -ExpectedType "Text"
    Test-FieldExists -ListName "Incidents" -FieldName "Assigned_Project_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Incidents" -FieldName "Status" -ExpectedType "Choice"
    
    # Check attachments
    $totalChecks++
    $incidentsList = Get-PnPList -Identity "Incidents"
    if ($incidentsList.EnableAttachments) {
        Write-Host "  ✓ Attachments enabled" -ForegroundColor Green
        $passedChecks++
    } else {
        Write-Host "  ✗ Attachments NOT enabled" -ForegroundColor Red
        $failedChecks++
    }
}

#endregion

#region Validate Costs List

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "6. Validating Costs List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Costs") {
    Test-FieldExists -ListName "Costs" -FieldName "Cost_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Costs" -FieldName "Van_ID" -ExpectedType "Lookup"
    Test-FieldExists -ListName "Costs" -FieldName "Project_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Costs" -FieldName "Driver" -ExpectedType "Text"
    Test-FieldExists -ListName "Costs" -FieldName "Cost_Type" -ExpectedType "Choice"
    Test-FieldExists -ListName "Costs" -FieldName "Amount" -ExpectedType "Currency"
    Test-FieldExists -ListName "Costs" -FieldName "Date" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Costs" -FieldName "Description" -ExpectedType "Note"
    Test-FieldExists -ListName "Costs" -FieldName "Source_ID" -ExpectedType "Text"
}

#endregion

#region Validate Audit_Trail List

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "7. Validating Audit_Trail List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Audit_Trail") {
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Audit_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Entity_Type" -ExpectedType "Choice"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Entity_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Action" -ExpectedType "Choice"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "User" -ExpectedType "User"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Timestamp" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Changed_Fields" -ExpectedType "Note"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "Old_Values" -ExpectedType "Note"
    Test-FieldExists -ListName "Audit_Trail" -FieldName "New_Values" -ExpectedType "Note"
}

#endregion

#region Validate Error_Log List

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "8. Validating Error_Log List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-ListExists -ListName "Error_Log") {
    Test-FieldExists -ListName "Error_Log" -FieldName "Error_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Error_Log" -FieldName "Timestamp" -ExpectedType "DateTime"
    Test-FieldExists -ListName "Error_Log" -FieldName "Component" -ExpectedType "Choice"
    Test-FieldExists -ListName "Error_Log" -FieldName "Error_Type" -ExpectedType "Choice"
    Test-FieldExists -ListName "Error_Log" -FieldName "Error_Message" -ExpectedType "Note"
    Test-FieldExists -ListName "Error_Log" -FieldName "Stack_Trace" -ExpectedType "Note"
    Test-FieldExists -ListName "Error_Log" -FieldName "User" -ExpectedType "User"
    Test-FieldExists -ListName "Error_Log" -FieldName "Entity_Type" -ExpectedType "Text"
    Test-FieldExists -ListName "Error_Log" -FieldName "Entity_ID" -ExpectedType "Text"
    Test-FieldExists -ListName "Error_Log" -FieldName "Resolved" -ExpectedType "Boolean"
    Test-FieldExists -ListName "Error_Log" -FieldName "Resolution_Notes" -ExpectedType "Note"
}

#endregion

#region Validate SharePoint Groups

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "9. Validating SharePoint Groups" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Test-GroupExists -GroupName "VBMS Project Representatives"
Test-GroupExists -GroupName "VBMS Fleet Administrators"
Test-GroupExists -GroupName "VBMS Finance Managers"

#endregion

#region Summary

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Validation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$successRate = if ($totalChecks -gt 0) { [math]::Round(($passedChecks / $totalChecks) * 100, 1) } else { 0 }

Write-Host "Total Checks: $totalChecks" -ForegroundColor White
Write-Host "Passed: $passedChecks" -ForegroundColor Green
Write-Host "Failed: $failedChecks" -ForegroundColor Red
Write-Host "Warnings: $warnings" -ForegroundColor Yellow
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

if ($failedChecks -eq 0 -and $warnings -eq 0) {
    Write-Host "✓ All validation checks passed!" -ForegroundColor Green
    Write-Host "Your VBMS SharePoint site is configured correctly." -ForegroundColor Green
} elseif ($failedChecks -eq 0) {
    Write-Host "⚠ Validation passed with warnings" -ForegroundColor Yellow
    Write-Host "Review the warnings above and address if necessary." -ForegroundColor Yellow
} else {
    Write-Host "✗ Validation failed" -ForegroundColor Red
    Write-Host "Please review the errors above and re-run the setup scripts." -ForegroundColor Red
}

Write-Host ""
Write-Host "Manual Checks Required:" -ForegroundColor Yellow
Write-Host "1. Verify unique constraints on Van_ID and Registration in Vans list" -ForegroundColor White
Write-Host "2. Verify Project_ID column validation in Bookings and Costs lists" -ForegroundColor White
Write-Host "3. Verify Bookings list item-level permissions (users can only edit own items)" -ForegroundColor White
Write-Host "4. Verify Audit_Trail list is read-only for non-admin users" -ForegroundColor White
Write-Host "5. Test creating sample records to verify validations work" -ForegroundColor White
Write-Host ""

#endregion

Disconnect-PnPOnline
