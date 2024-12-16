import './globals.css'

export const metadata = {
  title: 'Costa Rica Tide Times',
  description: 'Real-time tide information for Guapil and Ventanas beaches in Costa Rica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  )
}
