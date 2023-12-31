import { useMemo } from 'react';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, LinearProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { auth } from '../../services/firebase.ts';
import { useSplitView } from '../../services/splitView.ts';
import { ISplitView } from '../../types/splitView.ts';

export default function SplitViewDashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [splitViewSnapshots, isLoading, error] = useSplitView(user?.uid);

  const splitViews = useMemo(() => {
    return (
      splitViewSnapshots?.docs.map((doc) => {
        return {
          ...(doc.data() as ISplitView),
          id: doc.id,
        };
      }) ?? []
    );
  }, [splitViewSnapshots]);

  const handleOpenForm = () => {
    navigate(`/splitview/form`);
  };

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Split view
          </Typography>
          {splitViews.length > 0 && (
            <IconButton onClick={handleOpenForm}>
              <AddIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {error && (
        <Alert severity="error">Unable to display the result now!</Alert>
      )}
      {isLoading && <LinearProgress />}
      <Box sx={{ p: 1 }}>
        {!isLoading && splitViews.length === 0 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleOpenForm}
          >
            Create split view
          </Button>
        )}
        {!isLoading &&
          splitViews.map((splitView) => {
            return <>{splitView.view1.origin}</>;
          })}
      </Box>
    </>
  );
}
