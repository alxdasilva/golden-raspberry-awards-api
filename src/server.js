import app from './app.js';
import { initializeDatabase } from './config/database.js';
import loadCSV from './utils/csvLoader.js';

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await initializeDatabase();
        await loadCSV('movielist.csv');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
})();
