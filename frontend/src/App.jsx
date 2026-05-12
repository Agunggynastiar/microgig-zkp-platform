import { useState } from "react";
import { ethers } from "ethers";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "./contracts/MicroGigABI";

function App() {

  const statusText = [

    
  "Lowongan Dibuat",
  "Freelancer Ditugaskan",
  "Pembayaran Disimpan",
  "Pekerjaan Selesai",
  "Pembayaran Dikirim"
];

const isEmployer = (job) =>
  wallet.toLowerCase() === job.employer.toLowerCase();

const isFreelancer = (job) =>
  wallet.toLowerCase() === job.freelancer.toLowerCase();



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

    let proof;

const selectedJob = jobs.find(
  (j) => j.id == jobId
);

const skill = selectedJob.requiredSkill;

if (skill == "10") {

  proof = {
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
}

if (skill == "20") {

  proof = {

    pi_a: [
      "21838613041428168010345377736023831960655814423969377386983214838429383521117",
      "13862020560419530839561155215355422621320261789472981637820286301634896303891"
    ],

    pi_b: [
      [
        "15841283087304985220035471340679930325722483370270607909187988719240420061281",
        "1364511635070405218771850410068562467958673722018689899546627657124142528437"
      ],
      [
        "17397251756736037833475632092367982464704255509820014466047340914386018614479",
        "15566158914198332253775096816269015463696024779252718018260541950844507028622"
      ]
    ],

    pi_c: [
      "15924059998488255043813396170639911456462212314628992957594399882456384920914",
      "20166900432259659836521502732742365954179743616013297544780554926506231875613"
    ],

    pubSignals: [
      "20",
      "999",
      "20"
    ]
  };
}

if (skill == "30") {
  proof = {
 "pi_a": [
  "19776718378441959206518039935760872609845188751330897594386836174971931796504",
  "15731415089750077834768704381577100481819828310154024118365535821829359554015",
  "1"
 ],
 "pi_b": [
  [
   "6082254268364376432006733851180542651058353621279391718581962521374743616010",
   "7458566460638915718751706433809288938436715351370247696300392964097781158219"
  ],
  [
   "10547162994642914639429511848276020683450964776591783059110227678850296772932",
   "4034322392252170839222524014160658130959050522979358532146222637350610300804"
  ],
  [
   "1",
   "0"
  ]
 ],
 "pi_c": [
  "8262490802189872625415954310406849482984788696400641346408173427078707400389",
  "20354325796210800086435179314987776116738160620252969453144906009958043477961",
  "1"
 ], 


 "pubSignals": [
  "30",
  "999",
  "30"
 ]}
}
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

        <p className="text-center text-gray-600 mb-4">

  {wallet.toLowerCase() ===
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266".toLowerCase()

    ? "Mode Employer"

    : "Mode Freelancer"}

</p>

        <button
          onClick={connectWallet}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Connect MetaMask
        </button>

        {wallet &&
wallet.toLowerCase() ===
"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266".toLowerCase()
&& (
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

        <h3 className="text-lg font-bold mb-2">
  Job #{job.id}
</h3>

        <p><strong>Reward:</strong> {job.reward} ETH</p>

        <p><strong>Required Skill:</strong> {job.requiredSkill}</p>

        <p className="mt-2">

  <strong>Status:</strong>

  <span className="ml-2 font-semibold text-blue-600">
    {statusText[job.status]}
  </span>

</p>

        <div className="flex flex-wrap gap-2 mt-3">

  {/* ASSIGN */}
  {isEmployer(job) && job.status == 0 && (

    <button
      onClick={() =>
        assignFreelancer(
          job.id,
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        )
      }
      className="bg-blue-500 text-white px-4 py-2 rounded-xl"
    >
      Assign Freelancer
    </button>

  )}

  {/* DEPOSIT */}
  {isEmployer(job) && job.status == 1 && (

    <button
      onClick={() => depositPayment(job.id, job.reward)}
      className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
    >
      Deposit Payment
    </button>

  )}

  {/* COMPLETE JOB */}
  {isFreelancer(job) && job.status == 2 && (

    <button
      onClick={() => completeJob(job.id)}
      className="bg-purple-600 text-white px-4 py-2 rounded-xl"
    >
      Complete Job (ZKP)
    </button>

  )}

  {/* RELEASE PAYMENT */}
  {isEmployer(job) && job.status == 3 && (

    <button
      onClick={() => releasePayment(job.id)}
      className="bg-red-500 text-white px-4 py-2 rounded-xl"
    >
      Release Payment
    </button>

  )}

  {/* PAID */}
  {job.status == 4 && (

    <div className="bg-green-600 text-white px-4 py-2 rounded-xl">
      Pembayaran Selesai
    </div>

  )}
  {wallet &&
wallet.toLowerCase() !==
"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266".toLowerCase()
&& (

  <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mt-6">

    <h2 className="text-2xl font-bold mb-3">
      Panel Freelancer
    </h2>

    <p className="text-gray-600">
      Selesaikan pekerjaan dan kirim Zero Knowledge Proof
      untuk memverifikasi skill Anda.
    </p>

  </div>

)}

</div>

      </div>

    ))}

  </div>
)}
    </div>
  );
}

export default App;