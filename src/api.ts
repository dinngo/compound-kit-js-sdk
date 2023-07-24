import * as apisdk from '@protocolink/api';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as common from '@protocolink/common';

const client = axios.create({ baseURL: 'https://compound-kit-api.protocolink.com' });

axiosRetry(client, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

interface InitOptions {
  baseURL?: string;
}

export function init(options: InitOptions) {
  if (options.baseURL) {
    client.defaults.baseURL = options.baseURL;
  }
}

export { client };

export async function getApiVersion(): Promise<string> {
  const { data } = await client.get('/status');
  return data.version;
}

export async function quote(chainId: number, marketId: string, operation: string, data: any) {
  const resp = await client.post(`/v1/markets/${chainId}/${marketId}/${operation}`, data);
  return resp.data;
}

export async function buildRouterTransactionRequest(routerData: apisdk.RouterData): Promise<common.TransactionRequest> {
  const { data } = await client.post('/v1/transactions/build', routerData);
  return data;
}
