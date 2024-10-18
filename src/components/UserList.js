import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({ id: '', name: '', email: '' });
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users from API
  useEffect(() => {
    axios.get('https://mocki.io/v1/a6a0fb6b-a84a-4934-b3f2-5c92cc77c44e')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Open dialog for adding or editing
  const handleOpenDialog = (user = null) => {
    setIsEditing(Boolean(user));
    setNewUser(user ? { ...user } : { id: '', name: '', email: '' });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({ id: '', name: '', email: '' });
  };

  // Add or Edit User
  const handleSaveUser = () => {
    if (isEditing) {
      setUsers(users.map(user => user.id === selectedUserId ? newUser : user));
    } else {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
    }
    handleCloseDialog();
  };

  // Delete User
  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#1976d2', marginTop: '20px' }}>
        User List
      </Typography>

      {/* Add User Button */}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px', backgroundColor: '#1976d2', color: 'white' }}
      >
        Add User
      </Button>

      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card variant="outlined" style={{ backgroundColor: '#f5f5f5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h6" color="primary">{user.name}</Typography>
                <Typography color="textSecondary">{user.email}</Typography>

                {/* Action Buttons */}
                <Button
                  startIcon={<Edit />}
                  onClick={() => { handleOpenDialog(user); setSelectedUserId(user.id); }}
                  style={{ marginRight: '10px', marginTop: '10px' }}
                  variant="contained"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  startIcon={<Delete />}
                  onClick={() => handleDeleteUser(user.id)}
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: '10px' }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">{isEditing ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserList;
