import { Zap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand + copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span>
              © {year} InvoiceFast Tool. All data is processed locally in your
              browser.
            </span>
          </div>

          {/* Footer links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
            aria-label="Footer navigation"
          >
            <a
              href="#privacy"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <span className="text-border select-none">·</span>
            <a
              href="#terms"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </a>
            <span className="text-border select-none">·</span>
            <a
              href="#support"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Contact Support
            </a>
          </nav>
        </div>

        {/* Caffeine branding */}
        <div className="mt-4 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          Built with love using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
