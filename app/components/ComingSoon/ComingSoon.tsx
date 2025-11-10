"use client"

import { Title, Text, Card, Center, rem } from "@mantine/core";
import { Clock } from "lucide-react";

interface ComingSoonProps {
  moduleName?: string
}

export function ComingSoon({ moduleName = 'esta sección' }: ComingSoonProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Center style={{ flexDirection: 'column', textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{
          width: rem(80),
          height: rem(80),
          borderRadius: '50%',
          backgroundColor: 'var(--mantine-color-violet-0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <Clock size={40} color="var(--mantine-color-violet-6)" />
        </div>
        <Title order={2} mb="md">
          ¡Próximamente!
        </Title>
        <Text c="dimmed" size="lg" maw={500}>
          Estamos trabajando en {moduleName}. Muy pronto podrás gestionar todo desde aquí.
        </Text>
      </Center>
    </Card>
  )
}
