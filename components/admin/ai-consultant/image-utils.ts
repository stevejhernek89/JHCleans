const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

export async function readImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (PNG, JPEG, or WebP).");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large. Use a screenshot under 4 MB.");
  }
  const dataUrl = await fileToDataUrl(file);
  return compressDataUrl(dataUrl);
}

export async function readClipboardImage(item: DataTransferItem): Promise<string> {
  const file = item.getAsFile();
  if (!file) {
    throw new Error("Could not read pasted image.");
  }
  return readImageFile(file);
}

export async function captureScreenFrame(): Promise<string> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen capture is not supported in this browser.");
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: "browser" } as MediaTrackConstraints,
    audio: false,
  });

  try {
    const [track] = stream.getVideoTracks();
    const settings = track.getSettings();
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        void video.play().then(resolve).catch(reject);
      };
      video.onerror = () => reject(new Error("Could not load screen capture."));
    });

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const width = settings.width ?? video.videoWidth;
    const height = settings.height ?? video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not process screen capture.");
    }
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    return compressDataUrl(dataUrl);
  } finally {
    stream.getTracks().forEach((track) => track.stop());
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

async function compressDataUrl(dataUrl: string): Promise<string> {
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return dataUrl;
  }

  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image."));
    image.src = src;
  });
}
