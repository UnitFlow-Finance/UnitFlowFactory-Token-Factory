const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  const factoryAddress = "0x6702a3fFc7D6c7b6e89c946170765ae0d935179C";

  console.log("📋 Listing all tokens...\n");

  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(factoryAddress);

  const totalTokens = await factory.totalTokensCreated();
  console.log("Total tokens created:", totalTokens.toString());

  if (totalTokens === 0n) {
    console.log("No tokens created yet.");
    return;
  }

  console.log("\n" + "=".repeat(80));

  const limit = 10;
  let offset = 0;

  while (offset < totalTokens) {
    const tokens = await factory.getTokens(offset, limit);
    
    for (const token of tokens) {
      console.log(`\nToken ID: ${offset}`);
      console.log(`Name: ${token.name}`);
      console.log(`Symbol: ${token.symbol}`);
      console.log(`Decimals: ${token.decimals}`);
      console.log(`Initial Supply: ${ethers.formatUnits(token.initialSupply, token.decimals)}`);
      console.log(`Address: ${token.tokenAddress}`);
      console.log(`Creator: ${token.creator}`);
      console.log(`Created: ${new Date(Number(token.createdAt) * 1000).toISOString()}`);
      console.log(`Explorer: https://testnet.arcscan.app/address/${token.tokenAddress}`);
      console.log("-".repeat(80));
      offset++;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
