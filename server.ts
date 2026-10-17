import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure uploads directories exist
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Parse JSON bodies with generous limit for dataUrls if needed
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve uploaded files statically with byte-range streaming support for videos
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    res.setHeader('Accept-Ranges', 'bytes');
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (filePath.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    }
  }
}));

// Multer storage engine for video files
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEOS_DIR);
  },
  filename: (req, file, cb) => {
    // Sanitize and append timestamp to prevent filename collision
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitized) || '.mp4';
    const base = path.basename(sanitized, ext).slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB limit
  },
  fileFilter: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/') ||
      file.originalname.match(/\.(mp4|webm|mov|ogg|m4v|avi|mkv)$/i);
    const isImage = file.mimetype.startsWith('image/');
    if (isVideo || isImage) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a video or image file.'));
    }
  },
});

// ================= API ROUTES =================

/**
 * Upload a video file to the server
 */
app.post('/api/upload-video', (req, res) => {
  uploadVideo.single('video')(req as any, res as any, (err: any) => {
    if (err) {
      console.error('Video upload error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to upload video',
      });
    }

    // Try 'video' field first, fallback to 'file' field
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No video file provided in form field "video"',
      });
    }

    const publicUrl = `/uploads/videos/${file.filename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: Date.now(),
    });
  });
});

/**
 * Fallback Base64 / DataURL video uploader
 */
app.post('/api/upload-base64', (req, res) => {
  try {
    const { dataUrl, filename, mediaType } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'Missing dataUrl payload' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid data URL format' });
    }

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const isVideo = mime.startsWith('video/') || mediaType === 'video';
    const targetDir = isVideo ? VIDEOS_DIR : IMAGES_DIR;
    const subfolder = isVideo ? 'videos' : 'images';
    const ext = isVideo ? '.mp4' : '.webp';
    const cleanName = (filename || 'media').replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFilename = `${cleanName}-${Date.now()}${ext}`;
    const filePath = path.join(targetDir, safeFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${subfolder}/${safeFilename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      size: buffer.length,
      mimetype: mime,
    });
  } catch (err: any) {
    console.error('Base64 upload error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * List all uploaded videos stored on the server
 */
app.get('/api/videos', (req, res) => {
  try {
    if (!fs.existsSync(VIDEOS_DIR)) {
      return res.json({ success: true, videos: [] });
    }

    const files = fs.readdirSync(VIDEOS_DIR);
    const videoList = files
      .filter((file) => !file.startsWith('.') && file.match(/\.(mp4|webm|mov|ogg|m4v)$/i))
      .map((file) => {
        const filePath = path.join(VIDEOS_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          url: `/uploads/videos/${file}`,
          size: stats.size,
          createdAt: stats.birthtimeMs || stats.mtimeMs,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return res.json({ success: true, videos: videoList });
  } catch (err: any) {
    console.error('Failed to list videos:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve videos' });
  }
});

/**
 * Delete a video stored on the server
 */
app.delete('/api/videos/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(VIDEOS_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Video deleted from server' });
    } else {
      return res.status(404).json({ success: false, error: 'Video file not found' });
    }
  } catch (err: any) {
    console.error('Failed to delete video:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete video' });
  }
});

// ================= FRONTEND / VITE INTEGRATION =================

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
