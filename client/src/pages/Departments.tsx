import React from 'react';
import { DataTable } from '@/components/DataTable';
import { mockData } from '@/lib/mockData';
import { Department } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Departments = () => {
  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Department, className: 'w-[80px]' },
    { header: 'Department Name', accessorKey: 'name' as keyof Department, className: 'font-bold text-primary' },
    { 
      header: 'Head', 
      cell: (dept: Department) => {
        const head = mockData.people.find(p => p.id === dept.headId);
        return head ? `${head.firstName} ${head.lastName}` : '-';
      }
    },
    { 
      header: 'Champion', 
      cell: (dept: Department) => {
        const champion = mockData.people.find(p => p.id === dept.championId);
        return champion ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {champion.firstName[0]}{champion.lastName[0]}
            </div>
            <span>{champion.firstName} {champion.lastName}</span>
          </div>
        ) : '-';
      }
    },
    { 
      header: 'Websites', 
      cell: (dept: Department) => (
        <span className="font-mono bg-secondary/50 px-2 py-1 rounded text-xs">
          {dept.websiteIds.length}
        </span>
      )
    },
    { 
      header: 'Apps', 
      cell: (dept: Department) => (
        <span className="font-mono bg-secondary/50 px-2 py-1 rounded text-xs">
          {dept.applicationIds.length}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Departments</h2>
          <p className="text-muted-foreground mt-1">Organizational units and their accessibility leads.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <DataTable 
        data={mockData.departments} 
        columns={columns} 
        className="shadow-xl"
      />
    </div>
  );
};

export default Departments;
