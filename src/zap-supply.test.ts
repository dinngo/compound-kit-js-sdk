import { MarketId } from 'src/config';
import * as apisdk from '@protocolink/api';
import { buildZapSupplyTransactionRequest, getZapSupplyQuotation } from './zap-supply';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('Zap Supply', function () {
  it('Test getZapSupplyQuotation', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x1eed63efba5f81d95bfe37d82c8e736b974f477b',
      srcToken: logics.compoundv3.polygonTokens.WETH,
      srcAmount: '1',
      destToken: logics.compoundv3.polygonTokens.WMATIC,
      slippage: 100,
    };
    const resp = await getZapSupplyQuotation(chainId, marketId, params);
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

  it('Test getZapSupplyQuotation without source token, source amount and destination token', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x1eed63efba5f81d95bfe37d82c8e736b974f477b',
      slippage: 100,
    };
    const resp = await getZapSupplyQuotation(chainId, marketId, params);
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

  it('Test buildZapSupplyTransactionRequest', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const routerData: apisdk.RouterData = {
      chainId,
      account: '0x1eed63efba5f81d95bfe37d82c8e736b974f477b',
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
          rid: 'compound-v3:supply-base',
          fields: {
            marketId,
            input: {
              token: logics.compoundv3.polygonTokens.USDC,
              amount: '0.999527',
            },
            output: {
              token: logics.compoundv3.polygonTokens.cUSDCv3,
              amount: '0.999527',
            },
            balanceBps: 10000,
          },
        },
      ],
    };

    const transactionRequest = await buildZapSupplyTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
