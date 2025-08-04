# Discord Bot Project

Bot sederhana untuk membalas teks dan gambar candaan di Discord menggunakan Discord.js v14.

## 📁 Struktur Folder
```shell
├── .git/ # Folder git repository
├── node_modules/ # Dependency project (hasil npm install)
├── src/ # Source code bot (index.js, command, dll)
├── .env # File environment variables (TOKEN, CLIENT_ID, dsb)
├── .gitignore # File konfigurasi Git Ignore
├── package.json # Konfigurasi project npm
├── package-lock.json # Lockfile npm
```

## ⚙️ Cara Menjalankan

### 1. Install Dependency
```bash
npm install
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_guild_id  # Opsional, jika mau command lokal
```

### 2. Run locally
npm run dev

### 3. Fitur BOT
| Command | Deskripsi                                     |
| ------- | --------------------------------------------- |
| !text   | Mengambil teks candaan dari API               |
| !jokes  | Mengirim gambar jokes bapack                  |
| !canda  | Mengirim gambar candaan biasa                 |
| !tolong | Menampilkan panduan command                   |
| !inpo   | Menampilkan informasi tentang bot             |

### 📦 Dependency Utama
- discord.js v14
- axios (untuk fetch API)


