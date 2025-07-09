# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# 🔍 CryptoTrace

**CryptoTrace** is a blockchain-based fraud detection platform that monitors and flags suspicious crypto transactions in real-time. Designed to bring transparency to the decentralized world, it helps identify scam wallets and unethical patterns across the blockchain.

![CryptoTrace Banner](https://your-banner-image-link-if-any.com)

---

## 🚀 Features

- 📊 Real-time tracking of blockchain transactions
- 🕵️‍♂️ Detection of suspicious patterns and anomalous behavior
- 🏴‍☠️ Flagging of potential scam wallets
- 💼 Wallet risk scoring logic (basic heuristics)
- 📈 Visual dashboard for monitoring activity
- 🔐 Secure, modular backend integration

---

## 🛠️ Tech Stack

| Frontend        | Backend        | Database  | APIs Used         |
|-----------------|----------------|-----------|-------------------|
| React.js        | Node.js        | MongoDB   | Etherscan API     |
| Tailwind CSS    | Express.js     |           | CoinGecko API     |

---

## 📸 Screenshots

> _Add your screenshots here for visual clarity._

| Dashboard View | Wallet Scanner |
|----------------|----------------|
| ![Dashboard](./assets/dashboard.png) | ![Wallet](./assets/wallet-scan.png) |

---

## ⚙️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/cryptotrace.git

# 2. Navigate into the project
cd cryptotrace

# 3. Install frontend dependencies
cd client
npm install

# 4. Install backend dependencies
cd ../server
npm install

# 5. Add your .env file (API keys, DB URI)

# 6. Run both frontend and backend
npm run dev
🧠 Challenges Faced
API rate-limiting issues from free-tier plans

Handling large-scale live crypto data

Ensuring backend stability under heavy load

Building seamless frontend-backend integration under time constraints

🏆 Achievements
⏱ Built in 24 hours during a college hackathon

🏅 Selected as Top 5 Finalist among 30+ teams

💡 Built a complete working MVP with real-time data and detection logic

👨‍💻 Contributors
Name	Role
Ayan Chatterjee	Frontend Lead, Team Lead
[Teammate 1]	Backend Developer
[Teammate 2]	API/Data Engineer
[Teammate 3]	UI/UX & Integrations

📬 Contact
Feel free to reach out:

LinkedIn: linkedin.com/in/ayanchatterjee

Email: ayanofficialconnect@gmail.com

⭐️ Show Your Support
If you like the project, give it a ⭐️ on GitHub!
Feel free to fork, raise issues, or suggest improvements.

⚠️ This project was built for educational and research purposes only. Not intended for production-level use or financial decisions.
