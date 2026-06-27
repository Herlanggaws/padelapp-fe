import type { EventStandingsType } from "@/types/event";
import { toBlob } from "html-to-image";

export interface ShareStandingRow {
  rank: number;
  name: string;
  mp: number;
  wins: number;
  scoreDiff: number;
  winPct: string;
  total_points: number;
}

interface ShareImageBaseOptions {
  eventName: string;
  standingsType: EventStandingsType;
}

interface Top3ShareImageOptions extends ShareImageBaseOptions {
  top3: ShareStandingRow[];
}

export interface YourResultShareImageOptions {
  eventName: string;
  summary: {
    winPercentage: number;
    rank: number;
    matchesPlayed: number;
    wins: number;
    loss: number;
    totalPoints: number;
  };
  backgroundImageSrc?: string;
  overlayOpacity?: number;
  backgroundTransform?: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface MatchResultShareImageOptions {
  eventName: string;
  standingsType: EventStandingsType;
  top3: ShareStandingRow[];
  backgroundImageSrc?: string;
  overlayOpacity?: number;
  backgroundTransform?: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
}

export function formatWinPercentage(value: number) {
  return `${Math.round(value * 10) / 10}%`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load background image."));
    img.src = src;
  });
}

function drawImageWithTransform(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  transform: { scale: number; offsetX: number; offsetY: number },
) {
  const baseScale = Math.max(width / img.width, height / img.height);
  const finalScale = baseScale * transform.scale;
  const drawWidth = img.width * finalScale;
  const drawHeight = img.height * finalScale;
  const centerX = width / 2 + transform.offsetX;
  const centerY = height / 2 + transform.offsetY;
  ctx.drawImage(
    img,
    centerX - drawWidth / 2,
    centerY - drawHeight / 2,
    drawWidth,
    drawHeight,
  );
}

async function drawYourResultBackground(
  ctx: CanvasRenderingContext2D,
  options: Pick<
    YourResultShareImageOptions,
    "backgroundImageSrc" | "overlayOpacity" | "backgroundTransform"
  >,
) {
  ctx.fillStyle = TEXT_PRIMARY;
  ctx.fillRect(0, 0, YOUR_RESULT_WIDTH, YOUR_RESULT_HEIGHT);

  if (options.backgroundImageSrc) {
    const img = await loadImage(options.backgroundImageSrc);
    drawImageWithTransform(
      ctx,
      img,
      YOUR_RESULT_WIDTH,
      YOUR_RESULT_HEIGHT,
      options.backgroundTransform ?? { scale: 1, offsetX: 0, offsetY: 0 },
    );
  }

  const opacity = options.overlayOpacity ?? 0.45;
  ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.fillRect(0, 0, YOUR_RESULT_WIDTH, YOUR_RESULT_HEIGHT);
}

function fitTextToLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const lines: string[] = [];
  let remaining = text.trim();

  while (remaining && lines.length < maxLines) {
    if (ctx.measureText(remaining).width <= maxWidth) {
      lines.push(remaining);
      remaining = "";
      break;
    }

    let breakAt = remaining.length;
    while (
      breakAt > 0 &&
      ctx.measureText(remaining.slice(0, breakAt)).width > maxWidth
    ) {
      breakAt -= 1;
    }

    const spaceIdx = remaining.lastIndexOf(" ", breakAt);
    if (spaceIdx > breakAt * 0.4) {
      breakAt = spaceIdx;
    }

    if (breakAt <= 0) breakAt = 1;

    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }

  if (remaining && lines.length > 0) {
    let last = lines[lines.length - 1];
    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last}…`;
  }

  return lines;
}

function getStatCellHeight(
  labelSize: number,
  valueSize: number,
  valueGap: number,
) {
  // leading-tight (1.25) label line box + flex gap + value line box
  return labelSize * 1.25 + valueGap + valueSize;
}

const PREVIEW_WIDTH = 320;
const RALLYRANK_TRACKING_EM = -0.025;

function previewScale(previewPx: number) {
  return previewPx * (YOUR_RESULT_WIDTH / PREVIEW_WIDTH);
}

function drawYourResultContent(
  ctx: CanvasRenderingContext2D,
  options: YourResultShareImageOptions,
) {
  const padOuter = previewScale(20);
  const padHeaderInner = previewScale(4);
  const contentLeft = padOuter + padHeaderInner;
  const contentRight = YOUR_RESULT_WIDTH - padOuter - padHeaderInner;
  const padBottom = previewScale(40);
  const sectionGap = previewScale(16);
  const titleFontSize = previewScale(9);
  const titleLineHeight = previewScale(9 * 1.375);
  const rallyRankFontSize = previewScale(18);
  const titleRallyRankGap = previewScale(5);
  const statsOptions = {
    labelSize: previewScale(9.5),
    valueSize: previewScale(19),
    valueGap: previewScale(2),
  };
  const statCellHeight = getStatCellHeight(
    statsOptions.labelSize,
    statsOptions.valueSize,
    statsOptions.valueGap,
  );
  const statsRowGap = statCellHeight + previewScale(10);
  const statsBlockHeight = statCellHeight + statsRowGap;
  const statsContentWidth = YOUR_RESULT_WIDTH - padOuter * 2;
  const statsGapX = previewScale(8);
  const statsColWidth = (statsContentWidth - statsGapX * 2) / 3;
  const footerFontSize = previewScale(11);

  ctx.font = `900 ${rallyRankFontSize}px "Lexend", sans-serif`;
  ctx.letterSpacing = `${RALLYRANK_TRACKING_EM}em`;
  const rallyRankWidth = ctx.measureText("RALLYRANK").width;
  ctx.letterSpacing = "0px";
  const titleMaxWidth = contentRight - contentLeft - titleRallyRankGap - rallyRankWidth;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `600 ${titleFontSize}px "Lexend", sans-serif`;
  const titleLines = fitTextToLines(
    ctx,
    options.eventName,
    titleMaxWidth,
    2,
  );

  const titleBlockHeight = titleLines.length * titleLineHeight;
  const headerBlockHeight = Math.max(titleBlockHeight, rallyRankFontSize);

  const footerTop = YOUR_RESULT_HEIGHT - padBottom - footerFontSize;
  const statsBlockTop = footerTop - sectionGap - statsBlockHeight;
  const headerTopY = statsBlockTop - sectionGap - headerBlockHeight;

  titleLines.forEach((line, index) => {
    ctx.fillText(line, contentLeft, headerTopY + index * titleLineHeight);
  });

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 ${rallyRankFontSize}px "Lexend", sans-serif`;
  ctx.letterSpacing = `${RALLYRANK_TRACKING_EM}em`;
  ctx.fillText(
    "RALLYRANK",
    contentRight,
    headerTopY + headerBlockHeight / 2,
  );
  ctx.letterSpacing = "0px";

  drawPerformanceStatsGrid(
    ctx,
    [
      {
        label: "Win Rate",
        value: formatWinPercentage(options.summary.winPercentage),
      },
      { label: "Position", value: `#${options.summary.rank}` },
      {
        label: "Matches Played",
        value: String(options.summary.matchesPlayed),
      },
      { label: "Total Win", value: String(options.summary.wins) },
      { label: "Total Loss", value: String(options.summary.loss) },
      {
        label: "Total Points",
        value: String(options.summary.totalPoints),
      },
    ],
    statsBlockTop,
    {
      ...statsOptions,
      rowGap: statsRowGap,
      startX: padOuter,
      colWidth: statsColWidth,
      gapX: statsGapX,
    },
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `400 ${footerFontSize}px "Lexend", sans-serif`;
  ctx.fillText("Generated by RallyRank", YOUR_RESULT_WIDTH / 2, footerTop);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let truncated = text;
  while (
    truncated.length > 0 &&
    ctx.measureText(`${truncated}…`).width > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

function drawMatchResultRow(
  ctx: CanvasRenderingContext2D,
  row: ShareStandingRow,
  x: number,
  y: number,
  width: number,
  height: number,
  standingsType: EventStandingsType,
) {
  roundRect(ctx, x, y, width, height, previewScale(8));
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fill();

  const rankSize = previewScale(13);
  const nameSize = previewScale(11);
  const statSize = previewScale(9);
  const pad = previewScale(10);
  const centerY = y + height / 2;

  ctx.textAlign = "left";
  ctx.fillStyle = MEDAL_COLORS[row.rank - 1] ?? "#FFFFFF";
  ctx.font = `700 ${rankSize}px "Lexend", sans-serif`;
  ctx.fillText(String(row.rank), x + pad, centerY + rankSize * 0.35);

  const stat = formatShareStandingStat(row, standingsType);
  ctx.font = `600 ${statSize}px "Lexend", sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  const statWidth = ctx.measureText(stat).width;
  const statX = x + width - pad - statWidth;
  ctx.fillText(stat, statX, centerY + statSize * 0.35);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `600 ${nameSize}px "Lexend", sans-serif`;
  const nameX = x + pad + previewScale(18);
  const nameMaxWidth = statX - nameX - previewScale(8);
  ctx.fillText(
    truncateText(ctx, row.name, Math.max(nameMaxWidth, previewScale(40))),
    nameX,
    centerY + nameSize * 0.35,
  );
}

function drawMatchResultContent(
  ctx: CanvasRenderingContext2D,
  options: MatchResultShareImageOptions,
) {
  const padOuter = previewScale(20);
  const padHeaderInner = previewScale(4);
  const padTop = previewScale(32);
  const contentLeft = padOuter + padHeaderInner;
  const contentRight = YOUR_RESULT_WIDTH - padOuter - padHeaderInner;
  const padBottom = previewScale(40);
  const sectionGap = previewScale(16);
  const titleFontSize = previewScale(9);
  const titleLineHeight = previewScale(12);
  const rallyRankFontSize = previewScale(18);
  const titleRallyRankGap = previewScale(5);
  const subtitleFontSize = previewScale(10);
  const subtitleLineHeight = previewScale(12);
  const rowHeight = previewScale(36);
  const rowGap = previewScale(8);
  const rowsWidth = YOUR_RESULT_WIDTH - padOuter * 2;
  const footerFontSize = previewScale(11);
  const rowsBlockHeight =
    options.top3.length * rowHeight +
    Math.max(0, options.top3.length - 1) * rowGap;

  ctx.font = `900 ${rallyRankFontSize}px "Lexend", sans-serif`;
  ctx.letterSpacing = `${RALLYRANK_TRACKING_EM}em`;
  const rallyRankWidth = ctx.measureText("RALLYRANK").width;
  ctx.letterSpacing = "0px";
  const titleMaxWidth = contentRight - contentLeft - titleRallyRankGap - rallyRankWidth;

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `600 ${titleFontSize}px "Lexend", sans-serif`;
  const titleLines = fitTextToLines(
    ctx,
    options.eventName,
    titleMaxWidth,
    2,
  );

  const footerY = YOUR_RESULT_HEIGHT - padBottom;
  const rowsStartY =
    footerY - sectionGap - footerFontSize - rowsBlockHeight;
  const subtitleY = rowsStartY - sectionGap - subtitleLineHeight;
  const titleBlockHeight = titleLines.length * titleLineHeight;
  const headerBlockHeight = Math.max(
    titleBlockHeight,
    rallyRankFontSize + previewScale(4),
  );
  const headerBottomY = subtitleY - sectionGap;
  const headerTopY = headerBottomY - headerBlockHeight - padTop;
  const rallyRankY =
    headerTopY + headerBlockHeight / 2 + rallyRankFontSize * 0.35;

  titleLines.forEach((line, index) => {
    ctx.fillText(
      line,
      contentLeft,
      headerTopY + (index + 1) * titleLineHeight,
    );
  });

  ctx.textAlign = "right";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 ${rallyRankFontSize}px "Lexend", sans-serif`;
  ctx.letterSpacing = `${RALLYRANK_TRACKING_EM}em`;
  ctx.fillText("RALLYRANK", contentRight, rallyRankY);
  ctx.letterSpacing = "0px";

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = `500 ${subtitleFontSize}px "Lexend", sans-serif`;
  ctx.fillText(
    `Top 3 · ${standingsTypeLabel(options.standingsType)}`,
    YOUR_RESULT_WIDTH / 2,
    subtitleY + subtitleLineHeight,
  );

  options.top3.forEach((row, index) => {
    drawMatchResultRow(
      ctx,
      row,
      padOuter,
      rowsStartY + index * (rowHeight + rowGap),
      rowsWidth,
      rowHeight,
      options.standingsType,
    );
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `400 ${footerFontSize}px "Lexend", sans-serif`;
  ctx.fillText("Generated by RallyRank", YOUR_RESULT_WIDTH / 2, footerY);

  ctx.textAlign = "left";
}

const WIDTH = 1080;
const HEIGHT = 1080;
const YOUR_RESULT_WIDTH = 1080;
const YOUR_RESULT_HEIGHT = 1920;
const GREEN = "#9FE870";
const GREEN_DARK = "#2E6900";
const TEXT_PRIMARY = "#18181B";
const TEXT_MUTED = "#71717A";
const MEDAL_COLORS = ["#EAB308", "#A1A1AA", "#FB923C"];

async function ensureLexendFont() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load(`400 ${previewScale(9)}px "Lexend"`),
    document.fonts.load(`500 ${previewScale(10)}px "Lexend"`),
    document.fonts.load(`600 ${previewScale(9)}px "Lexend"`),
    document.fonts.load(`600 ${previewScale(11)}px "Lexend"`),
    document.fonts.load(`600 ${previewScale(9.5)}px "Lexend"`),
    document.fonts.load(`700 ${previewScale(9.5)}px "Lexend"`),
    document.fonts.load(`700 ${previewScale(13)}px "Lexend"`),
    document.fonts.load(`700 ${previewScale(19)}px "Lexend"`),
    document.fonts.load(`900 ${previewScale(18)}px "Lexend"`),
  ]);
}

function standingsTypeLabel(type: EventStandingsType) {
  return type === "wins" ? "Most Wins" : "Point Difference";
}

export { standingsTypeLabel };

export function formatShareStandingStat(
  row: ShareStandingRow,
  standingsType: EventStandingsType,
) {
  return standingsType === "wins"
    ? `${row.wins} W · ${formatScoreDiff(row.scoreDiff)} · ${row.winPct}`
    : `${row.total_points} pts`;
}

function formatScoreDiff(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawBrandHeader(
  ctx: CanvasRenderingContext2D,
  eventName: string,
  subtitle: string,
) {
  roundRect(ctx, 64, 64, WIDTH - 128, 220, 48);
  ctx.fillStyle = GREEN;
  ctx.fill();

  ctx.fillStyle = GREEN_DARK;
  ctx.font = '900 44px "Lexend", sans-serif';
  ctx.fillText("RALLYRANK", 104, 132);

  ctx.font = '700 40px "Lexend", sans-serif';
  const title = eventName.length > 28 ? `${eventName.slice(0, 27)}…` : eventName;
  ctx.fillText(title, 104, 188);

  ctx.font = '600 24px "Lexend", sans-serif';
  ctx.globalAlpha = 0.75;
  ctx.fillText(subtitle, 104, 232);
  ctx.globalAlpha = 1;
}

function drawMedal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rank: number,
) {
  const color = MEDAL_COLORS[rank - 1] ?? TEXT_MUTED;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 6, y + 10);
  ctx.lineTo(x + 12, y + 2);
  ctx.lineTo(x + 18, y + 10);
  ctx.lineTo(x + 24, y);
  ctx.lineTo(x + 20, y + 16);
  ctx.lineTo(x + 4, y + 16);
  ctx.closePath();
  ctx.fill();
}

