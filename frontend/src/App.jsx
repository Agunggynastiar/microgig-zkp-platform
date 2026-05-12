import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";

import {
  Wallet,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Coins,
  User,
  Layers3,
  BadgeCheck,
  Rocket,
} from "lucide-react";

import { Toaster, toast } from "react-hot-toast";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "./contracts/MicroGigABI";

function App() {
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState("employer");
  const [contract, setContract] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [reward, setReward] = useState("");
  const [skill, setSkill] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");

  const statusText = [
    "Lowongan Dibuat",
    "Freelancer Ditugaskan",
    "Escrow Locked",
    "Completed",
    "Paid",
  ];

  const statusColor = [
    "bg-slate-500/20 text-slate-300",
    "bg-blue-500/20 text-blue-300",
    "bg-yellow-500/20 text-yellow-300",
    "bg-purple-500/20 text-purple-300",
    "bg-emerald-500/20 text-emerald-300",
  ];

  const isEmployer = (job) =>
    wallet.toLowerCase() === job.employer.toLowerCase();

  const isFreelancer = (job) =>
    wallet.toLowerCase() === job.freelancer.toLowerCase();

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        toast.error("Install MetaMask");
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

      toast.success("Wallet Connected");

      await loadJobs(microGigContract);
    } catch (err) {
      console.error(err);
      toast.error("Connection Failed");
    }
  }

  async function createJob() {
    if (!contract) {
      toast.error("Connect wallet first");
      return;
    }

    try {
      const tx = await contract.createJob(
        ethers.parseEther(reward),
        skill
      );

      toast.loading("Creating Job...", {
        id: "create-job",
      });

      await tx.wait();

      toast.success("Job Created!", {
        id: "create-job",
      });

      loadJobs(contract);
    } catch (err) {
      console.error(err);

      toast.error("Transaction Failed", {
        id: "create-job",
      });
    }
  }

  async function loadJobs(currentContract) {
    try {
      const totalJobs = await currentContract.jobCount();

      let loadedJobs = [];

      for (let i = 1; i <= totalJobs; i++) {
        const job = await currentContract.jobs(i);

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

      toast.loading("Assigning Freelancer...", {
        id: "assign",
      });

      await tx.wait();

      toast.success("Freelancer Assigned!", {
        id: "assign",
      });

      loadJobs(contract);
    } catch (err) {
      console.error(err);

      toast.error("Assign Failed", {
        id: "assign",
      });
    }
  }

  async function depositPayment(jobId, reward) {
    try {
      const tx = await contract.depositPayment(jobId, {
        value: ethers.parseEther(reward),
      });

      toast.loading("Depositing Payment...", {
        id: "deposit",
      });

      await tx.wait();

      toast.success("Payment Deposited!", {
        id: "deposit",
      });

      loadJobs(contract);
    } catch (err) {
      console.error(err);

      toast.error("Deposit Failed", {
        id: "deposit",
      });
    }
  }

  async function completeJob(jobId) {
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
            "7814882767364351887011350807354751627314205868721183507979805245065289833495",
          ],
          pi_b: [
            [
              "5873421308627507156550710996214213903603974058827377956733110127537757299920",
              "3731728869669522293386671209618082793026917009687922253833812871757869612955",
            ],
            [
              "6814875797560047549914515432359605124901548773897203178545864738441246538175",
              "13164653906222748058950189378625011704849335908422420717699943479961424665633",
            ],
          ],
          pi_c: [
            "2918177792676186671194070433094612663234275157612623257105831167932733036750",
            "14149075242263668371026943145012502272264759947115583528177697407984598897657",
          ],
          pubSignals: ["10", "999", "10"],
        };
      }

      if (skill == "20") {
        proof = {
          pi_a: [
            "21838613041428168010345377736023831960655814423969377386983214838429383521117",
            "13862020560419530839561155215355422621320261789472981637820286301634896303891",
          ],
          pi_b: [
            [
              "15841283087304985220035471340679930325722483370270607909187988719240420061281",
              "1364511635070405218771850410068562467958673722018689899546627657124142528437",
            ],
            [
              "17397251756736037833475632092367982464704255509820014466047340914386018614479",
              "15566158914198332253775096816269015463696024779252718018260541950844507028622",
            ],
          ],
          pi_c: [
            "15924059998488255043813396170639911456462212314628992957594399882456384920914",
            "20166900432259659836521502732742365954179743616013297544780554926506231875613",
          ],
          pubSignals: ["20", "999", "20"],
        };
      }

      if (skill == "30") {
        proof = {
          pi_a: [
            "19776718378441959206518039935760872609845188751330897594386836174971931796504",
            "15731415089750077834768704381577100481819828310154024118365535821829359554015",
            "1",
          ],
          pi_b: [
            [
              "6082254268364376432006733851180542651058353621279391718581962521374743616010",
              "7458566460638915718751706433809288938436715351370247696300392964097781158219",
            ],
            [
              "10547162994642914639429511848276020683450964776591783059110227678850296772932",
              "4034322392252170839222524014160658130959050522979358532146222637350610300804",
            ],
            [
              "1",
              "0",
            ],
          ],
          pi_c: [
            "8262490802189872625415954310406849482984788696400641346408173427078707400389",
            "20354325796210800086435179314987776116738160620252969453144906009958043477961",
            "1",
          ],
          pubSignals: ["30", "999", "30"],
        };
      }

      const tx = await contract.completeJob(
        jobId,
        proof.pi_a,
        proof.pi_b,
        proof.pi_c,
        proof.pubSignals
      );

      toast.loading("Verifying ZKP...", {
        id: "zkp",
      });

      await tx.wait();

      toast.success("ZKP VERIFIED!", {
        id: "zkp",
      });

      loadJobs(contract);
    } catch (err) {
      console.error(err);

      toast.error("Complete Job Failed", {
        id: "zkp",
      });
    }
  }

  async function releasePayment(jobId) {
    try {
      const tx = await contract.releasePayment(jobId);

      toast.loading("Releasing Payment...", {
        id: "release",
      });

      await tx.wait();

      toast.success("Payment Released!", {
        id: "release",
      });

      loadJobs(contract);
    } catch (err) {
      console.error(err);

      toast.error("Release Failed", {
        id: "release",
      });
    }
  }

  const shortenAddress = (address) => {
    if (!address) return "";

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1020] text-white">

      <Toaster position="top-right" />

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
          }}
          className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />

        <div className="absolute top-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" />

        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl px-10 py-14 mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10" />

          <div className="relative z-10">

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500">
                <Sparkles />
              </div>

              <span className="text-cyan-300 text-sm font-medium tracking-widest uppercase">
                WEB3 ESCROW PROTOCOL
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-[1.05] tracking-tight max-w-3xl">
              Decentralized Freelance Escrow
            </h1>

            <p className="mt-6 text-slate-300 text-lg max-w-2xl leading-relaxed">
              Secure blockchain-based payment between employer and freelancer
              using smart contracts.
            </p>
          </div>
        </motion.div>

        {/* ROLE SWITCH */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex gap-2 backdrop-blur-xl">

            <button
              onClick={() => setRole("employer")}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                role === "employer"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              Employer
            </button>

            <button
              onClick={() => setRole("freelancer")}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                role === "freelancer"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5"
              }`}
            >
              Freelancer
            </button>
          </div>
        </div>

        {/* WALLET */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-xl p-6 mb-10"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6 items-center">

            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500">
                <Wallet />
              </div>

              <div>
                <h2 className="font-bold text-xl">
                  Wallet Connection
                </h2>

                <p className="text-slate-400 text-sm">
                  Secure Web3 Authentication
                </p>
              </div>
            </div>

            {wallet ? (
              <div className="flex items-center gap-3 flex-wrap">

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </div>

                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  {shortenAddress(wallet)}
                </div>

                <div className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/20">
                  Hardhat
                </div>

              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:scale-105 transition-all duration-300"
              >
                Connect MetaMask
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8">

          {/* LEFT PANEL */}
          <div className="space-y-8">

            {/* CREATE JOB */}
            {role === "employer" && (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 rounded-[28px] p-8 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="text-cyan-400" />
                  <h2 className="text-2xl font-bold">
                    Create New Job
                  </h2>
                </div>

                <div className="space-y-5">

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Reward ETH
                    </label>

                    <div className="relative">
                      <Coins className="absolute left-4 top-4 text-slate-400" size={18} />

                      <input
                        type="text"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        placeholder="0.5"
                        className="w-full bg-[#121a2f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Required Skill
                    </label>

                    <div className="relative">
                      <Layers3 className="absolute left-4 top-4 text-slate-400" size={18} />

                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        placeholder="10 / 20 / 30"
                        className="w-full bg-[#121a2f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Freelancer Address
                    </label>

                    <div className="relative">
                      <User className="absolute left-4 top-4 text-slate-400" size={18} />

                      <input
                        type="text"
                        value={freelancerAddress}
                        onChange={(e) =>
                          setFreelancerAddress(e.target.value)
                        }
                        placeholder="0x..."
                        className="w-full bg-[#121a2f] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={createJob}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-[0_0_30px_rgba(59,130,246,0.35)] font-bold hover:scale-[1.02] transition-all duration-300"
                  >
                    Create Job
                  </button>
                </div>
              </motion.div>
            )}

            {/* FREELANCER DASHBOARD */}
            {role === "freelancer" && (
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-8 backdrop-blur-xl">

                <div className="flex items-center gap-3 mb-5">
                  <Rocket className="text-cyan-400" />
                  <h2 className="text-2xl font-bold">
                    Freelancer Dashboard
                  </h2>
                </div>

                <p className="text-slate-400 leading-relaxed">
                  Complete blockchain jobs and submit Zero Knowledge Proof
                  verification securely.
                </p>
              </div>
            )}
          </div>

          {/* JOBS */}
          <div>

            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-purple-400" />

              <h2 className="text-3xl font-black">
                Active Jobs
              </h2>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-20 text-center backdrop-blur-xl">

                <div className="flex justify-center mb-6">
                  <BadgeCheck size={70} className="text-slate-500" />
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  No Jobs Yet
                </h3>

                <p className="text-slate-400">
                  Create your first decentralized escrow job.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">

                {jobs.map((job) => (
                  <motion.div
                    whileHover={{
                      scale: 1.01,
                    }}
                    key={job.id}
                    className="bg-white/5 border border-white/10 rounded-[28px] p-7 backdrop-blur-xl hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300"
                  >

                    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-5">

                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                            <Briefcase />
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold">
                              Job #{job.id}
                            </h3>

                            <p className="text-slate-400 text-sm">
                              Escrow Smart Contract
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`px-4 py-2 rounded-xl h-fit text-sm font-semibold border border-white/10 ${statusColor[job.status]}`}
                      >
                        {statusText[job.status]}
                      </div>
                    </div>

                    <div className="mt-5 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          job.status == 0
                            ? "w-[20%] bg-slate-400"
                            : job.status == 1
                            ? "w-[40%] bg-blue-400"
                            : job.status == 2
                            ? "w-[65%] bg-yellow-400"
                            : job.status == 3
                            ? "w-[85%] bg-purple-400"
                            : "w-full bg-emerald-400"
                        }`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-5">

                      <div className="bg-[#121a2f] rounded-2xl p-4 border border-white/5">
                        <p className="text-slate-400 text-sm mb-1">
                          Reward
                        </p>

                        <p className="text-2xl font-black text-cyan-300">
                          {job.reward} ETH
                        </p>
                      </div>

                      <div className="bg-[#121a2f] rounded-2xl p-4 border border-white/5">
                        <p className="text-slate-400 text-sm mb-1">
                          Required Skill
                        </p>

                        <p className="text-2xl font-black text-purple-300">
                          {job.requiredSkill}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-300">

                      <p>
                        <span className="text-slate-500">
                          Employer:
                        </span>{" "}
                        {shortenAddress(job.employer)}
                      </p>

                      <p>
                        <span className="text-slate-500">
                          Freelancer:
                        </span>{" "}
                        {shortenAddress(job.freelancer)}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3 mt-7">

                      {isEmployer(job) && job.status == 0 && (
                        <button
                          onClick={() =>
                            assignFreelancer(
                              job.id,
                              "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                            )
                          }
                          className="px-5 py-3 rounded-2xl bg-blue-500/20 border border-blue-500/20 text-blue-300 hover:scale-105 transition-all"
                        >
                          Assign Freelancer
                        </button>
                      )}

                      {isEmployer(job) && job.status == 1 && (
                        <button
                          onClick={() =>
                            depositPayment(job.id, job.reward)
                          }
                          className="px-5 py-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/20 text-yellow-300 hover:scale-105 transition-all"
                        >
                          Deposit Payment
                        </button>
                      )}

                      {role === "freelancer" &&
                        job.status == 2 && (
                          <button
                            onClick={() =>
                              completeJob(job.id)
                            }
                            className="px-5 py-3 rounded-2xl bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:scale-105 transition-all"
                          >
                            Complete Job (ZKP)
                          </button>
                        )}

                      {isEmployer(job) && job.status == 3 && (
                        <button
                          onClick={() =>
                            releasePayment(job.id)
                          }
                          className="px-5 py-3 rounded-2xl bg-red-500/20 border border-red-500/20 text-red-300 hover:scale-105 transition-all"
                        >
                          Release Payment
                        </button>
                      )}

                      {job.status == 4 && (
                        <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 size={18} />
                          Payment Completed
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;