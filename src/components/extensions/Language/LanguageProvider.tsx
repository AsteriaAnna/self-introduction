import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'zh' | 'en'

type TranslationKey = 
  | 'nav.home'
  | 'nav.skills'
  | 'nav.graph'
  | 'nav.contact'
  | 'nav.back'
  | 'hero.hello'
  | 'hero.contact'
  | 'hero.explore'
  | 'life.attitude.title'
  | 'life.attitude.subtitle'
  | 'life.focus'
  | 'life.focus.desc'
  | 'life.explore'
  | 'life.explore.desc'
  | 'life.create'
  | 'life.create.desc'
  | 'life.love'
  | 'life.love.desc'
  | 'ability.cloud.title'
  | 'ability.cloud.subtitle'
  | 'explore.directions.title'
  | 'explore.directions.subtitle'
  | 'skill.cloud.title'
  | 'skill.cloud.subtitle'
  | 'knowledge.graph.title'
  | 'knowledge.graph.subtitle'
  | 'knowledge.graph.desc'
  | 'contact.title'
  | 'contact.subtitle'
  | 'contact.cta'
  | 'project.detail.title'
  | 'experience.detail.title'
  | 'skill.detail.title'
  | 'skill.detail.projects'
  | 'skill.detail.experience'
  | 'not.found.title'
  | 'not.found.subtitle'
  | 'loading'
  | 'no.content'
  | 'related.items'

type Translations = { [key in TranslationKey]: string }

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: TranslationKey) => string
}

const translations: { zh: Translations; en: Translations } = {
  zh: {
    'nav.home': '首页',
    'nav.skills': '技能',
    'nav.graph': '图谱',
    'nav.contact': '联系',
    'nav.back': '返回',
    'hero.hello': '你好，我是',
    'hero.contact': '联系',
    'hero.explore': '探索',
    'life.attitude.title': '生活态度',
    'life.attitude.subtitle': '人生关键词',
    'life.focus': '专注',
    'life.focus.desc': '用心做好每一件事',
    'life.explore': '探索',
    'life.explore.desc': '对新事物充满好奇心',
    'life.create': '创造',
    'life.create.desc': '用代码创造价值',
    'life.love': '热爱',
    'life.love.desc': '享受技术带来的乐趣',
    'ability.cloud.title': '内在特质',
    'ability.cloud.subtitle': '软技能',
    'explore.directions.title': '探索方向',
    'explore.directions.subtitle': '我在做什么',
    'skill.cloud.title': '技术栈',
    'skill.cloud.subtitle': '技术技能',
    'knowledge.graph.title': '知识网络',
    'knowledge.graph.subtitle': '知识图谱',
    'knowledge.graph.desc': '点击节点查看项目详情',
    'contact.title': '联系方式',
    'contact.subtitle': '联系',
    'contact.cta': '期待与你合作',
    'project.detail.title': '项目详情',
    'experience.detail.title': '经历详情',
    'skill.detail.title': '相关内容',
    'skill.detail.projects': '项目',
    'skill.detail.experience': '经历',
    'not.found.title': '页面不存在',
    'not.found.subtitle': '返回首页',
    'loading': '加载中...',
    'no.content': '暂无相关内容',
    'related.items': '相关内容'
  },
  en: {
    'nav.home': 'Home',
    'nav.skills': 'Skills',
    'nav.graph': 'Graph',
    'nav.contact': 'Contact',
    'nav.back': 'Back',
    'hero.hello': 'Hi, I am',
    'hero.contact': 'Contact',
    'hero.explore': 'Explore',
    'life.attitude.title': 'Philosophy',
    'life.attitude.subtitle': 'Core Values',
    'life.focus': 'Focus',
    'life.focus.desc': 'Doing things with care',
    'life.explore': 'Explore',
    'life.explore.desc': 'Curious about new things',
    'life.create': 'Create',
    'life.create.desc': 'Creating value with code',
    'life.love': 'Love',
    'life.love.desc': 'Enjoying the joy of tech',
    'ability.cloud.title': 'Abilities',
    'ability.cloud.subtitle': 'Soft Skills',
    'explore.directions.title': 'Focus',
    'explore.directions.subtitle': 'Areas of Interest',
    'skill.cloud.title': 'Tech',
    'skill.cloud.subtitle': 'Technical Skills',
    'knowledge.graph.title': 'Network',
    'knowledge.graph.subtitle': 'Knowledge Graph',
    'knowledge.graph.desc': 'Click nodes to view details',
    'contact.title': 'Get in touch',
    'contact.subtitle': 'Contact',
    'contact.cta': 'Looking forward to connecting with you',
    'project.detail.title': 'Project Details',
    'experience.detail.title': 'Experience Details',
    'skill.detail.title': 'Related Content',
    'skill.detail.projects': 'Projects',
    'skill.detail.experience': 'Experience',
    'not.found.title': 'Page not found',
    'not.found.subtitle': 'Back to Home',
    'loading': 'Loading...',
    'no.content': 'No related content found',
    'related.items': 'related items'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language')
    return (stored as Language) || 'zh'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'zh' ? 'en' : 'zh')
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
