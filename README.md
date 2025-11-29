# ArcFactory Token Factory

Professional token creation factory for Arc Network with dynamic fee adjustment and gas optimization.

## 🚀 Deployed Contracts (Production)

### Arc Testnet

#### Normal Token Factory
- **Address**: `0x6441d6384176a01f65034A96E31c4433da82aa91`
- **Purpose**: Create standard ERC20 tokens with advanced features
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x6441d6384176a01f65034A96E31c4433da82aa91)
- **Status**: ✅ Verified & Production Ready

#### Tax Token Factory
- **Address**: `0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2`
- **Purpose**: Create tokens with buy/sell tax functionality
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2)
- **Status**: ✅ Verified & Production Ready

> **Note**: Two separate factories are used due to Ethereum's 24KB contract size limit. This approach provides better gas efficiency and maintainability.

## Features

### Token Types
- ✅ **Normal Tokens** - Standard ERC20 with advanced features
- ✅ **Tax Tokens** - ERC20 with buy/sell tax functionality

### Normal Token Features
- ✅ ERC20 standard compliance
- ✅ Customizable decimals (up to 18)
- ✅ Initial supply minting
- ✅ Maximum supply cap (optional)
- ✅ Mintable tokens (optional)
- ✅ Burnable tokens
- ✅ Pausable transfers (optional)
- ✅ Blacklist functionality
- ✅ ERC20Permit (gasless approvals)
- ✅ Ownership transfer

### Tax Token Features
- ✅ All normal token features
- ✅ Configurable buy tax (0-25%)
- ✅ Configurable sell tax (0-25%)
- ✅ DEX pair management
- ✅ Tax exemption system
- ✅ Tax wallet configuration
- ✅ Dynamic tax updates

### Factory Features
- ✅ Two specialized factories (Normal & Tax)
- ✅ Dynamic creation fee adjustment (owner only)
- ✅ Gas-optimized deployment
- ✅ Token registry and tracking
- ✅ Creator token history
- ✅ Fee withdrawal (owner only)
- ✅ Token recovery (rescue mistakenly sent tokens)
- ✅ Automatic refund of excess payment
- ✅ Reentrancy protection

## Installation

```bash
npm install
```

## Configuration

The project is configured for Arc Testnet deployment:
- Network: Arc Testnet
- Chain ID: 5042002
- RPC: https://rpc.testnet.arc.network
- Explorer: https://testnet.arcscan.app

## 📦 Quick Start

### Installation

```bash
npm install
```

### Using ABIs in Your Project

All contract ABIs are available in the `abi/` directory:

```javascript
// JavaScript/Node.js
const { ArcTokenFactory, addresses } = require('./abi');

// ES6/TypeScript
import { ArcTokenFactory, addresses } from './abi';

// Use with ethers.js
import { ethers } from 'ethers';
const factory = new ethers.Contract(
  addresses.arcTestnet.normalFactory,
  ArcTokenFactory,
  provider
);
```

See [abi/README.md](./abi/README.md) for detailed usage examples.

### Compile Contracts

```bash
npm run compile
```

### Using the Factories

#### Create Normal Token
```bash
npm run test-factory
```

#### Create Tax Token
```bash
npm run test-tax
```

### Available Scripts

```bash
npm run compile          # Compile contracts
npm run deploy           # Deploy normal factory
npm run deploy-tax       # Deploy tax factory
npm run test-factory     # Test normal token creation
npm run test-tax         # Test tax token creation
npm run create-verify    # Create and auto-verify normal token
npm run create-verify-tax # Create and auto-verify tax token
npm run test-recovery    # Test token recovery (normal)
npm run test-tax-recovery # Test token recovery (tax)
npm run list-tokens      # List all created tokens
npm run update-fee       # Update creation fee
npm run withdraw         # Withdraw accumulated fees
```

### Token Verification

Tokens created by the factories can be verified on ArcScan. See [VERIFICATION_GUIDE.md](./VERIFICATION_GUIDE.md) for detailed instructions.

**Quick verification:**
```bash
# Verify a normal token
TOKEN_ADDRESS=0xYourTokenAddress TOKEN_TYPE=normal npx hardhat run scripts/verify-token.js --network arcTestnet

# Verify a tax token
TOKEN_ADDRESS=0xYourTokenAddress TOKEN_TYPE=tax npx hardhat run scripts/verify-token.js --network arcTestnet
```

## Creating Tokens

### Normal Token Creation

```javascript
const factory = await ethers.getContractAt("ArcTokenFactory", normalFactoryAddress);
const creationFee = await factory.creationFee();

const tx = await factory.createToken(
  "My Token",           // name
  "MTK",                // symbol
  18,                   // decimals
  ethers.parseEther("1000000"),  // initial supply
  ethers.parseEther("10000000"), // max supply (0 for unlimited)
  true,                 // mintable
  true,                 // burnable
  true,                 // pausable
  { value: creationFee }
);

const receipt = await tx.wait();
```

