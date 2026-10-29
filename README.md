# ROYAL ATELIER — Luxury Jewellery Store

A responsive Persian (RTL) luxury jewellery storefront built with **plain HTML, CSS and vanilla JavaScript**. No build step, package manager, framework or paid library is required. The folder structure is ready for GitHub Pages.

## Files

```text
royal-atelier/
├── index.html             # Homepage, SEO metadata, Store JSON-LD
├── README.md              # Setup, publishing and demo limitations
├── PRODUCT.md             # Product goals and constraints
├── DESIGN.md              # Visual system and CSS token reference
├── .nojekyll              # Tell GitHub Pages not to process the site with Jekyll
├── assets/
│   └── favicon.svg
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Run locally

1. Extract the ZIP.
2. Open `index.html` in a browser, or use VS Code with the Live Server extension.
3. Product edits, cart, demo accounts and demo orders are stored in the current browser's `localStorage`.

## Publish with GitHub Pages

1. Create a new GitHub repository (for example `royal-atelier-store`).
2. Upload the **contents** of this folder to the repository root. `index.html` must sit directly at the root, not inside another nested folder.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
6. Wait for the Pages deployment to finish. The URL will be similar to `https://YOUR-USERNAME.github.io/royal-atelier-store/`.
7. Replace the `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` placeholder in the JSON-LD `url` field in `index.html` with the real URL. Update the brand contact details and all sample product content before sharing it publicly.

The CSS and JavaScript use relative root paths (`css/style.css`, `js/app.js`) and the favicon uses `assets/favicon.svg`, so they work on a GitHub Pages project URL without absolute-domain paths.

## Included demo features

- Royal green, dark brown, gold and warm ivory luxury direction; responsive desktop/tablet/mobile layout.
- Product categories: necklaces, rings, earrings, bracelets and jewellery sets.
- Search, category filters, min/max price filters, in-stock filter and sorting.
- Add-to-cart, quantity controls, cart total and stock checks.
- Demo customer registration/login and per-browser order history.
- Demo admin panel to add/delete products, update prices and stock, inspect customer list and update order statuses.
- Order confirmation flow that reduces local demo stock.
- SEO title/description, Open Graph metadata, semantic sections, JSON-LD, favicon, focus states and reduced-motion support.

## Demo admin credentials

- Email: `admin@royal.test`
- Password: `Royal2026!`

The credentials only unlock a client-side demo panel. They are **not secure authentication**.

## Important: what GitHub Pages cannot provide by itself

GitHub Pages is static hosting. This project is a **front-end prototype**, not a production-ready transactional store. Registration, login, inventory, order records and order statuses are stored only in one browser's `localStorage`; they do not sync across customers, browsers or devices. The demo account code stores test credentials locally. Do not enter real customer data or real passwords.

A real store requires a backend/API and database, server-side authentication and authorization, protected admin roles, order/inventory persistence, privacy policy and operational safeguards. **Real online payment is not connected**; the checkout is clearly labeled as a demo and does not charge money. To accept payments, connect a legitimate payment gateway through a secure server-side integration (never expose secret keys in `app.js`). You can keep the public catalogue on GitHub Pages while hosting the API/admin service separately, or deploy the whole commerce stack on a platform that supports server-side code.

## Images and fonts

Product photography and Google Fonts are currently loaded from remote HTTPS URLs. An internet connection is required to load them. Before production, replace sample products, photos, pricing, descriptions, contact details, warranty/return terms and any authenticity claims with verified business information. Download only images you have permission to use.
