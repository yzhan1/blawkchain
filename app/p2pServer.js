const WebSockect = require('ws');
const logger = require('tracer').console();

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSockect.Server({ port: P2P_PORT });
    server.on('connection', (socket) => this.connectSocket(socket));

    this.connectToPeers();

    logger.info(`Listening for p2p connections on ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    logger.info('Socket connected');
    this.handleMessage(socket);

    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSockect(peer);

      socket.on('open', () => this.connectSocket(socket));
    });
  }

  handleMessage(socket) {
    socket.on('message', (message) => {
      const data = JSON.parse(message);

      this.blockchain.replace(data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }
}

module.exports = P2pServer;