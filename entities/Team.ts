/** Tipo de equipo/actividad configurable por evento (fútbol femenino, jenga, juegos de mesa…) */
export interface TeamType {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  minPlayers: number;
  maxPlayers: number;
  /** null = sin límite de equipos */
  maxTeams: number | null;
  /** Precio de inscripción; 0 = gratis */
  price: number;
  isActive: boolean;
  isPublished: boolean;
  displayOrder: number;
  teamsCount: number;
}

export interface TeamPlayer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Team {
  id: string;
  name: string;
  leaderName: string;
  leaderPhone: string;
  leaderEmail: string | null;
  createdAt: string;
  teamType: { id: string; name: string; minPlayers: number; maxPlayers: number };
  players: TeamPlayer[];
}

export interface TeamTypeForm {
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  /** Vacío = sin límite */
  maxTeams: string;
  price: number;
  isActive: boolean;
  isPublished: boolean;
}
