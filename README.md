# ArcFactory Token Factory

Professional token creation factory for Arc Network with dynamic fee adjustment and gas optimization.

## Deployed Contracts

### Arc Testnet
- **ArcTokenFactory**: `0x6702a3fFc7D6c7b6e89c946170765ae0d935179C`
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x6702a3fFc7D6c7b6e89c946170765ae0d935179C)

## Features

### Token Features
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

### Factory Features
- ✅ Dynamic creation fee adjustment (owner only)
- ✅ Gas-optimized deployment
- ✅ Batch token creation
- ✅ Token registry and tracking
- ✅ Creator token history
- ✅ Paginated token listing
- ✅ Fee withdrawal (owner only)
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

## Usage

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy Factory

```bash
npx hardhat run scripts/deploy.js --network arcTestnet
```

### Test Factory

```bash
npx hardhat run scripts/test-factory.js --network arcTestnet
```

### Verify Contract

```bash
npx hardhat verify --network arcTestnet <FACTORY_ADDRESS> "<INITIAL_FEE>"
```

## Creating Tokens

### Single Token Creation

```javascript
const factory = await ethers.getContractAt("ArcTokenFactory", factoryAddress);
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

## Gas Optimization

The contracts are optimized for gas efficiency:
- Compiler optimization enabled (200 runs)
- Via IR compilation for better optimization
- Efficient storage packing
- Minimal external calls
- Batch operations support

## Security Features

- ReentrancyGuard on payable functions
- Owner-only administrative functions
- Input validation on all parameters
- Automatic refund of excess payments
- Blacklist functionality for compliance
- Maximum supply enforcement

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
