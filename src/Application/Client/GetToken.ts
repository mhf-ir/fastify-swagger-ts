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

export default (server: FastifyInstance<Server, IncomingMessage, ServerResponse>) => {
  server.route({
    method: 'GET',

    handler(
      req: FastifyRequest<IncomingMessage>,
      reply: FastifyReply<ServerResponse>,
    ) {
      reply.send('1');
    },
    schema: {
      description: 'Get token base on domain, application and namespace',
    },
    url: '/v1/token/:domain/:app/:namespace',
  });
};
