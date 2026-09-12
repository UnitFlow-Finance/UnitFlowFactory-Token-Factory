// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title TaxUnitImplementation
 * @dev Implementation contract for cloneable tax tokens
 * All clones of this verified contract are automatically verified
 */
contract TaxUnitImplementation is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PausableUpgradeable,
    OwnableUpgradeable,
    ERC20PermitUpgradeable
{
    uint8 private _decimals;
    uint256 public maxSupply;
    bool public mintable;
    bool public pausable;
    
    uint256 public buyTaxPercent;
    uint256 public sellTaxPercent;
    address public taxWallet;
    
    uint256 public constant MAX_TAX = 2500;
    
    mapping(address => bool) public isDexPair;
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
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        uint256 maxSupply_,
        bool mintable_,
        bool pausable_,
        uint256 buyTax_,
        uint256 sellTax_,
        address taxWallet_,
        address owner_
    ) public initializer {
        require(buyTax_ <= MAX_TAX, "Buy tax too high");
        require(sellTax_ <= MAX_TAX, "Sell tax too high");
        require(taxWallet_ != address(0), "Invalid tax wallet");
        
        __ERC20_init(name_, symbol_);
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __Ownable_init(owner_);
        __ERC20Permit_init(name_);
        
        _decimals = decimals_;
        maxSupply = maxSupply_;
        mintable = mintable_;
        pausable = pausable_;
        buyTaxPercent = buyTax_;
        sellTaxPercent = sellTax_;
        taxWallet = taxWallet_;
        
        isTaxExempt[owner_] = true;
        isTaxExempt[taxWallet_] = true;
        
        if (initialSupply_ > 0) {
            _mint(owner_, initialSupply_);
        }
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(mintable, "Minting is disabled");
        require(maxSupply == 0 || totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function pause() external onlyOwner {
        require(pausable, "Pausing is disabled");
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function updateTax(uint256 newBuyTax, uint256 newSellTax) external onlyOwner {
        require(newBuyTax <= MAX_TAX, "Buy tax too high");
        require(newSellTax <= MAX_TAX, "Sell tax too high");
        buyTaxPercent = newBuyTax;
        sellTaxPercent = newSellTax;
        emit TaxUpdated(newBuyTax, newSellTax);
    }
    
    function updateTaxWallet(address newTaxWallet) external onlyOwner {
        require(newTaxWallet != address(0), "Invalid tax wallet");
        taxWallet = newTaxWallet;
        isTaxExempt[newTaxWallet] = true;
        emit TaxWalletUpdated(newTaxWallet);
    }
    
    function setDexPair(address pair, bool status) external onlyOwner {
        isDexPair[pair] = status;
        emit DexPairUpdated(pair, status);
    }
    
    function setTaxExempt(address account, bool status) external onlyOwner {
        isTaxExempt[account] = status;
        emit TaxExemptionUpdated(account, status);
    }
    
    function blacklist(address account) external onlyOwner {
        blacklisted[account] = true;
        emit Blacklisted(account);
    }
    
    function unblacklist(address account) external onlyOwner {
        blacklisted[account] = false;
        emit Unblacklisted(account);
    }
    
    function updateMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply == 0 || newMaxSupply >= totalSupply(), "Max supply below current supply");
        require(newMaxSupply == 0 || newMaxSupply <= maxSupply, "Can only decrease max supply");
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }
    
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
    {
        require(!blacklisted[from], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        
        if (from == address(0) || to == address(0) || isTaxExempt[from] || isTaxExempt[to]) {
            super._update(from, to, value);
            return;
        }
        
        uint256 taxAmount = 0;
        
        if (isDexPair[from] && buyTaxPercent > 0) {
            taxAmount = (value * buyTaxPercent) / 10000;
        } else if (isDexPair[to] && sellTaxPercent > 0) {
            taxAmount = (value * sellTaxPercent) / 10000;
        }
        
        if (taxAmount > 0) {
            uint256 amountAfterTax = value - taxAmount;
            super._update(from, taxWallet, taxAmount);
            emit TaxCollected(from, taxWallet, taxAmount);
            super._update(from, to, amountAfterTax);
        } else {
            super._update(from, to, value);
        }
    }
}
