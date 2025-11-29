const hre = require("hardhat");

/**
 * Verify a token created by the factory
 * Usage: TOKEN_ADDRESS=0x... TOKEN_TYPE=normal npx hardhat run scripts/verify-token.js --network arcTestnet
 * TOKEN_TYPE: "normal" or "tax"
 */
async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const tokenType = (process.env.TOKEN_TYPE || "normal").toLowerCase();
  
  if (!tokenAddress) {
    console.error("Usage: TOKEN_ADDRESS=0x... TOKEN_TYPE=normal npx hardhat run scripts/verify-token.js --network arcTestnet");
    console.error("TOKEN_TYPE: 'normal' or 'tax' (default: normal)");
    process.exit(1);
  }

  console.log("🔍 Verifying token on ArcScan...");
  console.log("Token Address:", tokenAddress);
  console.log("Token Type:", tokenType);

  const ethers = hre.ethers;
  const [deployer] = await ethers.getSigners();

  // Get factory addresses
  const normalFactoryAddress = "0x6441d6384176a01f65034A96E31c4433da82aa91";
  const taxFactoryAddress = "0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2";

  let factory, factoryAddress, contractName;

  if (tokenType === "normal") {
    const Factory = await ethers.getContractFactory("ArcTokenFactory");
    factory = Factory.attach(normalFactoryAddress);
    factoryAddress = normalFactoryAddress;
    contractName = "contracts/ArcToken.sol:ArcToken";
  } else if (tokenType === "tax") {
    const Factory = await ethers.getContractFactory("ArcTaxTokenFactory");
    factory = Factory.attach(taxFactoryAddress);
    factoryAddress = taxFactoryAddress;
    contractName = "contracts/ArcTaxToken.sol:ArcTaxToken";
  } else {
    console.error("Invalid token type. Use 'normal' or 'tax'");
    process.exit(1);
  }

  // Get token info from factory
  console.log("\n📝 Fetching token information from factory...");
  
  try {
    const tokenId = await factory.tokenToId(tokenAddress);
    const tokenInfo = await factory.getTokenInfo(tokenId);
    
    console.log("Token ID:", tokenId.toString());
    console.log("Creator:", tokenInfo.creator || tokenInfo[1]);
    console.log("Created At:", new Date(Number(tokenInfo.createdAt || tokenInfo[2]) * 1000).toISOString());
  } catch (error) {
    console.log("⚠️  Could not fetch token info from factory");
  }

  // Get token details
  console.log("\n📝 Fetching token details...");
  
  let Token;
  if (tokenType === "normal") {
    Token = await ethers.getContractFactory("ArcToken");
  } else {
    Token = await ethers.getContractFactory("ArcTaxToken");
  }
  
  const token = Token.attach(tokenAddress);
  
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  const maxSupply = await token.maxSupply();
  const mintable = await token.mintable();
  const pausable = await token.pausable();
  const owner = await token.owner();

  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals));
  console.log("Max Supply:", maxSupply === 0n ? "Unlimited" : ethers.formatUnits(maxSupply, decimals));
  console.log("Mintable:", mintable);
  console.log("Pausable:", pausable);
  console.log("Owner:", owner);

  // Prepare constructor arguments
  console.log("\n⏳ Preparing constructor arguments...");
  
  let constructorArgs;
  
  if (tokenType === "normal") {
    constructorArgs = [
      name,
      symbol,
      decimals,
      totalSupply,
      maxSupply,
      mintable,
      true, // burnable (always true for created tokens)
      pausable,
      owner
    ];
  } else {
    // For tax tokens, we need additional parameters
    const buyTax = await token.buyTaxPercent();
    const sellTax = await token.sellTaxPercent();
    const taxWallet = await token.taxWallet();
    
    console.log("Buy Tax:", buyTax.toString(), "basis points");
    console.log("Sell Tax:", sellTax.toString(), "basis points");
    console.log("Tax Wallet:", taxWallet);
    
    constructorArgs = [
      name,
      symbol,
      decimals,
      totalSupply,
      maxSupply,
      mintable,
      true, // burnable
      pausable,
      buyTax,
      sellTax,
      taxWallet,
      owner
    ];
  }

  console.log("\n⏳ Verifying contract on ArcScan...");
  console.log("This may take a few moments...");

  try {
    await hre.run("verify:verify", {
      address: tokenAddress,
      contract: contractName,
      constructorArguments: constructorArgs,
    });

    console.log("\n✅ Token verified successfully!");
    console.log(`View on ArcScan: https://testnet.arcscan.app/address/${tokenAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Token is already verified!");
      console.log(`View on ArcScan: https://testnet.arcscan.app/address/${tokenAddress}#code`);
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);
      
      console.log("\n💡 Manual verification command:");
      console.log(`npx hardhat verify --network arcTestnet --contract ${contractName} ${tokenAddress} \\`);
      constructorArgs.forEach((arg, i) => {
        const value = typeof arg === 'bigint' ? `"${arg.toString()}"` : 
                     typeof arg === 'boolean' ? arg :
                     typeof arg === 'number' ? arg :
                     `"${arg}"`;
        console.log(`  ${value}${i < constructorArgs.length - 1 ? ' \\' : ''}`);
      });
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
