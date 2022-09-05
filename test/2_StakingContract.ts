import { ethers, waffle } from 'hardhat';
import chai from 'chai';

import BotPreventionArtifact from '../artifacts/contracts/BotPrevention.sol/BotPrevention.json';
import ProxyArtifact from '../artifacts/contracts/Proxy.sol/Proxy.json';
import ManagersArtifact from '../artifacts/contracts/Managers.sol/Managers.json';
import SoulsTokenArtifact from '../artifacts/contracts/SoulsToken.sol/SoulsToken.json';
import StakingArtifact from '../artifacts/contracts/Staking.sol/Staking.json';


import { BotPrevention } from '../typechain-types/contracts/BotPrevention';
import { Proxy } from '../typechain-types/contracts/Proxy';
import { Managers } from '../typechain-types/contracts/Managers';
import { SoulsToken } from '../typechain-types/contracts/SoulsToken';
import { Staking } from '../typechain-types/contracts/Staking';



import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

const { deployContract } = waffle;
const { expect } = chai;


const _dexFactoryAddress = "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc";
const _dexRouterAddress = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";
const _BUSDTokenAddress = "0x8c552cF3F61aBEA86741e9828C1A4Eb31d48590D"

const stakingAPYFor1Month = 5
const stakingAPYFor3Month = 10
const stakingAPYFor6Month = 15
const stakingAPYFor12Month = 20

const simulateTimeInSeconds = async (duration: number) => {
	const blockNumBefore = await ethers.provider.getBlockNumber();
	const blockBefore = await ethers.provider.getBlock(blockNumBefore);

	await ethers.provider.send('evm_increaseTime', [duration]);
	await ethers.provider.send('evm_mine', []);
};


