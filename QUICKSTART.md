# Quick Start Guide

Get started with ArcFactory Token Factory in minutes.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Arc Testnet wallet with ARC tokens

## Installation

```bash
# Clone the repository
git clone https://github.com/ArcFlow-Finance/ArcFactory-Token-Factory.git
cd ArcFactory-Token-Factory

# Install dependencies
npm install
```

## Configuration

The project is pre-configured for Arc Testnet. To use your own wallet:

1. Edit `hardhat.config.js`
2. Replace the private key in the `accounts` array
3. Never commit your private key!

## Create Your First Token

### Option 1: Using the Test Script

```bash
npm run test-factory
```

This creates a test token with default parameters.

### Option 2: Custom Token via Script

Create a new file `scripts/my-token.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;
  const factoryAddress = "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C";
  
  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);
  
  const creationFee = await factory.creationFee();
  
  const tx = await factory.createToken(
    "My Awesome Token",              // name
    "MAT",                           // symbol
    18,                              // decimals
    ethers.parseEther("1000000"),   // 1M initial supply
    ethers.parseEther("10000000"),  // 10M max supply
    true,                            // mintable
    true,                            // burnable
    false,                           // pausable
    { value: creationFee }
  );
  
  const receipt = await tx.wait();
  console.log("Token created! TX:", receipt.hash);
}

main().catch(console.error);
```

Run it:
```bash
npx hardhat run scripts/my-token.js --network arcTestnet
```

### Option 3: Direct Interaction via Ethers

```javascript
const { ethers } = require("hardhat");

async function createToken() {
  const [signer] = await ethers.getSigners();
  
  const factory = await ethers.getContractAt(
    "ArcTokenFactory",
    "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C"
  );
  
  const fee = await factory.creationFee();
  
  const tx = await factory.createToken(
    "Token Name",
    "SYMBOL",
    18,
    ethers.parseEther("1000000"),
    0, // unlimited max supply
    true,
    true,
    false,
    { value: fee }
  );
  
  return await tx.wait();
}
```

## Common Use Cases

### 1. Fixed Supply Token (No Minting)

```javascript
await factory.createToken(
  "Fixed Token",
  "FIX",
  18,
  ethers.parseEther("1000000"),  // 1M total supply
  ethers.parseEther("1000000"),  // Same as initial = fixed
  false,                          // NOT mintable
  true,                           // burnable
  false,                          // not pausable
  { value: creationFee }
);
```

### 2. Governance Token (Mintable, Pausable)

```javascript
await factory.createToken(
  "Governance Token",
  "GOV",
  18,
  ethers.parseEther("10000000"),   // 10M initial
  ethers.parseEther("100000000"),  // 100M max
  true,                             // mintable
  true,                             // burnable
  true,                             // pausable
  { value: creationFee }
);
```

### 3. Utility Token (Unlimited Supply)

```javascript
await factory.createToken(
  "Utility Token",
  "UTIL",
  18,
  ethers.parseEther("50000000"),  // 50M initial
  0,                               // unlimited max supply
  true,                            // mintable
  true,                            // burnable
  false,                           // not pausable
  { value: creationFee }
);
```

### 4. Stablecoin-like (Pausable, Blacklist)

```javascript
// Create token
const tx = await factory.createToken(
  "Stable Coin",
  "STBL",
  6,  // 6 decimals like USDC
  ethers.parseUnits("1000000", 6),  // 1M initial
  0,                                 // unlimited
  true,                              // mintable
  true,                              // burnable
  true,                              // pausable
  { value: creationFee }
);

const receipt = await tx.wait();
// Get token address from event
const tokenAddress = /* parse from event */;

// Later, manage the token
const token = await ethers.getContractAt("ArcToken", tokenAddress);

// Blacklist an address
await token.blacklist("0x...");

// Pause in emergency
await token.pause();
```

## Managing Your Token

After creating a token, you own it and can:

### Mint More Tokens (if mintable)

```javascript
const token = await ethers.getContractAt("ArcToken", tokenAddress);
await token.mint(recipientAddress, ethers.parseEther("1000"));
```

### Pause Transfers (if pausable)

```javascript
await token.pause();
// ... handle emergency ...
await token.unpause();
```

### Blacklist Addresses

```javascript
await token.blacklist(badActorAddress);
// Later, if needed:
await token.unblacklist(badActorAddress);
```

### Transfer Ownership

```javascript
await token.transferOwnership(newOwnerAddress);
```

## Batch Token Creation

Create multiple tokens in one transaction:

```bash
npm run batch-create
```

Or customize `scripts/batch-create.js` with your token configs.

## Utility Commands

```bash
# List all created tokens
npm run list-tokens

# Update creation fee (owner only)
npm run update-fee 0.02

# Withdraw accumulated fees (owner only)
npm run withdraw

# Compile contracts
npm run compile
```

## Viewing Your Tokens

All tokens are automatically verified on ArcScan:

```
https://testnet.arcscan.app/address/YOUR_TOKEN_ADDRESS
```

You can:
- View token details
- See all transactions
- Read contract state
- Write to contract (with wallet connected)

## Getting Help

- **API Documentation**: See [API.md](./API.md)
- **Deployment Info**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Full README**: See [README.md](./README.md)

## Common Issues

### "Insufficient creation fee"
Make sure you're sending enough ARC with the transaction:
```javascript
const fee = await factory.creationFee();
// Use this fee value in your transaction
```

### "Initial supply exceeds max supply"
Your initial supply must be <= max supply (unless max supply is 0).

### "Decimals too high"
Maximum decimals is 18.

### Transaction fails
Check your wallet has enough ARC for:
- Creation fee
- Gas costs

## Next Steps

1. Create your first token
2. Test minting, burning, transfers
3. Integrate with your dApp
4. Deploy to mainnet (when ready)

## Production Checklist

Before deploying to mainnet:

- [ ] Test all token features thoroughly
- [ ] Audit your token configuration
- [ ] Verify token economics
- [ ] Test emergency pause (if enabled)
- [ ] Document token contract address
- [ ] Set up monitoring
- [ ] Prepare announcement
- [ ] Consider security audit

## Support

Need help? Open an issue on GitHub:
https://github.com/ArcFlow-Finance/ArcFactory-Token-Factory/issues
