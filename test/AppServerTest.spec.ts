import { expect } from 'chai';

import AppServer from '../src/AppServer';
import {IApiResponse } from '../src/IApiResponse';
import {
  defaultHeaders,
} from '../src/Middleware/DefaultHeaders';


describe('AppServer', () => {

  it('Must be run get pong from ping', () => {
    const server = AppServer();
    server.get('/ping', (request, reply) => {
      reply.send('pong');
    });
    server.inject({
      url: '/ping',
    }, (error, response ) => {
      expect(error).to.be.eq(null);
      for (const [hkey, hval] of Object.entries(response.headers)) {
        if (defaultHeaders[hkey]) {
          expect(defaultHeaders[hkey]).to.be.eq(hval);
        }
      }
      expect(response.statusCode).to.be.eq(200);
    });
  });
  it('Must be run get api response', () => {
    const server = AppServer();
    const apiResponseOK: IApiResponse = {
      body: 'Ok, ready',
      statusCode: 200,
    };
    server.get('/api-response', (request, reply) => {
      reply.send(apiResponseOK);
    });
    server.inject({
      url: '/api-response',
    }, (error, response) => {
      expect(error).to.be.eq(null);
      expect(JSON.parse(response.rawPayload.toString())).to.be.deep.eq(apiResponseOK);
      expect(response.statusCode).to.be.eq(apiResponseOK.statusCode);
    });
  });
  it('Must be get an error with 500', () => {
    const server = AppServer();
    const apiResponse: IApiResponse = {
      statusCode: 500,
    };
    server.get('/api-error-2', (request, reply) => {
      reply.send(new Error('Cannot handle 2'));
    });
    server.inject({
      url: '/api-error-2',
    }, (error, response) => {
      expect(error).to.be.eq(null);
      expect(response.statusCode).to.be.eq(apiResponse.statusCode);
    })
  });
  it('Must be get an error with 500 with detail on development', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const server = AppServer();
    const apiResponse: IApiResponse = {
      statusCode: 500,
    };
    server.get('/api-error', (request, reply) => {
      reply.send(new Error('Cannot handle'));
    });
    server.inject({
      url: '/api-error',
    }, (error, response) => {
      const jsonResponse = JSON.parse(response.rawPayload.toString());
      expect(error).to.be.eq(null);
      expect(jsonResponse.body.message).to.be.eq('Cannot handle');
      expect(jsonResponse.body.stack.length).to.gt(5);
      expect(response.statusCode).to.be.eq(apiResponse.statusCode);
      process.env.NODE_ENV = oldEnv;
    });
  });
  it('Must be get an error with 404', () => {
    const server = AppServer();
    const apiResponse: IApiResponse = {
      statusCode: 404,
    };
    server.inject({
      url: '/api-404',
    }, (error, response) => {
      expect(error).to.be.eq(null);
      expect(response.statusCode).to.be.eq(apiResponse.statusCode);
    })
  });
});
