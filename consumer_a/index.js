const { server } = require('./server');

server.listen(8082, () => {
  console.log('User Service listening on http://localhost:8082');
});