import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id: number | string }>({ 
  data, 
  columns, 
  onRowClick,
  className 
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-white/20 overflow-hidden glass-panel", className)}>
      <Table>
        <TableHeader className="bg-secondary/30 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent border-b border-white/10">
            {columns.map((col, index) => (
              <TableHead 
                key={index} 
                className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4", col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow 
                key={item.id}
                className={cn(
                  "border-b border-white/5 transition-colors hover:bg-primary/5",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col, index) => (
                  <TableCell key={index} className={cn("py-3 font-medium text-sm", col.className)}>
                    {col.cell 
                      ? col.cell(item) 
                      : col.accessorKey 
                        ? String(item[col.accessorKey]) 
                        : null
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
