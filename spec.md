# NSS Consultancy Invoice Generator

## Current State
New project -- no existing invoice application. User currently creates invoices manually in Excel and saves as PDF.

## Requested Changes (Diff)

### Add
- Invoice creation form matching user's existing Excel invoice format
- Line items table with support for a main service row and multiple location sub-rows
- Auto-calculation of subtotal, CGST @ 9%, SGST @ 9%, round-off, and grand total
- Amount in words auto-generated from grand total
- Invoice number auto-incrementing in format NSSC/YYYY-YY/XXXX
- Download as PDF functionality matching the exact invoice layout
- Saved invoices list to view and re-download past invoices

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend
- Store invoice counter (auto-increment invoice number)
- Save invoice records (all fields: client info, line items, totals, remarks)
- Retrieve list of all saved invoices
- Retrieve single invoice by ID

### Frontend
- Invoice form with:
  - Header: NSS Consultancy branding (logo, address pre-filled)
  - Bill To section: client name, address, GSTIN, state, state code, customer ID
  - Invoice meta: invoice number (auto), invoice date, due date
  - Line items table: Particulars, HSN/SAC, sub-rows with location+date, Units, Rate, Amount
  - Totals: Sub Total, CGST 9%, SGST 9%, Round-off, Grand Total
  - Amount in words: auto-generated
  - Remarks: free text
  - Bank details: pre-filled (NSS Consultancy, HDFC Bank, A/C: 50200071101902, New Panvel & IFSC: HDFC0000256)
  - GSTIN/UIN: 27BMIPR7279D1ZJ, State Code: 27
- Print/PDF download: renders invoice in printable layout, triggers browser print to PDF
- Saved invoices page: list of past invoices with date, client, amount, re-download button
