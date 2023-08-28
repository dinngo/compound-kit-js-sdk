import * as common from '@protocolink/common';
import { expect } from 'chai';
import { getZapTokens } from './zap-tokens';

describe('Zap Tokens', function () {
  context('Test getZapTokens', async function () {
    const testCases = [
      {
        title: 'valid chainId',
        chainId: common.ChainId.polygon,
      },
    ];

    testCases.forEach(({ title, chainId }) => {
      it(title, async function () {
        const tokenInfo = await getZapTokens(chainId);
        for (const token of tokenInfo.tokens) {
          expect(token).to.have.all.keys(['chainId', 'address', 'decimals', 'symbol', 'name']);
        }
      });
    });
  });
});
