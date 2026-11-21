# Migration and limitations

## What the supplied files contain

This package contains code and documentation, with embedded historical customer imports and finance transaction seeds removed. It does not contain the current localStorage/IndexedDB data from the open browser, user-selected invoice folders, passwords, password hashes from the browser, or API credentials.

The original local working HTML is untouched. Its source checksum is recorded in EXPORT_MANIFEST.json. The export uses a neutral form and empty registry on a fresh origin. This is intentional separation of source and live records, not an instruction to reset the working system.

## Before moving real operations

1. Keep the original local file and browser/profile available. Do not clear browser storage, reset the application or discard the local invoice folder.
2. Use the existing JSON export as one registry snapshot. It serializes `db`.
3. Download bank originals individually where they are available and preserve the supplier originals folder separately.
4. Have a developer implement and verify full versioned backup/restore before treating the hosted origin as a replacement.

Important: `importData` currently validates a JSON file up to 5 MB and merges NEW clients. It does not restore existing-client edits, groups, all session records, the full ledger/catalog, or IndexedDB statement originals/drafts. Do not describe that button as a complete restore. Bank File/Blob values must be exported as actual files with a metadata manifest; JSON.stringify is not a file archive. Supplier directory handles must be reconnected with permission.

## Vercel boundaries

The configuration publishes only `public/`. Git stores source, Vercel serves source, and the browser still stores records. A new Vercel deployment URL, production domain or browser may show an empty registry. No cloud data synchronization is implemented.

The password gate is local JavaScript logic. A technically capable visitor can inspect/alter client-side logic; a private GitHub repository does not restrict the deployed site's visitors. Use a restricted preview for development. Add real authentication, authorization, private shared storage and backup policies before using this as a shared production service.

There is no configured API integration, server database, file-upload server, email sender, automatic Calendar sync or LLM classifier. OCR and bank parsing run in the browser; supported formats/photographs can still fail. Image OCR downloads its worker/language assets and can depend on network availability.

The inherited consent and clinical workflow are source functionality, not a legal/clinical certification by this export. Preserve provenance and seek appropriate review before operational changes.

## Verification before switching

On a fresh preview, use fictional records to verify: creating a client; switching allowed profiles; opening the generic/iPad form; submitting and reviewing consent; continuing a session without recharging its deposit; supplier invoice upload and item view; bank upload, archive retention on failure, classify/review/import; reload/resume; duplicate rejection; default versus exclusive-ledger deletion; year/account filtering; and downloading originals.

Then test a full backup/restore in a separate origin and compare IDs, record counts, totals, linked movements, draft classification, files and hashes. Keep rollback access to the original until these comparisons succeed.

## Licensing

Embedded upstream JSZip and PDF.js license headers are retained. This handover does not assign an open-source license to the studio's custom code; choose one deliberately if you later make the repository public.
