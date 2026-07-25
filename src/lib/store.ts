import { create } from "zustand";
import { type ViewMode } from "@/components/shared/list-toolbar";

export type ViewType =
  | "home"
  | "plans"
  | "plan-detail"
  | "cabins"
  | "cabin-detail"
  | "transports"
  | "visas"
  | "contact"
  | "policies"
  | "favorites"
  | "team";

interface NavigationState {
  currentView: ViewType;
  selectedItemId: string | null;
  plansViewMode: ViewMode | null;
  setPlansViewMode: (mode: ViewMode | null) => void;
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
  searchIsSticky: boolean;
  searchSelectedVariant: string | null;
  searchPriceFrom: number | null;
  navigate: (
    view: ViewType,
    itemId?: string | null,
    options?: { viewMode?: ViewMode }
  ) => void;
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
    },
    options?: { viewMode?: ViewMode }
  ) => void;
  goHome: () => void;
  clearSearch: () => void;
  setSearchIsSticky: (isSticky: boolean) => void;
  setSearchSelectedVariant: (variant: string | null) => void;
  setSearchPriceFrom: (price: number | null) => void;
  updateSearchParams: (params: Partial<NavigationState>) => void;
  favoritesPulseActive: boolean;
  setFavoritesPulseActive: (active: boolean) => void;
  previousView: ViewType | null;
  previousItemId: string | null;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentView: "home",
  selectedItemId: null,
  plansViewMode: null,
  setPlansViewMode: (mode) => set({ plansViewMode: mode }),
  previousView: null,
  previousItemId: null,
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
  searchIsSticky: false,
  searchSelectedVariant: null,
  searchPriceFrom: null,
  navigate: (view, itemId = null, options) => {
    set((state) => {
      const updates: Partial<NavigationState> = {
        currentView: view,
        selectedItemId: itemId,
      };
      if (options?.viewMode !== undefined) {
        updates.plansViewMode = options.viewMode;
      }
      if (view === "favorites" && state.currentView !== "favorites") {
        updates.previousView = state.currentView;
        updates.previousItemId = state.selectedItemId;
      } else if (view !== "favorites") {
        updates.previousView = null;
        updates.previousItemId = null;
      }
      return updates;
    });
  },
  navigateWithSearch: (view, itemId, searchParams, options) => {
    set({
      currentView: view,
      selectedItemId: itemId,
      plansViewMode: options?.viewMode ?? "3",
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
      searchIsSticky: true,
      previousView: null,
      previousItemId: null,
    });
  },
  goHome: () => {
    set({
      currentView: "home",
      selectedItemId: null,
      searchIsSticky: false,
      searchSelectedVariant: null,
      searchPriceFrom: null,
      previousView: null,
      previousItemId: null,
    });
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
      searchIsSticky: false,
      searchSelectedVariant: null,
      searchPriceFrom: null,
    });
  },
  setSearchIsSticky: (isSticky) => set({ searchIsSticky: isSticky }),
  setSearchSelectedVariant: (variant) => set({ searchSelectedVariant: variant }),
  setSearchPriceFrom: (price) => set({ searchPriceFrom: price }),
  updateSearchParams: (params) => set((state) => ({ ...state, ...params })),
  favoritesPulseActive: false,
  setFavoritesPulseActive: (active) => set({ favoritesPulseActive: active }),
}));
