/**
 * Utility functions for handling file operations in Knowledge Center
 */

/**
 * Get Font Awesome icon class for file extension
 */
export const getFileIcon = (extension: string): string => {
  const ext = extension?.toLowerCase() || '';

  const iconMap: Record<string, string> = {
    // Documents
    pdf: 'file-pdf',
    doc: 'file-word',
    docx: 'file-word',
    txt: 'file-alt',
    rtf: 'file-alt',

    // Spreadsheets
    xls: 'file-excel',
    xlsx: 'file-excel',
    csv: 'file-csv',

    // Presentations
    ppt: 'file-powerpoint',
    pptx: 'file-powerpoint',

    // Images
    jpg: 'file-image',
    jpeg: 'file-image',
    png: 'file-image',
    gif: 'file-image',
    bmp: 'file-image',
    tiff: 'file-image',
    svg: 'file-image',

    // Archive
    zip: 'file-archive',
    rar: 'file-archive',
    '7z': 'file-archive',
    tar: 'file-archive',
    gz: 'file-archive',

    // Audio
    mp3: 'file-audio',
    wav: 'file-audio',
    flac: 'file-audio',
    m4a: 'file-audio',

    // Video
    mp4: 'file-video',
    avi: 'file-video',
    mov: 'file-video',
    wmv: 'file-video',
    mkv: 'file-video',

    // Code
    html: 'file-code',
    css: 'file-code',
    js: 'file-code',
    ts: 'file-code',
    json: 'file-code',
    xml: 'file-code',
  };

  return iconMap[ext] || 'file';
};

/**
 * Check if a file extension has a specific FontAwesome icon
 */
export const hasFileIcon = (extension: string): boolean => {
  const ext = extension?.toLowerCase() || '';

  const supportedExtensions = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'rtf',
    'xls',
    'xlsx',
    'csv',
    'ppt',
    'pptx',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tiff',
    'svg',
    'zip',
    'rar',
    '7z',
    'tar',
    'gz',
    'mp3',
    'wav',
    'flac',
    'm4a',
    'mp4',
    'avi',
    'mov',
    'wmv',
    'mkv',
    'html',
    'css',
    'js',
    'ts',
    'json',
    'xml',
  ];

  return supportedExtensions.includes(ext);
};

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type display name from extension
 */
export const getFileTypeDisplay = (extension: string): string => {
  const ext = extension?.toLowerCase() || '';

  const typeMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word Document',
    docx: 'Word Document',
    xls: 'Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    txt: 'Text File',
    csv: 'CSV File',
    zip: 'Archive',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
  };

  return typeMap[ext] || ext.toUpperCase();
};
