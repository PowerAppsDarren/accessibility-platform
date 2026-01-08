import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface RecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => void;
  onDelete?: () => void;
  isEditing: boolean;
}

const RecordDialog: React.FC<RecordDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSave,
  onDelete,
  isEditing,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-panel border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4 max-h-[60vh] overflow-y-auto px-1">
          {children}
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          {isEditing && onDelete ? (
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          ) : (
            <div /> // Spacer
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordDialog;
