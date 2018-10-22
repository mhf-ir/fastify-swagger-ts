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
  // server.get('');
};
