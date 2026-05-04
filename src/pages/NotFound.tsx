export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">页面不存在</p>
        <a href="/" className="text-primary-light dark:text-primary-dark underline">
          返回首页
        </a>
      </div>
    </div>
  )
}
