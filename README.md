# MicroGigZKP

## Perancangan dan Implementasi Platform Freelance Berbasis Blockchain dengan Escrow Payment dan Zero-Knowledge Proof untuk Verifikasi Keahlian

---

## Deskripsi Project

MicroGigZKP adalah platform freelance berbasis blockchain yang mengimplementasikan sistem escrow payment dan Zero-Knowledge Proof (ZKP) untuk verifikasi keahlian freelancer tanpa membocorkan data asli pengguna.

Pada sistem freelance konvensional, proses verifikasi skill biasanya mengharuskan freelancer memperlihatkan sertifikat atau data pribadi secara langsung. Pada aplikasi ini, freelancer cukup mengirimkan cryptographic proof untuk membuktikan bahwa mereka memiliki skill tertentu tanpa memperlihatkan data rahasia mereka.

Selain itu, sistem pembayaran menggunakan mekanisme escrow berbasis smart contract sehingga pembayaran ditahan sementara di blockchain hingga pekerjaan selesai dan proof berhasil diverifikasi.

---

# Fitur Utama

* Smart Contract berbasis Solidity
* Escrow Payment menggunakan Ethereum
* Verifikasi skill menggunakan Zero-Knowledge Proof
* Integrasi MetaMask Wallet
* Frontend React + Vite
* Blockchain lokal menggunakan Hardhat
* Verifikasi proof on-chain
* Workflow freelance berbasis blockchain

---

# Teknologi yang Digunakan

## Blockchain

* Solidity
* Hardhat
* Ethereum Local Network

## Frontend

* React
* Vite
* Tailwind CSS
* Ethers.js

## Wallet

* MetaMask

## Zero Knowledge Proof

* Circom
* SnarkJS
* Groth16

---

# Konsep Sistem

## Alur Aplikasi

### 1. Employer Membuat Job

Employer membuat lowongan pekerjaan dengan mengisi:

* Reward pembayaran
* Skill yang dibutuhkan
* Freelancer yang dipilih

Contoh:

* Reward: 1 ETH
* Skill: 10

Keterangan:

* 10 = UI Design
* 20 = Frontend
* 30 = Backend
* 40 = Blockchain

Skill direpresentasikan menggunakan angka agar kompatibel dengan proses Zero-Knowledge Proof.

---

### 2. Job Disimpan ke Blockchain

Data job disimpan ke smart contract Ethereum.

Status awal:

* Created

---

### 3. Employer Assign Freelancer

Employer memilih freelancer untuk mengerjakan job.

Status berubah menjadi:

* Assigned

---

### 4. Employer Deposit Payment

Employer mengirim pembayaran ke smart contract.

Dana tidak langsung diberikan ke freelancer, tetapi ditahan sementara sebagai escrow.

Status berubah menjadi:

* Funded

---

### 5. Freelancer Mengirim ZKP Proof

Freelancer mengirim cryptographic proof untuk membuktikan bahwa mereka memiliki skill yang dibutuhkan.

Freelancer tidak perlu membocorkan:

* Sertifikat asli
* Data pribadi
* Institusi pendidikan

Status berubah menjadi:

* Completed

---

### 6. Employer Release Payment

Employer melepaskan pembayaran setelah proof berhasil diverifikasi.

ETH dikirim otomatis ke freelancer melalui smart contract.

Status akhir:

* Paid

---

# Workflow Singkat

Employer Create Job
→ Assign Freelancer
→ Deposit Payment
→ Freelancer Submit ZKP
→ Smart Contract Verify Proof
→ Release Payment

---

# Struktur Project

```bash
microgig-blockchain/
│
├── contracts/
│   ├── MicroGig.sol
│   └── Verifier.sol
│
├── frontend/
│   ├── src/
│   └── public/
│
├── scripts/
│   ├── deploy.js
│   └── deployAll.js
│
├── zkp/
│   ├── proof.json
│   ├── public.json
│   ├── verification_key.json
│   └── skillProof.circom
│
└── hardhat.config.ts
```

---

# Cara Menjalankan Project

## 1. Install Software yang Dibutuhkan

Pastikan sudah menginstall:

### Node.js

