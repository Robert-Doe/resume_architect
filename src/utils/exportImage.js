/**
 * Capture the resume sheet as a PNG image and trigger a download.
 */
export async function exportElementToImage(element, filename) {
  if (!element) throw new Error("Nothing to capture.");

  const [{ default: html2canvas }] = await Promise.all([import("html2canvas")]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
  });

  const pngName = filename.replace(/\.[^.]+$/, "") + ".png";
  const link = document.createElement("a");
  link.download = pngName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
