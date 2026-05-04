import { Navbar } from '@components/common/Layout'
import { Hero } from '@components/core/Hero'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  )
}
