// ABI exports for Unit Factory
// Network: Arc Testnet (Chain ID: 5042002)

// V1 Factories (Direct deployment - requires manual verification)
const TokenFactory = require('./TokenFactory.json');
const TaxTokenFactory = require('./TaxTokenFactory.json');
const Token = require('./Token.json');
const TaxToken = require('./TaxToken.json');

// V2 Factories (Clone pattern - AUTO-VERIFIED)
const UnitFactoryV2 = require('./UnitFactoryV2.json');
const TaxUnitFactoryV2 = require('./TaxUnitFactoryV2.json');
const UnitImplementation = require('./UnitImplementation.json');
const TaxUnitImplementation = require('./TaxUnitImplementation.json');

// Contract addresses on Arc Testnet
const addresses = {
  arcTestnet: {
    // V1 Factories (Legacy)
    normalFactory: '0x6441d6384176a01f65034A96E31c4433da82aa91',
    taxFactory: '0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2',
    
    // V2 Factories (Recommended - Auto-Verified Tokens)
    normalFactoryV2: '0xF00b137C40e3a370369901becF25ca0AA76DFC64',
    taxFactoryV2: '0x35b0A621a88634cea24920D84331d0CAad629BF4',
    normalTokenImpl: '0x484C4863993c8DAD2601Cb12094465eEEF2d4461',
    taxTokenImpl: '0xe284181b05C50E4a14F3Dc9195F3ACDE062F4abd',
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
  // V1 ABIs
  TokenFactory,
  TaxTokenFactory,
  Token,
  TaxToken,
  
  // V2 ABIs (Recommended)
  UnitFactoryV2,
  TaxUnitFactoryV2,
  UnitImplementation,
  TaxUnitImplementation,
  
  // Addresses
  addresses,
  
  // Network config
  networks,
};
