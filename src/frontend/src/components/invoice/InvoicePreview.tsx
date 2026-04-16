import type { InvoiceCalculations, InvoiceData } from "../../types/invoice";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  calculations: InvoiceCalculations;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
}

function formatAmount(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    CAD: "CA$",
    AUD: "A$",
    SGD: "S$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CNY: "¥",
    CHF: "₣",
    KRW: "₩",
    THB: "฿",
    AED: "AED ",
    SAR: "SAR ",
    MXN: "MX$",
    BRL: "R$",
  };
  const key = currency?.trim().toUpperCase() ?? "";
  const sym = symbols[key] ?? (currency?.trim() ? `${currency.trim()} ` : "$");
  return `${sym}${amount.toFixed(2)}`;
}

export function InvoicePreview({ invoice, calculations }: InvoicePreviewProps) {
  const tc = invoice.themeColor;
  const tcLight = `${tc}18`;
  const tcMid = `${tc}30`;

  return (
    <div
      id="invoice-preview-root"
      className="invoice-preview-paper"
      style={{ borderTop: `4px solid ${tc}` }}
    >
      {/* ── Header band ─────────────────────────────────────── */}
      <div
        className="px-8 py-6 flex justify-between items-start"
        style={{ background: tcLight }}
      >
        {/* Left: logo or company name */}
        <div className="max-w-[55%]">
          {invoice.sender.logo ? (
            <img
              src={invoice.sender.logo}
              alt="Company logo"
              className="h-14 w-auto object-contain mb-2"
            />
          ) : (
            <div
              className="font-display text-2xl font-bold leading-tight"
              style={{ color: tc }}
            >
              {invoice.sender.name || "Your Company"}
            </div>
          )}
          {invoice.sender.name && invoice.sender.logo && (
            <div className="text-sm font-semibold text-[#1a1a2e] mt-1">
              {invoice.sender.name}
            </div>
          )}
          {invoice.sender.address && (
            <p className="text-[11px] text-[#444] mt-1 whitespace-pre-line leading-snug">
              {invoice.sender.address}
            </p>
          )}
          {invoice.sender.email && (
            <p className="text-[11px] text-[#666]">{invoice.sender.email}</p>
          )}
          {invoice.sender.taxId && (
            <p className="text-[11px] text-[#666]">
              Tax ID: {invoice.sender.taxId}
            </p>
          )}
        </div>

        {/* Right: INVOICE title + meta */}
        <div className="text-right shrink-0">
          <div
            className="text-3xl font-display font-black uppercase tracking-widest"
            style={{ color: tc }}
          >
            INVOICE
          </div>
          <div className="mt-2 space-y-0.5">
            <p className="text-[11px] text-[#555]">
              <span className="font-semibold text-[#222]">Invoice #:</span>{" "}
              {invoice.invoiceNumber}
            </p>
            <p className="text-[11px] text-[#555]">
              <span className="font-semibold text-[#222]">Date:</span>{" "}
              {formatDate(invoice.createdDate)}
            </p>
            <p className="text-[11px] text-[#555]">
              <span className="font-semibold text-[#222]">Due:</span>{" "}
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bill From / Bill To ───────────────────────────────── */}
      <div className="px-8 py-4 grid grid-cols-2 gap-4 border-b border-[#e5e7eb]">
        <div>
          <p
            className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5"
            style={{ color: tc }}
          >
            From
          </p>
          <p className="text-[12px] font-semibold text-[#1a1a2e]">
            {invoice.sender.name || "—"}
          </p>
          {invoice.sender.address && (
            <p className="text-[11px] text-[#555] whitespace-pre-line leading-snug mt-0.5">
              {invoice.sender.address}
            </p>
          )}
          {invoice.sender.email && (
            <p className="text-[11px] text-[#666]">{invoice.sender.email}</p>
          )}
        </div>
        <div>
          <p
            className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5"
            style={{ color: tc }}
          >
            Bill To
          </p>
          <p className="text-[12px] font-semibold text-[#1a1a2e]">
            {invoice.client.name || "—"}
          </p>
          {invoice.client.address && (
            <p className="text-[11px] text-[#555] whitespace-pre-line leading-snug mt-0.5">
              {invoice.client.address}
            </p>
          )}
          {invoice.client.email && (
            <p className="text-[11px] text-[#666]">{invoice.client.email}</p>
          )}
        </div>
      </div>

      {/* ── Line Items Table ──────────────────────────────────── */}
      <div className="px-8 pt-5 pb-2">
        <table className="w-full text-[11px]">
          <thead>
            <tr style={{ background: tc }}>
              <th className="py-2 px-3 text-left font-semibold text-white rounded-tl w-1/2">
                Description
              </th>
              <th className="py-2 px-2 text-right font-semibold text-white w-[10%]">
                Qty
              </th>
              <th className="py-2 px-2 text-right font-semibold text-white w-[20%]">
                Rate
              </th>
              <th className="py-2 px-3 text-right font-semibold text-white rounded-tr w-[20%]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr
                key={item.id}
                style={{ background: idx % 2 === 0 ? "#ffffff" : tcLight }}
              >
                <td className="py-1.5 px-3 text-[#333]">
                  {item.description || "—"}
                </td>
                <td className="py-1.5 px-2 text-right text-[#555]">
                  {item.quantity}
                </td>
                <td className="py-1.5 px-2 text-right text-[#555]">
                  {formatAmount(item.rate, invoice.currency)}
                </td>
                <td className="py-1.5 px-3 text-right text-[#222] font-medium">
                  {formatAmount(
                    calculations.rowTotals[item.id] ?? 0,
                    invoice.currency,
                  )}
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr style={{ borderTop: `2px solid ${tcMid}` }}>
              <td
                colSpan={3}
                className="py-2 px-3 text-right text-[11px] font-bold text-[#222]"
              >
                Total
              </td>
              <td className="py-2 px-3 text-right text-[12px] font-bold text-[#222]">
                {formatAmount(calculations.subtotal, invoice.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Financial Summary ─────────────────────────────────── */}
      <div className="px-8 pb-5 flex justify-end">
        <div className="w-52 mt-2">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2"
            style={{ color: tc }}
          >
            Summary
          </p>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-[#555]">
              <span>Subtotal</span>
              <span>
                {formatAmount(calculations.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-[#555]">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>
                  {formatAmount(calculations.taxAmount, invoice.currency)}
                </span>
              </div>
            )}
            {calculations.discountAmount > 0 && (
              <div className="flex justify-between text-[#555]">
                <span>
                  Discount
                  {invoice.discount.type === "percentage"
                    ? ` (${invoice.discount.value}%)`
                    : ""}
                </span>
                <span>
                  -{formatAmount(calculations.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div
              className="flex justify-between font-bold text-[13px] pt-2 mt-1 rounded px-2 py-1.5"
              style={{ background: tc, color: "#ffffff" }}
            >
              <span>Total Due</span>
              <span>
                {formatAmount(calculations.grandTotal, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notes & Terms ─────────────────────────────────────── */}
      {(invoice.notes || invoice.terms) && (
        <div
          className="mx-8 mb-6 rounded-md p-4 text-[11px] space-y-3"
          style={{ background: tcLight }}
        >
          {invoice.notes && (
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1"
                style={{ color: tc }}
              >
                Payment Instructions
              </p>
              <p className="text-[#444] whitespace-pre-line leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1"
                style={{ color: tc }}
              >
                Payment Terms
              </p>
              <p className="text-[#444] whitespace-pre-line leading-relaxed">
                {invoice.terms}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Footer strip ──────────────────────────────────────── */}
      <div
        className="px-8 py-3 text-center text-[10px] text-[#aaa] rounded-b-md"
        style={{ borderTop: `1px solid ${tcMid}` }}
      >
        Thank you for your business!
      </div>
    </div>
  );
}
