"use client";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import api from '@/lib/axios.config';
import { Event } from '@/entities/Event';

/**
 * Evento "actual" compartido (sidebar, Comidas, buffet).
 * Mantiene un caché a nivel de módulo para no volver a pedir /events/current
 * en cada render/montaje. Devuelve el evento del año actual que tiene la
 * configuración de comidas (`mealConfig`); si ninguno la tiene, el primero.
 * Las comidas se activan por combo; el evento solo guarda el menú.
 */

interface CurrentEventState {
  events: Event[];
  loaded: boolean;
  loading: boolean;
  error: unknown;
}

const INITIAL_STATE: CurrentEventState = {
  events: [],
  loaded: false,
  loading: false,
  error: null,
};

let state: CurrentEventState = INITIAL_STATE;
let inflight: Promise<void> | null = null;
let generation = 0; // se incrementa al limpiar el caché para descartar respuestas viejas
const listeners = new Set<() => void>();

function setState(next: CurrentEventState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => INITIAL_STATE;

export function pickCurrentEvent(events: Event[]): Event | null {
  return events.find((e) => !!e.mealConfig) ?? events[0] ?? null;
}

/** Carga /events/current. Sin `force` reutiliza el caché. */
export function loadCurrentEvent(force = false): Promise<void> {
  if (inflight) return inflight;
  if (state.loaded && !force) return Promise.resolve();

  const requestGeneration = generation;
  setState({ ...state, loading: true, error: null });

  inflight = (async () => {
    try {
      const { data } = await api.get('/events/current');
      if (requestGeneration !== generation) return;
      // El backend retorna un array de eventos del año actual
      const events: Event[] = Array.isArray(data) ? data : [data].filter(Boolean);
      setState({ events, loaded: true, loading: false, error: null });
    } catch (err) {
      if (requestGeneration !== generation) return;
      console.error('Error al cargar el evento actual:', err);
      setState({ ...state, loading: false, error: err });
    } finally {
      if (requestGeneration === generation) inflight = null;
    }
  })();

  return inflight;
}

/** Vuelve a pedir el evento (por ejemplo después de cambiar la configuración de comidas) */
export function refreshCurrentEvent(): Promise<void> {
  return loadCurrentEvent(true);
}

/** Limpia el caché (al cerrar sesión) */
export function resetCurrentEventCache() {
  generation += 1;
  inflight = null;
  setState(INITIAL_STATE);
}

interface UseCurrentEventOptions {
  /** Si es false no se hace ningún request (por ejemplo, roles que no usan Comidas) */
  enabled?: boolean;
}

export function useCurrentEvent({ enabled = true }: UseCurrentEventOptions = {}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!enabled) return;
    if (!state.loaded && !inflight) {
      loadCurrentEvent();
    }
  }, [enabled]);

  const event = useMemo(() => pickCurrentEvent(snapshot.events), [snapshot.events]);
  const refetch = useCallback(() => refreshCurrentEvent(), []);

  const loading =
    enabled && (snapshot.loading || (!snapshot.loaded && !snapshot.error));

  return {
    event,
    events: snapshot.events,
    hasMealConfig: !!event?.mealConfig,
    loading,
    error: snapshot.error,
    refetch,
  };
}

export default useCurrentEvent;
