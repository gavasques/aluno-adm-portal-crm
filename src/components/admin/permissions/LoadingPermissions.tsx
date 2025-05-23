
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingPermissions = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end space-x-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default LoadingPermissions;
