import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lazeezos - Food Delivery App',
  description: 'Order food from your favorite restaurants, delivered to your door',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

