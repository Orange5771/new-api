import { getCurrencyConfig } from './render';

export const QUOTA_UNIT_OPTIONS = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'CNY (¥)', value: 'CNY' },
  { label: 'Tokens', value: 'TOKENS' },
];

// 仅允许有限的展示单位，旧配置或非法值统一回退到内部原生 Tokens。
export const normalizeQuotaUnit = (unit) => {
  return ['USD', 'CNY', 'TOKENS'].includes(unit) ? unit : 'TOKENS';
};

const getStoredUsdExchangeRate = () => {
  try {
    const statusStr = localStorage.getItem('status');
    if (!statusStr) {
      return 1;
    }
    const status = JSON.parse(statusStr);
    const rate = Number(status?.usd_exchange_rate);
    return Number.isFinite(rate) && rate > 0 ? rate : 1;
  } catch (error) {
    return 1;
  }
};

const normalizePositiveNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

export const getQuotaPerUnit = () => {
  const raw = parseFloat(localStorage.getItem('quota_per_unit') || '1');
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
};

// 将系统内部 quota 换算成指定展示单位。
// 注意：这里只负责管理后台编辑态的换算，最终落库仍然保存 quota。
export const quotaToAmountByUnit = (quota, unit, options = {}) => {
  const q = Number(quota || 0);
  if (!Number.isFinite(q) || q === 0) return 0;

  const normalizedUnit = normalizeQuotaUnit(unit);
  const quotaPerUnit = normalizePositiveNumber(
    options.quotaPerUnit,
    getQuotaPerUnit(),
  );
  const usdExchangeRate = normalizePositiveNumber(
    options.usdExchangeRate,
    getStoredUsdExchangeRate(),
  );

  if (normalizedUnit === 'TOKENS') {
    return q;
  }

  const usd = q / quotaPerUnit;
  if (normalizedUnit === 'USD') {
    return usd;
  }
  return usd * usdExchangeRate;
};

// 将管理员输入的展示金额换回内部 quota，避免后端配置语义被单位切换影响。
export const amountToQuotaByUnit = (amount, unit, options = {}) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value) || value <= 0) return 0;

  const normalizedUnit = normalizeQuotaUnit(unit);
  const quotaPerUnit = normalizePositiveNumber(
    options.quotaPerUnit,
    getQuotaPerUnit(),
  );
  const usdExchangeRate = normalizePositiveNumber(
    options.usdExchangeRate,
    getStoredUsdExchangeRate(),
  );

  if (normalizedUnit === 'TOKENS') {
    return Math.round(value);
  }

  const usd = normalizedUnit === 'USD' ? value : value / usdExchangeRate;
  return Math.round(usd * quotaPerUnit);
};

export const quotaToDisplayAmount = (quota) => {
  const q = Number(quota || 0);
  if (!Number.isFinite(q) || q <= 0) return 0;
  const { type, rate } = getCurrencyConfig();
  if (type === 'TOKENS') return q;
  const usd = q / getQuotaPerUnit();
  if (type === 'USD') return usd;
  return usd * (rate || 1);
};

export const displayAmountToQuota = (amount) => {
  const val = Number(amount || 0);
  if (!Number.isFinite(val) || val <= 0) return 0;
  const { type, rate } = getCurrencyConfig();
  if (type === 'TOKENS') return Math.round(val);
  const usd = type === 'USD' ? val : val / (rate || 1);
  return Math.round(usd * getQuotaPerUnit());
};
