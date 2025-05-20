
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Hero from "@/components/ui/hero";
import Demo from "@/components/ui/demo";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Hero Section with new component */}
      <Hero />
      
      {/* Features Section with new component */}
      <Demo />
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-6 text-portal-dark">
              Pronto para começar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Acesse agora mesmo nossa plataforma e descubra as melhores ferramentas e fornecedores para seu e-commerce.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/student">
                <Button size="lg" className="bg-portal-primary text-white hover:bg-portal-dark">
                  Área do Aluno
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="text-portal-primary border-portal-primary hover:bg-portal-light">
                  Área do Administrador
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
