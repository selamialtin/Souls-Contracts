// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import ManagersArtifact from '../artifacts/contracts/Managers.sol/Managers.json';
import SoulsArtifact from '../artifacts/contracts/SoulsToken.sol/SoulsToken.json';


import { Proxy as ProxyType } from '../typechain/Proxy';
import { Managers as ManagersType } from '../typechain/Managers';
import { SoulsToken as SoulsTokenType } from '../typechain/SoulsToken';
import { Staking as StakingType } from '../typechain/Staking';
import { Vault as VaultType } from '../typechain/Vault';
import { LiquidityVault as LiquidityVaultType } from '../typechain/LiquidityVault';
import { BUSDToken as BUSDTokenType } from '../typechain/BUSDToken'

import hre from "hardhat"
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function main() {

	let owner: SignerWithAddress;
	let manager1: SignerWithAddress;
	let manager2: SignerWithAddress;
	let manager3: SignerWithAddress;
	let manager4: SignerWithAddress;
	let manager5: SignerWithAddress;
	let addrs:SignerWithAddress[];
	[owner, manager1, manager2, manager3, manager4, manager5, ...addrs] = await ethers.getSigners();

	const soulsTokenAddress = "0x20571c111655c8895ceee54ceaa44be344b2c728"
	const soulsToken = new ethers.Contract(soulsTokenAddress,SoulsArtifact.abi) as SoulsTokenType

	

	// soulsToken.connect(manager1).enableTrading()

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
