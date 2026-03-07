import { useState, useEffect, useMemo } from 'react';
import { ProjectService } from '@/services/project.service';
import * as Icons from 'lucide-react';

export interface ProjectStatusData {
    id: string;
    label: string;
    color: string;
    icon: string;
    sort_order: number;
}

export const useProjectStatuses = () => {
    const [statuses, setStatuses] = useState<ProjectStatusData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const { data, error } = await ProjectService.getStatuses();
                if (error) throw error;
                if (data) setStatuses(data as ProjectStatusData[]);
            } catch (err) {
                console.error('Error fetching project statuses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatuses();
    }, []);

    const getStatusInfo = useMemo(() => (statusId: string) => {
        return statuses.find(s => s.id === statusId);
    }, [statuses]);

    const getStatusIcon = useMemo(() => (statusId: string) => {
        const info = getStatusInfo(statusId);
        const iconName = info?.icon || 'HelpCircle';
        const Icon = (Icons as any)[iconName];
        return Icon || Icons.HelpCircle;
    }, [getStatusInfo]);

    return {
        statuses,
        loading,
        getStatusInfo,
        getStatusIcon,
        STATUS_ORDER: statuses.map(s => s.id)
    };
};
