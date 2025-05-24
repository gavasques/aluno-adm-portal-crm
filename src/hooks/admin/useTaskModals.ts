
import { useState } from "react";

export const useTaskModals = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("today");

  return {
    isNewTaskDialogOpen,
    setIsNewTaskDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    showStudentModal,
    setShowStudentModal,
    currentTask,
    setCurrentTask,
    selectedStudentId,
    setSelectedStudentId,
    selectedTab,
    setSelectedTab,
  };
};
