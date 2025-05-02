const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileInput');
const fileSelectButton = document.getElementById('fileSelectButton');
const fileList = document.querySelector('#file-list ul');
const generateBtn = document.getElementById('generate-btn');
const downloadLinkDiv = document.getElementById('download-link');
const downloadZipLink = document.getElementById('download-zip');

let selectedFiles = [];

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when dragging over
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Handle file selection button click
fileSelectButton.addEventListener('click', () => {
    fileInput.click();
});

// Handle file input change
fileInput.addEventListener('change', handleFiles);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}

function handleFiles(e) {
    const files = [...e.target.files];
    selectedFiles = selectedFiles.concat(files);
    displayFiles();
    updateGenerateButtonState();
}

function displayFiles() {
    fileList.innerHTML = ''; // Clear current list
    selectedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = file.name;
        li.dataset.index = index; // Store original index or a unique identifier if needed later
        fileList.appendChild(li);
    });
    initializeSortable(); // Initialize sortable after displaying files
}

function updateGenerateButtonState() {
    // Check if there's at least one image and one audio file
    const hasImage = selectedFiles.some(file => file.type.startsWith('image/'));
    const hasAudio = selectedFiles.some(file => file.type.startsWith('audio/'));
    generateBtn.disabled = !(hasImage && hasAudio);
}

// Initialize Sortable.js
let sortableInstance = null;
function initializeSortable() {
    if (sortableInstance) {
        sortableInstance.destroy(); // Destroy previous instance if it exists
    }
    sortableInstance = Sortable.create(fileList, {
        animation: 150,
        onEnd: function (evt) {
            // Update the selectedFiles array based on the new order
            const movedItem = selectedFiles[evt.oldIndex];
            selectedFiles.splice(evt.oldIndex, 1);
            selectedFiles.splice(evt.newIndex, 0, movedItem);
            // Re-render the list to update data-index if necessary, or rely on the updated selectedFiles order
            // For simplicity, we'll rely on the updated selectedFiles order for generation
        },
    });
}


generateBtn.addEventListener('click', generateWebsite);

function generateWebsite() {
    console.log('Generating website with files:', selectedFiles);
    // This is where the core logic to generate index.html, script.js, style.css
    // and include the uploaded files will go.
    // It will then zip the files and provide a download link.

    // Example placeholder for zipping and download (requires JSZip library)
    // const zip = new JSZip();
    // zip.file("index.html", "..."); // Generated index.html content
    // zip.file("script.js", "..."); // Generated script.js content
    // zip.file("style.css", "..."); // Generated style.css content
    //
    // const albumArtDir = zip.folder("Album Art");
    // const songsDir = zip.folder("Songs");
    //
    // selectedFiles.forEach(file => {
    //     if (file.type.startsWith('image/')) {
    //         albumArtDir.file(file.name, file);
    //     } else if (file.type.startsWith('audio/')) {
    //         songsDir.file(file.name, file);
    //     }
    // });
    //
    // zip.generateAsync({ type: "blob" }).then(function(content) {
    //     const url = URL.createObjectURL(content);
    //     downloadZipLink.href = url;
    //     downloadZipLink.download = 'nft_album_website.zip';
    //     downloadLinkDiv.style.display = 'block';
    // });

    // For now, just log and enable download link placeholder
    // After actual generation, enable the download link
    // downloadLinkDiv.style.display = 'block';
}

// Template content (copied from previous read_file results)
const indexTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFT Album</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="album-container">
        <!-- Album art pages will be added here by JavaScript -->
        <!-- Example structure:
        <div class="page">
            <img src="Album Art/1.jpg" alt="Album Art 1">
        </div>
        -->
    </div>

    <div class="controls">
        <button id="back-btn">Back</button>
        <button id="play-pause-btn">Play</button>
        <button id="stop-btn">Stop</button>
        <button id="forward-btn">Forward</button>
    </div>

    <audio id="audio-player"></audio>

    <script src="script.js"></script>
</body>
</html>`;

const scriptTemplate = `const albumContainer = document.querySelector('.album-container');
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');

// Hardcoded list of album art images based on initial file listing
const albumArt = [
    'Album Art/1.jpg',
    'Album Art/2.jpg',
    'Album Art/3.gif',
    'Album Art/4.jpg'
];

// Hardcoded list of songs based on initial file listing
const playlist = [
    'Songs/1. Something Else.mp3',
    'Songs/2. Love Like Diamonds.mp3',
    'Songs/3. Choice.mp3',
    'Songs/4. Replay.mp3',
    'Songs/5. Immature.mp3'
];

