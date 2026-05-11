const hre = require("hardhat");

async function main() {

    const [employer, freelancer] = await hre.ethers.getSigners();

    const microGig = await hre.ethers.getContractAt(
        "MicroGig",
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    );

    console.log("Employer:", employer.address);
    console.log("Freelancer:", freelancer.address);

    // 🔴 CREATE JOB
    console.log("\n[1] Creating Job...");
    await microGig.createJob(
        hre.ethers.utils.parseEther("1"),
        10
    );

    // 🔴 ASSIGN FREELANCER
    console.log("[2] Assign Freelancer...");
    await microGig.assignFreelancer(
        1,
        freelancer.address
    );

    // 🔴 DEPOSIT PAYMENT
    console.log("[3] Deposit Payment...");
    await microGig.depositPayment(1, {
        value: hre.ethers.utils.parseEther("1")
    });

    // 🔥 ZKP DATA
    const pA = [
        "949656363989055572364175027612875642901366302055300338733508366485940468120",
        "7814882767364351887011350807354751627314205868721183507979805245065289833495"
    ];

    const pB = [
        [
            "5873421308627507156550710996214213903603974058827377956733110127537757299920",
            "3731728869669522293386671209618082793026917009687922253833812871757869612955"
        ],
        [
            "6814875797560047549914515432359605124901548773897203178545864738441246538175",
            "13164653906222748058950189378625011704849335908422420717699943479961424665633"
        ]
    ];

    const pC = [
        "2918177792676186671194070433094612663234275157612623257105831167932733036750",
        "14149075242263668371026943145012502272264759947115583528177697407984598897657"
    ];

    const pubSignals = [
        "10",
        "999",
        "10"
    ];

    // 🔥 COMPLETE JOB WITH ZKP
    console.log("[4] Completing Job with ZKP...");

    await microGig.connect(freelancer).completeJob(
        1,
        pA,
        pB,
        pC,
        pubSignals
    );

    console.log("ZKP VERIFIED SUCCESSFULLY!");

    // 🔴 RELEASE PAYMENT
    console.log("[5] Release Payment...");

    await microGig.releasePayment(1);

    console.log("Payment Released!");

    // 🔴 CHECK FINAL STATE
    const job = await microGig.jobs(1);

    console.log("\nFINAL JOB:");
    console.log(job);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});