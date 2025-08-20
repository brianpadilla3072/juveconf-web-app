'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Send, 
  Users, 
  Eye, 
  Code, 
  FileText, 
  RotateCcw,
  CheckCircle,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import api from '@/lib/axios.config';

interface EmailRecipient {
  email: string;
  name: string;
  id: string;
  paymentInfo?: any;
}

interface EmailCampaign {
  subject: string;
  htmlContent: string;
  recipients: string[];
}

export default function EmailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inviteesEmails, setInviteesEmails] = useState<EmailRecipient[]>([]);
  const [paymentsEmails, setPaymentsEmails] = useState<EmailRecipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Form state
  const [emailForm, setEmailForm] = useState<EmailCampaign>({
    subject: '',
    htmlContent: '',
    recipients: []
  });

  // Tab state
  const [activeTab, setActiveTab] = useState('invitees');

  // Load invitees emails
  const loadInviteesEmails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/invitees/emails/list');
      
      setInviteesEmails(response.data.emails || []);
      toast.success(`${response.data.emails?.length || 0} emails de invitados cargados`);
    } catch (error) {
      toast.error('Error al cargar emails de invitados');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load payments emails
  const loadPaymentsEmails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/payments/emails/list');
      
      setPaymentsEmails(response.data.emails || []);
      toast.success(`${response.data.emails?.length || 0} emails de pagos cargados`);
    } catch (error) {
      toast.error('Error al cargar emails de pagos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle recipient selection
  const toggleRecipient = (email: string) => {
    setSelectedRecipients(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  // Select all recipients
  const selectAllRecipients = (type: 'invitees' | 'payments') => {
    const emails = type === 'invitees' 
      ? inviteesEmails.map(r => r.email)
      : paymentsEmails.map(r => r.email);
    
    setSelectedRecipients(prev => [...new Set([...prev, ...emails])]);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedRecipients([]);
  };

  // Send bulk email
  const sendBulkEmail = async () => {
    if (!emailForm.subject.trim()) {
      toast.error('El asunto es requerido');
      return;
    }
    
    if (!emailForm.htmlContent.trim()) {
      toast.error('El contenido HTML es requerido');
      return;
    }
    
    if (selectedRecipients.length === 0) {
      toast.error('Selecciona al menos un destinatario');
      return;
    }

    try {
      setIsSending(true);
      
      const response = await api.post('/mail/send-bulk', {
        subject: emailForm.subject,
        htmlContent: emailForm.htmlContent,
        recipients: selectedRecipients
      });
      
      toast.success(`Emails enviados exitosamente a ${response.data.totalSent} destinatarios`);
      
      // Reset form
      setEmailForm({
        subject: '',
        htmlContent: '',
        recipients: []
      });
      setSelectedRecipients([]);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error al enviar emails');
      console.error('Error sending emails:', error);
    } finally {
      setIsSending(false);
    }
  };

  const currentRecipients = activeTab === 'invitees' ? inviteesEmails : paymentsEmails;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Emails Masivos</h1>
          <p className="text-muted-foreground">Envía emails personalizados a invitados y clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadInviteesEmails} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Cargar Invitados
          </Button>
          <Button variant="outline" onClick={loadPaymentsEmails} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Cargar Pagos
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails de Invitados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inviteesEmails.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails de Pagos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paymentsEmails.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seleccionados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{selectedRecipients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disponible</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {inviteesEmails.length + paymentsEmails.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Componer Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              placeholder="Asunto del email..."
              value={emailForm.subject}
              onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="htmlContent">Contenido HTML</Label>
            <Textarea
              id="htmlContent"
              placeholder="Ingresa el contenido HTML del email..."
              value={emailForm.htmlContent}
              onChange={(e) => setEmailForm(prev => ({ ...prev, htmlContent: e.target.value }))}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!emailForm.htmlContent.trim()}>
                  <Eye className="mr-2 h-4 w-4" />
                  Vista Previa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Vista Previa del Email</DialogTitle>
                </DialogHeader>
                <div className="border rounded-lg p-4">
                  <div className="mb-4 p-2 bg-gray-50 rounded">
                    <strong>Asunto:</strong> {emailForm.subject || 'Sin asunto'}
                  </div>
                  <div 
                    dangerouslySetInnerHTML={{ __html: emailForm.htmlContent }}
                    className="prose max-w-none"
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={sendBulkEmail} 
              disabled={isSending || selectedRecipients.length === 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSending ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar a {selectedRecipients.length} destinatarios
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recipients Selection */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seleccionar Destinatarios
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectAllRecipients(activeTab as 'invitees' | 'payments')}
              >
                Seleccionar Todos
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearSelection}
              >
                Limpiar Selección
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="invitees">
                Invitados ({inviteesEmails.length})
              </TabsTrigger>
              <TabsTrigger value="payments">
                Pagos ({paymentsEmails.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="invitees" className="mt-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inviteesEmails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No hay emails de invitados cargados
                        </TableCell>
                      </TableRow>
                    ) : (
                      inviteesEmails.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRecipients.includes(recipient.email)}
                              onCheckedChange={() => toggleRecipient(recipient.email)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{recipient.name}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell>
                            {recipient.paymentInfo && (
                              <Badge variant="outline">
                                ${recipient.paymentInfo.amount} - {recipient.paymentInfo.type}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentsEmails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No hay emails de pagos cargados
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentsEmails.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRecipients.includes(recipient.email)}
                              onCheckedChange={() => toggleRecipient(recipient.email)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{recipient.name}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell>
                            {recipient.paymentInfo && (
                              <Badge variant="outline">
                                ${recipient.paymentInfo.amount} - {recipient.paymentInfo.type}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}