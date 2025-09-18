'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Copy,
  UploadCloud,
  X,
  FileCheck2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reviewDocument } from '@/ai/flows/review-document';
import { ScrollArea } from '@/components/ui/scroll-area';

type AnalysisResult = {
  content: string;
};

export function DocumentReview() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [prompt, setPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const executeReview = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a document to review.',
      });
      return;
    }
    if (!prompt) {
        toast({
            variant: 'destructive',
            title: 'No instruction provided',
            description: 'Please provide an instruction for what to do with the document.',
        });
        return;
    }
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const response = await reviewDocument({ documentDataUri: dataUri, prompt: prompt });
      setAnalysisResult({
        content: response.result,
      });

    } catch (error: any) {
      console.error('Document review failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message ||
          'Failed to complete the document review. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult.content);
      toast({
        description: 'Copied to clipboard!',
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-6">
      <div className="flex flex-col gap-4">
        <Card
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed transition-colors duration-300 min-h-[200px] ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Upload your document
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag and drop or click to browse.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-6"
              >
                <label htmlFor="file-upload-review">
                  Browse File
                  <input
                    id="file-upload-review"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <FileCheck2 className="w-12 h-12 text-green-500" />
              <p className="mt-4 font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => setFile(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Remove File
              </Button>
            </div>
          )}
        </Card>
        <div className="flex flex-col gap-2">
            <Textarea 
                placeholder="Tell me what to do with the document. E.g., 'Summarize this document' or 'Extract the buyer, seller, and property address'."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className='min-h-[80px]'
            />
          <Button
            onClick={executeReview}
            disabled={!file || isLoading || !prompt}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Review Document'
            )}
          </Button>
        </div>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className='space-y-1'>
              <CardTitle>Analysis Result</CardTitle>
              <CardDescription>
              { !analysisResult && !isLoading ? 'Your document analysis will appear here.' : ''}
              </CardDescription>
          </div>
          {analysisResult && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className='flex-1'>
            <div className='pr-4'>
                {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                ) : analysisResult ? (
                <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert flex-1">
                    <p>{analysisResult.content}</p>
                </div>
                ) : <div className='flex-1'/>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
