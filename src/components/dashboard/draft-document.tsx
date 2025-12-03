
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
import { Label } from '@/components/ui/label';
import { Loader2, Copy, FileSignature, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { streamFlow } from '@genkit-ai/next/client';
import {
  DraftLegalDocumentInput,
} from '@/ai/flows/draft-legal-document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { useSearchParams } from 'next/navigation';

export function DraftDocument() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const getRole = () => {
    const role = searchParams.get('role');
    if (role === 'advocate') return 'Advocate';
    if (role === 'student') return 'Student';
    return 'Public';
  };

  const handleDraftDocument = async () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Document details are required.',
      });
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const input: DraftLegalDocumentInput = {
        query,
        userRole: getRole(),
      };
      
      const { output, stream } = streamFlow({
        url: '/api/draft-document',
        input,
      });

      for await (const chunk of stream) {
        setResult(chunk);
      }

    } catch (error: any) {
      console.error('Document drafting failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message || 'Failed to draft the document. Please try again.',
      });
      setResult("An error occurred while drafting the document.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: 'Draft copied to clipboard!',
    });
  };
  
  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document_draft.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      description: 'Draft downloaded as document_draft.txt',
    });
  };


  return (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Draft a Legal Document</CardTitle>
            <CardDescription>
              Describe the petition, agreement, affidavit, or other legal document you want to draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="document-details">Document Details</Label>
              <Textarea
                id="document-details"
                placeholder="e.g., 'Draft a non-disclosure agreement for a software project' or 'Draft a petition for child custody...'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={handleDraftDocument} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Draft...
                </>
              ) : (
                'Generate Draft'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Generated Draft</CardTitle>
            {result && (
               <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(result)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download .txt
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(result)}>
                    <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto bg-muted/40 p-4">
            <ScrollArea className="h-full w-full">
              {isLoading && !result ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is drafting your document...</p>
                  </div>
                </div>
              ) : result || isLoading ? (
                 <div className="mx-auto w-full max-w-4xl bg-background shadow-lg p-8 md:p-12 rounded-lg text-foreground">
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                      {result}{isLoading && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1" />}
                    </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <FileSignature className="w-12 h-12 mx-auto text-primary/50" />
                    <p>Your generated document draft will appear here.</p>
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
