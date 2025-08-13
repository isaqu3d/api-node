import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client";
import { courses } from "../database/schema";

export const GetCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const courseId = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) {
        return { course: result[0] };
      }

      return reply.status(404).send();
    }
  );
};
