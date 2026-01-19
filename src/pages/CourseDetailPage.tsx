import { ArrowLeft, BookOpen, Edit, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/Dashboard/SideBar";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";

interface Lesson {
  external_reference: number;
  name: string;
}

interface Student {
  external_reference: number;
  name: string;
  emai: string;
  phone: string;
}

interface Course {
  external_reference: number;
  name: string;
  description: string;
  product_id: number;
  user_id: number;
}

const CourseDetailPage: React.FC = () => {
  const { external_reference } = useParams<{ external_reference: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false);

  const isAdmin = user?.role === "administrator";

  useEffect(() => {
    let isMounted = true;

    const fetchCourseData = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");

        // Usar endpoints de administrador si el usuario es administrador
        const coursesEndpoint = isAdmin
          ? API_ENDPOINTS.administrator.courses
          : API_ENDPOINTS.courses.base;

        const lessonsEndpoint = isAdmin
          ? API_ENDPOINTS.administrator.lessons(external_reference!)
          : API_ENDPOINTS.courses.lessons(external_reference!);

        const studentsEndpoint = isAdmin
          ? API_ENDPOINTS.administrator.students(external_reference!)
          : API_ENDPOINTS.courses.students(external_reference!);

        // Fetch course details, lessons, and students in parallel
        const [coursesResponse, lessonsResponse, studentsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}${coursesEndpoint}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
              },
            }),
            fetch(`${API_BASE_URL}${lessonsEndpoint}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
              },
            }),
            fetch(`${API_BASE_URL}${studentsEndpoint}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
              },
            }),
          ]);

        if (
          !coursesResponse.ok ||
          !lessonsResponse.ok ||
          !studentsResponse.ok
        ) {
          throw new Error("Error al cargar los datos del curso");
        }

        const [coursesData, lessonsData, studentsData] = await Promise.all([
          coursesResponse.json(),
          lessonsResponse.json(),
          studentsResponse.json(),
        ]);

        if (isMounted) {
          // Find the specific course
          const foundCourse = coursesData.find(
            (c: Course) =>
              c.external_reference === parseInt(external_reference!),
          );
          setCourse(foundCourse || null);
          setLessons(lessonsData);
          setStudents(studentsData);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourseData();

    return () => {
      isMounted = false;
    };
  }, [external_reference, isAdmin]);

  const parseCourseInfo = (courseName: string) => {
    const parts = courseName.split(" - ");
    const courseTitle = parts[0] || courseName;
    return courseTitle;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SideBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pt-16 lg:pt-0">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-studdeo-violet rounded-full animate-spin"></div>
          <p className="text-gray-600 font-montserrat">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SideBar />
        <div className="flex-1 flex items-center justify-center pt-16 lg:pt-0">
          <p className="text-gray-600 font-montserrat">Curso no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />

      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/cursos")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 font-montserrat text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Volver a Cursos
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
                {parseCourseInfo(course.name)}
              </h1>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => setShowStudents(!showStudents)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-montserrat text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              {showStudents ? (
                <>
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  Clases
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Estudiantes
                </>
              )}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600 font-montserrat">
                  Estudiantes
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 font-montserrat">
                {students.length}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600 font-montserrat">Clases</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 font-montserrat">
                {lessons.length}
              </p>
            </div>
          </div>

          {/* Course Content or Students List */}
          {showStudents ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat">
                  Lista de Estudiantes
                </h2>
              </div>

              {students.length === 0 ? (
                <p className="text-gray-600 font-montserrat text-center py-8">
                  No hay estudiantes inscritos en este curso
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 font-montserrat">
                          Nombre
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 font-montserrat">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student.external_reference}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-900 font-montserrat">
                            {student.name}
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-montserrat">
                            {student.emai}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
                  Contenido del Curso
                </h2>
              </div>

              {lessons.length === 0 ? (
                <p className="text-gray-600 font-montserrat text-center py-8">
                  No hay lecciones en este curso
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-blue-600 font-montserrat">
                          Título
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.map((lesson) => (
                        <tr
                          key={lesson.external_reference}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-900 font-montserrat">
                            {lesson.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
