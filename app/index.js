const express = require('express');
const morgan = require('morgan');
const logger = require('tracer').console();
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2pServer');

const PORT = process.env.PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.json());
app.use(morgan('common'));

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  logger.info(`New block added: ${block.toString()}`);

  res.redirect('/blocks');
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

p2pServer.listen();