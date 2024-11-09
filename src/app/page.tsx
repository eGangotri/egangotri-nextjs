'use client'

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import ItemForm from '../components/ItemForm';

interface Item {
  id: string;
  name: string;
  location: string;
  creationTime: string;
  owner: string;
}

const emptyItem = {
  name: '',
  location: '',
  owner: '',
};

export default function ItemsListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Item> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleOpenModal = (item: Partial<Item> | null = null) => {
    setCurrentItem(item);
    setIsEditing(!!item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData: Partial<Item>) => {
    try {
      if (isEditing && currentItem?.id) {
        const response = await fetch(`/api/items/${currentItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to update item');
        }
      } else {
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to create item');
        }
      }
      handleCloseModal();
      fetchItems();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { 
      field: 'creationTime', 
      headerName: 'Creation Time', 
      flex: 1,
      valueFormatter: (params) => format(new Date(), 'PPpp'),
    },
    { field: 'owner', headerName: 'Owner', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenModal(params.row)} aria-label="Edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-8">
      <Typography variant="h4" className="mb-8">Items List</Typography>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={() => handleOpenModal()} 
        className="mb-4"
      >
        Add New Item
      </Button>
      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </Box>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <ItemForm
            item={currentItem || emptyItem}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}