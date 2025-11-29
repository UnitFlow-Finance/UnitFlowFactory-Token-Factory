// ABI exports for ArcFactory Token Factory
// Network: Arc Testnet (Chain ID: 5042002)

const ArcTokenFactory = require('./ArcTokenFactory.json');
const ArcTaxTokenFactory = require('./ArcTaxTokenFactory.json');
const ArcToken = require('./ArcToken.json');
const ArcTaxToken = require('./ArcTaxToken.json');

// Contract addresses on Arc Testnet
const addresses = {
  arcTestnet: {
    normalFactory: '0x6441d6384176a01f65034A96E31c4433da82aa91',
    taxFactory: '0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2',
  },
};

// Network configuration
const networks = {
  arcTestnet: {
    chainId: 5042002,
    name: 'Arc Testnet',
    rpcUrl: 'https://rpc.testnet.arc.network',
    explorerUrl: 'https://testnet.arcscan.app',
    currency: {
      name: 'ARC',
      symbol: 'ARC',
      decimals: 18,
    },
  },
};

module.exports = {
  // ABIs
  ArcTokenFactory,
  ArcTaxTokenFactory,
  ArcToken,
  ArcTaxToken,
  
  // Addresses
  addresses,
  
  // Network config
  networks,
};
