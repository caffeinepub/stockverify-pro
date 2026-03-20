import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { numberToWords } from "@/utils/numberToWords";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Plus,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ========== TYPES ==========

interface SubRow {
  id: string;
  location: string;
  units: string;
  rate: string;
}

interface ServiceGroup {
  id: string;
  particulars: string;
  hsnSac: string;
  subRows: SubRow[];
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerId: string;
  clientName: string;
  clientAddress: string;
  clientGstin: string;
  clientState: string;
  clientStateCode: string;
  serviceGroups: ServiceGroup[];
  remarks: string;
  createdAt: string;
}

// ========== CONSTANTS ==========

const COMPANY = {
  name: "NSS Consultancy",
  address:
    "Hari om nagar, C-204, Nr. Birmole Hospital, Panvel-Raigad, Pin-410206",
  gstin: "27BMIPR7279D1ZJ",
  stateCode: "27",
  bank: "HDFC Bank",
  accountNo: "50200071101902",
  ifsc: "HDFC0000256",
  branch: "New Panvel",
};

const LS_KEY = "nss_invoices";
const LS_COUNTER_KEY = "nss_invoice_counter";

// ========== HELPERS ==========

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function getNextInvoiceNumber(): string {
  const now = new Date();
  const yr = now.getFullYear();
  const nextYr = (yr + 1).toString().slice(2);
  const yearStr = `${yr}-${nextYr}`;
  const counter =
    Number.parseInt(localStorage.getItem(LS_COUNTER_KEY) || "0", 10) + 1;
  return `NSSC/${yearStr}/${String(counter).padStart(4, "0")}`;
}

function incrementCounter() {
  const counter =
    Number.parseInt(localStorage.getItem(LS_COUNTER_KEY) || "0", 10) + 1;
  localStorage.setItem(LS_COUNTER_KEY, String(counter));
}

