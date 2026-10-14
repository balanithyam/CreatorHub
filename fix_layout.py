code = r"""import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AIActionModal } from './AIActionModal';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-[#121316]">
      <Sidebar onOpenAIModal={() => setIsAIOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAIModal={() => setIsAIOpen(true)}
        />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AIActionModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </div>
  );
};
"""

with open(r'D:\CreatorHub\frontend\src\components\Layout.tsx', 'w', encoding='utf-8') as f:
    f.write(code.strip())

print("Fixed Layout.tsx to render children correctly!")
