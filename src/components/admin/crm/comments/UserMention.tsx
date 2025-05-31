
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { CRMUser } from '@/types/crm.types';

interface UserMentionProps {
  onMention: (user: CRMUser) => void;
  trigger: string;
  position: { top: number; left: number };
  onClose: () => void;
}

const UserMention = ({ onMention, trigger, position, onClose }: UserMentionProps) => {
  const [query, setQuery] = useState(trigger.slice(1)); // Remove o @
  const { searchUsers } = useCRMUsers();
  const [filteredUsers, setFilteredUsers] = useState<CRMUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await searchUsers(query);
        setFilteredUsers(users.slice(0, 5)); // Limitar a 5 resultados
        setSelectedIndex(0);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, [query, searchUsers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredUsers.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredUsers[selectedIndex]) {
          onMention(filteredUsers[selectedIndex]);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredUsers, selectedIndex, onMention, onClose]);

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <Card
      ref={containerRef}
      className="absolute z-50 w-64 max-h-48 overflow-y-auto shadow-lg"
      style={{
        top: position.top,
        left: position.left
      }}
    >
      <CardContent className="p-2">
        <div className="space-y-1">
          {filteredUsers.map((user, index) => (
            <Button
              key={user.id}
              variant={index === selectedIndex ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onMention(user)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserMention;
