async function main() {

  const Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy();

  await verifier.deployed();

  console.log("Verifier deployed:", verifier.address);

  const MicroGig = await ethers.getContractFactory("MicroGig");

  const microgig = await MicroGig.deploy(
    verifier.address
  );

  await microgig.deployed();

  console.log("MicroGig deployed:", microgig.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});