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
    expect(resp).to.have.keys('quotation', 'approvals', 'logics');
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
          rid: 'balancer-v2:flash-loan',
          fields: {
            id: '2d7fdf8e-0ecc-4d91-9549-601e8e5df5f3',
            outputs: [
              {
                token: {
                  chainId: 137,
                  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                  decimals: 18,
                  symbol: 'WETH',
                  name: 'Wrapped Ether',
                },
                amount: '1',
              },
            ],
            isLoan: true,
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
              amount: '1918.015391',
            },
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
              amount: '1918.015391',
            },
            output: {
              token: {
                chainId: 137,
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                decimals: 18,
                symbol: 'WETH',
                name: 'Wrapped Ether',
              },
              amount: '1.004972655110971341',
            },
            slippage: 100,
          },
        },
        {
          rid: 'balancer-v2:flash-loan',
          fields: {
            id: '2d7fdf8e-0ecc-4d91-9549-601e8e5df5f3',
            outputs: [
              {
                token: {
                  chainId: 137,
                  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                  decimals: 18,
                  symbol: 'WETH',
                  name: 'Wrapped Ether',
                },
                amount: '1',
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