Download:
[https://nodejs.org/](https://nodejs.org/)

Cek versi:

```bash
node -v
npm -v
```

---

### MetaMask Extension

Install MetaMask:
[https://metamask.io/](https://metamask.io/)

---

### Git

Download:
[https://git-scm.com/](https://git-scm.com/)

---

# Clone Repository

```bash
git clone https://github.com/Agunggynastiar/microgig-zkp-platform.git
```

Masuk ke folder project:

```bash
cd microgig-zkp-platform
```

---

# Install Dependencies

## Root Project

```bash
npm install
```

---

## Frontend

```bash
cd frontend
npm install
```

Kembali ke root:

```bash
cd ..
```

---

# Menjalankan Blockchain Local

Jalankan Hardhat Node:

```bash
npx hardhat node
```

Akan muncul beberapa akun testing Hardhat.

Contoh:

```bash
Account #0
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Account #1
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

---

# Deploy Smart Contract

Buka terminal baru:

```bash
npx hardhat run scripts/deployAll.js --network localhost
```

Contoh output:

```bash
Verifier deployed to: 0x....
MicroGig deployed to: 0x....
```

Copy alamat contract MicroGig.

---

# Setup Contract Address Frontend

Buka file:

```bash
frontend/src/contracts/MicroGigABI.js
```

Ganti CONTRACT_ADDRESS dengan address hasil deploy.

Contoh:

```javascript
export const CONTRACT_ADDRESS = "0x123....";
```

---

# Menjalankan Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Jalankan frontend:

```bash
npm run dev
```

Buka browser:

```bash
http://localhost:5173
```

---

# Setup MetaMask

## Tambahkan Network Hardhat

Network Name:

```text
Hardhat Localhost
```

RPC URL:

```text
http://127.0.0.1:8545
```

Chain ID:

```text
31337
```

Currency Symbol:

```text
ETH
```

---

# Import Akun Hardhat ke MetaMask

Copy private key dari terminal Hardhat Node.

Import minimal:

* Account #0 → Employer
* Account #1 → Freelancer

---

# Cara Menggunakan Aplikasi

## Employer

1. Connect MetaMask
2. Create Job
3. Assign Freelancer
4. Deposit Payment

---

## Freelancer

1. Switch ke akun freelancer
2. Complete Job (ZKP)

---

## Employer

1. Release Payment

---

# Status Workflow

| Status | Keterangan |
| ------ | ---------- |
| 0      | Created    |
| 1      | Assigned   |
| 2      | Funded     |
| 3      | Completed  |
| 4      | Paid       |

---

# Implementasi Zero-Knowledge Proof

## Public Input

* Required Skill

## Private Input

* Skill asli freelancer

## Verifikasi

Verifier smart contract memvalidasi proof tanpa melihat data asli freelancer.

---

# On-Chain vs Off-Chain

## On-Chain

* Job data
* Escrow payment
* Smart contract state
* ZKP verification

## Off-Chain

* Frontend React
* Proof generation
* User interface

---

# Mekanisme Konsensus

Project ini menggunakan pendekatan Ethereum Account Model dengan simulasi jaringan blockchain lokal menggunakan Hardhat.

Secara konsep, sistem mengikuti model Ethereum yang menggunakan mekanisme Proof of Stake (PoS).

---

# Testing

## ZKP Verification Test

* Valid proof diterima
* Invalid proof ditolak

## Escrow Test

* Payment hanya dapat dirilis setelah ZKP valid

## Unauthorized Access Test

* Freelancer tidak dapat release payment
* Employer tidak dapat complete job

---

# Screenshot Demo

Tambahkan screenshot:

* Create Job
* Deposit Payment
* ZKP Verification
* Release Payment
* Final Paid Status

---

# Repository

GitHub Repository:

[https://github.com/Agunggynastiar/microgig-zkp-platform](https://github.com/Agunggynastiar/microgig-zkp-platform)

---

# Author

Kelompok Tugas Besar PBP 2026

* Agung Gynastiar
* (Tambahkan anggota kelompok)

---

# Lisensi

Project ini dibuat untuk kebutuhan akademik dan pembelajaran blockchain serta Zero-Knowledge Proof.
