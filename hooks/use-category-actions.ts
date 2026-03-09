"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-notes";
import { DisplayCategory } from "@/types";

export function useCategoryActions() {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [categoryToEdit, setCategoryToEdit] =
    React.useState<DisplayCategory | null>(null);

  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleAdd = (name: string) => {
    addCategory.mutate(name, {
      onSuccess: () => {
        setIsAddOpen(false);
        toast.success("Category created");
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  const handleEdit = (name: string) => {
    if (!categoryToEdit) return;
    updateCategory.mutate(
      { id: categoryToEdit.id, name },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setCategoryToEdit(null);
          toast.success("Category renamed");
        },
        onError: (error: Error) => toast.error(error.message),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (error: Error) => toast.error(error.message),
    });
  };

  return {
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    categoryToEdit,
    setCategoryToEdit,
    handleAdd,
    handleEdit,
    handleDelete,
    isPending:
      addCategory.isPending ||
      updateCategory.isPending ||
      deleteCategory.isPending,
  };
}
