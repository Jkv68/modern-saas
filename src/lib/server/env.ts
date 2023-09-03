import * as dotenv from "dotenv";
dotenv.config();


// 獲取環境變數
function getEnvironmentVariable(environmentVariable: string): string {
  const validEnvironmentVariable = process.env[environmentVariable]; // 藉由dotenv可讀取
  if (!validEnvironmentVariable) {
    throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
  }
  return validEnvironmentVariable;
}

// 讀入.env並匯出為 ENV obj
export const ENV = {
  PUBLIC_SUPABASE_ANON_KEY: getEnvironmentVariable("PUBLIC_SUPABASE_ANON_KEY"),
  PUBLIC_SUPABASE_URL: getEnvironmentVariable("PUBLIC_SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: getEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
  SUPABASE_DB_URL: getEnvironmentVariable("SUPABASE_DB_URL"),
};