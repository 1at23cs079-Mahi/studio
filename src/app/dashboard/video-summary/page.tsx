'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Copy,
  UploadCloud,
  File as FileIcon,
  X,
  Video,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SummarizeVideoInput } from '@/ai/flows/summarize-video';
import { ScrollArea } from '@/components/ui/scroll-area';
import { streamFlow } from '@genkit-ai/next/client';

export default function VideoSummaryPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSummarize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No video file uploaded',
        description: 'Please upload a video file to summarize.',
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const videoDataUri = await fileToDataUri(file);
      const input: SummarizeVideoInput = { videoDataUri };
      
      const { output, stream } = streamFlow({
        url: '/api/summarize-video',
        input,
      });

      for await (const chunk of stream) {
        setSummary(chunk);
      }

    } catch (error: any) {
      console.error('Video summarization failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message || 'Failed to summarize the video. Please try again.',
      });
      setSummary("An error occurred while summarizing the video.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: 'Copied to clipboard!',
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Video Summary</CardTitle>
            <CardDescription>
              Upload a video file (MP4, MOV, etc.) to get an AI-powered summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="video-upload">Upload Video</Label>
              <Input
                id="video-upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="video/*"
              />
              {!file ? (
                <Label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">MP4, MOV, AVI, etc.</p>
                  </div>
                </Label>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium truncate max-w-xs">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <Button onClick={handleSummarize} disabled={isLoading || !file} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                'Summarize Video'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Summary</CardTitle>
             {summary && (
              <Button variant="ghost" size="icon" onClick={() => handleCopy(summary)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              {isLoading && !summary ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is summarizing your video...</p>
                  </div>
                </div>
              ) : summary || isLoading ? (
                 <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap relative">
                    {summary}{isLoading && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1" />}
                  </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <Video className="w-12 h-12 mx-auto text-primary/50" />
                    <p>Your video summary will appear here.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
