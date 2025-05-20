
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-container relative overflow-hidden bg-gradient-to-br from-portal-primary to-portal-secondary text-white">
      <div className="hero-content container mx-auto py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Portal do Aluno e Administração
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90"
          >
            Uma plataforma completa com fornecedores, parceiros e ferramentas para impulsionar seu e-commerce.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/student">
              <Button size="lg" className="bg-white text-portal-primary hover:bg-portal-light">
                Área do Aluno
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Área do Administrador
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-portal-accent/20 blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-portal-accent/30 blur-3xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default Hero;
