# Node.js API

A simple REST API built with **[Node.js](https://nodejs.org/)** and **[TypeScript](https://www.typescriptlang.org/)**, powered by **[Fastify](https://fastify.dev/)**, **[Drizzle ORM](https://orm.drizzle.team/)** (PostgreSQL), and **[Zod](https://zod.dev/)**.  
Includes **[Swagger/OpenAPI](https://swagger.io/)** and **[Scalar](https://github.com/scalar/scalar)** documentation in development mode.

## Requirements

- [Node.js](https://nodejs.org/) **22+**
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/) (the project uses `package-lock.json`)

## Tech Stack

- [Fastify](https://fastify.dev/) 5
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/) (validation)
- [Swagger/OpenAPI](https://swagger.io/) + [Scalar API Reference](https://github.com/scalar/scalar)

---

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Create a .env file at the project root:

```bash
# Database connection (default local Docker setup)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio

# Enable docs at /docs
NODE_ENV=development
```

Run migrations (Drizzle):

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

## API Endpoints

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

## Database Models

Defined in `src/database/schema.ts`:

- `courses`
  - `id` (uuid, pk, default random)
  - `title` (text, único, obrigatório)
  - `description` (text, opcional)
- `users` (exemplo para estudos)
  - `id` (uuid, pk, default random)
  - `name` (text, obrigatório)
  - `email` (text, único, obrigatório)

## Development Workflow

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

- `npm run dev` – start server with hot-reload
- `npm run db:generate` – generate Drizzle artifacts from schema
- `npm run db:migrate` – apply database migrations
- `npm run db:studio` – open Drizzle Studio

## Troubleshooting

- Postgres connection refused: ensure `docker compose up -d` and check if port `5432` is free.
- `DATABASE_URL` missing: make sure `.env` is set correctly. Required by `db:generate`, `db:migrate` e `db:studio`.
- Docs not loading at `/docs`: set `NODE_ENV=development` in `.env` and restart the server.

## License

[ISC](./package.json)
