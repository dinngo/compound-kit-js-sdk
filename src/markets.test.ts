import { MarketId } from 'src/config';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import { getMarketGroups, getMarketInfo } from './markets';

describe('Markets', function () {
  it('Test getMarketGroups', async function () {
    const marketGroups = await getMarketGroups();
    expect(marketGroups).to.have.lengthOf.above(0);
    for (const marketGroup of marketGroups) {
      expect(marketGroup).to.have.all.keys(['chainId', 'markets']);
      for (const market of marketGroup.markets) {
        expect(market).to.have.all.keys(['id', 'label']);
      }
    }
  });

  context('Test getMarketInfo', async function () {
    const testCases = [
      {
        title: 'no account',
        chainId: common.ChainId.polygon,
        marketId: MarketId.USDC,
      },
      {
        title: 'with account',
        chainId: common.ChainId.polygon,
        marketId: MarketId.USDC,
        account: '0x9fC7D6E7a3d4aB7b8b28d813f68674C8A6e91e83',
      },
    ];

    testCases.forEach(({ title, chainId, marketId, account }) => {
      it(title, async function () {
        const marketInfo = await getMarketInfo(chainId, marketId, account);
        expect(marketInfo).to.have.all.keys([
          'baseToken',
          'baseTokenPrice',
          'baseBorrowMin',
          'supplyAPR',
          'supplyBalance',
          'supplyUSD',
          'borrowAPR',
          'borrowBalance',
          'borrowUSD',
          'collateralUSD',
          'borrowCapacity',
          'borrowCapacityUSD',
          'availableToBorrow',
          'availableToBorrowUSD',
          'liquidationLimit',
          'liquidationThreshold',
          'liquidationRisk',
          'liquidationPoint',
          'liquidationPointUSD',
          'utilization',
          'healthRate',
          'netAPR',
          'collaterals',
        ]);
        for (const collateral of marketInfo.collaterals) {
          expect(collateral).to.have.all.keys([
            'asset',
            'assetPrice',
            'borrowCollateralFactor',
            'liquidateCollateralFactor',
            'collateralBalance',
            'collateralUSD',
            'borrowCapacity',
            'borrowCapacityUSD',
          ]);
        }
      });
    });
  });
});
