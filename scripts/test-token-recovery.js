const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  console.log("🧪 Testing Token Recovery Feature...\n");

  const normalFactoryAddress = "0x6441d6384176a01f65034A96E31c4433da82aa91";
  const [deployer] = await ethers.getSigners();

  console.log("Tester address:", deployer.address);

  // Step 1: Create a test token
  console.log("\n📝 Step 1: Creating a test token to send to factory...");
  const Factory = await ethers.getContractFactory("ArcTokenFactory");
  const factory = Factory.attach(normalFactoryAddress);
  
  const creationFee = await factory.creationFee();
  
  const tx = await factory.createToken(
    "Recovery Test Token",
    "RTT",
    18,
    ethers.parseEther("1000000"),
    0,
    false,
    true,
    false,
    { value: creationFee }
  );

  const receipt = await tx.wait();
  console.log("✅ Test token created!");

  // Get token address from event
  const event = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === "TokenCreated";
    } catch {
      return false;
    }
  });

  const tokenAddress = factory.interface.parseLog(event).args.tokenAddress;
  console.log("Token address:", tokenAddress);

  // Step 2: Send some tokens to the factory (simulating mistake)
  console.log("\n📝 Step 2: Sending tokens to factory (simulating mistake)...");
  const Token = await ethers.getContractFactory("ArcToken");
  const token = Token.attach(tokenAddress);
  
  const amountToSend = ethers.parseEther("1000");
  const transferTx = await token.transfer(normalFactoryAddress, amountToSend);
  await transferTx.wait();
  console.log("✅ Sent", ethers.formatEther(amountToSend), "RTT to factory");

  // Check factory balance
  const factoryBalance = await token.balanceOf(normalFactoryAddress);
  console.log("Factory token balance:", ethers.formatEther(factoryBalance), "RTT");
  
  if (factoryBalance === 0n) {
    console.log("⚠️ Factory balance is 0, transfer may have failed");
    console.log("Checking deployer balance...");
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(deployerBalance), "RTT");
    return;
  }

  // Step 3: Recover the tokens
  console.log("\n📝 Step 3: Recovering tokens from factory...");
  const recipientBalanceBefore = await token.balanceOf(deployer.address);
  console.log("Recipient balance before:", ethers.formatEther(recipientBalanceBefore), "RTT");

  const recoveryTx = await factory.recoverTokens(
    tokenAddress,
    deployer.address,
    amountToSend
  );

  await recoveryTx.wait();
  console.log("✅ Tokens recovered!");

  // Step 4: Verify recovery
  console.log("\n📝 Step 4: Verifying recovery...");
  const factoryBalanceAfter = await token.balanceOf(normalFactoryAddress);
  const recipientBalanceAfter = await token.balanceOf(deployer.address);

  console.log("Factory token balance after:", ethers.formatEther(factoryBalanceAfter), "RTT");
  console.log("Recipient balance after:", ethers.formatEther(recipientBalanceAfter), "RTT");

  // Verify the recovery was successful
  if (factoryBalanceAfter === 0n && recipientBalanceAfter === recipientBalanceBefore + amountToSend) {
    console.log("\n✅ Token recovery test PASSED!");
    console.log("All tokens successfully recovered from factory");
  } else {
    console.log("\n❌ Token recovery test FAILED!");
  }

  // Display event
  const recoveryReceipt = await ethers.provider.getTransactionReceipt(recoveryTx.hash);
  const recoveryEvent = recoveryReceipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === "TokensRecovered";
    } catch {
      return false;
    }
  });

  if (recoveryEvent) {
    const parsedEvent = factory.interface.parseLog(recoveryEvent);
    console.log("\n📊 Recovery Event Details:");
    console.log("Token:", parsedEvent.args.token);
    console.log("Recipient:", parsedEvent.args.recipient);
    console.log("Amount:", ethers.formatEther(parsedEvent.args.amount), "RTT");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
