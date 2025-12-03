import { useState } from 'react';
import MetricsCards from '@/components/dashboard/MetricsCards';
import SalesChart from '@/components/dashboard/SalesChart';

const MetricsPage = () => {
  // Datos simulados - En producción vendrían de una API
  const [metricsData] = useState({
    totalIncome: 391.92,
    totalStudents: 4,
    salesData: [
      { name: 'Día 1', ventas: 10 },
      { name: 'Día 2', ventas: 25 },
      { name: 'Día 3', ventas: 15 },
      { name: 'Día 4', ventas: 30 },
      { name: 'Día 5', ventas: 20 },
      { name: 'Día 6', ventas: 35 },
      { name: 'Día 7', ventas: 28 },
    ]
  });

  return (
    <div className="space-y-6">
      <MetricsCards 
        totalIncome={metricsData.totalIncome} 
        totalStudents={metricsData.totalStudents}
      />
      
      <SalesChart data={metricsData.salesData} />
    </div>
  );
};

export default MetricsPage;

