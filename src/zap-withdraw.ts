import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface ZapWithdrawParams {
  account: string;
  withdrawalToken?: common.TokenObject;
  amount?: string;
  targetToken?: common.TokenObject;
  slippage?: number;
}

export interface ZapWithdrawQuotation {
  targetTokenAmount: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getZapWithdrawQuotation(
  chainId: number,
  marketId: string,
  params: ZapWithdrawParams
): Promise<QuoteAPIResponseBody<ZapWithdrawQuotation>> {
  return quote(chainId, marketId, 'zap-withdraw', params);
}

export async function buildZapWithdrawTransactionRequest(
  routerData: Pick<apisdk.RouterData, 'chainId' | 'account' | 'logics' | 'referralCode'>
) {
  return buildRouterTransactionRequest(routerData);
}
