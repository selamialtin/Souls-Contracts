import { ethers, waffle } from 'hardhat';
import chai from 'chai';

import BotPreventionArtifact from '../artifacts/contracts/BotPrevention.sol/BotPrevention.json';
import ProxyArtifact from '../artifacts/contracts/Proxy.sol/Proxy.json';
import ManagersArtifact from '../artifacts/contracts/Managers.sol/Managers.json';
import SoulsArtifact from '../artifacts/contracts/SoulsToken.sol/SoulsToken.json';
import LiquidityVaultArtifact from '../artifacts/contracts/LiquidityVault.sol/LiquidityVault.json';
import BUSDTokenArtifact from '../artifacts/contracts/BUSDToken.sol/BUSDToken.json';
import IPancakePairArtifact from '../artifacts/contracts/interfaces/IPancakePair.sol/IPancakePair.json';


import { BotPrevention } from '../typechain-types/contracts/BotPrevention';
import { Proxy } from '../typechain-types/contracts/Proxy';
import { Managers } from '../typechain-types/contracts/Managers';
import { SoulsToken } from '../typechain-types/contracts/SoulsToken';
import { LiquidityVault } from '../typechain-types/contracts/LiquidityVault';
import { IPancakePair } from '../typechain-types/contracts/interfaces/IPancakePair';



import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { BUSDToken } from '../typechain-types/contracts/BUSDToken';
import { IPancakeRouter02 } from '../typechain-types/contracts/interfaces/IPancakeRouter02';

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


const _dexRouterAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const _dexFactoryAddress = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

let _BUSDTokenAddress = ""

//9.375.000 market maker
//10 milyon gate.io
//13.625.000 milyon bybit

