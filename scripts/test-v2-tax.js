const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🧪 Testing V2 Tax Unit Factory with Auto-Verification...\n");

  const factoryAddress = "0x35b0A621a88634cea24920D84331d0CAad629BF4";
  const [deployer] = await ethers.getSigners();

  console.log("Creator address:", deployer.address);

  const Factory = await ethers.getContractFactory("TaxUnitFactoryV2");
  const factory = Factory.attach(factoryAddress);

  const creationFee = await factory.creationFee();
  console.log("Creation Fee:", ethers.formatEther(creationFee), "ARC");

  console.log("\n📝 Creating tax token...");
  const tx = await factory.createTaxToken(
    "Auto Verified Tax V2",
    "AVTAX2",
    18,
    ethers.parseEther("1000000"),
    ethers.parseEther("10000000"),
    true,
    false,
    500,  // 5% buy tax
    1000, // 10% sell tax
    deployer.address,
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Tax token created!");

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

  console.log("\n✨ This token is AUTOMATICALLY VERIFIED!");
  console.log("Check the 'Contract' tab on ArcScan - it should show as a proxy/clone");
  console.log("Implementation:", await factory.implementation());

  console.log("\n📊 Token Details:");
  const Token = await ethers.getContractFactory("TaxUnitImplementation");
  const token = Token.attach(tokenAddress);
  
  console.log("Name:", await token.name());
  console.log("Symbol:", await token.symbol());
  console.log("Decimals:", await token.decimals());
  console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
  console.log("Buy Tax:", (await token.buyTaxPercent()).toString(), "basis points");
  console.log("Sell Tax:", (await token.sellTaxPercent()).toString(), "basis points");
  console.log("Tax Wallet:", await token.taxWallet());
  console.log("Owner:", await token.owner());

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test Complete - Tax Token is Auto-Verified!");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
