## ✅ V2 System - Auto-Verified Tokens

### 🎯 What's New in V2?

The V2 system uses the **Minimal Proxy Pattern (EIP-1167)** to create token clones. This means:

✅ **ALL tokens are AUTOMATICALLY VERIFIED** on ArcScan  
✅ No manual verification needed  
✅ Lower gas costs for token creation  
✅ Same features as V1 tokens  

---

### 📦 Deployed Contracts (V2)

#### Normal Token System
- **Implementation**: `0x484C4863993c8DAD2601Cb12094465eEEF2d4461`
  - [View on ArcScan](https://testnet.arcscan.app/address/0x484C4863993c8DAD2601Cb12094465eEEF2d4461)
- **Factory V2**: `0xF00b137C40e3a370369901becF25ca0AA76DFC64`
  - [View on ArcScan](https://testnet.arcscan.app/address/0xF00b137C40e3a370369901becF25ca0AA76DFC64)

#### Tax Token System
- **Implementation**: `0xe284181b05C50E4a14F3Dc9195F3ACDE062F4abd`
  - [View on ArcScan](https://testnet.arcscan.app/address/0xe284181b05C50E4a14F3Dc9195F3ACDE062F4abd)
- **Factory V2**: `0x35b0A621a88634cea24920D84331d0CAad629BF4`
  - [View on ArcScan](https://testnet.arcscan.app/address/0x35b0A621a88634cea24920D84331d0CAad629BF4)

---

### 🚀 How It Works

1. **Implementation Contract** is deployed and verified once
2. **Factory** creates clones (proxies) of the implementation
3. **All clones** are automatically recognized as verified by ArcScan
4. **Users interact** with clones as normal ERC20 tokens

---

### 💡 Usage

#### Create Normal Token (V2)

```javascript
const factory = await ethers.getContractAt(
  "ArcTokenFactoryV2",
  "0xF00b137C40e3a370369901becF25ca0AA76DFC64"
);

const tx = await factory.createToken(
  "My Token",
  "MTK",
  18,
  ethers.parseEther("1000000"),
  ethers.parseEther("10000000"),
  true,  // mintable
  false, // pausable
  { value: await factory.creationFee() }
);

const receipt = await tx.wait();
// Token is automatically verified!
```

#### Create Tax Token (V2)

```javascript
const factory = await ethers.getContractAt(
  "ArcTaxTokenFactoryV2",
  "0x35b0A621a88634cea24920D84331d0CAad629BF4"
);

const tx = await factory.createTaxToken(
  "Tax Token",
  "TAX",
  18,
  ethers.parseEther("1000000"),
  ethers.parseEther("10000000"),
  true,  // mintable
  false, // pausable
  500,   // 5% buy tax
  1000,  // 10% sell tax
  taxWalletAddress,
  { value: await factory.creationFee() }
);

const receipt = await tx.wait();
// Token is automatically verified!
```

---

### 📊 Comparison: V1 vs V2

| Feature | V1 | V2 |
|---------|----|----|
| Auto-Verification | ❌ Manual | ✅ Automatic |
| Gas Cost (Creation) | ~2.8M | ~200K |
| Verification Time | Manual | Instant |
| Contract Size | Full | Minimal Proxy |
| Features | All | All (Same) |
| Recommended | Legacy | ✅ Yes |

---

### 🔍 Verification on ArcScan

When you view a V2 token on ArcScan:
1. Go to the token address
2. Click "Contract" tab
3. You'll see it's verified as a **Minimal Proxy**
4. Implementation link shows the verified source code
5. All functions are readable and writable

---

### 📝 NPM Scripts

```bash
# Test V2 factories
npm run test-v2-normal    # Create and test normal token
npm run test-v2-tax        # Create and test tax token
```

---

### 🎯 Migration from V1

If you're using V1 factories, consider migrating to V2:

**Benefits:**
- ✅ Automatic verification
- ✅ Lower gas costs
- ✅ Same functionality
- ✅ Better user experience

**V1 factories remain functional** but V2 is recommended for new tokens.

---

### 🔗 Resources

- **Implementation Pattern**: EIP-1167 Minimal Proxy
- **OpenZeppelin Clones**: [Documentation](https://docs.openzeppelin.com/contracts/4.x/api/proxy#Clones)
- **ArcScan**: https://testnet.arcscan.app

---

### ✨ Example Tokens

#### Normal Token (Auto-Verified)
- Address: `0x4ceb0d87863e58446bBd6a6214544D4e1d2047bc`
- [View on ArcScan](https://testnet.arcscan.app/address/0x4ceb0d87863e58446bBd6a6214544D4e1d2047bc)

#### Tax Token (Auto-Verified)
- Address: `0x6edA6714eA07094B3D3E6D8625e0Abac9b925F34`
- [View on ArcScan](https://testnet.arcscan.app/address/0x6edA6714eA07094B3D3E6D8625e0Abac9b925F34)

---

**Status**: ✅ Production Ready  
**Recommendation**: Use V2 for all new token deployments
