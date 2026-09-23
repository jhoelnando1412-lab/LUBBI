import { pool } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    
    let currentTable = '';
    for (const row of res.rows) {
      if (row.table_name !== currentTable) {
        console.log(`\nTable: ${row.table_name}`);
        currentTable = row.table_name;
      }
      console.log(`  - ${row.column_name} (${row.data_type})`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkSchema();
