const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🧪 Testing ArcTokenFactory...\n");

  const factoryAddress = "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C";
  const [deployer] = await ethers.getSigners();

  console.log("Tester address:", deployer.address);

  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);

  console.log("\n📊 Current Factory State:");
  console.log("Creation Fee:", ethers.formatEther(await factory.creationFee()), "ARC");
  console.log("Total Tokens Created:", (await factory.totalTokensCreated()).toString());
  console.log("Owner:", await factory.owner());

  console.log("\n🪙 Creating a test token...");
  
  const creationFee = await factory.creationFee();
  
  const tx = await factory.createToken(
    "Test Token",
    "TEST",
    18,
    ethers.parseEther("1000000"), // 1M initial supply
    ethers.parseEther("10000000"), // 10M max supply
    true, // mintable
    true, // burnable
    true, // pausable
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Token created successfully!");

  // Get the token address from the event
  const event = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === "TokenCreated";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsedEvent = factory.interface.parseLog(event);
    const tokenAddress = parsedEvent.args.tokenAddress;
    console.log("\n🎉 New Token Address:", tokenAddress);
    console.log("View on explorer:", `https://testnet.arcscan.app/address/${tokenAddress}`);

    // Get token info
    const tokenId = await factory.tokenToId(tokenAddress);
    const tokenInfo = await factory.getTokenInfo(tokenId);
    
    console.log("\n📝 Token Information:");
    console.log("Name:", tokenInfo.name);
    console.log("Symbol:", tokenInfo.symbol);
    console.log("Decimals:", tokenInfo.decimals);
    console.log("Initial Supply:", ethers.formatEther(tokenInfo.initialSupply));
    console.log("Creator:", tokenInfo.creator);
    console.log("Created At:", new Date(Number(tokenInfo.createdAt) * 1000).toISOString());
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
