# RRM Earthworks

RRM Earthworks is a small Express and EJS website. It serves a landing page, accepts quote requests through a contact form, and sends those requests by email.

## What the app serves

- `GET /` renders `src/public/templates/landing.ejs`.
- `POST /contactform` accepts the contact form fields `usersname`, `formemail`, `phonenumber`, and `message`. It sends the submission through Gmail SMTP to both configured recipients, `RRMEMAIL` and `DEVEMAIL`.
- `GET /formsuccess` renders the confirmation page in `src/public/templates/formsuccess.ejs`.
- Other GET paths on the `rrmearthworks.com` virtual host redirect to `/`.
- Files under `src/public` are served as static assets. Static responses are cached for one day; the landing page is gzipped when the browser accepts gzip.

The server uses Express virtual hosting for `rrmearthworks.com`. A request must use that host name to reach the website routes. Static files are mounted on the main Express app.

The landing page retains copied Shopify storefront markup and links, including cart, search, and collection paths. The current Express app does not implement those storefront routes, so unmatched GET requests redirect to the landing page. The page also loads third-party analytics and storefront scripts; see [SECURITY.md](SECURITY.md) for the current security and data-handling notes.

## Run locally

Requirements: Node.js and npm. The repository does not specify a Node.js version.

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.envexample` to `.env` and fill in the values below.

3. Start the server:

   ```powershell
   npm start
   ```

For development, `npm run dev` starts Node's watch mode. The app listens on the port in `PORT`. Because the website routes are virtual-hosted, a request to plain `localhost` may not match `rrmearthworks.com`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `PORT` | Port for the Express server. |
| `EMAIL` | Gmail account used as the sender for contact messages. |
| `EMAIL_PASSWORD` | SMTP password or app password for that Gmail account. |
| `RRMEMAIL` | First recipient of contact submissions. |
| `DEVEMAIL` | Second recipient of contact submissions. |

`.envexample` also contains `DOMAIN`, but the current application does not read it. Keep real credentials in `.env`; `.gitignore` excludes that file.

## Project layout

- `src/index.js` — Express setup, virtual host, routes, gzip response, and SMTP mail delivery.
- `src/public/templates/` — EJS landing and success pages.
- `src/public/css/`, `src/public/images/`, `src/public/script/` — static site assets.
- `src/database/` — legacy MySQL helper and schema; the current server does not import or use them.

Some declared packages, including `axios` and `express-session`, are not used by the current server entry point.
