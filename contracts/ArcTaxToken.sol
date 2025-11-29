// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title ArcTaxToken
 * @dev ERC20 token with buy/sell tax functionality
 */
contract ArcTaxToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    uint8 private _decimals;
    uint256 public maxSupply;
    bool public mintable;
    bool public pausable;
    
    // Tax configuration
    uint256 public buyTaxPercent;      // Buy tax in basis points (100 = 1%)
    uint256 public sellTaxPercent;     // Sell tax in basis points (100 = 1%)
    address public taxWallet;          // Wallet to receive tax
    
    uint256 public constant MAX_TAX = 2500; // Maximum 25% tax
    
    // DEX pairs for tax detection
    mapping(address => bool) public isDexPair;
    
    // Tax exemptions
    mapping(address => bool) public isTaxExempt;
    
    mapping(address => bool) public blacklisted;
    
    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event TaxUpdated(uint256 buyTax, uint256 sellTax);
    event TaxWalletUpdated(address indexed newTaxWallet);
    event DexPairUpdated(address indexed pair, bool status);
    event TaxExemptionUpdated(address indexed account, bool status);
    event TaxCollected(address indexed from, address indexed to, uint256 amount);
    
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        uint256 maxSupply_,
        bool mintable_,
        bool burnable_,
        bool pausable_,
        uint256 buyTax_,
        uint256 sellTax_,
        address taxWallet_,
        address owner_
    ) ERC20(name_, symbol_) ERC20Permit(name_) Ownable(owner_) {
        require(buyTax_ <= MAX_TAX, "Buy tax too high");
        require(sellTax_ <= MAX_TAX, "Sell tax too high");
        require(taxWallet_ != address(0), "Invalid tax wallet");
        
        _decimals = decimals_;
        maxSupply = maxSupply_;
        mintable = mintable_;
        pausable = pausable_;
        buyTaxPercent = buyTax_;
        sellTaxPercent = sellTax_;
        taxWallet = taxWallet_;
        
        // Owner and tax wallet are tax exempt by default
        isTaxExempt[owner_] = true;
        isTaxExempt[taxWallet_] = true;
        
        if (initialSupply_ > 0) {
            _mint(owner_, initialSupply_);
        }
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint new tokens (only if mintable is enabled)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(mintable, "Minting is disabled");
        require(maxSupply == 0 || totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Pause token transfers (only if pausable is enabled)
     */
    function pause() external onlyOwner {
        require(pausable, "Pausing is disabled");
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Update buy and sell tax percentages
     */
    function updateTax(uint256 newBuyTax, uint256 newSellTax) external onlyOwner {
        require(newBuyTax <= MAX_TAX, "Buy tax too high");
        require(newSellTax <= MAX_TAX, "Sell tax too high");
        buyTaxPercent = newBuyTax;
        sellTaxPercent = newSellTax;
        emit TaxUpdated(newBuyTax, newSellTax);
    }
    
    /**
     * @dev Update tax wallet address
     */
    function updateTaxWallet(address newTaxWallet) external onlyOwner {
        require(newTaxWallet != address(0), "Invalid tax wallet");
        taxWallet = newTaxWallet;
        isTaxExempt[newTaxWallet] = true;
        emit TaxWalletUpdated(newTaxWallet);
    }
    
    /**
     * @dev Set DEX pair for tax detection
     */
    function setDexPair(address pair, bool status) external onlyOwner {
        isDexPair[pair] = status;
        emit DexPairUpdated(pair, status);
    }
    
    /**
     * @dev Set tax exemption status for an address
     */
    function setTaxExempt(address account, bool status) external onlyOwner {
        isTaxExempt[account] = status;
        emit TaxExemptionUpdated(account, status);
    }
    
    /**
     * @dev Blacklist an address
     */
    function blacklist(address account) external onlyOwner {
        blacklisted[account] = true;
        emit Blacklisted(account);
    }
    
    /**
     * @dev Remove address from blacklist
     */
    function unblacklist(address account) external onlyOwner {
        blacklisted[account] = false;
        emit Unblacklisted(account);
    }
    
    /**
     * @dev Update max supply (can only decrease or set to 0 for unlimited)
     */
    function updateMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply == 0 || newMaxSupply >= totalSupply(), "Max supply below current supply");
        require(newMaxSupply == 0 || newMaxSupply <= maxSupply, "Can only decrease max supply");
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }
    
    /**
     * @dev Override to add tax logic, blacklist and pause checks
     */
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Pausable)
    {
        require(!blacklisted[from], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        
        // Skip tax for minting, burning, or if either party is tax exempt
        if (from == address(0) || to == address(0) || isTaxExempt[from] || isTaxExempt[to]) {
            super._update(from, to, value);
            return;
        }
        
        uint256 taxAmount = 0;
        
        // Buy tax: when buying from DEX pair
        if (isDexPair[from] && buyTaxPercent > 0) {
            taxAmount = (value * buyTaxPercent) / 10000;
        }
        // Sell tax: when selling to DEX pair
        else if (isDexPair[to] && sellTaxPercent > 0) {
            taxAmount = (value * sellTaxPercent) / 10000;
        }
        
        if (taxAmount > 0) {
            uint256 amountAfterTax = value - taxAmount;
            
            // Transfer tax to tax wallet
            super._update(from, taxWallet, taxAmount);
            emit TaxCollected(from, taxWallet, taxAmount);
            
            // Transfer remaining amount to recipient
            super._update(from, to, amountAfterTax);
        } else {
            super._update(from, to, value);
        }
    }
}
