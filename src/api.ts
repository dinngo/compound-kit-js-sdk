import axios from 'axios';
import axiosRetry from 'axios-retry';

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
