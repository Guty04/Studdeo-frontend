import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Users } from 'lucide-react';

const MetricCard = ({ title, value, icon: IconComponent, iconBgColor, iconColor }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <IconComponent className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricsCards = ({ totalIncome, totalStudents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <MetricCard
        title="Ingresos Totales"
        value={`$${totalIncome.toFixed(2)}`}
        icon={DollarSign}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
      <MetricCard
        title="Estudiantes"
        value={totalStudents}
        icon={Users}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
    </div>
  );
};

export default MetricsCards;
