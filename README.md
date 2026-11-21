# TattooLab — existing administration system

This is a deployment export of the working TattooLab administration app, dated 20 November 2026. It preserves the existing design and modules; it is not a React/Next.js rewrite.

The working local project has not been modified by this export. Historical embedded customer imports, example identities, and financial workbook transactions have been removed from the deployment copy. Your live browser data is not included. The deployable copy starts with an empty client registry on a new origin.

## Files to use

- `public/index.html`: complete current application: HTML, CSS, JavaScript, embedded forms and document readers.
- `public/TattooLab-Ficha.html`: neutral standalone clinical/session form, also embedded inside the application.
- `SOURCE_CODE.txt`: exact copy of `public/index.html`, provided for copying and pasting. Save its contents as HTML, not as JavaScript.
- `vercel.json`: static deployment configuration; only `public/` is served.
- `CONTEXTO_DEL_PROYECTO.md`: detailed handover and accepted decisions.
- `docs/ARCHITECTURE.md`: code map, persistence, and dependencies.
- `docs/MIGRATION_AND_LIMITATIONS.md`: what hosting changes, what it does not, and how to plan data migration.
- `docs/EXPORT_MANIFEST.json`: source/export checksums and export adaptations.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000 --directory public
```

Open http://localhost:8000. This is a new browser origin, so an empty registry here does not mean the local application's data was lost. Stop the preview with Ctrl+C. Create an administrator password when the clean application asks for one; no password is included in this repository.

## Check the source

Node.js is needed for this optional developer check, not for serving the app:

```bash
npm test
```

There are no package dependencies to install. The checks validate JavaScript syntax, JSON configuration, source-copy consistency and isolated finance/invoice logic using synthetic records and a memory storage stub. They are not end-to-end browser or actual IndexedDB integration tests.

## Push to GitHub

Create an empty PRIVATE repository named `tattoolab`. Replace YOUR-USERNAME in the command below. Open Terminal in this exported folder, then paste:

```bash
git init -b main
git add .
git commit -m "Preserve existing TattooLab system and add deployment handover"
git remote add origin https://github.com/YOUR-USERNAME/tattoolab.git
git push -u origin main
```

Authenticate with GitHub through your normal sign-in method; do not paste passwords or access tokens into source files. Do not upload the original working folder, invoices, browser backups, or client data to the repository.

## Deploy with Vercel

1. Import the GitHub repository into Vercel.
2. Framework Preset: **Other**.
3. Root Directory: the repository root.
4. No build command is required. `vercel.json` sets an empty build command and Output Directory **public**.
5. No environment variables or API keys are needed for this existing static version.
6. Deploy and test using invented records first.

Vercel's current static-build and configuration guidance:
- https://vercel.com/docs/builds
- https://vercel.com/docs/project-configuration/vercel-json

Vercel hosts this app's files. It does NOT add a database, server-side login, shared user accounts, automatic backups, or synchronization. The built-in profile password gate is a local prototype feature, not server-enforced authorization. Restrict access to any preview that will contain private data; implement real backend authentication and storage before treating it as a shared production administration service.

## Continue development

Edit `public/index.html` as the authoritative source. After edits, refresh the text snapshot with:

```bash
cp public/index.html SOURCE_CODE.txt
npm run check
```

Read the handover before changing storage keys or importing old data. Preserve the existing modules and business rules. Keep real customer, clinical, bank and invoice records outside Git.
