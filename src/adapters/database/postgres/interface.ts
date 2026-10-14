/**
 * Database Adapter Interface
 * Decouples business services from specific PostgreSQL drivers or Supabase client.
 */

export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
}

export interface DatabaseAdapter {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  transaction<T>(callback: (client: DatabaseAdapter) => Promise<T>): Promise<T>;
  isHealthy(): Promise<boolean>;
}
