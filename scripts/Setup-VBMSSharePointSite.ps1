# Van Booking & Fleet Management System - SharePoint Site Setup Script
# This script creates the SharePoint site and all required lists/libraries for VBMS
# Prerequisites: PnP PowerShell module installed (Install-Module PnP.PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$SiteTitle = "Van Booking & Fleet Management System",
    
    [Parameter(Mandatory=$false)]
    [string]$AdminEmail
)

# Import PnP PowerShell module
Import-Module PnP.PowerShell -ErrorAction Stop

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VBMS SharePoint Site Setup" -ForegroundColor Cyan
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
Write-Host "Creating SharePoint lists and libraries..." -ForegroundColor Yellow
Write-Host ""

# Function to create a list if it doesn't exist
function New-VBMSList {
    param(
        [string]$Title,
        [string]$Template = "GenericList",
        [string]$Description = ""
    )
    
    $list = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
    if ($null -eq $list) {
        Write-Host "Creating list: $Title..." -ForegroundColor Cyan
        New-PnPList -Title $Title -Template $Template -OnQuickLaunch
        Write-Host "✓ List '$Title' created" -ForegroundColor Green
        return $true
    } else {
        Write-Host "⚠ List '$Title' already exists, skipping..." -ForegroundColor Yellow
        return $false
    }
}

# Function to add a field to a list
function Add-VBMSField {
    param(
        [string]$ListTitle,
        [string]$FieldName,
        [string]$FieldType,
        [hashtable]$AdditionalParams = @{}
    )
    
    try {
        $field = Get-PnPField -List $ListTitle -Identity $FieldName -ErrorAction SilentlyContinue
        if ($null -eq $field) {
            Add-PnPField -List $ListTitle -DisplayName $FieldName -InternalName $FieldName.Replace(" ", "_") -Type $FieldType @AdditionalParams -ErrorAction Stop
            Write-Host "  ✓ Added field: $FieldName" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ✗ Failed to add field $FieldName : $_" -ForegroundColor Red
    }
}

#region Create Vans List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Creating Vans List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Vans" -Description "Central registry of all fleet vehicles") {
    
    # Add Van_ID field (Text, Required, Indexed, Unique)
    Add-VBMSField -ListTitle "Vans" -FieldName "Van_ID" -FieldType "Text" -AdditionalParams @{
        Required = $true
        Indexed = $true
        EnforceUniqueValues = $true
    }
    
    # Add Registration field (Text, Required, Indexed, Unique)
    Add-VBMSField -ListTitle "Vans" -FieldName "Registration" -FieldType "Text" -AdditionalParams @{
        Required = $true
        Indexed = $true
        EnforceUniqueValues = $true
    }
    
    # Add Make field
    Add-VBMSField -ListTitle "Vans" -FieldName "Make" -FieldType "Text" -AdditionalParams @{
        Required = $true
    }
    
    # Add Model field
    Add-VBMSField -ListTitle "Vans" -FieldName "Model" -FieldType "Text" -AdditionalParams @{
        Required = $true
    }
    
    # Add Year field
    Add-VBMSField -ListTitle "Vans" -FieldName "Year" -FieldType "Number" -AdditionalParams @{
        Required = $true
    }
    
    # Add VIN field
    Add-VBMSField -ListTitle "Vans" -FieldName "VIN" -FieldType "Text"
    
    # Add Tier field (Choice)
    Add-PnPFieldFromXml -List "Vans" -FieldXml @"
<Field Type='Choice' DisplayName='Tier' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Standard</CHOICE>
        <CHOICE>Premium</CHOICE>
        <CHOICE>Specialized</CHOICE>
    </CHOICES>
    <Default>Standard</Default>
</Field>
"@
    Write-Host "  ✓ Added field: Tier" -ForegroundColor Green
    
    # Add Type field (Choice)
    Add-PnPFieldFromXml -List "Vans" -FieldXml @"
<Field Type='Choice' DisplayName='Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Cargo</CHOICE>
        <CHOICE>Passenger</CHOICE>
        <CHOICE>Refrigerated</CHOICE>
    </CHOICES>
    <Default>Cargo</Default>
</Field>
"@
    Write-Host "  ✓ Added field: Type" -ForegroundColor Green
    
    # Add Daily_Rate field (Currency)
    Add-VBMSField -ListTitle "Vans" -FieldName "Daily_Rate" -FieldType "Currency" -AdditionalParams @{
        Required = $true
    }
    
    # Add Mileage_Rate field (Currency)
    Add-VBMSField -ListTitle "Vans" -FieldName "Mileage_Rate" -FieldType "Currency" -AdditionalParams @{
        Required = $true
    }
    
    # Add Status field (Choice)
    Add-PnPFieldFromXml -List "Vans" -FieldXml @"
<Field Type='Choice' DisplayName='Status' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Available</CHOICE>
        <CHOICE>Booked</CHOICE>
        <CHOICE>Active</CHOICE>
        <CHOICE>Unavailable</CHOICE>
        <CHOICE>Inactive</CHOICE>
    </CHOICES>
    <Default>Available</Default>
</Field>
"@
    Write-Host "  ✓ Added field: Status" -ForegroundColor Green
    
    # Add Configuration field (Multi-line text)
    Add-VBMSField -ListTitle "Vans" -FieldName "Configuration" -FieldType "Note"
    
    # Add Accessories field (Multi-line text)
    Add-VBMSField -ListTitle "Vans" -FieldName "Accessories" -FieldType "Note"
    
    # Enable versioning
    Set-PnPList -Identity "Vans" -EnableVersioning $true -MajorVersions 50
    Write-Host "  ✓ Enabled versioning" -ForegroundColor Green
}

