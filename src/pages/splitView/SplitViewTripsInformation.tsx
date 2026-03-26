import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import ClockLoader from '../../components/loaders/ClockLoader.tsx';
import SplitViewTripInfoViewCard from '../../components/splitView/SplitViewTripInfoViewCard.tsx';

import { auth } from '../../services/firebase.ts';
import {
  toggleSplitViewOpened,
  useSplitViewDocument,
} from '../../services/splitView.ts';
import { ISplitViewWithId } from '../../types/splitView.ts';

export default function SplitViewTripsInformation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [splitViewDocument, splitViewIsLoading] = useSplitViewDocument(
    id ?? undefined,
    user?.uid,
  );

  const splitView: ISplitViewWithId = {
    ...splitViewDocument,
    id,
  } as ISplitViewWithId;

  const handleBack = () => {
    if (user?.uid && id)
      toggleSplitViewOpened(user.uid, id, false).then(() => {});
    navigate('/splitview');
  };

  useEffect(() => {
    if (user?.uid && id)
      toggleSplitViewOpened(user.uid, id, true).then(() => {});
  }, [id, user?.uid]);

  if (splitViewIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClockLoader />
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
        <button
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold">Split view</h1>
      </header>

      <div className="flex h-[calc(100vh-52px)]">
        <div className="flex-1 overflow-hidden border-r border-border">
          <SplitViewTripInfoViewCard
            view={splitView.view1}
            splitViewId={splitView.id}
            viewType="view1"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <SplitViewTripInfoViewCard
            view={splitView.view2}
            splitViewId={splitView.id}
            viewType="view2"
          />
        </div>
      </div>
    </>
  );
}
