import * as React from 'react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import SingleViewCard from '../../components/splitView/SingleViewCard.tsx';

import { useLoading } from '../../hooks/useLoading.ts';
import { useSubmitted } from '../../hooks/useSubmitted.ts';
import { auth } from '../../services/firebase.ts';
import { addSplitView } from '../../services/splitView.ts';
import { IView } from '../../types/splitView.ts';
import { LocationType, NSStation } from '../../types/station.ts';

enum ViewLocation {
  Left,
  Right,
}

export default function SplitViewForm() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const submitted = useSubmitted();
  const loading = useLoading();
  const [leftView, setLeftView] = useState<Partial<IView> | undefined>();
  const [rightView, setRightView] = useState<Partial<IView> | undefined>();

  const handleSingViewCardSelect = (
    station: NSStation,
    type: LocationType,
    view: ViewLocation,
  ) => {
    if (view === ViewLocation.Left) {
      setLeftView({
        ...leftView,
        [type]: station,
      });
    } else {
      setRightView({
        ...rightView,
        [type]: station,
      });
    }

    submitted.reset();
  };

  const handleCancel = () => navigate(-1);

  const isInvalidForm = () =>
    !leftView ||
    !leftView.origin ||
    !leftView.destination ||
    !rightView ||
    !rightView.origin ||
    !rightView.destination;

  const handleSave = () => {
    submitted.submit();
    if (isInvalidForm()) {
      return;
    }

    if (user && leftView && rightView) {
      (async () => {
        loading.startLoading();
        try {
          await addSplitView(user.uid, {
            view1: leftView as IView,
            view2: rightView as IView,
            createdAt: dayjs().toString(),
          });

          navigate(-1);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          // TODO
        } finally {
          loading.stopLoading();
        }
      })();
    }
  };

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            New split view
          </Typography>
        </Toolbar>
      </AppBar>
      {submitted.isSubmitted && isInvalidForm() && (
        <Alert severity="error">Please complete the form</Alert>
      )}
      <SingleViewCard
        title="Left view"
        onSelect={(station, type) =>
          handleSingViewCardSelect(station, type, ViewLocation.Left)
        }
      />

      <SingleViewCard
        title="Right view"
        onSelect={(station, type) =>
          handleSingViewCardSelect(station, type, ViewLocation.Right)
        }
      />

      <Stack direction="row" justifyContent="flex-end" p={2} spacing={2}>
        <Button color="secondary" variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <LoadingButton
          color="primary"
          variant="outlined"
          onClick={handleSave}
          loading={loading.isLoading}
        >
          Save
        </LoadingButton>
      </Stack>
    </>
  );
}
