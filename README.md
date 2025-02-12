# Riddlr

Riddlr is a dApp for solving riddles.

---

### Smart Contract Address

The Riddlr protocol is deployed on the Sepolia network with the following address:

**`0x79b4a4D965893525FFEd75dC657046DB653D084b`**

### Live DApp

Access the live dApp here: [Riddlr](https://riddlr.com/)

---

## Installation and Running Locally

Follow the steps below to set up the project locally:

### Install Dependencies

```bash
# Using npm
$ npm install

# Or using yarn
$ yarn install
```

### Environment Configuration

Create a `.env.local` file in the root directory and populate it with the required environment variables. Use `.env.example` (if available) as a reference.

### Running the Development Server

```bash
# Start the development server
$ npm run dev

# Or using yarn
$ yarn dev
```

Visit `http://localhost:3000` in your browser to see the application in action.

### Build for Production

```bash
# Build the application
$ npm run build

# Or using yarn
$ yarn build

# Start the production server
$ npm run start

# Or using yarn
$ yarn start
```

### Linting and Code Quality

To lint and check for code quality issues, run:

```bash
# Using npm
$ npm run lint

# Or using yarn
$ yarn lint
```

---

## Technology Stack

### Frontend

- **Framework**: Next.js
- **Styling**: TailwindCSS and DaisyUI
- **Web3 Interaction**: Wagmi and ethers.js
- **State Management**: Zustand
- **GraphQL**: graphql-request

### Backend

- **Smart Contract**: Solidity
- **Network**: Base (Ethereum Layer 2)
- **GraphQL Subgraph**: Custom integration

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.