#endregion

#region Create Documents Library
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Creating Documents Library" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$docLib = Get-PnPList -Identity "Van Documents" -ErrorAction SilentlyContinue
if ($null -eq $docLib) {
    Write-Host "Creating document library: Van Documents..." -ForegroundColor Cyan
    New-PnPList -Title "Van Documents" -Template DocumentLibrary -OnQuickLaunch
    Write-Host "✓ Document library 'Van Documents' created" -ForegroundColor Green
    
    # Add Van_ID lookup field
    Add-PnPFieldFromXml -List "Van Documents" -FieldXml @"
<Field Type='Lookup' DisplayName='Van_ID' Required='TRUE' List='Vans' ShowField='Van_ID' />
"@
    Write-Host "  ✓ Added field: Van_ID (Lookup)" -ForegroundColor Green
    
    # Add Document_Type field (Choice)
    Add-PnPFieldFromXml -List "Van Documents" -FieldXml @"
<Field Type='Choice' DisplayName='Document_Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Insurance</CHOICE>
        <CHOICE>Registration</CHOICE>
        <CHOICE>Inspection</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Document_Type" -ForegroundColor Green
    
    # Add Expiry_Date field
    Add-VBMSField -ListTitle "Van Documents" -FieldName "Expiry_Date" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateOnly"
    }
} else {
    Write-Host "⚠ Document library 'Van Documents' already exists, skipping..." -ForegroundColor Yellow
}

#endregion

#region Create Bookings List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. Creating Bookings List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Bookings" -Description "Van booking records") {
    
    # Add Booking_ID field (auto-generated via workflow, but add as text for now)
    Add-VBMSField -ListTitle "Bookings" -FieldName "Booking_ID" -FieldType "Text" -AdditionalParams @{
        Indexed = $true
    }
    
    # Add Project_ID field with validation
    Add-PnPFieldFromXml -List "Bookings" -FieldXml @"
<Field Type='Text' DisplayName='Project_ID' Required='TRUE'>
    <Validation Message='Project ID must be exactly 5 digits'>
        =AND(LEN([Project_ID])=5,ISNUMBER(VALUE([Project_ID])))
    </Validation>
</Field>
"@
    Write-Host "  ✓ Added field: Project_ID (with validation)" -ForegroundColor Green
    
    # Add Van_ID lookup field
    Add-PnPFieldFromXml -List "Bookings" -FieldXml @"
<Field Type='Lookup' DisplayName='Van_ID' Required='TRUE' List='Vans' ShowField='Van_ID' Indexed='TRUE' />
"@
    Write-Host "  ✓ Added field: Van_ID (Lookup)" -ForegroundColor Green
    
    # Add Driver_Name field
    Add-VBMSField -ListTitle "Bookings" -FieldName "Driver_Name" -FieldType "Text" -AdditionalParams @{
        Required = $true
    }
    
    # Add Driver_Contact field
    Add-VBMSField -ListTitle "Bookings" -FieldName "Driver_Contact" -FieldType "Text" -AdditionalParams @{
        Required = $true
    }
    
    # Add Start_DateTime field
    Add-VBMSField -ListTitle "Bookings" -FieldName "Start_DateTime" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateTime"
        Indexed = $true
    }
    
    # Add End_DateTime field
    Add-VBMSField -ListTitle "Bookings" -FieldName "End_DateTime" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateTime"
        Indexed = $true
    }
    
    # Add Status field (Choice)
    Add-PnPFieldFromXml -List "Bookings" -FieldXml @"
