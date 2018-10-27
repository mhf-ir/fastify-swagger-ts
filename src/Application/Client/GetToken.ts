import {
  IncomingMessage,
  ServerResponse,
  STATUS_CODES,
} from 'http';

import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';

import svgCaptcha from 'svg-captcha';

import IToken from '../IToken';

export default (server) => {
  server.route({
    method: 'GET',
    handler(
      req: FastifyRequest<IncomingMessage>,
      reply: FastifyReply<ServerResponse>,
    ) {
      const svgR = svgCaptcha.create({
        color: true,
        noise: 4,
      });
      const itoken: IToken = {
        expire: (new Date()).toISOString(),
        svg: svgR.data,
        token: 'paelaish0kuhai5iav6jootaiCh2Ahh2',
      };
      reply.send(itoken);
    },
    schema: {
      description: 'Set the domain and namespace for get captcha and token',
      params: {
        properties: {
          domain: {
            description: 'Domain of your application example: `sample.tld` or for mobile app you can use `com.company.app`',
            pattern: '^[a-zA-Z0-9\.]{3,48}$',
            type: 'string',
          },
          namespace: {
            description: 'Namespace of your application example: `login`, `remember-password`, `contact-us` or etc...',
            pattern: '^[a-zA-Z0-9\-]{3,48}$',
            type: 'string',

          },
        },
        type: 'object',
      },
      response: {
        200: {
          description: STATUS_CODES['200'],
          properties: {
            expire: {
              example: (new Date()).toISOString(),
              format: 'datetime',
              type: 'string',
            },
            svg: {
              example: '<svg>...</svg>',
              type: 'string',
            },
            token: {
              example: '012345678901234567890123456789aZ',
              pattern: '^[a-zA-Z0-9]{32}$',
              type: 'string',
            },
          },
          type: 'object',
        },
        429: {
          description: STATUS_CODES['429'],
          example: '',
          nullable: true,
          type: 'string',
        },
      },
      summary: 'Get token and captcha for domain and namespace',
      tags: ['client'],
    },
    url: '/token/:domain/:namespace',
  });
};
