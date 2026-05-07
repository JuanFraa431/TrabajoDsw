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

// Auto-sync del schema: crea/actualiza tablas si no existen (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema({ safe: true });
  console.log('✅ Schema de base de datos sincronizado');

  // Crear vista vw_precio_paquete si no existe
  const connection = orm.em.getConnection();
  await connection.execute(`
    CREATE OR REPLACE VIEW vw_precio_paquete AS
    SELECT
      p.id AS paquete_id,
      COALESCE(
        (SELECT SUM(h.precio_x_dia * DATEDIFF(e.fecha_fin, e.fecha_ini))
         FROM estadia e
         JOIN hotel h ON e.hotel_id = h.id
         WHERE e.paquete_id = p.id), 0
      ) +
      COALESCE(
        (SELECT SUM(ex.precio)
         FROM paquete_excursion pe
         JOIN excursion ex ON pe.excursion_id = ex.id
         WHERE pe.paquete_id = p.id), 0
      ) +
      COALESCE(
        (SELECT SUM(tp.precio)
         FROM transporte_paquete tp
         WHERE tp.paquete_id = p.id), 0
      ) AS precio_total
    FROM paquete p
  `);
  console.log('✅ Vista vw_precio_paquete creada/actualizada');

  // Cargar datos por primera vez si la base de datos está vacía
  try {
    const [row] = await connection.execute('SELECT COUNT(*) as count FROM ciudad');
    if (row && (row as any).count === 0) {
      console.log('Base de datos vacía. Cargando datos iniciales...');
      const fs = await import('fs');
      const path = await import('path');
      
      let sqlFilePath = path.join(process.cwd(), 'seed_data.sql');
      if (!fs.existsSync(sqlFilePath)) {
        sqlFilePath = path.join(process.cwd(), 'Back/seed_data.sql');
      }
      const sqlFile = fs.readFileSync(sqlFilePath, 'utf-8');

      const statements = sqlFile
        .split(/;\r?\n/)
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        await connection.execute(statement);
      }
      console.log('Datos iniciales cargados con éxito');
    } else {
      console.log('La base de datos ya contiene datos, omitiendo carga inicial.');
    }
  } catch (err: any) {
    console.error('Error al verificar/cargar datos iniciales:', err.message);
  }
}
