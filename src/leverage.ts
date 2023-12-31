import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface LeverageParams {
  account: string;
  collateralToken?: common.TokenObject;
  collateralAmount?: string;
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

export async function buildLeverageTransactionRequest(routerData: Omit<apisdk.RouterData, 'permitData' | 'permitSig'>) {
  return buildRouterTransactionRequest(routerData);
}
