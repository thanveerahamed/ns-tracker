import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import SplitViewTimeLineView from '../../components/splitView/SplitViewTimeLineView.tsx';
import { Alert } from '../../components/ui/alert.tsx';
import { LinearProgress } from '../../components/ui/progress.tsx';

import { auth } from '../../services/firebase.ts';
import { useSplitView } from '../../services/splitView.ts';
import { ISplitView, ISplitViewWithId } from '../../types/splitView.ts';

export default function SplitViewDashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [snapshots, isLoading, error] = useSplitView(user?.uid);

  const splitViews = useMemo(
    () =>
      snapshots?.docs.map(
        (doc) =>
          ({
            ...(doc.data() as ISplitView),
            id: doc.id,
          }) as ISplitViewWithId,
      ) ?? [],
    [snapshots],
  );

  useEffect(() => {
    const opened = splitViews.find((x) => x.opened);
    if (opened) navigate(`/splitview/tripsInformation/${opened.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitViews]);

  return (
    <>
      <header
        className="flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
          background: 'rgba(20,20,20,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <h1 className="text-[17px] font-semibold flex-1">Split View</h1>
        {splitViews.length > 0 && (
          <button
            onClick={() => navigate('/splitview/form')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            <Plus size={18} />
          </button>
        )}
      </header>

      {error && (
        <Alert severity="error" className="m-3">
          Unable to display results now!
        </Alert>
      )}
      {isLoading && <LinearProgress />}

      <div className="p-3 space-y-2.5">
        {!isLoading && splitViews.length === 0 && (
          <button
            onClick={() => navigate('/splitview/form')}
            className="w-full py-8 rounded-2xl border border-dashed border-white/10 text-white/30 hover:border-primary/30 hover:text-white/50 text-sm transition-colors flex flex-col items-center justify-center gap-2"
          >
            <Plus size={20} className="opacity-50" />
            <span>Create split view</span>
          </button>
        )}
        {splitViews.map((sv) => (
          <div
            key={sv.id}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(28,28,28,0.9) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="flex cursor-pointer"
              onClick={() => navigate(`/splitview/tripsInformation/${sv.id}`)}
            >
              <div className="flex-1">
                <SplitViewTimeLineView
                  from={sv.view1.origin.namen.lang}
                  to={sv.view1.destination.namen.lang}
                />
              </div>
              <div className="w-px bg-border self-stretch" />
              <div className="flex-1">
                <SplitViewTimeLineView
                  from={sv.view2.origin.namen.lang}
                  to={sv.view2.destination.namen.lang}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-3 py-2 border-t border-border">
              <button
                onClick={() => navigate(`/splitview/tripsInformation/${sv.id}`)}
                className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium"
              >
                View
              </button>
              <button
                onClick={() => navigate(`/splitview/form?id=${sv.id}`)}
                className="text-xs px-3 py-1 rounded-full border border-border text-white/60"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