<Field Type='Choice' DisplayName='Status' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Requested</CHOICE>
        <CHOICE>Confirmed</CHOICE>
        <CHOICE>Active</CHOICE>
        <CHOICE>Completed</CHOICE>
        <CHOICE>Cancelled</CHOICE>
    </CHOICES>
    <Default>Requested</Default>
</Field>
"@
    Write-Host "  ✓ Added field: Status" -ForegroundColor Green
    
    # Enable versioning
    Set-PnPList -Identity "Bookings" -EnableVersioning $true -MajorVersions 50
    Write-Host "  ✓ Enabled versioning" -ForegroundColor Green
}

#endregion

#region Create Maintenance List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "4. Creating Maintenance List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Maintenance" -Description "Vehicle maintenance records") {
    
    # Add Maintenance_ID field
    Add-VBMSField -ListTitle "Maintenance" -FieldName "Maintenance_ID" -FieldType "Text" -AdditionalParams @{
        Indexed = $true
    }
    
    # Add Van_ID lookup field
    Add-PnPFieldFromXml -List "Maintenance" -FieldXml @"
<Field Type='Lookup' DisplayName='Van_ID' Required='TRUE' List='Vans' ShowField='Van_ID' />
"@
    Write-Host "  ✓ Added field: Van_ID (Lookup)" -ForegroundColor Green
    
    # Add Scheduled_Date field
    Add-VBMSField -ListTitle "Maintenance" -FieldName "Scheduled_Date" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateTime"
    }
    
    # Add Completed_Date field
    Add-VBMSField -ListTitle "Maintenance" -FieldName "Completed_Date" -FieldType "DateTime" -AdditionalParams @{
        DisplayFormat = "DateTime"
    }
    
    # Add Description field
    Add-VBMSField -ListTitle "Maintenance" -FieldName "Description" -FieldType "Note" -AdditionalParams @{
        Required = $true
    }
    
    # Add Cost field
    Add-VBMSField -ListTitle "Maintenance" -FieldName "Cost" -FieldType "Currency"
    
    # Add Vendor field
    Add-VBMSField -ListTitle "Maintenance" -FieldName "Vendor" -FieldType "Text"
    
    # Add Maintenance_Type field (Choice)
    Add-PnPFieldFromXml -List "Maintenance" -FieldXml @"
<Field Type='Choice' DisplayName='Maintenance_Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Date-based</CHOICE>
        <CHOICE>Usage-based</CHOICE>
    </CHOICES>
    <Default>Date-based</Default>
</Field>
"@
    Write-Host "  ✓ Added field: Maintenance_Type" -ForegroundColor Green
    
    # Enable attachments
    Set-PnPList -Identity "Maintenance" -EnableAttachments $true
    Write-Host "  ✓ Enabled attachments" -ForegroundColor Green
}

#endregion

#region Create Incidents List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "5. Creating Incidents List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Incidents" -Description "Fines and incident records") {
    
    # Add Incident_ID field
    Add-VBMSField -ListTitle "Incidents" -FieldName "Incident_ID" -FieldType "Text" -AdditionalParams @{
        Indexed = $true
    }
    
    # Add Van_ID lookup field
    Add-PnPFieldFromXml -List "Incidents" -FieldXml @"
<Field Type='Lookup' DisplayName='Van_ID' Required='TRUE' List='Vans' ShowField='Van_ID' />
"@
    Write-Host "  ✓ Added field: Van_ID (Lookup)" -ForegroundColor Green
    
    # Add Incident_DateTime field
    Add-VBMSField -ListTitle "Incidents" -FieldName "Incident_DateTime" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateTime"
        Indexed = $true
    }
    
    # Add Incident_Type field (Choice)
    Add-PnPFieldFromXml -List "Incidents" -FieldXml @"
