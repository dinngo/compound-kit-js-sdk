import { Position, QuoteAPIResponseBody } from './types';
import * as apisdk from '@protocolink/api';
import { buildRouterTransactionRequest, quote } from './api';
import * as common from '@protocolink/common';

export interface DeleverageParams {
  account: string;
  token?: common.TokenObject;
  amount?: string;
  slippage?: number;
}

export interface DeleverageQuotation {
  currentPosition: Position;
  targetPosition: Position;
}

export async function getDeleverageQuotation(
  chainId: number,
  marketId: string,
  params: DeleverageParams
): Promise<QuoteAPIResponseBody<DeleverageQuotation>> {
  return quote(chainId, marketId, 'deleverage', params);
}

export async function buildDeleverageTransactionRequest(
  routerData: Pick<apisdk.RouterData, 'chainId' | 'account' | 'logics' | 'referralCode'>
) {
  return buildRouterTransactionRequest(routerData);
}
