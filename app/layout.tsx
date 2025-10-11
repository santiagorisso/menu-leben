import type React from "react"
import type { Metadata } from "next"
import { Nokora as Knockout } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const knockout = Knockout({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-knockout",
})

export const metadata: Metadata = {
  title: "Leben Brewing Co - Carta",
  description: "Menú de cervezas artesanales, pizzas, sandwiches y tragos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${knockout.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
