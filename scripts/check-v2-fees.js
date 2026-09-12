const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  const normalFactoryV2 = "0xF00b137C40e3a370369901becF25ca0AA76DFC64";
  const taxFactoryV2 = "0x35b0A621a88634cea24920D84331d0CAad629BF4";

  console.log("🔍 Checking V2 Factory Creation Fees...\n");

  const NormalFactory = await ethers.getContractFactory("UnitFactoryV2");
  const normalFactory = NormalFactory.attach(normalFactoryV2);

  const TaxFactory = await ethers.getContractFactory("TaxUnitFactoryV2");
  const taxFactory = TaxFactory.attach(taxFactoryV2);

  const normalFee = await normalFactory.creationFee();
  const taxFee = await taxFactory.creationFee();

  console.log("Normal Unit Factory V2:");
  console.log("  Address:", normalFactoryV2);
  console.log("  Creation Fee:", ethers.formatEther(normalFee), "ARC");
  console.log("  Fee (Wei):", normalFee.toString());

  console.log("\nTax Unit Factory V2:");
  console.log("  Address:", taxFactoryV2);
  console.log("  Creation Fee:", ethers.formatEther(taxFee), "ARC");
  console.log("  Fee (Wei):", taxFee.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
