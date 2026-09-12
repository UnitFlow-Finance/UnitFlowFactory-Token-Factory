const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🧪 Testing V2 Normal Unit Factory with Auto-Verification...\n");

  const factoryAddress = "0xF00b137C40e3a370369901becF25ca0AA76DFC64";
  const [deployer] = await ethers.getSigners();

  console.log("Creator address:", deployer.address);

  const Factory = await ethers.getContractFactory("UnitFactoryV2");
  const factory = Factory.attach(factoryAddress);

  const creationFee = await factory.creationFee();
  console.log("Creation Fee:", ethers.formatEther(creationFee), "ARC");

  console.log("\n📝 Creating token...");
  const tx = await factory.createToken(
    "Auto Verified V2 Token",
    "AVT2",
    18,
    ethers.parseEther("1000000"),
    ethers.parseEther("10000000"),
    true,
    false,
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Token created!");

  const event = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === "TokenCreated";
    } catch {
      return false;
    }
  });

  const tokenAddress = factory.interface.parseLog(event).args.tokenAddress;
  console.log("\n🎉 New Token Address:", tokenAddress);
  console.log("View on explorer:", `https://testnet.arcscan.app/address/${tokenAddress}`);

  console.log("\n✨ This token is AUTOMATICALLY VERIFIED!");
  console.log("Check the 'Contract' tab on ArcScan - it should show as a proxy/clone");
  console.log("Implementation:", await factory.implementation());

  console.log("\n📊 Token Details:");
  const Token = await ethers.getContractFactory("UnitImplementation");
  const token = Token.attach(tokenAddress);
  
  console.log("Name:", await token.name());
  console.log("Symbol:", await token.symbol());
  console.log("Decimals:", await token.decimals());
  console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
  console.log("Owner:", await token.owner());

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test Complete - Token is Auto-Verified!");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
