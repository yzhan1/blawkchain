const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');

const PORT = process.env.PORT || 3001;

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  res.redirect('/blocks');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});