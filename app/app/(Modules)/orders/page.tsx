"use client"

import { Table, Title, Card, Text, Container, rem, Box, Button, Modal, Group, Divider, Badge, Stack, ActionIcon, TextInput } from "@mantine/core"
import { User, Mail, CreditCard, ShoppingCart, Eye, Users, Tag, Search } from "lucide-react"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import React, { useMemo, useState } from "react"

type Guest = {
  id: number
  nombre: string
  dni: string
}

type Order = {
  id: number
  nombre: string
  apellido: string
  email: string
  cuil: string
  combo: string
  precio: number
  invitados: Guest[]
  fecha: string
  estado?: string
}

export default function OrdersModule() {
  // State
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [openedApprove, { open: openApprove, close: closeApprove }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  
  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    
    const query = searchQuery.toLowerCase().trim();
    return orders.filter(order => 
      order.nombre.toLowerCase().includes(query) ||
      order.apellido.toLowerCase().includes(query) ||
      order.cuil.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  // Load initial data
  React.useEffect(() => {
    const initialOrders: Order[] = [
      {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan@example.com",
        cuil: "20-12345678-9",
        combo: "Combo Familiar",
        precio: 25000,
        fecha: "2025-06-24",
        invitados: [
          { id: 1, nombre: "Ana Pérez", dni: "40123456" },
          { id: 2, nombre: "Carlos Pérez", dni: "35123456" }
        ]
      },
      {
        id: 2,
        nombre: "María",
        apellido: "González",
        email: "maria@example.com",
        cuil: "27-98765432-1",
        combo: "Combo Individual",
        precio: 10000,
        fecha: "2025-06-23",
        invitados: [
          { id: 3, nombre: "María González", dni: "28987654" }
        ]
      },
    ];
    setOrders(initialOrders);
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    open();
  };

  const handleApprove = () => {
    if (!selectedOrder) return;
    
    notifications.show({
      title: '¡Aprobado!',
      message: 'La orden ha sido aprobada exitosamente',
      color: 'green',
    });
    
    // Update the order status in the state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, estado: 'aprobado' } 
          : order
      )
    );
    
    closeApprove();
    close();
  };

  const handleDelete = () => {
    if (!selectedOrder) return;
    
    notifications.show({
      title: 'Eliminado',
      message: 'La orden ha sido eliminada exitosamente',
      color: 'red',
    });
    
    // Remove the order from the state
    setOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrder.id));
    
    closeDelete();
    close();
  };

  // Responsive styles
  const responsiveStyles = {
    container: {
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      '@media (min-width: 768px)': {
      },
    },
    tableHeader: {
      fontSize: rem(12),
      fontWeight: 600,
      whiteSpace: 'nowrap',
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
    tableCell: {
      padding: '0.75rem 0.5rem',
      '@media (max-width: 768px)': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem',
        borderBottom: '1px solid #f0f0f0',
        '&::before': {
          content: 'attr(data-label)',
          fontWeight: 600,
          marginRight: '1rem',
          '@media (min-width: 769px)': {
            display: 'none',
          },
        },
      },
    },
    comboBadge: {
      backgroundColor: '#F0F9FF',
      padding: `${rem(4)} ${rem(12)}`,
      borderRadius: rem(16),
      display: 'inline-block',
      border: '1px solid #E0F2FE',
      '@media (max-width: 768px)': {
        marginLeft: 'auto',
      },
    },
  };

  // Search input component
  const searchInput = (
    <TextInput
      placeholder="Buscar por nombre, apellido o CUIL..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.currentTarget.value)}
      leftSection={<Search size={16} />}
      mb="md"
      style={{ maxWidth: 500 }}
    />
  );

  // Mobile card view
  const mobileCard = (order: Order) => (
    <Card 
      key={order.id} 
      withBorder 
      p="sm" 
      mb="sm"
      style={{ cursor: 'pointer' }}
      onClick={() => handleViewDetails(order)}
    >
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <Group gap="xs">
          <User size={16} />
          <Text fw={500} size="sm">{order.nombre} {order.apellido}</Text>
        </Group>
        <ActionIcon 
          variant="subtle" 
          color="blue" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(order);
          }}
          size="sm"
        >
          <Eye size={16} />
        </ActionIcon>
      </Group>
      
      <Group gap="xs" mb={4}>
        <Mail size={14} style={{ minWidth: rem(16) }} />
        <Text size="xs" c="dimmed" truncate>{order.email}</Text>
      </Group>
      
      <Group gap="xs" mb={4}>
        <CreditCard size={14} style={{ minWidth: rem(16) }} />
        <Text size="xs" c="dimmed">{order.cuil}</Text>
      </Group>
      
      <Group justify="space-between" mt="sm" wrap="nowrap">
        <Badge color="blue" variant="light" size="sm">
          {order.combo}
        </Badge>
        <Text size="sm" fw={500} c="green">
          ${order.precio.toLocaleString('es-AR')}
        </Text>
      </Group>
    </Card>
  );

  // Desktop table view
  const rows = filteredOrders.map((order) => (
    <Table.Tr key={order.id} style={{ transition: 'background-color 0.2s' }}>
      <Table.Td style={responsiveStyles.tableCell}>
        <ActionIcon 
          variant="subtle" 
          color="blue" 
          onClick={() => handleViewDetails(order)}
          title="Ver detalles"
        >
          <Eye size={18} />
        </ActionIcon>
      </Table.Td>
      <Table.Td data-label="Nombre" style={responsiveStyles.tableCell}>
        <div style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
          <User size={18} />
          <Text fw={500} size="sm">{order.nombre}</Text>
        </div>
      </Table.Td>
      <Table.Td data-label="Apellido" style={responsiveStyles.tableCell}>
        <Text size="sm">{order.apellido}</Text>
      </Table.Td>
      <Table.Td data-label="Email" style={responsiveStyles.tableCell}>
        <div style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
          <Mail size={16} />
          <Text size="sm" style={{ wordBreak: 'break-word' }}>{order.email}</Text>
        </div>
      </Table.Td>
      <Table.Td data-label="CUIL" style={responsiveStyles.tableCell}>
        <div style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
          <CreditCard size={16} />
          <Text size="sm">{order.cuil}</Text>
        </div>
      </Table.Td>
      <Table.Td data-label="Combo" style={responsiveStyles.tableCell}>
        <Box style={responsiveStyles.comboBadge}>
          <Text size="xs" c="blue">
            {order.combo}
          </Text>
        </Box>
      </Table.Td>
    </Table.Tr>
  ))

  const OrderDetailsModal = () => (
    <Modal 
      opened={opened} 
      onClose={close} 
      title="Detalles de la Orden"
      size="lg"
      centered
      zIndex={1000}
      styles={{
        content: {
          zIndex: 1001
        },
        overlay: {
          zIndex: 1000
        }
      }}
    >
      {selectedOrder && (
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">Cliente</Text>
              <Text fw={500}>{selectedOrder.nombre} {selectedOrder.apellido}</Text>
            </div>
            <Badge color="blue" variant="light" size="lg">
              {selectedOrder.combo}
            </Badge>
          </Group>
          
          <Divider my="sm" />
          
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">Email</Text>
              <Text>{selectedOrder.email}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">CUIL/CUIT</Text>
              <Text>{selectedOrder.cuil}</Text>
            </div>
          </Group>
          
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              <Group gap={4}>
                <Users size={16} />
                Invitados ({selectedOrder.invitados.length})
              </Group>
            </Text>
            <Table withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>DNI</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedOrder.invitados.map((guest) => (
                  <Table.Tr key={guest.id}>
                    <Table.Td>{guest.nombre}</Table.Td>
                    <Table.Td>{guest.dni}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
          
          <Divider my="sm" />
          
          <Group justify="space-between" mt="md">
            <div>
              <Text size="sm" c="dimmed">Fecha</Text>
              <Text>{new Date(selectedOrder.fecha).toLocaleDateString()}</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text size="sm" c="dimmed">Total</Text>
              <Text fw={600} size="md" c="green">
                ${selectedOrder.precio.toLocaleString('es-AR')}
              </Text>
            </div>
          </Group>

          <Group justify="space-between" mt="xl">
            <Button
              variant="outline"
              color="red"
              onClick={openDelete}
              leftSection={<Tag size={16} />}
            >
              Eliminar Orden
            </Button>
            <Button
              color="green"
              onClick={openApprove}
              leftSection={<Tag size={16} />}
            >
              Aprobar Orden
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  )

  return (
    <Container style={responsiveStyles.container}>
      <Title order={1} mb="xl" style={{ color: '#2C3E50' }}>
        Gestión de Órdenes
      </Title>
      
      <Card withBorder radius="md" shadow="sm" p={0} style={{ overflow: 'hidden' }}>
        <Box p="md" style={{ borderBottom: `${rem(1)} solid #E9ECEF` }}>
          <Title order={2} size="h4" style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
            <ShoppingCart size={24} />
            Lista de Órdenes
          </Title>
          <Text c="dimmed" mt={4}>
            Revisa y gestiona las órdenes de los clientes
          </Text>
        </Box>
        
        {/* Search Input */}
        <Box p="md" pb={0}>
          <TextInput
            placeholder="Buscar por nombre, apellido o CUIL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
            mb="md"
            style={{ maxWidth: 500 }}
          />
        </Box>
        
        {/* Mobile View */}
        <Box display={{ base: 'block', md: 'none' }} p="md" pt={0}>
          {filteredOrders.length === 0 ? (
            <Text c="dimmed" ta="center" py="md">No se encontraron órdenes</Text>
          ) : (
            filteredOrders.map(order => mobileCard(order))
          )}
        </Box>
        
        {/* Desktop View */}
        <Box display={{ base: 'none', md: 'block' }} p="md" pt={0}>
          {filteredOrders.length === 0 ? (
            <Text c="dimmed" ta="center" py="md">No se encontraron órdenes</Text>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ ...responsiveStyles.tableHeader, width: '1rem' }}>Acciones</Table.Th>
                    <Table.Th style={responsiveStyles.tableHeader}>Nombre</Table.Th>
                    <Table.Th style={responsiveStyles.tableHeader}>Apellido</Table.Th>
                    <Table.Th style={responsiveStyles.tableHeader}>Email</Table.Th>
                    <Table.Th style={responsiveStyles.tableHeader}>CUIL</Table.Th>
                    <Table.Th style={responsiveStyles.tableHeader}>Combo</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Box>
      </Card>
      
      <OrderDetailsModal />
      
      {/* Approve Confirmation Modal */}
      <Modal
        opened={openedApprove}
        onClose={closeApprove}
        title="Confirmar Aprobación"
        centered
        zIndex={2000}
        styles={{
          content: {
            zIndex: 2001
          },
          overlay: {
            zIndex: 2000
          }
        }}
      >
        <Text mb="md">¿Estás seguro de que deseas aprobar esta orden?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeApprove}>
            Cancelar
          </Button>
          <Button color="green" onClick={handleApprove}>
            Confirmar Aprobación
          </Button>
        </Group>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Confirmar Eliminación"
        centered
        zIndex={2000}
        styles={{
          content: {
            zIndex: 2001
          },
          overlay: {
            zIndex: 2000
          }
        }}
      >
        <Text mb="md">¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDelete}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleDelete}>
            Confirmar Eliminación
          </Button>
        </Group>
      </Modal>
    </Container>
  )
}
