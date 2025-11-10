"use client"

import { Table, Title, Card, Text, Container, Box, Button, Modal, Group, Badge, Stack, ActionIcon, TextInput, LoadingOverlay, SimpleGrid, useMantineTheme, rem, Divider, Select, NumberInput, Tabs } from "@mantine/core"
import { Eye, Search, RotateCw, ChevronRight, Plus, Trash, Check, X } from "lucide-react"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useOrdersInReview } from "@/hooks/Orders/useOrdersInReview"
import { useOrdersPaid } from "@/hooks/Orders/useOrdersPaid"
import useApproveOrder from "@/hooks/Orders/useApproveOrder"
import useRejectOrder from "@/hooks/Orders/useRejectOrder"
import useCreateOrder, { AttendeeDto } from "@/hooks/Orders/useCreateOrder"
import { useQueryEvents } from "@/hooks/Events/useQueryEvents"
import { useQueryCombos } from "@/hooks/combos/useQueryCombos"
import { useQueryPreSales } from "@/hooks/presales/useQueryPreSales"
import { useRouter } from "next/navigation"
import React, { useMemo, useState, useEffect } from "react"
import { Order } from "@/entities/Order";
import { useDrawer } from '@/hooks/useDrawer'
import { OrderDetailsContent } from '@/components/GlobalDrawer/templates/OrderDetailsContent'

