# MongoDB Backups

This directory contains backups of your MongoDB database.

## Latest Backup

The most recent backup is located in: `mongodb-backup-YYYYMMDD-HHMMSS/`

## Backup Contents

Each backup contains:
- `campusconnect/users.bson` - User accounts and authentication data
- `campusconnect/posts.bson` - All posts
- `campusconnect/events.bson` - Events data
- `campusconnect/clubs.bson` - Clubs data
- Metadata files for indexes and collections

## Restore from Backup

To restore data from a backup to Docker MongoDB:

```bash
# Copy backup into container
docker cp backups/mongodb-backup-YYYYMMDD-HHMMSS campusconnect-mongo:/tmp/backup

# Restore the data
docker-compose exec mongo mongorestore --db campusconnect --drop /tmp/backup/campusconnect
```

## Create New Backup

To create a new backup from local MongoDB:

```bash
mongodump --host localhost:27017 --db campusconnect --out backups/mongodb-backup-$(date +%Y%m%d-%H%M%S)
```

## Backup from Docker MongoDB

To backup from Docker MongoDB:

```bash
docker-compose exec mongo mongodump --db campusconnect --archive > backups/docker-backup-$(date +%Y%m%d-%H%M%S).archive
```

