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
        const zapTokens = await getZapTokens(chainId);
        expect(zapTokens).to.have.lengthOf.above(0);
      });
    });
  });
});
