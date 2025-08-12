import fastify from "fastify";
import crypto from "node:crypto";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

const courses = [
  {
    id: "1",
    title: "React",
  },
  {
    id: "2",
    title: "Node",
  },
  {
    id: "3",
    title: "Nest",
  },
];

server.get("/courses", () => {
  return { courses };
});

server.post("/courses", (request, replay) => {
  const courseId = crypto.randomUUID();

  courses.push({ id: courseId, title: "novo curso" });

  return replay.status(201).send({ courseId });
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running");
});
