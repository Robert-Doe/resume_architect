import { createReadStream, existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const distDir = new URL("../dist/", import.meta.url);
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const resolveFilePath = (requestUrl) => {
  const url = new URL(requestUrl, `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const sanitized = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  const target = join(distDir.pathname, sanitized);

  if (existsSync(target)) {
    return target;
  }

  return join(distDir.pathname, "index.html");
};

const server = createServer(async (request, response) => {
  const filePath = resolveFilePath(request.url || "/");

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      response.writeHead(302, { Location: "/" });
      response.end();
      return;
    }

    const mimeType = mimeTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Length": stat.size,
      "Content-Type": mimeType,
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Resume Architect preview is running at http://127.0.0.1:${port}`);
});