// Format date helper function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrdersModule() {
  // State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('review');
  const [openedApprove, { open: openApprove, close: closeApprove }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  // Drawer
  const { openDrawer, closeDrawer } = useDrawer();

  // Create order form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cuil: '',
    eventId: '',
    comboId: '',
    quantity: 1
  });
  const [attendees, setAttendees] = useState<AttendeeDto[]>([{ name: '', cuil: '' }]);

  // Approve order hook
  const {
    approveOrder,
    isLoading: isApproving,
    error: approveError,
    isSuccess: approveSuccess,
    reset: resetApproveState
  } = useApproveOrder();

  // Reject order hook
  const {
    rejectOrder,
    isLoading: isRejecting,
    error: rejectError,
    isSuccess: rejectSuccess,
    reset: resetRejectState
  } = useRejectOrder();

  // Create order hook
  const { createOrder, isLoading: isCreating } = useCreateOrder();

  // Use the orders hooks
  const { orders: reviewOrders, loading: reviewLoading, error: reviewError, refetch: refetchReview } = useOrdersInReview();
  const { orders: paidOrders, loading: paidLoading, error: paidError, refetch: refetchPaid } = useOrdersPaid();

  // Query hooks for form
  const { events } = useQueryEvents();
  const { combos } = useQueryCombos();
  const { preSales } = useQueryPreSales();

  // Mantine theme hook
  const theme = useMantineTheme();

  // Get current orders and loading/error states based on active tab
  const orders = useMemo(() => {
    return activeTab === 'review' ? reviewOrders : paidOrders;
  }, [activeTab, reviewOrders, paidOrders]);

  const loading = useMemo(() => {
    return activeTab === 'review' ? reviewLoading : paidLoading;
  }, [activeTab, reviewLoading, paidLoading]);

  const error = useMemo(() => {
    return activeTab === 'review' ? reviewError : paidError;
  }, [activeTab, reviewError, paidError]);

  const refetch = () => {
    if (activeTab === 'review') {
      refetchReview();
    } else {
      refetchPaid();
    }
  };

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;

    const query = searchQuery.toLowerCase().trim();
    return orders.filter(order => {
      // Check multiple fields for matches
      const searchFields = [
        order.id,
        order.email,
        order.phone || '',
        order.cuil,
        order.event?.topic || '',
        order.combo?.name || '',
        order.total.toString(),
        formatDate(order.createdAt),
        order.status === 'REVIEW' ? 'en revision' :
        order.status === 'PAID' ? 'pagado' :
        order.status === 'CANCELLED' ? 'cancelado' : 'pendiente'
      ];

      // Check if any field includes the search query
      return searchFields.some(field => 
        field.toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);


  // Filter combos by event (admin can see all active combos, not just published)
  const availableCombos = useMemo(() => {
    if (!formData.eventId) return [];
    return combos?.filter(c =>
      c.eventId === formData.eventId &&
      c.isActive &&
      !c.deletedAt
    ) || [];
  }, [combos, formData.eventId]);

  // Get selected combo
  const selectedCombo = useMemo(() => {
    return combos?.find(c => c.id === formData.comboId);
  }, [combos, formData.comboId]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedCombo) return 0;
    return selectedCombo.price * formData.quantity;
  }, [selectedCombo, formData.quantity]);

  // Handle add attendee
  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: '', cuil: '' }]);
  };

  // Handle remove attendee
  const handleRemoveAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  // Handle attendee change
  const handleAttendeeChange = (index: number, field: keyof AttendeeDto, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  // Handle create order
  const handleCreateOrder = async () => {
    if (!selectedCombo) {
      notifications.show({
        title: 'Error',
        message: 'Debes seleccionar un combo',
        color: 'red',
      });
      return;
    }

    // Validate attendees
    const minPersons = selectedCombo.personsIncluded || 1;
    if (attendees.length < minPersons) {
      notifications.show({
        title: 'Error',
        message: `Debes agregar al menos ${minPersons} asistente(s)`,
        color: 'red',
      });
      return;
    }

    // Validate all attendees have name and CUIL
    const invalidAttendees = attendees.some(a => !a.name.trim() || !a.cuil.trim());
    if (invalidAttendees) {
      notifications.show({
        title: 'Error',
        message: 'Todos los asistentes deben tener nombre y CUIL',
        color: 'red',
      });
      return;
    }

    const dto = {
      id: formData.comboId,
      email: formData.email,
      phone: formData.phone,
      cuil: formData.cuil,
      title: selectedCombo.name,
      unit_price: selectedCombo.price,
      quantity: formData.quantity,
      minPersons: selectedCombo.personsIncluded || 1,
      maxPersons: selectedCombo.maxPersons,
      attendees: attendees,
      eventId: formData.eventId
    };

    const result = await createOrder(dto);
    if (result) {
      notifications.show({
        title: '¡Éxito!',
        message: 'Orden creada exitosamente',
        color: 'green',
      });
      closeCreate();
      // Reset form
      setFormData({
        email: '',
        phone: '',
        cuil: '',
        eventId: '',
        comboId: '',
        quantity: 1
      });
      setAttendees([{ name: '', cuil: '' }]);
      refetch();
    }
  };

  const handleOpenDetails = (order: Order) => {
    openDrawer(order, (data) => (
      <OrderDetailsContent
        order={data}
        onApprove={async () => {
          const { success, error } = await approveOrder(data.id);
          if (success) {
            notifications.show({
              title: '¡Éxito!',
              message: 'La orden ha sido aprobada correctamente',
              color: 'green',
            });
            closeDrawer();
            refetch();
          } else {
            notifications.show({
              title: 'Error',
              message: error || 'Ocurrió un error al aprobar la orden',
              color: 'red',
            });
          }
        }}
        onReject={async () => {
          const { success, error } = await rejectOrder(data.id);
          if (success) {
            notifications.show({
              title: '¡Orden eliminada!',
              message: 'La orden ha sido rechazada y eliminada correctamente',
              color: 'red',
            });
            closeDrawer();
            refetch();
          } else {
            notifications.show({
              title: 'Error',
              message: error || 'Ocurrió un error al rechazar la orden',
              color: 'red',
            });
          }
        }}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    ));
  };

  // Show loading state
  if (loading) {
    return (
      <Container size="xl" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOverlay visible={true} />
        <Text>Cargando órdenes...</Text>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container size="xl" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Text c="red">Error al cargar las órdenes: {error}</Text>
        <Button onClick={refetch} leftSection={<RotateCw size={16} />}>
          Reintentar
        </Button>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Gestión de Órdenes</Title>

      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder p="md">
          <Group justify="space-between" mb="md">
            <div>
              <Title order={2} size="h4">Órdenes</Title>
              <Text c="dimmed" size="sm">Revisa y gestiona las órdenes</Text>
            </div>
            <Group>
              <TextInput
                placeholder="Buscar por ID, email, CUIL, evento, etc..."
                leftSection={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                style={{ minWidth: '250px' }}
                rightSection={
                  searchQuery ? (
                    <ActionIcon
                      variant="transparent"
                      onClick={() => setSearchQuery('')}
                      size="sm"
                      color="gray"
                    >
                      ✕
                    </ActionIcon>
                  ) : null
                }
              />
              <Button
                leftSection={<Plus size={16} />}
                onClick={openCreate}
              >
                Nueva Orden
              </Button>
              <Button
                leftSection={<RotateCw size={16} />}
                variant="light"
                onClick={refetch}
              >
                Actualizar
              </Button>
            </Group>
          </Group>

          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'review')}>
            <Tabs.List>
              <Tabs.Tab value="review">
                En Revisión ({reviewOrders.length})
              </Tabs.Tab>
              <Tabs.Tab value="paid">
                Pagadas ({paidOrders.length})
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Card.Section>

        {/* Desktop Table View */}
        <Box visibleFrom="md">
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Acciones</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Teléfono</Table.Th>
                  <Table.Th>CUIL</Table.Th>
                  <Table.Th>Evento</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Estado</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredOrders.map((order) => (
                  <Table.Tr key={order.id}>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleOpenDetails(order)}
                        >
                          <Eye size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                    <Table.Td>{order.email}</Table.Td>
                    <Table.Td>{order.phone || 'N/A'}</Table.Td>
                    <Table.Td>{order.cuil}</Table.Td>
                    <Table.Td>{order.event?.topic || 'Sin evento'}</Table.Td>
                    <Table.Td>${order.total}</Table.Td>
                    <Table.Td>{formatDate(order.createdAt)}</Table.Td>
                    <Table.Td>
                      <Badge color={
                        order.status === 'REVIEW' ? 'yellow' :
                        order.status === 'PAID' ? 'green' :
                        order.status === 'CANCELLED' ? 'red' : 'gray'
                      }>
                        {order.status === 'REVIEW' ? 'En Revisión' :
                         order.status === 'PAID' ? 'Pagado' :
                         order.status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>

        {/* Mobile Card View */}
        <Box hiddenFrom="md" p="md">
          <SimpleGrid cols={{ base: 1 }} spacing="md">
            {filteredOrders.map((order) => (
              <Card key={order.id} withBorder shadow="sm" radius="md">
                <Stack gap="xs">
                  <Group justify="space-between" wrap="nowrap">
                    <Text fw={500} size="sm" lineClamp={1}>ID: {order.id.slice(0, 8)}...</Text>
                    <Badge
                      size="sm"
                      color={
                        order.status === 'REVIEW' ? 'yellow' :
                        order.status === 'PAID' ? 'green' :
                        order.status === 'CANCELLED' ? 'red' : 'gray'
                      }
                    >
                      {order.status === 'REVIEW' ? 'En Revisión' :
                       order.status === 'PAID' ? 'Pagado' :
                       order.status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
                    </Badge>
                  </Group>
                  
                  <Divider my="xs" />
                  
                  <Group gap="xs" align="flex-start">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" c="dimmed">Email</Text>
                      <Text size="sm" lineClamp={1} style={{ wordBreak: 'break-word' }}>{order.email}</Text>
                    </Box>
                  </Group>
                  
                  <Group gap="xs" align="flex-start">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" c="dimmed">Teléfono</Text>
                      <Text size="sm">{order.phone || 'N/A'}</Text>
                    </Box>
                  </Group>
                  
                  <Group gap="xs" align="flex-start">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" c="dimmed">CUIL</Text>
                      <Text size="sm">{order.cuil}</Text>
                    </Box>
                  </Group>
                  
                  <Group gap="xs" align="flex-start">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" c="dimmed">Evento</Text>
                      <Text size="sm" lineClamp={1}>{order.event?.topic || 'Sin evento'}</Text>
                    </Box>
                  </Group>
                  
                  <Group gap="xs" align="flex-start">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" c="dimmed">Combo</Text>
                      <Text size="sm" lineClamp={2}>
                        {order.combo?.name || 'Sin combo'}
                      </Text>
                    </Box>
                  </Group>
                  
                  <Group justify="space-between" mt="sm">
                    <div>
                      <Text size="xs" c="dimmed">Total</Text>
                      <Text fw={600} size="md">${order.total}</Text>
                    </div>
                    <Group gap="xs">
                      {order.status === 'REVIEW' && (
                        <>
                          <ActionIcon
                            color="red"
                            variant="light"
                            size="lg"
                            onClick={() => {
                              setSelectedOrder(order);
                              openDelete();
                            }}
                            disabled={isRejecting || isApproving}
                          >
                            <X size={18} />
                          </ActionIcon>
                          <ActionIcon
                            color="green"
                            variant="light"
                            size="lg"
                            onClick={() => {
                              setSelectedOrder(order);
                              openApprove();
                            }}
                            disabled={isApproving || isRejecting}
                          >
                            <Check size={18} />
                          </ActionIcon>
                        </>
                      )}
                      <Button
                        variant="light"
                        size="sm"
                        rightSection={<ChevronRight size={14} />}
                        onClick={() => handleOpenDetails(order)}
                        style={{ minWidth: '120px' }}
                      >
                        Ver detalles
                      </Button>
                    </Group>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {filteredOrders.length === 0 && (
          <Box p="lg" ta="center">
            <Text c="dimmed">No se encontraron órdenes</Text>
          </Box>
        )}
      </Card>

      {/* Approve Confirmation Modal */}
      <Modal 
        opened={openedApprove} 
        onClose={() => {
          closeApprove();
          resetApproveState();
        }}
        title="Confirmar Aprobación"
      >
        <Stack gap="md">
          <Text>¿Estás seguro de que deseas aprobar esta orden?</Text>
          
          {approveError && (
            <Text c="red" size="sm">
              {approveError}
            </Text>
          )}
        </Stack>
        
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeApprove}>
            Cancelar
          </Button>
          <Button 
            color="green"
            loading={isApproving}
            onClick={async () => {
              if (!selectedOrder) return;
              
              const { success, error } = await approveOrder(selectedOrder.id);
              
              if (success) {
                notifications.show({
                  title: '¡Éxito!',
                  message: 'La orden ha sido aprobada correctamente',
                  color: 'green',
                });
                closeApprove();
                refetch();
              } else {
                notifications.show({
                  title: 'Error',
                  message: error || 'Ocurrió un error al aprobar la orden',
                  color: 'red',
                });
              }
            }}
          >
            Confirmar
          </Button>
        </Group>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        opened={openedDelete}
        onClose={() => {
          closeDelete();
          resetRejectState();
        }}
        title="Confirmar Rechazo"
      >
        <Stack gap="md">
          <Text>¿Estás seguro de que deseas rechazar esta orden? Esta acción eliminará permanentemente la orden.</Text>

          {rejectError && (
            <Text c="red" size="sm">
              {rejectError}
            </Text>
          )}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDelete}>
            Cancelar
          </Button>
          <Button
            color="red"
            loading={isRejecting}
            onClick={async () => {
              if (!selectedOrder) return;

              const { success, error } = await rejectOrder(selectedOrder.id);

              if (success) {
                notifications.show({
                  title: '¡Orden eliminada!',
                  message: 'La orden ha sido rechazada y eliminada correctamente',
                  color: 'red',
                });
                closeDelete();
                refetch();
              } else {
                notifications.show({
                  title: 'Error',
                  message: error || 'Ocurrió un error al rechazar la orden',
                  color: 'red',
                });
              }
            }}
          >
            Confirmar
          </Button>
        </Group>
      </Modal>

      {/* Create Order Modal */}
      <Modal
        opened={openedCreate}
        onClose={closeCreate}
        title="Crear Nueva Orden"
        size="xl"
      >
        <Stack gap="md">
          {/* Buyer Information */}
          <div>
            <Text fw={500} mb="sm">Información del Comprador</Text>
            <Stack gap="sm">
              <TextInput
                label="Email"
                placeholder="comprador@ejemplo.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextInput
                label="Teléfono"
                placeholder="+54 9 11 1234-5678"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextInput
                label="CUIL"
                placeholder="20123456789"
                required
                value={formData.cuil}
                onChange={(e) => setFormData({ ...formData, cuil: e.target.value })}
              />
            </Stack>
          </div>

          <Divider />

          {/* Event and Combo Selection */}
          <div>
            <Text fw={500} mb="sm">Selección de Evento y Combo</Text>
            <Stack gap="sm">
              <Select
                label="Evento"
                placeholder="Seleccionar evento"
                required
                value={formData.eventId}
                onChange={(value) => {
                  setFormData({ ...formData, eventId: value || '', comboId: '' });
                }}
                data={events?.map(e => ({
                  value: e.id,
                  label: `${e.topic} (${e.year})`
                })) || []}
              />
              <Select
                label="Combo"
                placeholder="Seleccionar combo"
                required
                disabled={!formData.eventId}
                value={formData.comboId}
                onChange={(value) => setFormData({ ...formData, comboId: value || '' })}
                data={availableCombos.map(c => ({
                  value: c.id,
                  label: `${c.name} - $${c.price} (${c.personsIncluded} ${c.personsIncluded === 1 ? 'persona' : 'personas'})`
                }))}
              />
              <NumberInput
                label="Cantidad"
                min={1}
                value={formData.quantity}
                onChange={(value) => setFormData({ ...formData, quantity: Number(value) || 1 })}
              />
            </Stack>
          </div>

          {selectedCombo && (
            <>
              <Divider />

              {/* Price Summary */}
              <Card withBorder p="sm" style={{ backgroundColor: '#f0f9ff' }}>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">Precio Unitario</Text>
                    <Text fw={600}>${selectedCombo.price}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Cantidad</Text>
                    <Text fw={600}>x {formData.quantity}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Total</Text>
                    <Text fw={700} size="xl" c="blue">${totalPrice}</Text>
                  </div>
                </Group>
              </Card>

              <Divider />

              {/* Attendees */}
              <div>
                <Group justify="space-between" mb="sm">
                  <div>
                    <Text fw={500}>Asistentes</Text>
                    <Text size="xs" c="dimmed">
                      Mínimo requerido: {selectedCombo.personsIncluded || 1} persona(s)
                    </Text>
                  </div>
                  <Button
                    size="xs"
                    leftSection={<Plus size={14} />}
                    onClick={handleAddAttendee}
                  >
                    Agregar
                  </Button>
                </Group>

                <Stack gap="sm">
                  {attendees.map((attendee, index) => (
                    <Card key={index} withBorder p="sm">
                      <Group align="flex-start">
                        <Stack style={{ flex: 1 }} gap="xs">
                          <TextInput
                            placeholder="Nombre completo"
                            value={attendee.name}
                            onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                            required
                          />
                          <TextInput
                            placeholder="CUIL"
                            value={attendee.cuil}
                            onChange={(e) => handleAttendeeChange(index, 'cuil', e.target.value)}
                            required
                          />
                        </Stack>
                        {attendees.length > 1 && (
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => handleRemoveAttendee(index)}
                          >
                            <Trash size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </div>
            </>
          )}
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeCreate}>
            Cancelar
          </Button>
          <Button
            loading={isCreating}
            onClick={handleCreateOrder}
            disabled={!formData.email || !formData.phone || !formData.cuil || !formData.eventId || !formData.comboId}
          >
            Crear Orden
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
