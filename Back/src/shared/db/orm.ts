import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';

// Usar variable de entorno o valor por defecto para desarrollo
const DATABASE_URL = process.env.DATABASE_URL || 'mysql://ujqrittycd48j11n:CPGnn5swthcfCiC1SZAH@bayozxr05r92ayvzxqd8-mysql.services.clever-cloud.com:3306/bayozxr05r92ayvzxqd8';
const DB_NAME = process.env.DB_NAME || 'bayozxr05r92ayvzxqd8';

export const orm = await MikroORM.init({
  entities: ['dist/models/*.model.js'],
  entitiesTs: ['src/models/*.model.ts'],
  dbName: DB_NAME,
  driver: MySqlDriver,
  clientUrl: DATABASE_URL,
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  // Agregar columna imagen a hotel si no existe
  const connection = orm.em.getConnection();
  try {
    // Verificar si la columna existe
    const columns = await connection.execute(`SHOW COLUMNS FROM hotel LIKE 'imagen'`);
    if (columns.length === 0) {
      await connection.execute(`ALTER TABLE hotel ADD COLUMN imagen VARCHAR(255) NULL`);
      console.log('Columna imagen agregada a hotel');
    } else {
      console.log('Columna imagen ya existe en hotel');
    }
  } catch (error: any) {
    console.log('Nota sobre sincronización:', error.message);
  }
};
