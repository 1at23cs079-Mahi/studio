'use client';

import { useState, useRef, useEffect } from 'react';
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
  FileText,
  History,
  Scale,
  FileUp,
  Loader2,
  Share2,
  Copy,
  Download,
  Mic,
  Settings,
  Languages,
  Paperclip,
  X,
  Send,
  User,
  MoreHorizontal,
} from 'lucide-react';
import { 
  chat, 
  ChatInput,
  ChatOutput,
} from '@/ai/flows/chat';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/icons/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CommandMenu } from '@/components/dashboard/command-menu';
import { CaseLaw, SearchCaseLawOutput } from '@/ai/flows/search-case-law';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Message = {
  role: 'user' | 'model';
  content: string;
  citations?: string[];
  analysisResults?: string;
  timeline?: string;
  searchResult?: SearchCaseLawOutput;
};

export default function CaseManagementPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const getRole = () => {
    const role = searchParams.get('role');
    if (role === 'advocate') return 'Advocate';
    if (role === 'student') return 'Student';
    return 'Public';
  };
  
  const startRecording = async () => {
    // aac, mp3, webm, ogg, wav
    const mimeTypes = [
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
      'audio/aac',
    ];
    let supportedMimeType: string | undefined;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        supportedMimeType = mimeType;
        break;
      }
    }

    if (!supportedMimeType) {
      toast({
        variant: 'destructive',
        title: 'Audio Recording Not Supported',
        description: 'Your browser does not support any of the required audio formats.',
      });
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: supportedMimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: supportedMimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await executeTask(input, undefined, base64Audio);
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description:
          'Please enable microphone permissions in your browser settings.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const executeTask = async (currentInput: string, attachedFile?: File, audioUri?: string) => {
    if (!currentInput && !attachedFile && !audioUri) return;
    
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setFile(null);

    try {
      let dataUri: string | undefined;
      if (attachedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(attachedFile);
        dataUri = await new Promise<string>(resolve => {
          reader.onload = e => resolve(e.target?.result as string);
        });
      }

      const inputPayload: ChatInput = {
        message: currentInput,
        history: messages.map(m => ({role: m.role, content: m.content})),
        userRole: getRole(),
        documentDataUri: dataUri,
        audioDataUri: audioUri,
      };

      const response = await chat(inputPayload);
      const modelMessage: Message = { role: 'model', ...response };

      setMessages(prev => [...prev, modelMessage]);

    } catch (error: any) {
      console.error('AI task failed:', error);
      const errorMessage : Message = {
        role: 'model',
        content: 'An error occurred: ' + error.message || 'Failed to complete the request. Please try again later.'
      }
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message || 'Failed to complete the request. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTask(input, file);
  }

  const renderContent = (message: Message) => {
    if (message.searchResult) {
      return <SearchResultTable result={message.searchResult} />;
    }
    // Simple check for list formatting
    if (message.content.includes('\n- ')) {
      const parts = message.content.split('\n');
      return (
        <div className="space-y-2">
          {parts.map((part, index) => {
            if (part.startsWith('- ')) {
              return <li key={index} className="ml-4 list-disc">{part.substring(2)}</li>;
            }
             if (part.match(/^\d+\.\s/)) {
              return <li key={index} className="ml-4 list-decimal">{part.substring(part.indexOf(' ') + 1)}</li>;
            }
            return <p key={index}>{part}</p>;
          })}
        </div>
      );
    }
    return <p>{message.content}</p>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh_-_6rem)]">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Logo iconClassName="size-16" textClassName="text-5xl" />
            <p className="mt-4 text-muted-foreground">How can I help you today?</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'model' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback><Scale className="w-4 h-4"/></AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-2xl rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <div className="prose prose-sm max-w-none text-sm text-foreground">
                    {renderContent(message)}
                  </div>
                  {message.citations && message.citations.length > 0 && (
                     <div className="mt-4">
                        <h4 className="font-semibold text-xs mb-1">Citations</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          {message.citations.map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                  )}
                   <div className="flex items-center justify-end gap-2 mt-2 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3"/></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3"/></Button>
                  </div>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Scale className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="max-w-2xl rounded-lg px-4 py-3 bg-muted flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="border-t bg-background px-4 py-3">
        <form onSubmit={handleFormSubmit} className="relative">
          <CommandMenu input={input} setInput={setInput} />
          <Textarea
            placeholder="Ask LegalAi anything... or type '/' for commands"
            className="pr-28 pl-10 min-h-[48px] resize-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                }
            }}
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-3 flex items-center">
             <label htmlFor="file-upload">
              <Paperclip className="h-5 w-5 text-muted-foreground cursor-pointer" />
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange}/>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
            <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
              >
                <Mic className="h-5 w-5" />
            </Button>
            <Button type="submit" size="icon" disabled={isLoading || (!input && !file)}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
         {file && (
            <div className="mt-2 flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md">
              <FileText className="h-4 w-4"/>
              <span>{file.name}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setFile(null)}>
                <X className="h-4 w-4"/>
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}

function SearchResultTable({ result }: { result: SearchCaseLawOutput }) {
  if (!result || result.results.length === 0) {
    return <p>No case law results found.</p>;
  }
  return (
    <div className="my-4">
        <p className="text-sm mb-2">Found {result.results.length} relevant cases:</p>
        <Card>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Case Title & Citation</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {result.results.map(res => (
                <TableRow key={res.id}>
                    <TableCell>
                    <div className="font-medium hover:underline">
                        <Link href="#">{res.title}</Link>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {res.citation}
                    </div>
                    </TableCell>
                    <TableCell>{res.court}</TableCell>
                    <TableCell>{res.date}</TableCell>
                    <TableCell>
                    <Badge
                        variant={
                        res.status === 'Landmark'
                            ? 'default'
                            : 'secondary'
                        }
                    >
                        {res.status}
                    </Badge>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </Card>
    </div>
  );
}