### Tax Token Creation

```javascript
const taxFactory = await ethers.getContractAt("ArcTaxTokenFactory", taxFactoryAddress);
const creationFee = await taxFactory.creationFee();

const tx = await taxFactory.createTaxToken(
  "Tax Token",          // name
  "TAX",                // symbol
  18,                   // decimals
  ethers.parseEther("1000000"),  // initial supply
  ethers.parseEther("10000000"), // max supply (0 for unlimited)
  true,                 // mintable
  true,                 // burnable
  true,                 // pausable
  500,                  // buy tax (5% = 500 basis points)
  1000,                 // sell tax (10% = 1000 basis points)
  taxWalletAddress,     // tax wallet
  { value: creationFee }
);

const receipt = await tx.wait();
```

### Batch Token Creation

```javascript
const configs = [
  {
    name: "Token 1",
    symbol: "TK1",
    decimals: 18,
    initialSupply: ethers.parseEther("1000000"),
    maxSupply: 0,
    mintable: true,
    burnable: true,
    pausable: false
  },
  // ... more tokens
];

const totalFee = creationFee * BigInt(configs.length);
const tx = await factory.batchCreateTokens(configs, { value: totalFee });
```

## Factory Management

### Update Creation Fee

```javascript
await factory.updateCreationFee(ethers.parseEther("0.02"));
```

### Withdraw Fees

```javascript
await factory.withdrawFees(recipientAddress);
```

### Recover Mistakenly Sent Tokens

If tokens are accidentally sent to the factory, the owner can recover them:

```javascript
// Recover ERC20 tokens sent to factory by mistake
await factory.recoverTokens(
  tokenAddress,      // Address of the token to recover
  recipientAddress,  // Address to receive the tokens
  amount            // Amount to recover
);
```

This feature protects users from losing tokens sent to the factory contract by mistake.

### Query Tokens

```javascript
// Get total tokens created
const total = await factory.totalTokensCreated();

// Get tokens by creator
const creatorTokens = await factory.getCreatorTokens(creatorAddress);

// Get token info
const tokenInfo = await factory.getTokenInfo(tokenId);

// Get paginated tokens
const tokens = await factory.getTokens(0, 10); // offset, limit
```

## Token Management

Once a token is created, the creator becomes the owner and can:

### Mint Tokens (if mintable)

```javascript
const token = await ethers.getContractAt("ArcToken", tokenAddress);
await token.mint(recipientAddress, amount);
```

### Pause/Unpause (if pausable)

```javascript
await token.pause();
await token.unpause();
```

### Blacklist Addresses

```javascript
await token.blacklist(addressToBlacklist);
await token.unblacklist(addressToUnblacklist);
```

### Update Max Supply

```javascript
await token.updateMaxSupply(newMaxSupply); // Can only decrease
```

## Tax Token Management

After creating a tax token, you can manage its tax configuration:

### Update Tax Rates

```javascript
const taxToken = await ethers.getContractAt("ArcTaxToken", tokenAddress);

// Update buy and sell tax (max 25%)
await taxToken.updateTax(
  300,  // 3% buy tax (300 basis points)
  500   // 5% sell tax (500 basis points)
);
```

### Set DEX Pairs

```javascript
// Add a DEX pair for tax detection
await taxToken.setDexPair(pairAddress, true);

// Remove a DEX pair
await taxToken.setDexPair(pairAddress, false);
```

### Manage Tax Exemptions

```javascript
// Exempt an address from taxes
await taxToken.setTaxExempt(addressToExempt, true);

// Remove tax exemption
await taxToken.setTaxExempt(addressToExempt, false);
```

### Update Tax Wallet

```javascript
await taxToken.updateTaxWallet(newTaxWalletAddress);
```

## Gas Optimization

The contracts are optimized for gas efficiency:
- Compiler optimization enabled (1000 runs)
- Via IR compilation for better optimization
- Efficient storage packing
- Minimal external calls
- Separate factories for reduced deployment size

## Security Features

- ReentrancyGuard on payable functions
- Owner-only administrative functions
- Input validation on all parameters
- Automatic refund of excess payments
- Blacklist functionality for compliance
- Maximum supply enforcement

## 📁 Contract ABIs

All contract ABIs are available in the `abi/` directory for easy integration:

- **ArcTokenFactory.json** - Normal token factory ABI
- **ArcTaxTokenFactory.json** - Tax token factory ABI
- **ArcToken.json** - Standard token ABI
- **ArcTaxToken.json** - Tax token ABI

### Quick Import

```javascript
// CommonJS
const { ArcTokenFactory, addresses } = require('./abi');

// ES6
import { ArcTokenFactory, addresses } from './abi';

// TypeScript
import { ArcTokenFactory, addresses, Networks } from './abi';
```

See [abi/README.md](./abi/README.md) for detailed usage examples with ethers.js, web3.js, and Python.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
