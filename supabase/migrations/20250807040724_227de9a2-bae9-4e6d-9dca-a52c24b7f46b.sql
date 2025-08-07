-- Create brand_logos table for storing brand logo references
CREATE TABLE public.brand_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  brand_name TEXT NOT NULL,
  logo_image_url TEXT,
  logo_description TEXT,
  confidence_threshold DECIMAL DEFAULT 0.25,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analysis_results table for storing post analysis history
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  brand_detected TEXT,
  logo_detected BOOLEAN DEFAULT false,
  estimated_impressions INTEGER,
  engagement_data JSONB,
  clicks INTEGER,
  media_value_usd DECIMAL,
  analysis_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.brand_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for brand_logos
CREATE POLICY "Users can view their own brand logos" 
ON public.brand_logos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand logos" 
ON public.brand_logos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand logos" 
ON public.brand_logos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand logos" 
ON public.brand_logos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for analysis_results
CREATE POLICY "Users can view their own analysis results" 
ON public.analysis_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis results" 
ON public.analysis_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_brand_logos_updated_at
BEFORE UPDATE ON public.brand_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_brand_logos_user_id ON public.brand_logos(user_id);
CREATE INDEX idx_analysis_results_user_id ON public.analysis_results(user_id);
CREATE INDEX idx_analysis_results_created_at ON public.analysis_results(created_at DESC);