
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const analysisModes = [
  { value: 'summary', label: 'Summary', prompt: 'Summarize the following document into concise, easy-to-read points. Focus only on the content in the document.' },
  { value: 'key-clauses', label: 'Key Clauses', prompt: 'Extract all important legal clauses from the document. Include clause names, descriptions, and relevant sections if possible.' },
  { value: 'party-details', label: 'Party Details', prompt: 'List all parties mentioned in the document along with their roles and responsibilities.' },
  { value: 'dates-deadlines', label: 'Dates & Deadlines', prompt: 'Extract all dates, deadlines, and timelines mentioned in the document. Include the context for each date (e.g., payment due date, contract expiration).' },
  { value: 'amounts-payments', label: 'Amounts / Payments', prompt: 'Extract all monetary values, financial obligations, or penalties mentioned in the document. Provide the context for each amount.' },
  { value: 'legal-risks', label: 'Legal Risks', prompt: 'Analyze the document and identify any potential legal risks, liabilities, or exposures. Provide clear explanations for each risk.' },
  { value: 'custom-query', label: 'Custom Query', prompt: 'Answer the user’s specific question based on the document content. If the answer is not in the document, say: "This information is not present in the document". User Question: ' },
];

export function DocumentReview() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMode, setSelectedMode] = useState(analysisModes[0].value);
  const [customQuery, setCustomQuery] = useState('');

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      if (files[0].size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 10MB.',
        });
        return;
      }
      setFile(files[0]);
      setAnalysisResult(null); // Reset result when new file is uploaded
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

  const executeAnalysis = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a document to analyze.',
      });
      return;
    }

    const mode = analysisModes.find(m => m.value === selectedMode);
    if (!mode) return;

    let finalPrompt = mode.prompt;
    if (selectedMode === 'custom-query') {
      if (!customQuery.trim()) {
        toast({
          variant: 'destructive',
          title: 'Custom Query is empty',
          description: 'Please enter your question about the document.',
        });
        return;
      }
      finalPrompt += customQuery;
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

      const response = await reviewDocument({ documentDataUri: dataUri, prompt: finalPrompt });
      setAnalysisResult(response.result);

    } catch (error: any) {
      console.error('Document analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message ||
          'Failed to complete the analysis. Please try again.',
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
        <Card
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed transition-colors duration-300 ${
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
                <label htmlFor="file-upload">
                  Browse File
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt"
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
                onClick={() => {
                  setFile(null);
                  setAnalysisResult(null);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Remove File
              </Button>
            </div>
          )}
        </Card>

        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Analysis Mode</label>
                    <Select value={selectedMode} onValueChange={setSelectedMode}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an analysis mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {analysisModes.map(mode => (
                                <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedMode === 'custom-query' && (
                    <div className="grid gap-2">
                         <label className="text-sm font-medium">Your Question</label>
                         <Textarea 
                            placeholder="e.g., 'What is the governing law for this agreement?'"
                            value={customQuery}
                            onChange={(e) => setCustomQuery(e.target.value)}
                         />
                    </div>
                )}
            </CardContent>
        </Card>

        <Button
          onClick={executeAnalysis}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Document'
          )}
        </Button>
      </div>
      
      <div className="flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Analysis Result</CardTitle>
              {analysisResult && (
                <Button variant="ghost" size="icon" onClick={() => handleCopy(analysisResult)}>
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
                            <p className="text-muted-foreground">Analyzing document...</p>
                            </div>
                        </div>
                    ) : analysisResult ? (
                        <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert whitespace-pre-wrap">
                           {analysisResult}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center text-muted-foreground">
                            <p>Your analysis results will appear here.</p>
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
