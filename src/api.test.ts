import { MarketId } from './config';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, getApiVersion, quote } from './api';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import * as logics from '@protocolink/logics';

describe('API client', function () {
  it('Test getApiVersion', async function () {
    const version = await getApiVersion();
    expect(version).to.have.lengthOf.above(0);
  });

  it('Test quote', async function () {
    const chainId = common.ChainId.polygon;
    const marketId = MarketId.USDC;
    const params = {
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      token: logics.compoundv3.polygonTokens.WETH,
      amount: '1',
      slippage: 100,
    };
    const resp = await quote(chainId, marketId, 'leverage', params);
    expect(resp).to.have.keys('quotation', 'approvals', 'logics');
  });

  it('Test buildRouterTransactionRequest', async function () {
    const routerData: apisdk.RouterData = {
      chainId: common.ChainId.polygon,
      account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      logics: [
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
      ],
    };

    const transactionRequest = await buildRouterTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');
  });
});
