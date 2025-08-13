import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { CreateCourseRoute } from "./src/routes/create-course.ts";
import { GetCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { GetCoursesRoute } from "./src/routes/get-courses.ts";

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
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API Node.js",
      version: "1.0.0",
    },
  },

  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.register(CreateCourseRoute);
server.register(GetCoursesRoute);
server.register(GetCourseByIdRoute);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
