
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Search, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { explainLegalTerm } from '@/ai/flows/explain-legal-term';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LegalTerminology() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [term, setTerm] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!term.trim()) {
      toast({
        variant: 'destructive',
        title: 'No term provided',
        description: 'Please enter a legal term to explain.',
      });
      return;
    }

    setIsLoading(true);
    setExplanation(null);

    try {
      const response = await explainLegalTerm({ term });
      setExplanation(response.explanation);
    } catch (error: any) {
      console.error('Explanation failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message || 'Failed to get an explanation. Please try again.',
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExplain();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Legal Terminology</CardTitle>
            <CardDescription>
              Enter a legal term to get a simple, clear explanation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="legal-term">Legal Term</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="legal-term"
                  placeholder="e.g., 'Res Judicata', 'Caveat Emptor'"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                />
              </div>
            </div>
            <Button onClick={handleExplain} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Explaining...
                </>
              ) : (
                'Explain Term'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Explanation</CardTitle>
            {explanation && (
              <Button variant="ghost" size="icon" onClick={() => handleCopy(explanation)}>
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
                    <p className="text-muted-foreground">AI is thinking...</p>
                  </div>
                </div>
              ) : explanation ? (
                <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert whitespace-pre-wrap">
                  {explanation}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <BookOpen className="w-12 h-12 mx-auto text-primary/50" />
                    <p>The explanation for your term will appear here.</p>
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
