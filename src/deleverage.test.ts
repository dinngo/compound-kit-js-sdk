import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildDeleverageTransactionRequest, getDeleverageQuotation } from './deleverage';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Deleverage', function () {
  it('Test getDeleverageQuotation', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0xa3C1C91403F0026b9dd086882aDbC8Cdbc3b3cfB',
      collateralToken: logics.compoundv3.polygonTokens.WETH,
      baseAmount: '50',
      slippage: 100,
    };
    const resp = await getDeleverageQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('currentPosition', 'targetPosition');
    expect(resp.quotation.currentPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'supplyUSD',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
    expect(resp.quotation.targetPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'supplyUSD',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
  });

  it('Test getDeleverageQuotation without collateral token and base amount', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0xa3C1C91403F0026b9dd086882aDbC8Cdbc3b3cfB',
      slippage: 100,
    };
    const resp = await getDeleverageQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('currentPosition', 'targetPosition');
    expect(resp.quotation.currentPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'supplyUSD',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
    expect(resp.quotation.targetPosition).to.have.keys(
      'utilization',
      'healthRate',
      'liquidationThreshold',
      'supplyUSD',
      'borrowUSD',
      'collateralUSD',
      'netAPR'
    );
  });

  it('Test buildDeleverageTransactionRequest', async function () {
    const routerData: apisdk.RouterData = {
      chainId: common.ChainId.polygon,
      account: '0xa3C1C91403F0026b9dd086882aDbC8Cdbc3b3cfB',
      logics: [
        {
          rid: 'utility:flash-loan-aggregator',
          fields: {
            id: '1b0a5aa2-159e-4e65-89d0-5d5515b37aec',
            protocolId: 'balancer-v2',
            loans: [
              {
                token: {
                  chainId: 137,
                  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                  decimals: 18,
                  symbol: 'WETH',
                  name: 'Wrapped Ether',
                },
                amount: '0.027839354558071959',
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
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                decimals: 18,
                symbol: 'WETH',
                name: 'Wrapped Ether',
              },
              amount: '0.027839354558071959',
            },
            output: {
              token: {
                chainId: 137,
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                decimals: 6,
                symbol: 'USDC',
                name: 'USD Coin (PoS)',
              },
              amount: '50',
            },
            slippage: 100,
          },
        },
        {
          rid: 'compound-v3:repay',
          fields: {
            marketId: 'USDC',
            borrower: '0xa3C1C91403F0026b9dd086882aDbC8Cdbc3b3cfB',
            input: {
              token: {
                chainId: 137,
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                decimals: 6,
                symbol: 'USDC',
                name: 'USD Coin (PoS)',
              },
              amount: '50',
            },
            balanceBps: 10000,
          },
        },
        {
          rid: 'compound-v3:withdraw-collateral',
          fields: {
            marketId: 'USDC',
            output: {
              token: {
                chainId: 137,
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                decimals: 18,
                symbol: 'WETH',
                name: 'Wrapped Ether',
              },
              amount: '0.027839354558071959',
            },
          },
        },
        {
          rid: 'utility:flash-loan-aggregator',
          fields: {
            id: '1b0a5aa2-159e-4e65-89d0-5d5515b37aec',
            protocolId: 'balancer-v2',
            loans: [
              {
                token: {
                  chainId: 137,
                  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                  decimals: 18,
                  symbol: 'WETH',
                  name: 'Wrapped Ether',
                },
                amount: '0.027839354558071959',
              },
            ],
            isLoan: false,
          },
        },
      ],
    };

    const transactionRequest = await buildDeleverageTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
