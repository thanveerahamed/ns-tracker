import { useEffect, useMemo } from 'react';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SplitViewTimeLineView from '../../components/splitView/SplitViewTimeLineView.tsx';

import { auth } from '../../services/firebase.ts';
import { useSplitView } from '../../services/splitView.ts';
import { ISplitView, ISplitViewWithId } from '../../types/splitView.ts';

export default function SplitViewDashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [splitViewSnapshots, isLoading, error] = useSplitView(user?.uid);

  const splitViews = useMemo(() => {
    return (
      splitViewSnapshots?.docs.map((doc) => {
        const data = doc.data() as ISplitView;
        return {
          ...data,
          id: doc.id,
        } as ISplitViewWithId;
      }) ?? []
    );
  }, [splitViewSnapshots]);

  const handleOpenForm = () => {
    navigate(`/splitview/form`);
  };

  const handleEdit = (splitView: ISplitViewWithId) => {
    navigate(`/splitview/form?id=${splitView.id}`);
  };

  const handleView = (splitView: ISplitViewWithId) => {
    navigate(`/splitview/tripsInformation/${splitView.id}`);
  };

  useEffect(() => {
    const previouslyOpenedSplitView = splitViews.find((x) => x.opened === true);
    if (previouslyOpenedSplitView) {
      handleView(previouslyOpenedSplitView);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitViews]);

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Split view
          </Typography>
          {splitViews.length > 0 && (
            <IconButton onClick={handleOpenForm} color="primary">
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
            return (
              <Card key={splitView.id} sx={{ mb: 1 }}>
                <CardContent sx={{ padding: '0px !important' }}>
                  <Stack direction="row">
                    <Stack
                      direction="row"
                      onClick={() => handleView(splitView)}
                    >
                      <Box sx={{ width: '45%' }}>
                        <SplitViewTimeLineView
                          from={splitView.view1.origin.namen.lang}
                          to={splitView.view1.destination.namen.lang}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem>
                        AND
                      </Divider>
                      <Box sx={{ width: '45%' }}>
                        <SplitViewTimeLineView
                          from={splitView.view2.origin.namen.lang}
                          to={splitView.view2.destination.namen.lang}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button onClick={() => handleView(splitView)}>VIEW</Button>
                  <Button onClick={() => handleEdit(splitView)}>EDIT</Button>
                </CardActions>
              </Card>
            );
          })}
      </Box>
    </>
  );
}
