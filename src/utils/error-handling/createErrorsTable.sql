
-- SQL for creating a table to store bot errors
CREATE TABLE IF NOT EXISTS public.bot_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  level TEXT NOT NULL,
  stack_trace TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

-- Add Row Level Security
ALTER TABLE public.bot_errors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to select rows
CREATE POLICY "Allow users to view errors" 
  ON public.bot_errors 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to insert errors
CREATE POLICY "Allow users to insert errors" 
  ON public.bot_errors 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bot_errors_created_at ON public.bot_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_bot_errors_level ON public.bot_errors(level);
CREATE INDEX IF NOT EXISTS idx_bot_errors_source ON public.bot_errors(source);

-- Note: This SQL should be run in your Supabase project SQL editor
