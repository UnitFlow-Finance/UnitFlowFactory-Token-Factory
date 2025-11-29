const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🚀 Deploying ArcTokenFactory...");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance));

  // Initial creation fee: 0.01 ARC (10^16 wei)
  const initialCreationFee = ethers.parseEther("0.01");
  console.log("\n📌 Initial Creation Fee:", ethers.formatEther(initialCreationFee), "ARC");

  console.log("\n⏳ Deploying ArcTokenFactory contract...");
  const Factory = await ethers.getContractFactory("ArcTokenFactory");

  const factory = await Factory.deploy(initialCreationFee);
  await factory.waitForDeployment();

  const contractAddress = await factory.getAddress();

  console.log("\n✅ ArcTokenFactory deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("Transaction hash:", factory.deploymentTransaction()?.hash);

  console.log("\n🔍 View on explorer:");
  console.log(`https://testnet.arcscan.app/address/${contractAddress}`);

  console.log("\n📝 Save to your .env:");
  console.log(`TOKEN_FACTORY_ADDRESS=${contractAddress}`);

  console.log("\n⏳ Waiting for confirmations...");
  await factory.deploymentTransaction()?.wait(5);

  console.log("\n🎉 Deployment confirmed!");

  console.log("\n📌 Verify with:");
  console.log(
    `npx hardhat verify --network arcTestnet ${contractAddress} "${initialCreationFee}"`
  );

  // Display factory info
  console.log("\n📊 Factory Information:");
  console.log("Creation Fee:", ethers.formatEther(await factory.creationFee()), "ARC");
  console.log("Total Tokens Created:", (await factory.totalTokensCreated()).toString());
  console.log("Owner:", await factory.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
