import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useRouteData,
} from "remix";
import asanaRequest from "../../services/asana/asanaRequest";
import React, { useEffect } from "react";
import usePersistedState from "../../hooks/usePersistedState";

export const loader: LoaderFunction = async ({ request }) => {
  let querystring = request.url.split("?")?.[1];
  let queryParams = new URLSearchParams(querystring);
  let path = queryParams.get("path");
  let method = queryParams.get("method") || "GET";
  let pat = queryParams.get("pat");
  let body = queryParams.get("body");
  let data = path
    ? await asanaRequest(path, method, body).catch((err) => err)
    : null;

  return {
    id: querystring,
    data,
    path,
    method,
    body,
  };
};

interface TestResult {
  id: string;
  data: any;
  path: string;
  method: string;
  body: any;
}

const HISTORY_CACHE_KEY = "asana-api-test-history";
export default function () {
  let routeData = useRouteData<TestResult>();
  let [pat, setPat] = usePersistedState<string>("", "asana-pat");
  let [history, setHistory] = usePersistedState<TestResult[]>(
    [],
    HISTORY_CACHE_KEY
  );

  useEffect(() => {
    if (routeData.id) {
      console.log("setting history", routeData.path, history);
      setHistory((prev) => [...prev, routeData]);
    }
  }, [routeData?.id]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "33% 66%" }}>
      <div>
        {history.reverse().map((item) => (
          <div
            key={item.id}
            style={{ padding: "16px 5px", borderBottom: "1px solid #eee" }}
          >
            <Link to={"/asana/tester?" + item.id}>
              <div>{item.method}</div>
              <div>{item.path}</div>
            </Link>
          </div>
        ))}
      </div>
      <div>
        <form method="get">
          {/* <div>
            <label>
              Personal Access Token
              <br />
              <input
                name="pat"
                id="pat"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                style={{ marginBottom: "10px", width: "100%" }}
              />
            </label>
          </div> */}
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "10px" }}>
              <label htmlFor="method">Method</label>
              <br />
              <select name="method" defaultValue={routeData.method} id="method">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div style={{ flex: "1 1 100%" }}>
              <label htmlFor="path">API Path</label>
              <br />
              <input
                id="path"
                name="path"
                placeholder="/workspaces"
                defaultValue={routeData.path}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div>
            <button style={{ marginTop: "10px", fontSize: "2rem" }}>
              Send it!
            </button>
          </div>
        </form>
        <div>
          <pre
            style={{
              padding: "5px",
              background: "#eee",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(routeData.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
