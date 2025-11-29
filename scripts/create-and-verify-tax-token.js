const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🚀 Creating and Auto-Verifying Tax Token...\n");

  const factoryAddress = "0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2";
  const [deployer] = await ethers.getSigners();

  console.log("Creator address:", deployer.address);

  const Factory = await ethers.getContractFactory("ArcTaxTokenFactory");
  const factory = Factory.attach(factoryAddress);

  const creationFee = await factory.creationFee();
  console.log("Creation Fee:", ethers.formatEther(creationFee), "ARC");

  // Token parameters
  const tokenName = "Auto Verified Tax Token";
  const tokenSymbol = "AVTT";
  const decimals = 18;
  const initialSupply = ethers.parseEther("1000000");
  const maxSupply = ethers.parseEther("10000000");
  const mintable = true;
  const burnable = true;
  const pausable = false;
  const buyTax = 300;  // 3%
  const sellTax = 500; // 5%
  const taxWallet = deployer.address;

  console.log("\n📝 Step 1: Creating tax token...");
  console.log("Name:", tokenName);
  console.log("Symbol:", tokenSymbol);
  console.log("Initial Supply:", ethers.formatEther(initialSupply));
  console.log("Buy Tax:", buyTax, "basis points (3%)");
  console.log("Sell Tax:", sellTax, "basis points (5%)");

  const tx = await factory.createTaxToken(
    tokenName,
    tokenSymbol,
    decimals,
    initialSupply,
    maxSupply,
    mintable,
    burnable,
    pausable,
    buyTax,
    sellTax,
    taxWallet,
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Tax token created!");

  // Get token address from event
  const event = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === "TaxTokenCreated";
    } catch {
      return false;
    }
  });

  const tokenAddress = factory.interface.parseLog(event).args.tokenAddress;
  console.log("\n🎉 New Tax Token Address:", tokenAddress);
  console.log("View on explorer:", `https://testnet.arcscan.app/address/${tokenAddress}`);

  // Wait a bit for the transaction to be indexed
  console.log("\n⏳ Waiting for transaction to be indexed (10 seconds)...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the token
  console.log("\n📝 Step 2: Verifying tax token on ArcScan...");

  const constructorArgs = [
    tokenName,
    tokenSymbol,
    decimals,
    initialSupply,
    maxSupply,
    mintable,
    burnable,
    pausable,
    buyTax,
    sellTax,
    taxWallet,
    deployer.address
  ];

  try {
    await hre.run("verify:verify", {
      address: tokenAddress,
      contract: "contracts/ArcTaxToken.sol:ArcTaxToken",
      constructorArguments: constructorArgs,
    });

    console.log("\n✅ Tax token verified successfully!");
    console.log(`View verified contract: https://testnet.arcscan.app/address/${tokenAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Tax token is already verified!");
      console.log(`View verified contract: https://testnet.arcscan.app/address/${tokenAddress}#code`);
    } else {
      console.error("\n⚠️  Verification failed:");
      console.error(error.message);
      
      console.log("\n💡 You can verify manually with:");
      console.log(`npx hardhat run scripts/verify-token.js --network arcTestnet ${tokenAddress} tax`);
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
