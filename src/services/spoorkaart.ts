import ky from 'ky'

const API_KEY = import.meta.env.VITE_NS_OCP_APIM_KEY as string
const SPOORKAART_URL =
  'https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/spoorkaart'

/* ─── Types ─── */

interface SpoorkaartFeature {
  type: 'Feature'
  geometry: {
    type: 'LineString'
    coordinates: [number, number][] // [lng, lat]
  }
  properties: {
    from: string // lowercase station code, e.g. "hvs"
    to: string
  }
}

interface SpoorkaartResponse {
  payload: {
    type: 'FeatureCollection'
    features: SpoorkaartFeature[]
  }
}

/** Adjacency graph: stationCode → Map<neighborCode, trackCoordinates> */
export type TrackGraph = Map<string, Map<string, [number, number][]>>

/** Station code → its position [lng, lat] */
export type StationPositions = Map<string, [number, number]>

export interface SpoorkaartData {
  graph: TrackGraph
  positions: StationPositions
}

/* ─── Fetch ─── */

/**
 * Fetch the entire Dutch railway track network from the NS Spoorkaart API.
 * Returns ~700 track segments with detailed curve-following coordinates.
 * The response is ~800 KB and rarely changes — cache aggressively.
 */
export async function fetchSpoorkaart(): Promise<SpoorkaartData> {
  const response = await ky
    .get(SPOORKAART_URL, {
      headers: {
        'Ocp-Apim-Subscription-Key': API_KEY,
        Accept: 'application/json',
      },
      timeout: 30_000,
    })
    .json<SpoorkaartResponse>()

  const features = response.payload.features
  return {
    graph: buildTrackGraph(features),
    positions: buildStationPositions(features),
  }
}

/* ─── Graph construction ─── */

/**
 * Build a bidirectional adjacency graph from the Spoorkaart features.
 * Each edge stores the track coordinates in the correct direction.
 */
function buildTrackGraph(features: SpoorkaartFeature[]): TrackGraph {
  const graph: TrackGraph = new Map()

  for (const feature of features) {
    const from = feature.properties.from
    const to = feature.properties.to
    const coords = feature.geometry.coordinates as [number, number][]

    // Forward: from → to
    if (!graph.has(from)) graph.set(from, new Map())
    graph.get(from)!.set(to, coords)

    // Reverse: to → from (reversed coordinates)
    if (!graph.has(to)) graph.set(to, new Map())
    graph.get(to)!.set(from, [...coords].reverse())
  }

  return graph
}

/**
 * Build a station code → [lng, lat] position lookup.
 * Uses the first/last coordinate of each segment as the station position.
 */
function buildStationPositions(
  features: SpoorkaartFeature[],
): StationPositions {
  const positions: StationPositions = new Map()

  for (const feature of features) {
    const coords = feature.geometry.coordinates
    if (!positions.has(feature.properties.from)) {
      positions.set(feature.properties.from, coords[0] as [number, number])
    }
    if (!positions.has(feature.properties.to)) {
      positions.set(
        feature.properties.to,
        coords[coords.length - 1] as [number, number],
      )
    }
  }

  return positions
}

/* ─── Coordinate → station code lookup ─── */

/**
 * Find the nearest station code in the Spoorkaart data for a given coordinate.
 * Uses simple Euclidean distance (good enough at Dutch latitudes).
 *
 * Returns null if no station is within ~2 km.
 */
export function findNearestStationCode(
  positions: StationPositions,
  lng: number,
  lat: number,
): string | null {
  let bestCode: string | null = null
  let bestDist = Infinity

  for (const [code, [sLng, sLat]] of positions) {
    const dLng = lng - sLng
    const dLat = lat - sLat
    const dist = dLng * dLng + dLat * dLat
    if (dist < bestDist) {
      bestDist = dist
      bestCode = code
    }
  }

  // ~0.02° ≈ 2 km — reject if too far (not a railway station in the network)
  if (bestDist > 0.02 * 0.02) return null

  return bestCode
}

/* ─── Pathfinding ─── */

/**
 * Find the track-following coordinates between two stations using BFS.
 *
 * @param graph - The Spoorkaart adjacency graph
 * @param fromCode - Origin station code (case-insensitive)
 * @param toCode - Destination station code (case-insensitive)
 * @returns Array of [lng, lat] coordinates following the track, or null if no path exists
 */
export function getTrackCoords(
  graph: TrackGraph,
  fromCode: string,
  toCode: string,
): [number, number][] | null {
  const from = fromCode.toLowerCase()
  const to = toCode.toLowerCase()

  if (from === to) return null
  if (!graph.has(from) || !graph.has(to)) return null

  // BFS for shortest path (fewest track segments)
  const visited = new Set<string>([from])
  const queue: { node: string; path: string[] }[] = [
    { node: from, path: [from] },
  ]

  while (queue.length > 0) {
    const current = queue.shift()!
    const neighbors = graph.get(current.node)
    if (!neighbors) continue

    for (const [neighbor] of neighbors) {
      if (visited.has(neighbor)) continue

      const newPath = [...current.path, neighbor]
      if (neighbor === to) {
        return concatenateSegments(graph, newPath)
      }

      visited.add(neighbor)
      queue.push({ node: neighbor, path: newPath })
    }
  }

  return null // No path found
}

/**
 * Concatenate track coordinates along a sequence of station codes.
 * Skips duplicate junction points between consecutive segments.
 */
function concatenateSegments(
  graph: TrackGraph,
  path: string[],
): [number, number][] {
  const result: [number, number][] = []

  for (let i = 0; i < path.length - 1; i++) {
    const segCoords = graph.get(path[i])?.get(path[i + 1])
    if (!segCoords || segCoords.length === 0) return []

    if (i === 0) {
      result.push(...segCoords)
    } else {
      // Skip first point — it overlaps with the last point of the previous segment
      result.push(...segCoords.slice(1))
    }
  }

  return result
}
