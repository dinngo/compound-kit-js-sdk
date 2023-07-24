import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface LeverageParams {
  account: string;
  token: common.TokenObject;
  amount: string;
  slippage?: number;
}

export interface LeverageQuotation {
  leverageTimes: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getLeverageQuotation(
  chainId: number,
  marketId: string,
  params: LeverageParams
): Promise<QuoteAPIResponseBody<LeverageQuotation>> {
  return quote(chainId, marketId, 'leverage', params);
}

export async function buildLeverageTransactionRequest(
  routerData: Pick<apisdk.RouterData, 'chainId' | 'account' | 'logics' | 'referralCode'>
) {
  return buildRouterTransactionRequest(routerData);
}