describe('LiquidityVault Contract', () => {
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
	let souls: SoulsToken;
	let busdToken: BUSDToken
	let liquidityVault: LiquidityVault;

	beforeEach(async () => {
		[owner, manager1, manager2, manager3, manager4, manager5, ...addrs] = await ethers.getSigners();
		busdToken = (await deployContract(owner, BUSDTokenArtifact, [])) as BUSDToken
		_BUSDTokenAddress = busdToken.address
		botPrevention = (await deployContract(owner, BotPreventionArtifact, [])) as BotPrevention;

		await botPrevention.deployed()
		proxy = (await deployContract(owner, ProxyArtifact, [manager1.address, manager2.address, manager3.address, manager4.address, manager5.address, botPrevention.address])) as Proxy;
		await proxy.deployed()


		managers = new ethers.Contract(await proxy.managers(), ManagersArtifact.abi) as Managers
		souls = new ethers.Contract(await proxy.soulsToken(), SoulsArtifact.abi, owner) as SoulsToken
		liquidityVault = (await deployContract(owner, LiquidityVaultArtifact, ["Liquidity Vault", proxy.address, souls.address, managers.address, _dexRouterAddress, _dexFactoryAddress, _BUSDTokenAddress])) as LiquidityVault;
		await liquidityVault.deployed()

		await botPrevention.connect(owner).setTokenAddress(souls.address)
		await botPrevention.setManagersAddress(managers.address)


		const tx = await busdToken.connect(owner).approve(proxy.address, ethers.constants.MaxUint256)
		await tx.wait()
		await proxy.connect(owner).initLiquidityVault(liquidityVault.address, busdToken.address);
		await botPrevention.setDexPairAddress(await liquidityVault.DEXPairAddress())
		console.log("")
	});
	describe('\n\n#########################################\n lockTokens function\n#########################################', () => {
		it("Cannot init more than one for each vault", async () => {
			const tx = proxy.connect(owner).initLiquidityVault(liquidityVault.address, busdToken.address);
			await expect(tx).to.be.revertedWith("Already Inited")
		})

		it("Contract token balance must increase with amount of locked tokens", async () => {
			const contractBalance = await souls.balanceOf(liquidityVault.address);
			await expect(contractBalance).to.be.equal((await proxy.liquidityShare()).sub(await liquidityVault.tokenAmountForInitialLiquidityOnDEX()));
		})

		it("Creates liquidity on DEX and transfers LP tokens to proxy contract", async () => {
			const dexPairAddress = await liquidityVault.DEXPairAddress();
			expect(dexPairAddress).to.not.be.equal(ethers.constants.AddressZero)
			const pairContract = new ethers.Contract(dexPairAddress, IPancakePairArtifact.abi) as IPancakePair
			const proxyLPbalance = await pairContract.connect(owner).balanceOf(proxy.address)
			expect(proxyLPbalance).to.be.gt(0)
			console.log("Pair contract address: ", dexPairAddress)
			console.log("LP token balance of proxy contract: ", ethers.utils.formatEther(proxyLPbalance))
		})

		it("Total of vestings must be equal to locked tokens", async () => {
			const contractBalance = await souls.balanceOf(liquidityVault.address);
			console.log(ethers.utils.parseEther(contractBalance.toString()))
			console.log(ethers.utils.parseEther((await proxy.liquidityShare()).sub(await liquidityVault.tokenAmountForInitialLiquidityOnDEX()).toString()))
			await expect(contractBalance).to.be.equal((await proxy.liquidityShare()).sub(await liquidityVault.tokenAmountForInitialLiquidityOnDEX()));
			const tokenVestings = await liquidityVault.getVestingData();
			const vestingData = []
			let totalAmount = BigNumber.from(0)
			for (let i = 0; i < tokenVestings.length; i++) {
				vestingData.push({
					amount: ethers.utils.formatEther(tokenVestings[i].amount),
					releaseDate: new Date(tokenVestings[i].unlockTime.toNumber() * 1000).toDateString()
				})
				totalAmount = totalAmount.add(tokenVestings[i].amount)
			}

			console.table(vestingData)
			console.log("Vault share: ", ethers.utils.formatEther(await proxy.liquidityShare()))
			console.log("Total amount of vestings: ", ethers.utils.formatEther(totalAmount));
			expect((await proxy.liquidityShare()).sub(await liquidityVault.tokenAmountForInitialLiquidityOnDEX())).to.be.equal(totalAmount)
		})



		it("Managers can transfer LP tokens from proxy contract when reach unlock time", async () => {
			const tx = proxy.connect(manager1).withdrawLPTokens(addrs[0].address)
			await expect(tx).to.be.revertedWith("LP tokens are locked still")
			await gotoTime(await (await proxy.liquidityTokensUnlockTime()).toNumber())
			await proxy.connect(manager1).withdrawLPTokens(addrs[0].address)
			await proxy.connect(manager2).withdrawLPTokens(addrs[0].address)
			await proxy.connect(manager3).withdrawLPTokens(addrs[0].address)
			const dexPairAddress = await liquidityVault.DEXPairAddress();
			const pairContract = new ethers.Contract(dexPairAddress, IPancakePairArtifact.abi) as IPancakePair
			const balanceOfReceiver = await pairContract.connect(owner).balanceOf(addrs[0].address)
			console.log("Withdrawn LP tokens amount: ", ethers.utils.formatEther(balanceOfReceiver))
			expect(balanceOfReceiver).to.be.gt(0)
		})


	})
	describe('\n\n#########################################\n withdrawTokens function\n#########################################', () => {
		it("Managers can't use withdrawTokens function for liquidity vault", async () => {
			const vestings = await liquidityVault.getVestingData()
			await gotoTime(await (await liquidityVault.remainingTokensUnlockTime()).toNumber())
			const amountOfFirstVesting = vestings[0].amount;
			const tx = liquidityVault.connect(manager1).withdrawTokens([addrs[0].address], [amountOfFirstVesting])
			await expect(tx).to.be.revertedWith("Use withdrawRemainingTokens function for Liquidity Vault")
		})

		it("Managers can withdraw tokens from liquidity vault using withdrawRemainingTokens after unlock time", async () => {
			const vestings = await liquidityVault.getVestingData()
			const unlockTime = vestings[0].unlockTime
			await simulateTimeInSeconds(unlockTime.toNumber() - (await ethers.provider.getBlock("latest")).timestamp)
			const amountOfFirstVesting = (await liquidityVault.tokenVestings(0)).amount
			const tx = liquidityVault.connect(manager1).withdrawRemainingTokens([addrs[0].address], [amountOfFirstVesting])
			await expect(tx).to.be.revertedWith("Remaining tokens are still locked")
			await gotoTime(await (await liquidityVault.remainingTokensUnlockTime()).toNumber())
			await liquidityVault.connect(manager1).withdrawRemainingTokens([addrs[0].address], [amountOfFirstVesting])


		})
	})

	describe('\n\n#########################################\n addLiquidityOnDEX function\n#########################################', () => {
		it("Managers can add extra liquidity on DEX", async () => {

			console.log("Enabling trading before adding new liquidity (required action)")
			const startTime = (await ethers.provider.getBlock("latest")).timestamp
			await botPrevention.connect(manager1).enableTrading(startTime, 24 * 60 * 60)
			await botPrevention.connect(manager2).enableTrading(startTime, 24 * 60 * 60)
			await botPrevention.connect(manager3).enableTrading(startTime, 24 * 60 * 60)

			const soulsAmountToAdd = ethers.utils.parseEther("10000")
			const requiredBUSDAmount = await liquidityVault.getRequiredBUSDAmountForLiquidity(soulsAmountToAdd)
			const dexPairAddress = await liquidityVault.DEXPairAddress();
			const pairContract = new ethers.Contract(dexPairAddress, IPancakePairArtifact.abi) as IPancakePair
			const proxyLPbalance = await pairContract.connect(owner).balanceOf(proxy.address)
			console.log("LP token balance of proxy contract: ", ethers.utils.formatEther(proxyLPbalance))




			console.log("Transferring required amount of BUSD tokens to proxy contract (required action)")
			await busdToken.connect(owner).transfer(proxy.address, requiredBUSDAmount)
			await liquidityVault.connect(manager1).addLiquidityOnDEX(soulsAmountToAdd)
			await liquidityVault.connect(manager2).addLiquidityOnDEX(soulsAmountToAdd)
			await liquidityVault.connect(manager3).addLiquidityOnDEX(soulsAmountToAdd)

			const newProxyLPbalance = await pairContract.connect(owner).balanceOf(proxy.address)
			console.log("New LP token balance of proxy contract after adding liquidity: ", ethers.utils.formatEther(newProxyLPbalance))

			expect(newProxyLPbalance).to.be.gt(proxyLPbalance)

		})

	})

	describe('\n\n#########################################\n withdrawMarketMakerShare function\n#########################################', () => {
		it("Can be withdrwan by managers before deadline", async () => {
			await liquidityVault.connect(manager1).withdrawMarketMakerShare(addrs[0].address, await liquidityVault.connect(owner).marketMakerShare())
			await liquidityVault.connect(manager2).withdrawMarketMakerShare(addrs[0].address, await liquidityVault.connect(owner).marketMakerShare())
			await liquidityVault.connect(manager3).withdrawMarketMakerShare(addrs[0].address, await liquidityVault.connect(owner).marketMakerShare())
			expect(await souls.connect(owner).balanceOf(addrs[0].address)).to.be.equal(await liquidityVault.connect(owner).marketMakerShare())
		})
		it("Cannot withdraw after deadline", async () => {
			console.log("Simulating time to go deadline")
			await gotoTime(await (await liquidityVault.connect(owner).marketMakerShareWithdrawDeadline()).toNumber())
			const tx = liquidityVault.connect(manager1).withdrawMarketMakerShare(proxy.address, await liquidityVault.marketMakerShare())
			await expect(tx).to.be.revertedWith("Late request")
		})
	})
});
