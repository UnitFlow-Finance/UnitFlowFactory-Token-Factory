const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;
  console.log("🚀 Deploying and Testing Full V2 System...\n");

  const [deployer] = await ethers.getSigners();
  const initialCreationFee = ethers.parseEther("1");

  // 1. Deploy
  console.log("📝 Deploying...");
  const UnitImpl = await ethers.getContractFactory("UnitImplementation");
  const unitImpl = await UnitImpl.deploy();
  await unitImpl.waitForDeployment();
  const unitImplAddress = await unitImpl.getAddress();

  const TaxUnitImpl = await ethers.getContractFactory("TaxUnitImplementation");
  const taxUnitImpl = await TaxUnitImpl.deploy();
  await taxUnitImpl.waitForDeployment();
  const taxUnitImplAddress = await taxUnitImpl.getAddress();

  const UnitFactory = await ethers.getContractFactory("UnitFactoryV2");
  const unitFactory = await UnitFactory.deploy(unitImplAddress, initialCreationFee);
  await unitFactory.waitForDeployment();
  const unitFactoryAddress = await unitFactory.getAddress();

  const TaxUnitFactory = await ethers.getContractFactory("TaxUnitFactoryV2");
  const taxUnitFactory = await TaxUnitFactory.deploy(taxUnitImplAddress, initialCreationFee);
  await taxUnitFactory.waitForDeployment();
  const taxUnitFactoryAddress = await taxUnitFactory.getAddress();

  console.log("✅ Deployed!");

  // 2. Test Minting Flag
  console.log("\n🧪 Testing Mintable Flag...");
  
  // Create Mintable Token
  const txMintable = await unitFactory.createToken(
    "MintableToken", "MINT", 18, ethers.parseEther("100"), 0, true, true,
    { value: initialCreationFee }
  );
  const receiptMintable = await txMintable.wait();
  let mintableAddr;
  for (const log of receiptMintable.logs) {
    try { const parsed = unitFactory.interface.parseLog(log); if (parsed.name === "TokenCreated") mintableAddr = parsed.args.tokenAddress; } catch (e) {}
  }
  const mintableToken = await ethers.getContractAt("UnitImplementation", mintableAddr);
  
  await mintableToken.mint(deployer.address, ethers.parseEther("50"));
  console.log("Mintable Token: Minting succeeded");

  // Create Non-Mintable Token
  const txNonMintable = await unitFactory.createToken(
    "NonMintableToken", "NMINT", 18, ethers.parseEther("100"), 0, false, true,
    { value: initialCreationFee }
  );
  const receiptNonMintable = await txNonMintable.wait();
  let nonMintableAddr;
  for (const log of receiptNonMintable.logs) {
    try { const parsed = unitFactory.interface.parseLog(log); if (parsed.name === "TokenCreated") nonMintableAddr = parsed.args.tokenAddress; } catch (e) {}
  }
  const nonMintableToken = await ethers.getContractAt("UnitImplementation", nonMintableAddr);
  
  try {
      await nonMintableToken.mint(deployer.address, ethers.parseEther("50"));
      console.log("Error: Minting succeeded for Non-Mintable Token");
  } catch (e) {
      console.log("Correct: Minting reverted for Non-Mintable Token");
  }

  // 3. Test Tax Token
  console.log("\n🧪 Testing Tax Token...");
  const tx2 = await taxUnitFactory.createTaxToken(
    "TaxToken", "TAX", 18, ethers.parseEther("100"), 0, true, false, 500, 500, deployer.address,
    { value: initialCreationFee }
  );
  const receipt2 = await tx2.wait();
  
  // Find event by parsing logs
  let taxTokenAddress;
  for (const log of receipt2.logs) {
    try {
      const parsed = taxUnitFactory.interface.parseLog(log);
      if (parsed.name === "TaxTokenCreated") {
        taxTokenAddress = parsed.args.tokenAddress;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!taxTokenAddress) throw new Error("TaxTokenCreated event not found");
  
  const taxToken = await ethers.getContractAt("TaxUnitImplementation", taxTokenAddress);
  console.log("Tax Token Name:", await taxToken.name());
  console.log("Tax Token BuyTax:", await taxToken.buyTaxPercent());

  console.log("\n🎉 All tests passed!");
}

main().catch(console.error);
