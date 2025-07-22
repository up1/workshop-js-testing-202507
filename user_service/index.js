const { server } = require('./server');

server.listen(8081, () => {
  console.log('User Service listening on http://localhost:8081');
});