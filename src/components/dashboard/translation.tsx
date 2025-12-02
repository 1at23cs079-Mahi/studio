
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Languages, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translateText, TranslateTextInput } from '@/ai/flows/translate-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '../ui/textarea';

const languages = [
  'English',
  'Hindi',
  'Kannada',
  'Telugu',
  'Tamil',
  'Marathi',
];

export function Translation() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Hindi');

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'No text provided',
        description: 'Please enter text to translate.',
      });
      return;
    }

    setIsLoading(true);
    setTranslatedText(null);

    try {
      const input: TranslateTextInput = { text, targetLanguage: targetLang };
      const response = await translateText(input);
      setTranslatedText(response.translatedText);
    } catch (error: any) {
      console.error('Translation failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message || 'Failed to translate the text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: 'Copied to clipboard!',
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
        <Card>
            <CardHeader>
                <CardTitle>Legal Text Translation</CardTitle>
                <CardDescription>Translate legal text between supported Indian languages while preserving nuance.</CardDescription>
            </CardHeader>
        </Card>
        <div className="grid md:grid-cols-2 gap-6 flex-1">
            <Card className="flex flex-col">
                <CardHeader className="flex-row items-center justify-between">
                    <Label htmlFor="source-text" className="text-lg">
                        <Select value={sourceLang} onValueChange={setSourceLang}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Source Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Label>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    <Textarea
                        id="source-text"
                        placeholder={`Enter text in ${sourceLang}...`}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 resize-none"
                    />
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="flex-row items-center justify-between">
                    <Label htmlFor="target-text" className="text-lg">
                         <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Target Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Label>
                    {translatedText && (
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(translatedText)}>
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
                                    <p className="text-muted-foreground">Translating...</p>
                                </div>
                            </div>
                        ) : translatedText ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                                {translatedText}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center text-muted-foreground space-y-4">
                                    <Languages className="w-12 h-12 mx-auto text-primary/50" />
                                    <p>Your translation will appear here.</p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
        <div className="flex justify-center items-center gap-4">
            <Button onClick={handleTranslate} disabled={isLoading || !text.trim()} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate'
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleSwapLanguages}>
                <ArrowRightLeft className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
