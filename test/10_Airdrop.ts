const keccak256 = require('keccak256');

import { ethers, waffle } from 'hardhat';
import chai from 'chai';
const { MerkleTree } = require('merkletreejs')

import BotPreventionArtifact from '../artifacts/contracts/BotPrevention.sol/BotPrevention.json';
import ProxyArtifact from '../artifacts/contracts/Proxy.sol/Proxy.json';
import ManagersArtifact from '../artifacts/contracts/Managers.sol/Managers.json';
import SoulsArtifact from '../artifacts/contracts/SoulsToken.sol/SoulsToken.json';
import StakingArtifact from '../artifacts/contracts/Staking.sol/Staking.json';
import VaultArtifact from '../artifacts/contracts/Vault.sol/Vault.json';
import LiquidityVaultArtifact from '../artifacts/contracts/LiquidityVault.sol/LiquidityVault.json';
import CrowdFundingArtifact from '../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';
import BUSDTokenArtifact from '../artifacts/contracts/BUSDToken.sol/BUSDToken.json';
import IPancakeRouterArtifact from '../artifacts/contracts/interfaces/IPancakeRouter02.sol/IPancakeRouter02.json'
import AirdropArtifact from '../artifacts/contracts/Airdrop.sol/Airdrop.json'
import AirdropVaultArtifact from '../artifacts/contracts/AirdropVault.sol/AirdropVault.json'


import { BotPrevention, Proxy, Managers, SoulsToken, AirdropVault, Airdrop } from '../typechain-types/contracts';




import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IPancakeRouter02 } from '../typechain-types/contracts/interfaces/IPancakeRouter02';
import { Wallet } from 'ethers';

const { deployContract } = waffle;
const { expect } = chai;




const simulateTimeInSeconds = async (duration: number) => {
	const blockNumBefore = await ethers.provider.getBlockNumber();
	const blockBefore = await ethers.provider.getBlock(blockNumBefore);

	await ethers.provider.send('evm_increaseTime', [duration]);
	await ethers.provider.send('evm_mine', []);
};

const gotoTime = async (time: number) => {
	const now = (await ethers.provider.getBlock("latest")).timestamp
	await simulateTimeInSeconds(time - now)
}



