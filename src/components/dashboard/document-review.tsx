
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Copy,
  UploadCloud,
  File as FileIcon,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reviewDocument, ReviewDocumentInput } from '@/ai/flows/review-document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function DocumentReview() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
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

  const handleReview = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No document uploaded',
        description: 'Please upload a document to review.',
      });
      return;
    }
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'No instructions provided',
        description: 'Please tell me what you want to do with the document.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const documentDataUri = await fileToDataUri(file);
      const input: ReviewDocumentInput = { documentDataUri, prompt };
      const response = await reviewDocument(input);
      setResult(response.result);
    } catch (error: any) {
      console.error('Document review failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message || 'Failed to review the document. Please try again.',
      });
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
            <CardTitle>Document Review</CardTitle>
            <CardDescription>
              Upload a legal document and provide instructions for the AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="document-upload">Upload Document</Label>
              <Input
                id="document-upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              {!file ? (
                <Label
                  htmlFor="document-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT</p>
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
            <div className="grid gap-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g., 'Summarize this document in three key points', 'Identify all clauses related to liability', 'Check for ambiguities in the termination clause'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
              />
            </div>
            <Button onClick={handleReview} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reviewing...
                </>
              ) : (
                'Review Document'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Review Result</CardTitle>
            {result && (
              <Button variant="ghost" size="icon" onClick={() => handleCopy(result)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is analyzing your document...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert whitespace-pre-wrap">
                  {result}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>The result of the document review will appear here.</p>
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
