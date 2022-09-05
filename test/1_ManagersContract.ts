import { ethers, waffle } from 'hardhat';
import chai from 'chai';

import BotPreventionArtifact from '../artifacts/contracts/BotPrevention.sol/BotPrevention.json';
import ProxyArtifact from '../artifacts/contracts/Proxy.sol/Proxy.json';
import ManagersArtifact from '../artifacts/contracts/Managers.sol/Managers.json';

import { BotPrevention } from '../typechain-types/contracts/BotPrevention';
import { Proxy } from '../typechain-types/contracts/Proxy';
import { Managers } from '../typechain-types/contracts/Managers';



import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const { deployContract } = waffle;
const { expect } = chai;
var crypto = require('crypto');


describe('Managers Contract', () => {
	return
	let owner: SignerWithAddress;
	let manager1: SignerWithAddress;
	let manager2: SignerWithAddress;
	let manager3: SignerWithAddress;
	let manager4: SignerWithAddress;
	let manager5: SignerWithAddress;
	let addrs: SignerWithAddress[];

	let botPrevention: BotPrevention
	let managers: Managers
	let proxy: Proxy;

	beforeEach(async () => {
		[owner, manager1, manager2, manager3, manager4, manager5, ...addrs] = await ethers.getSigners();

		botPrevention = (await deployContract(owner, BotPreventionArtifact, [])) as BotPrevention;
		proxy = (await deployContract(owner, ProxyArtifact, [manager1.address, manager2.address, manager3.address, manager4.address, manager5.address, botPrevention.address])) as Proxy;
		managers = new ethers.Contract(await proxy.managers(), ManagersArtifact.abi) as Managers

	});
	describe('\n\n#########################################\naddAddressToTrustedSources function\n#########################################', () => {
		it("Only proxy can add an address to trusted sources", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);


			const managersOwnerAddress = await managers.connect(owner).owner()
			expect(managersOwnerAddress).to.be.equal(proxy.address);
			const tx = managers.connect(owner).addAddressToTrustedSources(wallet.address, "Manager Contract Test")
			await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');

			await proxy.addToTrustedSources(wallet.address, "Test");
			const trustedAddress = await (await managers.connect(owner).trustedSources(wallet.address)).sourceAddress;
			expect(trustedAddress).to.be.not.equal(ethers.constants.AddressZero);
		});
	});

	describe('\n\n#########################################\nisManager function\n#########################################', () => {
		it("returns true only for manager addresses", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			//Test random wallet address
			const isManager = await managers.connect(owner).isManager(wallet.address)
			expect(isManager).to.be.equal(false);

			expect(await managers.connect(owner).isManager(manager1.address)).to.be.equal(true);
			expect(await managers.connect(owner).isManager(manager2.address)).to.be.equal(true);
			expect(await managers.connect(owner).isManager(manager3.address)).to.be.equal(true);
			expect(await managers.connect(owner).isManager(manager4.address)).to.be.equal(true);
			expect(await managers.connect(owner).isManager(manager5.address)).to.be.equal(true);
		});
	});

	describe('\n\n#########################################\napproveTopic function\n#########################################', () => {
		it("only trusted sources can approve a topic and tx.origin must be a manager", async () => {
			//Create random address
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			//Test to call function directly from unauthorized wallet 
			let tx = managers.connect(owner).approveTopic("test", ethers.utils.randomBytes(32))
			await expect(tx).to.be.revertedWith("ONLY MANAGERS: Not authorized")

			//Test to call function directly from authorized wallet 
			tx = managers.connect(manager1).approveTopic("test", ethers.utils.randomBytes(32))
			await expect(tx).to.be.revertedWith("MANAGERS: Untrusted source")

			//Test to call function directly from a trusted contract 
			tx = proxy.connect(owner).testApproveTopicFunction(wallet.address);
			await expect(tx).to.be.revertedWith("ONLY MANAGERS: Not authorized")


			//Test to call function by a manager over a trusted contract 
			await proxy.connect(manager1).testApproveTopicFunction(wallet.address);
			const managerApproval = await managers.connect(owner).managerApprovalsForTopic("Proxy: Test Approve Topic Function", manager1.address)
			const activeTopics = await managers.connect(owner).getActiveTopics()
			const manager1Value = await managers.connect(owner).managerApprovalsForTopic(activeTopics[0].title, manager1.address)
			console.log("manager1Value", manager1Value)
			console.log("active topics", activeTopics)
			const decoded = new ethers.utils.AbiCoder().decode(["address"], manager1Value.value)
			console.log("decoded", wallet.address, decoded)
			expect(managerApproval.approved).to.be.equal(true);

			const addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.title).to.be.equal("Proxy: Test Approve Topic Function");
			expect(addedTopic.approveCount).to.be.equal(1);


		});

		it("adds topic to list when approved by a manager", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet1 = new ethers.Wallet(privateKey);


			await proxy.connect(manager1).testApproveTopicFunction(wallet1.address);
			const addedTopics = await managers.connect(owner).getActiveTopics()
			expect(addedTopics.length).to.be.equal(1);
			const addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.title).to.be.equal("Proxy: Test Approve Topic Function");
			expect(await proxy.approveTopicTestVariable()).to.be.equal(false);
		});

		it("Manager cannot vote same topic more than one time", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet1 = new ethers.Wallet(privateKey);


			await proxy.connect(manager1).testApproveTopicFunction(wallet1.address);
			let tx = proxy.connect(manager1).testApproveTopicFunction(wallet1.address);
			await expect(tx).to.be.revertedWith("Already voted")
		});

		it("approves topic if approved by 3 of managers", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const id2 = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			const privateKey2 = "0x" + id2;
			var wallet1 = new ethers.Wallet(privateKey);
			var wallet2 = new ethers.Wallet(privateKey2);

			let addedTopic;

			await proxy.connect(manager1).testApproveTopicFunction(wallet1.address);
			addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.approveCount).to.be.equal(1);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(false);

			await proxy.connect(manager2).testApproveTopicFunction(wallet1.address);
			addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.approveCount).to.be.equal(2);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(false);


			//Send wallet2 address as parameter instead of wallet1
			await proxy.connect(manager3).testApproveTopicFunction(wallet2.address);
			addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.approveCount).to.be.equal(3);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(false);


			await proxy.connect(manager4).testApproveTopicFunction(wallet1.address);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(true);
		});

		it("removes topic from list when approved by 3 of managers", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			let addedTopic;

			await proxy.connect(manager1).testApproveTopicFunction(wallet.address);
			addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.approveCount).to.be.equal(1);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(false);

			await proxy.connect(manager2).testApproveTopicFunction(wallet.address);
			addedTopic = await managers.connect(owner).activeTopics(0)
			expect(addedTopic.approveCount).to.be.equal(2);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(false);


			await proxy.connect(manager3).testApproveTopicFunction(wallet.address);
			const addedTopics = await managers.connect(owner).getActiveTopics()
			expect(addedTopics.length).to.be.equal(0);
			expect(await proxy.approveTopicTestVariable()).to.be.equal(true);
		});
	});

	describe('\n\n#########################################\ncancelTopicApproval function\n#########################################', () => {
		it("reverts if title not exists", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			let tx = managers.connect(manager1).cancelTopicApproval("Non-exist Title");
			await expect(tx).to.be.revertedWith("Topic not found")

		});
		it("reverts if manager didn't voted title", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			//Vote using manager1
			await proxy.connect(manager1).testApproveTopicFunction(wallet.address);
			const managerApproval = await managers.connect(owner).managerApprovalsForTopic("Proxy: Test Approve Topic Function", manager1.address)
			expect(managerApproval.approved).to.be.equal(true);;

			//Try to cancel vote using manager2
			let tx = managers.connect(manager2).cancelTopicApproval("Proxy: Test Approve Topic Function");
			await expect(tx).to.be.revertedWith("Topic not approved by manager")
		});

		it("cancels manager's vote if voted (also tests _deleteTopic internal function)", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			//Approve with manager1
			await proxy.connect(manager1).testApproveTopicFunction(wallet.address);
			const managerApproval = await managers.connect(owner).managerApprovalsForTopic("Proxy: Test Approve Topic Function", manager1.address)
			expect(managerApproval.approved).to.be.equal(true);

			let approveInfo = await managers.connect(owner).managerApprovalsForTopic("Proxy: Test Approve Topic Function", manager1.address);
			expect(approveInfo.approved).to.be.equal(true);

			//Cancel approval
			await managers.connect(manager1).cancelTopicApproval("Proxy: Test Approve Topic Function");

			approveInfo = await managers.connect(owner).managerApprovalsForTopic("Proxy: Test Approve Topic Function", manager1.address);
			expect(approveInfo.approved).to.be.equal(false);

			const activeTopics = await managers.connect(owner).getActiveTopics();
			expect(activeTopics.length).to.be.equal(0)

		});


		it("removes from topic list if all the managers canceled their votes", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			//Approve with manager1
			await proxy.connect(manager1).testApproveTopicFunction(wallet.address);

			//Approve with manager2
			await proxy.connect(manager2).testApproveTopicFunction(wallet.address);


			let approveInfo = await managers.connect(owner).managerApprovalsForTopic("Proxy: Test Approve Topic Function", manager1.address);
			expect(approveInfo.approved).to.be.equal(true);
			let activeTopics = await managers.connect(owner).getActiveTopics()

			expect(activeTopics.length).to.be.equal(1);
			//Cancel approval
			await managers.connect(manager1).cancelTopicApproval("Proxy: Test Approve Topic Function");
			activeTopics = await managers.connect(owner).getActiveTopics()
			expect(activeTopics.length).to.be.equal(1);

			await managers.connect(manager2).cancelTopicApproval("Proxy: Test Approve Topic Function");
			activeTopics = await managers.connect(owner).getActiveTopics()

			expect(activeTopics.length).to.be.equal(0);
		});



	});

	describe('\n\n#########################################\nchangeManagerAddress function\n#########################################', () => {
		it("reverts if try to change own address", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			let tx = managers.connect(manager1).changeManager1Address(wallet.address);
			await expect(tx).to.be.revertedWith("Cannot approve to set own address")

		});
		it("changes if approved same address by 3 other managers", async () => {
			const id = crypto.randomBytes(32).toString('hex');
			const privateKey = "0x" + id;
			var wallet = new ethers.Wallet(privateKey);

			await managers.connect(manager2).changeManager1Address(wallet.address);
			await managers.connect(manager3).changeManager1Address(wallet.address);
			await managers.connect(manager4).changeManager1Address(wallet.address);

			expect(await managers.connect(owner).manager1()).to.be.equal(wallet.address);

		});
	});
});
