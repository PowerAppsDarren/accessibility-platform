import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Website } from '@/types/schema';
import { DataTable } from '@/components/DataTable';
import RecordDialog from '@/components/RecordDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Websites = () => {
  const { websites, departments, people, addWebsite, updateWebsite, deleteWebsite } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<Partial<Website>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredWebsites = websites.filter(site => 
    (site.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (site.owner || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentWebsite({
      url: '',
      owner: '',
      departmentId: departments[0]?.id,
      lastContactDate: new Date().toISOString().split('T')[0],
      archived: false,
      accessibilityReviewed: false,
      manualReview: false,
      siteimproveScore: 0
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (site: Website) => {
    setCurrentWebsite({ ...site });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentWebsite.url || !currentWebsite.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && currentWebsite.id) {
      updateWebsite(currentWebsite.id, currentWebsite);
      toast.success('Website updated successfully');
    } else {
      addWebsite(currentWebsite as Omit<Website, 'id'>);
      toast.success('Website added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentWebsite.id) {
      deleteWebsite(currentWebsite.id);
      toast.success('Website deleted successfully');
      setIsDialogOpen(false);
    }
  };

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
          onClick={(e) => e.stopPropagation()}
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
          <div className="w-16 bg-secondary rounded-full h-2 overflow-hidden">
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
      header: 'Status', 
      cell: (site: Website) => (
        <span className={`px-2 py-1 rounded-full text-xs ${site.archived ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
          {site.archived ? 'Archived' : 'Active'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Websites</h2>
          <p className="text-muted-foreground mt-1">Track web properties and accessibility compliance.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-white/20 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <input 
          type="text"
          placeholder="Search websites..."
          className="bg-transparent border-none focus:outline-none text-sm w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable 
        data={filteredWebsites}
        columns={columns}
        onRowClick={handleEdit}
      />

      <RecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isEditing ? "Edit Website" : "Add Website"}
        description={isEditing ? "Update website details." : "Add a new website to the system."}
        onSave={handleSave}
        onDelete={handleDelete}
        isEditing={isEditing}
      >
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input 
              id="url" 
              value={currentWebsite.url || ''} 
              onChange={(e) => setCurrentWebsite({...currentWebsite, url: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select 
                value={currentWebsite.departmentId?.toString()} 
                onValueChange={(val) => setCurrentWebsite({...currentWebsite, departmentId: parseInt(val)})}
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
              <Label htmlFor="owner">Owner</Label>
              <Input 
                id="owner" 
                value={currentWebsite.owner || ''} 
                onChange={(e) => setCurrentWebsite({...currentWebsite, owner: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Select 
                value={currentWebsite.contactId?.toString()} 
                onValueChange={(val) => setCurrentWebsite({...currentWebsite, contactId: parseInt(val)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
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
                value={currentWebsite.managerId?.toString()} 
                onValueChange={(val) => setCurrentWebsite({...currentWebsite, managerId: parseInt(val)})}
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
              <Label htmlFor="score">Siteimprove Score</Label>
              <Input 
                id="score" 
                type="number"
                min="0"
                max="100"
                value={currentWebsite.siteimproveScore || 0} 
                onChange={(e) => setCurrentWebsite({...currentWebsite, siteimproveScore: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastContact">Last Contact Date</Label>
              <Input 
                id="lastContact" 
                type="date"
                value={currentWebsite.lastContactDate || ''} 
                onChange={(e) => setCurrentWebsite({...currentWebsite, lastContactDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border rounded-lg">
            <Label htmlFor="archived" className="cursor-pointer">Archived</Label>
            <Switch 
              id="archived" 
              checked={currentWebsite.archived}
              onCheckedChange={(checked) => setCurrentWebsite({...currentWebsite, archived: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-2 border rounded-lg">
            <Label htmlFor="accessibilityReviewed" className="cursor-pointer">Accessibility Reviewed</Label>
            <Switch 
              id="accessibilityReviewed" 
              checked={currentWebsite.accessibilityReviewed}
              onCheckedChange={(checked) => setCurrentWebsite({...currentWebsite, accessibilityReviewed: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={currentWebsite.notes || ''} 
              onChange={(e) => setCurrentWebsite({...currentWebsite, notes: e.target.value})}
            />
          </div>
        </div>
      </RecordDialog>
    </div>
  );
};

export default Websites;
