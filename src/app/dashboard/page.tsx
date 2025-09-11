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
  Activity,
  Upload,
  Users,
  Database,
  LineChart,
  GitBranch
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';

type QuickAccessTileProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

function StatusCard({ title, value, status }: { title: string, value: string, status: 'Healthy' | 'Errors' }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
         <Badge variant={status === 'Healthy' ? 'default' : 'destructive'} className="bg-green-100 text-green-800 border-green-200">
            {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage({
  searchParams,
}: {
  searchParams: { role?: string; mode?: string };
}) {
  const recentLogs = [
      { time: '2024-07-29 10:45:12', source: 'Supreme Court', status: 'Success', action: 'Indexed 15 docs' },
      { time: '2024-07-29 10:42:01', source: 'Delhi High Court', status: 'Success', action: 'Indexed 8 docs' },
      { time: '2024-07-29 10:35:54', source: 'NCLAT', status: 'Error', action: 'Connection failed' },
      { time: '2024-07-29 10:30:19', source: 'Bombay High Court', status: 'Success', action: 'Indexed 22 docs' },
    ];


  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Admin Dashboard
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard title="Ingestion Status" value="Healthy" status="Healthy" />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indexed Docs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254,890</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold font-headline mb-4">Recent Logs</h3>
        <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.time}</TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'Success' ? 'secondary' : 'destructive'} className={log.status === 'Success' ? 'bg-green-100 text-green-800' : ''}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Card>
      </div>

    </div>
  );
}
