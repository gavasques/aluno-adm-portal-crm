
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Mentoring = () => {
  const navigate = useNavigate();
  
  // Mock data para exemplo
  const mentorings = [
    { id: 1, name: "Mentoria Individual", price: "R$ 1.500,00" },
    { id: 2, name: "Mentoria em Grupo", price: "R$ 800,00" },
    { id: 3, name: "Mentoria Premium", price: "R$ 2.500,00" }
  ];

  const handleNewMentoring = () => {
    // Por enquanto, navega para a primeira mentoria como exemplo
    // Em uma implementação real, isso seria uma página de criação
    navigate("/admin/mentorias/new");
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Gerencie as mentorias disponíveis</p>
        </div>
        <Button onClick={handleNewMentoring}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Mentoria
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentorings.map((mentoring) => (
              <tr key={mentoring.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{mentoring.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mentoring.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/mentorias/${mentoring.id}`)}>
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mentoring;
