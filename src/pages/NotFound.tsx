import { Link } from 'react-router-dom';
import { useTheme } from '@components/extensions/Theme';
import { useLanguage } from '@components/extensions/Language';
import { Navbar } from '@components/common/Layout';

export default function NotFound() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 text-center">
        <h1 className="text-6xl font-extralight text-gray-900 dark:text-white mb-4">404</h1>
        <p
          className={`text-lg font-light mb-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
        >
          {t('not.found.title')}
        </p>
        <Link
          to="/"
          className="text-sm tracking-wide text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          {t('not.found.subtitle')}
        </Link>
      </div>
    </div>
  );
}
