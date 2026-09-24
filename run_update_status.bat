@echo off
REM Cron job script to update order statuses based on 1-Day Buffer Rule
REM This runs daily at midnight

cd /d D:\projects\electronics

python manage.py update_order_status

REM Log the output
echo %date% %time% - Cron job executed >> cron_job.log
