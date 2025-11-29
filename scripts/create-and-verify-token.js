const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🚀 Creating and Auto-Verifying Normal Token...\n");

  const factoryAddress = "0x6441d6384176a01f65034A96E31c4433da82aa91";
  const [deployer] = await ethers.getSigners();

  console.log("Creator address:", deployer.address);

  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);

  const creationFee = await factory.creationFee();
  console.log("Creation Fee:", ethers.formatEther(creationFee), "ARC");

  // Token parameters
  const tokenName = "Auto Verified Token";
  const tokenSymbol = "AVT";
  const decimals = 18;
  const initialSupply = ethers.parseEther("1000000");
  const maxSupply = ethers.parseEther("10000000");
  const mintable = true;
  const burnable = true;
  const pausable = false;

  console.log("\n📝 Step 1: Creating token...");
  console.log("Name:", tokenName);
  console.log("Symbol:", tokenSymbol);
  console.log("Initial Supply:", ethers.formatEther(initialSupply));

  const tx = await factory.createToken(
    tokenName,
    tokenSymbol,
    decimals,
    initialSupply,
    maxSupply,
    mintable,
    burnable,
    pausable,
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Token created!");

  // Get token address from event
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

  // Wait a bit for the transaction to be indexed
  console.log("\n⏳ Waiting for transaction to be indexed (10 seconds)...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the token
  console.log("\n📝 Step 2: Verifying token on ArcScan...");

  const constructorArgs = [
    tokenName,
    tokenSymbol,
    decimals,
    initialSupply,
    maxSupply,
    mintable,
    burnable,
    pausable,
    deployer.address
  ];

  try {
    await hre.run("verify:verify", {
      address: tokenAddress,
      contract: "contracts/ArcToken.sol:ArcToken",
      constructorArguments: constructorArgs,
    });

    console.log("\n✅ Token verified successfully!");
    console.log(`View verified contract: https://testnet.arcscan.app/address/${tokenAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Token is already verified!");
      console.log(`View verified contract: https://testnet.arcscan.app/address/${tokenAddress}#code`);
    } else {
      console.error("\n⚠️  Verification failed:");
      console.error(error.message);
      
      console.log("\n💡 You can verify manually with:");
      console.log(`npx hardhat run scripts/verify-token.js --network arcTestnet ${tokenAddress} normal`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Process Complete!");
  console.log("Token Address:", tokenAddress);
  console.log("Explorer:", `https://testnet.arcscan.app/address/${tokenAddress}`);
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
