import { useState } from "react";
import { ethers } from "ethers";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "./contracts/MicroGigABI";

function App() {

  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [reward, setReward] = useState("");
  const [skill, setSkill] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");

  async function connectWallet() {

    console.log(window.ethereum);

    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    const address = await signer.getAddress();

    const microGigContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    setWallet(address);
setContract(microGigContract);
await loadJobs(microGigContract);
  }

  async function createJob() {

    if (!contract) {
      alert("Connect wallet first");
      return;
    }

    try {

      const tx = await contract.createJob(
        ethers.parseEther(reward),
        skill
      );

      await tx.wait();

      alert("Job Created!");
      loadJobs(contract);

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  }

  async function loadJobs(currentContract) {

    console.log("LOADING JOBS...");

  try {

    const totalJobs = await currentContract.jobCount();

    let loadedJobs = [];

    for (let i = 1; i <= totalJobs; i++) {

      const job = await currentContract.jobs(i);
      console.log("JOB DATA:", job);

      loadedJobs.push({
            id: job[0].toString(),
            employer: job[1],
            freelancer: job[2],
            reward: ethers.formatEther(job[3]),
            requiredSkill: job[4].toString(),
            status: job[5].toString(),
});
}

    setJobs(loadedJobs);

  } catch (err) {
    console.error(err);
  }
}

async function assignFreelancer(jobId, freelancerAddress) {

  try {

    const tx = await contract.assignFreelancer(
      jobId,
      freelancerAddress
    );

    await tx.wait();

    alert("Freelancer Assigned!");

    loadJobs(contract);

  } catch (err) {

    console.error(err);

    alert("Assign failed");
  }
}
async function depositPayment(jobId, reward) {

  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {

    const tx = await contract.depositPayment(
      jobId,
      {
        value: ethers.parseEther(reward)
      }
    );

    await tx.wait();

    alert("Payment Deposited!");

    loadJobs(contract);

  } catch (err) {

    console.error(err);

    alert("Deposit failed");
  }

  
}

async function completeJob(jobId) {

  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {

    const proof = {
      pi_a: [
        "949656363989055572364175027612875642901366302055300338733508366485940468120",
        "7814882767364351887011350807354751627314205868721183507979805245065289833495"
      ],

      pi_b: [
  [
    "5873421308627507156550710996214213903603974058827377956733110127537757299920",
    "3731728869669522293386671209618082793026917009687922253833812871757869612955"
  ],
  [
    "6814875797560047549914515432359605124901548773897203178545864738441246538175",
    "13164653906222748058950189378625011704849335908422420717699943479961424665633"
  ]
],

      pi_c: [
        "2918177792676186671194070433094612663234275157612623257105831167932733036750",
        "14149075242263668371026943145012502272264759947115583528177697407984598897657"
      ],

      pubSignals: [
        "10",
        "999",
        "10"
      ]
    };

    const tx = await contract.completeJob(
      jobId,
      proof.pi_a,
      proof.pi_b,
      proof.pi_c,
      proof.pubSignals
    );

    await tx.wait();

    alert("ZKP VERIFIED!");

    loadJobs(contract);

  } catch (err) {

    console.error(err);

    alert("Complete Job Failed");
  }
}

async function releasePayment(jobId) {

  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {

    const tx = await contract.releasePayment(jobId);

    await tx.wait();

    alert("Payment Released!");

    loadJobs(contract);

  } catch (err) {

    console.error(err);

    alert("Release Payment Failed");
  }
}
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          MicroGig ZKP Platform
        </h1>

        <button
          onClick={connectWallet}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Connect MetaMask
        </button>

        {wallet && (

          <div className="mt-6">

            <div className="bg-gray-100 p-4 rounded-xl mb-4">
              <p className="font-semibold">Wallet:</p>
              <p className="text-sm break-all">{wallet}</p>
            </div>

            <input
              type="text"
              placeholder="Reward ETH"
              className="w-full border p-3 rounded-xl mb-3"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />

            <input
              type="text"
              placeholder="Required Skill"
              className="w-full border p-3 rounded-xl mb-3"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
                <input
          type="text"
          placeholder="Freelancer Address"
          className="w-full border p-3 rounded-xl mb-3"
          value={freelancerAddress}
          onChange={(e) => setFreelancerAddress(e.target.value)}
        />
            <button
              onClick={createJob}
              className="w-full bg-green-600 text-white py-3 rounded-xl"
            >
              Create Job
            </button>

          </div>
        )}

      </div>
        {jobs.length > 0 && (

  <div className="mt-6">

    <h2 className="text-xl font-bold mb-4">
      Jobs
    </h2>

    {jobs.map((job) => (

      <div
        key={job.id}
        className="bg-gray-100 p-4 rounded-xl mb-3"
      >

        <p><strong>ID:</strong> {job.id}</p>

        <p><strong>Reward:</strong> {job.reward} ETH</p>

        <p><strong>Required Skill:</strong> {job.requiredSkill}</p>

        <p><strong>Status:</strong> {job.status}</p>

        <button
  onClick={() =>
    assignFreelancer(
      job.id,
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    )
  }
  className="bg-blue-500 text-white px-3 py-2 rounded-lg mr-2"
>
  Assign Freelancer
</button>
<button
  onClick={() => depositPayment(job.id, job.reward)}
  className="mt-3 ml-3 bg-yellow-500 text-white px-4 py-2 rounded-xl"
>
  Deposit Payment
</button>

<button
  onClick={() => completeJob(job.id)}
  className="bg-purple-600 text-white px-3 py-2 rounded-lg"
>
  Complete Job (ZKP)
</button>
<button
  onClick={() => releasePayment(job.id)}
  className="bg-red-500 text-white px-4 py-2 rounded-xl"
>
  Release Payment
</button>

      </div>

    ))}

  </div>
)}
    </div>
  );
}

export default App;