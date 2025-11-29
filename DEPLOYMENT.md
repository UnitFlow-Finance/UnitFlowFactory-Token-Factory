# Deployment Information

## Arc Testnet Deployment

### Normal Token Factory
- **Address**: `0x56A0BBC2fC3d1cAbA740513b0327403D0Ca37b61`
- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **Deployer**: `0x3682652cD0995E6972CCF7245a1CAea95C2955b8`
- **Initial Creation Fee**: 0.01 ARC
- **Deployment TX**: `0xce9003bbc98e0bbfc281b1e30116c3c3912fea48d54f8b8955a9da237e67b156`
- **Verified**: ✅ Yes
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x56A0BBC2fC3d1cAbA740513b0327403D0Ca37b61)

### Tax Token Factory
- **Address**: `0x82Be30041323148097d1b77F38593b26D3f35C5A`
- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **Deployer**: `0x3682652cD0995E6972CCF7245a1CAea95C2955b8`
- **Initial Creation Fee**: 0.01 ARC
- **Deployment TX**: `0x49b9ea6faa61ac7e172c13209bf9c6dfe2d1ff86462e0e34c76ef751c747e3e4`
- **Verified**: ✅ Yes
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x82Be30041323148097d1b77F38593b26D3f35C5A)

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

## Contract Features

### ArcTokenFactory (Normal Tokens)
- Dynamic fee adjustment (owner only)
- Token creation with customizable parameters
- Token registry and tracking
- Creator history
- Fee withdrawal
- Gas optimized
- Reentrancy protected

### ArcTaxTokenFactory (Tax Tokens)
- All normal factory features
- Tax token creation with buy/sell tax
- Configurable tax rates (0-25%)
- Tax wallet management
- DEX pair configuration
- Tax exemption system

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