<Field Type='Choice' DisplayName='Incident_Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Fine</CHOICE>
        <CHOICE>Accident</CHOICE>
        <CHOICE>Damage</CHOICE>
        <CHOICE>Other</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Incident_Type" -ForegroundColor Green
    
    # Add Description field
    Add-VBMSField -ListTitle "Incidents" -FieldName "Description" -FieldType "Note" -AdditionalParams @{
        Required = $true
    }
    
    # Add Amount field
    Add-VBMSField -ListTitle "Incidents" -FieldName "Amount" -FieldType "Currency"
    
    # Add Assigned_Driver field
    Add-VBMSField -ListTitle "Incidents" -FieldName "Assigned_Driver" -FieldType "Text"
    
    # Add Assigned_Project_ID field
    Add-VBMSField -ListTitle "Incidents" -FieldName "Assigned_Project_ID" -FieldType "Text"
    
    # Add Status field (Choice)
    Add-PnPFieldFromXml -List "Incidents" -FieldXml @"
<Field Type='Choice' DisplayName='Status' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Open</CHOICE>
        <CHOICE>Assigned</CHOICE>
        <CHOICE>Paid</CHOICE>
        <CHOICE>Resolved</CHOICE>
        <CHOICE>Disputed</CHOICE>
    </CHOICES>
    <Default>Open</Default>
</Field>
"@
    Write-Host "  ✓ Added field: Status" -ForegroundColor Green
    
    # Enable attachments
    Set-PnPList -Identity "Incidents" -EnableAttachments $true
    Write-Host "  ✓ Enabled attachments" -ForegroundColor Green
}

#endregion

#region Create Costs List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "6. Creating Costs List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Costs" -Description "Running costs tracking") {
    
    # Add Cost_ID field
    Add-VBMSField -ListTitle "Costs" -FieldName "Cost_ID" -FieldType "Text" -AdditionalParams @{
        Indexed = $true
    }
    
    # Add Van_ID lookup field
    Add-PnPFieldFromXml -List "Costs" -FieldXml @"
<Field Type='Lookup' DisplayName='Van_ID' Required='TRUE' List='Vans' ShowField='Van_ID' />
"@
    Write-Host "  ✓ Added field: Van_ID (Lookup)" -ForegroundColor Green
    
    # Add Project_ID field with validation
    Add-PnPFieldFromXml -List "Costs" -FieldXml @"
<Field Type='Text' DisplayName='Project_ID' Required='TRUE' Indexed='TRUE'>
    <Validation Message='Project ID must be exactly 5 digits'>
        =AND(LEN([Project_ID])=5,ISNUMBER(VALUE([Project_ID])))
    </Validation>
</Field>
"@
    Write-Host "  ✓ Added field: Project_ID (with validation)" -ForegroundColor Green
    
    # Add Driver field
    Add-VBMSField -ListTitle "Costs" -FieldName "Driver" -FieldType "Text"
    
    # Add Cost_Type field (Choice)
    Add-PnPFieldFromXml -List "Costs" -FieldXml @"
<Field Type='Choice' DisplayName='Cost_Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Fuel</CHOICE>
        <CHOICE>Tolls</CHOICE>
        <CHOICE>Maintenance</CHOICE>
        <CHOICE>Fine</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Cost_Type" -ForegroundColor Green
    
    # Add Amount field
    Add-VBMSField -ListTitle "Costs" -FieldName "Amount" -FieldType "Currency" -AdditionalParams @{
        Required = $true
    }
    
    # Add Date field
    Add-VBMSField -ListTitle "Costs" -FieldName "Date" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateOnly"
    }
    
    # Add Description field
    Add-VBMSField -ListTitle "Costs" -FieldName "Description" -FieldType "Note"
    
    # Add Source_ID field (links to Maintenance_ID or Incident_ID)
    Add-VBMSField -ListTitle "Costs" -FieldName "Source_ID" -FieldType "Text"
}

#endregion

#region Create Audit_Trail List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "7. Creating Audit_Trail List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Audit_Trail" -Description "System audit trail") {
    
    # Add Audit_ID field
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "Audit_ID" -FieldType "Text" -AdditionalParams @{
        Indexed = $true
    }
    
    # Add Entity_Type field (Choice)
    Add-PnPFieldFromXml -List "Audit_Trail" -FieldXml @"
