import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildLeverageTransactionRequest, getLeverageQuotation } from './leverage';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Leverage', function () {
  it('Test getLeverageQuotation', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      token: logics.compoundv3.polygonTokens.WETH,
      amount: '1',
      slippage: 100,
    };
    const resp = await getLeverageQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('leverageTimes', 'currentPosition', 'targetPosition');
    expect(resp.quotation.currentPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
    expect(resp.quotation.targetPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
  });

  it('Test getLeverageQuotation without token and amount', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      slippage: 100,
    };
    const resp = await getLeverageQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('leverageTimes', 'currentPosition', 'targetPosition');
    expect(resp.quotation.currentPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
    expect(resp.quotation.targetPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
  });

  it('Test buildLeverageTransactionRequest', async function () {
    const routerData: apisdk.RouterData = {
      chainId: common.ChainId.polygon,
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      logics: [
        {
          rid: 'utility:flash-loan-aggregator',
          fields: {
            id: '0db8e149-1cf8-47c4-a5c1-df7b27b51775',
            protocolId: 'balancer-v2',
            loans: [
              {
                token: {
                  chainId: 137,
                  address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                  decimals: 6,
                  symbol: 'USDC',
                  name: 'USD Coin (PoS)',
                },
                amount: '1796.137355',
              },
            ],
            isLoan: true,
          },
        },
        {
          rid: 'paraswap-v5:swap-token',
          fields: {
            input: {
              token: {
                chainId: 137,
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                decimals: 6,
                symbol: 'USDC',
                name: 'USD Coin (PoS)',
              },
              amount: '1796.137355',
            },
            output: {
              token: {
                chainId: 137,
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                decimals: 18,
                symbol: 'WETH',
                name: 'Wrapped Ether',
              },
              amount: '1',
            },
            slippage: 100,
          },
        },
        {
          rid: 'compound-v3:supply-collateral',
          fields: {
            marketId: 'USDC',
            input: {
              token: {
                chainId: 137,
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                decimals: 18,
                symbol: 'WETH',
                name: 'Wrapped Ether',
              },
              amount: '1',
            },
            balanceBps: 10000,
          },
        },
        {
          rid: 'compound-v3:borrow',
          fields: {
            marketId: 'USDC',
            output: {
              token: {
                chainId: 137,
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                decimals: 6,
                symbol: 'USDC',
                name: 'USD Coin (PoS)',
              },
              amount: '1796.137355',
            },
          },
        },
        {
          rid: 'utility:flash-loan-aggregator',
          fields: {
            id: '0db8e149-1cf8-47c4-a5c1-df7b27b51775',
            protocolId: 'balancer-v2',
            loans: [
              {
                token: {
                  chainId: 137,
                  address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                  decimals: 6,
                  symbol: 'USDC',
                  name: 'USD Coin (PoS)',
                },
                amount: '1796.137355',
              },
            ],
            isLoan: false,
          },
        },
      ],
    };

    const transactionRequest = await buildLeverageTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
