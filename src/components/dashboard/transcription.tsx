
'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Mic,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  transcribeAudio,
  TranscribeAudioInput,
} from '@/ai/flows/transcribe-audio';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Transcription() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
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

  const handleTranscribe = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No audio file uploaded',
        description: 'Please upload an audio file to transcribe.',
      });
      return;
    }

    setIsLoading(true);
    setTranscript(null);

    try {
      const audioDataUri = await fileToDataUri(file);
      const input: TranscribeAudioInput = { audioDataUri };
      const response = await transcribeAudio(input);
      setTranscript(response.transcript);

    } catch (error: any) {
      console.error('Transcription failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message || 'Failed to transcribe the audio. Please try again.',
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
  
  const handleSendToChat = () => {
    if (!transcript) return;
    
    // We need to store the large transcript somewhere to pass it to the chat page.
    // sessionStorage is a good choice for this.
    sessionStorage.setItem('transcriptToChat', transcript);

    const params = new URLSearchParams(searchParams.toString());
    params.set('from_transcript', 'true');
    
    router.push(`/dashboard/case-management?${params.toString()}`);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Audio Transcription</CardTitle>
            <CardDescription>
              Upload an audio file (MP3, WAV, etc.) to get an AI-powered transcription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="audio-upload">Upload Audio</Label>
              <Input
                id="audio-upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="audio/*"
              />
              {!file ? (
                <Label
                  htmlFor="audio-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">MP3, WAV, M4A, etc.</p>
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
            
            <Button onClick={handleTranscribe} disabled={isLoading || !file} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                'Transcribe Audio'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Transcription</CardTitle>
             {transcript && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSendToChat}>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Chat
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(transcript)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is transcribing your audio...</p>
                  </div>
                </div>
              ) : transcript ? (
                 <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap relative">
                    {transcript}
                  </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <Mic className="w-12 h-12 mx-auto text-primary/50" />
                    <p>Your audio transcription will appear here.</p>
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
