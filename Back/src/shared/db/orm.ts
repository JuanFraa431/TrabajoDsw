import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';

export const orm = await MikroORM.init({
  entities: ['dist/models/*.model.js'],
  entitiesTs: ['src/models/*.model.ts'],
  dbName: 'agenciadeviajes',
  driver: MySqlDriver,
  clientUrl: 'mysql://dsw:dsw@localhost:3306/agenciadeviajes?timezone=UTC',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //nunca usar en producción
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};
