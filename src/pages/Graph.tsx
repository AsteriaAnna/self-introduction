import { Navbar } from '@components/common/Layout'
import { KnowledgeGraph } from '@components/extensions/KnowledgeGraph'

export default function Graph() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">知识图谱</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            通过可视化图谱展示技能、项目和工作经历之间的关联关系。
            点击项目或经历节点可跳转到详情页面。
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">技能</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">项目</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600 dark:text-gray-400">经历</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">交互说明</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500">●</span>
              <span>点击项目或经历节点可跳转到详情页面</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">●</span>
              <span>鼠标悬停可查看节点详细信息</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">●</span>
              <span>拖拽节点可调整位置</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">●</span>
              <span>滚轮可缩放图谱，拖拽背景可平移</span>
            </li>
          </ul>
        </div>

        <KnowledgeGraph />
      </main>
    </div>
  )
}
