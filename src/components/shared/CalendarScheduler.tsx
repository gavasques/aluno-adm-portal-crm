
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

interface CalendarSchedulerProps {
  availableSlots: { [date: string]: TimeSlot[] };
  onSlotSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
  className?: string;
}

const CalendarScheduler = ({ 
  availableSlots, 
  onSlotSelect, 
  selectedDate: initialDate,
  selectedTime: initialTime,
  className = '' 
}: CalendarSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(initialTime);

  const formatDateKey = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      setSelectedTime(time);
      onSlotSelect(selectedDate, time);
    }
  };

  const getAvailableSlotsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return availableSlots[dateKey] || [];
  };

  const hasAvailableSlots = (date: Date) => {
    const slots = getAvailableSlotsForDate(date);
    return slots.some(slot => slot.available && !slot.booked);
  };

  const currentSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Selecionar Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              available: (date) => hasAvailableSlots(date),
              booked: (date) => {
                const slots = getAvailableSlotsForDate(date);
                return slots.length > 0 && slots.every(slot => slot.booked);
              }
            }}
            modifiersStyles={{
              available: { 
                backgroundColor: '#dcfce7',
                color: '#166534',
                fontWeight: 'bold'
              },
              booked: { 
                backgroundColor: '#fecaca',
                color: '#991b1b',
                textDecoration: 'line-through'
              }
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || !hasAvailableSlots(date);
            }}
          />
          
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span>Indisponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Sem horários</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários Disponíveis
            {selectedDate && (
              <Badge variant="outline">
                {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="text-center py-8 text-gray-500">
              Selecione uma data para ver os horários disponíveis
            </div>
          ) : currentSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum horário disponível para esta data
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {currentSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available || slot.booked}
                  onClick={() => handleTimeSelect(slot.time)}
                  className="justify-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{slot.time}</span>
                    {slot.booked ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : slot.available ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          {selectedDate && selectedTime && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">
                  Horário selecionado: {selectedTime} - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarScheduler;
