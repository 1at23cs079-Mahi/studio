
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
import { Loader2, Copy, FileSignature } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  draftLegalPetition,
  DraftLegalPetitionInput,
} from '@/ai/flows/draft-legal-petition';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { useSearchParams } from 'next/navigation';

export function DraftPetition() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ draft: string; citations: string[] } | null>(null);

  const getRole = () => {
    const role = searchParams.get('role');
    if (role === 'advocate') return 'Advocate';
    if (role === 'student') return 'Student';
    return 'Public';
  };

  const handleDraftPetition = async () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Petition details are required.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const input: DraftLegalPetitionInput = {
        query,
        userRole: getRole(),
      };
      const response = await draftLegalPetition(input);
      setResult(response);
    } catch (error: any) {
      console.error('Petition drafting failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message || 'Failed to draft the petition. Please try again.',
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
            <CardTitle>Draft a Legal Petition</CardTitle>
            <CardDescription>
              Describe the details of the petition you want to draft, and the AI will generate a starting point for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="petition-details">Petition Details</Label>
              <Textarea
                id="petition-details"
                placeholder="e.g., 'Draft a petition for a civil suit for the recovery of money from a client who has not paid for services rendered.'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={handleDraftPetition} disabled={isLoading} className="w-full">
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
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Generated Draft</CardTitle>
            {result && (
              <Button variant="ghost" size="icon" onClick={() => handleCopy(result.draft)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is drafting your petition...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap relative">
                  <h3 className="font-semibold">Draft</h3>
                  <p>{result.draft}</p>
                  {result.citations.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-4">Citations</h3>
                      <ul className="list-disc pl-5">
                        {result.citations.map((citation, index) => (
                          <li key={index}>{citation}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <FileSignature className="w-12 h-12 mx-auto text-primary/50" />
                    <p>Your generated petition draft will appear here.</p>
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
