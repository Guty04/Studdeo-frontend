import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';
import SideBar from '../components/Dashboard/SideBar';
import { Card, CardContent } from '../components/ui/card';
import { authenticatedFetchJSON } from '../lib/api';
import { API_ENDPOINTS } from '../config/api';

interface Buyer {
  external_reference: number;
  name: string;
  emai: string;
  phone: string;
}

interface DetailSale {
  price: number;
  quantity: number;
  external_reference: number;
}

interface Sale {
  external_reference: number;
  date: string;
  details_sale: DetailSale[];
  buyer: Buyer;
  calculated_subtotal: number;
}

interface CourseWithSales {
  external_reference: number;
  name: string;
  description: string;
  product_id: number;
  sales: Sale[];
  calculated_total: number;
}

const SalesPage: React.FC = () => {
  const [salesData, setSalesData] = useState<CourseWithSales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'todas' | 'liquidadas' | 'pendientes'>('todas');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const data = await authenticatedFetchJSON<CourseWithSales[]>(API_ENDPOINTS.sales.base);
      setSalesData(data);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cálculos de estadísticas
  const calculateStats = () => {
    let totalIngresos = 0;
    let totalLiquidado = 0;
    let totalPendiente = 0;

    salesData.forEach((course) => {
      totalIngresos += course.calculated_total;
      // Por ahora, como ejemplo, vamos a suponer que el 47% está liquidado
      totalLiquidado += course.calculated_total * 0.47;
      totalPendiente += course.calculated_total * 0.53;
    });

    return { totalIngresos, totalLiquidado, totalPendiente };
  };

  const stats = calculateStats();

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Función para calcular la liquidación (ejemplo: 15 días después)
  const calculateLiquidationDate = (saleDate: string) => {
    const date = new Date(saleDate);
    date.setDate(date.getDate() + 15);
    const today = new Date();
    const daysRemaining = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      daysRemaining,
      isPending: daysRemaining > 0,
    };
  };

  // Preparar datos para la tabla
  const tableData = salesData.flatMap((course) =>
    course.sales.map((sale) => ({
      date: sale.date,
      courseName: course.name,
      studentName: sale.buyer.name,
      totalAmount: sale.calculated_subtotal,
      mpCommission: sale.calculated_subtotal * 0.10, // Ejemplo: 10%
      commission: sale.calculated_subtotal * 0.20, // Ejemplo: 20%
      yourIncome: sale.calculated_subtotal * 0.80, // Ejemplo: 80%
      liquidation: calculateLiquidationDate(sale.date),
      courseId: course.external_reference,
    }))
  );

  // Filtrar datos según tab y curso seleccionado
  const filteredData = tableData.filter((row) => {
    const matchesCourse = selectedCourse === 'all' || row.courseId.toString() === selectedCourse;
    const matchesTab =
      activeTab === 'todas' ||
      (activeTab === 'liquidadas' && !row.liquidation.isPending) ||
      (activeTab === 'pendientes' && row.liquidation.isPending);
    return matchesCourse && matchesTab;
  });

  // Obtener lista única de cursos
  const uniqueCourses = salesData.map((course) => ({
    id: course.external_reference,
    name: course.name,
  }));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
              Ventas y Liquidaciones
            </h1>
            <p className="text-gray-600 font-montserrat mt-2">
              Gestiona tus ventas y seguimiento de liquidaciones de Mercado Pago
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 font-montserrat">Cargando ventas...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 font-montserrat mb-1">
                          Ingresos Totales
                        </p>
                        <p className="text-2xl font-bold text-gray-900 font-montserrat">
                          $ {stats.totalIngresos.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 font-montserrat mb-1">
                          Ya Liquidado
                        </p>
                        <p className="text-2xl font-bold text-green-600 font-montserrat">
                          $ {stats.totalLiquidado.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 font-montserrat mb-1">
                          Pendiente de Liquidar
                        </p>
                        <p className="text-2xl font-bold text-orange-600 font-montserrat">
                          $ {stats.totalPendiente.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Table Card */}
              <Card>
                <CardContent className="p-6">
                  {/* Tabs and Filter */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setActiveTab('todas')}
                        className={`px-4 py-2 font-montserrat ${
                          activeTab === 'todas'
                            ? 'text-gray-900 border-b-2 border-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        Todas
                      </button>
                      <button
                        onClick={() => setActiveTab('liquidadas')}
                        className={`px-4 py-2 font-montserrat ${
                          activeTab === 'liquidadas'
                            ? 'text-gray-900 border-b-2 border-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        Liquidadas
                      </button>
                      <button
                        onClick={() => setActiveTab('pendientes')}
                        className={`px-4 py-2 font-montserrat ${
                          activeTab === 'pendientes'
                            ? 'text-gray-900 border-b-2 border-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        Pendientes
                      </button>
                    </div>

                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-studdeo-violet"
                    >
                      <option value="all">Todos los cursos</option>
                      {uniqueCourses.map((course) => (
                        <option key={course.id} value={course.id.toString()}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Table */}
                  {filteredData.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 font-montserrat text-lg">
                        No hay ventas registradas
                      </p>
                      <p className="text-gray-400 font-montserrat text-sm mt-2">
                        Cuando realices ventas, aparecerán aquí
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Fecha
                            </th>
                            <th className="text-left py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Curso
                            </th>
                            <th className="text-left py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Estudiante
                            </th>
                            <th className="text-right py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Monto Total
                            </th>
                            <th className="text-right py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Comisión MP
                            </th>
                            <th className="text-right py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Comisión
                            </th>
                            <th className="text-right py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Tu Ingreso
                            </th>
                            <th className="text-center py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Estado
                            </th>
                            <th className="text-left py-3 px-4 font-montserrat text-sm font-semibold text-gray-700">
                              Liquidación
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-montserrat text-sm text-gray-900">
                                {formatDate(row.date)}
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-gray-900">
                                {row.courseName}
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-gray-900">
                                {row.studentName}
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-gray-900 text-right">
                                $ {row.totalAmount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-red-600 text-right">
                                -$ {row.mpCommission.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-gray-600 text-right">
                                {((row.commission / row.totalAmount) * 100).toFixed(0)}%
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-green-600 text-right">
                                $ {row.yourIncome.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {row.liquidation.isPending ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 font-montserrat">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pendiente
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 font-montserrat">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Liquidado
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-montserrat text-sm text-gray-600">
                                {row.liquidation.date}
                                <br />
                                <span className="text-xs text-gray-500">
                                  {row.liquidation.isPending
                                    ? `En ${row.liquidation.daysRemaining} días`
                                    : 'Completado'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SalesPage;
