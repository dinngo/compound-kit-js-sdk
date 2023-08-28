import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface ZapRepayParams {
  account: string;
  srcToken?: common.TokenObject;
  srcAmount?: string;
  slippage?: number;
}

export interface ZapRepayQuotation {
  destAmount: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getZapRepayQuotation(
  chainId: number,
  marketId: string,
  params: ZapRepayParams
): Promise<QuoteAPIResponseBody<ZapRepayQuotation>> {
  return quote(chainId, marketId, 'zap-repay', params);
}

export async function buildZapRepayTransactionRequest(
  routerData: Pick<apisdk.RouterData, 'chainId' | 'account' | 'logics' | 'referralCode'>
) {
  return buildRouterTransactionRequest(routerData);
}
