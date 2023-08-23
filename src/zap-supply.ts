import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface ZapSupplyParams {
  account: string;
  sourceToken?: common.TokenObject;
  amount?: string;
  targetToken?: common.TokenObject;
  slippage?: number;
}

export interface ZapSupplyQuotation {
  targetTokenAmount: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getZapSupplyQuotation(
  chainId: number,
  marketId: string,
  params: ZapSupplyParams
): Promise<QuoteAPIResponseBody<ZapSupplyQuotation>> {
  return quote(chainId, marketId, 'zap-supply', params);
}

export async function buildZapSupplyTransactionRequest(
  routerData: Pick<apisdk.RouterData, 'chainId' | 'account' | 'logics' | 'referralCode'>
) {
  return buildRouterTransactionRequest(routerData);
}
