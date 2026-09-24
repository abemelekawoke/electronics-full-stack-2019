# PowerShell script to set up Windows Task Scheduler for the cron job
# This creates a daily task at midnight to run the order status update

$taskName = "ElectronicsOrderStatusUpdate"
$scriptPath = "D:\projects\electronics\run_update_status.bat"

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Task '$taskName' already exists. Removing old task..."
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create the action
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`""

# Create the trigger - daily at midnight
$trigger = New-ScheduledTaskTrigger -Daily -At "00:00AM"

# Create the principal (run whether user is logged on or not)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Register the task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Updates order statuses based on 1-Day Buffer Rule"

Write-Host "Task '$taskName' created successfully!"
Write-Host "The task will run daily at midnight to check and update order statuses."
