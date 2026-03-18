import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const BASE_PATH = '/captacao-imoveis';

  // Rota para servir o logo.png a partir do arquivo real ou do base64
  const serveLogo = (req: express.Request, res: express.Response) => {
    console.log(`[Server] Request for logo: ${req.url}`);
    
    const publicDir = path.join(process.cwd(), 'public');
    const logoPath = path.join(publicDir, 'logo.png');
    const base64Path = path.join(publicDir, 'logo.png.base64');

    // 1. Tentar servir o arquivo logo.png real se ele existir
    if (fs.existsSync(logoPath)) {
      console.log(`[Server] Serving real logo.png from ${logoPath}`);
      return res.sendFile(logoPath);
    }

    // 2. Se não existir, tentar servir a partir do base64
    if (fs.existsSync(base64Path)) {
      try {
        console.log(`[Server] Serving logo from base64 file: ${base64Path}`);
        const base64Data = fs.readFileSync(base64Path, 'utf8').trim();
        const img = Buffer.from(base64Data, 'base64');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length,
          'Cache-Control': 'public, max-age=3600'
        });
        res.end(img);
        console.log(`[Server] Logo (base64) served successfully (${img.length} bytes)`);
      } catch (err) {
        console.error(`[Server] Error reading base64 logo file:`, err);
        res.status(500).send('Error reading logo');
      }
    } else {
      console.error(`[Server] Neither logo.png nor logo.png.base64 found in ${publicDir}`);
      res.status(404).send('Logo not found');
    }
  };

  app.get('/logo.png', serveLogo);
  app.get(`${BASE_PATH}/logo.png`, serveLogo);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      base: BASE_PATH,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(BASE_PATH, express.static(distPath));
    app.get(`${BASE_PATH}/*`, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