function drawTop3Row(
  ctx: CanvasRenderingContext2D,
  row: ShareStandingRow,
  y: number,
  standingsType: EventStandingsType,
) {
  roundRect(ctx, 64, y, WIDTH - 128, 148, 36);
  ctx.fillStyle = "#FAFAFA";
  ctx.fill();

  ctx.strokeStyle = "#F4F4F5";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = TEXT_PRIMARY;
  ctx.font = '700 40px "Lexend", sans-serif';
  ctx.fillText(String(row.rank), 104, y + 58);

  if (row.rank <= 3) {
    drawMedal(ctx, 148, y + 38, row.rank);
  }

  ctx.font = '600 34px "Lexend", sans-serif';
  const name = row.name.length > 22 ? `${row.name.slice(0, 21)}…` : row.name;
  ctx.fillText(name, 196, y + 58);

  ctx.font = '400 26px "Lexend", sans-serif';
  ctx.fillStyle = TEXT_MUTED;
  ctx.fillText(`MP ${row.mp}`, 104, y + 108);

  ctx.fillStyle = GREEN_DARK;
  ctx.font = '700 30px "Lexend", sans-serif';
  const stat =
    standingsType === "wins"
      ? `${row.wins} W · ${formatScoreDiff(row.scoreDiff)} · ${row.winPct}`
      : `${row.total_points} pts`;
  ctx.fillText(stat, 280, y + 108);
}

