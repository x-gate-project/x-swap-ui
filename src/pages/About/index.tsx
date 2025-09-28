import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { YellowCard } from '../../components/Card'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: 0 12px;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column;
  `};
`

const ResponsiveButtonPrimary = styled.div`
  width: fit-content;
  border-radius: 12px;
  padding: 6px 8px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const VersionCard = styled(YellowCard)`
  margin-top: 24px;
  padding: 16px;
  text-align: center;
`

const ExternalLinkStyled = styled.a`
  color: ${({ theme }) => theme.primary1};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function About() {
  const packageJson = require('../../../package.json')

  return (
    <PageWrapper>
      <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
        <TYPE.largeHeader>About X-Swap</TYPE.largeHeader>
      </TitleRow>

      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <TYPE.body style={{ marginTop: '2rem' }}>
          X-Swap is a decentralized exchange (DEX) protocol built on multiple blockchain networks including
          Ethereum, Japan Open Chain, Base, Avalanche, and Arbitrum. It enables users to swap tokens
          in a trustless and permissionless manner.
        </TYPE.body>

        <TYPE.body>
          <strong>Key Features:</strong>
        </TYPE.body>

        <AutoColumn gap="sm" style={{ marginLeft: '1rem' }}>
          <TYPE.body>• Multi-chain support across major networks</TYPE.body>
          <TYPE.body>• Automated market maker (AMM) protocol</TYPE.body>
          <TYPE.body>• Liquidity provision and farming</TYPE.body>
          <TYPE.body>• User-friendly interface with network switching</TYPE.body>
          <TYPE.body>• Non-custodial and decentralized</TYPE.body>
        </AutoColumn>

        <TYPE.body style={{ marginTop: '1rem' }}>
          <strong>Supported Networks:</strong>
        </TYPE.body>

        <AutoColumn gap="sm" style={{ marginLeft: '1rem' }}>
          <TYPE.body>• Ethereum Mainnet</TYPE.body>
          <TYPE.body>• Japan Open Chain</TYPE.body>
          <TYPE.body>• Base</TYPE.body>
          <TYPE.body>• Avalanche</TYPE.body>
          <TYPE.body>• Arbitrum One</TYPE.body>
        </AutoColumn>

        <TYPE.body style={{ marginTop: '1rem' }}>
          Learn more about the project on{' '}
          <ExternalLinkStyled
            href="https://github.com/x-gate-project"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </ExternalLinkStyled>
        </TYPE.body>

        <VersionCard>
          <TYPE.mediumHeader>Version Information</TYPE.mediumHeader>
          <TYPE.body style={{ marginTop: '8px' }}>
            <strong>Version:</strong> {packageJson.version}
          </TYPE.body>
          <TYPE.body>
            <strong>Name:</strong> {packageJson.name}
          </TYPE.body>
          <TYPE.body>
            <strong>Description:</strong> {packageJson.description}
          </TYPE.body>
        </VersionCard>
      </AutoColumn>
    </PageWrapper>
  )
}