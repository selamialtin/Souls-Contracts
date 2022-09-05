import { ethers, waffle } from 'hardhat';
import chai from 'chai';

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



import { BotPrevention } from '../typechain-types/contracts/BotPrevention';
import { Proxy } from '../typechain-types/contracts/Proxy';
import { Managers } from '../typechain-types/contracts/Managers';
import { SoulsToken } from '../typechain-types/contracts/SoulsToken';
import { Staking } from '../typechain-types/contracts/Staking';
import { Vault } from '../typechain-types/contracts/Vault';
import { LiquidityVault } from '../typechain-types/contracts/LiquidityVault';
import { CrowdFunding } from '../typechain-types/contracts/CrowdFunding';
import { BUSDToken } from '../typechain-types/contracts/BUSDToken'



import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
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


const _dexFactoryAddress = "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc";
const _dexRouterAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
let _BUSDTokenAddress = ""



describe('Souls Token Contract and Bot Protection', () => {
	return
	let busdToken: BUSDToken
	let owner: SignerWithAddress;
	let manager1: SignerWithAddress;
	let manager2: SignerWithAddress;
	let manager3: SignerWithAddress;
	let manager4: SignerWithAddress;
	let manager5: SignerWithAddress;
	let addrs: SignerWithAddress[];

	let liquidityVault: LiquidityVault

	let botPrevention: BotPrevention
	let managers: Managers
	let proxy: Proxy;
	let soulsToken: SoulsToken;
	let router: IPancakeRouter02 = new ethers.Contract(_dexRouterAddress, IPancakeRouterArtifact.abi) as IPancakeRouter02


	beforeEach(async () => {
		[owner, manager1, manager2, manager3, manager4, manager5, ...addrs] = await ethers.getSigners();
	});


	describe('\n\n#########################################\n deploy contracts \n#########################################', () => {
		it("Creates DEX liquidity on launch", async () => {
			busdToken = await deployContract(owner, BUSDTokenArtifact) as BUSDToken
			_BUSDTokenAddress = busdToken.address

			console.log("Deploy Bot Prevention Contract")
			botPrevention = (await deployContract(owner, BotPreventionArtifact, [])) as BotPrevention;
			
			console.log("Deploy Proxy Contract")
			proxy = (await deployContract(owner, ProxyArtifact, [manager1.address, manager2.address, manager3.address, manager4.address, manager5.address, botPrevention.address])) as Proxy;
			soulsToken = new ethers.Contract(await proxy.soulsToken(), SoulsArtifact.abi) as SoulsToken
			managers = new ethers.Contract(await proxy.managers(), ManagersArtifact.abi) as Managers
			await botPrevention.connect(owner).setTokenAddress(soulsToken.address)
			await botPrevention.setManagersAddress(managers.address)
			console.log("Deploy Liquidity Vault Contract to create DEX liquidity")

			liquidityVault = (await deployContract(owner, LiquidityVaultArtifact, ["Liquidity Vault", proxy.address, soulsToken.address, managers.address, _dexFactoryAddress, _dexRouterAddress, _BUSDTokenAddress])) as LiquidityVault;

			console.log("Init liquidity vault")
			await busdToken.connect(owner).approve(proxy.address, ethers.constants.MaxUint256);
			await proxy.initLiquidityVault(liquidityVault.address, _BUSDTokenAddress)
			await botPrevention.setDexPairAddress(await liquidityVault.DEXPairAddress())
			console.log("DEX pair address: ", await botPrevention.connect(owner).dexPairAddress())
		});
	});

	describe('\n\n#########################################\n enable/disable trading \n#########################################', () => {
		it("Swapping tokens is not available when trading is disabled", async () => {
			console.log("Approve BUSD and SOULS for trading")
			busdToken.connect(owner).approve(_dexRouterAddress, ethers.constants.MaxUint256)
			soulsToken.connect(owner).approve(_dexRouterAddress, ethers.constants.MaxUint256)


			console.log("Trading status on souls token contract: ", await botPrevention.connect(owner).tradingEnabled())

			const tx = router.connect(owner).swapExactTokensForTokens(
				ethers.utils.parseEther("10"),
				0,
				[_BUSDTokenAddress, soulsToken.address],
				addrs[0].address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			await expect(tx).to.be.revertedWith("Pancake: TRANSFER_FAILED")
		});

		it("Managers can enable trading by voting", async () => {
			console.log("Trading status on souls token contract: ", await botPrevention.connect(owner).tradingEnabled())
			const blockTime = await (await ethers.provider.getBlock("latest")).timestamp
			console.log("Managers approves for enabling trading...")
			await botPrevention.connect(manager1).enableTrading(blockTime + 10, 24 * 60 * 60)
			await botPrevention.connect(manager2).enableTrading(blockTime + 10, 24 * 60 * 60)
			await botPrevention.connect(manager3).enableTrading(blockTime + 10, 24 * 60 * 60)
			console.log("Trading status on souls token contract: ", await botPrevention.connect(owner).tradingEnabled())
			expect(await botPrevention.connect(owner).tradingEnabled()).to.be.equal(true)
		});

		it("Swapping tokens is not available when trading is enabled but before trading start time", async () => {
			console.log("Trading status on souls token contract: ", await botPrevention.connect(owner).tradingEnabled())

			const tx = router.connect(owner).swapExactTokensForTokens(
				ethers.utils.parseEther("10"),
				0,
				[_BUSDTokenAddress, soulsToken.address],
				addrs[0].address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			await expect(tx).to.be.revertedWith("Pancake: TRANSFER_FAILED")
		});

		it("Swapping tokens is available when trading is enabled and reach trading start time", async () => {
			await gotoTime((await botPrevention.connect(owner).tradingStartTimeOnDEX()).toNumber())
			console.log("BUSD balance before trade: ", ethers.utils.formatEther(await busdToken.connect(owner).balanceOf(owner.address)))
			const soulsBalance = await soulsToken.connect(owner).balanceOf(owner.address)
			console.log("SOULS balance before trade: ", ethers.utils.formatEther(soulsBalance))

			console.log("Swapping 10 BUSD to SOULS tokens")
			await router.connect(owner).swapExactTokensForTokens(
				ethers.utils.parseEther("10"),
				0,
				[_BUSDTokenAddress, soulsToken.address],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			const newSoulsBalance = await soulsToken.connect(owner).balanceOf(owner.address)
			console.log("SOULS balance before trade: ", ethers.utils.formatEther(newSoulsBalance))
			expect(newSoulsBalance).to.be.gt(soulsBalance)
			expect(await (await ethers.provider.getBlock("latest")).timestamp).lt(await (await botPrevention.connect(owner).tradingStartTimeOnDEX()).add(await botPrevention.connect(owner).botPreventionDuration()))
		});

		it("Can sell back token before reacing balance limit of bot protection", async () => {
			console.log("BUSD balance before trade: ", ethers.utils.formatEther(await busdToken.connect(owner).balanceOf(owner.address)))
			const soulsBalance = await soulsToken.connect(owner).balanceOf(owner.address)
			console.log("SOULS balance before trade: ", ethers.utils.formatEther(soulsBalance))
			console.log("Swapping " + ethers.utils.formatEther(soulsBalance) + " SOULS tokens to BUSD")
			await router.connect(owner).swapExactTokensForTokens(
				soulsBalance,
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			const newSoulsBalance = await soulsToken.connect(owner).balanceOf(owner.address)
			console.log("SOULS balance before trade: ", ethers.utils.formatEther(newSoulsBalance))
			expect(newSoulsBalance).to.be.equal(0)
			expect(await (await ethers.provider.getBlock("latest")).timestamp).lt(await (await botPrevention.connect(owner).tradingStartTimeOnDEX()).add(await botPrevention.connect(owner).botPreventionDuration()))

		});

		it("Activates bot protection for wallet when balance exeeds the limit", async () => {
			const botProtectionParams = await botPrevention.connect(owner).botProtectionParams()
			console.log("Balance limit for activationg bot protection: ", ethers.utils.formatEther(botProtectionParams.activateIfBalanceExeeds))
			console.log("Buying " + ethers.utils.formatEther(botProtectionParams.activateIfBalanceExeeds) + " SOULS")
			await router.connect(owner).swapTokensForExactTokens(
				botProtectionParams.activateIfBalanceExeeds,
				ethers.utils.parseEther("10000"),
				[_BUSDTokenAddress, soulsToken.address],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			let newSoulsBalance = await soulsToken.connect(owner).balanceOf(owner.address)
			console.log("SOULS balance before transfer: ", ethers.utils.formatEther(newSoulsBalance))

			await soulsToken.connect(owner).transfer(addrs[0].address, ethers.utils.parseEther("5000"))
			newSoulsBalance = await soulsToken.connect(owner).balanceOf(owner.address)
			console.log("SOULS balance before trade: ", ethers.utils.formatEther(newSoulsBalance))

			let walletCanSellAfter = await botPrevention.connect(owner).walletCanSellAfter(owner.address)
			expect(walletCanSellAfter).to.be.equal(0)
			console.log("Bot protection is still passive for wallet")
			console.log("Buying extra SOULS tokens to activate bot protection")
			await router.connect(owner).swapTokensForExactTokens(
				1,
				ethers.utils.parseEther("10000"),
				[_BUSDTokenAddress, soulsToken.address],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			walletCanSellAfter = await botPrevention.connect(owner).walletCanSellAfter(owner.address)
			expect(walletCanSellAfter).to.be.gt(0)
			console.log("Bot protection is activated for wallet")
		});

		it("Cannot sell more than allowed amount when bot protection is activated", async () => {
			const botProtectionParams = await botPrevention.connect(owner).botProtectionParams()
			let walletCanSellAfter = await botPrevention.connect(owner).walletCanSellAfter(owner.address)
			console.log("Simultating time to go unlock time")
			await gotoTime(walletCanSellAfter.toNumber())

			console.log("Sell limit is " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")
			console.log("Trying to sell " + ethers.utils.formatEther(botProtectionParams.maxSellAmount.add(ethers.utils.parseEther("1"))) + " SOULS in one trade")
			let tx = router.connect(owner).swapExactTokensForTokens(
				botProtectionParams.maxSellAmount.add(ethers.utils.parseEther("1")),
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			await expect(tx).to.be.revertedWith("TransferHelper::transferFrom: transferFrom failed")
		});

		it("Must wait until unlock time after every sell", async () => {
			const botProtectionParams = await botPrevention.connect(owner).botProtectionParams()
			console.log("Sell limit is " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")
			console.log("Selling " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")

			await router.connect(owner).swapExactTokensForTokens(
				botProtectionParams.maxSellAmount,
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			console.log("Trying to sell another " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")

			let tx = router.connect(owner).swapExactTokensForTokens(
				botProtectionParams.maxSellAmount,
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			await expect(tx).to.be.revertedWith("TransferHelper::transferFrom: transferFrom failed")
			let walletCanSellAfter = await botPrevention.connect(owner).walletCanSellAfter(owner.address)
			console.log("Simultating time to go unlock time")
			await gotoTime(walletCanSellAfter.toNumber())

			console.log("Trying again to sell another " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")
			await router.connect(owner).swapExactTokensForTokens(
				botProtectionParams.maxSellAmount,
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			console.log("Successfuly sold tokens")
			console.log("Trying to sell another " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")
			tx = router.connect(owner).swapExactTokensForTokens(
				botProtectionParams.maxSellAmount,
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			await expect(tx).to.be.revertedWith("TransferHelper::transferFrom: transferFrom failed")
			walletCanSellAfter = await botPrevention.connect(owner).walletCanSellAfter(owner.address)
			console.log("Simultating time to go unlock time")
			await gotoTime(walletCanSellAfter.toNumber())

			console.log("Trying again to sell another " + ethers.utils.formatEther(botProtectionParams.maxSellAmount) + " SOULS in one trade")
			await router.connect(owner).swapExactTokensForTokens(
				botProtectionParams.maxSellAmount,
				0,
				[soulsToken.address, _BUSDTokenAddress],
				owner.address,
				(await (await ethers.provider.getBlock("latest")).timestamp) + 10000
			)
			console.log("Successfuly sold tokens")
		});

		it("Managers can disable trading by voting", async () => {
			console.log("Trading status on souls token contract: ", await botPrevention.connect(owner).tradingEnabled())
			console.log("Managers approves for enabling trading...")
			await botPrevention.connect(manager1).disableTrading()
			await botPrevention.connect(manager2).disableTrading()
			await botPrevention.connect(manager3).disableTrading()
			console.log("Trading status on souls token contract: ", await botPrevention.connect(owner).tradingEnabled())
			expect(await botPrevention.connect(owner).tradingEnabled()).to.be.equal(false)
		});


	});
});
