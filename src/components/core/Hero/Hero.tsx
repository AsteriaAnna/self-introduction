import { SiteConfig } from '@/types'
import config from '@/data/config.json'

export function Hero() {
  const siteConfig = config as SiteConfig

  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        {siteConfig.avatar && (
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {siteConfig.name.charAt(0)}
            </div>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {siteConfig.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
          {siteConfig.title}
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          {siteConfig.bio}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {siteConfig.github && (
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
            >
              GitHub
            </a>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              联系我
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
