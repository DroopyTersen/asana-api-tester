type ApiResult = {
  success: boolean;
  status: number;
};

export const createApiClient = (
  baseUrl: string,
  ensureToken: () => Promise<string>
) => {
  const request = async <T = any>(path: string, method = "GET", body: any) => {
    const url = baseUrl + path;
    console.log("🚀 | url", url);
    const token = await ensureToken();
    let reqOpts: RequestInit = {
      method,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    if (body) {
      reqOpts.body = JSON.stringify(body);
    }
    const resp = await fetch(url, reqOpts);
    const responseBody = await resp.json();

    const result: ApiResult & T = {
      status: resp.status,
      success: resp.ok,
      ...responseBody,
    };
    if (!resp.ok) {
      throw result;
    }

    return result;
  };
  return {
    request,
  };
};
