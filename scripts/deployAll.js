const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying with account:", deployer.address);

    // 🔴 DEPLOY VERIFIER
    const Verifier = await hre.ethers.getContractFactory("Groth16Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    console.log("Verifier deployed to:", verifier.address);

    // 🔴 DEPLOY MICROGIG
    const MicroGig = await hre.ethers.getContractFactory("MicroGig");
    const microGig = await MicroGig.deploy(verifier.address);
    await microGig.deployed();

    console.log("MicroGig deployed to:", microGig.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});