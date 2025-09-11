'use client';

import { useState, useEffect } from 'react';
import { FileText, History, Scale, Search, Languages } from 'lucide-react';

interface CommandMenuProps {
    input: string;
    setInput: (value: string) => void;
}

const commands = [
    { name: 'draft', description: 'Draft a legal petition...', icon: <FileText className="h-4 w-4"/>, example: '/draft a petition for...' },
    { name: 'summarize', description: 'Summarize the attached document', icon: <Scale className="h-4 w-4"/>, example: '/summarize' },
    { name: 'timeline', description: 'Generate a case timeline for...', icon: <History className="h-4 w-4"/>, example: '/timeline about...' },
    { name: 'analyze', description: 'Analyze the attached document', icon: <Scale className="h-4 w-4"/>, example: '/analyze' },
    { name: 'search', description: 'Search for case law about...', icon: <Search className="h-4 w-4"/>, example: '/search for cases on...' },
    { name: 'translate', description: 'Translate text to another language', icon: <Languages className="h-4 w-4"/>, example: '/translate to Hindi Hello World' },
];

export function CommandMenu({ input, setInput }: CommandMenuProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [filteredCommands, setFilteredCommands] = useState(commands);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const isCommand = input.startsWith('/');
        setShowMenu(isCommand);

        if (isCommand) {
            const commandQuery = input.substring(1).toLowerCase();
            const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(commandQuery));
            setFilteredCommands(filtered);
            setActiveIndex(0);
        }

    }, [input]);

     useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showMenu) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex(prev => (prev + 1) % filteredCommands.length);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    if(filteredCommands[activeIndex]) {
                        const command = filteredCommands[activeIndex];
                        setInput(`/${command.name} `);
                    }
                    setShowMenu(false);
                } else if (e.key === 'Escape') {
                    setShowMenu(false);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showMenu, filteredCommands, activeIndex, setInput]);

    const handleCommandClick = (command: typeof commands[0]) => {
        setInput(`/${command.name} `);
        setShowMenu(false);
    };

    if (!showMenu || filteredCommands.length === 0) return null;

    return (
        <div className="absolute bottom-full mb-2 w-full max-w-md rounded-md border bg-background shadow-lg z-10">
            <div className="p-2">
                <p className="text-xs font-semibold px-2 py-1">COMMANDS</p>
                <ul>
                    {filteredCommands.map((command, index) => (
                        <li
                            key={command.name}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => handleCommandClick(command)}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm ${
                                index === activeIndex ? 'bg-muted' : ''
                            }`}
                        >
                            <div className="p-1.5 bg-primary/10 text-primary rounded-md">{command.icon}</div>
                            <div>
                                <p className="font-medium">{command.name}</p>
                                <p className="text-xs text-muted-foreground">{command.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
