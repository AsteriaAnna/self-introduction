import { SiteConfig } from '@/types';
import config from '@/data/config.json';

export function Hero() {
  const siteConfig = config as SiteConfig;

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-gray-50 via-white to-green-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-green-900/5"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          {siteConfig.name}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
          {siteConfig.title}
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          {siteConfig.bio}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {siteConfig.github && (
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium min-w-[200px] hover:scale-105 hover:shadow-lg"
            >
              GitHub
            </a>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:border-green-600 dark:hover:border-green-500 transition-all duration-300 font-medium min-w-[200px] hover:scale-105"
            >
              {siteConfig.email}
            </a>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-500 dark:text-gray-400">
          {siteConfig.phone && (
            <div className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{siteConfig.phone}</span>
            </div>
          )}
          {siteConfig.wechat && (
            <div className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{siteConfig.wechat}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
