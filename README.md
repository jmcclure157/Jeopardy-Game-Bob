# 🎮 Jeopardy! Web Game Show

An authentic, retro-styled Jeopardy game show web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Features

- **Classic TV Look & Feel**: Iconic royal blue & gold styling, retro typography, animated category tiles, and responsive mobile/tablet/desktop grid.
- **Three Complete Game Rounds**:
  - **Round 1 (Jeopardy!)**: 6 categories, 5 clues each ($200 to $1000) + 1 hidden Daily Double.
  - **Round 2 (Double Jeopardy!)**: 6 new categories ($400 to $2000) + 2 hidden Daily Doubles.
  - **Round 3 (Final Jeopardy!)**: Category reveal, secret player wagers, 30-second clue timer with the iconic synth tune, and dramatic answer reveal.
- **Multiple Curated Game Packs**:
  - *Championship Classic*: World Geography, Science & Nature, Famous Novels, World History, Screen & Sound, Before & After.
  - *Pop Culture & Modern Trivia*: Streaming Hits, Billboard No. 1s, Video Game Worlds, Sports Legends, Food & Beverages, Iconic Brands, Oscars, Internet Culture, Superheroes.
- **Smart Answer Engine**: Fuzzy matching using Levenshtein distance and phonetic normalization. Handles minor typos, article stripping ("a", "an", "the"), question phrasing ("What is...", "Who is..."), and accepts alternate valid answers.
- **Synthesized Web Audio SFX**: Instant zero-latency audio for correct chimes, incorrect buzzers, Daily Double fanfares, timer ticks, time's up buzzers, and the iconic Final Jeopardy 30s theme tune.
- **Host Controls & Multiplayer Podiums**:
  - 1 to 3 players/teams with customizable names and active turn indicators.
  - Manual host score adjustment (+ / -) and instant override buttons.
- **Victory Podium & Confetti**: Automatic winner ranking and confetti cannon celebration on game finish.
- **GitHub Pages Ready**: Fully automated CI/CD pipeline via GitHub Actions.

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/jmcclure157/Jeopardy-Game-Bob.git
cd Jeopardy-Game-Bob

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To enable GitHub Pages for your repo:
1. Go to your repository on GitHub: `https://github.com/jmcclure157/Jeopardy-Game-Bob`
2. Click **Settings** $\rightarrow$ **Pages** (under Code and automation).
3. Under **Build and deployment** $\rightarrow$ **Source**, choose **GitHub Actions**.
4. Push your changes to `main` — GitHub Pages will automatically build and publish your game to:
   `https://jmcclure157.github.io/Jeopardy-Game-Bob/`
