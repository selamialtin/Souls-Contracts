import { copyFolderRecursiveSync } from './utils/index';
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import ManagersArtifact from '../artifacts/contracts/Managers.sol/Managers.json';
import SoulsArtifact from '../artifacts/contracts/SoulsToken.sol/SoulsToken.json';

import {
	BotPrevention as BotPreventionType,
	Proxy as ProxyType,
	Managers as ManagersType,
	SoulsToken as SoulsTokenType,
	Staking as StakingType,
	Vault as VaultType,
	LiquidityVault as LiquidityVaultType,
	BUSDToken as BUSDTokenType,
	PlayToEarnVault as PlayToEarnVaultType,
	Airdrop as AirdropType,
	AirdropVault as AirdropVaultType
} from '../typechain-types/contracts';



import { WBNB as WBNBType } from '../typechain-types/contracts/pancakeswap/WBNB'
import { PancakeRouter01 as PancakeRouter01Type } from '../typechain-types/contracts/pancakeswap/PancakeRouter01.sol/PancakeRouter01'
import { PancakeRouter as PancakeRouterType } from '../typechain-types/contracts/pancakeswap/PancakeRouter.sol/PancakeRouter'
import { PancakeFactory as PancakeFactoryType } from '../typechain-types/contracts/pancakeswap/PancakeFactory.sol/PancakeFactory'

import hre from "hardhat"

