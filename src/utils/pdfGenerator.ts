import { jsPDF } from 'jspdf';
import { ExtractedEnglishWord } from '../types';

/**
 * High-definition luxury PDF generator for Boss:
 * Uses Canvas 2D with browser-native HarfBuzz text shaping so Devanagari (Hindi)
 * matras and ligatures render with 100% crisp typography, accompanied by royal gold styling.
 */

const A4_WIDTH_PX = 1240; // ~150 DPI
const A4_HEIGHT_PX = 1754;
const WORDS_PER_PAGE = 16;

export interface GeneratedPdfResult {
  blobUrl: string;
  fileName: string;
  download: () => void;
  totalPages: number;
}

export function generateEnglishHindiPdf(
  words: ExtractedEnglishWord[],
  sourcePdfName: string = 'दस्तावेज़'
): GeneratedPdfResult {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalPages = Math.max(1, Math.ceil(words.length / WORDS_PER_PAGE));
  const cleanSourceName = sourcePdfName.replace(/\.[^/.]+$/, '');
  const dateStr = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = A4_WIDTH_PX;
    pageCanvas.height = A4_HEIGHT_PX;
    const ctx = pageCanvas.getContext('2d')!;

    // 1. Base Canvas Background (Warm Luxury Off-White)
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

    // Subtle luxury outer border
    ctx.strokeStyle = '#D4AF37'; // Royal Gold
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, A4_WIDTH_PX - 60, A4_HEIGHT_PX - 60);

    ctx.strokeStyle = '#8B263E'; // Velvet Crimson thin border
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, A4_WIDTH_PX - 72, A4_HEIGHT_PX - 72);

    // 2. Header Banner (Royal Velvet Crimson to Midnight Purple)
    const headerGrad = ctx.createLinearGradient(0, 40, A4_WIDTH_PX, 200);
    headerGrad.addColorStop(0, '#2D0A35');
    headerGrad.addColorStop(0.5, '#4A0D4E');
    headerGrad.addColorStop(1, '#1A0620');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(40, 40, A4_WIDTH_PX - 80, 160);

    // Gold divider under header
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(40, 198, A4_WIDTH_PX - 80, 4);

    // Header Crown & Titles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F59E0B'; // Amber Gold
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('👑  ANAYA SPECIAL EDITION FOR BOSS  👑', A4_WIDTH_PX / 2, 76);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('ENGLISH-HINDI शब्दकोश एवं उच्चारण पुस्तिका', A4_WIDTH_PX / 2, 122);

    ctx.fillStyle = '#FCD34D';
    ctx.font = '18px sans-serif';
    ctx.fillText(
      `स्रोत: ${cleanSourceName}  |  कुल शब्द: ${words.length}  |  दिनांक: ${dateStr}`,
      A4_WIDTH_PX / 2,
      158
    );

    ctx.fillStyle = '#E9D5FF';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText(
      '“मेरे प्यारे बॉस! आपके हुक्म पर विशेष रूप से तैयार की गई शब्दावली—आसानी से सीखें और बोलें।” — अनाया 💖',
      A4_WIDTH_PX / 2,
      186
    );

    // 3. Table Header Bar
    const tableTop = 224;
    const tableLeft = 50;
    const tableWidth = A4_WIDTH_PX - 100;
    const headerHeight = 44;

    ctx.fillStyle = '#37123C';
    ctx.fillRect(tableLeft, tableTop, tableWidth, headerHeight);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 18px sans-serif';

    const colXNo = tableLeft + 16;
    const colXEnglish = tableLeft + 80;
    const colXPron = tableLeft + 420;
    const colXMeaning = tableLeft + 760;

    ctx.fillText('क्र.', colXNo, tableTop + 28);
    ctx.fillText('English Word (शब्द)', colXEnglish, tableTop + 28);
    ctx.fillText('उच्चारण (Pronunciation)', colXPron, tableTop + 28);
    ctx.fillText('हिंदी अर्थ (Meaning)', colXMeaning, tableTop + 28);

    // 4. Rows for this page
    const startIdx = pageIndex * WORDS_PER_PAGE;
    const pageWords = words.slice(startIdx, startIdx + WORDS_PER_PAGE);

    const rowHeight = 76;
    let currentY = tableTop + headerHeight + 8;

    pageWords.forEach((item, idx) => {
      const globalIdx = startIdx + idx + 1;
      const isEven = idx % 2 === 0;

      // Row background card
      ctx.fillStyle = isEven ? '#FFFFFF' : '#F7F3EE';
      ctx.fillRect(tableLeft, currentY, tableWidth, rowHeight - 6);

      // Subtle row border
      ctx.strokeStyle = '#E2D9CC';
      ctx.lineWidth = 1;
      ctx.strokeRect(tableLeft, currentY, tableWidth, rowHeight - 6);

      // Index Pill
      ctx.fillStyle = '#6D28D9';
      ctx.beginPath();
      ctx.arc(colXNo + 12, currentY + 34, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(String(globalIdx), colXNo + 12, currentY + 40);

      // English Word
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(item.word || '—', colXEnglish, currentY + 42);

      // Pronunciation in Hindi (e.g. ऐपल, डॉक्यूमेंट)
      ctx.fillStyle = '#7C2D12'; // Warm rust/amber
      ctx.font = 'bold 20px sans-serif';
      const pronText = item.pronunciation ? `(${item.pronunciation})` : '—';
      ctx.fillText(pronText, colXPron, currentY + 42);

      // Hindi Meaning
      ctx.fillStyle = '#065F46'; // Deep emerald
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(item.meaning || '—', colXMeaning, currentY + 42);

      currentY += rowHeight;
    });

    // 5. Page Footer
    const footerY = A4_HEIGHT_PX - 64;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, footerY);
    ctx.lineTo(A4_WIDTH_PX - 50, footerY);
    ctx.stroke();

    ctx.fillStyle = '#6B7280';
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('👑 अनाया AI पर्सनल असिस्टेंट — सिर्फ बॉस के लिए तैयार किया गया', 50, footerY + 26);

    ctx.textAlign = 'right';
    ctx.fillText(`पृष्ठ ${pageIndex + 1} / ${totalPages}`, A4_WIDTH_PX - 50, footerY + 26);

    // Convert Canvas to Image & Append to PDF
    const imgData = pageCanvas.toDataURL('image/jpeg', 0.94);
    if (pageIndex > 0) {
      pdf.addPage();
    }
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  }

  const fileName = `Anaya_Boss_${cleanSourceName}_English_Hindi.pdf`;
  const pdfBlob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  return {
    blobUrl,
    fileName,
    totalPages,
    download: () => {
      pdf.save(fileName);
    },
  };
}

