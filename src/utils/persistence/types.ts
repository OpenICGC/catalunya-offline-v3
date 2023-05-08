// Define a common interface for different persistence implementations as for example:
// localStorage, REST API, SQLite, etc.

export type persistence = ({
  load <T>(key: string): Promise<T | undefined>,
  save <T>(key: string, value: T): Promise<void>
});
