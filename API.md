# API Documentation

## ArcTokenFactory

### State Variables

#### `creationFee`
```solidity
uint256 public creationFee
```
Current fee required to create a token (in wei).

#### `totalTokensCreated`
```solidity
uint256 public totalTokensCreated
```
Total number of tokens created through the factory.

### Functions

#### `createToken`
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

Creates a new token with specified parameters.

**Parameters:**
- `name_`: Token name
- `symbol_`: Token symbol
- `decimals_`: Number of decimals (max 18)
- `initialSupply_`: Initial token supply in base units
- `maxSupply_`: Maximum supply (0 for unlimited)
- `mintable_`: Whether additional minting is allowed
- `burnable_`: Whether tokens can be burned
- `pausable_`: Whether transfers can be paused

**Returns:**
- `tokenAddress`: Address of the newly created token

**Requirements:**
- `msg.value >= creationFee`
- Name and symbol cannot be empty
- Decimals must be <= 18
- Initial supply must be <= max supply (if max supply > 0)

**Events:**
- `TokenCreated(tokenId, tokenAddress, creator, name, symbol, initialSupply)`

---

#### `batchCreateTokens`
```solidity
function batchCreateTokens(
    TokenConfig[] calldata configs
) external payable returns (address[] memory addresses)
```

Creates multiple tokens in a single transaction (gas optimized).

**Parameters:**
- `configs`: Array of token configurations

**Returns:**
- `addresses`: Array of created token addresses

**Requirements:**
- `msg.value >= creationFee * configs.length`
- Each config must meet the same requirements as `createToken`

---

#### `updateCreationFee`
```solidity
function updateCreationFee(uint256 newFee) external onlyOwner
```

Updates the token creation fee.

**Parameters:**
- `newFee`: New fee amount in wei

**Requirements:**
- Caller must be the factory owner

**Events:**
- `CreationFeeUpdated(oldFee, newFee)`

---

#### `withdrawFees`
```solidity
function withdrawFees(address payable recipient) external onlyOwner
```

Withdraws accumulated fees from the factory.

**Parameters:**
- `recipient`: Address to receive the fees

**Requirements:**
- Caller must be the factory owner
- Recipient cannot be zero address
- Factory must have balance > 0

**Events:**
- `FeesWithdrawn(recipient, amount)`

---

#### `getCreatorTokens`
```solidity
function getCreatorTokens(address creator) external view returns (uint256[] memory)
```

Returns all token IDs created by a specific address.

**Parameters:**
- `creator`: Address of the token creator

**Returns:**
- Array of token IDs

---

#### `getTokenInfo`
```solidity
function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory)
```

Returns detailed information about a token.

**Parameters:**
- `tokenId`: ID of the token

**Returns:**
- `TokenInfo` struct containing:
  - `tokenAddress`: Token contract address
  - `creator`: Address that created the token
  - `name`: Token name
  - `symbol`: Token symbol
  - `createdAt`: Timestamp of creation
  - `decimals`: Number of decimals
  - `initialSupply`: Initial supply

**Requirements:**
- Token ID must exist

---

#### `getTokenId`
```solidity
function getTokenId(address tokenAddress) external view returns (uint256)
```

Returns the token ID for a given token address.

**Parameters:**
- `tokenAddress`: Address of the token

**Returns:**
- Token ID

**Requirements:**
- Token must exist in the registry

---

#### `getTokens`
```solidity
function getTokens(uint256 offset, uint256 limit) external view returns (TokenInfo[] memory)
```

Returns a paginated list of tokens.

**Parameters:**
- `offset`: Starting index
- `limit`: Number of tokens to return

**Returns:**
- Array of `TokenInfo` structs

**Requirements:**
- Offset must be < totalTokensCreated

---

## ArcToken

### State Variables

#### `maxSupply`
```solidity
uint256 public maxSupply
```
Maximum token supply (0 for unlimited).

#### `mintable`
```solidity
bool public mintable
```
Whether additional minting is allowed.

#### `pausable`
```solidity
bool public pausable
```
Whether the token can be paused.

#### `blacklisted`
```solidity
mapping(address => bool) public blacklisted
```
Addresses that are blacklisted from transfers.

### Functions

#### `mint`
```solidity
function mint(address to, uint256 amount) external onlyOwner
```

Mints new tokens (only if mintable is enabled).

**Parameters:**
- `to`: Recipient address
- `amount`: Amount to mint

**Requirements:**
- Caller must be the token owner
- Minting must be enabled
- Total supply + amount must not exceed max supply

---

#### `burn`
```solidity
function burn(uint256 amount) public
```

Burns tokens from the caller's balance.

**Parameters:**
- `amount`: Amount to burn

**Inherited from:** ERC20Burnable

---

#### `burnFrom`
```solidity
function burnFrom(address account, uint256 amount) public
```

Burns tokens from a specified account (requires allowance).

**Parameters:**
- `account`: Account to burn from
- `amount`: Amount to burn

