import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Application } from '../../../drizzle/schema';

type ApplicationForm = Omit<Application, 'lastContactDate' | 'createdAt' | 'updatedAt'> & {
  lastContactDate?: string;
};

import { DataTable } from '@/components/DataTable';
import RecordDialog from '@/components/RecordDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Applications = () => {
  const { data: applications = [], isLoading, refetch } = trpc.applications.list.useQuery();
  const { data: departments = [] } = trpc.departments.list.useQuery();
  const createMutation = trpc.applications.create.useMutation();
  const updateMutation = trpc.applications.update.useMutation();
  const deleteMutation = trpc.applications.delete.useMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<Partial<ApplicationForm>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredApplications = applications.filter(app =>
    (app.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.contactName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentApplication({
      url: '',
      contactName: '',
      departmentId: departments[0]?.id,
      lastContactDate: new Date().toISOString().split('T')[0],
      vpatOrAcr: false
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (app: Application) => {
    const formApp: Partial<ApplicationForm> = {
      ...app,
      lastContactDate: app.lastContactDate ? new Date(app.lastContactDate).toISOString().split('T')[0] : undefined
    };
    setCurrentApplication(formApp);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentApplication.url || !currentApplication.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && currentApplication.id) {
        await updateMutation.mutateAsync({
          id: currentApplication.id,
          url: currentApplication.url || undefined,
          departmentId: currentApplication.departmentId || undefined,
          contactName: currentApplication.contactName || undefined,
          vendorId: currentApplication.vendorId || undefined,
          lastContactDate: currentApplication.lastContactDate || undefined,
          vpatOrAcr: currentApplication.vpatOrAcr ?? undefined,
          notes: currentApplication.notes || undefined
        });
        toast.success('Application updated successfully');
      } else {
        await createMutation.mutateAsync({
          url: currentApplication.url || undefined,
          departmentId: currentApplication.departmentId || undefined,
          contactName: currentApplication.contactName || undefined,
          vendorId: currentApplication.vendorId || undefined,
          lastContactDate: currentApplication.lastContactDate || undefined,
          vpatOrAcr: currentApplication.vpatOrAcr ?? undefined,
          notes: currentApplication.notes || undefined
        });
        toast.success('Application added successfully');
      }
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save application');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!currentApplication.id) return;

    try {
      await deleteMutation.mutateAsync({ id: currentApplication.id });
      toast.success('Application deleted successfully');
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete application');
      console.error(error);
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof Application, className: 'w-[60px]' },
    {
      header: 'URL',
      cell: (app: Application) => (
        <a
          href={app.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {(app.url || '').replace('https://', '')}
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>
      )
    },
    {
      header: 'Department',
      cell: (app: Application) => {
        const dept = departments.find(d => d.id === app.departmentId);
        return dept?.name || 'Unknown';
      }
    },
    { header: 'Contact', accessorKey: 'contactName' as keyof Application },
    {
      header: 'VPAT/ACR',
      cell: (app: Application) => (
        !!app.vpatOrAcr ? (
          <Badge className="bg-green-600 hover:bg-green-700">
            <FileText className="w-3 h-3 mr-1" /> Available
          </Badge>
        ) : (
          <Badge variant="destructive">Missing</Badge>
        )
      )
    },
    {
      header: 'Last Contact',
      cell: (app: Application) => app.lastContactDate ? new Date(app.lastContactDate).toLocaleDateString() : 'N/A'
    },
  ];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Applications</h2>
          <p className="text-muted-foreground mt-1">Manage software applications and vendor compliance.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-white/20 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <input
          type="text"
          placeholder="Search applications..."
          className="bg-transparent border-none focus:outline-none text-sm w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable
        data={filteredApplications}
        columns={columns}
        onRowClick={handleEdit}
      />

      <RecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isEditing ? "Edit Application" : "Add Application"}
        description={isEditing ? "Update application details." : "Add a new application to the system."}
        onSave={handleSave}
        onDelete={handleDelete}
        isEditing={isEditing}
      >
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              value={currentApplication.url || ''}
              onChange={(e) => setCurrentApplication({...currentApplication, url: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={currentApplication.departmentId?.toString()}
                onValueChange={(val) => setCurrentApplication({...currentApplication, departmentId: parseInt(val)})}
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
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Name</Label>
              <Input
                id="contact"
                value={currentApplication.contactName || ''}
                onChange={(e) => setCurrentApplication({...currentApplication, contactName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor ID</Label>
              <Input
                id="vendor"
                type="number"
                value={currentApplication.vendorId || ''}
                onChange={(e) => setCurrentApplication({...currentApplication, vendorId: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastContact">Last Contact Date</Label>
              <Input
                id="lastContact"
                type="date"
                value={currentApplication.lastContactDate || ''}
                onChange={(e) => setCurrentApplication({...currentApplication, lastContactDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border rounded-lg">
            <Label htmlFor="vpat" className="cursor-pointer">VPAT or ACR Available</Label>
            <Switch
              id="vpat"
              checked={!!currentApplication.vpatOrAcr}
              onCheckedChange={(checked) => setCurrentApplication({...currentApplication, vpatOrAcr: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={currentApplication.notes || ''}
              onChange={(e) => setCurrentApplication({...currentApplication, notes: e.target.value})}
            />
          </div>
        </div>
      </RecordDialog>
    </div>
  );
};

export default Applications;
