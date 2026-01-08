import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Person } from '@/types/schema';
import { DataTable } from '@/components/DataTable';
import RecordDialog from '@/components/RecordDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const People = () => {
  const { people, departments, addPerson, updatePerson, deletePerson } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Partial<Person>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredPeople = people.filter(person => 
    person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    departments.find(d => d.id === person.departmentId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentPerson({
      firstName: '',
      lastName: '',
      departmentId: departments[0]?.id,
      champion: 'No',
      levelAccessAccount: 'No',
      lastContactDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (person: Person) => {
    setCurrentPerson({ ...person });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentPerson.firstName || !currentPerson.lastName || !currentPerson.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && currentPerson.id) {
      updatePerson(currentPerson.id, currentPerson);
      toast.success('Person updated successfully');
    } else {
      addPerson(currentPerson as Omit<Person, 'id'>);
      toast.success('Person added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentPerson.id) {
      deletePerson(currentPerson.id);
      toast.success('Person deleted successfully');
      setIsDialogOpen(false);
    }
  };

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
        const dept = departments.find(d => d.id === person.departmentId);
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
          <p className="text-muted-foreground mt-1">Manage personnel and their access levels.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-white/20 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <input 
          type="text"
          placeholder="Search people..."
          className="bg-transparent border-none focus:outline-none text-sm w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable 
        data={filteredPeople}
        columns={columns}
        onRowClick={handleEdit}
      />

      <RecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isEditing ? "Edit Person" : "Add Person"}
        description={isEditing ? "Update personnel details." : "Add a new person to the system."}
        onSave={handleSave}
        onDelete={handleDelete}
        isEditing={isEditing}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                value={currentPerson.firstName || ''} 
                onChange={(e) => setCurrentPerson({...currentPerson, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                value={currentPerson.lastName || ''} 
                onChange={(e) => setCurrentPerson({...currentPerson, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select 
              value={currentPerson.departmentId?.toString()} 
              onValueChange={(val) => setCurrentPerson({...currentPerson, departmentId: parseInt(val)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="champion">Champion</Label>
              <Select 
                value={currentPerson.champion} 
                onValueChange={(val) => setCurrentPerson({...currentPerson, champion: val as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelAccess">Level Access Account</Label>
              <Select 
                value={currentPerson.levelAccessAccount} 
                onValueChange={(val) => setCurrentPerson({...currentPerson, levelAccessAccount: val as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On hold">On hold</SelectItem>
                  <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastContact">Last Contact Date</Label>
            <Input 
              id="lastContact" 
              type="date"
              value={currentPerson.lastContactDate || ''} 
              onChange={(e) => setCurrentPerson({...currentPerson, lastContactDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={currentPerson.notes || ''} 
              onChange={(e) => setCurrentPerson({...currentPerson, notes: e.target.value})}
            />
          </div>
        </div>
      </RecordDialog>
    </div>
  );
};

export default People;
