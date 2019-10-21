const http = require('http');
const app = require('./app');
// const app1 = require('./app');

const port = process.env.PORT ;
const server = http.createServer(app);
server.listen(port);



// const port1 = process.env.PORT || 3001;
// const server1 = http.createServer(app1);
// server1.listen(port1);