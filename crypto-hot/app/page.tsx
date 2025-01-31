// app/page.tsx
'use client'

import dynamic from 'next/dynamic'
const CryptoHotOrNot = dynamic(() => import('@/components/CryptoHotOrNot'), {
  ssr: false,
})

export default function Home() {
  return (
    <main>
      <CryptoHotOrNot />
    </main>
  )
}