import React, { useMemo } from 'react';
import {
  Form,
  InputGroup,
  InputNumber,
  Select,
  Typography,
} from '@douyinfe/semi-ui';
import {
  amountToQuotaByUnit,
  normalizeQuotaUnit,
  QUOTA_UNIT_OPTIONS,
  quotaToAmountByUnit,
} from '../../helpers/quota';

const { Text } = Typography;

const formatDisplayValue = (value, unit) => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    return '';
  }

  if (normalizeQuotaUnit(unit) === 'TOKENS') {
    return Math.round(number);
  }
  return Number(number.toFixed(6));
};

export default function QuotaUnitField(props) {
  const {
    label,
    value,
    unit,
    onValueChange,
    onUnitChange,
    quotaPerUnit,
    usdExchangeRate,
    placeholder,
    extraText,
    min = 0,
    disabled = false,
  } = props;

  // 当前页面保存的是内部 quota，这里只是在渲染时按所选单位做一次展示换算。
  const currentUnit = normalizeQuotaUnit(unit);
  const displayValue = useMemo(() => {
    return formatDisplayValue(
      quotaToAmountByUnit(value, currentUnit, {
        quotaPerUnit,
        usdExchangeRate,
      }),
      currentUnit,
    );
  }, [currentUnit, quotaPerUnit, usdExchangeRate, value]);

  const handleValueChange = (nextValue) => {
    if (nextValue === null || nextValue === undefined || nextValue === '') {
      onValueChange('0');
      return;
    }
    // 输入框里看到的是 USD/CNY/Tokens，真正保存时统一回写成内部 quota。
    const quota = amountToQuotaByUnit(nextValue, currentUnit, {
      quotaPerUnit,
      usdExchangeRate,
    });
    onValueChange(String(quota));
  };

  return (
    <Form.Slot label={label}>
      <InputGroup style={{ width: '100%' }}>
        <InputNumber
          style={{ width: '70%' }}
          min={min}
          step={currentUnit === 'TOKENS' ? 1 : 0.000001}
          precision={currentUnit === 'TOKENS' ? 0 : 6}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleValueChange}
          disabled={disabled}
        />
        <Select
          style={{ width: '30%' }}
          value={currentUnit}
          onChange={onUnitChange}
          disabled={disabled}
        >
          {QUOTA_UNIT_OPTIONS.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </InputGroup>
      {extraText ? (
        <Text
          type='tertiary'
          size='small'
          style={{ marginTop: 6, display: 'block' }}
        >
          {extraText}
        </Text>
      ) : null}
    </Form.Slot>
  );
}
