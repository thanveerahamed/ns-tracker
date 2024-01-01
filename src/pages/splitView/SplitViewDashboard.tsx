import { useMemo } from 'react';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
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

import { auth } from '../../services/firebase.ts';
import { useSplitView } from '../../services/splitView.ts';
import { ISplitView, ISplitViewWithId } from '../../types/splitView.ts';

function TimeLineView({ from, to }: { from: string; to: string }) {
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      <TimelineItem sx={{ minHeight: '50px' }}>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            {from}
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem sx={{ minHeight: '20px' }}>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
            {to}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

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
              <Card key={splitView.id}>
                <CardContent sx={{ p: 0 }}>
                  <Stack direction="row">
                    <TimeLineView
                      from={splitView.view1.origin.namen.lang}
                      to={splitView.view1.destination.namen.lang}
                    />
                    <Divider orientation="vertical" flexItem>
                      AND
                    </Divider>
                    <TimeLineView
                      from={splitView.view2.origin.namen.lang}
                      to={splitView.view2.destination.namen.lang}
                    />
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(splitView)}
                  >
                    EDIT
                  </Button>
                  <Button variant="outlined">VIEW</Button>
                </CardActions>
              </Card>
            );
          })}
      </Box>
    </>
  );
}