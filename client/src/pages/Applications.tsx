import React from 'react';
import { DataTable } from '@/components/DataTable';
import { mockData } from '@/lib/mockData';
import { Application } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

const Applications = () => {
  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Application, className: 'w-[60px]' },
    { 
      header: 'Application', 
      cell: (app: Application) => (
        <div className="font-medium text-foreground">{app.url?.replace('https://', '').split('/')[0] || 'Unknown App'}</div>
      )
    },
    { header: 'Contact', accessorKey: 'contactName' as keyof Application },
    { 
      header: 'Department', 
      cell: (app: Application) => {
        const dept = mockData.departments.find(d => d.id === app.departmentId);
        return <span className="text-muted-foreground">{dept?.name || '-'}</span>;
      }
    },
    { 
      header: 'VPAT/ACR', 
      cell: (app: Application) => (
        app.vpatOrAcr ? (
          <Badge className="bg-green-600 hover:bg-green-700">
            <FileText className="w-3 h-3 mr-1" /> Available
          </Badge>
        ) : (
          <Badge variant="destructive">Missing</Badge>
        )
      )
    },
    { header: 'Last Contact', accessorKey: 'lastContactDate' as keyof Application },
    { 
      header: 'Notes', 
      cell: (app: Application) => (
        <span className="text-xs text-muted-foreground truncate max-w-[200px] block" title={app.notes}>
          {app.notes || '-'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Applications</h2>
          <p className="text-muted-foreground mt-1">Software inventory and VPAT status tracking.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
          <Plus className="mr-2 h-4 w-4" /> Add Application
        </Button>
      </div>

      <DataTable 
        data={mockData.applications} 
        columns={columns} 
        className="shadow-xl"
      />
    </div>
  );
};

export default Applications;
