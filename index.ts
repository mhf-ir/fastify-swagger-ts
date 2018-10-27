import AppServer from './src/AppServer';

process.env.APP_PORT = '9089';
process.env.APP_HOST = '127.0.0.1';
process.env.APP_SCHEMA = 'http';

const server = AppServer();

server.listen(parseInt(process.env.APP_PORT, 10), process.env.APP_HOST, (err) => {
  console.log(err);
});
