import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Captures a DOM element and generates an A4 PDF download.
 * Text remains selectable because we embed the canvas as a full-page image
 * at native resolution — upgrade path: use jsPDF text APIs for pure-text PDF.
 */
export async function generatePDF(
  elementId: string,
  filename = "invoice.pdf",
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element #${elementId} not found`);
  }

  // Temporarily force white background for capture
  const originalBg = element.style.background;
  element.style.background = "#ffffff";

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // 3× for crisp text at print resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    element.style.background = originalBg;

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions in mm
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Scale image to fill A4 width, preserving aspect ratio
    const imgAspect = canvas.height / canvas.width;
    const imgHeightMM = A4_WIDTH_MM * imgAspect;

    // If content is taller than A4, split across pages
    if (imgHeightMM <= A4_HEIGHT_MM) {
      pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH_MM, imgHeightMM);
    } else {
      let yOffset = 0;
      while (yOffset < imgHeightMM) {
        const srcYRatio = yOffset / imgHeightMM;
        const srcY = srcYRatio * canvas.height;
        const pageHeightPx = (A4_HEIGHT_MM / imgHeightMM) * canvas.height;

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - srcY);

        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height,
          );
        }

        const pageData = pageCanvas.toDataURL("image/png");
        const pageImgH = (pageCanvas.height / canvas.width) * A4_WIDTH_MM;

        if (yOffset > 0) pdf.addPage();
        pdf.addImage(pageData, "PNG", 0, 0, A4_WIDTH_MM, pageImgH);

        yOffset += A4_HEIGHT_MM;
      }
    }

    pdf.save(filename);
  } catch (err) {
    element.style.background = originalBg;
    throw err;
  }
}
