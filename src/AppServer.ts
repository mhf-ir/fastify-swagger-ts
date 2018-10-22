import {
  IncomingMessage,
  Server,
  ServerResponse,
} from 'http';

import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  ServerOptions,
} from 'fastify';

import { IApiResponse } from './IApiResponse';
import { defaultMiddleware } from './Middleware/DefaultHeaders';

export default (options: ServerOptions = {}): FastifyInstance<Server, IncomingMessage, ServerResponse> => {
  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(options);

  server.setNotFoundHandler((
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
  ) => {
    const apiResponse: IApiResponse = {
      statusCode: 404,
    };
    reply.status(404);
    reply.send(apiResponse);
  });

  server.use(defaultMiddleware);

  server.setErrorHandler((
    error: Error | any,
    req: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
  ) => {
    const apiResponse: IApiResponse = {
      statusCode: 500,
    };
    if (process.env.NODE_ENV === 'development') {
      apiResponse.statusCode = error.code;
      apiResponse.body = {
        message: error.message,
        stack: error.stack.split('\n'),
      };
    }
    reply.send(apiResponse);
  });

  return server;
};
