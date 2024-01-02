import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, LinearProgress, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import SingleViewCard from '../../components/splitView/SingleViewCard.tsx';

import { useSnackbarContext } from '../../context';
import { useLoading } from '../../hooks/useLoading.ts';
import { useSubmitted } from '../../hooks/useSubmitted.ts';
import { auth } from '../../services/firebase.ts';
import {
  addSplitView,
  removeSplitView,
  updateSplitView,
  useSplitViewDocument,
} from '../../services/splitView.ts';
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
  const { showNotification } = useSnackbarContext();
  const [searchParams] = useSearchParams();
  const splitViewId = searchParams.get('id');
  const loading = useLoading();
  const [leftView, setLeftView] = useState<Partial<IView> | undefined>();
  const [rightView, setRightView] = useState<Partial<IView> | undefined>();
  const [splitViewSnapshot, splitViewIsLoading] = useSplitViewDocument(
    splitViewId ?? undefined,
    user?.uid,
  );

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

  const handleDelete = () => {
    (async () => {
      if (user && splitViewId) {
        removeSplitView(user.uid, splitViewId)
          .then(() => {
            navigate(-1);
          })
          .catch(() => showNotification('Some error occurred!', 'error'));
      }
    })();
  };

  const isInvalidForm = useCallback(
    () =>
      !leftView ||
      !leftView.origin ||
      !leftView.destination ||
      !rightView ||
      !rightView.origin ||
      !rightView.destination,
    [leftView, rightView],
  );

  const isOriginDestinationSame = useCallback(
    () =>
      (leftView &&
        leftView.origin?.UICCode === leftView.destination?.UICCode) ||
      (rightView &&
        rightView.origin?.UICCode === rightView.destination?.UICCode),
    [leftView, rightView],
  );

  const handleSave = () => {
    submitted.submit();
    if (isInvalidForm() || isOriginDestinationSame()) {
      return;
    }

    if (user && leftView && rightView) {
      (async () => {
        loading.startLoading();
        try {
          if (splitViewId) {
            await updateSplitView(user.uid, splitViewId, {
              view1: leftView as IView,
              view2: rightView as IView,
              createdAt: dayjs().toString(),
            });
          } else {
            await addSplitView(user.uid, {
              view1: leftView as IView,
              view2: rightView as IView,
              createdAt: dayjs().toString(),
            });
          }

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

  const getErrorMessage = useCallback(() => {
    if (isInvalidForm()) {
      return 'Please complete the form';
    }

    if (isOriginDestinationSame()) {
      return 'Please use different origin or destination';
    }

    return 'Some error. Please try later.';
  }, [isInvalidForm, isOriginDestinationSame]);

  useEffect(() => {
    if (splitViewId && splitViewSnapshot) {
      setLeftView(splitViewSnapshot.view1);
      setRightView(splitViewSnapshot.view2);
    }
  }, [splitViewSnapshot, splitViewId]);

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {!splitViewId ? 'New split view' : 'Manage split view'}
          </Typography>
        </Toolbar>
      </AppBar>
      {splitViewIsLoading && <LinearProgress />}
      {submitted.isSubmitted &&
        (isInvalidForm() || isOriginDestinationSame()) && (
          <Alert severity="error">{getErrorMessage()}</Alert>
        )}
      <SingleViewCard
        title="Left view"
        onSelect={(station, type) =>
          handleSingViewCardSelect(station, type, ViewLocation.Left)
        }
        view={leftView ? (leftView as IView) : undefined}
      />

      <SingleViewCard
        title="Right view"
        onSelect={(station, type) =>
          handleSingViewCardSelect(station, type, ViewLocation.Right)
        }
        view={leftView ? (rightView as IView) : undefined}
      />

      <Stack direction="row" justifyContent="flex-end" p={2} spacing={2}>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          variant="contained"
          onClick={handleDelete}
          sx={{ position: 'absolute', left: 20 }}
          disabled={splitViewIsLoading}
        >
          Delete
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={handleCancel}
          disabled={splitViewIsLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          color="primary"
          variant="outlined"
          onClick={handleSave}
          loading={loading.isLoading || splitViewIsLoading}
        >
          Save
        </LoadingButton>
      </Stack>
    </>
  );
}