let currentPageIndex = 0;
let currentSongIndex = 0;
let isPlaying = false;

// Function to load album art pages
function loadAlbumArt() {
    albumArt.forEach((imagePath, index) => {
        const page = document.createElement('div');
        page.classList.add('page');
        if (index !== 0) {
            page.style.transform = \`translateX(\${index * 100}%)\`;
        }
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = \`Album Art \${index + 1}\`;
        page.appendChild(img);
        albumContainer.appendChild(page);
    });
}

// Function to update page display
function updatePageDisplay() {
    const pages = albumContainer.querySelectorAll('.page');
    pages.forEach((page, index) => {
        page.style.transform = \`translateX(\${(index - currentPageIndex) * 100}%)\`;
    });
}

// Navigation functions
function nextPage() {
    currentPageIndex = (currentPageIndex + 1) % albumArt.length;
    updatePageDisplay();
}

function prevPage() {
    currentPageIndex = (currentPageIndex - 1 + albumArt.length) % albumArt.length;
    updatePageDisplay();
}

// Audio control functions
function playSong() {
    if (!isPlaying) {
        audioPlayer.src = playlist[currentSongIndex];
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
        isPlaying = true;
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
        isPlaying = false;
    }
}

function stopSong() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playPauseBtn.textContent = 'Play';
    isPlaying = false;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    audioPlayer.src = playlist[currentSongIndex];
    audioPlayer.play();
    playPauseBtn.textContent = 'Pause'; // Ensure button shows Pause
    isPlaying = true; // Ensure state is playing
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    audioPlayer.src = playlist[currentSongIndex];
    audioPlayer.play();
    playPauseBtn.textContent = 'Pause'; // Ensure button shows Pause
    isPlaying = true; // Ensure state is playing
}

// Event listeners for controls
playPauseBtn.addEventListener('click', playSong);
stopBtn.addEventListener('click', stopSong);
forwardBtn.addEventListener('click', nextSong);
backBtn.addEventListener('click', prevSong);

// Event listener for when a song ends
audioPlayer.addEventListener('ended', nextSong);

// Basic swipe/drag functionality (simplified)
let startX = 0;
let isDragging = false;

albumContainer.addEventListener('click', nextPage);

// Initialize the album
loadAlbumArt();
updatePageDisplay(); // Ensure initial page is displayed correctly`;

const styleTemplate = `body {
    margin: 0;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f0f0;
}

.album-container {
    position: relative;
    width: 60%; /* Adjusted for better fit on objkt */
    max-width: 400px; /* Adjusted for better fit on objkt */
    aspect-ratio: 1 / 1; /* Assuming square album art */
    overflow: hidden;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    transition: transform 0.5s ease-in-out;
}

.page img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.controls button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

#play-pause-btn {
    width: 80px; /* Fixed width to prevent shifting */
    display: flex;
    justify-content: center;
    align-items: center;
}`;


function generateWebsite() {
    console.log('Generating website with files:', selectedFiles);

    const albumArtFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    const songFiles = selectedFiles.filter(file => file.type.startsWith('audio/'));

    // Generate JavaScript array strings
    const albumArtArrayString = albumArtFiles.map(file => `'Album Art/${file.name}'`).join(',\n    ');
    const playlistArrayString = songFiles.map(file => `'Songs/${file.name}'`).join(',\n    ');

    // Modify scriptTemplate
    let modifiedScriptContent = scriptTemplate.replace(
        /const albumArt = \[.*?\];/s,
        `const albumArt = [\n    ${albumArtArrayString}\n];`
    );

    modifiedScriptContent = modifiedScriptContent.replace(
        /const playlist = \[.*?\];/s,
        `const playlist = [\n    ${playlistArrayString}\n];`
    );

    // Create zip file
    const zip = new JSZip();
    zip.file("index.html", indexTemplate);
    zip.file("script.js", modifiedScriptContent);
    zip.file("style.css", styleTemplate);

    const albumArtFolder = zip.folder("Album Art");
    albumArtFiles.forEach(file => {
        albumArtFolder.file(file.name, file);
    });

    const songsFolder = zip.folder("Songs");
    songFiles.forEach(file => {
        songsFolder.file(file.name, file);
    });

    // Generate and download zip
    zip.generateAsync({ type: "blob" }).then(function(content) {
        const url = URL.createObjectURL(content);
        downloadZipLink.href = url;
        downloadZipLink.download = 'nft_album_website.zip';
        downloadLinkDiv.style.display = 'block';
    });
}

// Initial state
updateGenerateButtonState();
