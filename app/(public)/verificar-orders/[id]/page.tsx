'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

interface Props {
  params: {
    id: string;
  };
}

const schema = z.object({
  email: z.string().email(),
  cuil: z.string().min(8, 'CUIL inválido'),
  metodo: z.enum(['mercadopago', 'otro']),
  numeroOperacion: z.string().optional(),
  idComprobante: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function VerificarTransferenciaPage({ params }: Props) {
  const [metodo, setMetodo] = useState<'mercadopago' | 'otro' | ''>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const metodoSeleccionado = watch('metodo');

  const onSubmit = (data: FormValues) => {
    const payload = {
      ordenId: params.id,
      ...data,
      numeroOperacion: data.metodo === 'mercadopago' ? data.numeroOperacion : undefined,
      idComprobante: data.metodo === 'otro' ? data.idComprobante : undefined,
    };

    console.log('Datos enviados:', payload);
    // Aquí podrías hacer un fetch o axios.post a tu backend
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Verificar Transferencia</h1>
      <p className="text-sm text-gray-600 mb-6">
        <strong>Orden ID:</strong> {params.id}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cuil">CUIL</Label>
          <input
            id="cuil"
            type="text"
            {...register('cuil')}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cuil && (
            <p className="text-red-500 text-sm mt-1">{errors.cuil.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="metodo">Método de pago</Label>
          <select
            id="metodo"
            {...register('metodo')}
            value={metodo}
            onChange={(e) => {
              const value = e.target.value as 'mercadopago' | 'otro';
              setMetodo(value);
              setValue('metodo', value);
            }}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar</option>
            <option value="mercadopago">MercadoPago</option>
            <option value="otro">Otro</option>
          </select>
          {errors.metodo && (
            <p className="text-red-500 text-sm mt-1">{errors.metodo.message}</p>
          )}
        </div>

        {metodoSeleccionado === 'mercadopago' && (
          <div>
            <Label htmlFor="numeroOperacion">Número de operación</Label>
            <input
              id="numeroOperacion"
              type="number"
              {...register('numeroOperacion')}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='111797629847'
            />
            {errors.numeroOperacion && (
              <p className="text-red-500 text-sm mt-1">{errors.numeroOperacion.message}</p>
            )}
          </div>
        )}

        {metodoSeleccionado === 'otro' && (
          <div>
            <Label htmlFor="idComprobante">ID de comprobante</Label>
            <input
              id="idComprobante"
              type="text"
              {...register('idComprobante')}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='ORD6LEN876XG51LG2M1Y30'
            />
            {errors.idComprobante && (
              <p className="text-red-500 text-sm mt-1">{errors.idComprobante.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Verificar
        </button>
      </form>
    </div>
  );
}
