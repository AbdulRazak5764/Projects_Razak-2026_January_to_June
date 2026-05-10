export default function Footer() {
    return (
        <footer className="relative py-10 px-4 border-t border-border/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <span className="font-space font-bold text-sm text-primary">S</span>
                        </div>
                        <span className="font-space font-semibold text-foreground">Shaik Abdul Razak</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} · ML Engineer · AI Researcher · Open to Opportunities
                    </p>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">Available for Hire</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}