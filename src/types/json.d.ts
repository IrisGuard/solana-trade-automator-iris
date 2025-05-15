
type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: Json };
type JsonArray = Json[];
type Json = JsonPrimitive | JsonObject | JsonArray;

declare module '@supabase/supabase-js' {
  interface PostgrestResponse {
    data: any;
    error: any;
  }
}
