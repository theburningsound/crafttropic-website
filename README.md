# CraftTropic one-page website

A responsive, accessible MVP site built with plain HTML, CSS, and JavaScript.

## Open locally

Open `index.html` directly in a browser. For the most reliable preview, run a small static server in this folder (for example, `python3 -m http.server 8000`) and visit `http://localhost:8000`.

## Replace the hero media

Add the final cocktail photo or video to `assets/`. For an image, update the `.hero-media` rule in `styles.css` with `background-image: url("assets/your-image.jpg")`. For video, replace the placeholder content inside `.hero-media` in `index.html` with an autoplaying, muted, looping `<video>` and add a useful accessible label.

## Update colors

Edit the custom properties at the top of `styles.css` under `:root`. The core palette variables include `--forest`, `--cream`, `--sand`, `--coral`, and `--lime`.

## Connect the contact form

The form currently validates input and displays a demo success message without sending data. Search for `CONNECT FORM SERVICE HERE` in `index.html` and `CONNECT REAL ENDPOINT HERE` in `script.js`. Add the endpoint supplied by Formspree, Netlify Forms, or another provider, then replace the demo handler with a normal submission or `fetch()` request.

## Update content

All visible text and section order live in `index.html`. Navigation, form behavior, active section highlighting, and the automatic footer year live in `script.js`.
