import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';

export const orm = await MikroORM.init({
  entities: ['dist/models/*.model.js'],
  entitiesTs: ['src/models/*.model.ts'],
  dbName: 'bayozxr05r92ayvzxqd8',
  driver: MySqlDriver,
  clientUrl: 'mysql://ujqrittycd48j11n:CPGnn5swthcfCiC1SZAH@bayozxr05r92ayvzxqd8-mysql.services.clever-cloud.com:3306/bayozxr05r92ayvzxqd8',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};
