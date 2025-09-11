import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  FileUp,
  Briefcase,
  ShieldCheck,
  Search as SearchIcon,
  Activity
} from 'lucide-react';
import Link from 'next/link';

type QuickAccessTileProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

function QuickAccessTile({ title, description, icon: Icon, href }: QuickAccessTileProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="hover:border-primary hover:shadow-lg transition-all duration-200 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-body">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { role?: string; mode?: string };
}) {
  const role = searchParams?.role || 'user';
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const quickAccessTiles = [
    {
      title: 'Search Judgments',
      description: 'Hybrid search with filters.',
      icon: SearchIcon,
      href: '#',
    },
    {
      title: 'Upload Document',
      description: 'Analyze & find precedents.',
      icon: FileUp,
      href: '#',
    },
    {
      title: 'My Cases',
      description: 'Access your private indices.',
      icon: Briefcase,
      href: '#',
    },
    {
      title: 'Compliance Audit',
      description: 'Run statute checks.',
      icon: ShieldCheck,
      href: '#',
    },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Welcome, {capitalize(role)}
        </h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold font-headline">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickAccessTiles.map((tile) => (
                <QuickAccessTile key={tile.title} {...tile} />
            ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>An overview of your recent actions in Lexica.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full flex items-center justify-center bg-secondary/50 rounded-md">
                    <p className="text-muted-foreground">Activity chart will be displayed here.</p>
                </div>
            </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
                <Activity className="h-4 w-4 mr-4 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Indexing Status</p>
                  <p className="text-sm text-muted-foreground">Last updated: Just now</p>
                </div>
                <div className="ml-auto font-medium text-green-600">Healthy</div>
            </div>
            <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-4 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Your Private Index</p>
                  <p className="text-sm text-muted-foreground">42 cases, 1.2GB</p>
                </div>
                <div className="ml-auto font-medium">Active</div>
            </div>
             <div className="flex items-center">
                <ShieldCheck className="h-4 w-4 mr-4 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Bare Acts</p>
                  <p className="text-sm text-muted-foreground">IPC / BNS updated</p>
                </div>
                <div className="ml-auto font-medium text-green-600">Current</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
