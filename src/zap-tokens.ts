import { client } from './api';
import * as common from '@protocolink/common';

export async function getZapTokens(chainId: number): Promise<common.Token[]> {
  const resp = await client.get(`/v1/${chainId}/zap-tokens`);
  return common.classifying(resp.data.tokens);
}
