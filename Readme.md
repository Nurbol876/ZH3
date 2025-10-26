# ZH3 — Mini Web App

ZH3 is a small front-end mini app created by the kiki Team (two students from Zhayyl Baatyr Lyceum). It shows live Ethereum price charts, a simple currency-to-ETH converter, links to a MetaMask login page, a couple of mini-games, and contact information. The app is built with plain HTML/CSS/JavaScript and uses Chart.js, Swiper, web3, and CoinGecko public APIs.

Live demo: https://nurbol876.github.io/ZH3/

---

## Features

- Interactive Ethereum price chart (CoinGecko market chart API)
  - Periods: 1D / 1W / 1M / 1Y
  - Rendered with Chart.js
- Simple converter: convert a fiat amount to ETH (CoinGecko simple price API)
- MetaMask connect button (front-end link to login page; web3 available client-side)
- Games carousel (Spin the wheel, Roll Dice)
- Responsive layout and basic animations (animate.css + Swiper)
- Contact/social links and footer

---

## Tech & Libraries

- HTML, CSS, JavaScript (vanilla)
- Chart.js — charts
- Swiper — games carousel
- web3.min.js — MetaMask / Ethereum client-side helpers
- CoinGecko public APIs (no API key required)
- animate.css for simple animations

---

## Repo structure (key items)

- `index.html` — main homepage (chart, converter, games links, contact)
- `pages/` — subpages (login, games: `pages/games/spinthewheel.html`, `pages/games/dollrice.html`)
- `src/`
  - `src/css/` — styles (style.css, animate.min.css, swiper-bundle.min.css)
  - `src/js/` — scripts (main.js, web3.min.js, chart.js, swiper-bundle.min.js)
  - `src/assets/` — images & icons
- `prepros.config` — optional Prepros project config
- `.idea/` — IDE settings (can be ignored)

---

## Quick start (run locally)

1. Clone the repository
   ```bash
   git clone https://github.com/Nurbol876/ZH3.git
   cd ZH3
   ```

2. Serve with a static server (recommended) or open `index.html` directly. Example with Python:
   ```bash
   # Python 3
   python3 -m http.server 8000
   # then open http://localhost:8000/ in your browser
   ```

Notes:
- Chart and converter fetch live data from CoinGecko (no API key).
- To use MetaMask features, open in a browser with MetaMask installed.
- If you run into fetch/CORS issues opening the file directly, use a local server as shown above.

---

## Development notes

- Main logic for charting and conversion is in the JS included on the home page (`index.html` and `src/js/main.js`).
- Swiper is initialized in `index.html` for the games carousel.
- MetaMask connect currently links to `pages/login.html`. To complete Web3 integration: detect provider, request accounts, and handle network/account changes.
- Animations use animate.css classes included under `src/css/`.

---

## Page references

- Home: `index.html` (live: https://nurbol876.github.io/ZH3/)
- Login (MetaMask): `pages/login.html`
- Games: `pages/games/spinthewheel.html`, `pages/games/dollrice.html`

---

## Contact / Authors

kiki Team — two students from Zhayyl Baatyr Lyceum

- Email: nurbolsagynbekov876@gmail.com
- GitHub: https://github.com/Nurbol876
- Additional contact links available in the site's Contact section and footer.

---

## Contributing

Contributions welcome.

- Fork the repo
- Create a branch for your change
- Open a pull request describing your changes

Please include notes for any JS logic you change.

---

## License

No license file is included. If you wish to make the project open source, consider adding a license like MIT (`LICENSE`).

---

## Acknowledgements

- CoinGecko — market data APIs
- Chart.js and Swiper — UI & charting libraries
- animate.css — animations

```