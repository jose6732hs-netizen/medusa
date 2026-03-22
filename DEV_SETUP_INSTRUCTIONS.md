# Medusa Development Setup Instructions

## Quick Start

### 1. Installation
```bash
yarn install
```

### 2. Run Migrations
```bash
yarn medusa migrations run
```

### 3. Start Development Server
```bash
yarn dev
```

The Medusa server will start on `http://localhost:9000`

---

## Environment Configuration

### Copy Environment Template
```bash
cp .env.example .env.local
```

### Required Variables
The following variables must be configured in `.env.local`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/medusa` |
| `DATABASE_URL_UNPOOLED` | PostgreSQL unpooled connection | `postgresql://user:pass@host:5432/medusa` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT token secret (min 32 chars) | Random secure string |
| `COOKIE_SECRET` | Cookie secret (min 32 chars) | Random secure string |
| `ADMIN_CORS` | Admin CORS origins | `http://localhost:7001,http://localhost:7002` |
| `STORE_CORS` | Store CORS origins | `http://localhost:3000,http://localhost:8000` |
| `FILE_SERVICE_LOCAL_URL` | File service URL | `http://localhost:9000` |
| `PORT` | Server port | `9000` |

### Optional Variables
For development, these can be set to `dummy`:
- `POSTHOG_API_KEY`
- `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`
- `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY`
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`

---

## Development Workflow

### Available Commands
```bash
# Start development server
yarn dev

# Build packages
yarn build

# Run tests
yarn test

# Run integration tests
yarn test:integration:packages

# Linting
yarn lint

# Format code
yarn prettier
```

### Admin Panel
Once the server is running, access the admin panel at:
```
http://localhost:7001
```

### API Documentation
API reference available at:
```
http://localhost:9000/admin/swagger
```

---

## Database Management

### Run Migrations
```bash
yarn medusa migrations run
```

### Seed Database
```bash
yarn medusa seed --filepath='path/to/seed.json'
```

---

## Troubleshooting

### Port Already in Use
If port 9000 is in use, change it in `.env.local`:
```
PORT=9001
```

### Database Connection Error
1. Verify `DATABASE_URL` in `.env.local`
2. Ensure PostgreSQL is running
3. Check network connectivity to database host

### Missing Environment Variables
```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local  # or use your preferred editor
```

---

## Deployment to Vercel

### 1. Connect Repository
```bash
git push origin main
```

### 2. Set Environment Variables
In Vercel Project Settings → Environment Variables, add:
- `DATABASE_URL`
- `JWT_SECRET`
- `COOKIE_SECRET`
- All other production values

### 3. Deploy
```bash
vercel deploy --prod
```

---

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [GitHub Repository](https://github.com/medusajs/medusa)
- [Community Slack](https://slack.medusajs.com)
