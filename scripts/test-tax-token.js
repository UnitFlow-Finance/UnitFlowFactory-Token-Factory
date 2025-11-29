const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🧪 Testing ArcTaxTokenFactory...\n");

  const factoryAddress = "0x82Be30041323148097d1b77F38593b26D3f35C5A";
  const [deployer] = await ethers.getSigners();

  console.log("Tester address:", deployer.address);

  const Factory = await ethers.getContractFactory("ArcTaxTokenFactory");
  const factory = Factory.attach(factoryAddress);

  console.log("\n📊 Current Factory State:");
  console.log("Creation Fee:", ethers.formatEther(await factory.creationFee()), "ARC");
  console.log("Total Tokens Created:", (await factory.totalTokensCreated()).toString());
  console.log("Owner:", await factory.owner());

  console.log("\n🪙 Creating a test tax token...");
  console.log("Buy Tax: 5% (500 basis points)");
  console.log("Sell Tax: 10% (1000 basis points)");
  
  const creationFee = await factory.creationFee();
  
  const tx = await factory.createTaxToken(
    "Tax Token",
    "TAX",
    18,
    ethers.parseEther("1000000"), // 1M initial supply
    ethers.parseEther("10000000"), // 10M max supply
    true, // mintable
    true, // burnable
    true, // pausable
    500,  // 5% buy tax
    1000, // 10% sell tax
    deployer.address, // tax wallet
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Tax token created successfully!");

  // Get the token address from the event
  const event = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === "TaxTokenCreated";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsedEvent = factory.interface.parseLog(event);
    const tokenAddress = parsedEvent.args.tokenAddress;
    console.log("\n🎉 New Tax Token Address:", tokenAddress);
    console.log("View on explorer:", `https://testnet.arcscan.app/address/${tokenAddress}`);

    // Get token info
    const tokenId = await factory.tokenToId(tokenAddress);
    const tokenInfo = await factory.getTokenInfo(tokenId);
    
    console.log("\n📝 Token Information:");
    console.log("Token Address:", tokenInfo.tokenAddress);
    console.log("Creator:", tokenInfo.creator);
    console.log("Created At:", new Date(Number(tokenInfo.createdAt) * 1000).toISOString());
    
    // Get tax token details
    const TaxToken = await ethers.getContractFactory("ArcTaxToken");
    const taxToken = TaxToken.attach(tokenAddress);
    
    console.log("\n💰 Tax Configuration:");
    console.log("Buy Tax:", (await taxToken.buyTaxPercent()).toString(), "basis points");
    console.log("Sell Tax:", (await taxToken.sellTaxPercent()).toString(), "basis points");
    console.log("Tax Wallet:", await taxToken.taxWallet());
    console.log("Max Tax Allowed:", (await taxToken.MAX_TAX()).toString(), "basis points (25%)");
  }

  console.log("\n📊 Updated Factory State:");
  console.log("Total Tokens Created:", (await factory.totalTokensCreated()).toString());
  
  const creatorTokens = await factory.getCreatorTokens(deployer.address);
  console.log("Tokens created by you:", creatorTokens.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
