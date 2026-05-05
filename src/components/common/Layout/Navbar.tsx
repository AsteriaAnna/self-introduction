import { useState } from 'react';
import { ThemeToggle } from '@components/extensions/Theme';
import { useLanguage } from '@components/extensions/Language';
import { Link, useLocation } from 'react-router-dom';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
    >
      {language === 'zh' ? 'EN' : '中'}
    </button>
  );
}

function MobileMenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2"
      aria-label="Toggle menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  const NavLinks = () => (
    <>
      <button
        onClick={() => scrollToSection('hero')}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
      >
        {t('nav.home')}
      </button>
      <button
        onClick={() => scrollToSection('ability-cloud')}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
      >
        {t('nav.skills')}
      </button>
      <button
        onClick={() => scrollToSection('graph')}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
      >
        {t('nav.graph')}
      </button>
      <button
        onClick={() => scrollToSection('contact')}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
      >
        {t('nav.contact')}
      </button>
    </>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border-b border-gray-200/30 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-light tracking-wider text-gray-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Asteria
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex items-center gap-8">
              {isHomePage ? (
                <NavLinks />
              ) : (
                <Link
                  to="/"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
                >
                  {t('nav.back')}
                </Link>
              )}
            </div>
            <LanguageToggle />
            <ThemeToggle />
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && isHomePage && (
        <div className="fixed inset-0 z-40 top-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl pt-20 pb-6 px-4">
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-base tracking-wide py-2"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('ability-cloud')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-base tracking-wide py-2"
            >
              {t('nav.skills')}
            </button>
            <button
              onClick={() => scrollToSection('graph')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-base tracking-wide py-2"
            >
              {t('nav.graph')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-base tracking-wide py-2"
            >
              {t('nav.contact')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
