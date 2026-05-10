export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dr. Ramagiri Praveen Kumar. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="https://scholar.google.com/citations?user=RZaoPNEAAAAJ" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Google Scholar
            </a>
            <a href="http://scholarprofiles.com/RPKUMAR" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Scholar Profile
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
