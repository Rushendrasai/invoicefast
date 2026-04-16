import { Palette, Plus, Trash2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type {
  DiscountType,
  InvoiceCalculations,
  InvoiceData,
  LineItem,
} from "../../types/invoice";

interface InvoiceFormProps {
  invoice: InvoiceData;
  calculations: InvoiceCalculations;
  onUpdateSender: (patch: Partial<InvoiceData["sender"]>) => void;
  onUpdateClient: (patch: Partial<InvoiceData["client"]>) => void;
  onSetInvoiceNumber: (v: string) => void;
  onSetCreatedDate: (v: string) => void;
  onSetDueDate: (v: string) => void;
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) => void;
  onDeleteItem: (id: string) => void;
  onSetTaxRate: (v: number) => void;
  onSetDiscount: (patch: Partial<InvoiceData["discount"]>) => void;
  onSetNotes: (v: string) => void;
  onSetTerms: (v: string) => void;
  onSetThemeColor: (v: string) => void;
  onSetCurrency: (v: string) => void;
}

interface FieldErrors {
  senderName?: string;
  clientName?: string;
  noItems?: string;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY", "SGD"];

const THEME_PRESETS = [
  "#4f46e5",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export function InvoiceForm({
  invoice,
  calculations,
  onUpdateSender,
  onUpdateClient,
  onSetInvoiceNumber,
  onSetCreatedDate,
  onSetDueDate,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onSetTaxRate,
  onSetDiscount,
  onSetNotes,
  onSetTerms,
  onSetThemeColor,
  onSetCurrency,
}: InvoiceFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Validation ─────────────────────────────────────────────────── */
  function validateField(name: keyof FieldErrors, value: string) {
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() ? undefined : "This field is required",
    }));
  }

  /* ── Logo Upload ────────────────────────────────────────────────── */
  const handleLogoFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateSender({ logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    },
    [onUpdateSender],
  );

  const handleLogoDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleLogoFile(file);
    },
    [handleLogoFile],
  );

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleLogoFile(file);
    },
    [handleLogoFile],
  );

  /* ── Shared input classNames ────────────────────────────────────── */
  const inputCls =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth";
  const errorInputCls =
    "w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/60 transition-smooth";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  /* ── Currency symbol ────────────────────────────────────────────── */
  const currencySymbol =
    invoice.currency === "EUR"
      ? "€"
      : invoice.currency === "GBP"
        ? "£"
        : invoice.currency === "JPY"
          ? "¥"
          : invoice.currency === "INR"
            ? "₹"
            : "$";

  return (
    <div className="space-y-5">
      {/* ── Logo Upload ─────────────────────────────────────────────── */}
      <section
        data-ocid="form.logo_section"
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <h3 className="invoice-section-label mb-3">Brand Logo</h3>

        {invoice.sender.logo ? (
          <div className="flex items-center gap-4">
            <img
              src={invoice.sender.logo}
              alt="Company logo"
              className="h-16 w-auto max-w-[140px] object-contain rounded border border-border bg-muted/30 p-1"
            />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                data-ocid="form.logo_replace_button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:underline font-medium"
              >
                Replace
              </button>
              <button
                type="button"
                data-ocid="form.logo_remove_button"
                onClick={() => onUpdateSender({ logo: null })}
                className="text-xs text-destructive hover:underline font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="form.logo_dropzone"
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-smooth w-full ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleLogoDrop}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload company logo"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">
              Drag &amp; drop or{" "}
              <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              PNG, JPG, SVG up to 2MB
            </p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleLogoChange}
          data-ocid="form.logo_input"
        />
      </section>

      {/* ── Invoice Header ──────────────────────────────────────────── */}
      <section
        data-ocid="form.header_section"
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <h3 className="invoice-section-label mb-3">Invoice Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} htmlFor="invoice-number">
              Invoice Number
            </label>
            <input
              id="invoice-number"
              data-ocid="form.invoice_number_input"
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => onSetInvoiceNumber(e.target.value)}
              className={inputCls}
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="created-date">
              Issue Date
            </label>
            <input
              id="created-date"
              data-ocid="form.created_date_input"
              type="date"
              value={invoice.createdDate}
              onChange={(e) => onSetCreatedDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="due-date">
              Due Date
            </label>
            <input
              id="due-date"
              data-ocid="form.due_date_input"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onSetDueDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* ── Sender + Client side-by-side ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Sender */}
        <section
          data-ocid="form.sender_section"
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <h3 className="invoice-section-label mb-3">From (Your Details)</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls} htmlFor="sender-name">
                Name / Company *
              </label>
              <input
                id="sender-name"
                data-ocid="form.sender_name_input"
                type="text"
                value={invoice.sender.name}
                onChange={(e) => onUpdateSender({ name: e.target.value })}
                onBlur={(e) => validateField("senderName", e.target.value)}
                className={errors.senderName ? errorInputCls : inputCls}
                placeholder="Acme Inc."
              />
              {errors.senderName && (
                <p
                  data-ocid="form.sender_name_field_error"
                  className="mt-1 text-xs text-destructive"
                >
                  {errors.senderName}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls} htmlFor="sender-email">
                Email
              </label>
              <input
                id="sender-email"
                data-ocid="form.sender_email_input"
                type="email"
                value={invoice.sender.email}
                onChange={(e) => onUpdateSender({ email: e.target.value })}
                className={inputCls}
                placeholder="hello@acme.com"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="sender-address">
                Address
              </label>
              <textarea
                id="sender-address"
                data-ocid="form.sender_address_textarea"
                value={invoice.sender.address}
                onChange={(e) => onUpdateSender({ address: e.target.value })}
                className={`${inputCls} resize-none`}
                rows={3}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="sender-tax">
                Tax ID / VAT / GST
              </label>
              <input
                id="sender-tax"
                data-ocid="form.sender_taxid_input"
                type="text"
                value={invoice.sender.taxId}
                onChange={(e) => onUpdateSender({ taxId: e.target.value })}
                className={inputCls}
                placeholder="VAT123456789"
              />
            </div>
          </div>
        </section>

        {/* Client */}
        <section
          data-ocid="form.client_section"
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <h3 className="invoice-section-label mb-3">Bill To (Client)</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls} htmlFor="client-name">
                Client Name *
              </label>
              <input
                id="client-name"
                data-ocid="form.client_name_input"
                type="text"
                value={invoice.client.name}
                onChange={(e) => onUpdateClient({ name: e.target.value })}
                onBlur={(e) => validateField("clientName", e.target.value)}
                className={errors.clientName ? errorInputCls : inputCls}
                placeholder="John Smith / Company"
              />
              {errors.clientName && (
                <p
                  data-ocid="form.client_name_field_error"
                  className="mt-1 text-xs text-destructive"
                >
                  {errors.clientName}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls} htmlFor="client-email">
                Email
              </label>
              <input
                id="client-email"
                data-ocid="form.client_email_input"
                type="email"
                value={invoice.client.email}
                onChange={(e) => onUpdateClient({ email: e.target.value })}
                className={inputCls}
                placeholder="client@email.com"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="client-address">
                Address
              </label>
              <textarea
                id="client-address"
                data-ocid="form.client_address_textarea"
                value={invoice.client.address}
                onChange={(e) => onUpdateClient({ address: e.target.value })}
                className={`${inputCls} resize-none`}
                rows={3}
                placeholder="456 Client Ave, City, State 67890"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── Line Items ──────────────────────────────────────────────── */}
      <section
        data-ocid="form.line_items_section"
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <h3 className="invoice-section-label mb-3">Line Items</h3>

        {invoice.items.length === 0 ? (
          <div
            data-ocid="form.line_items_empty_state"
            className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-lg"
          >
            No items yet. Add a line item below.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-xs font-semibold text-muted-foreground pl-1 w-[40%]">
                    Description
                  </th>
                  <th className="pb-2 text-right text-xs font-semibold text-muted-foreground w-[14%]">
                    Qty
                  </th>
                  <th className="pb-2 text-right text-xs font-semibold text-muted-foreground w-[18%]">
                    Rate
                  </th>
                  <th className="pb-2 text-right text-xs font-semibold text-muted-foreground w-[18%]">
                    Amount
                  </th>
                  <th className="pb-2 w-[10%]" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {invoice.items.map((item, index) => (
                  <tr
                    key={item.id}
                    data-ocid={`form.line_item.${index + 1}`}
                    className="group"
                  >
                    <td className="py-2 pr-2 pl-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          onUpdateItem(item.id, "description", e.target.value)
                        }
                        className={`${inputCls} text-xs`}
                        placeholder="Service description"
                        data-ocid={`form.line_item_description.${index + 1}`}
                        aria-label={`Item ${index + 1} description`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateItem(
                            item.id,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        className={`${inputCls} text-xs text-right`}
                        data-ocid={`form.line_item_qty.${index + 1}`}
                        aria-label={`Item ${index + 1} quantity`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            onUpdateItem(
                              item.id,
                              "rate",
                              Number(e.target.value),
                            )
                          }
                          className={`${inputCls} text-xs text-right pl-6`}
                          data-ocid={`form.line_item_rate.${index + 1}`}
                          aria-label={`Item ${index + 1} rate`}
                        />
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-right">
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {currencySymbol}
                        {(calculations.rowTotals[item.id] ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        disabled={invoice.items.length <= 1}
                        data-ocid={`form.line_item_delete_button.${index + 1}`}
                        aria-label={`Delete item ${index + 1}`}
                        className="rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {errors.noItems && (
          <p
            data-ocid="form.line_items_field_error"
            className="mt-2 text-xs text-destructive"
          >
            {errors.noItems}
          </p>
        )}

        <button
          type="button"
          onClick={onAddItem}
          data-ocid="form.add_line_item_button"
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/10 hover:border-primary transition-smooth w-full justify-center"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Line Item
        </button>
      </section>

      {/* ── Financial Summary ───────────────────────────────────────── */}
      <section
        data-ocid="form.financial_section"
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <h3 className="invoice-section-label mb-3">Financial Summary</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Currency */}
          <div>
            <label className={labelCls} htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              data-ocid="form.currency_select"
              value={invoice.currency}
              onChange={(e) => onSetCurrency(e.target.value)}
              className={inputCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Tax Rate */}
          <div>
            <label className={labelCls} htmlFor="tax-rate">
              Tax Rate (%)
            </label>
            <div className="relative">
              <input
                id="tax-rate"
                data-ocid="form.tax_rate_input"
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={invoice.taxRate}
                onChange={(e) => onSetTaxRate(Number(e.target.value))}
                className={`${inputCls} pr-8`}
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="discount-value">
            Discount
          </label>
          <div className="flex gap-2">
            <div className="flex rounded-md border border-input overflow-hidden">
              {(["fixed", "percentage"] as DiscountType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-ocid={`form.discount_type_${t}`}
                  onClick={() => onSetDiscount({ type: t })}
                  className={`px-3 py-2 text-xs font-medium transition-smooth ${
                    invoice.discount.type === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t === "fixed" ? `${currencySymbol} Fixed` : "% Pct"}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {invoice.discount.type === "percentage" ? "%" : currencySymbol}
              </span>
              <input
                id="discount-value"
                type="number"
                min={0}
                step="0.01"
                value={invoice.discount.value}
                onChange={(e) =>
                  onSetDiscount({ value: Number(e.target.value) })
                }
                data-ocid="form.discount_value_input"
                className={`${inputCls} pl-7`}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Totals read-only summary */}
        <div className="rounded-lg bg-muted/30 p-4 space-y-2 border border-border/50">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-foreground">
              {currencySymbol}
              {calculations.subtotal.toFixed(2)}
            </span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax ({invoice.taxRate}%)</span>
              <span className="tabular-nums">
                {currencySymbol}
                {calculations.taxAmount.toFixed(2)}
              </span>
            </div>
          )}
          {calculations.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Discount{" "}
                {invoice.discount.type === "percentage"
                  ? `(${invoice.discount.value}%)`
                  : ""}
              </span>
              <span className="tabular-nums text-destructive">
                -{currencySymbol}
                {calculations.discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border font-bold text-base text-foreground">
            <span>Grand Total</span>
            <span
              data-ocid="form.grand_total"
              className="tabular-nums text-primary"
            >
              {currencySymbol}
              {calculations.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Notes & Terms ───────────────────────────────────────────── */}
      <section
        data-ocid="form.notes_section"
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <h3 className="invoice-section-label mb-3">Notes &amp; Terms</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls} htmlFor="notes">
              Notes (Bank details, thank you message)
            </label>
            <textarea
              id="notes"
              data-ocid="form.notes_textarea"
              value={invoice.notes}
              onChange={(e) => onSetNotes(e.target.value)}
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Payment due within 30 days. Bank: ..."
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="terms">
              Payment Terms
            </label>
            <textarea
              id="terms"
              data-ocid="form.terms_textarea"
              value={invoice.terms}
              onChange={(e) => onSetTerms(e.target.value)}
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="Net 30, late fee 1.5% per month..."
            />
          </div>
        </div>
      </section>

      {/* ── Theme Color ─────────────────────────────────────────────── */}
      <section
        data-ocid="form.theme_section"
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <h3 className="invoice-section-label mb-3">Invoice Branding</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className={labelCls} htmlFor="theme-color">
              <span className="flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> Invoice Color
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="theme-color"
                data-ocid="form.theme_color_input"
                type="color"
                value={invoice.themeColor}
                onChange={(e) => onSetThemeColor(e.target.value)}
                className="h-9 w-14 rounded-md border border-input cursor-pointer p-0.5 bg-background"
              />
              <span className="text-xs text-muted-foreground font-mono">
                {invoice.themeColor}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <p className={`${labelCls} mb-2`}>Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  data-ocid={`form.theme_preset_${color.replace("#", "")}`}
                  onClick={() => onSetThemeColor(color)}
                  aria-label={`Set theme color to ${color}`}
                  className={`h-7 w-7 rounded-full border-2 transition-smooth hover:scale-110 ${
                    invoice.themeColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Validation helper for App.tsx to call before download ─────────── */
export function validateInvoiceForm(invoice: InvoiceData): FieldErrors {
  const errs: FieldErrors = {};
  if (!invoice.sender.name.trim()) errs.senderName = "Sender name is required";
  if (!invoice.client.name.trim()) errs.clientName = "Client name is required";
  if (invoice.items.length === 0)
    errs.noItems = "At least one line item is required";
  return errs;
}
