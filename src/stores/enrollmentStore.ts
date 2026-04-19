import { create } from 'zustand';
import { EnrollmentRecord } from '../api/portal';

interface EnrollmentState {
  selectedEnrollmentId: number | null;
  enrollmentsCache: EnrollmentRecord[];
  setSelectedEnrollment: (id: number | null) => void;
  setEnrollmentsCache: (enrollments: EnrollmentRecord[]) => void;
  clearSelection: () => void;
}

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  selectedEnrollmentId: null,
  enrollmentsCache: [],

  setSelectedEnrollment: (id) =>
    set({ selectedEnrollmentId: id }),

  setEnrollmentsCache: (enrollments) =>
    set({ enrollmentsCache: enrollments }),

  clearSelection: () =>
    set({ selectedEnrollmentId: null }),
}));