describe('Staking Contract', () => {
	return
	let owner: SignerWithAddress;
	let manager1: SignerWithAddress;
	let manager2: SignerWithAddress;
	let manager3: SignerWithAddress;
	let manager4: SignerWithAddress;
	let manager5: SignerWithAddress;
	let staker: SignerWithAddress;
	let addrs: SignerWithAddress[];


	let botPrevention: BotPrevention
	let managers: Managers
	let proxy: Proxy;
	let souls: SoulsToken;
	let staking: Staking;

	beforeEach(async () => {
		[owner, manager1, manager2, manager3, manager4, manager5, staker, ...addrs] = await ethers.getSigners();

		botPrevention = (await deployContract(owner, BotPreventionArtifact, [])) as BotPrevention;
		proxy = (await deployContract(owner, ProxyArtifact, [manager1.address, manager2.address, manager3.address, manager4.address, manager5.address, botPrevention.address])) as Proxy;
		managers = new ethers.Contract(await proxy.managers(), ManagersArtifact.abi) as Managers
		souls = new ethers.Contract(await proxy.soulsToken(), SoulsTokenArtifact.abi) as SoulsToken
		staking = (await deployContract(owner, StakingArtifact, [souls.address, managers.address, ethers.utils.parseEther(stakingAPYFor1Month.toString()), ethers.utils.parseEther(stakingAPYFor3Month.toString()), ethers.utils.parseEther(stakingAPYFor6Month.toString()), ethers.utils.parseEther(stakingAPYFor12Month.toString())])) as Staking;
		await botPrevention.connect(owner).setTokenAddress(souls.address)

			await proxy.initStakingContract(staking.address);
			console.log("")


	});

	describe('\n\n#########################################\n Transfer tokens (10% of total supply) to staking contract for staking rewards while initializing\n#########################################', () => {
		it("Transfers tokens from proxy contract to staking contract", async () => {
			const tokenBalanceInStakingContract = await souls.connect(owner).balanceOf(staking.address)
			console.log(ethers.utils.formatEther(tokenBalanceInStakingContract) + " souls token locked in staking contract");
			expect(tokenBalanceInStakingContract).to.be.equal(ethers.utils.parseEther("300000000"))
		})
	})

	describe('\n\n#########################################\n pause and unpause functions\n#########################################', () => {
		it("Managers can pause/unpause new stakings by voting system. (Withdrawing is open always)", async () => {
			await staking.connect(manager1).pause()
			expect(await staking.connect(owner).paused()).to.be.equal(false);
			await staking.connect(manager2).pause()
			expect(await staking.connect(owner).paused()).to.be.equal(false);
			await staking.connect(manager3).pause()
			expect(await staking.connect(owner).paused()).to.be.equal(true);

			await staking.connect(manager1).unpause()
			expect(await staking.connect(owner).paused()).to.be.equal(true);
			await staking.connect(manager2).unpause()
			expect(await staking.connect(owner).paused()).to.be.equal(true);
			await staking.connect(manager3).unpause()
			expect(await staking.connect(owner).paused()).to.be.equal(false);
		})
	})

	describe('\n\n#########################################\n changeStakeAPYrates function\n#########################################', () => {
		it("Managers can change APY rates by voting system.", async () => {
			await staking.connect(manager1).changeStakeAPYrates(ethers.utils.parseEther("10"), ethers.utils.parseEther("15"), ethers.utils.parseEther("20"), ethers.utils.parseEther("25"))
			expect(await staking.connect(owner).stakePercentagePer1Month()).to.be.equal(ethers.utils.parseEther("5"));
			expect(await staking.connect(owner).stakePercentagePer3Month()).to.be.equal(ethers.utils.parseEther("10"));
			expect(await staking.connect(owner).stakePercentagePer6Month()).to.be.equal(ethers.utils.parseEther("15"));
			expect(await staking.connect(owner).stakePercentagePer12Month()).to.be.equal(ethers.utils.parseEther("20"));
			await staking.connect(manager2).changeStakeAPYrates(ethers.utils.parseEther("10"), ethers.utils.parseEther("15"), ethers.utils.parseEther("20"), ethers.utils.parseEther("25"))
			expect(await staking.connect(owner).stakePercentagePer1Month()).to.be.equal(ethers.utils.parseEther("5"));
			expect(await staking.connect(owner).stakePercentagePer3Month()).to.be.equal(ethers.utils.parseEther("10"));
			expect(await staking.connect(owner).stakePercentagePer6Month()).to.be.equal(ethers.utils.parseEther("15"));
			expect(await staking.connect(owner).stakePercentagePer12Month()).to.be.equal(ethers.utils.parseEther("20"));
			await staking.connect(manager3).changeStakeAPYrates(ethers.utils.parseEther("10"), ethers.utils.parseEther("15"), ethers.utils.parseEther("20"), ethers.utils.parseEther("25"))
			expect(await staking.connect(owner).stakePercentagePer1Month()).to.be.equal(ethers.utils.parseEther("10"));
			expect(await staking.connect(owner).stakePercentagePer3Month()).to.be.equal(ethers.utils.parseEther("15"));
			expect(await staking.connect(owner).stakePercentagePer6Month()).to.be.equal(ethers.utils.parseEther("20"));
			expect(await staking.connect(owner).stakePercentagePer12Month()).to.be.equal(ethers.utils.parseEther("25"));
		})
	})

	describe('\n\n#########################################\n changeMinimumStakingAmount function\n############', () => {
		it("Managers can change minimum staking amount by voting system.", async () => {
			await staking.connect(manager1).changeMinimumStakingAmount(ethers.utils.parseEther("5000"))
			expect(await staking.connect(owner).minimumStakingAmount()).to.be.equal(ethers.utils.parseEther("10000"));
			await staking.connect(manager2).changeMinimumStakingAmount(ethers.utils.parseEther("5000"))
			expect(await staking.connect(owner).minimumStakingAmount()).to.be.equal(ethers.utils.parseEther("10000"));
			await staking.connect(manager3).changeMinimumStakingAmount(ethers.utils.parseEther("5000"))
			expect(await staking.connect(owner).minimumStakingAmount()).to.be.equal(ethers.utils.parseEther("5000"));
		})
	})

	describe("\n\n#########################################\n stake function\n#########################################", () => {
		it("reverts staking if token amount less then minimum staking amount", async () => {
			const tx = staking.connect(staker).stake(ethers.utils.parseEther("5000"), 1);
			await expect(tx).to.be.revertedWith("Amount must be greater than minimum staking amount");
		})

		it("reverts staking with invalid duration parameter (should accept only 1, 3, 6 and 12)", async () => {
			const tx = staking.connect(staker).stake(ethers.utils.parseEther("10000"), 2);
			await expect(tx).to.be.revertedWith("Invalid staking duraiton");
		})

		it("reverts staking if token approval is not enough", async () => {
			const tx = staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
		})

		it("reverts staking if user's token balance is not enough", async () => {
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);
			const tx = staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
		})

		it("reverts staking if staking paused by admins", async () => {
			await staking.connect(manager1).pause()
			await staking.connect(manager2).pause()
			await staking.connect(manager3).pause()
			
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);
			const tx =  staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			await expect(tx).to.be.revertedWith("Pausable: paused")
		})

		it("accepts staking if every thing is ok", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);
			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			const stakingData = await staking.connect(owner).stakes(staker.address, 0)
			expect(stakingData.amount).to.be.equal(ethers.utils.parseEther("10000"))
		})

		it("emits `Stake` event with parameters `msg.sender, amount, stake date and release date)`", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("10000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);
			const tx = staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			expect(tx).to.emit(staking, "Stake")
		})

	})

	describe("\n\n#########################################\n fetchStakeReward function\n#########################################", () => {
		it("applies penalty fee with amount of APY in the first time of staking", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);

			const stakeRewardInfo = await staking.connect(staker).fetchStakeReward(0);

			expect(stakeRewardInfo._totalAmount).to.be.equal(ethers.utils.parseEther("10000"))
			const stakeAPY = await staking.connect(owner).stakePercentagePer1Month()
			const calculatedPenalty = BigNumber.from(10000).mul(stakeAPY).div(ethers.utils.parseEther("100"))
			console.log("calculated panalty: ", calculatedPenalty.toString())
			expect(stakeRewardInfo._penaltyAmount).to.be.equal(ethers.utils.parseEther(calculatedPenalty.toString()))

		})

		it("applies decreasing percentage of penalty fee on for emergency withdraw", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);


			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			const results = []

			const stakeRewardInfo = await staking.connect(staker).fetchStakeReward(0);
			results.push({
				day: 0,
				totalAmount: ethers.utils.formatEther(stakeRewardInfo._totalAmount),
				penaltyAmount: ethers.utils.formatEther(stakeRewardInfo._penaltyAmount),
				remainingAmount: ethers.utils.formatEther(stakeRewardInfo._totalAmount.sub(stakeRewardInfo._penaltyAmount))
			})

			for (let i = 1; i <= 40; i++) {
				await simulateTimeInSeconds(24 * 60 * 60)
				const stakeRewardInfo = await staking.connect(staker).fetchStakeReward(0);
				results.push({
					day: i,
					totalAmount: ethers.utils.formatEther(stakeRewardInfo._totalAmount),
					penaltyAmount: ethers.utils.formatEther(stakeRewardInfo._penaltyAmount),
					remainingAmount: ethers.utils.formatEther(stakeRewardInfo._totalAmount.sub(stakeRewardInfo._penaltyAmount))
				})
			}
			console.table(results)

		})
	})

	describe("\n\n#########################################\n withdraw function\n#########################################", () => {
		it("reverts withdrawing before release date", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			const stakingData = await staking.connect(owner).stakes(staker.address, 0)
			console.log("Staking date: ", new Date(stakingData.stakeDate.toNumber() * 1000).toISOString())
			console.info("Simulate 15 days...")
			await simulateTimeInSeconds(15 * 24 * 60 * 60)
			console.log("Current date: ", new Date((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp * 1000).toISOString())
			const tx = staking.connect(staker).withdrawStake(0)
			await expect(tx).to.be.revertedWith("Early request")
		})
		it("accepts withdrawing if everything is ok", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			let userStartBalance = await souls.connect(owner).balanceOf(staker.address)
			console.log("User balance before stake: ", ethers.utils.formatEther(userStartBalance))
			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			let userBalance = await souls.connect(owner).balanceOf(staker.address)
			console.log("User balance after stake: ", ethers.utils.formatEther(userBalance))

			console.info("Simulate 30 days...")
			await simulateTimeInSeconds(30 * 24 * 60 * 60)
			const stakingData = await staking.connect(owner).stakes(staker.address, 0)
			const dateDiffInSeconds = await (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp - stakingData.stakeDate.toNumber()
			const yearInSeconds = 365 * 24 * 60 * 60
			const calculatedReward = stakingData.amount.mul(stakingData.percentage).mul(dateDiffInSeconds).div(BigNumber.from(ethers.utils.parseEther("100").mul(yearInSeconds)))
			await staking.connect(staker).withdrawStake(0)
			userBalance = await souls.connect(owner).balanceOf(staker.address)
			console.log("User balance after withdraw: ", ethers.utils.formatEther(userBalance))
			expect(userBalance).to.be.equal(userStartBalance.add(calculatedReward))

		})

		it("reverts withdrawing if the stake has already withdrawn", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);

			await simulateTimeInSeconds(30 * 24 * 60 * 60)

			await staking.connect(staker).withdrawStake(0)
			const tx = staking.connect(staker).withdrawStake(0)
			await expect(tx).to.be.revertedWith("Stake already withdrawn")
		})


	})
	describe("\n\n#########################################\n emergencyWithdraw function\n#########################################", () => {
		it("reverts emergency withdrawing after release date", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			const stakingData = await staking.connect(owner).stakes(staker.address, 0)
			console.log("Staking date: ", new Date(stakingData.stakeDate.toNumber() * 1000).toISOString())
			console.info("Simulate 30 days...")
			await simulateTimeInSeconds(30 * 24 * 60 * 60)
			console.log("Current date: ", new Date((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp * 1000).toISOString())
			const tx = staking.connect(staker).emergencyWithdrawStake(0)
			await expect(tx).to.be.revertedWith("Can withdraw normal")
		})

		it("accepts emergency withdrawing if everything is ok", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			let userStartBalance = await souls.connect(owner).balanceOf(staker.address)
			console.log("User balance before stake: ", ethers.utils.formatEther(userStartBalance))
			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);
			let userBalanceAfterStake = await souls.connect(owner).balanceOf(staker.address)
			console.log("User balance after stake: ", ethers.utils.formatEther(userBalanceAfterStake))

			console.info("Simulate 15 days...")
			await simulateTimeInSeconds(15 * 24 * 60 * 60)

			await staking.connect(staker).emergencyWithdrawStake(0)

			const stakingData = await staking.connect(owner).stakes(staker.address, 0)
			const dateDiffInSeconds = stakingData.withdrawTime.toNumber() - stakingData.stakeDate.toNumber()
			const yearInSeconds = 365 * 24 * 60 * 60
			const totalAmount = stakingData.amount.add(stakingData.amount.mul(stakingData.percentage).mul(dateDiffInSeconds).div(BigNumber.from(ethers.utils.parseEther("100").mul(yearInSeconds))))

			const actualPenaltyRate = stakingData.percentage.sub(stakingData.percentage.mul(dateDiffInSeconds).div((await staking.monthToSecond()).toNumber() * stakingData.monthToStake))

			console.log("total amaount", ethers.utils.formatEther(totalAmount))
			console.log("actualPenaltyRate", ethers.utils.formatEther(actualPenaltyRate))

			const penaltyAmount = totalAmount.mul(BigNumber.from(actualPenaltyRate.toString())).div(ethers.utils.parseEther("100"))
			console.log("penaltyAmount", ethers.utils.formatEther(penaltyAmount))

			let userBalance = await souls.connect(owner).balanceOf(staker.address)
			console.log("User balance after emergency withdraw: ", ethers.utils.formatEther(userBalance))
			expect(userBalance).to.be.equal(userBalanceAfterStake.add(totalAmount.sub(penaltyAmount)))
		})

		it("burns tokens with amount of penalty on emergency withdrawing", async () => {
			await proxy.connect(owner).transferSoulsToAddress(staker.address, ethers.utils.parseEther("50000"));
			await souls.connect(staker).approve(staking.address, ethers.constants.MaxUint256);

			let totalSupply = await souls.connect(owner).totalSupply()
			console.log("total supply before stake: ", ethers.utils.formatEther(totalSupply))
			await staking.connect(staker).stake(ethers.utils.parseEther("10000"), 1);

			console.info("Simulate 15 days...")
			await simulateTimeInSeconds(15 * 24 * 60 * 60)

			await staking.connect(staker).emergencyWithdrawStake(0)

			const stakingData = await staking.connect(owner).stakes(staker.address, 0)
			const dateDiffInSeconds = stakingData.withdrawTime.toNumber() - stakingData.stakeDate.toNumber()
			const yearInSeconds = 365 * 24 * 60 * 60
			const totalAmount = stakingData.amount.add(stakingData.amount.mul(stakingData.percentage).mul(dateDiffInSeconds).div(BigNumber.from(ethers.utils.parseEther("100").mul(yearInSeconds))))

			const actualPenaltyRate = stakingData.percentage.sub(stakingData.percentage.mul(dateDiffInSeconds).div((await staking.monthToSecond()).toNumber() * stakingData.monthToStake))


			const penaltyAmount = totalAmount.mul(BigNumber.from(actualPenaltyRate.toString())).div(ethers.utils.parseEther("100"))
			let totalSupplyAfterWithdraw = await souls.connect(owner).totalSupply()

			console.log("Total supply after emergency withdraw: ", ethers.utils.formatEther(totalSupplyAfterWithdraw))
			expect(totalSupplyAfterWithdraw).to.be.equal(totalSupply.sub(penaltyAmount))
		})

	});
});
