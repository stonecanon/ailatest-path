import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

spawnSync(process.execPath, ["scripts/build.js"], { stdio: "inherit" });

const root = path.join(process.cwd(), "dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://localhost:${port}`);
  let filePath = path.join(root, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith("/")) filePath = path.join(filePath, "index.html");
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "content-type": types[path.extname(filePath)] || "application/octet-stream" });
    response.end(content);
  });
});

server.listen(port, () => {
  console.log(`AILatest Path dev server: http://localhost:${port}`);
});
