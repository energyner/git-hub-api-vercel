// 12-01local_db_config.js
// Configuración de conexión local

import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Tu usuario de Wamp
    password: '',      // Tu password de Wamp
    database: 'energyner'
});
