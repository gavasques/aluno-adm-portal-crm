
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNews, News } from '@/hooks/useNews';
import { NewsForm } from '@/components/admin/news/NewsForm';
import { NewsTable } from '@/components/admin/news/NewsTable';

const AdminNews = () => {
  const { 
    news, 
    loading, 
    createNews, 
    updateNews, 
    deleteNews, 
    publishNews, 
    unpublishNews 
  } = useNews();
  
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateNews = () => {
    setEditingNews(null);
    setShowForm(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setShowForm(true);
  };

  const handleSubmit = async (data: Omit<News, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSubmitting(true);
      
      if (editingNews) {
        await updateNews(editingNews.id, data);
      } else {
        await createNews(data);
      }
      
      setShowForm(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        await deleteNews(id);
      } catch (error) {
        console.error('Erro ao deletar notícia:', error);
        alert('Erro ao deletar notícia');
      }
    }
  };

  const handleToggleStatus = async (news: News) => {
    try {
      if (news.status === 'published') {
        await unpublishNews(news.id);
      } else {
        await publishNews(news.id);
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status da notícia');
    }
  };

  if (showForm) {
    return (
      <div className="p-8">
        <NewsForm
          news={editingNews}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Notícias
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie as notícias exibidas na dashboard dos alunos
          </p>
        </div>
        <Button onClick={handleCreateNews} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Notícia
        </Button>
      </div>

      <NewsTable
        news={news}
        onEdit={handleEditNews}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />
    </div>
  );
};

export default AdminNews;
