// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Verifier.sol";

contract MicroGig {

    uint public jobCount;

    Groth16Verifier public verifier;

    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }

    enum JobStatus { Created, Assigned, Funded, Completed, Paid }

    struct Job {
        uint id;
        address employer;
        address freelancer;
        uint reward;
        uint requiredSkill;
        JobStatus status;
    }

    mapping(uint => Job) public jobs;

    event JobCreated(uint jobId);
    event FreelancerAssigned(uint jobId, address freelancer);
    event PaymentDeposited(uint jobId);
    event JobCompleted(uint jobId);
    event PaymentReleased(uint jobId);

    // 🔴 CREATE JOB
    function createJob(uint _reward, uint _requiredSkill) public {

        jobCount++;

        jobs[jobCount] = Job({
            id: jobCount,
            employer: msg.sender,
            freelancer: address(0),
            reward: _reward,
            requiredSkill: _requiredSkill,
            status: JobStatus.Created
        });

        emit JobCreated(jobCount);
    }

    // 🔴 ASSIGN FREELANCER
    function assignFreelancer(uint _jobId, address _freelancer) public {

        Job storage job = jobs[_jobId];

        require(msg.sender == job.employer, "Only employer");
        require(job.status == JobStatus.Created, "Already assigned");

        job.freelancer = _freelancer;
        job.status = JobStatus.Assigned;

        emit FreelancerAssigned(_jobId, _freelancer);
    }

    // 🔴 DEPOSIT PAYMENT
    function depositPayment(uint _jobId) public payable {

        Job storage job = jobs[_jobId];

        require(msg.sender == job.employer, "Only employer");
        require(job.status == JobStatus.Assigned, "Not assigned");
        require(msg.value == job.reward, "Wrong amount");

        job.status = JobStatus.Funded;

        emit PaymentDeposited(_jobId);
    }

    // 🔥 COMPLETE JOB + ZKP
    function completeJob(
        uint _jobId,
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[3] memory _pubSignals
    ) public {

        Job storage job = jobs[_jobId];

        require(msg.sender == job.freelancer, "Only freelancer");
        require(job.status == JobStatus.Funded, "Not funded");

        // 🔥 VALIDASI SKILL
        require(
            _pubSignals[0] == job.requiredSkill,
            "Skill mismatch"
        );

        // 🔥 VERIFY ZKP
        require(
            verifier.verifyProof(_pA, _pB, _pC, _pubSignals),
            "Invalid ZKP proof"
        );

        job.status = JobStatus.Completed;

        emit JobCompleted(_jobId);
    }

    // 🔴 RELEASE PAYMENT
    function releasePayment(uint _jobId) public {

        Job storage job = jobs[_jobId];

        require(msg.sender == job.employer, "Only employer");
        require(job.status == JobStatus.Completed, "Not completed");

        job.status = JobStatus.Paid;

        payable(job.freelancer).transfer(job.reward);

        emit PaymentReleased(_jobId);
    }
}