'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Loader2, User, X } from 'lucide-react';
import api from '@/lib/axios.config';
import { toast } from 'sonner';
import { Attendance } from '@/entities/Invitee';

interface InviteeSearchResult {
  id: string;
  name: string;
  cuil: string;
  email?: string;
  phone?: string;
  attendance?: Attendance;
  payment?: {
    id: string;
    amount: number;
    payerEmail?: string;
  };
  order?: {
    status: string;
  };
}

interface InviteeSearchInputProps {
  isOpen: boolean;
  eventId?: string;
  onSelectInvitee: (invitee: InviteeSearchResult) => void;
  onCancel: () => void;
}

export default function InviteeSearchInput({
  isOpen,
  eventId,
  onSelectInvitee,
  onCancel,
}: InviteeSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<InviteeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const searchInvitees = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    if (!eventId || eventId.trim() === '') {
      toast.error('Selecciona un evento primero');
      return;
    }

    setIsSearching(true);
    try {
      // Buscar invitados por nombre o CUIL
      const response = await api.get('/invitees', {
        params: {
          ...(eventId ? { eventId } : {}),
          // Nota: 'search' y 'limit' no están implementados en el backend
        },
      });

      const allInvitees = response.data.items || response.data || [];

      // Filtrar localmente por nombre o CUIL
      const filtered = allInvitees.filter((inv: InviteeSearchResult) => {
        const searchLower = query.toLowerCase().trim();
        return (
          inv.name.toLowerCase().includes(searchLower) ||
          inv.cuil.includes(searchLower) ||
          (inv.email && inv.email.toLowerCase().includes(searchLower))
        );
      });

      setSearchResults(filtered);
      setShowResults(true);
    } catch (error: any) {
      console.error('Error searching invitees:', error);
      toast.error('Error al buscar invitados');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [eventId]);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchInvitees(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchInvitees]);

  const handleSelectInvitee = (invitee: InviteeSearchResult) => {
    onSelectInvitee(invitee);
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar Invitado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="sr-only">
              Buscar invitado
            </Label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder="Nombre o CUIL del invitado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-20"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results dropdown */}
      {showResults && searchResults.length > 0 && (
        <Card className="max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {searchResults.map((invitee) => (
                <Button
                  key={invitee.id}
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-3"
                  onClick={() => handleSelectInvitee(invitee)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <User className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{invitee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        CUIL: {invitee.cuil}
                      </div>
                      {invitee.email && (
                        <div className="text-xs text-muted-foreground">
                          {invitee.email}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {showResults && searchResults.length === 0 && !isSearching && searchTerm.trim().length >= 2 && (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            No se encontraron invitados que coincidan con la búsqueda
          </CardContent>
        </Card>
      )}

      {/* Help text */}
      {!showResults && !searchTerm && (
        <p className="text-sm text-muted-foreground">
          Escribe al menos 2 caracteres para buscar
        </p>
      )}

          {/* Cancel button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
