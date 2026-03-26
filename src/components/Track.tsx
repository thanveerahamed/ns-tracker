interface Props {
  plannedTrack: string;
  actualTrack?: string;
}

export default function Track({ actualTrack, plannedTrack }: Props) {
  if (actualTrack && actualTrack !== plannedTrack) {
    return (
      <span className="text-xs text-error font-medium">
        Track {actualTrack}
      </span>
    );
  }
  return (
    <span className="text-xs text-primary font-medium">
      Track {plannedTrack}
    </span>
  );
}
