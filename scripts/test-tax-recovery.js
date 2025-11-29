const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🧪 Testing Token Recovery on Tax Factory...\n");

  const taxFactoryAddress = "0x70Fa0fc3e6871658E7D118E8513a6502c7Db16b2";
  const [deployer] = await ethers.getSigners();

  console.log("Tester address:", deployer.address);

  // Step 1: Create a test tax token
  console.log("\n📝 Step 1: Creating a test tax token...");
  const TaxFactory = await ethers.getContractFactory("ArcTaxTokenFactory");
  const taxFactory = TaxFactory.attach(taxFactoryAddress);
  
  const creationFee = await taxFactory.creationFee();
  
  const tx = await taxFactory.createTaxToken(
    "Recovery Tax Token",
    "RTAX",
    18,
    ethers.parseEther("1000000"),
    0,
    false,
    true,
    false,
    100,  // 1% buy tax
    200,  // 2% sell tax
    deployer.address,
    { value: creationFee }
  );

  const receipt = await tx.wait();
  console.log("✅ Test tax token created!");

  // Get token address from event
  const event = receipt.logs.find(log => {
    try {
      return taxFactory.interface.parseLog(log).name === "TaxTokenCreated";
    } catch {
      return false;
    }
  });

  const tokenAddress = taxFactory.interface.parseLog(event).args.tokenAddress;
  console.log("Token address:", tokenAddress);

  // Step 2: Send some tokens to the factory
  console.log("\n📝 Step 2: Sending tokens to tax factory (simulating mistake)...");
  const TaxToken = await ethers.getContractFactory("ArcTaxToken");
  const taxToken = TaxToken.attach(tokenAddress);
  
  const amountToSend = ethers.parseEther("5000");
  const transferTx = await taxToken.transfer(taxFactoryAddress, amountToSend);
  await transferTx.wait();
  console.log("✅ Sent", ethers.formatEther(amountToSend), "RTAX to factory");

  // Check factory balance
  const factoryBalance = await taxToken.balanceOf(taxFactoryAddress);
  console.log("Factory token balance:", ethers.formatEther(factoryBalance), "RTAX");

  // Step 3: Recover the tokens
  console.log("\n📝 Step 3: Recovering tokens from tax factory...");
  const recipientBalanceBefore = await taxToken.balanceOf(deployer.address);
  console.log("Recipient balance before:", ethers.formatEther(recipientBalanceBefore), "RTAX");

  const recoveryTx = await taxFactory.recoverTokens(
    tokenAddress,
    deployer.address,
    amountToSend
  );

  await recoveryTx.wait();
  console.log("✅ Tokens recovered!");

  // Step 4: Verify recovery
  console.log("\n📝 Step 4: Verifying recovery...");
  const factoryBalanceAfter = await taxToken.balanceOf(taxFactoryAddress);
  const recipientBalanceAfter = await taxToken.balanceOf(deployer.address);

  console.log("Factory token balance after:", ethers.formatEther(factoryBalanceAfter), "RTAX");
  console.log("Recipient balance after:", ethers.formatEther(recipientBalanceAfter), "RTAX");

  // Verify the recovery was successful
  if (factoryBalanceAfter === 0n && recipientBalanceAfter === recipientBalanceBefore + amountToSend) {
    console.log("\n✅ Tax factory token recovery test PASSED!");
    console.log("All tokens successfully recovered from tax factory");
  } else {
    console.log("\n❌ Tax factory token recovery test FAILED!");
  }

  // Display event
  const recoveryReceipt = await ethers.provider.getTransactionReceipt(recoveryTx.hash);
  const recoveryEvent = recoveryReceipt.logs.find(log => {
    try {
      return taxFactory.interface.parseLog(log).name === "TokensRecovered";
    } catch {
      return false;
    }
  });

  if (recoveryEvent) {
    const parsedEvent = taxFactory.interface.parseLog(recoveryEvent);
    console.log("\n📊 Recovery Event Details:");
    console.log("Token:", parsedEvent.args.token);
    console.log("Recipient:", parsedEvent.args.recipient);
    console.log("Amount:", ethers.formatEther(parsedEvent.args.amount), "RTAX");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
