
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DateFieldsProps {
  enrollmentDate: string;
  startDate: string;
  endDate: string;
  onEnrollmentDateChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateFields = ({
  enrollmentDate,
  startDate,
  endDate,
  onEnrollmentDateChange,
  onStartDateChange,
  onEndDateChange
}: DateFieldsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="enrollmentDate">Data de Inscrição</Label>
        <Input
          id="enrollmentDate"
          type="date"
          value={enrollmentDate}
          onChange={(e) => onEnrollmentDateChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="startDate">Data de Início *</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="endDate">Data de Término</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};
