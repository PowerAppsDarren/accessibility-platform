import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Person } from '../../../drizzle/schema';

type PersonForm = Omit<Person, 'lastContactDate' | 'createdAt' | 'updatedAt'> & {
  lastContactDate?: string;
};
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
  const { data: people = [], isLoading: peopleLoading, refetch: refetchPeople } = trpc.people.list.useQuery();
  const { data: departments = [] } = trpc.departments.list.useQuery();
  const createPerson = trpc.people.create.useMutation();
  const updatePersonMutation = trpc.people.update.useMutation();
  const deletePersonMutation = trpc.people.delete.useMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Partial<PersonForm>>({});
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
    const formPerson: Partial<PersonForm> = {
      ...person,
      lastContactDate: person.lastContactDate ? new Date(person.lastContactDate).toISOString().split('T')[0] : undefined
    };
    setCurrentPerson(formPerson);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentPerson.firstName || !currentPerson.lastName || !currentPerson.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && currentPerson.id) {
        await updatePersonMutation.mutateAsync({
          id: currentPerson.id,
          firstName: currentPerson.firstName,
          lastName: currentPerson.lastName,
          departmentId: currentPerson.departmentId,
          champion: currentPerson.champion as "No" | "In Progress" | "Yes",
          levelAccessAccount: currentPerson.levelAccessAccount as "No" | "In Progress" | "On hold" | "Troubleshooting" | "Complete",
          lastContactDate: currentPerson.lastContactDate || undefined,
          notes: currentPerson.notes || undefined
        });
        toast.success('Person updated successfully');
      } else {
        await createPerson.mutateAsync({
          firstName: currentPerson.firstName,
          lastName: currentPerson.lastName,
          departmentId: currentPerson.departmentId,
          champion: currentPerson.champion as "No" | "In Progress" | "Yes",
          levelAccessAccount: currentPerson.levelAccessAccount as "No" | "In Progress" | "On hold" | "Troubleshooting" | "Complete",
          lastContactDate: currentPerson.lastContactDate || undefined,
          notes: currentPerson.notes || undefined
        });
        toast.success('Person added successfully');
      }
      refetchPeople();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save person');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!currentPerson.id) return;

    try {
      await deletePersonMutation.mutateAsync({ id: currentPerson.id });
      toast.success('Person deleted successfully');
      refetchPeople();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete person');
      console.error(error);
    }
  };

  const columns = [
    { header: 'First Name', accessorKey: 'firstName' as const },
    { header: 'Last Name', accessorKey: 'lastName' as const },
    { 
      header: 'Department',
      cell: (person: Person) => departments.find(d => d.id === person.departmentId)?.name || 'N/A'
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
        <Badge variant={person.levelAccessAccount === 'Complete' ? 'default' : person.levelAccessAccount === 'In Progress' ? 'secondary' : 'outline'}>
          {person.levelAccessAccount}
        </Badge>
      )
    },
    { 
      header: 'Last Contact',
      cell: (person: Person) => person.lastContactDate ? new Date(person.lastContactDate).toLocaleDateString() : 'N/A'
    }
  ];

  if (peopleLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">People</h1>
          <p className="text-muted-foreground">Manage personnel and their accessibility roles.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Person
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
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
        onSave={handleSave}
        onDelete={isEditing ? handleDelete : undefined}
        title={isEditing ? 'Edit Person' : 'Add Person'}
        isEditing={isEditing}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={currentPerson.firstName || ''}
              onChange={(e) => setCurrentPerson({ ...currentPerson, firstName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={currentPerson.lastName || ''}
              onChange={(e) => setCurrentPerson({ ...currentPerson, lastName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select
              value={currentPerson.departmentId?.toString()}
              onValueChange={(value) => setCurrentPerson({ ...currentPerson, departmentId: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="champion">Champion Status</Label>
            <Select
              value={currentPerson.champion || 'No'}
              onValueChange={(value) => setCurrentPerson({ ...currentPerson, champion: value as "No" | "In Progress" | "Yes" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="levelAccessAccount">Level Access Account</Label>
            <Select
              value={currentPerson.levelAccessAccount || 'No'}
              onValueChange={(value) => setCurrentPerson({ ...currentPerson, levelAccessAccount: value as "No" | "In Progress" | "On hold" | "Troubleshooting" | "Complete" })}
            >
              <SelectTrigger>
                <SelectValue />
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
          <div>
            <Label htmlFor="lastContactDate">Last Contact Date</Label>
            <Input
              id="lastContactDate"
              type="date"
              value={currentPerson.lastContactDate || ''}
              onChange={(e) => setCurrentPerson({ ...currentPerson, lastContactDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={currentPerson.notes || ''}
              onChange={(e) => setCurrentPerson({ ...currentPerson, notes: e.target.value })}
            />
          </div>
        </div>
      </RecordDialog>
    </div>
  );
};

export default People;
