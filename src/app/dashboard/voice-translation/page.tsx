
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Mic, Square, Voicemail, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transcribeAudio, TranscribeAudioInput } from '@/ai/flows/transcribe-audio';
import { translateText, TranslateTextInput } from '@/ai/flows/translate-text';
import { ScrollArea } from '@/components/ui/scroll-area';

const languages = ['Hindi', 'Kannada', 'Telugu', 'Tamil', 'Marathi', 'English'];

export default function VoiceTranslationPage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('Hindi');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsLoading(true);
        setTranscribedText('');
        setTranslatedText('');

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioDataUri = await blobToDataUri(audioBlob);

        try {
          // Step 1: Transcribe Audio
          const transcriptionResponse = await transcribeAudio({ audioDataUri });
          const transcript = transcriptionResponse.transcript;
          setTranscribedText(transcript);
          
          if (transcript.trim()) {
            // Step 2: Translate Text
            const translationResponse = await translateText({ text: transcript, targetLanguage: targetLang });
            setTranslatedText(translationResponse.translatedText);
          } else {
            setTranslatedText('');
            toast({
              variant: 'destructive',
              title: 'No speech detected',
              description: 'Could not detect any speech in the audio.',
            });
          }

        } catch (error: any) {
          console.error('Voice translation failed:', error);
          toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Failed to process the audio. Please try again.',
          });
          setTranscribedText('Error processing audio.');
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscribedText(null);
      setTranslatedText(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access in your browser settings to use this feature.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const blobToDataUri = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
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
          <CardTitle>Voice Translation</CardTitle>
          <CardDescription>
            Record your voice, get it transcribed, and then translated into your chosen language.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
             <Label htmlFor="target-language">Target Language</Label>
             <Select value={targetLang} onValueChange={setTargetLang} disabled={isRecording || isLoading}>
                <SelectTrigger id="target-language" className="w-[180px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          {!isRecording ? (
            <Button size="lg" onClick={handleStartRecording} disabled={isLoading} className="gap-2">
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <Button size="lg" variant="destructive" onClick={handleStopRecording} className="gap-2 animate-pulse">
              <Square className="h-5 w-5" />
              Stop Recording
            </Button>
          )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6 flex-1">
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Transcription (From Voice)</CardTitle>
            {transcribedText && (
              <Button variant="ghost" size="icon" onClick={() => handleCopy(transcribedText)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full w-full">
              {isLoading && !transcribedText ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Processing audio...</p>
                  </div>
                </div>
              ) : transcribedText ? (
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {transcribedText}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <Voicemail className="w-12 h-12 mx-auto text-primary/50" />
                    <p>Your transcription will appear here.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Translation</CardTitle>
            {translatedText && (
              <Button variant="ghost" size="icon" onClick={() => handleCopy(translatedText)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full w-full">
              {isLoading && !translatedText ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Translating text...</p>
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
    </div>
  );
}
