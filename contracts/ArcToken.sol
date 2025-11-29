// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title ArcToken
 * @dev Feature-rich ERC20 token with optional capabilities
 */
contract ArcToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    uint8 private _decimals;
    uint256 public maxSupply;
    bool public mintable;
    bool public pausable;
    
    mapping(address => bool) public blacklisted;
    
    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        uint256 maxSupply_,
        bool mintable_,
        bool burnable_,
        bool pausable_,
        address owner_
    ) ERC20(name_, symbol_) ERC20Permit(name_) Ownable(owner_) {
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
     * @dev Override to add blacklist and pause checks
     */
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Pausable)
    {
        require(!blacklisted[from], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        super._update(from, to, value);
    }
}
