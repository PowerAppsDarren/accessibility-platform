import React from 'react';
import { DataTable } from '@/components/DataTable';
import { mockData } from '@/lib/mockData';
import { Person } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const People = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredData = mockData.people.filter(person => 
    person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Person, className: 'w-[80px]' },
    { 
      header: 'Name', 
      cell: (person: Person) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{person.firstName} {person.lastName}</span>
        </div>
      )
    },
    { 
      header: 'Department', 
      cell: (person: Person) => {
        const dept = mockData.departments.find(d => d.id === person.departmentId);
        return <span className="text-muted-foreground">{dept?.name || 'Unknown'}</span>;
      }
    },
    { 
      header: 'Champion', 
      cell: (person: Person) => (
        <Badge variant={person.champion === 'Yes' ? 'default' : person.champion === 'In Progress' ? 'secondary' : 'outline'}>
          {person.champion}
        </Badge>
      )
    },
    { 
      header: 'Level Access', 
      cell: (person: Person) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            person.levelAccessAccount === 'Complete' ? 'bg-green-500' : 
            person.levelAccessAccount === 'Troubleshooting' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`} />
          <span>{person.levelAccessAccount}</span>
        </div>
      )
    },
    { header: 'Last Contact', accessorKey: 'lastContactDate' as keyof Person },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">People</h2>
          <p className="text-muted-foreground mt-1">Manage personnel and accessibility champions.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20">
          <Plus className="mr-2 h-4 w-4" /> Add Person
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border/50 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search people..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 bg-transparent"
        />
      </div>

      <DataTable 
        data={filteredData} 
        columns={columns} 
        className="shadow-xl"
      />
    </div>
  );
};

export default People;
