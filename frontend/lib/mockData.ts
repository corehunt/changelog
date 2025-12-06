import { Ticket, Entry } from './types';

export const mockTickets: Ticket[] = [
  {
    id: 't1',
    slug: 'auth-system-redesign',
    title: 'Authentication System Redesign',
    status: 'ACTIVE',
    startDate: '2025-11-15',
    background: 'Legacy authentication system was experiencing performance issues at scale. Required complete overhaul to support multi-factor authentication, OAuth providers, and session management with Redis.',
    technologies: ['TypeScript', 'Next.js', 'Redis', 'PostgreSQL', 'OAuth 2.0'],
    isPublic: true,
    learned: 'Deep dive into OAuth 2.0 flows and token rotation strategies. Learned about session management best practices and Redis optimization techniques.',
    roadblocksSummary: 'Initial attempt with JWT-only approach hit scalability issues. Had to pivot to hybrid session + token approach. Redis connection pooling required significant tuning.',
  },
  {
    id: 't2',
    slug: 'realtime-collaboration',
    title: 'Real-time Collaboration Engine',
    status: 'COMPLETED',
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    background: 'Built a real-time collaboration system using WebSockets and operational transforms. Needed to handle concurrent edits, presence indicators, and conflict resolution.',
    technologies: ['WebSocket', 'Node.js', 'Operational Transforms', 'MongoDB'],
    isPublic: true,
    learned: 'Operational transforms are complex but powerful. Understanding CRDT alternatives. WebSocket scaling with Redis pub/sub.',
    roadblocksSummary: 'Conflict resolution edge cases required extensive testing. Network partition handling was more complex than anticipated.',
    metricsSummary: 'Reduced sync latency from 500ms to 50ms. Handled 10K concurrent connections per server instance.',
  },
  {
    id: 't3',
    slug: 'ml-pipeline-infrastructure',
    title: 'ML Pipeline Infrastructure',
    status: 'ACTIVE',
    startDate: '2025-12-01',
    background: 'Setting up infrastructure for training and deploying machine learning models at scale. Focus on reproducibility, monitoring, and CI/CD integration.',
    technologies: ['Python', 'TensorFlow', 'Kubernetes', 'MLflow', 'Docker'],
    isPublic: false,
    learned: 'MLOps is significantly different from traditional DevOps. Model versioning and experiment tracking are critical.',
  },
  {
    id: 't4',
    slug: 'api-gateway-performance',
    title: 'API Gateway Performance Optimization',
    status: 'COMPLETED',
    startDate: '2025-08-01',
    endDate: '2025-09-15',
    background: 'API gateway was becoming a bottleneck. Needed to implement caching, rate limiting, and optimize routing logic.',
    technologies: ['Go', 'Redis', 'Nginx', 'Prometheus'],
    isPublic: true,
    metricsSummary: 'Reduced P95 latency from 200ms to 45ms. Increased throughput by 3.5x.',
  },
];

export const mockEntries: Entry[] = [
  {
    id: 'e1',
    ticketId: 't1',
    date: '2025-11-15',
    title: 'Initial architecture planning',
    body: 'Mapped out the new authentication flow. Decided on hybrid approach with short-lived JWTs and longer-lived refresh tokens stored in Redis. Reviewed OAuth 2.0 spec in detail.',
    technologies: ['OAuth 2.0', 'Redis'],
    isPublic: true,
  },
  {
    id: 'e2',
    ticketId: 't1',
    date: '2025-11-18',
    title: 'Redis session store implementation',
    body: 'Built the Redis session store with proper connection pooling. Implemented automatic session cleanup with TTL. Added monitoring for connection health.',
    technologies: ['Redis', 'TypeScript'],
    isPublic: true,
  },
  {
    id: 'e3',
    ticketId: 't1',
    date: '2025-11-22',
    title: 'OAuth provider integration',
    body: 'Integrated Google and GitHub OAuth providers. Handled callback flows and user profile mapping. Added state parameter validation for security.',
    technologies: ['OAuth 2.0', 'Next.js'],
    isPublic: true,
  },
  {
    id: 'e4',
    ticketId: 't1',
    date: '2025-12-01',
    title: 'MFA implementation started',
    body: 'Working on TOTP-based multi-factor authentication. Researching best practices for backup codes and recovery flows.',
    technologies: ['TOTP', 'PostgreSQL'],
    isPublic: true,
  },
  {
    id: 'e5',
    ticketId: 't2',
    date: '2025-09-01',
    title: 'WebSocket server setup',
    body: 'Set up the WebSocket server infrastructure with proper health checks and reconnection logic. Implemented presence tracking system.',
    technologies: ['WebSocket', 'Node.js'],
    isPublic: true,
  },
  {
    id: 'e6',
    ticketId: 't2',
    date: '2025-09-10',
    title: 'Operational transform implementation',
    body: 'Deep dive into OT algorithms. Implemented basic text transformation functions. Handling concurrent operations is tricky but making progress.',
    technologies: ['Operational Transforms', 'Node.js'],
    isPublic: true,
  },
  {
    id: 'e7',
    ticketId: 't2',
    date: '2025-10-15',
    title: 'Conflict resolution refinement',
    body: 'Spent the day debugging edge cases in conflict resolution. Network partition scenarios required special handling. Added comprehensive test suite.',
    technologies: ['Operational Transforms'],
    isPublic: true,
  },
  {
    id: 'e8',
    ticketId: 't3',
    date: '2025-12-01',
    title: 'Kubernetes cluster setup',
    body: 'Provisioned Kubernetes cluster for ML workloads. Set up GPU node pools and configured resource quotas. Installed MLflow for experiment tracking.',
    technologies: ['Kubernetes', 'MLflow'],
    isPublic: false,
  },
  {
    id: 'e9',
    ticketId: 't3',
    date: '2025-12-03',
    title: 'Training pipeline automation',
    body: 'Built automated training pipeline with versioning. Integrated with CI/CD. Working on model registry and deployment automation.',
    technologies: ['Python', 'Docker', 'MLflow'],
    isPublic: false,
  },
  {
    id: 'e10',
    ticketId: 't4',
    date: '2025-08-05',
    title: 'Performance profiling',
    body: 'Profiled the gateway and identified bottlenecks. Database queries and external API calls were major contributors. Planned caching strategy.',
    technologies: ['Go', 'Prometheus'],
    isPublic: true,
  },
  {
    id: 'e11',
    ticketId: 't4',
    date: '2025-08-20',
    title: 'Redis caching layer',
    body: 'Implemented Redis-based caching with intelligent invalidation. Added cache warming for frequently accessed resources.',
    technologies: ['Redis', 'Go'],
    isPublic: true,
  },
];

export function getTicketBySlug(slug: string): Ticket | undefined {
  return mockTickets.find(t => t.slug === slug);
}

export function getEntriesForTicket(ticketId: string): Entry[] {
  return mockEntries
    .filter(e => e.ticketId === ticketId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getAllEntriesSorted(): Entry[] {
  return [...mockEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTicketById(id: string): Ticket | undefined {
  return mockTickets.find(t => t.id === id);
}
