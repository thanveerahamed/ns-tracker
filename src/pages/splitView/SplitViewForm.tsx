import { Loader2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

import dayjs from 'dayjs';

import SingleViewCard from '../../components/splitView/SingleViewCard.tsx';
import { Alert } from '../../components/ui/alert.tsx';
import { LinearProgress } from '../../components/ui/progress.tsx';

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

  const handleSelect = (
    station: NSStation,
    type: LocationType,
    view: ViewLocation,
  ) => {
    if (view === ViewLocation.Left) {
      setLeftView((prev) => ({ ...prev, [type]: station }));
    } else {
      setRightView((prev) => ({ ...prev, [type]: station }));
    }

    submitted.reset();
  };

  const isInvalidForm = useCallback(
    () =>
      !leftView?.origin ||
      !leftView?.destination ||
      !rightView?.origin ||
      !rightView?.destination,
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

  const handleDelete = async () => {
    if (user && splitViewId) {
      try {
        await removeSplitView(user.uid, splitViewId);
        navigate(-1);
      } catch {
        showNotification('Some error occurred!', 'error');
      }
    }
  };

  const handleSave = async () => {
    submitted.submit();
    if (isInvalidForm() || isOriginDestinationSame()) {
      return;
    }
    if (!user || !leftView || !rightView) {
      return;
    }
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
          view1: {
            ...leftView,
            dateTime: dayjs().toString(),
          } as IView,
          view2: {
            ...rightView,
            dateTime: dayjs().toString(),
          } as IView,
          createdAt: dayjs().toString(),
        });
      }

      navigate(-1);
    } finally {
      loading.stopLoading();
    }
  };

  useEffect(() => {
    if (splitViewId && splitViewSnapshot) {
      setLeftView(splitViewSnapshot.view1);
      setRightView(splitViewSnapshot.view2);
    }
  }, [splitViewSnapshot, splitViewId]);

  return (
    <>
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
        <h1 className="text-lg font-semibold flex-1">
          {splitViewId ? 'Manage split view' : 'New split view'}
        </h1>
      </header>

      {splitViewIsLoading && <LinearProgress />}
      {submitted.isSubmitted &&
        (isInvalidForm() || isOriginDestinationSame()) && (
          <Alert severity="error" className="m-3">
            {isInvalidForm()
              ? 'Please complete the form'
              : 'Origin and destination must be different'}
          </Alert>
        )}

      <SingleViewCard
        title="Left view"
        onSelect={(s, t) => handleSelect(s, t, ViewLocation.Left)}
        view={leftView as IView}
      />
      <SingleViewCard
        title="Right view"
        onSelect={(s, t) => handleSelect(s, t, ViewLocation.Right)}
        view={rightView as IView}
      />

      <div className="flex items-center gap-2 p-4">
        {splitViewId && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-error/20 text-error text-sm font-medium"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-border text-white/60 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading.isLoading || splitViewIsLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50"
          >
            {loading.isLoading && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Save
          </button>
        </div>
      </div>
    </>
  );
}
