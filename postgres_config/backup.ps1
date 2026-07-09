# PostgreSQL Backup Script
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

$backupDir = "$env:USERPROFILE\postgres_backups"
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = "$backupDir\testdb_backup_$date.sql"

# Create backup
pg_dump -U postgres -d testdb -f $backupFile

# Compress backup (optional)
Compress-Archive -Path $backupFile -DestinationPath "$backupFile.zip" -Force
Remove-Item $backupFile

# Keep only last 7 backups
Get-ChildItem $backupDir -Filter "testdb_backup_*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 7 | Remove-Item -Force

Write-Host "Backup completed: $backupFile.zip"
