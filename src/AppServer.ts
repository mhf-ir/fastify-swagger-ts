import {
  IncomingMessage,
  Server,
  ServerResponse,
} from 'http';

import { readFileSync } from 'fs';

import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  ServerOptions,
} from 'fastify';

import fastifySwagger = require('fastify-swagger');

import { IApiResponse } from './IApiResponse';
import { defaultMiddleware } from './Middleware/DefaultHeaders';

import GetToken from './Application/Client/GetToken';

export default (options: ServerOptions = {}): FastifyInstance<Server, IncomingMessage, ServerResponse> => {
  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> | any = fastify(options);

  const packageData = JSON.parse(readFileSync(`${__dirname}/../package.json`, { encoding: 'utf8'}))

  const swagger = {
    exposeRoute: true,
    routePrefix: '/_openapi2',
    swagger: JSON.parse(readFileSync(`${__dirname}/../swagger.json`, { encoding: 'utf8'})),
  };

  swagger.swagger.info.version = packageData.version;
  swagger.swagger.info.contact.email = packageData.authors[0].email;
  swagger.swagger.info.title = packageData.name;
  swagger.swagger.info.description = packageData.description;

  if (process.env.APP_HOST && process.env.APP_PORT) {
    swagger.swagger.host = `${process.env.APP_HOST}:${process.env.APP_PORT}`;
  }

  if (process.env.APP_SCHEMA) {
    swagger.swagger.schemes = [process.env.APP_SCHEMA];
  }

  server.register(fastifySwagger, swagger);

  GetToken(server);

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
