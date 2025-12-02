const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  // V2 Factory addresses
  const normalFactoryV2 = "0xF00b137C40e3a370369901becF25ca0AA76DFC64";
  const taxFactoryV2 = "0x35b0A621a88634cea24920D84331d0CAad629BF4";
  
  // New fee: 1 ARC (native token)
  const newFee = ethers.parseEther("1");

  console.log("🔧 Updating V2 Factory Creation Fees...\n");

  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
  console.log("New fee:", ethers.formatEther(newFee), "ARC\n");

  // Update Normal Token Factory V2
  console.log("📝 Updating Normal Token Factory V2...");
  console.log("Factory address:", normalFactoryV2);
  
  const NormalFactory = await ethers.getContractFactory("ArcTokenFactoryV2");
  const normalFactory = NormalFactory.attach(normalFactoryV2);

  const currentNormalFee = await normalFactory.creationFee();
  console.log("Current fee:", ethers.formatEther(currentNormalFee), "ARC");

  console.log("⏳ Updating fee...");
  const tx1 = await normalFactory.updateCreationFee(newFee);
  console.log("Transaction hash:", tx1.hash);
  
  await tx1.wait();
  console.log("✅ Normal Factory fee updated!\n");

  // Update Tax Token Factory V2
  console.log("📝 Updating Tax Token Factory V2...");
  console.log("Factory address:", taxFactoryV2);
  
  const TaxFactory = await ethers.getContractFactory("ArcTaxTokenFactoryV2");
  const taxFactory = TaxFactory.attach(taxFactoryV2);

  const currentTaxFee = await taxFactory.creationFee();
  console.log("Current fee:", ethers.formatEther(currentTaxFee), "ARC");

  console.log("⏳ Updating fee...");
  const tx2 = await taxFactory.updateCreationFee(newFee);
  console.log("Transaction hash:", tx2.hash);
  
  await tx2.wait();
  console.log("✅ Tax Factory fee updated!\n");

  // Verify updates
  console.log("🔍 Verifying updates...");
  const updatedNormalFee = await normalFactory.creationFee();
  const updatedTaxFee = await taxFactory.creationFee();
  
  console.log("\n✅ Final Fees:");
  console.log("Normal Factory V2:", ethers.formatEther(updatedNormalFee), "ARC");
  console.log("Tax Factory V2:", ethers.formatEther(updatedTaxFee), "ARC");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
