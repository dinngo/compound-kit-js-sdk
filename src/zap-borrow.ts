import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface ZapBorrowParams {
  account: string;
  srcAmount?: string;
  destToken?: common.TokenObject;
  slippage?: number;
}

export interface ZapBorrowQuotation {
  destAmount: string;
  currentPosition: Position;
  targetPosition: Position;
}

export async function getZapBorrowQuotation(
  chainId: number,
  marketId: string,
  params: ZapBorrowParams
): Promise<QuoteAPIResponseBody<ZapBorrowQuotation>> {
  return quote(chainId, marketId, 'zap-borrow', params);
}

export async function buildZapBorrowTransactionRequest(
  routerData: Omit<apisdk.RouterData, 'permitData' | 'permitSig'>
) {
  return buildRouterTransactionRequest(routerData);
}
