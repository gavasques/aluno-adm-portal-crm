
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface EnrollmentFormHeaderProps {
  title: string;
  description: string;
}

export const EnrollmentFormHeader = ({ title, description }: EnrollmentFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};
