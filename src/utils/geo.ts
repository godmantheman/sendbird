import { LocationPoint } from '../types';

// Preset locations in Korea with calibrated lat/long and 2D map projection coordinates (0-100 range)
export const KOREA_LOCATIONS: LocationPoint[] = [
  {
    id: 'seoul',
    name: '서울특별시 (Seoul)',
    region: '수도권',
    lat: 37.5665,
    lng: 126.978,
    mapX: 37.5,
    mapY: 26.5,
    landmarks: ['남산 서울타워', '한강 물줄기', '북한산 자락'],
  },
  {
    id: 'busan',
    name: '부산광역시 (Busan)',
    region: '영남권',
    lat: 35.1796,
    lng: 129.0756,
    mapX: 78.5,
    mapY: 76.5,
    landmarks: ['해운대 해안선', '광안대교 상공', '금정산성'],
  },
  {
    id: 'jeju',
    name: '제주특별자치도 (Jeju)',
    region: '제주권',
    lat: 33.4996,
    lng: 126.5312,
    mapX: 28.5,
    mapY: 94.0,
    landmarks: ['한라산 백록담', '성산일출봉', '에메랄드빛 남해'],
  },
  {
    id: 'gangneung',
    name: '강릉시 (Gangneung)',
    region: '영동권',
    lat: 37.7519,
    lng: 128.8761,
    mapX: 74.0,
    mapY: 24.0,
    landmarks: ['경포호 잔물결', '대관령 풍력단지', '동해 푸른 바다'],
  },
  {
    id: 'daegu',
    name: '대구광역시 (Daegu)',
    region: '영남권',
    lat: 35.8714,
    lng: 128.6014,
    mapX: 68.0,
    mapY: 62.0,
    landmarks: ['팔공산 갓바위', '신천 물길', '달구벌 분지'],
  },
  {
    id: 'daejeon',
    name: '대전광역시 (Daejeon)',
    region: '충청권',
    lat: 36.3504,
    lng: 127.3845,
    mapX: 45.0,
    mapY: 49.0,
    landmarks: ['갑천 호수', '계룡산 능선', '엑스포 한빛탑'],
  },
  {
    id: 'gwangju',
    name: '광주광역시 (Gwangju)',
    region: '호남권',
    lat: 35.1595,
    lng: 126.8526,
    mapX: 34.0,
    mapY: 74.0,
    landmarks: ['무등산 서석대', '영산강 은빛 갈대', '빛고을 도심'],
  },
  {
    id: 'jeonju',
    name: '전주시 (Jeonju)',
    region: '호남권',
    lat: 35.8242,
    lng: 127.148,
    mapX: 40.5,
    mapY: 60.5,
    landmarks: ['전주 한옥마을 처마', '모악산 줄기', '만경강 들녘'],
  },
  {
    id: 'sokcho',
    name: '속초시 (Sokcho)',
    region: '영동권',
    lat: 38.207,
    lng: 128.5918,
    mapX: 69.0,
    mapY: 15.0,
    landmarks: ['설악산 울산바위', '청초호', '영금정 파도'],
  },
  {
    id: 'dokdo',
    name: '독도 / 울릉도 (Dokdo)',
    region: '동해권',
    lat: 37.2408,
    lng: 131.8696,
    mapX: 96.5,
    mapY: 33.0,
    landmarks: ['동도와 서도 암벽', '괭이갈매기 서식지', '청정 심해 해역'],
  },
  {
    id: 'yeosu',
    name: '여수시 (Yeosu)',
    region: '남해안',
    lat: 34.7604,
    lng: 127.6622,
    mapX: 51.0,
    mapY: 83.5,
    landmarks: ['여수 밤바다', '돌산대교 조명', '오동도 동백숲'],
  },
  {
    id: 'chuncheon',
    name: '춘천시 (Chuncheon)',
    region: '강원권',
    lat: 37.8813,
    lng: 127.7298,
    mapX: 52.0,
    mapY: 20.0,
    landmarks: ['의암호 물안개', '소양강 댐', '청평사 숲길'],
  },
];

