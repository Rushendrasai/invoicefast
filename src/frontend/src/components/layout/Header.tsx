import { Download, FileText, Zap } from "lucide-react";

interface HeaderProps {
  onDownload?: () => void;
  isDownloading?: boolean;
}

export function Header({ onDownload, isDownloading = false }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              Invoice<span className="text-primary">Fast</span>
            </span>
          </div>

          {/* Nav links — hidden on small screens */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Site navigation"
          >
            <a
              href="#privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#support"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Contact Support
            </a>
          </nav>

          {/* Download CTA */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            data-ocid="header.download_button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-smooth disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </div>
    </header>
  );
}
