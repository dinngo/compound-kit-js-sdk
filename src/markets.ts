import { MarketGroup, MarketInfo } from './types';
import { client } from './api';
import * as common from '@protocolink/common';

export async function getMarketGroups(): Promise<MarketGroup[]> {
  const { data } = await client.get('/v1/markets');
  return data.marketGroups;
}

export async function getMarketInfo(chainId: number, marketId: string, account?: string): Promise<MarketInfo> {
  const { data } = await client.get(`/v1/markets/${chainId}/${marketId}${account ? '?account=' + account : ''}`);
  return common.classifying(data);
}
