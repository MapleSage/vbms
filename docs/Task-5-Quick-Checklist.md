# Task 5: Quick Checkpoint Checklist

## Quick Reference for Core Booking Functionality Verification

This is a condensed checklist for quick verification. For detailed test procedures, see `Task-5-Checkpoint-Verification-Guide.md`.

---

## Prerequisites (5 minutes)

### Task 1: SharePoint Setup
- [ ] SharePoint site exists: `https://[tenant].sharepoint.com/sites/vbms`
- [ ] All 8 lists created (Vans, Bookings, Maintenance, Incidents, Costs, Audit_Trail, Error_Log, Van Documents)
- [ ] Test van exists with Status = "Available"
- [ ] Permissions configured

### Task 2: Conflict Detection
- [ ] Flow "Check Booking Conflict" exists and is enabled
- [ ] Flow triggers on Bookings list create/modify
- [ ] Concurrency control = 1

### Task 3: Power App
- [ ] App "VBMS Booking Manager" exists and published
- [ ] App shared with test users
- [ ] Can open app successfully

### Task 4: Status Transitions
- [ ] Flow "Booking Status Transitions" exists and is enabled
- [ ] Flow scheduled every 15 minutes
- [ ] Flow has run successfully at least once

---

## Critical Tests (30 minutes)

### ✅ Test 1: Create Valid Booking
1. Open Power App
2. Click "New Booking"
3. Fill all fields with valid data (Project ID: `12345`)
4. Submit

**Expected**: ✅ Booking created, appears in list, Status = "Requested"

---

### ✅ Test 2: Project ID Validation
1. Try Project ID: `123` (too short)
2. Try Project ID: `ABCDE` (not numeric)
3. Try Project ID: `12345` (valid)

**Expected**: ✅ First two rejected, third accepted

---

### ✅ Test 3: Date Validation
1. Set Start: Tomorrow 5:00 PM
2. Set End: Tomorrow 9:00 AM (before start)

**Expected**: ✅ Error message, submit disabled

---

### ✅ Test 4: Conflict Detection
1. Create Booking A: Van 1, Tomorrow 10:00 AM - 2:00 PM
2. Try Booking B: Van 1, Tomorrow 12:00 PM - 4:00 PM (overlaps)

**Expected**: ✅ Booking B rejected, error in Error_Log

**Verify**:
```powershell
# Check only one booking exists
Get-PnPListItem -List "Bookings" | Where-Object {$_["Van_ID"].LookupId -eq 1}

# Check error log
Get-PnPListItem -List "Error_Log" | Select-Object -First 1
```

---

### ✅ Test 5: Adjacent Bookings (No Conflict)
1. Create Booking A: Van 2, Tomorrow 9:00 AM - 12:00 PM
2. Create Booking B: Van 2, Tomorrow 12:00 PM - 3:00 PM (adjacent)

**Expected**: ✅ Both bookings created successfully

---

### ✅ Test 6: Different Vans (No Conflict)
1. Create Booking A: Van 3, Tomorrow 10:00 AM - 2:00 PM
2. Create Booking B: Van 4, Tomorrow 10:00 AM - 2:00 PM (different van)

**Expected**: ✅ Both bookings created successfully

---

### ✅ Test 7: Status Transition (Confirmed → Active)
1. Create booking with Status: Confirmed, Start: 5 minutes ago
2. Wait up to 15 minutes for flow to run
3. Refresh bookings list

**Expected**: ✅ Status changed to "Active", audit record created

**Verify**:
```powershell
# Check booking status
$booking = Get-PnPListItem -List "Bookings" -Id [ID]
$booking["Status"]  # Should be "Active"

# Check audit record
Get-PnPListItem -List "Audit_Trail" | Where-Object {
    $_["Entity_ID"] -eq [BookingID] -and 
    $_["Action"] -eq "Status_Change"
}
```

---

### ✅ Test 8: Status Transition (Active → Completed)
1. Create booking with Status: Active, End: 5 minutes ago
2. Wait up to 15 minutes for flow to run
3. Refresh bookings list

**Expected**: ✅ Status changed to "Completed", audit record created

---

### ✅ Test 9: Role-Based Access (Project Rep)
1. Log in as Project Rep (non-admin)
2. Open Power App
3. View bookings list

**Expected**: ✅ See only own bookings, not other users' bookings

---

### ✅ Test 10: Role-Based Access (Fleet Admin)
1. Log in as Fleet Admin
2. Open Power App
3. View bookings list

**Expected**: ✅ See all bookings from all users

---

## Quick Performance Check (10 minutes)

### Performance Test 1: App Load
- [ ] App loads in < 5 seconds

### Performance Test 2: Gallery Load
- [ ] Bookings gallery displays in < 2 seconds

### Performance Test 3: Conflict Detection
- [ ] Conflict detected in < 1 second

### Performance Test 4: Status Transition
- [ ] Flow completes in < 30 seconds (for 10 bookings)

---

## Requirements Quick Check

### Booking Creation
- [ ] 3.1: All required fields enforced
- [ ] 3.2: Project ID = 5 digits
- [ ] 3.3: End after start
- [ ] 3.4: Conflict detection works
- [ ] 3.5: Conflict details provided
- [ ] 3.6: Unique booking ID
- [ ] 3.7: Initial status = Requested

### Booking Lifecycle
- [ ] 4.2: Confirmed → Active at start
- [ ] 4.3: Active → Completed at end
- [ ] 4.4: Audit trail for transitions

### Power Apps
- [ ] 14.1: Canvas app exists
- [ ] 14.4: M365 authentication
- [ ] 14.5: Role-based actions
- [ ] 14.6: Responsive design

---

## Pass/Fail Decision

### Critical Tests (Must Pass All)
- [ ] Test 1: Create valid booking
- [ ] Test 4: Conflict detection
- [ ] Test 7: Status transition (Confirmed → Active)
- [ ] Test 8: Status transition (Active → Completed)
- [ ] Test 9: Role-based access (Project Rep)
- [ ] Test 10: Role-based access (Fleet Admin)

### Result
- [ ] **PASS**: All critical tests passed → Proceed to Task 6
- [ ] **FAIL**: Any critical test failed → Must fix before proceeding

---

## Quick Issue Log

| Test # | Issue | Severity | Status |
|--------|-------|----------|--------|
| | | | |
| | | | |
| | | | |

---

## Quick Commands

### Connect to SharePoint
```powershell
Connect-PnPOnline -Url "https://[tenant].sharepoint.com/sites/vbms" -Interactive
```

### View Recent Bookings
```powershell
Get-PnPListItem -List "Bookings" | Select-Object -First 10
```

### View Recent Errors
```powershell
Get-PnPListItem -List "Error_Log" | Select-Object -First 5
```

### View Recent Audit Records
```powershell
Get-PnPListItem -List "Audit_Trail" | Select-Object -First 10
```

### Check Flow Status
```powershell
Get-PnPFlow | Where-Object {$_.DisplayName -like "*Booking*"}
```

### Manually Trigger Status Transition Flow
```powershell
# In Power Automate portal, find flow and click "Run"
```

---

## Sign-Off

**Tested By**: ___________________________  
**Date**: ___________________________  
**Result**: ☐ PASS  ☐ FAIL  
**Notes**: ___________________________

---

**For detailed test procedures, see**: `docs/Task-5-Checkpoint-Verification-Guide.md`
