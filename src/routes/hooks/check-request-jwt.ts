import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

type JWTPayload = {
  sub: string;
  role: "student" | "manager";
};

export function checkRequestJwt(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization;

  if (!token) {
    return reply.status(401).send();
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return reply.status(401).send();
  }
}
