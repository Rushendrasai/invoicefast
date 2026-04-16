import { useMemo } from "react";
import type { InvoiceCalculations, InvoiceData } from "../types/invoice";

export function useInvoiceCalculations(
  invoice: InvoiceData,
): InvoiceCalculations {
  return useMemo(() => {
    const rowTotals: Record<string, number> = {};

    for (const item of invoice.items) {
      rowTotals[item.id] = item.quantity * item.rate;
    }

    const subtotal = Object.values(rowTotals).reduce((acc, v) => acc + v, 0);

    const taxAmount = subtotal * (invoice.taxRate / 100);

    const discountAmount =
      invoice.discount.type === "percentage"
        ? subtotal * (invoice.discount.value / 100)
        : invoice.discount.value;

    const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

    return { rowTotals, subtotal, taxAmount, discountAmount, grandTotal };
  }, [invoice]);
}
