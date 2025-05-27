
import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  backHref?: string;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  showBackButton = false,
  backHref,
  className
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  const handleItemClick = (href: string) => {
    navigate(href);
  };

  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-gray-600", className)}>
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-8 px-2 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index === 0 && (
              <Home className="h-4 w-4 text-gray-400" />
            )}
            
            {item.href ? (
              <button
                onClick={() => handleItemClick(item.href!)}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            )}
            
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
