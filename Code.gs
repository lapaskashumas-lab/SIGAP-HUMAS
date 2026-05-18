/**
 * SIGAP HUMAS - LAPAS KELAS III RANGKASBITUNG
 * Backend System v1.0 - 2026
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('SIGAP HUMAS - Lapas Rangkasbitung')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Inisialisasi Database Spreadsheet
function getDb() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['arsip', 'berita', 'notes'];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) {
      const s = ss.insertSheet(name);
      if(name === 'arsip') s.appendRow(['ID', 'Timestamp', 'Nama', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Link']);
      if(name === 'berita') s.appendRow(['ID', 'Judul', 'Link', 'Tanggal', 'Jenis', 'Keterangan']);
      if(name === 'notes') s.appendRow(['Tanggal', 'Isi']);
    }
  });
  return ss;
}

// Fitur Login
function checkLogin(user, pass) {
  const credentials = {
    "admin": "lapaskaswow",
    "Pegawai": "wowpegawai"
  };
  if (credentials[user] === pass) {
    return { success: true, role: user === 'admin' ? 'Admin' : 'User', name: user };
  }
  return { success: false };
}

// Simpan Arsip Baru
function saveArchive(data) {
  const ss = getDb();
  const sheet = ss.getSheetByName('arsip');
  const driveFolder = "https://drive.google.com/drive/folders/1pxic8hao0quppiMWujD0OL8FsV4kjeD7?usp=sharing";
  
  sheet.appendRow([
    Utilities.getUuid(),
    new Date(),
    data.nama,
    data.tanggal,
    data.jenis,
    data.kategori,
    data.keterangan,
    driveFolder
  ]);
  return { success: true };
}

// Ambil Semua Data (Sync Admin & User)
function getAllData() {
  const ss = getDb();
  const arsip = ss.getSheetByName('arsip').getDataRange().getDisplayValues();
  const berita = ss.getSheetByName('berita').getDataRange().getDisplayValues();
  const notes = ss.getSheetByName('notes').getDataRange().getDisplayValues();
  
  return {
    arsip: arsip.slice(1), // Menghilangkan header
    berita: berita.slice(1),
    notes: notes.slice(1),
    total: arsip.length - 1
  };
}

// Kirim Notifikasi via Email
function sendNotif(subject, msg) {
  const email = "humasmaganglapas@gmail.com";
  MailApp.sendEmail(email, subject, msg);
  return true;
}
