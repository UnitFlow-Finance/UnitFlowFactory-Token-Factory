# Contract ABIs

This directory contains the Application Binary Interface (ABI) files for all deployed contracts.

## 📋 Available ABIs

### Factory Contracts

#### ArcTokenFactory.json
- **Contract**: Normal Token Factory
- **Address**: `0x6441d6384176a01f65034A96E31c4433da82aa91`
- **Purpose**: Create standard ERC20 tokens
- **Network**: Arc Testnet
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x6441d6384176a01f65034A96E31c4433da82aa91)

#### ArcTaxTokenFactory.json
- **Contract**: Tax Token Factory
- **Address**: `0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2`
- **Purpose**: Create tokens with buy/sell tax
- **Network**: Arc Testnet
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2)

### Token Contracts

#### ArcToken.json
- **Contract**: Standard ERC20 Token
- **Purpose**: ABI for tokens created by Normal Factory
- **Features**: ERC20, Burnable, Pausable, Permit, Ownable

#### ArcTaxToken.json
- **Contract**: Tax Token
- **Purpose**: ABI for tokens created by Tax Factory
- **Features**: All ArcToken features + Buy/Sell Tax

## 🚀 Usage

### JavaScript/TypeScript (ethers.js)

```javascript
import { ethers } from 'ethers';
import ArcTokenFactoryABI from './abi/ArcTokenFactory.json';

const provider = new ethers.JsonRpcProvider('https://rpc.testnet.arc.network');
const factoryAddress = '0x6441d6384176a01f65034A96E31c4433da82aa91';

const factory = new ethers.Contract(
  factoryAddress,
  ArcTokenFactoryABI,
  provider
);

// Get creation fee
const fee = await factory.creationFee();
console.log('Creation Fee:', ethers.formatEther(fee), 'ARC');
```

### Web3.js

```javascript
const Web3 = require('web3');
const ArcTokenFactoryABI = require('./abi/ArcTokenFactory.json');

const web3 = new Web3('https://rpc.testnet.arc.network');
const factoryAddress = '0x6441d6384176a01f65034A96E31c4433da82aa91';

const factory = new web3.eth.Contract(
  ArcTokenFactoryABI,
  factoryAddress
);

// Get total tokens created
const total = await factory.methods.totalTokensCreated().call();
console.log('Total Tokens:', total);
```

### Python (web3.py)

```python
from web3 import Web3
import json

# Load ABI
with open('abi/ArcTokenFactory.json', 'r') as f:
    abi = json.load(f)

# Connect to network
w3 = Web3(Web3.HTTPProvider('https://rpc.testnet.arc.network'))
factory_address = '0x6441d6384176a01f65034A96E31c4433da82aa91'

# Create contract instance
factory = w3.eth.contract(address=factory_address, abi=abi)

# Get creation fee
fee = factory.functions.creationFee().call()
print(f'Creation Fee: {w3.from_wei(fee, "ether")} ARC')
```

### React/Next.js

```typescript
import { useContract, useProvider } from 'wagmi';
import ArcTokenFactoryABI from '@/abi/ArcTokenFactory.json';

const FACTORY_ADDRESS = '0x6441d6384176a01f65034A96E31c4433da82aa91';

function useTokenFactory() {
  const provider = useProvider();
  
  const factory = useContract({
    address: FACTORY_ADDRESS,
    abi: ArcTokenFactoryABI,
    signerOrProvider: provider,
  });
  
  return factory;
}
```

## 📦 Installation

### NPM Package (if published)

```bash
npm install @arcflow/token-factory-abi
```

### Direct Import

```bash
# Clone repository
git clone https://github.com/ArcFlow-Finance/ArcFactory-Token-Factory.git

# Copy ABIs to your project
cp ArcFactory-Token-Factory/abi/*.json your-project/abi/
```

## 🔍 ABI Structure

Each ABI file contains:
- **Function signatures** - All public and external functions
- **Event definitions** - All emitted events
- **Input/Output types** - Parameter and return types
- **State mutability** - view, pure, payable, nonpayable

## 📚 Key Functions

### Factory Functions

#### createToken (Normal Factory)
```solidity
function createToken(
    string calldata name_,
    string calldata symbol_,
    uint8 decimals_,
    uint256 initialSupply_,
    uint256 maxSupply_,
    bool mintable_,
    bool burnable_,
    bool pausable_
) external payable returns (address tokenAddress)
```

#### createTaxToken (Tax Factory)
```solidity
function createTaxToken(
    string calldata name_,
    string calldata symbol_,
    uint8 decimals_,
    uint256 initialSupply_,
    uint256 maxSupply_,
    bool mintable_,
    bool burnable_,
    bool pausable_,
    uint256 buyTax_,
    uint256 sellTax_,
    address taxWallet_
) external payable returns (address tokenAddress)
```

#### Common Factory Functions
- `updateCreationFee(uint256 newFee)` - Update creation fee
- `withdrawFees(address payable recipient)` - Withdraw fees
- `recoverTokens(address token, address recipient, uint256 amount)` - Recover tokens
- `getCreatorTokens(address creator)` - Get tokens by creator
- `getTokenInfo(uint256 tokenId)` - Get token information

### Token Functions

#### Standard ERC20
- `transfer(address to, uint256 amount)`
- `approve(address spender, uint256 amount)`
- `transferFrom(address from, address to, uint256 amount)`
- `balanceOf(address account)`
- `totalSupply()`

#### Extended Features
- `mint(address to, uint256 amount)` - Mint tokens (if mintable)
- `burn(uint256 amount)` - Burn tokens
- `pause()` - Pause transfers (if pausable)
- `unpause()` - Unpause transfers
- `blacklist(address account)` - Blacklist address
- `unblacklist(address account)` - Remove from blacklist

#### Tax Token Specific
- `updateTax(uint256 newBuyTax, uint256 newSellTax)` - Update tax rates
- `setDexPair(address pair, bool status)` - Set DEX pair
- `setTaxExempt(address account, bool status)` - Set tax exemption
- `updateTaxWallet(address newTaxWallet)` - Update tax wallet

## 🔗 Network Information

### Arc Testnet
- **RPC URL**: https://rpc.testnet.arc.network
- **Chain ID**: 5042002
- **Explorer**: https://testnet.arcscan.app
- **Currency**: ARC

## 📖 Additional Resources

- **Main Documentation**: [README.md](../README.md)
- **API Reference**: [API.md](../API.md)
- **Deployment Info**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Quick Start**: [QUICKSTART.md](../QUICKSTART.md)

## 🆘 Support

For issues or questions:
- **GitHub Issues**: [Open an issue](https://github.com/ArcFlow-Finance/ArcFactory-Token-Factory/issues)
- **Documentation**: See project README
- **Explorer**: [ArcScan](https://testnet.arcscan.app)

---

**Last Updated**: November 29, 2024  
**Network**: Arc Testnet  
**Status**: Production Ready
