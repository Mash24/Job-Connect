import { groupByDate, comparePeriods, filterByPeriod, calculateTotal, formatRelativeTime } from '../../lib/utils';

describe('groupByDate', () => {
  it('should group Firestore docs by date correctly', () => {
    const mockDocs = [
      { createdAt: { toDate: () => new Date('2024-01-01') } },
      { createdAt: { toDate: () => new Date('2024-01-01') } },
      { createdAt: { toDate: () => new Date('2024-01-02') } },
      { createdAt: { toDate: () => new Date('2024-01-03') } },
    ];

    const result = groupByDate(mockDocs, 'createdAt');
    
    expect(result).toEqual([
      { date: '2024-01-01', count: 2 },
      { date: '2024-01-02', count: 1 },
      { date: '2024-01-03', count: 1 },
    ]);
  });

  it('should handle string dates', () => {
    const mockDocs = [
      { createdAt: '2024-01-01T10:00:00Z' },
      { createdAt: '2024-01-01T15:00:00Z' },
      { createdAt: '2024-01-02T12:00:00Z' },
    ];

    const result = groupByDate(mockDocs, 'createdAt');
    
    expect(result).toEqual([
      { date: '2024-01-01', count: 2 },
      { date: '2024-01-02', count: 1 },
    ]);
  });

  it('should return empty array for invalid data', () => {
    const result = groupByDate([], 'createdAt');
    expect(result).toEqual([]);
  });
});

describe('comparePeriods', () => {
  it('should calculate positive percentage change', () => {
    const result = comparePeriods(120, 100);
    expect(result).toEqual({
      change: 20,
      percentage: 20,
      trend: 'up'
    });
  });

  it('should calculate negative percentage change', () => {
    const result = comparePeriods(80, 100);
    expect(result).toEqual({
      change: 20,
      percentage: 20,
      trend: 'down'
    });
  });

  it('should handle zero previous value', () => {
    const result = comparePeriods(50, 0);
    expect(result).toEqual({
      change: 50,
      percentage: 100,
      trend: 'up'
    });
  });
});

describe('filterByPeriod', () => {
  const mockData = [
    { date: '2024-01-01', count: 1 },
    { date: '2024-01-15', count: 2 },
    { date: '2024-01-30', count: 3 },
    { date: '2024-02-15', count: 4 },
  ];

  it('should return all data for "all" period', () => {
    const result = filterByPeriod(mockData, 'all');
    expect(result).toEqual(mockData);
  });

  it('should filter data for 7 days', () => {
    // Mock current date to 2024-02-15
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-02-15'));
    
    const result = filterByPeriod(mockData, '7d');
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-02-15');
    
    jest.useRealTimers();
  });
});

describe('calculateTotal', () => {
  it('should sum all counts correctly', () => {
    const data = [
      { date: '2024-01-01', count: 5 },
      { date: '2024-01-02', count: 10 },
      { date: '2024-01-03', count: 15 },
    ];
    
    const result = calculateTotal(data);
    expect(result).toBe(30);
  });

  it('should return 0 for empty data', () => {
    const result = calculateTotal([]);
    expect(result).toBe(0);
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should format seconds correctly', () => {
    jest.setSystemTime(new Date('2024-01-01T12:00:30Z'));
    const result = formatRelativeTime(new Date('2024-01-01T12:00:25Z'));
    expect(result).toBe('5s ago');
  });

  it('should format minutes correctly', () => {
    jest.setSystemTime(new Date('2024-01-01T12:05:00Z'));
    const result = formatRelativeTime(new Date('2024-01-01T12:03:00Z'));
    expect(result).toBe('2m ago');
  });

  it('should format hours correctly', () => {
    jest.setSystemTime(new Date('2024-01-01T14:00:00Z'));
    const result = formatRelativeTime(new Date('2024-01-01T12:00:00Z'));
    expect(result).toBe('2h ago');
  });
}); 