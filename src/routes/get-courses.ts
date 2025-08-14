import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const GetCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all courses",
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                title: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select().from(courses);

      return reply.send({ courses: result });
    }
  );
};
