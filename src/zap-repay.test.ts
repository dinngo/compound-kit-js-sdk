import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildZapRepayTransactionRequest, getZapRepayQuotation } from './zap-repay';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Zap Repay', function () {
  it('Test getZapRepayQuotation with permit permit2Type', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x0FBeABcaFCf817d47E10a7bCFC15ba194dbD4EEF',
      srcToken: {
        chainId: 137,
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        symbol: 'USDT',
        name: '(PoS) Tether USD',
      },
      srcAmount: '1',
      slippage: 100,
    };
    const resp = await getZapRepayQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'permitData', 'logics');
    expect(resp.quotation).to.have.keys('destAmount', 'currentPosition', 'targetPosition');
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

  it('Test getZapRepayQuotation with approve permit2Type', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x0FBeABcaFCf817d47E10a7bCFC15ba194dbD4EEF',
      srcToken: {
        chainId: 137,
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        symbol: 'USDT',
        name: '(PoS) Tether USD',
      },
      srcAmount: '1',
      slippage: 100,
    };
    const resp = await getZapRepayQuotation(chainId, marketId, params, 'approve');
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('destAmount', 'currentPosition', 'targetPosition');
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

  it('Test getZapRepayQuotation without source token and source amount', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0xF6Da9e9D73d7893223578D32a95d6d7de5522767',
      slippage: 100,
    };
    const resp = await getZapRepayQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('destAmount', 'currentPosition', 'targetPosition');
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

  it('Test buildZapRepayTransactionRequest', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const routerData: apisdk.RouterData = {
      chainId,
      account: '0xF6Da9e9D73d7893223578D32a95d6d7de5522767',
      logics: [
        {
          rid: 'paraswap-v5:swap-token',
          fields: {
            input: {
              token: {
                chainId: 137,
                address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                decimals: 6,
                symbol: 'USDT',
                name: '(PoS) Tether USD',
              },
              amount: '1',
            },
            output: {
              token: logics.compoundv3.polygonTokens.USDC,
              amount: '0.999527',
            },
            slippage: 100,
          },
        },
        {
          rid: 'compound-v3:repay',
          fields: {
            marketId,
            borrower: '0xF6Da9e9D73d7893223578D32a95d6d7de5522767',
            input: {
              token: logics.compoundv3.polygonTokens.USDC,
              amount: '0.999527',
            },
            balanceBps: 10000,
          },
        },
      ],
    };

    const transactionRequest = await buildZapRepayTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
