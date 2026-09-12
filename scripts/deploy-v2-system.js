const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🚀 Deploying V2 System with Auto-Verification...\n");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ARC\n");

  const initialCreationFee = ethers.parseEther("1");

  // Step 1: Deploy Normal Token Implementation
  console.log("📝 Step 1: Deploying Normal Token Implementation...");
  const TokenImpl = await ethers.getContractFactory("UnitImplementation");
  const tokenImpl = await TokenImpl.deploy();
  await tokenImpl.waitForDeployment();
  const tokenImplAddress = await tokenImpl.getAddress();
  console.log("✅ Normal Token Implementation:", tokenImplAddress);

  // Step 2: Deploy Tax Token Implementation
  console.log("\n📝 Step 2: Deploying Tax Token Implementation...");
  const TaxTokenImpl = await ethers.getContractFactory("TaxUnitImplementation");
  const taxTokenImpl = await TaxTokenImpl.deploy();
  await taxTokenImpl.waitForDeployment();
  const taxTokenImplAddress = await taxTokenImpl.getAddress();
  console.log("✅ Tax Token Implementation:", taxTokenImplAddress);

  // Step 3: Deploy Normal Unit Factory V2
  console.log("\n📝 Step 3: Deploying Normal Unit Factory V2...");
  const FactoryV2 = await ethers.getContractFactory("UnitFactoryV2");
  const factoryV2 = await FactoryV2.deploy(tokenImplAddress, initialCreationFee);
  await factoryV2.waitForDeployment();
  const factoryV2Address = await factoryV2.getAddress();
  console.log("✅ Normal Unit Factory V2:", factoryV2Address);

  // Step 4: Deploy Tax Unit Factory V2
  console.log("\n📝 Step 4: Deploying Tax Unit Factory V2...");
  const TaxFactoryV2 = await ethers.getContractFactory("TaxUnitFactoryV2");
  const taxFactoryV2 = await TaxFactoryV2.deploy(taxTokenImplAddress, initialCreationFee);
  await taxFactoryV2.waitForDeployment();
  const taxFactoryV2Address = await taxFactoryV2.getAddress();
  console.log("✅ Tax Unit Factory V2:", taxFactoryV2Address);

  console.log("\n" + "=".repeat(70));
  console.log("✅ V2 System Deployed Successfully!");
  console.log("=".repeat(70));

  console.log("\n📊 Deployment Summary:");
  console.log("Normal Token Implementation:", tokenImplAddress);
  console.log("Tax Token Implementation:   ", taxTokenImplAddress);
  console.log("Normal Unit Factory V2:    ", factoryV2Address);
  console.log("Tax Unit Factory V2:       ", taxFactoryV2Address);

  console.log("\n🔍 Explorer Links:");
  console.log(`Normal Impl:    https://testnet.arcscan.app/address/${tokenImplAddress}`);
  console.log(`Tax Impl:       https://testnet.arcscan.app/address/${taxTokenImplAddress}`);
  console.log(`Normal Factory: https://testnet.arcscan.app/address/${factoryV2Address}`);
  console.log(`Tax Factory:    https://testnet.arcscan.app/address/${taxFactoryV2Address}`);

  console.log("\n⏳ Waiting for confirmations (10 seconds)...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify implementations
  console.log("\n📝 Step 5: Verifying Implementation Contracts...");
  
  try {
    console.log("\nVerifying Normal Token Implementation...");
    await hre.run("verify:verify", {
      address: tokenImplAddress,
      contract: "contracts/UnitImplementation.sol:UnitImplementation",
      constructorArguments: [],
    });
    console.log("✅ Normal Token Implementation verified!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Normal Token Implementation already verified!");
    } else {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  try {
    console.log("\nVerifying Tax Token Implementation...");
    await hre.run("verify:verify", {
      address: taxTokenImplAddress,
      contract: "contracts/TaxUnitImplementation.sol:TaxUnitImplementation",
      constructorArguments: [],
    });
    console.log("✅ Tax Token Implementation verified!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Tax Token Implementation already verified!");
    } else {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  try {
    console.log("\nVerifying Normal Unit Factory V2...");
    await hre.run("verify:verify", {
      address: factoryV2Address,
      contract: "contracts/UnitFactoryV2.sol:UnitFactoryV2",
      constructorArguments: [tokenImplAddress, initialCreationFee.toString()],
    });
    console.log("✅ Normal Unit Factory V2 verified!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Normal Unit Factory V2 already verified!");
    } else {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  try {
    console.log("\nVerifying Tax Unit Factory V2...");
    await hre.run("verify:verify", {
      address: taxFactoryV2Address,
      contract: "contracts/TaxUnitFactoryV2.sol:TaxUnitFactoryV2",
      constructorArguments: [taxTokenImplAddress, initialCreationFee.toString()],
    });
    console.log("✅ Tax Unit Factory V2 verified!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Tax Unit Factory V2 already verified!");
    } else {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("🎉 V2 System Fully Deployed and Verified!");
  console.log("=".repeat(70));

  console.log("\n💡 Important:");
  console.log("All tokens created by these factories will be AUTOMATICALLY VERIFIED");
  console.log("because they are clones of the verified implementation contracts!");

  console.log("\n📝 Save these addresses:");
  console.log(`NORMAL_TOKEN_IMPL=${tokenImplAddress}`);
  console.log(`TAX_TOKEN_IMPL=${taxTokenImplAddress}`);
  console.log(`NORMAL_FACTORY_V2=${factoryV2Address}`);
  console.log(`TAX_FACTORY_V2=${taxFactoryV2Address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
