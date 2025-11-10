import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SNW STORE - Revendas dos Melhores Produtos',
  description: 'Encontre os melhores produtos com os melhores preços. Revendas confiáveis no Mercado Livre.',
  keywords: 'mercado livre, revendas, produtos, compras online',
  icons: {
    icon: '/snow-icon.png',
    apple: '/snow-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