function loadInvoices(): InvoiceData[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveInvoices(invoices: InvoiceData[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(invoices));
}

function calcTotals(groups: ServiceGroup[]) {
  let subTotal = 0;
  for (const g of groups) {
    for (const r of g.subRows) {
      subTotal +=
        (Number.parseFloat(r.units) || 0) * (Number.parseFloat(r.rate) || 0);
    }
  }
  const cgst = subTotal * 0.09;
  const sgst = subTotal * 0.09;
  const preTax = subTotal + cgst + sgst;
  const grandTotal = Math.round(preTax);
  const roundOff = grandTotal - preTax;
  return { subTotal, cgst, sgst, roundOff, grandTotal };
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function blankGroup(): ServiceGroup {
  return {
    id: genId(),
    particulars: "Professional Audit Services",
    hsnSac: "998311",
    subRows: [{ id: genId(), location: "", units: "", rate: "" }],
  };
}

function blankForm(): Omit<InvoiceData, "id" | "createdAt"> {
  return {
    invoiceNumber: getNextInvoiceNumber(),
    invoiceDate: new Date().toISOString().slice(0, 10),
    customerId: "",
    clientName: "",
    clientAddress: "",
    clientGstin: "",
    clientState: "Maharashtra",
    clientStateCode: "27",
    serviceGroups: [blankGroup()],
    remarks: "",
  };
}

// ========== PRINT INVOICE ==========

function PrintInvoice({ data }: { data: InvoiceData }) {
  const totals = calcTotals(data.serviceGroups);
  let srCounter = 0;

  return (
    <div id="print-invoice" className="print-invoice">
      {/* HEADER */}
      <table
        className="header-table"
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0" }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "120px",
                verticalAlign: "middle",
                padding: "8px",
              }}
            >
              <img
                src="/assets/uploads/NSS_rgb-1.png"
                alt="NSS Logo"
                style={{ height: "60px", width: "auto" }}
              />
            </td>
            <td
              style={{
                verticalAlign: "middle",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  color: "#1a2a6c",
                }}
              >
                {COMPANY.name}
              </div>
              <div
                style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}
              >
                {COMPANY.address}
              </div>
              <div
                style={{ fontSize: "11px", color: "#444", marginTop: "1px" }}
              >
                GSTIN/UIN: {COMPANY.gstin} | State Code: {COMPANY.stateCode}
              </div>
            </td>
            <td
              style={{
                width: "130px",
                verticalAlign: "top",
                padding: "8px",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  border: "1px solid #1a2a6c",
                  padding: "3px 6px",
                  color: "#1a2a6c",
                  fontWeight: "600",
                }}
              >
                Original For Recipient
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          textAlign: "center",
          fontSize: "15px",
          fontWeight: "800",
          backgroundColor: "#1a2a6c",
          color: "white",
          padding: "5px 0",
          letterSpacing: "2px",
        }}
      >
        TAX INVOICE
      </div>

      {/* BILL TO + INVOICE DETAILS */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
          marginTop: "0",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "60%",
                verticalAlign: "top",
                padding: "8px",
                borderRight: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  marginBottom: "4px",
                  color: "#1a2a6c",
                }}
              >
                Bill To:
              </div>
              <div style={{ fontSize: "12px", fontWeight: "800" }}>
                {data.clientName}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  whiteSpace: "pre-wrap",
                  marginTop: "2px",
                  color: "#333",
                }}
              >
                {data.clientAddress}
              </div>
              <div
                style={{ fontSize: "11px", marginTop: "4px", color: "#333" }}
              >
                GSTIN No: <strong>{data.clientGstin}</strong>
              </div>
              <div style={{ fontSize: "11px", color: "#333" }}>
                State: <strong>{data.clientState}</strong> | State Code:{" "}
                <strong>{data.clientStateCode}</strong>
              </div>
            </td>
            <td style={{ verticalAlign: "top", padding: "8px" }}>
              <table style={{ width: "100%" }}>
                <tbody>
                  {[
                    ["Invoice No.", data.invoiceNumber],
                    [
                      "Invoice Date",
                      new Date(data.invoiceDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }),
                    ],
                    ["Customer ID", data.customerId],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td
                        style={{
                          fontSize: "11px",
                          color: "#555",
                          paddingBottom: "3px",
                          width: "90px",
                        }}
                      >
                        {k}
                      </td>
                      <td
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          paddingBottom: "3px",
                        }}
                      >
                        : {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* LINE ITEMS TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
          marginTop: "0",
          borderTop: "none",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#1a2a6c", color: "white" }}>
            <th
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                borderRight: "1px solid #3a4a8c",
                width: "40px",
              }}
            >
              Sr.
            </th>
            <th
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "left",
                borderRight: "1px solid #3a4a8c",
              }}
            >
              Particulars
            </th>
            <th
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                borderRight: "1px solid #3a4a8c",
                width: "80px",
              }}
            >
              HSN/SAC
            </th>
            <th
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "center",
                borderRight: "1px solid #3a4a8c",
                width: "60px",
              }}
            >
              Units
            </th>
            <th
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "right",
                borderRight: "1px solid #3a4a8c",
                width: "80px",
              }}
            >
              Rate (Rs.)
            </th>
            <th
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                textAlign: "right",
                width: "90px",
              }}
            >
              Amount (Rs.)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.serviceGroups.map((group) => (
            <>
              <tr key={group.id} style={{ backgroundColor: "#f0f4ff" }}>
                <td
                  colSpan={6}
                  style={{
                    padding: "5px 8px",
                    fontSize: "12px",
                    fontWeight: "800",
                    color: "#1a2a6c",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {group.particulars}
                </td>
              </tr>
              {group.subRows.map((row) => {
                srCounter += 1;
                const amt =
                  (Number.parseFloat(row.units) || 0) *
                  (Number.parseFloat(row.rate) || 0);
                return (
                  <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        textAlign: "center",
                        borderRight: "1px solid #eee",
                      }}
                    >
                      {srCounter}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        paddingLeft: "20px",
                        borderRight: "1px solid #eee",
                      }}
                    >
                      {row.location}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        textAlign: "center",
                        borderRight: "1px solid #eee",
                      }}
                    >
                      {group.hsnSac}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        textAlign: "center",
                        borderRight: "1px solid #eee",
                      }}
                    >
                      {row.units}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        textAlign: "right",
                        borderRight: "1px solid #eee",
                      }}
                    >
                      {formatCurrency(Number.parseFloat(row.rate) || 0)}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(amt)}
                    </td>
                  </tr>
                );
              })}
            </>
          ))}
          {/* Filler row */}
          <tr>
            <td colSpan={6} style={{ height: "20px" }} />
          </tr>
        </tbody>
      </table>

      {/* AMOUNT IN WORDS + TOTALS */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
          borderTop: "none",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "60%",
                verticalAlign: "top",
                padding: "8px",
                borderRight: "1px solid #ccc",
              }}
            >
              <div
                style={{ fontSize: "11px", color: "#555", marginBottom: "3px" }}
              >
                Amount Chargeable (in words):
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  fontStyle: "italic",
                  color: "#1a2a6c",
                }}
              >
                {numberToWords(totals.grandTotal)}
              </div>
            </td>
            <td style={{ verticalAlign: "top", padding: "8px" }}>
              <table style={{ width: "100%" }}>
                <tbody>
                  {[
                    ["Sub Total", totals.subTotal],
                    ["CGST @ 9%", totals.cgst],
                    ["SGST @ 9%", totals.sgst],
                    ["Round Off", totals.roundOff],
                  ].map(([k, v]) => (
                    <tr key={k as string}>
                      <td
                        style={{
                          fontSize: "11px",
                          color: "#555",
                          paddingBottom: "2px",
                        }}
                      >
                        {k as string}
                      </td>
                      <td
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          textAlign: "right",
                          paddingBottom: "2px",
                        }}
                      >
                        {formatCurrency(v as number)}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid #1a2a6c" }}>
                    <td
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#1a2a6c",
                        paddingTop: "4px",
                      }}
                    >
                      Grand Total
                    </td>
                    <td
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#1a2a6c",
                        textAlign: "right",
                        paddingTop: "4px",
                      }}
                    >
                      Rs. {formatCurrency(totals.grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* REMARKS + BANK DETAILS */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
          borderTop: "none",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "50%",
                verticalAlign: "top",
                padding: "8px",
                borderRight: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  marginBottom: "4px",
                  color: "#1a2a6c",
                }}
              >
                Remarks:
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#333",
                  whiteSpace: "pre-wrap",
                }}
              >
                {data.remarks || "—"}
              </div>
            </td>
            <td style={{ verticalAlign: "top", padding: "8px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  marginBottom: "4px",
                  color: "#1a2a6c",
                }}
              >
                Bank Details:
              </div>
              <div style={{ fontSize: "11px", color: "#333" }}>
                Bank: <strong>{COMPANY.bank}</strong>
              </div>
              <div style={{ fontSize: "11px", color: "#333" }}>
                A/C No: <strong>{COMPANY.accountNo}</strong>
              </div>
              <div style={{ fontSize: "11px", color: "#333" }}>
                Branch: <strong>{COMPANY.branch}</strong>
              </div>
              <div style={{ fontSize: "11px", color: "#333" }}>
                IFSC: <strong>{COMPANY.ifsc}</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
          borderTop: "none",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                verticalAlign: "top",
                padding: "8px",
                borderRight: "1px solid #ccc",
                width: "60%",
              }}
            >
              <div style={{ fontSize: "11px", color: "#333" }}>
                GSTIN/UIN: <strong>{COMPANY.gstin}</strong>
              </div>
              <div style={{ fontSize: "11px", color: "#333" }}>
                State: Maharashtra | State Code: {COMPANY.stateCode}
              </div>
            </td>
            <td
              style={{
                verticalAlign: "top",
                padding: "8px",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#1a2a6c",
                  marginBottom: "30px",
                }}
              >
                For {COMPANY.name}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#555",
                  borderTop: "1px solid #ccc",
                  paddingTop: "4px",
                }}
              >
                Authorised Signatory
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          textAlign: "center",
          fontSize: "10px",
          color: "#888",
          marginTop: "8px",
          fontStyle: "italic",
        }}
      >
        This is a computer generated invoice.
      </div>
    </div>
  );
}

