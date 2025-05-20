
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function MyArea() {
  return (
    <div className="space-y-6">
      <motion.h2 
        className="text-2xl font-semibold text-portal-dark mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Minha Área
      </motion.h2>
      
      {/* My Suppliers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-t-4 border-t-blue-400 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white">
            <div>
              <CardTitle className="text-blue-800">Meus Fornecedores</CardTitle>
              <CardDescription>Fornecedores que você cadastrou</CardDescription>
            </div>
            <Link to="/student/my-suppliers">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Gerenciar
                </Button>
              </motion.div>
            </Link>
          </CardHeader>
          <CardContent className="bg-gradient-to-br from-white to-blue-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1].map((id) => (
                <motion.div
                  key={id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <Users size={18} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800">Meu Fornecedor {id}</h3>
                          <p className="text-sm text-gray-500">Produtos importados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <Link to="/student/my-suppliers" className="block">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-dashed border-blue-200 h-full">
                    <CardContent className="p-4 flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-blue-600">Adicionar Fornecedor</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
