import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildCollateralSwapTransactionRequest, getCollateralSwapQuotation } from './collateral-swap';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Collateral Swap', function () {
  it('Test getCollateralSwapQuotation', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x0fbeabcafcf817d47e10a7bcfc15ba194dbd4eef',
      srcToken: logics.compoundv3.polygonTokens.WETH,
      srcAmount: '0.01',
      destToken: logics.compoundv3.polygonTokens.WMATIC,
      slippage: 100,
    };
    const resp = await getCollateralSwapQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('destAmount', 'currentPosition', 'targetPosition');
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

  it('Test getCollateralSwapQuotation without source token, source amount and destination token', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      slippage: 100,
    };
    const resp = await getCollateralSwapQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('destAmount', 'currentPosition', 'targetPosition');
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

  it('Test buildCollateralSwapTransactionRequest', async function () {
    const routerData: apisdk.RouterData = {
      chainId: common.ChainId.polygon,
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      logics: [
        {
          rid: 'utility:flash-loan-aggregator',
          fields: {
            id: 'cc38abe7-7352-43e4-9695-fd3d5d684770',
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
                amount: '1',
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
              amount: '1',
            },
            output: {
              token: {
                chainId: 137,
                address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
                decimals: 18,
                symbol: 'WMATIC',
                name: 'Wrapped Matic Token',
              },
              amount: '2894.958779120659146087',
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
                address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
                decimals: 18,
                symbol: 'WMATIC',
                name: 'Wrapped Matic Token',
              },
              amount: '2894.958779120659146087',
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
              amount: '1',
            },
          },
        },
        {
          rid: 'utility:flash-loan-aggregator',
          fields: {
            id: 'cc38abe7-7352-43e4-9695-fd3d5d684770',
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
                amount: '1',
              },
            ],
            isLoan: false,
          },
        },
      ],
    };

    const transactionRequest = await buildCollateralSwapTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
