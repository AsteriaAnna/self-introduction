import { Navbar } from '@components/common/Layout'

export default function Graph() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">知识图谱</h1>
        <p className="text-gray-500 dark:text-gray-400">知识图谱组件开发中...</p>
      </main>
    </div>
  )
}
