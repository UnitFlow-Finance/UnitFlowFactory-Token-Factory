# Token Verification Guide

## 🔍 Auto-Verification for Factory-Created Tokens

Tokens created by the ArcFactory factories can be verified on ArcScan. However, due to how factory contracts work, verification requires matching the exact compiler settings used when the factory was deployed.

## ⚠️ Important Note

**Compiler Settings Must Match**: The tokens are created with the same compiler settings as the factory that deployed them. The current factories were deployed with:
- Solidity: 0.8.20
- Optimizer: Enabled
- Optimizer Runs: **10000**
- Via IR: Enabled

## 📝 Verification Methods

### Method 1: Using the Verification Script (Recommended)

```bash
# For normal tokens
TOKEN_ADDRESS=0xYourTokenAddress TOKEN_TYPE=normal npx hardhat run scripts/verify-token.js --network arcTestnet

# For tax tokens
TOKEN_ADDRESS=0xYourTokenAddress TOKEN_TYPE=tax npx hardhat run scripts/verify-token.js --network arcTestnet
```

### Method 2: Manual Verification

#### Step 1: Get Token Details

You need the constructor arguments used when creating the token. You can get these from:
1. The transaction that created the token
2. The factory's `getTokenInfo` function
3. The token contract itself

#### Step 2: Verify on ArcScan

**For Normal Tokens:**
```bash
npx hardhat verify --network arcTestnet --contract contracts/ArcToken.sol:ArcToken \
  <TOKEN_ADDRESS> \
  "<NAME>" \
  "<SYMBOL>" \
  <DECIMALS> \
  "<INITIAL_SUPPLY>" \
  "<MAX_SUPPLY>" \
  <MINTABLE> \
  <BURNABLE> \
  <PAUSABLE> \
  "<OWNER_ADDRESS>"
```

**For Tax Tokens:**
```bash
npx hardhat verify --network arcTestnet --contract contracts/ArcTaxToken.sol:ArcTaxToken \
  <TOKEN_ADDRESS> \
  "<NAME>" \
  "<SYMBOL>" \
  <DECIMALS> \
  "<INITIAL_SUPPLY>" \
  "<MAX_SUPPLY>" \
  <MINTABLE> \
  <BURNABLE> \
  <PAUSABLE> \
  <BUY_TAX> \
  <SELL_TAX> \
  "<TAX_WALLET>" \
  "<OWNER_ADDRESS>"
```

### Method 3: Create and Auto-Verify

Use the enhanced creation scripts that automatically verify after creation:

```bash
# Create and verify normal token
npx hardhat run scripts/create-and-verify-token.js --network arcTestnet

# Create and verify tax token
npx hardhat run scripts/create-and-verify-tax-token.js --network arcTestnet
```

## 🔧 Troubleshooting

### Error: "Bytecode doesn't match"

This means the compiler settings don't match. Ensure:
1. You're using Solidity 0.8.20
2. Optimizer is enabled with 10000 runs
3. Via IR is enabled
4. You're compiling with the exact same code

**Solution**: Make sure your `hardhat.config.js` has:
```javascript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
    viaIR: true,
  },
}
```

Then recompile:
```bash
npx hardhat clean
npx hardhat compile
```

### Error: "Already Verified"

The token is already verified! Check it on ArcScan:
```
https://testnet.arcscan.app/address/<TOKEN_ADDRESS>#code
```

### Error: "Invalid constructor arguments"

Make sure you're providing the arguments in the correct order and format:
- Strings should be in quotes
- Numbers (uint256) should be in quotes if they're large
- Booleans should be `true` or `false` (no quotes)
- Addresses should be in quotes

## 📊 Example: Verifying a Normal Token

Let's say you created a token with these parameters:
- Name: "My Token"
- Symbol: "MTK"
- Decimals: 18
- Initial Supply: 1,000,000 (1000000000000000000000000 in wei)
- Max Supply: 10,000,000 (10000000000000000000000000 in wei)
- Mintable: true
- Burnable: true
- Pausable: false
- Owner: 0x3682652cD0995E6972CCF7245a1CAea95C2955b8

**Verification command:**
```bash
npx hardhat verify --network arcTestnet --contract contracts/ArcToken.sol:ArcToken \
  0xYourTokenAddress \
  "My Token" \
  "MTK" \
  18 \
  "1000000000000000000000000" \
  "10000000000000000000000000" \
  true \
  true \
  false \
  "0x3682652cD0995E6972CCF7245a1CAea95C2955b8"
```

## 📊 Example: Verifying a Tax Token

Let's say you created a tax token with these parameters:
- Name: "Tax Token"
- Symbol: "TAX"
- Decimals: 18
- Initial Supply: 1,000,000
- Max Supply: 10,000,000
- Mintable: true
- Burnable: true
- Pausable: false
- Buy Tax: 500 (5%)
- Sell Tax: 1000 (10%)
- Tax Wallet: 0x3682652cD0995E6972CCF7245a1CAea95C2955b8
- Owner: 0x3682652cD0995E6972CCF7245a1CAea95C2955b8

**Verification command:**
```bash
npx hardhat verify --network arcTestnet --contract contracts/ArcTaxToken.sol:ArcTaxToken \
  0xYourTokenAddress \
  "Tax Token" \
  "TAX" \
  18 \
  "1000000000000000000000000" \
  "10000000000000000000000000" \
  true \
  true \
  false \
  500 \
  1000 \
  "0x3682652cD0995E6972CCF7245a1CAea95C2955b8" \
  "0x3682652cD0995E6972CCF7245a1CAea95C2955b8"
```

## 🤖 Automated Verification

For developers integrating the factory, you can automate verification by:

1. **Listening to TokenCreated events**
2. **Extracting constructor arguments**
3. **Calling the verification API**

Example:
```javascript
// Listen for token creation
factory.on("TokenCreated", async (tokenId, tokenAddress, creator, name, symbol, initialSupply, tokenType) => {
  // Wait for indexing
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Verify the token
  await verifyToken(tokenAddress, constructorArgs);
});
```

## 📚 Additional Resources

- **Hardhat Verify Plugin**: [Documentation](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
- **ArcScan API**: https://testnet.arcscan.app/api
- **Factory Addresses**:
  - Normal: `0x6441d6384176a01f65034A96E31c4433da82aa91`
  - Tax: `0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2`

## 🆘 Support

If you're having trouble verifying your token:
1. Check that compiler settings match (10000 optimizer runs)
2. Ensure you have the correct constructor arguments
3. Try recompiling with `npx hardhat clean && npx hardhat compile`
4. Open an issue on GitHub with the token address and error message

---

**Note**: Verification is optional but recommended. Verified contracts allow users to:
- Read the source code on ArcScan
- Interact with the contract directly through the explorer
- Verify the contract's functionality and security
- Build trust with token holders
