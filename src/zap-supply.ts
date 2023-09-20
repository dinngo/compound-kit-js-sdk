import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface ZapSupplyParams {
  account: string;
  srcToken?: common.TokenObject;
  srcAmount?: string;
  destToken?: common.TokenObject;
  slippage?: number;
}

export interface ZapSupplyQuotation {
  destAmount: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getZapSupplyQuotation(
  chainId: number,
  marketId: string,
  params: ZapSupplyParams,
  permit2Type?: apisdk.Permit2Type
): Promise<QuoteAPIResponseBody<ZapSupplyQuotation>> {
  return quote(chainId, marketId, 'zap-supply', params, permit2Type);
}

export async function buildZapSupplyTransactionRequest(routerData: apisdk.RouterData) {
  return buildRouterTransactionRequest(routerData);
}
