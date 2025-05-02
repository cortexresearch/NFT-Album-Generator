# Music Album NFT Website Generator

This project provides a simple template and a Node.js script to generate a static website for showcasing a music album as an NFT.

## Project Structure

To use this generator, organize your files in the following structure:

```
/your-album-project
├── index.html
├── script.js
├── style.css
├── generate.js
├── Album Art/
│   ├── your-album-art-1.jpg
│   ├── your-album-art-2.png
│   └── ...
└── Songs/
    ├── your-song-1.mp3
    ├── your-song-2.wav
    └── ...
```

-   `index.html`: The main HTML structure of the website.
-   `script.js`: The JavaScript code to handle album art navigation and audio playback.
-   `style.css`: The CSS for styling the website.
-   `generate.js`: The Node.js script to generate the final website files.
-   `Album Art/`: This directory should contain all your album art images (JPG, JPEG, PNG, GIF).
-   `Songs/`: This directory should contain all your music files (MP3, WAV, OGG).

## How to Use

1.  **Place your files:** Put your `index.html`, `script.js`, `style.css`, and `generate.js` files in the root of your project directory.
2.  **Add your album art:** Place your album art image files inside the `Album Art/` directory.
3.  **Add your songs:** Place your music files inside the `Songs/` directory.
4.  **Run the generator script:** Open your terminal, navigate to your project directory, and run the following command:

    ```bash
    node generate.js
    ```

5.  **View the generated website:** The script will create a new directory named `generated_album` in your project root. This directory contains the generated website files, including the updated `script.js` with paths to your specific album art and songs, and copies of your media files. You can open the `index.html` file inside the `generated_album` directory in your web browser to view your website.

## Customization

-   You can modify `style.css` to change the appearance of the website.
-   You can modify `index.html` to change the HTML structure.
-   The `generate.js` script automatically detects image files in `Album Art/` and audio files in `Songs/`. If you use different file types, you may need to modify the `generate.js` script to include them.