async function main() {

	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy

	//TODO: correct the addresses
	const manager1 = "0xeF23bEBBDb9D211494E1F8d7ee8D511d05D28765"
	const manager2 = "0x46f2E5F4a603a44ffd54B187c12d36C4E9D73c16"
	const manager3 = "0x7bf9A780DE60bF3F91Fc8Dd95B3dF21b94C16a30"
	const manager4 = "0xEf4b9084CC90412b1f4f528f88784eC2b60FF2Cf"
	const manager5 = "0x4634302fCE259c5E89C4eCbBEEE4eDe7bE4622b4"
	const playToEarnServiceAddress = "0x8c64D31849Ecd26F8e6b3208FCC07ee423676e37"

	let _dexFactoryAddress = ""
	let _dexRouterAddress = ""
	let _BUSDTokenAddress = ""

	// console.log("Deploy pancakeswap")
	// const WBNB = await ethers.getContractFactory("WBNB")
	// const wBNB = await WBNB.deploy() as WBNBType
	// await wBNB.deployed()

	// const PancakeFactory = await ethers.getContractFactory("PancakeFactory")
	// const pancakeFactory = await PancakeFactory.deploy("0x17eBDf56050B89797Dedecccb2C4Cd0684CBbb26") as PancakeFactoryType
	// await pancakeFactory.deployed()

	// console.log(await pancakeFactory.INIT_CODE_PAIR_HASH())
	// const PancakeRouter01 = await ethers.getContractFactory("PancakeRouter01")
	// const pancakeRouter01 = await PancakeRouter01.deploy(pancakeFactory.address, wBNB.address, { gasLimit: 900000000 }) as PancakeRouter01Type
	// await pancakeRouter01.deployed()
	// console.log("router deployed")
	// const PancakeRouter = await ethers.getContractFactory("PancakeRouter")
	// const pancakeRouter = await PancakeRouter.deploy(pancakeFactory.address, wBNB.address, { gasLimit: 9000000000 }) as PancakeRouterType
	// await pancakeRouter.deployed()
	// console.log("router deployed")






	console.log("Deploy BUSD Token")
	const BusdToken = await ethers.getContractFactory('BUSDToken');
	const busdToken = await BusdToken.deploy() as BUSDTokenType; //FIXME: implement with real BUSD
	await busdToken.deployed()
	console.log("BUSD token deployed to: ", busdToken.address);

	const signerAddress = await ethers.provider.getSigner().getAddress()
	const busdBalance = await busdToken.balanceOf(signerAddress)
	console.log(busdBalance)
	if (busdBalance.lt(ethers.utils.parseEther("27000"))) {
		throw ("Signer must have more than or equal to 27000 BUSD in the account")
	}

	console.log("signer address", signerAddress)
	switch (hre.network.name) {
		case 'localhost':
			// _dexRouterAddress = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
			_dexRouterAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
			_dexFactoryAddress = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
			_BUSDTokenAddress = busdToken.address
			break
		case 'rinkeby':
			_dexRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //uniswap
			_BUSDTokenAddress = busdToken.address
			break;
		case 'bsctestnet':
			_dexRouterAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"; //pancakeswap
			_BUSDTokenAddress = busdToken.address
			break;
		case 'bsc':
			_dexRouterAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
			_dexFactoryAddress = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
			_BUSDTokenAddress = busdToken.address;
			break;
	}
	// _dexRouterAddress = pancakeRouter.address
	// _dexFactoryAddress = pancakeFactory.address

	const _GameLaunchTime = new Date("2022-12-12").getTime() / 1000 //TODO: SET CORRECT VAULE FOR GAME LAUNCH TIME

	//TODO: Chage rates;
	const stakingAPYFor1Month = 5
	const stakingAPYFor3Month = 10
	const stakingAPYFor6Month = 15
	const stakingAPYFor12Month = 20



	const BotPrevention = await ethers.getContractFactory('BotPrevention');
	const Proxy = await ethers.getContractFactory('Proxy');
	const Staking = await ethers.getContractFactory('Staking');
	const CrowdFunding = await ethers.getContractFactory('CrowdFunding');
	const Vault = await ethers.getContractFactory('Vault');
	const LiquidityVault = await ethers.getContractFactory('LiquidityVault');
	const AirdropVault = await ethers.getContractFactory('AirdropVault');
	const PlayToEarnVault = await ethers.getContractFactory('PlayToEarnVault');
	const Airdrop = await ethers.getContractFactory('Airdrop');

	console.log("Deploy Bot Prevention contract")
	const botPrevention = await BotPrevention.deploy() as BotPreventionType;
	await botPrevention.deployed()


	console.log("Bot prevention deployed to: ", botPrevention.address)

	console.log("Deploy Proxy contract")
	const proxy = await Proxy.deploy(manager1, manager2, manager3, manager4, manager5, botPrevention.address) as ProxyType;
	await proxy.deployed();
	console.log("Proxy contract deployed to", proxy.address)

	const soulsTokenAddress = await proxy.soulsToken();
	const managersAddress = await proxy.managers();
	console.log("Souls token deployed by proxy to:", soulsTokenAddress)
	console.log("Managers deployed by proxy to:", managersAddress)
	const soulsToken = new ethers.Contract(soulsTokenAddress, SoulsArtifact.abi, ethers.provider.getSigner()) as SoulsTokenType;
	const managers = new ethers.Contract(managersAddress, ManagersArtifact.abi) as ManagersType;


	console.log("Set required params on Bot Prevention contract")
	await botPrevention.setTokenAddress(soulsToken.address)
	await botPrevention.setManagersAddress(managers.address)


	console.log("Deploy Crowdfunding Contracts") //TODO: do it later
	// privateSaleFunding = (await deployContract(owner, CrowdFundingArtifact, ["Private Sale", soulsToken.address, managers.address])) as CrowdFunding;
	// seedSaleFunding = (await deployContract(owner, CrowdFundingArtifact, ["Seed Sale", soulsToken.address, managers.address])) as CrowdFunding;
	// strategicSaleFunding = (await deployContract(owner, CrowdFundingArtifact, ["Strategic Sale", soulsToken.address, managers.address])) as CrowdFunding;
	// publicSaleFunding = (await deployContract(owner, CrowdFundingArtifact, ["Public Sale", soulsToken.address, managers.address])) as CrowdFunding;
	// airdropFunding = (await deployContract(owner, CrowdFundingArtifact, ["Airdrop", soulsToken.address, managers.address])) as CrowdFunding;


	console.log("Deploy Staking Contract")
	const staking = await Staking.deploy(soulsToken.address, managers.address, ethers.utils.parseEther(stakingAPYFor1Month.toString()), ethers.utils.parseEther(stakingAPYFor3Month.toString()), ethers.utils.parseEther(stakingAPYFor6Month.toString()), ethers.utils.parseEther(stakingAPYFor12Month.toString())) as StakingType;
	await staking.deployed();
	console.log("Staking deployed to:", staking.address);

	console.log("Deploy Airdrop Contract")
	const airdropContract = await Airdrop.deploy(managers.address, soulsToken.address) as AirdropType;
	console.log("Airdrop contract deployed to:", airdropContract.address);

	console.log("Deploy Vault Contracts")
	const marketingVault = await Vault.deploy("Marketing Vault", proxy.address, soulsToken.address, managers.address) as VaultType
	const teamVault = await Vault.deploy("Team Vault", proxy.address, soulsToken.address, managers.address) as VaultType
	const advisorVault = await Vault.deploy("Advisor Vault", proxy.address, soulsToken.address, managers.address) as VaultType
	const treasuryVault = await Vault.deploy("Treasury Vault", proxy.address, soulsToken.address, managers.address) as VaultType
	const exchangesVault = await Vault.deploy("Exchanges Vault", proxy.address, soulsToken.address, managers.address) as VaultType
	const playToEarnVault = await PlayToEarnVault.deploy("PlayToEarn Vault", proxy.address, soulsToken.address, managers.address, playToEarnServiceAddress) as PlayToEarnVaultType
	const airdropVault = await AirdropVault.deploy("Airdrop Vault", proxy.address, soulsToken.address, managers.address) as AirdropVaultType
	const liquidityVault = await LiquidityVault.deploy("Liquidity Vault", proxy.address, soulsToken.address, managers.address, _dexRouterAddress, _dexFactoryAddress, _BUSDTokenAddress) as LiquidityVaultType


	await marketingVault.deployed();
	console.log("Marketing Vault deployed to:", marketingVault.address);
	await teamVault.deployed();
	console.log("Team Vault deployed to:", teamVault.address);
	await advisorVault.deployed();
	console.log("Advisor Vault deployed to:", advisorVault.address);
	await treasuryVault.deployed();
	console.log("Treasury Vault deployed to:", treasuryVault.address);
	await exchangesVault.deployed();
	console.log("Exchanges Vault deployed to:", exchangesVault.address);
	await playToEarnVault.deployed();
	console.log("PlayToEarn Vault deployed to:", playToEarnVault.address);
	await airdropVault.deployed();
	console.log("Airdrop Vault deployed to:", airdropVault.address);
	await liquidityVault.deployed();
	console.log("Liquidity Vault deployed to:", liquidityVault.address);

	console.log("Vaults are getting initialized by proxy contract")

	console.log("Init staking contract")
	await (await proxy.initStakingContract(staking.address)).wait()


	enum VaultEnumerator {
		MARKETING,
		ADVISOR,
		AIRDROP,
		TEAM,
		EXCHANGES,
		TREASURY
	}
	console.log("Init marketing Vault")
	await (await proxy.initVault(marketingVault.address, VaultEnumerator.MARKETING)).wait()

	console.log("Init Advisor Vault")
	await (await proxy.initVault(advisorVault.address, VaultEnumerator.ADVISOR)).wait()

	console.log("Init Airdrop Vault")
	await (await proxy.initVault(airdropVault.address, VaultEnumerator.AIRDROP)).wait()

	console.log("Init Team Vault")
	await (await proxy.initVault(teamVault.address, VaultEnumerator.TEAM)).wait()

	console.log("Init Exchanges Vault")
	await (await proxy.initVault(exchangesVault.address, VaultEnumerator.EXCHANGES)).wait()

	console.log("Init Treasury Vault")
	await (await proxy.initVault(treasuryVault.address, VaultEnumerator.TREASURY)).wait()

	console.log("Init Airdrop Contract")
	//TODO: add to panel


	console.log("Init PlayToEarn Vault")
	//TODO: add to panel

	console.log("Giving allowance of BUSD tokens for proxy contract")
	console.log("BUSD token address:", _BUSDTokenAddress);
	console.log("BUSD token balance:", await busdToken.balanceOf(signerAddress));
	console.log("Required BUSD amount", await liquidityVault.BUSDAmountForInitialLiquidity())
	const tx = await busdToken.approve(proxy.address, ethers.constants.MaxUint256);
	await tx.wait()
	console.log("Allowance for proxy contract: ", await busdToken.allowance(signerAddress, proxy.address))
	console.log("Init liquidity vault")
	const gasEstimation = await proxy.estimateGas.initLiquidityVault(liquidityVault.address, busdToken.address)
	console.log("Estimated gas: ", gasEstimation.toString())

	await proxy.initLiquidityVault(liquidityVault.address, _BUSDTokenAddress, { gasLimit: 900000000 })
	await botPrevention.setDexPairAddress(await liquidityVault.DEXPairAddress())

	//total gas required : 41.200.961

	const dexPairAddress = await liquidityVault.DEXPairAddress();
	console.log("DEX pair address:", dexPairAddress)

	copyFolderRecursiveSync("./artifacts","/Users/yusufguler/Desktop/development/Unfettered/admin-dashboard/contractInterfaces")
	copyFolderRecursiveSync("./typechain-types","/Users/yusufguler/Desktop/development/Unfettered/admin-dashboard/contractInterfaces")
	
	
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
