import { ZapTokenInfo } from './types';
import { client } from './api';
import * as common from '@protocolink/common';

export async function getZapTokens(chainId: number): Promise<ZapTokenInfo> {
  const { data } = await client.get(`/v1/${chainId}/zap-tokens`);
  return common.classifying(data);
}
