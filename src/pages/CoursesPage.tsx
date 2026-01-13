import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import SideBar from '../components/Dashboard/SideBar';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface Course {
  external_reference: number;
  name: string;
  description: string;
  product_id: number;
  user_id: number;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.courses.base}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los cursos');
        }

        const data = await response.json();
        if (isMounted) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const parseCourseInfo = (courseName: string) => {
    // Parsear el nombre del curso que viene en formato: "3° Parcial Algebra - Profe Gian"
    const parts = courseName.split(' - ');
    const courseTitle = parts[0] || courseName;
    const professorName = parts[1] || '';
    
    return { courseTitle, professorName };
  };

  const getStatusBadge = () => {
    // Por ahora retornamos "Publicado" como estado por defecto
    const statuses = ['Publicado', 'Borrador'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return randomStatus;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-montserrat mb-2">
              Mis Cursos
            </h1>
            <p className="text-gray-600 font-montserrat">
              Gestiona tus cursos y contenido educativo
            </p>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600 font-montserrat">Cargando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600 font-montserrat">No hay cursos disponibles</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {courses.map((course) => {
                const status = getStatusBadge();
                const { courseTitle, professorName } = parseCourseInfo(course.name);
                
                return (
                  <div
                    key={course.external_reference}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      {/* Course Image/Banner */}
                      <div className="w-72 h-48 bg-gradient-to-br from-studdeo-violet to-purple-700 flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
                        {/* Decorative Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white rounded-full"></div>
                          <div className="absolute bottom-8 left-8 w-16 h-16 border-4 border-white rounded-lg rotate-45"></div>
                        </div>
                        
                        {/* Course Icon */}
                        <div className="relative z-10 mt-2">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        
                        {/* Course Title */}
                        <div className="relative z-10 flex-1 flex items-center justify-center">
                          <h3 className="text-xl font-bold text-center font-montserrat break-words leading-tight px-2">
                            {courseTitle}
                          </h3>
                        </div>
                        
                        {/* Professor Badge */}
                        {professorName && (
                          <div className="relative z-10 w-full">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center border border-white/30">
                              <p className="text-sm font-semibold font-montserrat flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {professorName}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 p-6 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-semibold text-gray-900 font-montserrat">
                              {course.name}
                            </h2>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                status === 'Publicado'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          {course.description && (
                            <p className="text-sm text-gray-600 font-montserrat mb-2">
                              {course.description}
                            </p>
                          )}
                          <div className="flex items-center text-gray-600 text-sm font-montserrat">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            ID: {course.product_id}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => navigate(`/cursos/${course.external_reference}`)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg transition-colors font-montserrat"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
