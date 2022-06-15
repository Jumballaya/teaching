import fs from 'fs';
import path from 'path';
import { NextFunction } from "./interfaces/next-function.interface";
import { RouteHandler } from "./interfaces/route-handler.interface";
import { Request } from "./Request";
import { Response } from "./Response";

export const defaultRoute = (_: Request, res: Response) => {
  res.setStatus(404);
  res.setHeaders({ 'Content-Type': 'text/html' });
  res.send('<html><body><h1>404 Not Found</h1></body></html>');
}

export const errorRoute = (req: Request, res: Response) => {
  res.setStatus(500);
  res.setHeaders({ 'Content-Type': 'application/json' });
  res.json({
    code: 500,
    status: 'ERROR',
    message: req.params.message,
  });
}

export const parseBody = (contentType: string, body: Buffer): Record<string, any> => {
  if (contentType !== 'application/json') {
    return {};
  }
  return JSON.parse(body.toString());
}

export const createNextFunction = (
  handlers: RouteHandler[],
  request: Request,
  response: Response,
): NextFunction => {
  let index = 0;
  const next = (err?: any) => {
    index++;
    if (err) {
      throw new Error(err);
    }

    if (index <= handlers.length) {
      handlers[index](request, response, next);
    }
  }
  return next;
}

export const logRoute = (req: Request, res: Response, next?: NextFunction) => {
  const method = req.req.method;
  const url = req.req.url;
  const status = res.getStatus();
  const msg = `[${method?.toUpperCase()}] - ${status} | ${url}`;
  console.log(msg);
  if (next) {
    next();
  }
}

export const fileRoute = (folder: string) => (req: Request, res: Response) => {
  const filename = req.params.filename;
  const fp = path.resolve(folder, filename);

  fs.readFile(fp, (err, data) => {
    if (err !== null) {
      defaultRoute(req, res);
      return;
    }
    const mimeType = getMimeType(filename.split('.')[1] || '');
    const acceptHeader = req.req.headers.accept;
    const accept = acceptHeader ? acceptHeader : '';
    const contentType = mimeType ? mimeType : accept;
    res.setHeaders({
      'Content-Type': contentType,
    });
    if (contentType.startsWith('text') || contentType.includes('javascript')) {
      res.send(data.toString());
      return;
    }
    res.send(data);
  });

}

const getMimeType = (ext: string): string => {
  if (ext.startsWith('.')) {
    ext = ext.slice(1);
  }
  switch (ext) {
    case 'html': {
      return 'text/html';
    }

    case 'js': {
      return 'application/javascript';
    }

    case 'css': {
      return 'text/css';
    }

    case 'apng':
    case 'png':
    case 'jpeg':
    case 'gif': {
      return `image/${ext}`;
    }

    case 'svg': {
      return 'image/svg+xml';
    }

    case 'ttf':
    case 'woff':
    case 'ttf': {
      return `font/${ext}`;
    }

    case 'pdf':
    case 'json': {
      return `application/${ext}`;
    }

    case 'txt': {
      return 'text/plain'
    }

    case 'csv': {
      return 'text/csv';
    }

    default: {
      return '';
    }

  }
}