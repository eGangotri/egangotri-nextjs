'use client'

import React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface ItemFormProps {
  item: {
    name: string;
    location: string;
    owner: string;
  };
  onSubmit: (item: { name: string; location: string; owner: string }) => void;
  onCancel?: () => void;
}

export default function ItemForm({ item, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = React.useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="flex flex-col gap-4">
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Location"
          name="location"
          variant="outlined"
          fullWidth
          value={formData.location}
          onChange={handleChange}
          required
        />
        <TextField
          label="Owner"
          name="owner"
          variant="outlined"
          fullWidth
          value={formData.owner}
          onChange={handleChange}
          required
        />
        <Box className="flex justify-end gap-2">
          {onCancel && (
            <Button onClick={onCancel} variant="outlined">
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
}