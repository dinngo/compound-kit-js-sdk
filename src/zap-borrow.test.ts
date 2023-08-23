import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildZapBorrowTransactionRequest, getZapBorrowQuotation } from './zap-borrow';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Zap Borrow', function () {
  it('Test getZapBorrowQuotation', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x0fbeabcafcf817d47e10a7bcfc15ba194dbd4eef',
      amount: '1',
      targetToken: {
        chainId: 137,
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        symbol: 'USDT',
        name: '(PoS) Tether USD',
      },
      slippage: 100,
    };
    const resp = await getZapBorrowQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('targetTokenAmount', 'currentPosition', 'targetPosition');
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

  it('Test getZapBorrowQuotation without amount and targetToken', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      slippage: 100,
    };
    const resp = await getZapBorrowQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'logics');
    expect(resp.quotation).to.have.keys('targetTokenAmount', 'currentPosition', 'targetPosition');
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

  it('Test buildZapBorrowTransactionRequest', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const routerData: apisdk.RouterData = {
      chainId,
      account: '0x34693b4b0e8237854cee68251441a0bf301c4d65',
      logics: [
        {
          rid: 'compound-v3:borrow',
          fields: {
            marketId,
            output: {
              token: logics.compoundv3.polygonTokens.USDC,
              amount: '1',
            },
          },
        },
        {
          rid: 'paraswap-v5:swap-token',
          fields: {
            input: {
              token: logics.compoundv3.polygonTokens.USDC,
              amount: '1',
            },
            output: {
              token: {
                chainId: 137,
                address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                decimals: 6,
                symbol: 'USDT',
                name: '(PoS) Tether USD',
              },
              amount: '1.000281',
            },
            slippage: 100,
          },
        },
      ],
    };

    const transactionRequest = await buildZapBorrowTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
