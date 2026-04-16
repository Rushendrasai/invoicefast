import { Download, Eye, EyeOff } from "lucide-react";
import { useCallback, useState } from "react";
import {
  InvoiceForm,
  validateInvoiceForm,
} from "./components/invoice/InvoiceForm";
import { InvoicePreview } from "./components/invoice/InvoicePreview";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { useInvoiceCalculations } from "./hooks/useInvoiceCalculations";
import { useInvoiceState } from "./hooks/useInvoiceState";
import { generatePDF } from "./lib/pdfUtils";

const PREVIEW_ELEMENT_ID = "invoice-preview-root";

export default function App() {
  const invoiceState = useInvoiceState();
  const calculations = useInvoiceCalculations(invoiceState.invoice);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    // Validate before generating
    const errs = validateInvoiceForm(invoiceState.invoice);
    if (!invoiceState.invoice.client.name.trim()) {
      setValidationError("Please enter a client name before downloading.");
      setTimeout(() => setValidationError(null), 4000);
      return;
    }
    if (Object.keys(errs).length > 0) {
      setValidationError(Object.values(errs).join(" • "));
      setTimeout(() => setValidationError(null), 4000);
      return;
    }
    if (calculations.grandTotal <= 0) {
      setValidationError(
        "Grand total must be greater than $0 before downloading.",
      );
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    setValidationError(null);
    setIsDownloading(true);

    // Ensure the preview is visible before capturing on mobile
    const wasHidden = !showMobilePreview;
    if (wasHidden) setShowMobilePreview(true);

    // Small delay so DOM can paint if we just showed the preview
    await new Promise((r) => setTimeout(r, 100));

    try {
      const invoiceDate = invoiceState.invoice.createdDate || "invoice";
      await generatePDF(
        PREVIEW_ELEMENT_ID,
        `Invoice-${invoiceState.invoice.invoiceNumber}-${invoiceDate}.pdf`,
      );
    } catch (err) {
      console.error("PDF generation failed", err);
      setValidationError("PDF generation failed. Please try again.");
      setTimeout(() => setValidationError(null), 4000);
    } finally {
      setIsDownloading(false);
      if (wasHidden) setShowMobilePreview(false);
    }
  }, [invoiceState.invoice, calculations.grandTotal, showMobilePreview]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onDownload={handleDownload} isDownloading={isDownloading} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Top Ad Banner */}
        <div
          data-ocid="ad.banner.top"
          className="ad-banner-placeholder min-h-[80px] mb-6"
          aria-label="Advertisement placeholder"
        >
          [Advertisement Placeholder]
        </div>

        {/* Validation error toast */}
        {validationError && (
          <div
            data-ocid="invoice.error_state"
            role="alert"
            className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium flex items-center gap-2"
          >
            <span>⚠️</span>
            {validationError}
          </div>
        )}

        {/* Mobile: Preview toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h1 className="font-display text-xl font-bold text-foreground">
            Create Invoice
          </h1>
          <button
            type="button"
            onClick={() => setShowMobilePreview((v) => !v)}
            data-ocid="invoice.preview_toggle"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200"
          >
            {showMobilePreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Form column ──────────────────────────────────── */}
          <section
            data-ocid="invoice.form_panel"
            className={`space-y-4 ${showMobilePreview ? "hidden lg:block" : "block"}`}
            aria-label="Invoice form"
          >
            <InvoiceForm
              invoice={invoiceState.invoice}
              calculations={calculations}
              onUpdateSender={invoiceState.updateSender}
              onUpdateClient={invoiceState.updateClient}
              onSetInvoiceNumber={invoiceState.setInvoiceNumber}
              onSetCreatedDate={invoiceState.setCreatedDate}
              onSetDueDate={invoiceState.setDueDate}
              onAddItem={invoiceState.addItem}
              onUpdateItem={invoiceState.updateItem}
              onDeleteItem={invoiceState.deleteItem}
              onSetTaxRate={invoiceState.setTaxRate}
              onSetDiscount={invoiceState.setDiscount}
              onSetNotes={invoiceState.setNotes}
              onSetTerms={invoiceState.setTerms}
              onSetThemeColor={invoiceState.setThemeColor}
              onSetCurrency={invoiceState.setCurrency}
            />
          </section>

          {/* ── Preview column ───────────────────────────────── */}
          <section
            data-ocid="invoice.preview_panel"
            className={`lg:sticky lg:top-24 self-start ${
              showMobilePreview ? "block" : "hidden lg:block"
            }`}
            aria-label="Invoice preview"
          >
            <InvoicePreview
              invoice={invoiceState.invoice}
              calculations={calculations}
            />

            {/* Download button below preview — desktop only (mobile uses fixed FAB) */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              data-ocid="preview.download_button"
              className="hidden lg:flex mt-4 w-full items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-smooth disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Generating PDF…" : "Download Invoice PDF"}
            </button>
          </section>
        </div>

        {/* Bottom Ad Banner */}
        <div
          data-ocid="ad.banner.bottom"
          className="ad-banner-placeholder min-h-[80px] mt-6"
          aria-label="Advertisement placeholder"
        >
          [Advertisement Placeholder]
        </div>
      </main>

      <Footer />

      {/* ── Mobile sticky download FAB ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border px-4 py-3 shadow-lg">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          data-ocid="mobile.download_button"
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-smooth disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Generating PDF…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
