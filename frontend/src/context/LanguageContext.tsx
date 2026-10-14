import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    discover: 'Discover',
    research: 'Research',
    ideas: 'Ideas Board',
    blueprints: 'Blueprints',
    production: 'Production',
    review: 'Review Studio',
    audience: 'Audience',
    family: 'Content Family',
    admin: 'Admin Center',
    ai_actions: 'AI Actions',
    search_placeholder: 'Search ideas, sources, blueprints, assets (Ctrl+K)...',
    sign_out: 'Sign Out'
  },
  es: {
    dashboard: 'Panel Principal',
    discover: 'Descubrir',
    research: 'Investigación',
    ideas: 'Tablero de Ideas',
    blueprints: 'Guiones y Planos',
    production: 'Producción',
    review: 'Estudio de Revisión',
    audience: 'Audiencia',
    family: 'Familia de Contenido',
    admin: 'Centro de Administración',
    ai_actions: 'Acciones de IA',
    search_placeholder: 'Buscar ideas, fuentes, planos, recursos (Ctrl+K)...',
    sign_out: 'Cerrar Sesión'
  },
  fr: {
    dashboard: 'Tableau de Bord',
    discover: 'Découvrir',
    research: 'Recherche',
    ideas: 'Tableau des Idées',
    blueprints: 'Plans & Scripts',
    production: 'Production',
    review: 'Studio de Révision',
    audience: 'Audience',
    family: 'Famille de Contenu',
    admin: 'Centre Admin',
    ai_actions: 'Actions IA',
    search_placeholder: 'Rechercher des idées, sources, plans (Ctrl+K)...',
    sign_out: 'Déconnexion'
  },
  de: {
    dashboard: 'Übersicht',
    discover: 'Entdecken',
    research: 'Recherche',
    ideas: 'Ideenboard',
    blueprints: 'Drehbücher',
    production: 'Produktion',
    review: 'Prüfstudio',
    audience: 'Publikum',
    family: 'Content-Familie',
    admin: 'Admin-Zentrum',
    ai_actions: 'KI-Aktionen',
    search_placeholder: 'Ideen, Quellen, Drehbücher suchen (Ctrl+K)...',
    sign_out: 'Abmelden'
  },
  ja: {
    dashboard: 'ダッシュボード',
    discover: 'トレンド発見',
    research: 'リサーチ',
    ideas: 'アイデアボード',
    blueprints: '台本・構成案',
    production: '制作スタジオ',
    review: '動画レビュー',
    audience: '視聴者の声',
    family: 'コンテンツ展開',
    admin: '管理者センター',
    ai_actions: 'AIアクション',
    search_placeholder: 'アイデア、素材、構成案を検索 (Ctrl+K)...',
    sign_out: 'ログアウト'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    discover: 'ट्रेंड खोजें',
    research: 'रिसर्च',
    ideas: 'आइडिया बोर्ड',
    blueprints: 'स्क्रिप्ट ब्लूप्रिंट',
    production: 'प्रोडक्शन',
    review: 'रिव्यू स्टूडियो',
    audience: 'दर्शक फीडबैक',
    family: 'कंटेंट इकोसिस्टम',
    admin: 'एडमिन सेंटर',
    ai_actions: 'AI एक्शन',
    search_placeholder: 'आइडिया, वीडियो, ब्लूप्रिंट खोजें (Ctrl+K)...',
    sign_out: 'लॉग आउट'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
