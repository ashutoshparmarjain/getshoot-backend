# AI Studio Backend

Node.js and Express backend written in TypeScript. Includes authentication, validation, file uploads, and Google Cloud integrations.

## Requirements

- Node 18+
- NPM
- Database supported by Prisma

## Environment Variables

Create a `.env` file:
DATABASE_URL="postgres://..."
JWT_SECRET="your-secret"
CORS_ORIGINS="http://localhost:3000
"
GCP_BUCKET_NAME="your-bucket"

## Install Dependencies

npm install

shell
Copy code

## Prisma Commands

npm run prisma:generate
npm run prisma:migrate

csharp
Copy code

## Development

Run with hot reload:
npm run dev

shell
Copy code

## Build

Compile TypeScript:
npm run build

shell
Copy code

## Start (Production)

Run compiled output:
npm start

shell
Copy code

## Testing

npm test

markdown
Copy code

## Tech Stack

- Express
- TypeScript
- Prisma
- JWT
- Zod
- Multer
- Google Cloud Storage

## Project Structure

src/
server.ts
controllers/
routes/
middleware/
dist/

markdown
Copy code

## Notes

- CORS origins must match exactly.
- Uploads use a configured GCP bucket.
