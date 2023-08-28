import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildZapWithdrawTransactionRequest, getZapWithdrawQuotation } from './zap-withdraw';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Zap Withdraw', function () {
  it('Test getZapWithdrawQuotation', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x43fc188f003e444e9e538189fc675acdfb8f5d12',
      srcToken: logics.compoundv3.polygonTokens.USDC,
      srcAmount: '1',
      destToken: {
        chainId: 137,
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        symbol: 'USDT',
        name: '(PoS) Tether USD',
      },
      slippage: 100,
    };
    const resp = await getZapWithdrawQuotation(chainId, marketId, params);
    expect(resp).to.have.keys('quotation', 'fees', 'approvals', 'permitData', 'logics');
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

  it('Test getZapWithdrawQuotation without source token, source amount and destination token', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x8238892095d3bac5322894e84f349bcd52f843d5',
      slippage: 100,
    };
    const resp = await getZapWithdrawQuotation(chainId, marketId, params);
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

  it('Test buildZapWithdrawTransactionRequest', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const routerData: apisdk.RouterData = {
      chainId,
      account: '0xf5eec99fe826612b762856bbd01c5e6ec62462a4',
      logics: [
        {
          rid: 'compound-v3:withdraw-base',
          fields: {
            marketId,
            input: {
              token: logics.compoundv3.polygonTokens.cUSDCv3,
              amount: '1',
            },
            output: {
              token: logics.compoundv3.polygonTokens.USDC,
              amount: '1',
            },
            balanceBps: 10000,
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
              amount: '1.000359',
            },
            slippage: 100,
          },
        },
      ],
    };

    const transactionRequest = await buildZapWithdrawTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