<Field Type='Choice' DisplayName='Entity_Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Van</CHOICE>
        <CHOICE>Booking</CHOICE>
        <CHOICE>Maintenance</CHOICE>
        <CHOICE>Incident</CHOICE>
        <CHOICE>Cost</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Entity_Type" -ForegroundColor Green
    
    # Add Entity_ID field
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "Entity_ID" -FieldType "Text" -AdditionalParams @{
        Required = $true
        Indexed = $true
    }
    
    # Add Action field (Choice)
    Add-PnPFieldFromXml -List "Audit_Trail" -FieldXml @"
<Field Type='Choice' DisplayName='Action' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Create</CHOICE>
        <CHOICE>Update</CHOICE>
        <CHOICE>Delete</CHOICE>
        <CHOICE>Status_Change</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Action" -ForegroundColor Green
    
    # Add User field (Person)
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "User" -FieldType "User" -AdditionalParams @{
        Required = $true
    }
    
    # Add Timestamp field
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "Timestamp" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateTime"
    }
    
    # Add Changed_Fields field (JSON format)
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "Changed_Fields" -FieldType "Note"
    
    # Add Old_Values field (JSON format)
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "Old_Values" -FieldType "Note"
    
    # Add New_Values field (JSON format)
    Add-VBMSField -ListTitle "Audit_Trail" -FieldName "New_Values" -FieldType "Note"
    
    # Configure permissions to prevent deletion and modification
    Write-Host "  ⚠ Configuring read-only permissions for Audit_Trail..." -ForegroundColor Yellow
    Write-Host "  ℹ Note: Permissions must be configured manually in SharePoint to prevent deletion/modification" -ForegroundColor Cyan
}

#endregion

#region Create Error_Log List
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "8. Creating Error_Log List" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (New-VBMSList -Title "Error_Log" -Description "System error tracking") {
    
    # Add Error_ID field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Error_ID" -FieldType "Text" -AdditionalParams @{
        Indexed = $true
    }
    
    # Add Timestamp field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Timestamp" -FieldType "DateTime" -AdditionalParams @{
        Required = $true
        DisplayFormat = "DateTime"
    }
    
    # Add Component field (Choice)
    Add-PnPFieldFromXml -List "Error_Log" -FieldXml @"
<Field Type='Choice' DisplayName='Component' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Booking</CHOICE>
        <CHOICE>Maintenance</CHOICE>
        <CHOICE>Incident</CHOICE>
        <CHOICE>Cost</CHOICE>
        <CHOICE>Notification</CHOICE>
        <CHOICE>Calendar</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Component" -ForegroundColor Green
    
    # Add Error_Type field (Choice)
    Add-PnPFieldFromXml -List "Error_Log" -FieldXml @"
<Field Type='Choice' DisplayName='Error_Type' Required='TRUE' Format='Dropdown' FillInChoice='FALSE'>
    <CHOICES>
        <CHOICE>Validation</CHOICE>
        <CHOICE>Conflict</CHOICE>
        <CHOICE>Authorization</CHOICE>
        <CHOICE>NotFound</CHOICE>
        <CHOICE>System</CHOICE>
    </CHOICES>
</Field>
"@
    Write-Host "  ✓ Added field: Error_Type" -ForegroundColor Green
    
    # Add Error_Message field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Error_Message" -FieldType "Note" -AdditionalParams @{
        Required = $true
    }
    
    # Add Stack_Trace field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Stack_Trace" -FieldType "Note"
    
    # Add User field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "User" -FieldType "User"
    
    # Add Entity_Type field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Entity_Type" -FieldType "Text"
    
    # Add Entity_ID field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Entity_ID" -FieldType "Text"
    
    # Add Resolved field (Boolean)
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Resolved" -FieldType "Boolean"
    
    # Add Resolution_Notes field
    Add-VBMSField -ListTitle "Error_Log" -FieldName "Resolution_Notes" -FieldType "Note"
}

#endregion

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure SharePoint permissions for user groups:" -ForegroundColor White
Write-Host "   - Project Representatives (Contribute to Bookings)" -ForegroundColor White
Write-Host "   - Fleet Administrators (Full Control)" -ForegroundColor White
Write-Host "   - Finance Managers (Read-only)" -ForegroundColor White
Write-Host "2. Configure Audit_Trail list to prevent deletion/modification" -ForegroundColor White
Write-Host "3. Create Power Automate flows for business logic" -ForegroundColor White
Write-Host "4. Create Power Apps for user interfaces" -ForegroundColor White
Write-Host ""

Disconnect-PnPOnline
