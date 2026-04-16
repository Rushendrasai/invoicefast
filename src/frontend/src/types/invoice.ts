export type DiscountType = "fixed" | "percentage";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface SenderDetails {
  name: string;
  email: string;
  address: string;
  taxId: string;
  logo: string | null; // base64 data URL
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
}

export interface Discount {
  type: DiscountType;
  value: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  createdDate: string;
  dueDate: string;
  sender: SenderDetails;
  client: ClientDetails;
  items: LineItem[];
  taxRate: number;
  discount: Discount;
  notes: string;
  terms: string;
  themeColor: string;
  currency: string;
}

export interface InvoiceCalculations {
  rowTotals: Record<string, number>;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
}
