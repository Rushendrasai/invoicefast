import { useCallback, useEffect, useReducer } from "react";
import type {
  ClientDetails,
  Discount,
  InvoiceData,
  LineItem,
  SenderDetails,
} from "../types/invoice";
import { useLocalStorage } from "./useLocalStorage";

const SENDER_STORAGE_KEY = "invoicefast_sender";

const DEFAULT_SENDER: SenderDetails = {
  name: "",
  email: "",
  address: "",
  taxId: "",
  logo: null,
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function generateInvoiceNumber(): string {
  const stored = localStorage.getItem("invoicefast_inv_counter");
  const count = stored ? Number.parseInt(stored, 10) + 1 : 1;
  localStorage.setItem("invoicefast_inv_counter", String(count));
  return `INV-${String(count).padStart(3, "0")}`;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function dueDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

function makeDefaultInvoice(sender: SenderDetails): InvoiceData {
  return {
    invoiceNumber: generateInvoiceNumber(),
    createdDate: todayStr(),
    dueDate: dueDateStr(),
    sender,
    client: { name: "", email: "", address: "" },
    items: [{ id: generateId(), description: "", quantity: 1, rate: 0 }],
    taxRate: 0,
    discount: { type: "fixed", value: 0 },
    notes: "Payment due within 30 days.",
    terms: "",
    themeColor: "#4f46e5",
    currency: "USD",
  };
}

type Action =
  | { type: "SET_INVOICE_NUMBER"; payload: string }
  | { type: "SET_CREATED_DATE"; payload: string }
  | { type: "SET_DUE_DATE"; payload: string }
  | { type: "UPDATE_SENDER"; payload: Partial<SenderDetails> }
  | { type: "UPDATE_CLIENT"; payload: Partial<ClientDetails> }
  | { type: "ADD_ITEM" }
  | {
      type: "UPDATE_ITEM";
      payload: { id: string; field: keyof LineItem; value: string | number };
    }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "SET_TAX_RATE"; payload: number }
  | { type: "SET_DISCOUNT"; payload: Partial<Discount> }
  | { type: "SET_NOTES"; payload: string }
  | { type: "SET_TERMS"; payload: string }
  | { type: "SET_THEME_COLOR"; payload: string }
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "RESET"; payload: SenderDetails };

function reducer(state: InvoiceData, action: Action): InvoiceData {
  switch (action.type) {
    case "SET_INVOICE_NUMBER":
      return { ...state, invoiceNumber: action.payload };
    case "SET_CREATED_DATE":
      return { ...state, createdDate: action.payload };
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.payload };
    case "UPDATE_SENDER":
      return { ...state, sender: { ...state.sender, ...action.payload } };
    case "UPDATE_CLIENT":
      return { ...state, client: { ...state.client, ...action.payload } };
    case "ADD_ITEM":
      return {
        ...state,
        items: [
          ...state.items,
          { id: generateId(), description: "", quantity: 1, rate: 0 },
        ],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, [action.payload.field]: action.payload.value }
            : item,
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "SET_TAX_RATE":
      return { ...state, taxRate: action.payload };
    case "SET_DISCOUNT":
      return { ...state, discount: { ...state.discount, ...action.payload } };
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "SET_TERMS":
      return { ...state, terms: action.payload };
    case "SET_THEME_COLOR":
      return { ...state, themeColor: action.payload };
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "RESET":
      return makeDefaultInvoice(action.payload);
    default:
      return state;
  }
}

export function useInvoiceState() {
  const [persistedSender, setPersistedSender] = useLocalStorage<SenderDetails>(
    SENDER_STORAGE_KEY,
    DEFAULT_SENDER,
  );

  const [invoice, dispatch] = useReducer(
    reducer,
    makeDefaultInvoice(persistedSender),
  );

  // Persist sender changes to localStorage whenever sender changes
  useEffect(() => {
    setPersistedSender(invoice.sender);
  }, [invoice.sender, setPersistedSender]);

  const updateSender = useCallback(
    (patch: Partial<SenderDetails>) =>
      dispatch({ type: "UPDATE_SENDER", payload: patch }),
    [],
  );
  const updateClient = useCallback(
    (patch: Partial<ClientDetails>) =>
      dispatch({ type: "UPDATE_CLIENT", payload: patch }),
    [],
  );
  const setInvoiceNumber = useCallback(
    (v: string) => dispatch({ type: "SET_INVOICE_NUMBER", payload: v }),
    [],
  );
  const setCreatedDate = useCallback(
    (v: string) => dispatch({ type: "SET_CREATED_DATE", payload: v }),
    [],
  );
  const setDueDate = useCallback(
    (v: string) => dispatch({ type: "SET_DUE_DATE", payload: v }),
    [],
  );
  const addItem = useCallback(() => dispatch({ type: "ADD_ITEM" }), []);
  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) =>
      dispatch({ type: "UPDATE_ITEM", payload: { id, field, value } }),
    [],
  );
  const deleteItem = useCallback(
    (id: string) => dispatch({ type: "DELETE_ITEM", payload: id }),
    [],
  );
  const setTaxRate = useCallback(
    (v: number) => dispatch({ type: "SET_TAX_RATE", payload: v }),
    [],
  );
  const setDiscount = useCallback(
    (patch: Partial<Discount>) =>
      dispatch({ type: "SET_DISCOUNT", payload: patch }),
    [],
  );
  const setNotes = useCallback(
    (v: string) => dispatch({ type: "SET_NOTES", payload: v }),
    [],
  );
  const setTerms = useCallback(
    (v: string) => dispatch({ type: "SET_TERMS", payload: v }),
    [],
  );
  const setThemeColor = useCallback(
    (v: string) => dispatch({ type: "SET_THEME_COLOR", payload: v }),
    [],
  );
  const setCurrency = useCallback(
    (v: string) => dispatch({ type: "SET_CURRENCY", payload: v }),
    [],
  );
  const resetInvoice = useCallback(
    () => dispatch({ type: "RESET", payload: persistedSender }),
    [persistedSender],
  );

  return {
    invoice,
    updateSender,
    updateClient,
    setInvoiceNumber,
    setCreatedDate,
    setDueDate,
    addItem,
    updateItem,
    deleteItem,
    setTaxRate,
    setDiscount,
    setNotes,
    setTerms,
    setThemeColor,
    setCurrency,
    resetInvoice,
  };
}
