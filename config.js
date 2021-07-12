// Addresses that should not be considered in the calculation,
// like staking contracts, liquidity pools etc.
const BLACKLIST = [
  // Common Pool
  '0x4ba7362f9189572cbb1216819a45aba0d0b2d1cb',
  // HNY-WXDAI
  '0x4505b262dc053998c10685dc5f9098af8ae5c8ad',
  // HNY-STAKE
  '0x298c7326a6e4a6108b88520f285c7dc89403347d',
  // WETH-HNY
  '0x89e2f342b411032a580fefa17f96da6a5bef4112',
  // AGVE-HNY
  '0x50a4867aee9cafd6ddc84de3ce59df027cb29084'
]

// To filter out accounts with low holdings
// you can adjust this parameter.
//
// It is recommended to set this to a non-zero
// value as there might be a large amount of
// addresses with small residual amounts
// of Honey.
const MINIMUM_HOLDINGS = "100000000000000000"

module.exports = {
  BLACKLIST,
  MINIMUM_HOLDINGS
}
