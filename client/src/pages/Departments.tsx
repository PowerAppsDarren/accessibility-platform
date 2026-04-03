import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Department } from '../../../drizzle/schema';

type DepartmentForm = Omit<Department, 'lastContactDate' | 'createdAt' | 'updatedAt'> & {
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

const Departments = () => {
  const { data: departments = [], isLoading, refetch } = trpc.departments.list.useQuery();
  const { data: people = [] } = trpc.people.list.useQuery();
  const createMutation = trpc.departments.create.useMutation();
  const updateMutation = trpc.departments.update.useMutation();
  const deleteMutation = trpc.departments.delete.useMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Partial<DepartmentForm>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentDepartment({
      name: '',
      lastContactDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: Department) => {
    const formDept: Partial<DepartmentForm> = {
      ...dept,
      lastContactDate: dept.lastContactDate ? new Date(dept.lastContactDate).toISOString().split('T')[0] : undefined
    };
    setCurrentDepartment(formDept);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentDepartment.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && currentDepartment.id) {
        await updateMutation.mutateAsync({
          id: currentDepartment.id,
          name: currentDepartment.name,
          departmentHeadId: currentDepartment.departmentHeadId || undefined,
          managerId: currentDepartment.managerId || undefined,
          lastContactDate: currentDepartment.lastContactDate || undefined,
          notes: currentDepartment.notes || undefined
        });
        toast.success('Department updated successfully');
      } else {
        await createMutation.mutateAsync({
          name: currentDepartment.name,
          departmentHeadId: currentDepartment.departmentHeadId || undefined,
          managerId: currentDepartment.managerId || undefined,
          lastContactDate: currentDepartment.lastContactDate || undefined,
          notes: currentDepartment.notes || undefined
        });
        toast.success('Department added successfully');
      }
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save department');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!currentDepartment.id) return;

    try {
      await deleteMutation.mutateAsync({ id: currentDepartment.id });
      toast.success('Department deleted successfully');
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete department');
      console.error(error);
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Department, className: 'w-[80px]' },
    { header: 'Name', accessorKey: 'name' as keyof Department },
    {
      header: 'Head',
      cell: (dept: Department) => {
        const person = people.find(p => p.id === dept.departmentHeadId);
        return person ? `${person.firstName} ${person.lastName}` : '-';
      }
    },
    {
      header: 'Manager',
      cell: (dept: Department) => {
        const person = people.find(p => p.id === dept.managerId);
        return person ? `${person.firstName} ${person.lastName}` : '-';
      }
    },
    {
      header: 'Last Contact',
      cell: (dept: Department) => dept.lastContactDate ? new Date(dept.lastContactDate).toLocaleDateString() : 'N/A'
    },
  ];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Departments</h2>
          <p className="text-muted-foreground mt-1">Manage organizational units and leadership.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-white/20 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <input
          type="text"
          placeholder="Search departments..."
          className="bg-transparent border-none focus:outline-none text-sm w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable
        data={filteredDepartments}
        columns={columns}
        onRowClick={handleEdit}
      />

      <RecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isEditing ? "Edit Department" : "Add Department"}
        description={isEditing ? "Update department details." : "Add a new department to the system."}
        onSave={handleSave}
        onDelete={isEditing ? handleDelete : undefined}
        isEditing={isEditing}
      >
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              value={currentDepartment.name || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="head">Department Head</Label>
              <Select
                value={currentDepartment.departmentHeadId?.toString()}
                onValueChange={(val) => setCurrentDepartment({...currentDepartment, departmentHeadId: parseInt(val)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select head" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.firstName} {person.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={currentDepartment.managerId?.toString()}
                onValueChange={(val) => setCurrentDepartment({...currentDepartment, managerId: parseInt(val)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.firstName} {person.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastContact">Last Contact Date</Label>
            <Input
              id="lastContact"
              type="date"
              value={currentDepartment.lastContactDate || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, lastContactDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={currentDepartment.notes || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, notes: e.target.value})}
            />
          </div>
        </div>
      </RecordDialog>
    </div>
  );
};

export default Departments;
