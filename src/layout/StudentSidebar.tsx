import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Book, Home, Settings, Users, BarChart, FileText } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavItem = ({ href, icon: Icon, children }: NavItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === href;
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive 
              ? "bg-gradient-to-r from-portal-primary to-portal-secondary text-white shadow-md" 
              : "text-portal-dark hover:bg-gradient-to-r hover:from-portal-light hover:to-blue-50 hover:text-portal-primary"
          )}
        >
          <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-portal-primary opacity-80")} />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

const StudentSidebar = () => {
  return (
    <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30">
      <SidebarTrigger className="fixed top-3 left-4 md:hidden z-50" />
      <SidebarContent className="pt-16 pb-4">
        <motion.div 
          className="px-3 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-2">
            <img 
              src="/lovable-uploads/e94f154c-7d60-4856-980c-56cf04c607ac.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
          </div>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-portal-primary to-portal-accent text-base font-bold mb-1">
            Área do Aluno
          </h2>
          <p className="text-xs text-gray-500">
            Bem-vindo ao portal
          </p>
        </motion.div>
        
        <motion.div
          variants={sidebarAnimation}
          initial="hidden"
          animate="show"
          className="mt-4"
        >
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student" icon={Home}>Dashboard</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Geral
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/suppliers" icon={Users}>Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/partners" icon={BarChart}>Parceiros</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/tools" icon={Book}>Ferramentas</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Minha Área
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/my-suppliers" icon={FileText}>Meus Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/settings" icon={Settings}>Configurações</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
        
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;
