# CONTEXTO DEL PROYECTO — TattooLab

Handover date: 20 November 2026, America/Santiago.

## Objective and continuity

TattooLab is the administration system for a tattoo studio. The owner wants one place to manage clients, clinical/session records, studio operations, payments, suppliers, assets, bank statements and financial classification. The current work must be preserved. Do not replace it with a generic dashboard, discard the financial panel, or start over because the source is a large HTML file.

The working project was moved out of iCloud-synchronized Documents into a local `TattooLab-Local` folder after iCloud-only files prevented reads. This export is separate from that working copy. It is code, not a backup of the browser's current data.

## Users

- Administrator: clients, team/profile access, business configuration, finance and records.
- Assistant: allowed booking, client and operational tasks.
- Artist: relevant client/session data, professional procedure and session workflow.
- Client: personal and clinical form, consent/signature and allowed client actions; iPad form includes Spanish/English support.

These profiles currently use browser-side gates. They are not centrally authenticated accounts.

## Existing modules and evidence of status

| Module | Current source status | Important limits |
|---|---|---|
| Client registry, search and editing | Present | Browser-local records; clean export starts empty. |
| Groups/professions, agenda and birthdays | Present | Calendar snapshots and local records; no live Calendar integration verified. |
| Clinical/client forms, body map, consent/signature | Present | Generic neutral form retained; consent text is inherited source, not newly legally reviewed. |
| Artist sessions, deposits, continuation and care | Present | Existing local workflow; real communication still requires the user's sending action. |
| Products, sales and collections | Present | Local registry, no centrally synchronized inventory or payment gateway integration. |
| Finance operations and monthly summary | Present | One main Office-banking workflow is the polishing priority. |
| Bank statement reader | Present | XLSX, supported text PDFs, CSV/TXT/ASCII/TX1 formats; not a universal parser for all banks. |
| Classification and manual review | Present | Deterministic rules and prior confirmed ledger matches; not an OpenAI API integration. |
| Categories and subcategories | Present | Editable catalog, including fixed assets and recording/photography. |
| Supplier invoices and provider memory | Present | PDF text extraction, browser OCR, parsed fields and line items; OCR can miss information. |
| Click supplier to see purchased products | Added and checked | Shows per-document lines and unit prices; reads original if no lines are saved and attachment is accessible. |
| Dates at start of uncertain bank transactions | Added and checked | DD/MM/YYYY in queue and review dialog. |
| Statement history | Added and checked | Chronological sorting, account filter, state, resume/pause, originals and download. |
| Delete a statement | Added and checked | Explicit irreversible warning; retain ledger by default or remove only exclusive ledger rows. |
| Duplicate statement prevention | Added and checked | SHA-256 binary check, same-account transaction comparison, unique hash index for newly hashed files. |
| Annual overview and pie chart | Annual operations aggregation exists | Requested summary/pie presentation is not verified complete; inspect before promising it. |
| Multiple bank accounts/entities | Requirements recorded | Full independent bank spaces/parsers not complete. Polish one account first. |
| Central backend, database, shared file storage | Missing | Hosting on Vercel alone does not supply these. |
| Complete data/attachment backup and restore | Missing | JSON export exists; current import merges new clients only. |

“Present” means the implementation exists in the source. This handover does not certify every clinical/profile flow or every bank format by end-to-end browser testing.

## Recent interface decisions that must be preserved

- Keep the current financial sidebar: operations, summary/movements, statement processor, categories, suppliers and settings.
- The statement process remains Load → Classify → Review uncertainties → Confirm import.
- Classify is an explicit user action. Uncertain items remain available for manual review; manual choices feed later classification through ledger history.
- Show dates first in the review queue and Resolve dialog.
- In statement history the FIRST column is Archive/account with month and year emphasized (for example March 2026). The SECOND is the actual transaction date range. Counts, state and actions follow.
- Existing supplier names are clickable for THIS invoice's detail, quantities, unit prices and line totals. Missing data must be stated rather than invented.
- New statement files are saved before parsing, including when parsing fails. PDF originals can be previewed; spreadsheet originals can be downloaded to open in Excel.
- “Continue later” preserves the draft. History can resume it.
- The requested “Attach original” button was subsequently removed. Do not restore it automatically. The unused helper code remains for compatibility; it is not shown in the history.
- Deletion is user-confirmed. Default is deleting the history/file while preserving financial movements, useful when cleaning duplicate archive entries.
- Optional movement removal must preserve movements shared by other retained statements. Deletion markers stop older ledger entries from recreating removed history rows.
- Exact copies are rejected even if renamed. Parsed copies with the same account and transaction signature are also rejected. Previously stored duplicates are not automatically deleted.

