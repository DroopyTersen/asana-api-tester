import { createApiClient } from "../createApiClient";

const TOKEN = process.env.ASANA_PAT;
const BASE_URL = "https://app.asana.com/api/1.0";

const asanaClient = createApiClient(BASE_URL, () =>
  Promise.resolve(TOKEN + "")
);

export default function asanaRequest<T>(
  path: string,
  method?: string,
  body?: any
) {
  return asanaClient.request<{ data: T }>(path, method, body);
}
