import { create } from 'zustand';

// 导航标签类型
export type TabType = 'home' | 'routes' | 'record' | 'community' | 'profile';

// 骑行状态
export interface RideState {
  isRecording: boolean;
  startTime: Date | null;
  distance: number;
  duration: number;
  avgSpeed: number;
  calories: number;
  currentSpeed: number;
  currentLat: number | null;
  currentLng: number | null;
}

// 应用状态
interface AppState {
  // 导航状态
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // 用户状态
  userId: string | null;
  setUserId: (id: string) => void;
  
  // 骑行记录状态
  rideState: RideState;
  startRide: () => void;
  stopRide: () => void;
  updateRideData: (data: Partial<RideState>) => void;
  resetRide: () => void;
  
  // 地图状态
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
}

const initialRideState: RideState = {
  isRecording: false,
  startTime: null,
  distance: 0,
  duration: 0,
  avgSpeed: 0,
  calories: 0,
  currentSpeed: 0,
  currentLat: null,
  currentLng: null,
};

export const useAppStore = create<AppState>((set) => ({
  // 导航状态
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // 用户状态
  userId: null,
  setUserId: (id) => set({ userId: id }),
  
  // 骑行记录状态
  rideState: initialRideState,
  startRide: () => set((state) => ({
    rideState: {
      ...state.rideState,
      isRecording: true,
      startTime: new Date(),
    }
  })),
  stopRide: () => set((state) => ({
    rideState: {
      ...state.rideState,
      isRecording: false,
    }
  })),
  updateRideData: (data) => set((state) => ({
    rideState: {
      ...state.rideState,
      ...data,
    }
  })),
  resetRide: () => set({ rideState: initialRideState }),
  
  // 地图状态
  selectedRouteId: null,
  setSelectedRouteId: (id) => set({ selectedRouteId: id }),
}));
