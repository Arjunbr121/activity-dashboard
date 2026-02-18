import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert markdown to HTML for PDF generation
 * Simple markdown parser - for more complex markdown, use a library like marked
 */
const markdownToHtml = (markdown) => {
  let html = markdown
    // Headers
    .replace(/^### (.*?)$/gm, '<h3 style="font-size: 16px; font-weight: bold; margin-top: 15px;">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 style="font-size: 20px; font-weight: bold; margin-top: 20px;">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 style="font-size: 24px; font-weight: bold; margin-top: 25px;">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #0066cc;">$1</a>')
    // Code blocks (backticks)
    .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 5px; border-radius: 3px;">$1</code>')
    // Line breaks
    .replace(/\n\n/g, '</p><p style="margin: 10px 0;">')
    .replace(/\n/g, '<br/>');

  return `<p style="margin: 10px 0;">${html}</p>`;
};

/**
 * Generate PDF from markdown content
 * @param {string} markdownContent - Markdown content to convert
 * @param {string} filename - Output filename (without .pdf extension)
 * @param {object} options - Additional PDF options
 */
export const generatePDFFromMarkdown = (markdownContent, filename = 'report', options = {}) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      ...options,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Add title/header
    const htmlContent = markdownToHtml(markdownContent);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.width = `${maxWidth}mm`;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.5';
    tempDiv.style.color = '#333';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempDiv);

    // Split content into lines and add to PDF
    const lines = tempDiv.innerText.split('\n');
    const lineHeight = 7;
    const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

    lines.forEach((line, index) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Handle headers (simple detection)
      if (line.match(/^#{1,3}\s/)) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        yPosition += 5;
      } else {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
      }

      // Wrap text
      const splitText = doc.splitTextToSize(line.trim(), maxWidth);
      splitText.forEach((textLine) => {
        doc.text(textLine, margin, yPosition);
        yPosition += lineHeight;
      });
    });

    // Clean up
    document.body.removeChild(tempDiv);

    // Save the PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  }
};

/**
 * Generate PDF from HTML element (alternative method using html2canvas)
 * Better for complex styling but slower
 */
export const generatePDFFromHTML = async (elementId, filename = 'report') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Create canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff',
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    let heightLeft = (canvas.height * imgWidth) / canvas.width;
    let position = 0;

    // Add images to PDF pages
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, (canvas.height * imgWidth) / canvas.width);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - canvas.height;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, (canvas.height * imgWidth) / canvas.width);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  }
};

/**
 * Download a file (generic utility)
 */
export const downloadFile = (content, filename, mimeType = 'application/octet-stream') => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file: ' + error.message);
  }
};

/**
 * Download markdown as text file
 */
export const downloadMarkdown = (markdownContent, filename = 'report.md') => {
  downloadFile(markdownContent, filename, 'text/markdown');
};