## Business rules and catalog context

- Existing design uses CLP and Chilean date/business conventions; use America/Santiago consistently.
- Session rate commonly CLP 60,000/hour and typical minimum six hours. Project deposit commonly CLP 60,000; preserve the existing allocation/remaining-deposit workflow rather than charging it again at each continuation.
- Fixed asset category: computers, TVs, furniture, air conditioning, bins, electric/hydraulic tattoo chairs, work tables, iPad, iPhone and recording/photography equipment.
- Recording and photography groups cameras, sound/microphones and lighting; preserve the current configurable hierarchy rather than resolving older spelling variations by deleting categories.
- Supplier identity memory can fill missing RUT, business activity, address, commune, city, region and classification from earlier documents. Never copy invoice-specific dates, folios or totals from a different month.
- Buying foreign currency is distinct from the final supplier invoice. The owner also administers Escuela de Tatuaje SpA; separate legal-entity ownership from the bank account used. This multi-entity accounting is a future modeling task, not completed automation.
- Required later bank spaces include Banco de Chile, personal BancoEstado, personal/commercial Santander and Santander Office Banking. Actual account numbers and entity identifiers are intentionally not distributed in this code handover.

## Design

Preserve the established visual system. Finance uses a dark navy sidebar and primary buttons (#1c1b2d / #1c1b2d family), warm gray background (#efeee8), white bordered rounded cards, muted supporting text and compact tables. Green indicates income/completion, red expenses/destructive actions, amber review, blue informational states. Finance uses Inter/system sans fallbacks. Embedded client/session forms also use DM Sans and Manrope with olive/lime accents. Google Fonts may load externally.

Main components: persistent role/client header, sidebar navigation, summary cards, tables, upload/drop areas, step indicator, status badges and shared modal dialogs. Desktop is the main financial workflow; client forms support iPad. Do not apply a new visual theme during deployment.

## Technology and architecture

See `docs/ARCHITECTURE.md`. The application uses plain HTML, CSS and JavaScript with embedded PDF.js, its worker, JSZip, and dynamically loaded Tesseract.js 6.0.1 for photo OCR. It is not React, Next.js or a Vercel server application. No OpenAI API key or cloud LLM integration is configured.

## Deployment export adaptations

The code export removes one-off historical client imports/corrections and hard-coded financial workbook transactions, removes a historical single-client Calendar simulation from the form, and reuses the full neutral generic form for new clients. The integrated finance processor and current features remain. The obsolete link to a historical mock bank processor is omitted. This is not a data migration, and the local working system was not changed by these export adaptations.

## Current checks

During recent local development, JavaScript syntax and isolated logic checks covered invoice-detail rendering, missing/zero values, safe text, statement file retention, drafts, resumption, partial import deduplication, same-file and transaction-signature detection, archive deletion, exclusive/shared ledger behavior, failed saves and interrupted-deletion recovery. The export includes a reproducible syntax/configuration check. A live Vercel deployment and full browser regression are still required.

## Priorities for the next developer

1. Run this exact export locally and on a restricted Vercel preview. Check all existing navigation and the current finance workflow with invented files.
2. Preserve and separately back up the current local registry, statement database and supplier attachment folder before changing browsers, URLs, origins or paths.
3. Implement complete, versioned export/import of localStorage records AND IndexedDB bank files/drafts AND supplier attachment metadata/files. The existing import button is not a full restore.
4. Add server-side authentication/authorization, a shared database and private object storage if this becomes a multi-user hosted system. Do not embed service secrets in static HTML.
5. Polish one bank format/account first, including parser fixtures, balances, totals, ambiguous classification and responsive performance.
6. Complete annual summary/pie charts and supplier extraction accuracy without losing current ledger/history features.
7. Add independent bank/legal-entity spaces after the first account works reliably.
8. Gradually separate styles, domain logic, storage and document readers with regression checks. Avoid a framework rewrite as a deployment prerequisite.

## Copyable instruction for the next chat

> Continue the EXISTING TattooLab project from `public/index.html`; do not redesign or recreate it. Read CONTEXTO_DEL_PROYECTO.md and docs/ARCHITECTURE.md first. The client, clinical, artist, supplier and finance modules must all remain. Preserve statement originals, chronological history, manual review with dates, duplicate prevention, deletion warnings, and the month/account-first column order. Treat browser records and files as private data separate from source. Vercel hosting does not migrate them or implement shared authentication. Work from this handover, verify the existing behavior, and implement the remaining priorities incrementally.
