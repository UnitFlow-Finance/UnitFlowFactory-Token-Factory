// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ArcToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArcTokenFactory
 * @dev Gas-optimized token factory with dynamic fee adjustment
 */
contract ArcTokenFactory is Ownable, ReentrancyGuard {
    uint256 public creationFee;
    uint256 public totalTokensCreated;
    
    struct TokenInfo {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 createdAt;
        uint8 decimals;
        uint256 initialSupply;
    }
    
    // Mapping from token ID to token info
    mapping(uint256 => TokenInfo) public tokens;
    
    // Mapping from creator to their token IDs
    mapping(address => uint256[]) public creatorTokens;
    
    // Mapping from token address to token ID
    mapping(address => uint256) public tokenToId;
    
    event TokenCreated(
        uint256 indexed tokenId,
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 initialSupply
    );
    
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeesWithdrawn(address indexed recipient, uint256 amount);
    
    constructor(uint256 initialFee_) Ownable(msg.sender) {
        creationFee = initialFee_;
    }
    
    /**
     * @dev Create a new token with specified parameters
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals
     * @param initialSupply_ Initial supply (in base units)
     * @param maxSupply_ Maximum supply (0 for unlimited)
     * @param mintable_ Whether additional minting is allowed
     * @param burnable_ Whether tokens can be burned
     * @param pausable_ Whether token transfers can be paused
     * @return tokenAddress Address of the newly created token
     */
    function createToken(
        string calldata name_,
        string calldata symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        uint256 maxSupply_,
        bool mintable_,
        bool burnable_,
        bool pausable_
    ) external payable nonReentrant returns (address tokenAddress) {
        require(msg.value >= creationFee, "Insufficient creation fee");
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(symbol_).length > 0, "Symbol cannot be empty");
        require(decimals_ <= 18, "Decimals too high");
        
        if (maxSupply_ > 0) {
            require(initialSupply_ <= maxSupply_, "Initial supply exceeds max supply");
        }
        
        // Create new token
        ArcToken token = new ArcToken(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            maxSupply_,
            mintable_,
            burnable_,
            pausable_,
            msg.sender
        );
        
        tokenAddress = address(token);
        uint256 tokenId = totalTokensCreated;
        
        // Store token info
        tokens[tokenId] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name_,
            symbol: symbol_,
            createdAt: block.timestamp,
            decimals: decimals_,
            initialSupply: initialSupply_
        });
        
        creatorTokens[msg.sender].push(tokenId);
        tokenToId[tokenAddress] = tokenId;
        
        totalTokensCreated++;
        
        emit TokenCreated(
            tokenId,
            tokenAddress,
            msg.sender,
            name_,
            symbol_,
            initialSupply_
        );
        
        // Refund excess payment
        if (msg.value > creationFee) {
            (bool success, ) = msg.sender.call{value: msg.value - creationFee}("");
            require(success, "Refund failed");
        }
        
        return tokenAddress;
    }
    
    /**
     * @dev Update the token creation fee
     * @param newFee New fee amount in wei
     */
    function updateCreationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = newFee;
        emit CreationFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraw accumulated fees
     * @param recipient Address to receive the fees
     */
    function withdrawFees(address payable recipient) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FeesWithdrawn(recipient, balance);
    }
    
    /**
     * @dev Get tokens created by a specific address
     * @param creator Address of the creator
     * @return Array of token IDs
     */
    function getCreatorTokens(address creator) external view returns (uint256[] memory) {
        return creatorTokens[creator];
    }
    
    /**
     * @dev Get token info by ID
     * @param tokenId ID of the token
     * @return Token information
     */
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        require(tokenId < totalTokensCreated, "Token does not exist");
        return tokens[tokenId];
    }
    
    /**
     * @dev Get token ID by address
     * @param tokenAddress Address of the token
     * @return Token ID
     */
    function getTokenId(address tokenAddress) external view returns (uint256) {
        uint256 tokenId = tokenToId[tokenAddress];
        require(tokens[tokenId].tokenAddress == tokenAddress, "Token not found");
        return tokenId;
    }
    
    /**
     * @dev Get paginated list of all tokens
     * @param offset Starting index
     * @param limit Number of tokens to return
     * @return Array of token information
     */
    function getTokens(uint256 offset, uint256 limit) 
        external 
        view 
        returns (TokenInfo[] memory) 
    {
        require(offset < totalTokensCreated, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > totalTokensCreated) {
            end = totalTokensCreated;
        }
        
        uint256 length = end - offset;
        TokenInfo[] memory result = new TokenInfo[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = tokens[offset + i];
        }
        
        return result;
    }
    
    /**
     * @dev Batch create multiple tokens (gas optimized)
     * @param configs Array of token configurations
     * @return addresses Array of created token addresses
     */
    function batchCreateTokens(
        TokenConfig[] calldata configs
    ) external payable nonReentrant returns (address[] memory addresses) {
        uint256 totalFee = creationFee * configs.length;
        require(msg.value >= totalFee, "Insufficient creation fee");
        
        addresses = new address[](configs.length);
        
        for (uint256 i = 0; i < configs.length; i++) {
            TokenConfig calldata config = configs[i];
            
            require(bytes(config.name).length > 0, "Name cannot be empty");
            require(bytes(config.symbol).length > 0, "Symbol cannot be empty");
            require(config.decimals <= 18, "Decimals too high");
            
            if (config.maxSupply > 0) {
                require(config.initialSupply <= config.maxSupply, "Initial supply exceeds max supply");
            }
            
            ArcToken token = new ArcToken(
                config.name,
                config.symbol,
                config.decimals,
                config.initialSupply,
                config.maxSupply,
                config.mintable,
                config.burnable,
                config.pausable,
                msg.sender
            );
            
            address tokenAddress = address(token);
            addresses[i] = tokenAddress;
            uint256 tokenId = totalTokensCreated;
            
            tokens[tokenId] = TokenInfo({
                tokenAddress: tokenAddress,
                creator: msg.sender,
                name: config.name,
                symbol: config.symbol,
                createdAt: block.timestamp,
                decimals: config.decimals,
                initialSupply: config.initialSupply
            });
            
            creatorTokens[msg.sender].push(tokenId);
            tokenToId[tokenAddress] = tokenId;
            
            totalTokensCreated++;
            
            emit TokenCreated(
                tokenId,
                tokenAddress,
                msg.sender,
                config.name,
                config.symbol,
                config.initialSupply
            );
        }
        
        // Refund excess payment
        if (msg.value > totalFee) {
            (bool success, ) = msg.sender.call{value: msg.value - totalFee}("");
            require(success, "Refund failed");
        }
        
        return addresses;
    }
    
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
    
    receive() external payable {}
}
