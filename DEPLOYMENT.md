# Deployment Information

## 🚀 Production Deployment - Arc Testnet

### Normal Token Factory (Final Version)
- **Contract**: ArcTokenFactory
- **Address**: `0x6441d6384176a01f65034A96E31c4433da82aa91`
- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **Deployer**: `0x3682652cD0995E6972CCF7245a1CAea95C2955b8`
- **Creation Fee**: 0.01 ARC
- **Deployment TX**: `0x6b0af0969321d0349d47db5fb01ae4250fde0704fe303a3d6192a520c9d345f5`
- **Verified**: ✅ Yes
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x6441d6384176a01f65034A96E31c4433da82aa91)
- **Status**: 🟢 Production Ready

**Features:**
- Create standard ERC20 tokens
- Customizable parameters (decimals, supply, features)
- Token recovery function
- Dynamic fee adjustment
- Fee withdrawal

### Tax Token Factory (Final Version)
- **Contract**: ArcTaxTokenFactory
- **Address**: `0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2`
- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **Deployer**: `0x3682652cD0995E6972CCF7245a1CAea95C2955b8`
- **Creation Fee**: 0.01 ARC
- **Deployment TX**: `0x3e641d846ffec81a630d7b53194d83fe91b8e2b0994e6be9d0ec3f237c3dfa7a`
- **Verified**: ✅ Yes
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2)
- **Status**: 🟢 Production Ready

**Features:**
- Create tokens with buy/sell tax (0-25%)
- All normal token features
- DEX pair management
- Tax exemption system
- Token recovery function
- Dynamic tax updates

### Test Tokens (Examples)

#### Normal Token
- **Address**: `0x0e1c24154A2DA438142E108ea92f519f3B18306b`
- **Name**: Test Token
- **Symbol**: TEST
- **Decimals**: 18
- **Initial Supply**: 1,000,000 TEST
- **Max Supply**: 10,000,000 TEST
- **Features**: Mintable, Burnable, Pausable
- **Creation TX**: `0x46a4fd3c1de8b87868a5b1668c63e02f95084f1cffa9a53058ccc93a85ad0769`
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x0e1c24154A2DA438142E108ea92f519f3B18306b)

#### Tax Token
- **Address**: `0xf43ef7A19d1CdD678A9362CB5C2a74FCAAa5E118`
- **Name**: Tax Token
- **Symbol**: TAX
- **Decimals**: 18
- **Initial Supply**: 1,000,000 TAX
- **Max Supply**: 10,000,000 TAX
- **Buy Tax**: 5% (500 basis points)
- **Sell Tax**: 10% (1000 basis points)
- **Features**: Mintable, Burnable, Pausable, Tax System
- **Creation TX**: `0x3d9adc3ea64baefe35cb803cc62278a07c054e3f8b3472dba9241c594dc5f5e8`
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0xf43ef7A19d1CdD678A9362CB5C2a74FCAAa5E118)

## 📋 Why Two Separate Factories?

The project uses two separate factories instead of one unified factory due to **Ethereum's 24KB contract size limit** (EIP-170).

**Technical Explanation:**
- Maximum contract size: 24KB
- ArcToken bytecode: ~12KB
- ArcTaxToken bytecode: ~14KB
- Factory logic: ~3KB
- **Combined total**: ~29KB (exceeds limit)

**Benefits of Separate Factories:**
- ✅ No size limitations
- ✅ Better gas efficiency
- ✅ Focused functionality
- ✅ Independent upgrades
- ✅ Easier maintenance
- ✅ Clear separation of concerns

Users simply choose the appropriate factory based on their needs:
- Need standard token → Use Normal Factory
- Need tax token → Use Tax Factory

## Contract Features

### ArcTokenFactory (Normal Tokens)
- Dynamic fee adjustment (owner only)
- Token creation with customizable parameters
- Token registry and tracking
- Creator history
- Fee withdrawal
- Token recovery (rescue mistakenly sent tokens)
- Gas optimized
- Reentrancy protected

### ArcTaxTokenFactory (Tax Tokens)
- All normal factory features
- Tax token creation with buy/sell tax
- Configurable tax rates (0-25%)
- Tax wallet management
- DEX pair configuration
- Tax exemption system
- Token recovery (rescue mistakenly sent tokens)

### ArcToken (Normal)
- ERC20 standard
- ERC20Burnable
- ERC20Pausable (optional)
- ERC20Permit (gasless approvals)
- Ownable
- Mintable (optional)
- Max supply cap (optional)
- Blacklist functionality
- Customizable decimals

### ArcTaxToken (Tax)
- All normal token features
- Buy tax (0-25%)
- Sell tax (0-25%)
- DEX pair detection
- Tax exemption system
- Dynamic tax updates
- Tax wallet configuration

## Gas Costs

### Factory Deployment
- Gas used: ~3,500,000
- Optimization: 200 runs with Via IR

### Token Creation
- Single token: ~2,800,000 gas
- Batch creation: ~2,600,000 gas per token (optimized)

## Management Scripts

### Update Creation Fee
```bash
npx hardhat run scripts/update-fee.js --network arcTestnet 0.02
```

### Withdraw Fees
```bash
npx hardhat run scripts/withdraw-fees.js --network arcTestnet [RECIPIENT_ADDRESS]
```

### List All Tokens
```bash
npx hardhat run scripts/list-tokens.js --network arcTestnet
```

### Create Test Tokens
```bash
# Normal token
npx hardhat run scripts/test-factory.js --network arcTestnet

# Tax token
npx hardhat run scripts/test-tax-token.js --network arcTestnet
```

## Verification

The contract is verified on ArcScan and can be interacted with directly through the explorer:
- Read Contract: View all public state
- Write Contract: Execute functions (requires wallet connection)

## Security Considerations

1. **Owner Controls**: Only the factory owner can update fees and withdraw
2. **Token Ownership**: Each token's owner is the creator
3. **Reentrancy Protection**: All payable functions are protected
4. **Input Validation**: All parameters are validated
5. **Refund Mechanism**: Excess payments are automatically refunded

## Future Enhancements

Potential features for future versions:
- Token templates/presets
- Liquidity pool creation integration
- Token vesting schedules
- Multi-signature ownership
- Governance features
- Token migration tools
- Analytics dashboard

## Support

For issues or questions:
- GitHub: [ArcFlow-Finance/ArcFactory-Token-Factory](https://github.com/ArcFlow-Finance/ArcFactory-Token-Factory)
- Explorer: [ArcScan](https://testnet.arcscan.app)
