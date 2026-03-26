import { Train } from 'lucide-react';
import React, { Fragment } from 'react';

import { Leg } from '../../types/trip.ts';
import {
  getPaletteColorFromNesProperties,
  isInValidLeg,
} from '../../utils/trips.ts';
import CrowdForecast from '../CrowdForecast.tsx';
import LegShowMore from '../LegShowMore.tsx';
import { StyledDivider } from '../StyledDivider.tsx';
import Track from '../Track.tsx';
import TripTiming from '../TripTiming.tsx';

export default function LegTimeLineItem({
  legs,
  leg,
  index,
}: {
  legs: Leg[];
  leg: Leg;
  index: number;
}) {
  const isValid = !isInValidLeg(leg);
  const prevIsValid = index === 0 || !isInValidLeg(legs[index - 1]);

  const dotColor =
    !isValid || (index > 0 && !prevIsValid)
      ? 'bg-error border-error/50'
      : 'bg-primary border-primary/50';

  const lineColor = isValid ? 'bg-primary/60' : 'bg-error/60';

  return (
    <div className="relative flex gap-4 mb-4">
      {/* Timeline dot + connector */}
      <div className="flex flex-col items-center z-10 shrink-0">
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${dotColor}`}
        >
          <Train size={12} className="text-white" />
        </div>
        <div
          className={`w-0.5 flex-1 mt-1 ${lineColor}`}
          style={{ minHeight: 40 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {index > 0 && (
              <TripTiming
                location={legs[index - 1].destination}
                direction="row"
                className="text-xs text-white/50"
              />
            )}
            <TripTiming
              location={leg.origin}
              direction="row"
              className="text-sm font-medium"
            />
            <p
              className={`text-sm font-medium ${
                isValid ? 'text-primary' : 'text-error'
              }`}
            >
              {leg.origin.name}
            </p>
            {index > 0 && (
              <>
                {leg.destination.exitSide && (
                  <p className="text-xs text-white/50">
                    Exit: {leg.destination.exitSide}
                  </p>
                )}
                {leg.transferMessages?.map((msg, i) => (
                  <React.Fragment key={i}>
                    <p
                      className="text-xs"
                      style={{
                        color: getPaletteColorFromNesProperties(
                          msg.messageNesProperties,
                        ),
                      }}
                    >
                      {msg.message}
                    </p>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
          <div className="flex flex-col gap-1 items-end shrink-0">
            {index > 0 && (
              <Track
                plannedTrack={legs[index - 1].destination.plannedTrack}
                actualTrack={legs[index - 1].destination.actualTrack}
              />
            )}
            <Track
              plannedTrack={leg.origin.plannedTrack}
              actualTrack={leg.origin.actualTrack}
            />
          </div>
        </div>

        <StyledDivider />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{leg.product.displayName}</p>
            <p className="text-xs text-white/50">to {leg.direction}</p>
            {leg.notes?.find((n) => n.value === 'Supplement') && (
              <p className="text-xs text-error">Supplement required</p>
            )}
          </div>
          <CrowdForecast crowdForecast={leg.crowdForecast} />
        </div>

        <StyledDivider />

        {leg.messages?.map((msg, i) => (
          <Fragment key={i}>
            <p
              className="text-xs"
              style={{
                color: getPaletteColorFromNesProperties(msg.nesProperties),
              }}
            >
              {msg.text ?? msg.head}
            </p>
            <StyledDivider />
          </Fragment>
        ))}

        <LegShowMore leg={leg} />
      </div>
    </div>
  );
}
