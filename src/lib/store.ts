import { create } from "zustand";

export type ViewType =
  | "home"
  | "plans"
  | "plan-detail"
  | "cabins"
  | "cabin-detail"
  | "contact"
  | "policies"
  | "favorites"
  | "team";

interface NavigationState {
  currentView: ViewType;
  selectedItemId: string | null;
  searchDestination: string | null;
  searchOrigin: string | null;
  searchDate: string | null;
  searchDateEnd: string | null;
  searchAdults: string | null;
  searchChildren: string | null;
  searchRooms: string | null;
  searchRoomsDetail: string | null;
  searchTravelerType: string | null;
  searchCategory: string | null;
  searchActivity: string | null;
  navigate: (view: ViewType, itemId?: string | null) => void;
  navigateWithSearch: (
    view: ViewType,
    itemId: string | null,
    searchParams: {
      destino: string;
      origen?: string;
      fecha: string;
      adultos: number;
      ninos: number;
      fechaFin?: string;
      habitaciones?: number;
      roomsDetail?: string;
      tipoViajero?: string;
      categoria?: string;
      actividad?: string;
    }
  ) => void;
  goHome: () => void;
  clearSearch: () => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentView: "home",
  selectedItemId: null,
  searchDestination: null,
  searchOrigin: null,
  searchDate: null,
  searchDateEnd: null,
  searchAdults: null,
  searchChildren: null,
  searchRooms: null,
  searchRoomsDetail: null,
  searchTravelerType: null,
  searchCategory: null,
  searchActivity: null,
  navigate: (view, itemId = null) => {
    set({
      currentView: view,
      selectedItemId: itemId,
      searchDestination: null,
      searchOrigin: null,
      searchDate: null,
      searchDateEnd: null,
      searchAdults: null,
      searchChildren: null,
      searchRooms: null,
      searchRoomsDetail: null,
      searchTravelerType: null,
      searchCategory: null,
      searchActivity: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  navigateWithSearch: (view, itemId, searchParams) => {
    set({
      currentView: view,
      selectedItemId: itemId,
      searchDestination: searchParams.destino || null,
      searchOrigin: searchParams.origen || null,
      searchDate: searchParams.fecha || null,
      searchDateEnd: searchParams.fechaFin || null,
      searchAdults: String(searchParams.adultos),
      searchChildren: String(searchParams.ninos),
      searchRooms: searchParams.habitaciones ? String(searchParams.habitaciones) : null,
      searchRoomsDetail: searchParams.roomsDetail || null,
      searchTravelerType: searchParams.tipoViajero || null,
      searchCategory: searchParams.categoria || null,
      searchActivity: searchParams.actividad || null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  goHome: () => {
    set({
      currentView: "home",
      selectedItemId: null,
      searchDestination: null,
      searchOrigin: null,
      searchDate: null,
      searchDateEnd: null,
      searchAdults: null,
      searchChildren: null,
      searchRooms: null,
      searchRoomsDetail: null,
      searchTravelerType: null,
      searchCategory: null,
      searchActivity: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  clearSearch: () => {
    set({
      searchDestination: null,
      searchOrigin: null,
      searchDate: null,
      searchDateEnd: null,
      searchAdults: null,
      searchChildren: null,
      searchRooms: null,
      searchRoomsDetail: null,
      searchTravelerType: null,
      searchCategory: null,
      searchActivity: null,
    });
  },
}));
