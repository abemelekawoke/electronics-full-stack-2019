# --- CONFIGURATION (Based on your paths) ---
$siteName = "ElectronicsApp"
$port = 80
$reactBuildPath = "D:\projects\electronics\electronics-frontend\build"
$djangoRoot = "D:\projects\electronics"
$djangoAppName = "electronics" # Name of folder with settings.py
$pythonExe = "D:\projects\env\Scripts\python.exe"
$wfastcgiPy = "D:\projects\env\Lib\site-packages\wfastcgi.py"

# Derived paths
$fastCgiHandler = "$pythonExe|$wfastcgiPy"
$djangoStaticPath = Join-Path $djangoRoot "static"

Write-Host "--- Starting Deployment for $siteName ---" -ForegroundColor Cyan

# 1. Enable IIS Features (CGI is required for FastCGI)
Write-Host "Enabling IIS CGI features..."
Enable-WindowsOptionalFeature -Online -FeatureName "IIS-CGI" -All

# 2. Register FastCGI Application at the Server Level
Write-Host "Registering FastCGI handler..."
$appCmd = "$env:windir\system32\inetsrv\appcmd.exe"
& $appCmd set config /section:system.webServer/fastCgi /+"[fullPath='$pythonExe', arguments='$wfastcgiPy']" /commit:apphost

# 3. Create the Main Website (React)
Import-Module WebAdministration
if (Test-Path "IIS:\Sites\$siteName") {
    Remove-Website -Name $siteName
    Write-Host "Removed existing site to refresh configuration."
}
New-Website -Name $siteName -Port $port -PhysicalPath $reactBuildPath -Force

# 4. Create the /api Sub-Application (Django)
Write-Host "Creating /api sub-application..."
New-WebApplication -Site $siteName -Name "api" -PhysicalPath $djangoRoot

# 5. Configure Django Environment Variables in IIS
Write-Host "Setting Django Environment Variables..."
& $appCmd set config "$siteName/api" /section:system.webServer/fastCgi /+"[fullPath='$pythonExe', arguments='$wfastcgiPy'].environmentVariables.[name='DJANGO_SETTINGS_MODULE', value='$djangoAppName.settings']" /commit:apphost
& $appCmd set config "$siteName/api" /section:system.webServer/fastCgi /+"[fullPath='$pythonExe', arguments='$wfastcgiPy'].environmentVariables.[name='PYTHONPATH', value='$djangoRoot']" /commit:apphost
& $appCmd set config "$siteName/api" /section:system.webServer/fastCgi /+"[fullPath='$pythonExe', arguments='$wfastcgiPy'].environmentVariables.[name='WSGI_HANDLER', value='django.core.wsgi.get_wsgi_application()']" /commit:apphost

# 6. Add FastCGI Handler Mapping to the /api App
& $appCmd set config "$siteName/api" /section:system.webServer/handlers /+"[name='DjangoHandler',path='*',verb='*',modules='FastCgiModule',scriptProcessor='$fastCgiHandler',resourceType='Unspecified']" /commit:apphost

# 7. Create web.config for React (Handling Routing & Redirects)
$webConfigContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api|auth|dashboard|admin)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
"@
$webConfigContent | Out-File -FilePath "$reactBuildPath\web.config" -Encoding utf8

# 8. Permissions (Granting access to IIS)
Write-Host "Applying folder permissions..."
icacls $reactBuildPath /grant "IIS_IUSRS:(OI)(CI)RX" /T
icacls $djangoRoot /grant "IIS_IUSRS:(OI)(CI)RX" /T

Write-Host "--- Deployment Finished! ---" -ForegroundColor Green
Write-Host "Site available at: http://localhost:$port"