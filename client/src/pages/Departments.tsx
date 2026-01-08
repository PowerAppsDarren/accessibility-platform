import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Department } from '@/types/schema';
import { DataTable } from '@/components/DataTable';
import RecordDialog from '@/components/RecordDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const Departments = () => {
  const { departments, people, addDepartment, updateDepartment, deleteDepartment } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Partial<Department>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentDepartment({
      name: '',
      lastContactDate: new Date().toISOString().split('T')[0],
      websiteIds: [],
      applicationIds: []
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setCurrentDepartment({ ...dept });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentDepartment.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && currentDepartment.id) {
      updateDepartment(currentDepartment.id, currentDepartment);
      toast.success('Department updated successfully');
    } else {
      addDepartment(currentDepartment as Omit<Department, 'id'>);
      toast.success('Department added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentDepartment.id) {
      deleteDepartment(currentDepartment.id);
      toast.success('Department deleted successfully');
      setIsDialogOpen(false);
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Department, className: 'w-[80px]' },
    { header: 'Name', accessorKey: 'name' as keyof Department },
    { 
      header: 'Head', 
      cell: (dept: Department) => {
        const person = people.find(p => p.id === dept.headId);
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
    { header: 'Last Contact', accessorKey: 'lastContactDate' as keyof Department },
  ];

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
        onDelete={handleDelete}
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
                value={currentDepartment.headId?.toString()} 
                onValueChange={(val) => setCurrentDepartment({...currentDepartment, headId: parseInt(val)})}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="champion">Champion</Label>
              <Select 
                value={currentDepartment.championId?.toString()} 
                onValueChange={(val) => setCurrentDepartment({...currentDepartment, championId: parseInt(val)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select champion" />
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
              <Label htmlFor="lastContact">Last Contact Date</Label>
              <Input 
                id="lastContact" 
                type="date"
                value={currentDepartment.lastContactDate || ''} 
                onChange={(e) => setCurrentDepartment({...currentDepartment, lastContactDate: e.target.value})}
              />
            </div>
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
