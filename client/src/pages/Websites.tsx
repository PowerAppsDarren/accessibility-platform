import React from 'react';
import { DataTable } from '@/components/DataTable';
import { mockData } from '@/lib/mockData';
import { Website } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';

const Websites = () => {
  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Website, className: 'w-[60px]' },
    { 
      header: 'URL', 
      cell: (site: Website) => (
        <a 
          href={site.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          {site.url?.replace('https://', '')}
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>
      )
    },
    { header: 'Owner', accessorKey: 'owner' as keyof Website },
    { 
      header: 'Score', 
      cell: (site: Website) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-secondary rounded-full h-2 w-16 overflow-hidden">
            <div 
              className={`h-full ${
                (site.siteimproveScore || 0) >= 90 ? 'bg-green-500' : 
                (site.siteimproveScore || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{ width: `${site.siteimproveScore}%` }}
            />
          </div>
          <span className="text-xs font-mono">{site.siteimproveScore}</span>
        </div>
      )
    },
    { 
      header: 'Review Status', 
      cell: (site: Website) => (
        <div className="flex gap-2">
          {site.accessibilityReviewed ? (
            <Badge variant="outline" className="border-green-500 text-green-600 bg-green-500/10">Reviewed</Badge>
          ) : (
            <Badge variant="outline" className="border-red-500 text-red-600 bg-red-500/10">Pending</Badge>
          )}
          {site.manualReview && (
            <Badge variant="secondary">Manual</Badge>
          )}
        </div>
      )
    },
    { 
      header: 'Remediation', 
      cell: (site: Website) => (
        <span className="text-xs text-muted-foreground truncate max-w-[200px] block" title={site.remediationPlan}>
          {site.remediationPlan || '-'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Websites</h2>
          <p className="text-muted-foreground mt-1">Track web property accessibility compliance.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
          <Plus className="mr-2 h-4 w-4" /> Add Website
        </Button>
      </div>

      <DataTable 
        data={mockData.websites} 
        columns={columns} 
        className="shadow-xl"
      />
    </div>
  );
};

export default Websites;
