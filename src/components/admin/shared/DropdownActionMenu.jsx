// File: /src/components/admin/shared/DropdownActionMenu.jsx

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  CheckCircle,
  Ban,
  Pause,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DropdownActionMenu = ({
  job,
  onView,
  onApprove,
  onReject,
  onPause,
  onResume,
  onEdit,
  onDelete,
}) => {
  const status = job.status || 'pending'; // fallback for undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" /> View Job
        </DropdownMenuItem>

        {status === 'pending' && (
          <>
            <DropdownMenuItem onClick={onApprove} className="cursor-pointer">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReject} className="cursor-pointer">
              <Ban className="mr-2 h-4 w-4 text-yellow-500" /> Reject
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4 text-blue-500" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-500">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}

        {status === 'approved' && (
          <>
            <DropdownMenuItem onClick={onPause} className="cursor-pointer">
              <Pause className="mr-2 h-4 w-4 text-yellow-500" /> Pause
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4 text-blue-500" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-500">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}

        {status === 'paused' && (
          <>
            <DropdownMenuItem onClick={onResume} className="cursor-pointer">
              <Play className="mr-2 h-4 w-4 text-green-500" /> Resume
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4 text-blue-500" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-500">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}

        {status === 'rejected' && (
          <>
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4 text-blue-500" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-500">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActionMenu;
