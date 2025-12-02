
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Gavel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchCaseLaw, CaseLaw, SearchCaseLawInput } from '@/ai/flows/search-case-law';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const subjectOptions = [
    'Constitutional Law',
    'Criminal Law',
    'Civil Law',
    'Corporate Law',
    'Intellectual Property',
    'Cyber Law',
    "Women's Rights",
];

export default function CaseLawSearchPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CaseLaw[]>([]);
  
  const { register, handleSubmit, watch, setValue } = useForm<SearchCaseLawInput>({
    defaultValues: {
        query: '',
        filters: {
            court: 'High Court', // Hardcode to High Court
            judge: '',
            year: undefined,
            subject: '',
        }
    }
  });

  const onSubmit = async (data: SearchCaseLawInput) => {
    if (!data.query.trim()) {
        toast({
            variant: 'destructive',
            title: 'Search query is required.',
        });
        return;
    }
    
    setIsLoading(true);
    setResults([]);

    // Ensure the court filter is always set to High Court
    const searchData = {
        ...data,
        filters: {
            ...data.filters,
            court: 'High Court',
        }
    };

    try {
        const response = await searchCaseLaw(searchData);
        setResults(response.results);
        if (response.results.length === 0) {
            toast({
                title: 'No results found',
                description: 'Try broadening your search query.',
            });
        }
    } catch (error: any) {
        console.error('Case law search failed:', error);
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Failed to search for case law. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="grid md:grid-cols-12 gap-6 h-full">
      <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Karnataka High Court Case Search</CardTitle>
            <CardDescription>
              Search for cases from the Karnataka High Court database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="search-query">Search Query</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-query"
                    placeholder="e.g., 'writ of mandamus'"
                    {...register('query')}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="court-filter">Court</Label>
                 <Select value="High Court" disabled>
                    <SelectTrigger id="court-filter">
                        <SelectValue placeholder="Filter by court..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High Court">Karnataka High Court</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject-filter">Subject Matter</Label>
                 <Select onValueChange={(value) => setValue('filters.subject', value)} >
                    <SelectTrigger id="subject-filter">
                        <SelectValue placeholder="Filter by subject..." />
                    </SelectTrigger>
                    <SelectContent>
                        {subjectOptions.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="judge-filter">Judge</Label>
                <Input
                  id="judge-filter"
                  placeholder="e.g., 'Justice H.R. Khanna'"
                  {...register('filters.judge')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="year-filter">Year</Label>
                <Input
                  id="year-filter"
                  type="number"
                  placeholder="e.g., '1973'"
                  {...register('filters.year', { valueAsNumber: true })}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                ) : (
                  'Search'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-8 lg:col-span-9 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Search Results</CardTitle>
            <Badge variant="secondary">{results.length} found</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Searching for cases...</p>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case Title</TableHead>
                            <TableHead>Citation</TableHead>
                            <TableHead>Court</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((caseLaw) => (
                            <TableRow key={caseLaw.id}>
                                <TableCell className="font-medium">{caseLaw.title}</TableCell>
                                <TableCell>{caseLaw.citation}</TableCell>
                                <TableCell>{caseLaw.court}</TableCell>
                                <TableCell>
                                    <Badge variant={caseLaw.status === 'Landmark' ? 'default' : caseLaw.status === 'Overruled' ? 'destructive' : 'outline'}>
                                        {caseLaw.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <Gavel className="w-12 h-12 mx-auto text-primary/50" />
                    <p>Search results will appear here.</p>
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
