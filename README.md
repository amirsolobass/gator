# Gator - RSS Feed Aggregator

A CLI tool for aggregating and browsing RSS feeds, built with TypeScript, Drizzle ORM, and PostgreSQL.

## Prerequisites

- Node.js
- PostgreSQL database

## Installation

```bash
npm install
```

## Configuration

Create a config file at `~/.gatorconfig.json`:

```json
{
  "db_url": "postgres://user:password@localhost:5432/gator",
  "current_user_name": ""
}
```

## Database Setup

```bash
npm run db:generate
npm run db:migrate
```

## Commands

### Help
- `help` - Displays the entire command list
- Ctrl+C - Quits the program

### User Management
- `register <name>` - Create a new user
- `login <name>` - Log in as an existing user
- `users` - List all users
- `reset` - Reset the database

### Feed Management
- `addfeed <name> <url>` - Add and follow a new RSS feed
- `feeds` - List all feeds
- `follow <url>` - Follow an existing feed
- `following` - List feeds you follow
- `unfollow <url>` - Unfollow a feed

### Aggregation
- `agg <duration>` - Start the feed aggregator (e.g. `agg 10s`, `agg 1m`)

### Browsing
- `browse [limit]` - View latest posts (default limit: 2)

## Usage Example

```bash
npm run start register alice
npm run start addfeed "Example Blog" https://example.com/index.xml
npm run start agg 30s
# Ctrl+C to stop
npm run start browse 5
```