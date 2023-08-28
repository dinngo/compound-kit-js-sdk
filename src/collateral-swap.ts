import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface CollateralSwapParams {
  account: string;
  srcToken?: common.TokenObject;
  srcAmount?: string;
  destToken?: common.TokenObject;
  slippage?: number;
}

export interface CollateralSwapQuotation {
  destAmount: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getCollateralSwapQuotation(
  chainId: number,
  marketId: string,
  params: CollateralSwapParams
): Promise<QuoteAPIResponseBody<CollateralSwapQuotation>> {
  return quote(chainId, marketId, 'collateral-swap', params);
}

export async function buildCollateralSwapTransactionRequest(
  routerData: Pick<apisdk.RouterData, 'chainId' | 'account' | 'logics' | 'referralCode'>
) {
  return buildRouterTransactionRequest(routerData);
}
