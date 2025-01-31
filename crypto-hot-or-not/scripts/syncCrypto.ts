// scripts/syncCrypto.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Fetch top 100 cryptocurrencies from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    )
    const data = await response.json()

    // Update database
    for (const crypto of data) {
      await prisma.cryptocurrency.upsert({
        where: { id: crypto.id },
        update: {
          symbol: crypto.symbol,
          name: crypto.name,
          image: crypto.image,
          current_price: crypto.current_price,
          market_cap: crypto.market_cap,
          market_cap_rank: crypto.market_cap_rank,
          total_volume: crypto.total_volume,
          price_change_24h: crypto.price_change_24h,
          circulating_supply: crypto.circulating_supply,
        },
        create: {
          id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          image: crypto.image,
          current_price: crypto.current_price,
          market_cap: crypto.market_cap,
          market_cap_rank: crypto.market_cap_rank,
          total_volume: crypto.total_volume,
          price_change_24h: crypto.price_change_24h,
          circulating_supply: crypto.circulating_supply,
        },
      })
    }
    console.log('Database updated successfully!')
  } catch (error) {
    console.error('Error updating database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()