**Inherited from:** ERC20Burnable

---

#### `pause`
```solidity
function pause() external onlyOwner
```

Pauses all token transfers (only if pausable is enabled).

**Requirements:**
- Caller must be the token owner
- Pausing must be enabled

---

#### `unpause`
```solidity
function unpause() external onlyOwner
```

Unpauses token transfers.

**Requirements:**
- Caller must be the token owner

---

#### `blacklist`
```solidity
function blacklist(address account) external onlyOwner
```

Adds an address to the blacklist.

**Parameters:**
- `account`: Address to blacklist

**Requirements:**
- Caller must be the token owner

**Events:**
- `Blacklisted(account)`

---

#### `unblacklist`
```solidity
function unblacklist(address account) external onlyOwner
```

Removes an address from the blacklist.

**Parameters:**
- `account`: Address to unblacklist

**Requirements:**
- Caller must be the token owner

**Events:**
- `Unblacklisted(account)`

---

#### `updateMaxSupply`
```solidity
function updateMaxSupply(uint256 newMaxSupply) external onlyOwner
```

Updates the maximum supply (can only decrease or set to 0).

**Parameters:**
- `newMaxSupply`: New maximum supply

**Requirements:**
- Caller must be the token owner
- New max supply must be >= current total supply
- New max supply must be <= current max supply (or 0 for unlimited)

**Events:**
- `MaxSupplyUpdated(newMaxSupply)`

---

#### `permit`
```solidity
function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) public
```

Approves spending via signature (gasless approval).

**Inherited from:** ERC20Permit

---

## Events

### Factory Events

#### `TokenCreated`
```solidity
event TokenCreated(
    uint256 indexed tokenId,
    address indexed tokenAddress,
    address indexed creator,
    string name,
    string symbol,
    uint256 initialSupply
)
```

Emitted when a new token is created.

---

#### `CreationFeeUpdated`
```solidity
event CreationFeeUpdated(uint256 oldFee, uint256 newFee)
```

Emitted when the creation fee is updated.

---

#### `FeesWithdrawn`
```solidity
event FeesWithdrawn(address indexed recipient, uint256 amount)
```

Emitted when fees are withdrawn from the factory.

---

### Token Events

#### `Blacklisted`
```solidity
event Blacklisted(address indexed account)
```

Emitted when an address is blacklisted.

---

#### `Unblacklisted`
```solidity
event Unblacklisted(address indexed account)
```

Emitted when an address is removed from the blacklist.

---

#### `MaxSupplyUpdated`
```solidity
event MaxSupplyUpdated(uint256 newMaxSupply)
```

Emitted when the maximum supply is updated.

---

## Structs

### `TokenConfig`
```solidity
struct TokenConfig {
    string name;
    string symbol;
    uint8 decimals;
    uint256 initialSupply;
    uint256 maxSupply;
    bool mintable;
    bool burnable;
    bool pausable;
}
```

Configuration for batch token creation.

---

### `TokenInfo`
```solidity
struct TokenInfo {
    address tokenAddress;
    address creator;
    string name;
    string symbol;
    uint256 createdAt;
    uint8 decimals;
    uint256 initialSupply;
}
```

Information about a created token.

---

## Error Codes

Common revert messages:

- `"Insufficient creation fee"`: Sent value is less than required fee
- `"Name cannot be empty"`: Token name is empty
- `"Symbol cannot be empty"`: Token symbol is empty
- `"Decimals too high"`: Decimals > 18
- `"Initial supply exceeds max supply"`: Initial supply > max supply
- `"Minting is disabled"`: Attempting to mint when mintable is false
- `"Exceeds max supply"`: Minting would exceed max supply
- `"Pausing is disabled"`: Attempting to pause when pausable is false
- `"Sender is blacklisted"`: Transfer from blacklisted address
- `"Recipient is blacklisted"`: Transfer to blacklisted address
- `"Max supply below current supply"`: Attempting to set max supply below current supply
- `"Can only decrease max supply"`: Attempting to increase max supply
- `"Invalid recipient"`: Recipient is zero address
- `"No fees to withdraw"`: Factory has no balance
- `"Refund failed"`: Refund transaction failed
- `"Withdrawal failed"`: Withdrawal transaction failed
- `"Token does not exist"`: Token ID doesn't exist
- `"Token not found"`: Token address not in registry
- `"Offset out of bounds"`: Pagination offset is invalid

---

## Gas Estimates

Approximate gas costs on Arc Testnet:

| Operation | Gas Cost |
|-----------|----------|
| Factory Deployment | ~3,500,000 |
| Single Token Creation | ~2,800,000 |
| Batch Token Creation (per token) | ~2,600,000 |
| Update Creation Fee | ~30,000 |
| Withdraw Fees | ~35,000 |
| Token Mint | ~50,000 |
| Token Transfer | ~65,000 |
| Token Pause | ~30,000 |
| Blacklist Address | ~45,000 |

*Note: Actual gas costs may vary based on network conditions and transaction complexity.*