/**
 * Calculates great-circle distance between two points using the Haversine formula
 * Returns distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Carrier pigeon average sustained cruising speed: ~65 km/h
 * Returns estimated hours of continuous flight
 */
export function estimatePigeonFlightHours(distanceKm: number): number {
  const averagePigeonSpeedKmh = 65; // ~60-70 km/h
  return Math.round((distanceKm / averagePigeonSpeedKmh) * 10) / 10;
}

/**
 * Interpolates point along a quadratic bezier curve for realistic flight arc
 * Progress t is between 0 and 1
 */
export function getBezierPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const oneMinusT = 1 - t;
  const x =
    oneMinusT * oneMinusT * p0.x +
    2 * oneMinusT * t * p1.x +
    t * t * p2.x;
  const y =
    oneMinusT * oneMinusT * p0.y +
    2 * oneMinusT * t * p1.y +
    t * t * p2.y;
  return { x, y };
}

/**
 * Computes flight control point with an altitude bulge arching towards the north/sky
 */
export function getFlightControlPoint(
  start: LocationPoint,
  dest: LocationPoint
): { x: number; y: number } {
  const midX = (start.mapX + dest.mapX) / 2;
  const midY = (start.mapY + dest.mapY) / 2;

  // Add an arc offset perpendicular to flight path (lift above mountains)
  const dx = dest.mapX - start.mapX;
  const dy = dest.mapY - start.mapY;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Offset arc upwards (towards lower Y or slight curve)
  const arcLift = Math.min(18, Math.max(6, len * 0.22));
  return {
    x: midX - (dy / (len || 1)) * (arcLift * 0.4),
    y: midY - arcLift,
  };
}

/**
 * Identifies contextual landmark or atmospheric status based on flight progress
 */
export function getAtmosphericWaypointStatus(
  start: LocationPoint,
  dest: LocationPoint,
  progress: number
): { landmark: string; altitude: number; windSpeed: number; windDir: string } {
  // Flight altitude profile: climb, cruise, descend
  let altitude = 320;
  if (progress < 0.2) {
    altitude = Math.round(150 + progress * 5 * 350); // climb to 500m
  } else if (progress > 0.8) {
    altitude = Math.round(500 - (progress - 0.8) * 5 * 400); // descend to 100m
  } else {
    // Cruise altitude with gentle mountain air currents
    altitude = Math.round(480 + Math.sin(progress * Math.PI * 4) * 60);
  }

  const windSpeed = Math.round(12 + Math.sin(progress * 10) * 6);
  const windDir = progress > 0.5 ? '북서풍(순풍)' : '서풍(측풍)';

  if (progress < 0.08) {
    return {
      landmark: `${start.name} 우체국 상공을 힘차게 박차고 이륙`,
      altitude,
      windSpeed,
      windDir,
    };
  }
  if (progress < 0.25) {
    return {
      landmark: start.landmarks?.[0] || '도시 외곽 산기슭 상공 순항',
      altitude,
      windSpeed,
      windDir,
    };
  }
  if (progress < 0.5) {
    return {
      landmark: '소백산맥과 은빛 강줄기를 따라 구름길 횡단',
      altitude,
      windSpeed,
      windDir,
    };
  }
  if (progress < 0.75) {
    return {
      landmark: '안정적인 상승 기류를 타고 목적지 방면으로 활공',
      altitude,
      windSpeed,
      windDir,
    };
  }
  if (progress < 0.95) {
    return {
      landmark: dest.landmarks?.[0] || `${dest.name} 경계선 진입`,
      altitude,
      windSpeed,
      windDir,
    };
  }

  return {
    landmark: `${dest.name} 수신처 착륙 준비 중`,
    altitude,
    windSpeed,
    windDir,
  };
}
