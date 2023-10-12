require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || ""
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || ""
require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig **/

module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: privateKeys.split(",")
    }
  }
};