export async function generateTop3StandingsPng(
  options: Top3ShareImageOptions,
): Promise<Blob> {
  await ensureLexendFont();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create image.");

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawBrandHeader(
    ctx,
    options.eventName,
    `Top 3 · ${standingsTypeLabel(options.standingsType)}`,
  );

  options.top3.forEach((row, index) => {
    drawTop3Row(ctx, row, 320 + index * 168, options.standingsType);
  });

  ctx.fillStyle = TEXT_MUTED;
  ctx.font = '400 24px "Lexend", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("Generated by RallyRank", WIDTH / 2, HEIGHT - 56);
  ctx.textAlign = "left";

  return canvasToPngBlob(canvas);
}

function drawPerformanceStat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  sizes: { labelSize: number; valueSize: number; valueGap?: number } = {
    labelSize: 24,
    valueSize: 52,
    valueGap: 12,
  },
) {
  const valueGap = sizes.valueGap ?? 12;
  const labelLineHeight = sizes.labelSize * 1.25;

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `600 ${sizes.labelSize}px "Lexend", sans-serif`;
  ctx.fillText(label.toUpperCase(), x + width / 2, y);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 ${sizes.valueSize}px "Lexend", sans-serif`;
  ctx.fillText(value, x + width / 2, y + labelLineHeight + valueGap);
}

function drawPerformanceStatsGrid(
  ctx: CanvasRenderingContext2D,
  stats: { label: string; value: string }[],
  startY: number,
  options: {
    labelSize: number;
    valueSize: number;
    rowGap: number;
    valueGap?: number;
    startX: number;
    colWidth: number;
    gapX: number;
  },
) {
  const columns = 3;

  stats.forEach((stat, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    drawPerformanceStat(
      ctx,
      options.startX + col * (options.colWidth + options.gapX),
      startY + row * options.rowGap,
      options.colWidth,
      stat.label,
      stat.value,
      {
        labelSize: options.labelSize,
        valueSize: options.valueSize,
        valueGap: options.valueGap,
      },
    );
  });
}

export async function generateYourResultPng(
  options: YourResultShareImageOptions,
): Promise<Blob> {
  await ensureLexendFont();

  const canvas = document.createElement("canvas");
  canvas.width = YOUR_RESULT_WIDTH;
  canvas.height = YOUR_RESULT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create image.");

  ctx.clearRect(0, 0, YOUR_RESULT_WIDTH, YOUR_RESULT_HEIGHT);
  await drawYourResultBackground(ctx, {
    backgroundImageSrc: options.backgroundImageSrc,
    overlayOpacity: options.overlayOpacity,
    backgroundTransform: options.backgroundTransform,
  });
  drawYourResultContent(ctx, options);

  return canvasToPngBlob(canvas);
}

export async function generateMatchResultPng(
  options: MatchResultShareImageOptions,
): Promise<Blob> {
  await ensureLexendFont();

  const canvas = document.createElement("canvas");
  canvas.width = YOUR_RESULT_WIDTH;
  canvas.height = YOUR_RESULT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create image.");

  ctx.clearRect(0, 0, YOUR_RESULT_WIDTH, YOUR_RESULT_HEIGHT);
  await drawYourResultBackground(ctx, {
    backgroundImageSrc: options.backgroundImageSrc,
    overlayOpacity: options.overlayOpacity,
    backgroundTransform: options.backgroundTransform,
  });
  drawMatchResultContent(ctx, options);

  return canvasToPngBlob(canvas);
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image."));
      },
      "image/png",
    );
  });
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function captureElementAsPng(
  element: HTMLElement,
  targetWidth = 1080,
): Promise<Blob> {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (width <= 0 || height <= 0) {
    throw new Error("Preview element has no dimensions.");
  }

  const scale = targetWidth / width;
  const blob = await toBlob(element, {
    cacheBust: true,
    width: width * scale,
    height: height * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${width}px`,
      height: `${height}px`,
    },
  });

  if (!blob) throw new Error("Failed to capture image.");
  return blob;
}
