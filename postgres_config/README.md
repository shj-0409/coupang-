# PostgreSQL Configuration

## Installation
PostgreSQL 18.4 installed via Scoop

## Connection Information
- **Host**: localhost or 0.0.0.0
- **Port**: 5432
- **Default Database**: testdb
- **Superuser**: postgres / postgres123
- **Application User**: testuser / testuser123

## Configuration Files
- `postgresql.conf`: PostgreSQL main configuration
- `pg_hba.conf`: Host-based authentication configuration

## Scripts
- `backup.ps1`: Database backup script (creates compressed backups, keeps last 7 days)
- `monitor.ps1`: Database monitoring script (shows server status, connections, size, statistics)

## Performance Tuning
- shared_buffers: 256MB
- work_mem: 16MB
- maintenance_work_mem: 128MB
- effective_cache_size: 2GB

## Database Schema
### users table
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) NOT NULL)
- email (VARCHAR(100) NOT NULL UNIQUE)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## Backup Location
Backups are stored in: `C:\Users\user\postgres_backups\`

## External Access
External connections are enabled with md5 authentication.
