# Node.js

Simple API in Node.js + TypeScript using Fastify, Drizzle ORM (PostgreSQL), and Zod. Includes Swagger/Scalar documentation in the development environment.

## Requisitos

- Node.js 22+
- Docker and Docker Compose
- npm (or another package manager, but the project uses `package-lock.json`)

## Technologies

- Fastify 5
- TypeScript
- Drizzle ORM + PostgreSQL
- Zod (validação)
- Swagger/OpenAPI + Scalar API Reference (em `/docs` quando `NODE_ENV=development`)

## Setup

1. Clone the repository and enter the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start PostgreSQL with Docker:

```bash
docker compose up -d
```

4. Create a .env file at the project root:

```bash
# URL do banco (Docker local padrão)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio

# Ativa docs em /docs
NODE_ENV=development
```

5. Run migrations (Drizzle):

```bash
npm run db:migrate
```

(Optional) To inspect schema/state with Drizzle Studio:

```bash
npm run db:studio
```

## Running the server

```bash
npm run dev
```

- Default port: `http://localhost:3333`
- Pretty logs enableds
- API Documentation (in dev): `http://localhost:3333/docs`

## Endpoints

Base URL: `http://localhost:3333`

- POST `/courses`

  - Create a course
  - Body (JSON):
    ```json
    { "title": "Docker Course" }
    ```
  - Responses:
    - 201: `{ "courseId": "<uuid>" }`

- GET `/courses`

  - Lists all courses
  - 200: `{ "courses": [{ "id": "<uuid>", "title": "..." }] }`

- GET `/courses/:id`
  - Fetch a course by ID
  - Params: `id` (UUID)
  - Responses:
    - 200: `{ "course": { "id": "<uuid>", "title": "...", "description": "... | null" } }`
    - 404: empty

## Models (schema)

Main tables defined in `src/database/schema.ts`:

- `courses`
  - `id` (uuid, pk, default random)
  - `title` (text, único, obrigatório)
  - `description` (text, opcional)
- `users` (exemplo para estudos)
  - `id` (uuid, pk, default random)
  - `name` (text, obrigatório)
  - `email` (text, único, obrigatório)

## Main flow (Mermaid)

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Fastify Server
  participant V as Zod Validator
  participant DB as Drizzle + PostgreSQL

  C->>S: POST /courses {title}
  S->>V: Validar body
  V-->>S: OK ou Erro 400
  alt válido
    S->>DB: INSERT INTO courses (title)
    DB-->>S: {id}
    S-->>C: 201 {courseId}
  else inválido
    S-->>C: 400
  end

  C->>S: GET /courses
  S->>DB: SELECT id,title FROM courses
  DB-->>S: lista
  S-->>C: 200 {courses: [...]}

  C->>S: GET /courses/:id
  S->>V: Validar param id (uuid)
  V-->>S: OK ou Erro 400
  alt encontrado
    S->>DB: SELECT * FROM courses WHERE id=...
    DB-->>S: course
    S-->>C: 200 {course}
  else não encontrado
    S-->>C: 404
  end
```

## Scripts

- `npm run dev`: starts the server with reload and loads variables from `.env`
- `npm run db:generate`: generates Drizzle artifacts from the schema
- `npm run db:migrate`: applies migrations to the database
- `npm run db:studio`: opens Drizzle Studio

## Tips & Troubleshooting

- Postgres connection refused: ensure `docker compose up -d` and check that port `5432` is not already in use.
- Missing `DATABASE_URL` check your `.env`. Drizzle requires this variable for `db:generate`, `db:migrate` e `db:studio`.
- Docs not available at `/docs`: ensure `NODE_ENV=development` s set in `.env` and restart the server.

## License

ISC (ver `package.json`).
