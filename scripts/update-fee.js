const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  const factoryAddress = "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C";
  const newFee = process.argv[2];

  if (!newFee) {
    console.error("Usage: npx hardhat run scripts/update-fee.js --network arcTestnet <NEW_FEE_IN_ETH>");
    process.exit(1);
  }

  console.log("🔧 Updating creation fee...\n");

  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);

  const currentFee = await factory.creationFee();
  console.log("Current fee:", ethers.formatEther(currentFee), "ARC");
  console.log("New fee:", newFee, "ARC");

  const newFeeWei = ethers.parseEther(newFee);
  
  console.log("\n⏳ Updating fee...");
  const tx = await factory.updateCreationFee(newFeeWei);
  console.log("Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("✅ Fee updated successfully!");

  const updatedFee = await factory.creationFee();
  console.log("\nUpdated fee:", ethers.formatEther(updatedFee), "ARC");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
