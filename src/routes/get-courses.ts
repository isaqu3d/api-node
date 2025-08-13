import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const GetCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses", async (request, reply) => {
    const result = await db.select().from(courses);

    return reply.send({ courses: result });
  });
};
