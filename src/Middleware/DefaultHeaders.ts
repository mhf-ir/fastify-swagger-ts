import {
  IncomingMessage,
  ServerResponse,
} from 'http';

const defaultHeaders: {[key: string]: string} = {
  'cache-control': 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0',
  'content-type': 'application/json; charset=utf-8',
  'expires': 'Thu, 01 Jan 1970 00:00:00 +0000',
  'pragma': 'no-cache',
  'referrer': 'origin',
  'x-accel-expires': 'Thu, 01 Jan 1970 00:00:00 +0000',
};

const defaultMiddleware = (
  req: IncomingMessage,
  reply: ServerResponse,
  next: (err?: Error) => void,
) => {
  if (req.url && !req.url.match(/_openapi2/)) {
    Object.keys(defaultHeaders).forEach((k) => {
      reply.setHeader(k, defaultHeaders[k]);
    });
  }
  next();
};

export {
  defaultHeaders,
  defaultMiddleware,
};
