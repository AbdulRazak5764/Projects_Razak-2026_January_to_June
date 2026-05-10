import { useState } from 'react';
import { Bell, Search, Sun, Moon, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Topbar() {
    const [dark, setDark] = useState(false);

    const toggleDark = () => {
        setDark(!dark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search datasets, analyses, reports..."
                    className="pl-9 bg-muted/50 border-transparent focus:border-border h-9 text-sm"
                />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Theme toggle */}
                <Button variant="ghost" size="icon" onClick={toggleDark} className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
                </Button>

                {/* User */}
                <div className="flex items-center gap-2 pl-3 border-l border-border cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-foreground leading-none">Admin User</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Administrator</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
            </div>
        </header>
    );
}