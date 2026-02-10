// server.js
const express = require('express');
const fs = require('fs/promises'); // Use fs.promises for async operations
const path = require('path');
const cors = require('cors'); // For cross-origin requests

const app = express();
const PORT = 3000;

// IMPORTANT: Configure your root photo directory here.
// Make sure this path is correct and accessible by the Node.js server.
// For example: const PHOTOS_ROOT_DIR = 'C:/Users/YourUser/Pictures/MyPhotos';
// Or for Linux/macOS: const PHOTOS_ROOT_DIR = '/home/youruser/Pictures/MyPhotos';
// UPDATED: 'photos' folder is now expected one level up from the server.js file
const PHOTOS_ROOT_DIR = path.resolve(__dirname, '../..', 'photo');

// Create the 'photos' directory if it doesn't exist (for testing purposes)
// Note: This will create it one level up if it doesn't exist.
fs.mkdir(PHOTOS_ROOT_DIR, { recursive: true }).catch(console.error);

// Middleware to allow cross-origin requests from your SvelteKit app
app.use(cors());

// Serve static image files from the PHOTOS_ROOT_DIR
// This allows the frontend to request images directly using their paths
app.use('/images', express.static(PHOTOS_ROOT_DIR));

/**
 * Recursively scans a directory and builds a tree of folders and image files.
 * @param {string} currentPath The current directory to scan.
 * @returns {Promise<Array>} A promise that resolves to an array of folder/file objects.
 */
async function scanDirectory(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    const result = [];

    for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(PHOTOS_ROOT_DIR, fullPath);

        if (entry.isDirectory()) {
            // Recursively scan subdirectories
            const children = await scanDirectory(fullPath);
            result.push({
                name: entry.name,
                type: 'folder',
                path: relativePath.replace(/\\/g, '/'), // Normalize path for web
                children: children
            });
        } else if (entry.isFile()) {
            // Check if it's an image file
            const ext = path.extname(entry.name).toLowerCase();
            // Added .avif and .tiff to the supported image extensions
            if (['.jpg', '.jpeg', '.jxl','.png', '.gif', '.bmp', '.webp', '.avif', '.tiff'].includes(ext)) {
                result.push({
                    name: entry.name,
                    type: 'file',
                    path: relativePath.replace(/\\/g, '/') // Normalize path for web
                });
            }
        }
    }
    return result;
}

// API endpoint to get the folder tree and file list
app.get('/api/photos', async (req, res) => {
    try {
        const tree = await scanDirectory(PHOTOS_ROOT_DIR);
        res.json(tree);
    } catch (error) {
        console.error('Error scanning directory:', error);
        res.status(500).json({ error: 'Failed to scan photo directory.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js backend running on http://localhost:${PORT}`);
    console.log(`Serving photos from: ${PHOTOS_ROOT_DIR}`);
    console.log('Ensure this directory contains your images and subfolders.');
});
