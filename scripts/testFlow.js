const hre = require("hardhat");

async function main() {
    const [employer, freelancer] = await hre.ethers.getSigners();

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const contract = await hre.ethers.getContractAt(
        "MicroGig",
        contractAddress
    );

    console.log("Employer:", employer.address);
    console.log("Freelancer:", freelancer.address);

    // 🔴 1. CREATE JOB
    console.log("\n[1] Creating Job...");
    await contract.createJob(hre.ethers.utils.parseEther("1"));
    console.log("Job created");

    // 🔴 2. ASSIGN FREELANCER
    console.log("\n[2] Assign Freelancer...");
    await contract.assignFreelancer(1, freelancer.address);
    console.log("Freelancer assigned");

    // 🔴 3. DEPOSIT PAYMENT
    console.log("\n[3] Deposit Payment...");
    await contract.depositPayment(1, {
        value: hre.ethers.utils.parseEther("1"),
    });
    console.log("Payment deposited (escrow)");

    // 🔴 4. COMPLETE JOB
    console.log("\n[4] Freelancer completes job...");
    await contract.connect(freelancer).completeJob(1);
    console.log("Job completed");

    // 🔴 5. RELEASE PAYMENT
    console.log("\n[5] Release payment...");
    await contract.releasePayment(1);
    console.log("Payment released");

    // 🔴 CHECK RESULT
    const job = await contract.jobs(1);
    console.log("\nFinal Job State:", job);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});