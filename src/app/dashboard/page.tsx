
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Briefcase,
  Search as SearchIcon,
  FileText,
  Clock,
  BookOpen,
  Gavel,
  Languages
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type QuickAccessTileProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

function QuickAccessTile({
  title,
  description,
  icon: Icon,
  href,
}: QuickAccessTileProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full border-2 border-transparent transition-all duration-300 ease-in-out group-hover:border-primary/50 group-hover:shadow-2xl group-hover:-translate-y-1 transform">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
          <div className="bg-primary/10 p-3 rounded-full transition-all duration-300 group-hover:scale-110">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg font-headline">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

const roleConfig = {
    advocate: {
        welcome: "Welcome back, Advocate!",
        description: "Your AI-powered legal assistant is ready to help you win your next case.",
        quickAccess: [
            {
                title: "LegalAI",
                description: "Draft petitions, summarize documents, and manage your cases with AI.",
                icon: Briefcase,
                command: ''
            },
            {
                title: "Document Analysis",
                description: "Upload and analyze legal documents for clauses, precedents, and redlines.",
                icon: FileText,
                command: 'analyze'
            },
            {
                title: "Case Law Search",
                description: "Find relevant case law from our extensive legal database.",
                icon: Gavel,
                command: 'search'
            }
        ]
    },
    student: {
        welcome: "Welcome, Law Student!",
        description: "Your AI study partner for acing your exams and moot courts.",
         quickAccess: [
            {
                title: "LegalAI",
                description: "Understand complex legal concepts, summarize cases, and draft assignments.",
                icon: BookOpen,
                command: ''
            },
            {
                title: "Legal Research",
                description: "Search for case law, statutes, and legal articles for your research.",
                icon: SearchIcon,
                command: 'search'
            },
            {
                title: "Translate Legal Text",
                description: "Translate complex legal text into simpler terms or other languages.",
                icon: Languages,
                command: 'translate'
            },
        ]
    },
    public: {
        welcome: "Welcome!",
        description: "Your guide to an introduction to the Indian legal system.",
         quickAccess: [
            {
                title: "LegalAI",
                description: "Ask legal questions, understand your rights, and get information on legal procedures.",
                icon: Briefcase,
                command: ''
            },
            {
                title: "Legal Terminology",
                description: "Get simple explanations for complex legal terms.",
                icon: BookOpen,
                command: 'explain'
            },
            {
                title: "Public Interest Litigation",
                description: "Learn how to file a PIL and its procedures.",
                icon: Gavel,
                command: 'pil'
            },
        ]
    }
}


export default function DashboardPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'public';
  const name = searchParams.get('name') || 'User';

  const { welcome, description, quickAccess } = useMemo(() => {
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.public;
    let finalWelcome = config.welcome;

    if (name && name !== 'User') {
      if (role === 'advocate') {
        finalWelcome = `Welcome back, ${name}!`;
      } else if (role === 'student') {
        finalWelcome = `Welcome, ${name}!`;
      } else {
        finalWelcome = `Welcome, ${name}!`;
      }
    }
    
    return { ...config, welcome: finalWelcome };
  }, [role, name]);

  const recentActivities = [
    {
      action: 'Drafted a new petition',
      details: 'Civil Suit for Recovery',
      time: '2 hours ago',
    },
    {
      action: 'Searched for case law',
      details: '"Anticipatory bail under Section 438"',
      time: '5 hours ago',
    },
    {
      action: 'Summarized a document',
      details: 'Lease_Agreement_Final.pdf',
      time: '1 day ago',
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          {welcome}
        </h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl font-semibold font-headline mb-4">
          Quick Access
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickAccess.map(item => {
            const search = new URLSearchParams(searchParams.toString());
            if (item.command) {
                search.set('command', item.command);
            } else {
                search.delete('command');
            }
            const href = `/dashboard/case-management?${search.toString()}`
            return (
                <QuickAccessTile
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    href={href}
                />
            )
          })}
        </div>
      </div>

      { (role === 'advocate' || role === 'student') && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-semibold font-headline mb-4">
            Recent Activity
            </h3>
            <Card>
            <CardContent className="pt-6">
                <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                    <div className="bg-muted rounded-full p-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                        {activity.details}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {activity.time}
                    </p>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