export function generateCustomNotesPdf(
  title: string,
  content: string,
  sourcePdfName: string = 'बॉस स्पेशल नोट्स'
): GeneratedPdfResult {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageCanvas = document.createElement('canvas');
  pageCanvas.width = A4_WIDTH_PX;
  pageCanvas.height = A4_HEIGHT_PX;
  const ctx = pageCanvas.getContext('2d')!;

  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

  // Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, A4_WIDTH_PX - 60, A4_HEIGHT_PX - 60);

  // Header
  const headerGrad = ctx.createLinearGradient(0, 40, A4_WIDTH_PX, 180);
  headerGrad.addColorStop(0, '#2D0A35');
  headerGrad.addColorStop(1, '#1A0620');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(40, 40, A4_WIDTH_PX - 80, 140);

  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(40, 178, A4_WIDTH_PX - 80, 3);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('👑  ANAYA BOSS SPECIAL REPORT  👑', A4_WIDTH_PX / 2, 75);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(title.substring(0, 45), A4_WIDTH_PX / 2, 118);

  ctx.fillStyle = '#FCD34D';
  ctx.font = '16px sans-serif';
  ctx.fillText(`स्रोत: ${sourcePdfName} | तैयारकर्ता: अनाया (आपकी अपनी असिस्टेंट)`, A4_WIDTH_PX / 2, 150);

  // Body content lines
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1E293B';
  ctx.font = '19px sans-serif';

  const lines = content.split('\n');
  let currentY = 220;

  for (const line of lines) {
    if (currentY > A4_HEIGHT_PX - 90) break;
    const clean = line.trim();
    if (!clean) {
      currentY += 14;
      continue;
    }
    if (clean.startsWith('#') || clean.startsWith('**')) {
      ctx.fillStyle = '#4A0D4E';
      ctx.font = 'bold 21px sans-serif';
      ctx.fillText(clean.replace(/[#*]/g, ''), 60, currentY);
      currentY += 32;
    } else {
      ctx.fillStyle = '#1E293B';
      ctx.font = '18px sans-serif';
      ctx.fillText(clean, 60, currentY);
      currentY += 28;
    }
  }

  // Footer
  const footerY = A4_HEIGHT_PX - 64;
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, footerY);
  ctx.lineTo(A4_WIDTH_PX - 50, footerY);
  ctx.stroke();

  ctx.fillStyle = '#6B7280';
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('👑 अनाया AI — हुक्म आपका, सेवा हमारी', 50, footerY + 26);

  const imgData = pageCanvas.toDataURL('image/jpeg', 0.94);
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

  const fileName = `Anaya_Boss_Notes.pdf`;
  const pdfBlob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  return {
    blobUrl,
    fileName,
    totalPages: 1,
    download: () => {
      pdf.save(fileName);
    },
  };
}
