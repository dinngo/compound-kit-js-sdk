import * as apisdk from '@protocolink/api';
import * as common from '@protocolink/common';

export interface MarketGroup {
  chainId: number;
  markets: {
    id: string;
    label: string;
  }[];
}

export interface CollateralInfo {
  asset: common.Token;
  assetPrice: string;
  borrowCollateralFactor: string;
  liquidateCollateralFactor: string;
  collateralBalance: string;
  collateralUSD: string;
  borrowCapacity: string;
  borrowCapacityUSD: string;
}

export interface MarketInfo {
  baseToken: common.Token;
  baseTokenPrice: string;
  baseBorrowMin: string;
  supplyAPR: string;
  supplyBalance: string;
  supplyUSD: string;
  borrowAPR: string;
  borrowBalance: string;
  borrowUSD: string;
  collateralUSD: string;
  borrowCapacity: string;
  borrowCapacityUSD: string;
  availableToBorrow: string;
  availableToBorrowUSD: string;
  liquidationLimit: string;
  liquidationThreshold: string;
  liquidationRisk: string;
  liquidationPoint: string;
  liquidationPointUSD: string;
  utilization: string;
  healthRate: string;
  netAPR: string;
  collaterals: CollateralInfo[];
}

export interface Position {
  utilization: string;
  healthRate: string;
  liquidationThreshold: string;
  supplyUSD: string;
  borrowUSD: string;
  collateralUSD: string;
  netAPR: string;
}

export type QuoteAPIResponseBody<T = any> = Pick<apisdk.RouterDataEstimateResult, 'fees' | 'approvals' | 'permitData'> &
  Pick<apisdk.RouterData, 'logics'> & {
    quotation: T;
  };
