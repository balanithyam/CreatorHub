import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Compass, Lightbulb, BookOpen, FileText, Video, Eye, 
  MessageSquare, LogOut, LayoutDashboard, ShieldAlert, Layers, Image, Mic, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar: React.FC<{ onOpenAIModal?: () => void }> = ({ onOpenAIModal }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const role = user?.role || 'CREATOR';

  const roleConfig: Record<string, { label: string; badge: string; color: string; focus: string }> = {
    ADMIN: {
      label: 'Studio Administrator',
      badge: 'Admin Lead',
      color: 'bg-[#FF5A36] text-white',
      focus: 'System Operations & Governance'
    },
    CREATOR: {
      label: 'Lead Creator',
      badge: 'Script & Idea Lead',
      color: 'bg-[#121316] text-[#D2F800]',
      focus: 'Ideation Lab & AI Blueprints'
    },
    PRODUCER: {
      label: 'Video Producer',
      badge: 'Pipeline Director',
      color: 'bg-[#2A72FF] text-white',
      focus: 'Production & Release Pipeline'
    },
    CURATOR: {
      label: 'Trend Curator',
      badge: 'Market Intelligence',
      color: 'bg-[#D2F800] text-[#121316]',
      focus: 'Multi-Niche Trend Radar'
    },
    EDITOR: {
      label: 'Motion Editor',
      badge: 'Post-Production Lead',
      color: 'bg-[#FF9900] text-[#121316]',
      focus: 'Video Review & Repurposing'
    }
  };

  const currentRole = roleConfig[role] || roleConfig.CREATOR;

  interface NavSuite {
    suiteTitle: string;
    primary: Array<{ label: string; path: string; icon: any; badge?: string }>;
    secondaryTitle?: string;
    secondary?: Array<{ label: string; path: string; icon: any }>;
    toolsTitle?: string;
    tools?: Array<{ label: string; path: string; icon: any }>;
  }

  // Role-Specific Tailored Navigation Suites
  const getRoleNavigation = (): NavSuite => {
    switch (role) {
      case 'ADMIN':
        return {
          suiteTitle: 'Governance Suite (Admin)',
          primary: [
            { label: 'Admin Command Console', path: '/app/admin', icon: ShieldAlert, badge: 'Exclusive' },
            { label: t('dashboard'), path: '/app/home', icon: LayoutDashboard },
            { label: t('production') + ' (Pipeline)', path: '/app/production', icon: Video },
          ],
          secondaryTitle: 'Studio Oversight',
          secondary: [
            { label: t('ideas') + ' (Lab)', path: '/app/ideas', icon: Lightbulb },
            { label: t('review') + ' (Studio)', path: '/app/review', icon: Eye },
            { label: t('discover') + ' (Trends)', path: '/app/discover', icon: Compass },
          ],
          tools: [
            { label: 'Sponsorship Calculator', path: '/app/sponsorship-calculator', icon: DollarSign },
            { label: 'Thumbnail Tester', path: '/app/thumbnail-tester', icon: Image },
          ]
        };

      case 'PRODUCER':
        return {
          suiteTitle: 'Production Operations',
          primary: [
            { label: t('dashboard'), path: '/app/home', icon: LayoutDashboard },
            { label: t('production') + ' (Kanban)', path: '/app/production', icon: Video, badge: 'Lead' },
            { label: t('review') + ' (Sign-Off)', path: '/app/review', icon: Eye },
            { label: 'Sponsorship & Deals', path: '/app/sponsorship-calculator', icon: DollarSign },
          ],
          secondaryTitle: 'Editorial Planning',
          secondary: [
            { label: t('blueprints') + ' (Scripts)', path: '/app/blueprints', icon: FileText },
            { label: t('family') + ' (Asset Graph)', path: '/app/family', icon: Layers },
            { label: t('ideas') + ' (Pipeline)', path: '/app/ideas', icon: Lightbulb },
          ],
          tools: [
            { label: 'Thumbnail A/B Tester', path: '/app/thumbnail-tester', icon: Image },
          ]
        };

      case 'CURATOR':
        return {
          suiteTitle: 'Market Intelligence Suite',
          primary: [
            { label: t('dashboard'), path: '/app/home', icon: LayoutDashboard },
            { label: t('discover') + ' (Trend Radar)', path: '/app/discover', icon: Compass, badge: 'Lead' },
            { label: t('audience') + ' (Feedback)', path: '/app/audience', icon: MessageSquare },
            { label: t('research') + ' (Topic Intel)', path: '/app/research', icon: BookOpen },
            { label: t('ideas') + ' (Capture)', path: '/app/ideas', icon: Lightbulb },
          ],
          secondaryTitle: 'Studio Collaboration',
          secondary: [
            { label: t('blueprints') + ' (Reference)', path: '/app/blueprints', icon: FileText },
          ],
          tools: [
            { label: 'Thumbnail A/B Tester', path: '/app/thumbnail-tester', icon: Image },
          ]
        };

      case 'EDITOR':
        return {
          suiteTitle: 'Post-Production Suite',
          primary: [
            { label: t('dashboard'), path: '/app/home', icon: LayoutDashboard },
            { label: t('review') + ' (Review Studio)', path: '/app/review', icon: Eye, badge: 'Lead' },
            { label: t('family') + ' (Repurpose Graph)', path: '/app/family', icon: Layers },
            { label: t('production') + ' (Board)', path: '/app/production', icon: Video },
          ],
          secondaryTitle: 'Reference & Scripts',
          secondary: [
            { label: t('blueprints') + ' (Scripts)', path: '/app/blueprints', icon: FileText },
          ],
          tools: [
            { label: 'Thumbnail A/B Tester', path: '/app/thumbnail-tester', icon: Image },
            { label: 'Studio Prompter', path: '/app/teleprompter', icon: Mic },
          ]
        };

      case 'CREATOR':
      default:
        return {
          suiteTitle: 'Creative Suite (Lead)',
          primary: [
            { label: t('dashboard'), path: '/app/home', icon: LayoutDashboard },
            { label: t('ideas') + ' (Ideas Lab)', path: '/app/ideas', icon: Lightbulb, badge: 'Lead' },
            { label: t('blueprints') + ' (Scripts)', path: '/app/blueprints', icon: FileText },
            { label: t('research') + ' (Topic Intel)', path: '/app/research', icon: BookOpen },
          ],
          secondaryTitle: 'Collaborative Media',
          secondary: [
            { label: t('review') + ' (Review Studio)', path: '/app/review', icon: Eye },
            { label: t('family') + ' (Asset Graph)', path: '/app/family', icon: Layers },
            { label: t('production') + ' (Queue)', path: '/app/production', icon: Video },
          ],
          tools: [
            { label: 'Studio Prompter', path: '/app/teleprompter', icon: Mic },
            { label: 'Thumbnail A/B Tester', path: '/app/thumbnail-tester', icon: Image },
          ]
        };
    }
  };

  const navConfig = getRoleNavigation();

  return (
    <aside className="w-64 bg-[#FAF8F5] border-r-2 border-[#121316] flex flex-col justify-between h-screen sticky top-0 z-20 shrink-0">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b-2 border-[#121316] flex items-center justify-center shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/app')}>
            <div className="w-8 h-8 rounded-xl bg-[#121316] flex items-center justify-center shadow-xs">
              <span className="font-black text-xs text-[#D2F800] tracking-tighter">CH</span>
            </div>
            <div>
              <span className="font-black text-sm text-[#121316] tracking-tight block">CreatorHub</span>
              <span className="text-[9px] font-mono uppercase text-[#FF5A36] font-bold block -mt-0.5">Studio Operating System</span>
            </div>
          </div>
        </div>

        <div className="px-3.5 py-2.5 mx-3 my-2 bg-white border-2 border-[#121316] rounded-xl shadow-xs shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase text-[#6b6864]">Active Workspace</span>
            <span className={'px-2 py-0.5 rounded text-[8px] font-mono font-extrabold ' + currentRole.color}>
              {currentRole.badge}
            </span>
          </div>
          <p className="text-xs font-black text-[#121316] mt-0.5 truncate">{user?.name || 'Studio Member'}</p>
          <p className="text-[9px] text-[#6b6864] font-medium truncate">{currentRole.focus}</p>
        </div>

        <nav className="p-2.5 space-y-1 overflow-y-auto flex-1 min-h-0">
          {/* Primary Suite For Current Role */}
          <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase text-[#121316] flex items-center justify-between">
            <span>{navConfig.suiteTitle}</span>
            <span className="text-[8px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#121316] text-[#D2F800]">Primary</span>
          </div>
          {navConfig.primary.map((item: any) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (
                    isActive
                      ? 'bg-[#121316] text-white border-2 border-[#121316] shadow-xs'
                      : 'text-[#121316] hover:bg-[#E5E0DA]'
                  )
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Icon className={'w-3.5 h-3.5 shrink-0 ' + (isActive ? 'text-[#D2F800]' : 'text-[#FF5A36]')} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="text-[8px] font-mono font-bold px-1 rounded bg-[#FF5A36]/10 text-[#FF5A36]">{item.badge}</span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Secondary / Collaborative Suite */}
          {navConfig.secondary && navConfig.secondary.length > 0 && (
            <>
              <div className="pt-2 px-2 py-1 text-[9px] font-mono font-bold uppercase text-[#6b6864]">{navConfig.secondaryTitle || 'Collaboration'}</div>
              {navConfig.secondary.map((item: any) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (
                        isActive
                          ? 'bg-[#121316] text-white border-2 border-[#121316] shadow-xs'
                          : 'text-[#6b6864] hover:text-[#121316] hover:bg-[#E5E0DA]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-2 w-full">
                        <Icon className={'w-3.5 h-3.5 shrink-0 ' + (isActive ? 'text-[#D2F800]' : 'text-[#6b6864]')} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </>
          )}

          {/* Tools for Current Role */}
          {navConfig.tools && navConfig.tools.length > 0 && (
            <>
              <div className="pt-2 px-2 py-1 text-[9px] font-mono font-bold uppercase text-[#6b6864]">{navConfig.toolsTitle || 'Role Tools'}</div>
              {navConfig.tools.map((item: any) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (
                        isActive
                          ? 'bg-[#121316] text-white border-2 border-[#121316] shadow-xs'
                          : 'text-[#121316] hover:bg-[#E5E0DA]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-2 w-full">
                        <Icon className={'w-3.5 h-3.5 shrink-0 ' + (isActive ? 'text-[#D2F800]' : 'text-[#2A72FF]')} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>
      </div>

      <div className="p-3 border-t-2 border-[#121316] bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-7 h-7 rounded-full object-cover border border-[#121316] shrink-0"
            />
            <div className="leading-tight overflow-hidden">
              <span className="font-extrabold text-xs text-[#121316] block truncate">{user?.name}</span>
              <span className="text-[9px] font-mono text-[#6b6864] uppercase font-bold truncate block">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-[#6b6864] hover:text-[#FF5A36] hover:bg-[#FFEFEA] rounded-lg transition-colors cursor-pointer shrink-0"
            title={t('sign_out')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
