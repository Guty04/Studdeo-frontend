import { Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import { authenticatedFetchJSON } from "../../lib/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Professor {
  id: string;
  professorId: string;
  percentage: number;
}

interface ProfessorData {
  external_reference: number;
  name: string;
  email: string;
  active: boolean;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (professorData: ProfessorData, percentage: number) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [professors, setProfessors] = useState<Professor[]>([
    { id: "1", professorId: "", percentage: 0 },
  ]);
  const [availableProfessors, setAvailableProfessors] = useState<
    ProfessorData[]
  >([]);
  const [isLoadingProfessors, setIsLoadingProfessors] = useState(false);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [showDropdown, setShowDropdown] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      fetchProfessors();
    }
  }, [isOpen]);

  const fetchProfessors = async () => {
    setIsLoadingProfessors(true);
    try {
      const data = await authenticatedFetchJSON<ProfessorData[]>(
        API_ENDPOINTS.profesores.alreadyMapped,
      );
      setAvailableProfessors(data);
    } catch (error) {
      console.error("Error al obtener profesores:", error);
      if (error instanceof Error && error.message.includes("Sesión expirada")) {
        // El usuario será redirigido automáticamente al login por ProtectedRoute
        window.location.reload();
      }
    } finally {
      setIsLoadingProfessors(false);
    }
  };

  if (!isOpen) return null;

  const handleRemoveProfessor = (id: string) => {
    if (professors.length > 1) {
      setProfessors(professors.filter((prof) => prof.id !== id));
    }
  };

  const handleProfessorChange = (
    id: string,
    field: "professorId" | "percentage",
    value: string | number,
  ) => {
    setProfessors(
      professors.map((prof) =>
        prof.id === id ? { ...prof, [field]: value } : prof,
      ),
    );
  };

  const handleSearchChange = (professorId: string, searchValue: string) => {
    setSearchTerms({ ...searchTerms, [professorId]: searchValue });
    setShowDropdown({ ...showDropdown, [professorId]: true });
  };

  const handleSelectProfessor = (
    professorId: string,
    selectedProf: ProfessorData,
  ) => {
    console.log("Seleccionando profesor:", professorId, selectedProf);
    handleProfessorChange(
      professorId,
      "professorId",
      selectedProf.external_reference.toString(),
    );
    setSearchTerms({ ...searchTerms, [professorId]: "" });
    setShowDropdown({ ...showDropdown, [professorId]: false });
  };

  const handleClearProfessor = (professorId: string) => {
    handleProfessorChange(professorId, "professorId", "");
    setSearchTerms({ ...searchTerms, [professorId]: "" });
  };

  const getFilteredProfessors = (professorId: string) => {
    const searchTerm = searchTerms[professorId]?.toLowerCase() || "";
    if (!searchTerm) return availableProfessors;

    return availableProfessors.filter(
      (prof) =>
        prof.name.toLowerCase().includes(searchTerm) ||
        prof.email.toLowerCase().includes(searchTerm),
    );
  };

  const getSelectedProfessor = (professorId: string) => {
    const selectedId = professors.find(
      (p) => p.id === professorId,
    )?.professorId;
    if (!selectedId) return null;
    return (
      availableProfessors.find(
        (p) => p.external_reference.toString() === selectedId,
      ) || null
    );
  };

  const handleSubmit = () => {
    const professor = professors[0];
    if (!professor.professorId || !professor.percentage) {
      alert("Por favor completa todos los campos");
      return;
    }

    const selectedProf = availableProfessors.find(
      (p) => p.external_reference.toString() === professor.professorId,
    );

    if (!selectedProf) {
      alert("Profesor no encontrado");
      return;
    }

    onSubmit(selectedProf, professor.percentage);

    // Reset form
    setProfessors([{ id: "1", professorId: "", percentage: 0 }]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
              Crear Usuario
            </h2>
            <p className="text-sm text-gray-500 font-montserrat mt-1">
              Selecciona un profesor para crearle una cuenta de usuario con
              porcentaje de comisión
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Professors Section */}
        <div className="mb-6">
          <div className="mb-4">
            <Label className="text-gray-900 font-montserrat">
              Profesores Referentes
            </Label>
          </div>

          <div className="space-y-4">
            {professors.map((professor) => (
              <div
                key={professor.id}
                className="grid grid-cols-12 gap-4 items-end"
              >
                <div className="col-span-6">
                  <Label
                    htmlFor={`professor-${professor.id}`}
                    className="text-gray-900 font-montserrat mb-2"
                  >
                    Profesor
                  </Label>
                  <div className="space-y-2">
                    {getSelectedProfessor(professor.id) ? (
                      <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                        <div className="flex-1">
                          <p className="font-montserrat text-sm font-medium">
                            {getSelectedProfessor(professor.id)!.name}
                          </p>
                          <p className="font-montserrat text-xs text-gray-500">
                            {getSelectedProfessor(professor.id)!.email}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearProfessor(professor.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                        <Input
                          type="text"
                          placeholder="Buscar por nombre o email..."
                          value={searchTerms[professor.id] || ""}
                          onChange={(e) =>
                            handleSearchChange(professor.id, e.target.value)
                          }
                          onFocus={() =>
                            setShowDropdown({
                              ...showDropdown,
                              [professor.id]: true,
                            })
                          }
                          className="pl-10 font-montserrat"
                          disabled={isLoadingProfessors}
                        />
                        {showDropdown[professor.id] &&
                          getFilteredProfessors(professor.id).length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {getFilteredProfessors(professor.id).map(
                                (prof) => (
                                  <div
                                    key={prof.external_reference}
                                    onClick={() => {
                                      console.log("Click en profesor:", prof);
                                      handleSelectProfessor(professor.id, prof);
                                    }}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                                  >
                                    <p className="font-montserrat text-sm font-medium text-gray-900">
                                      {prof.name}
                                    </p>
                                    <p className="font-montserrat text-xs text-gray-500">
                                      {prof.email}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        {showDropdown[professor.id] &&
                          searchTerms[professor.id] &&
                          getFilteredProfessors(professor.id).length === 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-3">
                              <p className="font-montserrat text-sm text-gray-500">
                                No se encontraron profesores
                              </p>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-5">
                  <Label
                    htmlFor={`percentage-${professor.id}`}
                    className="text-gray-900 font-montserrat mb-2"
                  >
                    Porcentaje (%)
                  </Label>
                  <Input
                    id={`percentage-${professor.id}`}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={professor.percentage || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= 100) {
                        handleProfessorChange(
                          professor.id,
                          "percentage",
                          value,
                        );
                      } else if (e.target.value === "") {
                        handleProfessorChange(professor.id, "percentage", 0);
                      }
                    }}
                    className="font-montserrat"
                  />
                </div>

                <div className="col-span-1 flex items-center justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveProfessor(professor.id)}
                    disabled={professors.length === 1}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="font-montserrat"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-gray-600 hover:bg-gray-700 text-white font-montserrat"
          >
            Crear Usuario
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