// ========== INVOICE FORM ==========

function InvoiceForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] =
    useState<Omit<InvoiceData, "id" | "createdAt">>(blankForm);
  const [previewData, setPreviewData] = useState<InvoiceData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const totals = calcTotals(form.serviceGroups);

  const updateField = useCallback(
    <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
      setForm((p) => ({ ...p, [field]: value }));
    },
    [],
  );

  const updateGroup = (
    groupId: string,
    field: keyof ServiceGroup,
    value: string,
  ) => {
    setForm((p) => ({
      ...p,
      serviceGroups: p.serviceGroups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g,
      ),
    }));
  };

  const addGroup = () => {
    setForm((p) => ({
      ...p,
      serviceGroups: [...p.serviceGroups, blankGroup()],
    }));
  };

  const removeGroup = (groupId: string) => {
    setForm((p) => ({
      ...p,
      serviceGroups: p.serviceGroups.filter((g) => g.id !== groupId),
    }));
  };

  const addSubRow = (groupId: string) => {
    setForm((p) => ({
      ...p,
      serviceGroups: p.serviceGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              subRows: [
                ...g.subRows,
                { id: genId(), location: "", units: "", rate: "" },
              ],
            }
          : g,
      ),
    }));
  };

  const removeSubRow = (groupId: string, rowId: string) => {
    setForm((p) => ({
      ...p,
      serviceGroups: p.serviceGroups.map((g) =>
        g.id === groupId
          ? { ...g, subRows: g.subRows.filter((r) => r.id !== rowId) }
          : g,
      ),
    }));
  };

  const updateSubRow = (
    groupId: string,
    rowId: string,
    field: keyof SubRow,
    value: string,
  ) => {
    setForm((p) => ({
      ...p,
      serviceGroups: p.serviceGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              subRows: g.subRows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r,
              ),
            }
          : g,
      ),
    }));
  };

  const buildInvoice = (): InvoiceData => ({
    ...form,
    id: genId(),
    createdAt: new Date().toISOString(),
  });

  const handleSave = () => {
    if (!form.clientName.trim()) {
      toast.error("Client name is required.");
      return;
    }
    const invoice = buildInvoice();
    const existing = loadInvoices();
    saveInvoices([invoice, ...existing]);
    incrementCounter();
    toast.success("Invoice saved successfully!");
    setForm(blankForm());
    onSaved();
  };

  const handleDownload = () => {
    if (!form.clientName.trim()) {
      toast.error("Client name is required.");
      return;
    }
    const invoice = buildInvoice();
    setPreviewData(invoice);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleSaveAndDownload = () => {
    if (!form.clientName.trim()) {
      toast.error("Client name is required.");
      return;
    }
    const invoice = buildInvoice();
    const existing = loadInvoices();
    saveInvoices([invoice, ...existing]);
    incrementCounter();
    setPreviewData(invoice);
    toast.success("Invoice saved!");
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <>
      {/* Hidden print target */}
      {previewData && (
        <div ref={printRef} className="print-only">
          <PrintInvoice data={previewData} />
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6 no-print">
        {/* Invoice Details Row */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-display font-bold text-lg text-navy-deep mb-5">
            Invoice Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">
                Invoice Number
              </Label>
              <Input
                data-ocid="invoice.number.input"
                value={form.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">
                Invoice Date
              </Label>
              <Input
                data-ocid="invoice.date.input"
                type="date"
                value={form.invoiceDate}
                onChange={(e) => updateField("invoiceDate", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-bold text-slate-600">
                Customer ID
              </Label>
              <Input
                data-ocid="invoice.customer_id.input"
                value={form.customerId}
                onChange={(e) => updateField("customerId", e.target.value)}
                placeholder="e.g. CUST-001"
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-display font-bold text-lg text-navy-deep mb-5">
            Bill To (Client Details)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">
                Client Name *
              </Label>
              <Input
                data-ocid="invoice.client_name.input"
                value={form.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Company / Individual Name"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">
                GSTIN No.
              </Label>
              <Input
                data-ocid="invoice.client_gstin.input"
                value={form.clientGstin}
                onChange={(e) => updateField("clientGstin", e.target.value)}
                placeholder="e.g. 29ABCDE1234F1Z5"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold text-slate-600">
                Client Address
              </Label>
              <Textarea
                data-ocid="invoice.client_address.textarea"
                value={form.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                placeholder="Full address"
                rows={2}
                className="text-sm resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">State</Label>
              <Input
                data-ocid="invoice.client_state.input"
                value={form.clientState}
                onChange={(e) => updateField("clientState", e.target.value)}
                placeholder="e.g. Maharashtra"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">
                State Code
              </Label>
              <Input
                data-ocid="invoice.client_state_code.input"
                value={form.clientStateCode}
                onChange={(e) => updateField("clientStateCode", e.target.value)}
                placeholder="e.g. 27"
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Services / Line Items */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-lg text-navy-deep">
              Services &amp; Line Items
            </h3>
            <Button
              type="button"
              data-ocid="invoice.add_group.button"
              variant="outline"
              size="sm"
              onClick={addGroup}
              className="gap-1.5 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Service
            </Button>
          </div>

          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {form.serviceGroups.map((group, gi) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  {/* Service header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Service {gi + 1}
                    </Badge>
                    <Input
                      value={group.particulars}
                      onChange={(e) =>
                        updateGroup(group.id, "particulars", e.target.value)
                      }
                      placeholder="Service / Particulars"
                      className="h-8 text-sm flex-1 font-semibold"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={group.hsnSac}
                        onChange={(e) =>
                          updateGroup(group.id, "hsnSac", e.target.value)
                        }
                        placeholder="HSN/SAC"
                        className="h-8 text-sm w-24"
                      />
                      {form.serviceGroups.length > 1 && (
                        <Button
                          type="button"
                          data-ocid={`invoice.remove_group.delete_button.${gi + 1}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGroup(group.id)}
                          className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Sub rows table */}
                  <div className="p-4">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      <div className="col-span-1">#</div>
                      <div className="col-span-5">Location / Date</div>
                      <div className="col-span-2">Units</div>
                      <div className="col-span-2">Rate (₹)</div>
                      <div className="col-span-1 text-right">Amount</div>
                      <div className="col-span-1" />
                    </div>

                    <AnimatePresence initial={false}>
                      {group.subRows.map((row, ri) => {
                        const amt =
                          (Number.parseFloat(row.units) || 0) *
                          (Number.parseFloat(row.rate) || 0);
                        return (
                          <motion.div
                            key={row.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            className="grid grid-cols-12 gap-2 mb-2 items-center"
                          >
                            <div className="col-span-1 text-xs text-slate-400 font-bold text-center">
                              {ri + 1}
                            </div>
                            <div className="col-span-5">
                              <Input
                                value={row.location}
                                onChange={(e) =>
                                  updateSubRow(
                                    group.id,
                                    row.id,
                                    "location",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. Colaba, Mumbai (02-01-2025)"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={row.units}
                                onChange={(e) =>
                                  updateSubRow(
                                    group.id,
                                    row.id,
                                    "units",
                                    e.target.value,
                                  )
                                }
                                placeholder="0"
                                className="h-8 text-xs"
                                min="0"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={row.rate}
                                onChange={(e) =>
                                  updateSubRow(
                                    group.id,
                                    row.id,
                                    "rate",
                                    e.target.value,
                                  )
                                }
                                placeholder="0.00"
                                className="h-8 text-xs"
                                min="0"
                              />
                            </div>
                            <div className="col-span-1 text-xs font-bold text-right text-slate-700">
                              {amt > 0 ? formatCurrency(amt) : "—"}
                            </div>
                            <div className="col-span-1 flex justify-end">
                              {group.subRows.length > 1 && (
                                <button
                                  type="button"
                                  data-ocid={`invoice.remove_row.delete_button.${ri + 1}`}
                                  onClick={() => removeSubRow(group.id, row.id)}
                                  className="w-6 h-6 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    <Button
                      type="button"
                      data-ocid={`invoice.add_row.button.${gi + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => addSubRow(group.id)}
                      className="mt-1 gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="w-3 h-3" />
                      Add Location Row
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Totals Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">
                Remarks
              </Label>
              <Textarea
                data-ocid="invoice.remarks.textarea"
                value={form.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
                placeholder="Any additional notes or remarks..."
                rows={3}
                className="text-sm resize-none"
              />
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-700 mb-3">
                Invoice Summary
              </h4>
              {[
                ["Sub Total", totals.subTotal],
                ["CGST @ 9%", totals.cgst],
                ["SGST @ 9%", totals.sgst],
                ["Round Off", totals.roundOff],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-sm">
                  <span className="text-slate-600">{k as string}</span>
                  <span className="font-semibold text-slate-800">
                    ₹ {formatCurrency(v as number)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold text-navy-deep">Grand Total</span>
                <span className="font-bold text-lg text-navy-deep">
                  ₹ {formatCurrency(totals.grandTotal)}
                </span>
              </div>
              <div className="text-xs text-slate-500 italic mt-1">
                {numberToWords(totals.grandTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end pb-8">
          <Button
            type="button"
            data-ocid="invoice.save.save_button"
            variant="outline"
            onClick={handleSave}
            className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Save className="w-4 h-4" />
            Save Invoice
          </Button>
          <Button
            type="button"
            data-ocid="invoice.download.primary_button"
            onClick={handleDownload}
            className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Eye className="w-4 h-4" />
            Preview &amp; Print
          </Button>
          <Button
            type="button"
            data-ocid="invoice.save_download.primary_button"
            onClick={handleSaveAndDownload}
            className="gap-2"
            style={{ backgroundColor: "oklch(0.28 0.08 252)", color: "white" }}
          >
            <Download className="w-4 h-4" />
            Save &amp; Download PDF
          </Button>
        </div>
      </div>
    </>
  );
}

// ========== SAVED INVOICES ==========

function SavedInvoices({ onBack }: { onBack: () => void }) {
  const [invoices, setInvoices] = useState<InvoiceData[]>(loadInvoices);
  const [viewing, setViewing] = useState<InvoiceData | null>(null);

  const handleDelete = (id: string) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    saveInvoices(updated);
    setInvoices(updated);
    toast.success("Invoice deleted.");
  };

  const handlePrint = (inv: InvoiceData) => {
    setViewing(inv);
    setTimeout(() => window.print(), 200);
  };

  return (
    <>
      {viewing && (
        <div className="print-only">
          <PrintInvoice data={viewing} />
        </div>
      )}

      <div className="max-w-5xl mx-auto no-print">
        <div className="flex items-center gap-3 mb-6">
          <Button
            data-ocid="saved_invoices.back.button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h2 className="font-display font-bold text-xl text-navy-deep">
            Saved Invoices
          </h2>
          <Badge variant="secondary">{invoices.length}</Badge>
        </div>

        {invoices.length === 0 ? (
          <div
            data-ocid="saved_invoices.empty_state"
            className="text-center py-20 text-slate-400"
          >
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No saved invoices yet.</p>
            <p className="text-sm mt-1">
              Create and save an invoice to see it here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Invoice #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => {
                  const totals = calcTotals(inv.serviceGroups);
                  return (
                    <tr
                      key={inv.id}
                      data-ocid={`saved_invoices.item.${i + 1}`}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-blue-700">
                          {inv.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(inv.invoiceDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-slate-800">
                          {inv.clientName}
                        </div>
                        {inv.clientGstin && (
                          <div className="text-xs text-slate-400">
                            {inv.clientGstin}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-navy-deep">
                          ₹ {formatCurrency(totals.grandTotal)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            data-ocid={`saved_invoices.print.button.${i + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint(inv)}
                            className="h-8 gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </Button>
                          <Button
                            data-ocid={`saved_invoices.delete.delete_button.${i + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(inv.id)}
                            className="h-8 gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ========== MAIN COMPONENT ==========

export type InvoiceView = "form" | "saved";

export default function InvoiceGenerator() {
  const [view, setView] = useState<InvoiceView>("form");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/assets/uploads/NSS_rgb-1.png"
                alt="NSS"
                className="h-8 w-auto"
              />
              <div>
                <div className="font-display font-bold text-navy-deep text-sm leading-tight">
                  NSS Consultancy
                </div>
                <div className="text-xs text-slate-500">Invoice Generator</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-ocid="invoice_app.new_invoice.tab"
                variant={view === "form" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("form")}
                className="gap-1.5 text-xs"
                style={
                  view === "form"
                    ? {
                        backgroundColor: "oklch(0.28 0.08 252)",
                        color: "white",
                      }
                    : {}
                }
              >
                <Plus className="w-3.5 h-3.5" />
                New Invoice
              </Button>
              <Button
                data-ocid="invoice_app.saved.tab"
                variant={view === "saved" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("saved")}
                className="gap-1.5 text-xs"
                style={
                  view === "saved"
                    ? {
                        backgroundColor: "oklch(0.28 0.08 252)",
                        color: "white",
                      }
                    : {}
                }
              >
                <FileText className="w-3.5 h-3.5" />
                Saved Invoices
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5 no-print">
                <h1 className="font-display font-bold text-2xl text-navy-deep">
                  Create New Invoice
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Fill in the details below to generate a GST-compliant tax
                  invoice.
                </p>
              </div>
              <InvoiceForm onSaved={() => setView("saved")} />
            </motion.div>
          ) : (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SavedInvoices onBack={() => setView("form")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
