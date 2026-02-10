# Photo Backend App

A Node.js/Express backend server that scans a local directory for photos and serves them via an API.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)

## Installation

1. Clone the repository or navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The server expects a `photo` directory to be located two levels up from the project root (`../../photo`). 

You can modify the `PHOTOS_ROOT_DIR` constant in `server.js` if your photo collection is stored in a different location:

```javascript
// server.js
const PHOTOS_ROOT_DIR = path.resolve(__dirname, '../..', 'photo');
```

## Usage

Start the server:
```bash
npm start
```

The server will run at `http://localhost:3000`.

## API Endpoints

### `GET /api/photos`
Returns a JSON representation of the folder structure and image files found in the configured photo directory. Supported formats include: `.jpg`, `.jpeg`, `.jxl`, `.png`, `.gif`, `.bmp`, `.webp`, `.avif`, and `.tiff`.

### `GET /images/*`
Serves static image files directly. For example, if you have a photo at `vacation/beach.jpg`, you can access it at `http://localhost:3000/images/vacation/beach.jpg`.
