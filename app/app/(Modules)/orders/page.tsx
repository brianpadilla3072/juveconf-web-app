"use client"

import { Table, Title, Card, Text, Container, Box, Button, Modal, Group, Badge, Stack, ActionIcon, TextInput, LoadingOverlay } from "@mantine/core"
import { Eye, Search, RotateCw } from "lucide-react"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import React, { useMemo, useState } from "react"
import { useOrdersInReview } from "@/hooks/Orders/useOrdersInReview"

// Remove the old Order type since we're importing it from the hook
type Order = {
  id: string;
  email: string;
  cuil: string;
  total: number;
  status: string;
  paymentType: string;
  event: {
    topic: string;
  };
  combos: Array<{
    name: string;
    price: number;
  }>;
  invitees: Array<{
    name: string;
    cuil: string;
  }>;
  createdAt: string;
};

export default function OrdersModule() {
  // State
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [openedApprove, { open: openApprove, close: closeApprove }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  
  // Use the orders hook
  const { orders, loading, error, refetch } = useOrdersInReview();
  
  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    
    const query = searchQuery.toLowerCase().trim();
    return orders.filter(order => 
      order.email.toLowerCase().includes(query) ||
      order.cuil.toLowerCase().includes(query) ||
      order.event.topic.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Show loading state
  if (loading) {
    return (
      <Container size="xl" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOverlay visible={true} overlayBlur={2} />
        <Text>Cargando órdenes...</Text>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container size="xl" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Text c="red">Error al cargar las órdenes: {error}</Text>
        <Button onClick={handleRefresh} leftSection={<RotateCw size={16} />}>
          Reintentar
        </Button>
      </Container>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Gestión de Órdenes</Title>
      
      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder p="md">
          <Group justify="space-between">
            <div>
              <Title order={2} size="h4">Órdenes en Revisión</Title>
              <Text c="dimmed" size="sm">Revisa y gestiona las órdenes pendientes</Text>
            </div>
            <Group>
              <TextInput
                placeholder="Buscar por email o CUIL..."
                leftSection={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
              <Button 
                leftSection={<RotateCw size={16} />} 
                variant="light"
                onClick={handleRefresh}
              >
                Actualizar
              </Button>
            </Group>
          </Group>
        </Card.Section>

        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>CUIL</Table.Th>
                <Table.Th>Evento</Table.Th>
                <Table.Th>Combo</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredOrders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>{order.id.slice(0, 8)}...</Table.Td>
                  <Table.Td>{order.email}</Table.Td>
                  <Table.Td>{order.cuil}</Table.Td>
                  <Table.Td>{order.event.topic}</Table.Td>
                  <Table.Td>
                    {order.combos.map(combo => combo.name).join(', ')}
                  </Table.Td>
                  <Table.Td>${order.total}</Table.Td>
                  <Table.Td>{formatDate(order.createdAt)}</Table.Td>
                  <Table.Td>
                    <Badge color={
                      order.status === 'REVIEW' ? 'yellow' : 
                      order.status === 'APPROVED' ? 'green' : 'red'
                    }>
                      {order.status === 'REVIEW' ? 'En Revisión' : 
                       order.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon 
                        variant="light" 
                        color="blue"
                        onClick={() => {
                          setSelectedOrder(order);
                          open();
                        }}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {filteredOrders.length === 0 && (
          <Box p="lg" ta="center">
            <Text c="dimmed">No se encontraron órdenes</Text>
          </Box>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Detalles de la Orden"
        size="lg"
      >
        {selectedOrder && (
          <Stack>
            <div>
              <Text fw={500}>ID:</Text>
              <Text>{selectedOrder.id}</Text>
            </div>
            <div>
              <Text fw={500}>Email:</Text>
              <Text>{selectedOrder.email}</Text>
            </div>
            <div>
              <Text fw={500}>CUIL:</Text>
              <Text>{selectedOrder.cuil}</Text>
            </div>
            <div>
              <Text fw={500}>Evento:</Text>
              <Text>{selectedOrder.event.topic}</Text>
            </div>
            <div>
              <Text fw={500}>Combos:</Text>
              {selectedOrder.combos.map((combo, index) => (
                <Text key={index}>
                  {combo.name} - ${combo.price}
                </Text>
              ))}
            </div>
            <div>
              <Text fw={500}>Invitados:</Text>
              {selectedOrder.invitees.length > 0 ? (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nombre</Table.Th>
                      <Table.Th>CUIL</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedOrder.invitees.map((invitee, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{invitee.name}</Table.Td>
                        <Table.Td>{invitee.cuil}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text>No hay invitados</Text>
              )}
            </div>
            <div>
              <Text fw={500}>Total:</Text>
              <Text>${selectedOrder.total}</Text>
            </div>
            <div>
              <Text fw={500}>Fecha:</Text>
              <Text>{formatDate(selectedOrder.createdAt)}</Text>
            </div>
            <Group justify="flex-end" mt="md">
              <Button 
                variant="light" 
                color="red"
                onClick={() => {
                  close();
                  openDelete();
                }}
              >
                Rechazar
              </Button>
              <Button 
                color="green"
                onClick={() => {
                  close();
                  openApprove();
                }}
              >
                Aprobar
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal 
        opened={openedApprove} 
        onClose={closeApprove} 
        title="Confirmar Aprobación"
      >
        <Text>¿Estás seguro de que deseas aprobar esta orden?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeApprove}>
            Cancelar
          </Button>
          <Button 
            color="green"
            onClick={() => {
              // TODO: Implement approve logic
              notifications.show({
                title: 'Orden aprobada',
                message: 'La orden ha sido aprobada correctamente',
                color: 'green'
              });
              closeApprove();
              refetch();
            }}
          >
            Confirmar
          </Button>
        </Group>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal 
        opened={openedDelete} 
        onClose={closeDelete} 
        title="Confirmar Rechazo"
      >
        <Text>¿Estás seguro de que deseas rechazar esta orden?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDelete}>
            Cancelar
          </Button>
          <Button 
            color="red"
            onClick={() => {
              // TODO: Implement reject logic
              notifications.show({
                title: 'Orden rechazada',
                message: 'La orden ha sido rechazada',
                color: 'red'
              });
              closeDelete();
              refetch();
            }}
          >
            Confirmar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
