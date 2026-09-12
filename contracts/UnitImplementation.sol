// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title UnitImplementation
 * @dev Implementation contract for cloneable ERC20 tokens
 * All clones of this verified contract are automatically verified
 */
contract UnitImplementation is 
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
    
    mapping(address => bool) public blacklisted;
    
    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    
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
        address owner_
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __Ownable_init(owner_);
        __ERC20Permit_init(name_);
        
        _decimals = decimals_;
        maxSupply = maxSupply_;
        mintable = mintable_;
        pausable = pausable_;
        
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
        super._update(from, to, value);
    }
}
