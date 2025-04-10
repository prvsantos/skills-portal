import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: '.', // Define o diretório raiz corretamente
  build: {
    //outDir: '../dist',
    rollupOptions: {
      input: 'public/index.html' // Aponta para o arquivo index.html
    }
  }
//  server: {
//    host: '0.0.0.0',  // Permite acesso externo no Docker
//    port: 3000   // Usa a porta 3000
//  }
});
