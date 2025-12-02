
'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Copy,
  Paperclip,
  Send,
  User,
  ThumbsUp,
  ThumbsDown,
  RefreshCcw,
  Bot
} from 'lucide-react';
import { 
  chat, 
  ChatInput,
} from '@/ai/flows/chat';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ModelId } from './header';
import { CommandMenu } from './command-menu';


type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  avatar: string;
  name: string;
  error?: boolean;
};

const TypingIndicator = () => (
  <div className="flex items-center space-x-1">
    <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce-dot-1" />
    <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce-dot-2" />
    <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce-dot-3" />
  </div>
);

const ListeningIndicator = () => (
  <div className="flex items-center justify-center">
    <Bot className="h-5 w-5 text-primary/70 animate-pulse-listening" />
  </div>
);

// Memoize the message component to prevent re-renders
const MemoizedMessage = memo(function Message({ message, onRetry }: { message: Message; onRetry: (messageId: string) => void }) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      description: 'Copied to clipboard!',
    });
  };

  const isUser = message.role === 'user';

  return (
    <div className={cn("flex items-start gap-3 animate-fade-in", isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
            <AvatarImage src={message.avatar} alt={message.name} />
            <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        'group relative max-w-lg rounded-xl px-4 py-2.5 shadow-sm',
        isUser
          ? 'bg-[--user-bubble-bg] text-[hsl(var(--user-bubble-foreground))]'
          : 'bg-[hsl(var(--bot-bubble-bg))] text-[hsl(var(--bot-bubble-foreground))]',
        { 'bg-destructive/20 border border-destructive/50': message.error }
      )}>
        <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm" style={{color: 'inherit'}}>
          {message.content}
        </div>
        <div className="mt-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {message.error ? (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRetry(message.id)}>
                    <RefreshCcw className="h-3 w-3 text-destructive" />
                </Button>
            ) : (
                <>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                        <Copy className="h-3 w-3" />
                    </Button>
                    {!isUser && (
                        <>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsDown className="h-3 w-3" />
                            </Button>
                        </>
                    )}
                </>
            )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
            <AvatarImage src={message.avatar} alt={message.name} />
            <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});


export function AssistantChat({ selectedLlm }: { selectedLlm: ModelId }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const name = searchParams.get('name') || 'User';
  const email = searchParams.get('email') || '';
  const userAvatar = `https://picsum.photos/seed/${email}/40/40`;
  const botAvatar = `https://picsum.photos/seed/bot/40/40`;

  useEffect(() => {
    // Check for a transcript passed from the transcription page
    const fromTranscript = searchParams.get('from_transcript');
    if (fromTranscript === 'true') {
      const transcript = sessionStorage.getItem('transcriptToChat');
      if (transcript) {
        const initialUserMessage = `Please analyze the following transcript:\n\n---\n\n${transcript}`;
        handleSendMessage(initialUserMessage, []);
        sessionStorage.removeItem('transcriptToChat');

        // Clean up the URL
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('from_transcript');
        router.replace(`/dashboard/case-management?${newParams.toString()}`);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const getRole = () => {
    const role = searchParams.get('role');
    if (role === 'advocate') return 'Advocate';
    if (role === 'student') return 'Student';
    return 'Public';
  };
  
  const handleSendMessage = async (messageContent: string, messageHistory: Message[]) => {
    if (!messageContent.trim()) return;

    const newUserMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageContent,
        avatar: userAvatar,
        name: name,
    };
    
    const updatedMessages = [...messageHistory, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
        const historyForApi = messageHistory
          .filter(m => !m.error)
          .map(m => ({
              role: m.role,
              content: [{ text: m.content }],
          }));
        
        const chatInput: ChatInput = {
          message: messageContent,
          history: historyForApi,
          userRole: getRole(),
          model: selectedLlm,
        };
        const response = await chat(chatInput);
        const responseContent = response.content;

      const modelMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: responseContent,
        avatar: botAvatar,
        name: 'Legal AI',
      };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error: any) {
      console.error('AI task failed:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: "⚠️ The AI task failed. This could be due to a network issue or an API error. Please try again.",
        avatar: botAvatar,
        name: 'Legal AI',
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (messageId: string) => {
    // Find the user message that came before the failed bot response
    const failedMessageIndex = messages.findIndex(m => m.id === messageId);
    if (failedMessageIndex === -1 || failedMessageIndex === 0) return;

    const userMessageToRetry = messages[failedMessageIndex - 1];
    if (userMessageToRetry.role !== 'user') return;

    // Remove the error message and the user message that caused it
    const messagesBeforeFailure = messages.slice(0, failedMessageIndex - 1);
    
    // Resend the user's message
    handleSendMessage(userMessageToRetry.content, messagesBeforeFailure);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input, messages);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="p-4 bg-primary/10 rounded-full">
                <Bot className="w-10 h-10 text-primary" />
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">How can I help you today?</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <MemoizedMessage key={message.id} message={message} onRetry={handleRetry} />
            ))}
             {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={botAvatar} alt="Legal AI" />
                    <AvatarFallback>L</AvatarFallback>
                </Avatar>
                <div className="max-w-lg rounded-xl px-4 py-2.5 bg-card text-card-foreground shadow-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background px-4 py-3">
        <form onSubmit={handleFormSubmit} className="relative">
          <CommandMenu input={input} setInput={setInput} />
          <Textarea
            placeholder="Ask anything or type '/' for commands..."
            className="pr-24 pl-10 py-3 min-h-[52px] resize-none focus-visible:shadow-lg"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                }
            }}
            disabled={isLoading}
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-3 flex items-center">
             {input.length > 0 && !isLoading ? (
              <ListeningIndicator />
             ) : (
              <Button type="button" size="icon" variant="ghost" disabled={isLoading}>
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
             )}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center">
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
