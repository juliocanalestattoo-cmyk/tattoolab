# Architecture — current implementation

## Layout

```text
public/
  index.html                 # Authoritative current application, embedded assets/scripts
  TattooLab-Ficha.html        # Generic standalone session/clinical form
  robots.txt                 # Discourages indexing; not access control
scripts/
  check-source.mjs            # Offline syntax/configuration checks
  check-finance.cjs           # Isolated duplicate/deletion logic checks
  check-invoice-detail.cjs    # Isolated invoice-detail checks
SOURCE_CODE.txt              # Copy/paste snapshot of public/index.html
CONTEXTO_DEL_PROYECTO.md
README.md
vercel.json
package.json
.gitignore
docs/
  ARCHITECTURE.md
  MIGRATION_AND_LIMITATIONS.md
  EXPORT_MANIFEST.json
```

Only `public/` is published. Documentation and the text source are repository/handover artifacts, not deployment routes.

## Runtime structure

The root document has inline CSS and successive classic JavaScript modules/scripts. The first application script supplies `seed`, `db`, `persist`, the client registry and basic rendering. Another large script embeds `CASE_PAGES`, a child-frame bridge, role switching, local auth, products, collections and finance. Subsequent scripts extend agenda, sorting, iPad forms and birthdays. PDF.js source and worker are embedded as `type="text/plain"` script bodies. JSZip is embedded with its license header.

The export's CASE_PAGES uses one neutral full form, with a compatibility fallback for older HTML form names. `openCase` embeds form source in an iframe. Parent and child use `postMessage` with a client/frame token; the bridge updates `db.sessionRecords`. The iPad client form is separately embedded in `IPAD_CLIENT_PAGE`. This is not server-side trust or isolation between real user accounts.

Existing code has layers of function overrides. Keep script ordering and closure scope intact. Extracting a function into a separate file can break access to lexical state. First add regression checks, then split source incrementally.

## Important code entry points

| Area | Functions/state |
|---|---|
| Root registry | `db`, `persist`, `render`, `exportData`, `importData` |
| Profiles and local gate | `authPrompt`, `enterRole`, `getKeys`, `passwordHash`, `rememberAdminOnReload` |
| Embedded forms | `CASE_PAGES`, `IPAD_CLIENT_PAGE`, `CHILD_BRIDGE`, `openCase` |
| Finance | `showFinance`, `financeTab`, `financeLedger`, `financeSave`, `financeOperations`, `financeTable` |
| Parsing/import | `financeReadFile`, `financeParse`, `financeBankRows`, `financeStage`, `financeClassify`, `financeReview` |
| Statements | `financeStatementStore`, `financeInitStatements`, `financeStatementsView`, `financeLoadStatement`, `financeResumeStatement`, `financeRememberStatement` |
| Duplicate checks | `financeStatementFileHash`, `financeFindFileDuplicate`, `financeStatementSignature`, `financeFindRowsDuplicate` |
| Deletion | `financeConfirmDeleteStatement`, `financeDeleteStatement`, `financeStatementRemovalIds`, `financeRecoverStatementDeletions` |
| Supplier documents | `financeSuppliers`, `bindFinanceSuppliers`, `supplierFields`, `readSupplierPdf`, `readSupplierPhoto`, `supplierMemory` |
| Invoice details | `showSupplierDocumentDetail`, `supplierDocumentItemsTable`, `editSupplierDocument` |

## Persistence

| Store | Key/name | Contents |
|---|---|---|
| localStorage | `tattoolab-admin-registry-v1` | Root `db`: clients, groups, session snapshots, audit activity, ledger, suppliers, catalog/configuration as present |
| localStorage | `tattoolab-local-profile-keys-v1` | Local profile password hashes/salts; not distributed in the export |
| sessionStorage | `tattoolab-admin-reload` | Current tab's administrator-reload marker |
| IndexedDB | `tattoolab-bank-statements`, version 2 | `statements` store, keyPath `id`, unique sparse `fileHash` index |
| IndexedDB | `tattoolab-supplier-folder`, version 1 | `settings` store containing the connected local folder handle |
| File system | User-selected invoice folder | Large supplier originals referenced by `diskFile` |
| Additional local keys | Form-specific draft/session keys | Client draft and standalone session state; inventory these before migration |

All browser stores are scoped to the browser/profile/origin. Local-file URLs, localhost, Vercel previews and production domains must not be assumed to share data. A local folder handle needs user permission in the target browser and may not be usable on a new origin.

## Statement record

```js
{
  id, name, account, loadedAt,
  file,          // File/Blob; structured-cloned by IndexedDB, NOT JSON
  fileHash,      // SHA-256 of original bytes when calculated
  rows,          // parsed rows, including saved manual classification
  start, end,    // earliest/latest transaction dates, not bank-header period
  state, error
}
```

A deletion marker retains an ID and minimal row-ID references with `deleted: true`, without keeping the original Blob. This prevents legacy grouping from recreating a removed row in the history. An optional `pendingRemovalIds` journal permits idempotent recovery of a confirmed ledger deletion after interruption. Do not discard deletion markers without understanding that behavior.

New uploads archive the file before parsing. A parse error is represented in history and can be retried. Legacy ledger-only records are shown as month/account groups with no invented original file. The unused original-attachment helper is retained in source, but its button was intentionally removed from the interface.

Exact binary copies are checked even when renamed. Parsed same-account copies compare sorted date/amount/normalized-description lists, preserving repeated-item counts. Different bank export formats can abbreviate descriptions differently, so semantic matching is not a guarantee that every equivalent file is detected. Newly saved binary hashes also have a unique IndexedDB index. Separate browsers/profiles are independent; this is not centralized deduplication.

## Import and deletion behavior

`financeStage` excludes already imported IDs/bank references before preview. `financeSave` updates the ledger through root persistence. Statement drafts and originals live separately in IndexedDB. Imported status is also inferred from existing ledger rows. These stores cannot be assumed to commit as a single transaction.

Deleting only history/file leaves ledger rows intact. Optional ledger deletion targets only exclusive Cartola-source rows; rows referenced by another retained history record are preserved. Dangling match links to removed rows are cleared and flagged for review. Interrupted removals use the journal described above.

## Dependencies and external access

- Vanilla HTML/CSS/JavaScript; no frontend framework, backend or database server.
- Embedded JSZip 3.10.1, including upstream license notice.
- Embedded Mozilla PDF.js and worker; upstream license notices retained. Inspect embedded headers when upgrading rather than guessing a package version.
- Tesseract.js 6.0.1 loaded from jsDelivr for browser OCR, including Spanish recognition assets fetched by the worker.
- Google Fonts may load DM Sans / Manrope.
- WhatsApp links request opening the user's client; they do not automatically send messages.
- No OpenAI API, paid OCR API, or automatic PDF24 connection is configured.

Inline scripts, dynamic Blob modules/workers, srcdoc frames, OCR workers and external fonts are currently required. A strict CSP added without testing can break them. Don't add one by copying a generic example.

## Recommended future architecture (not implemented)

Preserve this frontend while adding server-enforced authentication, per-studio/per-entity authorization, a relational database for normalized records and a private object store for statement/invoice originals. Store secrets only in the backend. Introduce a versioned migration and backup service. This is a future phase, not a requirement to serve the static prototype.
