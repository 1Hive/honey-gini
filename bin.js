const BigNumber = require('bignumber.js')
const fetch = require('node-fetch')

function gini (
  wealth
) {
  let numerator = new BigNumber(0)
  for (const i in wealth) {
    numerator = numerator.plus(
      (new BigNumber(i).plus(1)).times(wealth[i])
    )
  }
  numerator = numerator.times(2)

  let denominator = new BigNumber(0)
  for (const i in wealth) {
    denominator = denominator.plus(wealth[i])
  }
  denominator = denominator.times(new BigNumber(wealth.length))

  return numerator.div(denominator).minus(
    new BigNumber(wealth.length).plus(1).div(new BigNumber(wealth.length))
  )
}

const FETCH_HOLDERS = `
  query holders(
    $skip: Int!
    $blacklist: [ID]!
    $minimum: BigInt!
  ) {
    holders(
      skip: $skip,
      first: 1000,
      orderBy: amount,
      orderDirection: asc,
      where: {
        amount_gt: $minimum,
        id_not_in: $blacklist
      }
    ) {
      amount
      id
    }
  }
`

async function query (query, variables) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/onbjerg/honey', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  })

  const body = await res.json()
  return body.data
}

async function fetchHolders (
  blacklist,
  minimum
) {
  let allHolders = []
  let page = 0
  while (true) {
    const { holders } = await query(FETCH_HOLDERS, {
      skip: page * 1000,
      blacklist,
      minimum
    })
    allHolders = allHolders.concat(holders.map((holder) => ({
      id: holder.id,
      amount: new BigNumber(holder.amount)
    })))

    if (holders.length === 0) {
      break
    }
    page += 1
  }

  return allHolders
}

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
const MINIMUM_HOLDINGS = "100000000000000000"

console.log(`Fetching balances...`)
fetchHolders(BLACKLIST, MINIMUM_HOLDINGS).then((holders) => {
  console.log(`Blacklisted addresses: ${BLACKLIST.length}`)
  console.log(`Minimum holdings to be considered: ${MINIMUM_HOLDINGS / Math.pow(10, 18)} HNY`)
  console.log(`Total holders: ${holders.length} (excluding blacklisted addresses)`)

  console.log(`Calculating gini...`)
  console.log(`G = ${gini(holders.map(({ amount }) => amount))}`)
})