describe('Airdrop Contract', () => {
	let owner: SignerWithAddress;
	let manager1: SignerWithAddress;
	let manager2: SignerWithAddress;
	let manager3: SignerWithAddress;
	let manager4: SignerWithAddress;
	let manager5: SignerWithAddress;
	let airdropAccount1: SignerWithAddress;
	let airdropAccount2: SignerWithAddress;
	let fakeAirdropAccount2: SignerWithAddress;
	let addrs: SignerWithAddress[];


	let botPrevention: BotPrevention
	let managers: Managers
	let proxy: Proxy;
	let soulsToken: SoulsToken;
	let airdropContract: Airdrop
	let airdropVault: AirdropVault
	let merkleTree: any
	let mappedLeafNodes: any = {}
	let rootHash = ""
	enum VaultEnumerator {
		MARKETING,
		ADVISOR,
		AIRDROP,
		TEAM,
		EXCHANGES,
		TREASURY
	}
	beforeEach(async () => {
		[owner, manager1, manager2, manager3, manager4, manager5, airdropAccount1, airdropAccount2, fakeAirdropAccount2, ...addrs] = await ethers.getSigners();

		botPrevention = (await deployContract(owner, BotPreventionArtifact, [])) as BotPrevention;
		await botPrevention.deployed()

		proxy = (await deployContract(owner, ProxyArtifact, [manager1.address, manager2.address, manager3.address, manager4.address, manager5.address, botPrevention.address])) as Proxy;
		await proxy.deployed()

		managers = new ethers.Contract(await proxy.managers(), ManagersArtifact.abi) as Managers
		soulsToken = new ethers.Contract(await proxy.soulsToken(), SoulsArtifact.abi) as SoulsToken
		airdropVault = (await deployContract(owner, AirdropVaultArtifact, ["Airdrop Vault", proxy.address, soulsToken.address, managers.address])) as AirdropVault;

		await airdropVault.deployed()

		await proxy.initVault(airdropVault.address, VaultEnumerator.AIRDROP)
		const vestings = await airdropVault.getVestingData()
		const unlockTime = vestings[0].unlockTime

		await gotoTime(unlockTime.toNumber())

		airdropContract = (await deployContract(owner, AirdropArtifact, [managers.address, soulsToken.address])) as Airdrop;

		await proxy.connect(manager1).initAirdropContract(airdropContract.address)
		await proxy.connect(manager2).initAirdropContract(airdropContract.address)
		await proxy.connect(manager3).initAirdropContract(airdropContract.address)


		await airdropVault.connect(manager1).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))
		await airdropVault.connect(manager2).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))
		await airdropVault.connect(manager3).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))

		const airdropPeriod = await (await airdropContract.airdropRecordCount()).toNumber()
		var wallet1 = Wallet.createRandom();
		var wallet2 = Wallet.createRandom();
		var wallet3 = Wallet.createRandom();

		const airdropData = [
			[airdropAccount1.address, airdropPeriod, ethers.utils.parseEther("1000")],
			[wallet1.address, airdropPeriod, ethers.utils.parseEther("1500")],
			[wallet2.address, airdropPeriod, ethers.utils.parseEther("1000")],
			[wallet3.address, airdropPeriod, ethers.utils.parseEther("1000")],
			[airdropAccount2.address, airdropPeriod, ethers.utils.parseEther("500")],
		]
		let leafNodes = airdropData.map(arr => ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], arr))

		airdropData.map((item, index) => {
			const address = item[0].toString()

			mappedLeafNodes[address] = { leafNode: leafNodes[index], amount: item[2] }
		})
		merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
		rootHash = merkleTree.getHexRoot()

		const time = await (await ethers.provider.getBlock("latest")).timestamp
		const startTime = time + 60
		const endTime = startTime + 24 * 60 * 60

		await airdropContract.connect(manager1).createNewAirdrop(rootHash, ethers.utils.parseEther("5000"), startTime, endTime)
		await airdropContract.connect(manager2).createNewAirdrop(rootHash, ethers.utils.parseEther("5000"), startTime, endTime)
		await airdropContract.connect(manager3).createNewAirdrop(rootHash, ethers.utils.parseEther("5000"), startTime, endTime)

	});


	describe('\n\n#########################################\n claimTokens Function \n#########################################', () => {
		it("Cannot claim before start time", async () => {

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)

			const tx = airdropContract.connect(airdropAccount1).claimTokens(mappedLeafNodes[airdropAccount1.address].amount.toString(), hexProof)
			await expect(tx).to.be.revertedWith("Airdrop period didn't start yet")
		});
		it("Cannot claim more then allocation", async () => {
			const airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			const record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.startTime.toNumber())

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)

			const tx = airdropContract.connect(airdropAccount1).claimTokens((mappedLeafNodes[airdropAccount1.address].amount + 1).toString(), hexProof)
			await expect(tx).to.be.revertedWith("There is no allocation for caller or wrong parameters")
		});
		it("Can claim with correct amount", async () => {
			const airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			const record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.startTime.toNumber())

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)

			await airdropContract.connect(airdropAccount1).claimTokens((mappedLeafNodes[airdropAccount1.address].amount).toString(), hexProof)
			expect(await soulsToken.connect(airdropAccount1).balanceOf(airdropAccount1.address)).to.be.equal((mappedLeafNodes[airdropAccount1.address].amount).toString())
		});
		it("Cannot claim if there is no allocation", async () => {
			const airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			const record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.startTime.toNumber())

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)
			const tx =  airdropContract.connect(fakeAirdropAccount2).claimTokens((mappedLeafNodes[airdropAccount1.address].amount).toString(), hexProof)
			await expect(tx).to.be.revertedWith("There is no allocation for caller or wrong parameters")
		});

		it("Cannot claim after period end time", async () => {
			const airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			const record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.startTime.toNumber())

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)
			await airdropContract.connect(airdropAccount1).claimTokens((mappedLeafNodes[airdropAccount1.address].amount).toString(), hexProof)
			await gotoTime(record.endTime.toNumber())

			const tx =  airdropContract.connect(airdropAccount2).claimTokens((mappedLeafNodes[airdropAccount2.address].amount).toString(), hexProof)
			await expect(tx).to.be.revertedWith("Airdrop period has ended")
		});





	});
	describe('\n\n#########################################\n createNewAirdrop Function \n#########################################', () => {
		it("Managers cannot create new airdrop before current period finish", async () => {
			const airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			const record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.startTime.toNumber())

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)
			await airdropContract.connect(airdropAccount1).claimTokens((mappedLeafNodes[airdropAccount1.address].amount).toString(), hexProof)


			await airdropVault.connect(manager1).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))
			await airdropVault.connect(manager2).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))
			await airdropVault.connect(manager3).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))

			const airdropPeriod = await (await airdropContract.airdropRecordCount()).toNumber()
			var wallet1 = Wallet.createRandom();
			var wallet2 = Wallet.createRandom();
			var wallet3 = Wallet.createRandom();

			const airdropData = [
				[airdropAccount1.address, airdropPeriod, ethers.utils.parseEther("1000")],
				[wallet1.address, airdropPeriod, ethers.utils.parseEther("1500")],
				[wallet2.address, airdropPeriod, ethers.utils.parseEther("1000")],
				[wallet3.address, airdropPeriod, ethers.utils.parseEther("1000")],
				[airdropAccount2.address, airdropPeriod, ethers.utils.parseEther("500")],
			]
			let leafNodes = airdropData.map(arr => ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], arr))

			airdropData.map((item, index) => {
				const address = item[0].toString()

				mappedLeafNodes[address] = { leafNode: leafNodes[index], amount: item[2] }
			})
			merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
			rootHash = merkleTree.getHexRoot()

			const time = await (await ethers.provider.getBlock("latest")).timestamp
			const startTime = time + 60
			const endTime = startTime + 24 * 60 * 60
			const tx = airdropContract.connect(manager1).createNewAirdrop(rootHash, ethers.utils.parseEther("5000"), startTime, endTime)
			await expect(tx).to.be.revertedWith("Current period didn't finish yet")


		});
		it("Managers can create new airdrop after current period finish", async () => {
			let airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			let record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.endTime.toNumber())

			const hexProof = merkleTree.getHexProof(mappedLeafNodes[airdropAccount1.address].leafNode)
			await airdropVault.connect(manager1).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))
			await airdropVault.connect(manager2).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))
			await airdropVault.connect(manager3).depositToAirdropContract(airdropContract.address, ethers.utils.parseEther("5000"))

			const airdropPeriod = await (await airdropContract.airdropRecordCount()).toNumber()
			var wallet1 = Wallet.createRandom();
			var wallet2 = Wallet.createRandom();
			var wallet3 = Wallet.createRandom();

			const airdropData = [
				[wallet1.address, airdropPeriod, ethers.utils.parseEther("1500")],
				[wallet2.address, airdropPeriod, ethers.utils.parseEther("1000")],
				[wallet3.address, airdropPeriod, ethers.utils.parseEther("1000")],
				[airdropAccount2.address, airdropPeriod, ethers.utils.parseEther("500")],
			]
			let leafNodes = airdropData.map(arr => ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], arr))

			airdropData.map((item, index) => {
				const address = item[0].toString()

				mappedLeafNodes[address] = { leafNode: leafNodes[index], amount: item[2] }
			})
			merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
			rootHash = merkleTree.getHexRoot()

			const time = await (await ethers.provider.getBlock("latest")).timestamp
			const startTime = time + 60
			const endTime = startTime + 24 * 60 * 60
			await airdropContract.connect(manager1).createNewAirdrop(rootHash, ethers.utils.parseEther("4000"), startTime, endTime)
			await airdropContract.connect(manager2).createNewAirdrop(rootHash, ethers.utils.parseEther("4000"), startTime, endTime)
			await airdropContract.connect(manager3).createNewAirdrop(rootHash, ethers.utils.parseEther("4000"), startTime, endTime)

			airdropRecordCount = await (await airdropContract.airdropRecordCount()).toNumber()
			record = await airdropContract.airdropRecords(airdropRecordCount - 1)
			await gotoTime(record.startTime.toNumber())

			console.log("Try to claim allocation from previous period")
			const tx = airdropContract.connect(airdropAccount1).claimTokens((mappedLeafNodes[airdropAccount1.address].amount).toString(), hexProof)
			await expect(tx).to.be.revertedWith("There is no allocation for caller or wrong parameters")

		});
	})
});
