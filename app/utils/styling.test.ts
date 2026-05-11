import {
  getSeverityClass,
  getStatusClass,
  getPassengersAffectedClass,
  getPassengersAffectedLabel,
  getIssueTypeIcon,
  getIssueTypeLabel,
  getStockLevelClass,
  getStockLevelLabel,
  getProgressBarClass,
  formatPercentage,
  truncateText,
} from './styling';

describe('getSeverityClass', () => {
  it('returns severity-low for low', () => {
    expect(getSeverityClass('low')).toBe('severity-low');
  });

  it('returns severity-medium for medium', () => {
    expect(getSeverityClass('medium')).toBe('severity-medium');
  });

  it('returns severity-high for high', () => {
    expect(getSeverityClass('high')).toBe('severity-high');
  });
});

describe('getStatusClass', () => {
  it('returns status-open for open', () => {
    expect(getStatusClass('open')).toBe('status-open');
  });

  it('returns status-resolved for resolved', () => {
    expect(getStatusClass('resolved')).toBe('status-resolved');
  });
});

describe('getPassengersAffectedClass', () => {
  it('returns gray for NA', () => {
    expect(getPassengersAffectedClass('NA')).toBe('bg-gray-100 text-gray-700');
  });

  it('returns green for 0-10', () => {
    expect(getPassengersAffectedClass('0-10')).toBe('bg-green-100 text-green-700');
  });

  it('returns yellow for 10-25', () => {
    expect(getPassengersAffectedClass('10-25')).toBe('bg-yellow-100 text-yellow-700');
  });

  it('returns orange for 25-50', () => {
    expect(getPassengersAffectedClass('25-50')).toBe('bg-orange-100 text-orange-700');
  });

  it('returns red for 50-75', () => {
    expect(getPassengersAffectedClass('50-75')).toBe('bg-red-100 text-red-700');
  });

  it('returns darker red for 75-100', () => {
    expect(getPassengersAffectedClass('75-100')).toBe('bg-red-200 text-red-800');
  });
});

describe('getPassengersAffectedLabel', () => {
  it('returns "No PAX Impact" for NA', () => {
    expect(getPassengersAffectedLabel('NA')).toBe('No PAX Impact');
  });

  it('returns formatted percentage for ranges', () => {
    expect(getPassengersAffectedLabel('0-10')).toBe('0-10% PAX');
    expect(getPassengersAffectedLabel('50-75')).toBe('50-75% PAX');
    expect(getPassengersAffectedLabel('75-100')).toBe('75-100% PAX');
  });
});

describe('getIssueTypeIcon', () => {
  it('returns correct icon class for each issue type', () => {
    expect(getIssueTypeIcon('misplacement')).toBe('ri-map-pin-line');
    expect(getIssueTypeIcon('damage')).toBe('ri-tools-line');
    expect(getIssueTypeIcon('missing')).toBe('ri-error-warning-line');
    expect(getIssueTypeIcon('monetary-consumption')).toBe('ri-money-dollar-circle-line');
    expect(getIssueTypeIcon('customer-impact')).toBe('ri-user-heart-line');
    expect(getIssueTypeIcon('other')).toBe('ri-question-line');
  });
});

describe('getIssueTypeLabel', () => {
  it('returns correct label for each issue type', () => {
    expect(getIssueTypeLabel('misplacement')).toBe('Item Misplacement');
    expect(getIssueTypeLabel('damage')).toBe('Damage/Broken');
    expect(getIssueTypeLabel('missing')).toBe('Missing Item');
    expect(getIssueTypeLabel('monetary-consumption')).toBe('Monetary Consumption');
    expect(getIssueTypeLabel('customer-impact')).toBe('Customer Impact');
    expect(getIssueTypeLabel('other')).toBe('Other Issue');
  });
});

describe('getStockLevelClass', () => {
  it('returns stock-empty for 0', () => {
    expect(getStockLevelClass(0)).toBe('stock-empty');
  });

  it('returns stock-low for 1-25', () => {
    expect(getStockLevelClass(1)).toBe('stock-low');
    expect(getStockLevelClass(25)).toBe('stock-low');
  });

  it('returns stock-medium for 26-50', () => {
    expect(getStockLevelClass(26)).toBe('stock-medium');
    expect(getStockLevelClass(50)).toBe('stock-medium');
  });

  it('returns stock-full for above 50', () => {
    expect(getStockLevelClass(51)).toBe('stock-full');
    expect(getStockLevelClass(100)).toBe('stock-full');
  });
});

describe('getStockLevelLabel', () => {
  it('returns correct label for each range', () => {
    expect(getStockLevelLabel(0)).toBe('Empty');
    expect(getStockLevelLabel(25)).toBe('Low');
    expect(getStockLevelLabel(50)).toBe('Medium');
    expect(getStockLevelLabel(75)).toBe('Good');
    expect(getStockLevelLabel(100)).toBe('Full');
  });
});

describe('getProgressBarClass', () => {
  it('returns progress-low for below 40', () => {
    expect(getProgressBarClass(0)).toBe('progress-low');
    expect(getProgressBarClass(39)).toBe('progress-low');
  });

  it('returns progress-medium for 40-69', () => {
    expect(getProgressBarClass(40)).toBe('progress-medium');
    expect(getProgressBarClass(69)).toBe('progress-medium');
  });

  it('returns progress-full for 70 and above', () => {
    expect(getProgressBarClass(70)).toBe('progress-full');
    expect(getProgressBarClass(100)).toBe('progress-full');
  });
});

describe('formatPercentage', () => {
  it('formats whole number percentages', () => {
    expect(formatPercentage(50)).toBe('50%');
    expect(formatPercentage(100)).toBe('100%');
  });

  it('rounds decimal percentages', () => {
    expect(formatPercentage(33.7)).toBe('34%');
  });

  it('converts decimal (0-1) when asDecimal is true', () => {
    expect(formatPercentage(0.5, true)).toBe('50%');
    expect(formatPercentage(0.337, true)).toBe('34%');
  });
});

describe('truncateText', () => {
  it('returns text unchanged when within limit', () => {
    expect(truncateText('hello', 10)).toBe('hello');
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('truncates text with ellipsis when over limit', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });
});
