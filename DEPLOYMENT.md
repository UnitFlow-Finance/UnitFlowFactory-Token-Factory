# Deployment Information

## Arc Testnet Deployment

### Factory Contract
- **Address**: `0x6702a3fFc7D6c7b6e89c946170765ae0d935179C`
- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **Deployer**: `0x3682652cD0995E6972CCF7245a1CAea95C2955b8`
- **Initial Creation Fee**: 0.01 ARC
- **Deployment TX**: `0x4f7ece60e1ae4f37e9845305a86a224360c7aa6e4514f66bd0faf87005404d7b`
- **Verified**: ✅ Yes
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x6702a3fFc7D6c7b6e89c946170765ae0d935179C)

### Test Token (Example)
- **Address**: `0x0e1c24154A2DA438142E108ea92f519f3B18306b`
- **Name**: Test Token
- **Symbol**: TEST
- **Decimals**: 18
- **Initial Supply**: 1,000,000 TEST
- **Max Supply**: 10,000,000 TEST
- **Features**: Mintable, Burnable, Pausable
- **Creation TX**: `0x46a4fd3c1de8b87868a5b1668c63e02f95084f1cffa9a53058ccc93a85ad0769`
- **Explorer**: [View on ArcScan](https://testnet.arcscan.app/address/0x0e1c24154A2DA438142E108ea92f519f3B18306b)

## Contract Features

### ArcTokenFactory
- Dynamic fee adjustment (owner only)
- Token creation with customizable parameters
- Batch token creation
- Token registry and tracking
- Creator history
- Fee withdrawal
- Gas optimized
- Reentrancy protected

### ArcToken
- ERC20 standard
- ERC20Burnable
- ERC20Pausable (optional)
- ERC20Permit (gasless approvals)
- Ownable
- Mintable (optional)
- Max supply cap (optional)
- Blacklist functionality
- Customizable decimals

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

### Create Test Token
```bash
npx hardhat run scripts/test-factory.js --network arcTestnet
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
