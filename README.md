# X-Swap UI

A decentralized exchange (DEX) user interface built on Uniswap v2 protocol, supporting multi-chain trading across various blockchain networks including JOC, JOCT, Ethereum Mainnet, Base, Avalanche, and Arbitrum One.

## Features

- **Multi-Chain Support**: Trade tokens across multiple blockchain networks
- **Uniswap v2 Protocol**: Built on proven decentralized exchange technology
- **Web3 Integration**: Connect with various wallets including MetaMask, WalletConnect, Portis, and Fortmatic
- **Token Swapping**: Seamless token-to-token exchanges with automated market making
- **Liquidity Provision**: Add/remove liquidity to earn trading fees
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Multi-Language Support**: Internationalization support with i18next

## Supported Networks

- **JOC Network**: Custom blockchain network with native token support
- **JOCT Network**: JOC testnet environment
- **Ethereum Mainnet**: Main Ethereum blockchain
- **Base**: Layer 2 solution by Coinbase
- **Avalanche**: High-performance blockchain platform
- **Arbitrum One**: Ethereum Layer 2 scaling solution
- **Sepolia**: Ethereum testnet for development

## Technology Stack

- **Frontend**: React 16.13+ with TypeScript
- **State Management**: Redux Toolkit with Redux LocalStorage
- **Styling**: Styled Components with Rebass
- **Web3**: Ethers.js v5 with Web3React connectors
- **Testing**: Jest with Cypress for E2E testing
- **Build Tool**: Create React App with custom configurations

## Prerequisites

- Node.js 18.x
- Yarn package manager
- Web3-compatible browser or wallet extension

## Installation

1. Clone the repository:

```bash
git clone https://github.com/x-gate-project/x-swap-ui.git
cd x-swap-ui
```

2. Install dependencies:

```bash
yarn install
```

3. Configure environment variables:

```bash
cp .env.sample .env
```

Edit `.env` file with your network URLs and contract addresses:

- Network RPC URLs for each supported blockchain
- Factory and router contract addresses
- Wrapped token addresses
- Multicall contract addresses

## Development

Start the development server:

```bash
yarn start
```

The application will be available at `http://localhost:3000`

## Build

Create a production build:

```bash
yarn build
```

## Testing

Run unit tests:

```bash
yarn test
```

Run integration tests:

```bash
yarn integration-test
```

## Environment Configuration

The application requires the following environment variables:

### Network URLs

- `REACT_APP_MAINNET_NETWORK_URL`: Ethereum mainnet RPC URL
- `REACT_APP_JOC_NETWORK_URL`: JOC network RPC URL
- `REACT_APP_BASE_NETWORK_URL`: Base network RPC URL
- `REACT_APP_AVALANCHE_NETWORK_URL`: Avalanche network RPC URL
- `REACT_APP_ARBITRUM_ONE_NETWORK_URL`: Arbitrum One RPC URL
- `REACT_APP_SEPOLIA_NETWORK_URL`: Sepolia testnet RPC URL
- `REACT_APP_JOCT_NETWORK_URL`: JOC testnet RPC URL

### Contract Addresses

- Factory, router, wrapped token, and multicall addresses for each network

### External Services

- `REACT_APP_X_GATE_URL`: X-Gate service URL
- `REACT_APP_DEFAULT_TOKEN_LIST_URL`: Default token list URL

## Deployment

The application can be deployed to Google App Engine using the provided `app.yaml` configuration:

```bash
gcloud app deploy
```

## Architecture

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Main application pages and routing
- **State**: Redux store configuration and slices
- **Constants**: Network configurations, contract ABIs, and addresses
- **Connectors**: Web3 wallet connection logic
- **Utils**: Helper functions and utilities
- **Hooks**: Custom React hooks for Web3 interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the GPL-3.0-or-later license. See the [LICENSE](LICENSE) file for details.

## Security

This is experimental software. Use at your own risk. Always verify transactions before confirming them in your wallet.

## Support

For support and questions, please open an issue on the GitHub repository.
