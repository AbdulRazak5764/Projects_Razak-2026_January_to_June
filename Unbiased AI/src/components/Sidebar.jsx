import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Database, BarChart2, Shield, Brain, FileText,
    Settings, HelpCircle, ShieldCheck, ChevronRight
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Database, label: 'Datasets', path: '/datasets' },
    { icon: BarChart2, label: 'Bias Analysis', path: '/bias-analysis' },
    { icon: Shield, label: 'Mitigation', path: '/mitigation' },
    { icon: Brain, label: 'Explainability', path: '/explainability' },
    { icon: FileText, label: 'Reports', path: '/reports' },
];

const bottomItems = [
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-16 lg:w-60 h-full bg-navy flex flex-col border-r border-navy-border flex-shrink-0 transition-all duration-300">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-navy-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-white text-sm font-semibold leading-tight">Unbiased AI</p>
                        <p className="text-sidebar-foreground text-xs">Decision Tool</p>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
                <div className="px-2 space-y-0.5">
                    {navItems.map(({ icon: Icon, label, path }) => {
                        const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-sidebar-foreground hover:bg-navy-lighter hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
                                <span className="hidden lg:block flex-1">{label}</span>
                                {isActive && <ChevronRight className="hidden lg:block w-3 h-3 ml-auto opacity-70" />}
                            </Link>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="mx-3 my-4 border-t border-navy-border" />

                <div className="px-2 space-y-0.5">
                    {bottomItems.map(({ icon: Icon, label, path }) => {
                        const isActive = location.pathname.startsWith(path);
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-sidebar-foreground hover:bg-navy-lighter hover:text-white'
                                    }`}
                            >
                                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                                <span className="hidden lg:block">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User */}
            <div className="p-3 border-t border-navy-border">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-navy-lighter cursor-pointer transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-semibold">A</span>
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-white text-xs font-medium">Admin</p>
                        <p className="text-sidebar-foreground text-xs">admin@company.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}