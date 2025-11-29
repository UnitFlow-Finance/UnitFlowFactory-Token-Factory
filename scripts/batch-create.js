const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🚀 Batch Token Creation Example\n");

  const factoryAddress = "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C";
  const [deployer] = await ethers.getSigners();

  console.log("Creator address:", deployer.address);

  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);

  const creationFee = await factory.creationFee();
  console.log("Creation fee per token:", ethers.formatEther(creationFee), "ARC");

  // Define multiple tokens to create
  const tokenConfigs = [
    {
      name: "Governance Token",
      symbol: "GOV",
      decimals: 18,
      initialSupply: ethers.parseEther("10000000"), // 10M
      maxSupply: ethers.parseEther("100000000"), // 100M
      mintable: true,
      burnable: true,
      pausable: true
    },
    {
      name: "Utility Token",
      symbol: "UTIL",
      decimals: 18,
      initialSupply: ethers.parseEther("50000000"), // 50M
      maxSupply: 0, // Unlimited
      mintable: true,
      burnable: true,
      pausable: false
    },
    {
      name: "Reward Token",
      symbol: "RWD",
      decimals: 18,
      initialSupply: ethers.parseEther("1000000000"), // 1B
      maxSupply: ethers.parseEther("1000000000"), // Fixed supply
      mintable: false,
      burnable: true,
      pausable: false
    }
  ];

  const totalFee = creationFee * BigInt(tokenConfigs.length);
  console.log(`\nTotal fee for ${tokenConfigs.length} tokens:`, ethers.formatEther(totalFee), "ARC");

  console.log("\n⏳ Creating tokens in batch...");
  
  const tx = await factory.batchCreateTokens(tokenConfigs, { value: totalFee });
  console.log("Transaction hash:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("✅ Batch creation successful!");

  // Parse events to get token addresses
  console.log("\n📝 Created Tokens:");
  console.log("=".repeat(80));

  const events = receipt.logs
    .map(log => {
      try {
        return factory.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .filter(event => event && event.name === "TokenCreated");

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const config = tokenConfigs[i];
    
    console.log(`\nToken ${i + 1}:`);
    console.log(`Name: ${config.name}`);
    console.log(`Symbol: ${config.symbol}`);
    console.log(`Address: ${event.args.tokenAddress}`);
    console.log(`Initial Supply: ${ethers.formatEther(config.initialSupply)}`);
    console.log(`Max Supply: ${config.maxSupply === 0n ? "Unlimited" : ethers.formatEther(config.maxSupply)}`);
    console.log(`Mintable: ${config.mintable}`);
    console.log(`Burnable: ${config.burnable}`);
    console.log(`Pausable: ${config.pausable}`);
    console.log(`Explorer: https://testnet.arcscan.app/address/${event.args.tokenAddress}`);
    console.log("-".repeat(80));
  }

  console.log(`\n✅ Successfully created ${events.length} tokens!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
