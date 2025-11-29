// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ArcTaxToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ArcTaxTokenFactory
 * @dev Factory for creating tax tokens with buy/sell tax functionality
 */
contract ArcTaxTokenFactory is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    uint256 public creationFee;
    uint256 public totalTokensCreated;
    
    struct TokenInfo {
        address tokenAddress;
        address creator;
        uint256 createdAt;
    }
    
    mapping(uint256 => TokenInfo) public tokens;
    mapping(address => uint256[]) public creatorTokens;
    mapping(address => uint256) public tokenToId;
    
    event TaxTokenCreated(
        uint256 indexed tokenId,
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 buyTax,
        uint256 sellTax
    );
    
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeesWithdrawn(address indexed recipient, uint256 amount);
    event TokensRecovered(address indexed token, address indexed recipient, uint256 amount);
    
    constructor(uint256 initialFee_) Ownable(msg.sender) {
        creationFee = initialFee_;
    }
    
    function createTaxToken(
        string calldata name_,
        string calldata symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        uint256 maxSupply_,
        bool mintable_,
        bool burnable_,
        bool pausable_,
        uint256 buyTax_,
        uint256 sellTax_,
        address taxWallet_
    ) external payable nonReentrant returns (address tokenAddress) {
        require(msg.value >= creationFee, "Insufficient creation fee");
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(symbol_).length > 0, "Symbol cannot be empty");
        require(decimals_ <= 18, "Decimals too high");
        require(taxWallet_ != address(0), "Invalid tax wallet");
        
        if (maxSupply_ > 0) {
            require(initialSupply_ <= maxSupply_, "Initial supply exceeds max supply");
        }
        
        ArcTaxToken token = new ArcTaxToken(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            maxSupply_,
            mintable_,
            burnable_,
            pausable_,
            buyTax_,
            sellTax_,
            taxWallet_,
            msg.sender
        );
        
        tokenAddress = address(token);
        uint256 tokenId = totalTokensCreated;
        
        tokens[tokenId] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        
        creatorTokens[msg.sender].push(tokenId);
        tokenToId[tokenAddress] = tokenId;
        
        totalTokensCreated++;
        
        emit TaxTokenCreated(
            tokenId,
            tokenAddress,
            msg.sender,
            name_,
            symbol_,
            buyTax_,
            sellTax_
        );
        
        if (msg.value > creationFee) {
            (bool success, ) = msg.sender.call{value: msg.value - creationFee}("");
            require(success, "Refund failed");
        }
        
        return tokenAddress;
    }
    
    function updateCreationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = newFee;
        emit CreationFeeUpdated(oldFee, newFee);
    }
    
    function withdrawFees(address payable recipient) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FeesWithdrawn(recipient, balance);
    }
    
    function getCreatorTokens(address creator) external view returns (uint256[] memory) {
        return creatorTokens[creator];
    }
    
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        require(tokenId < totalTokensCreated, "Token does not exist");
        return tokens[tokenId];
    }
    
    /**
     * @dev Recover ERC20 tokens mistakenly sent to the factory
     * @param token Address of the token to recover
     * @param recipient Address to receive the recovered tokens
     * @param amount Amount of tokens to recover
     */
    function recoverTokens(
        address token,
        address recipient,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(token != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransfer(recipient, amount);
        
        emit TokensRecovered(token, recipient, amount);
    }
    
    receive() external payable {}
}
