const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  const factoryAddress = "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C";
  const recipient = process.argv[2];

  console.log("💰 Withdrawing factory fees...\n");

  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);

  const balance = await ethers.provider.getBalance(factoryAddress);
  console.log("Factory balance:", ethers.formatEther(balance), "ARC");

  if (balance === 0n) {
    console.log("❌ No fees to withdraw");
    return;
  }

  const recipientAddress = recipient || owner.address;
  console.log("Recipient:", recipientAddress);

  console.log("\n⏳ Withdrawing fees...");
  const tx = await factory.withdrawFees(recipientAddress);
  console.log("Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("✅ Fees withdrawn successfully!");

  const newBalance = await ethers.provider.getBalance(factoryAddress);
  console.log("\nFactory balance after withdrawal:", ethers.formatEther(newBalance), "ARC");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
