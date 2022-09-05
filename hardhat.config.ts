require('dotenv').config();

import { task, HardhatUserConfig } from 'hardhat/config';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-solhint';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
	mocha: {
		timeout: 100000000
	},
	solidity: {
		compilers: [
			{
				version: "0.5.0",
			},
			{
				version: "0.5.16",
			},
			{
				version: "0.8.3",
			},
			{
				version: "0.6.6",
			},
			{
				version: "0.8.12",
				settings: {},
			},
		],
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
	networks: {
		hardhat: {
			//   mining: {
			//     auto: true,
			//     interval: 1000,
			//   },
			gasPrice: 0,
			initialBaseFeePerGas: 0,
			blockGasLimit: 9000000000,
			gasMultiplier:2,
			mining: {
				auto: true,
				interval: 3000,
			},
			forking: {
				url: "https://prettiest-intensive-resonance.bsc.quiknode.pro/c536cc60cf3ae32eeb33842050c2ef0c1db2a858/",
			},
			accounts: {
				count: 10,
				mnemonic: process.env.MNEMONIC,
				path: "m/44'/60'/0'/0",
			},
			chainId: 1337,
			
		},
		// bscTestnet: {
		// 	url: chainsData.bscTestnet.rpc_url,
		// 	accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		// },
		bsc: {
			url: "https://bsc-dataseed1.binance.org/",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		},
	},

	etherscan: {
		apiKey: process.env.SCAN_API_KEY
	},
};

export default config;
