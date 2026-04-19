import { useState, useEffect } from 'react';
import {
  getSchedules,
  getAttendance,
  getPayments,
  AttendanceRecord,
  ScheduleRecord,
  PaymentRecord,
} from '../api/portal';
import { useAuthStore } from '../stores/authStore';

interface UseEnrollmentReturn {
  schedules: ScheduleRecord[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch all schedules, attendance, and payments for the active cycle.
 * Note: backend doesn't return matricula_id, so filtering by enrollment
 * must be done in the component using taller_nombre.
 */
export const useEnrollment = (): UseEnrollmentReturn => {
  const cicloActivo = useAuthStore((s) => s.cicloActivo);

  const [allSchedules, setAllSchedules] = useState<ScheduleRecord[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cicloActivo) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [schedules, attendance, payments] = await Promise.all([
          getSchedules(cicloActivo.id),
          getAttendance(cicloActivo.id),
          getPayments(cicloActivo.id),
        ]);
        setAllSchedules(schedules);
        setAllAttendance(attendance);
        setAllPayments(payments);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cicloActivo]);

  // Note: backend doesn't return matricula_id, so we can't filter by enrollment
  // Return all data for the cycle (filtering done in component if needed)
  const filteredSchedules = allSchedules;
  const filteredAttendance = allAttendance;
  const filteredPayments = allPayments;

  return {
    schedules: filteredSchedules,
    attendance: filteredAttendance,
    payments: filteredPayments,
    isLoading,
    error,
  };
};
