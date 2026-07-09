# PostgreSQL Monitoring Script
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

Write-Host "=== PostgreSQL Server Status ===" -ForegroundColor Green
$env:PGPASSWORD = "postgres123"
psql -U postgres -d testdb -c "SELECT version();"

Write-Host "`n=== Active Connections ===" -ForegroundColor Green
psql -U postgres -d testdb -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

Write-Host "`n=== Database Size ===" -ForegroundColor Green
psql -U postgres -d testdb -c "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;"

Write-Host "`n=== Table Statistics ===" -ForegroundColor Green
psql -U postgres -d testdb -c "SELECT schemaname, relname, n_tup_ins, n_tup_upd, n_tup_del, n_live_tup, n_dead_tup FROM pg_stat_user_tables;"

Write-Host "`n=== Cache Hit Ratio ===" -ForegroundColor Green
psql -U postgres -d testdb -c "SELECT sum(blks_hit)*100.0 / sum(blks_hit + blks_read) as cache_hit_ratio FROM pg_stat_database;"
