/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Spin, Typography } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';
import QuotaUnitField from '../../../components/settings/QuotaUnitField';

const defaultInputs = {
  'checkin_setting.enabled': false,
  'checkin_setting.min_quota': 1000,
  'checkin_setting.max_quota': 10000,
  // 签到最小值和最大值允许使用不同展示单位，但保存时仍统一落成 quota。
  'checkin_setting.min_quota_unit': 'TOKENS',
  'checkin_setting.max_quota_unit': 'TOKENS',
};

export default function SettingsCheckin(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState(defaultInputs);
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);

  const quotaPerUnit = props.options?.QuotaPerUnit;
  const usdExchangeRate = props.options?.USDExchangeRate;

  function handleFieldChange(fieldName) {
    return (value) => {
      setInputs((inputs) => ({ ...inputs, [fieldName]: value }));
    };
  }

  function onSubmit() {
    const updateArray = compareObjects(inputs, inputsRow);
    if (!updateArray.length) return showWarning(t('你似乎并没有修改什么'));
    const requestQueue = updateArray.map((item) => {
      let value = '';
      if (typeof inputs[item.key] === 'boolean') {
        value = String(inputs[item.key]);
      } else {
        value = String(inputs[item.key]);
      }
      return API.put('/api/option/', {
        key: item.key,
        value,
      });
    });
    setLoading(true);
    Promise.all(requestQueue)
      .then((res) => {
        if (requestQueue.length === 1) {
          if (res.includes(undefined)) return;
        } else if (requestQueue.length > 1) {
          if (res.includes(undefined))
            return showError(t('部分保存失败，请重试'));
        }
        showSuccess(t('保存成功'));
        props.refresh();
      })
      .catch(() => {
        showError(t('保存失败，请重试'));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const currentInputs = { ...defaultInputs };
    for (let key in props.options) {
      if (Object.keys(defaultInputs).includes(key)) {
        currentInputs[key] =
          typeof defaultInputs[key] === 'boolean'
            ? props.options[key] === 'true' || props.options[key] === true
            : props.options[key];
      }
    }
    // 回填时把“数值 + 单位”一起恢复，避免刷新后只剩 quota 原值看不懂。
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current?.setValues(currentInputs);
  }, [props.options]);

  return (
    <>
      <Spin spinning={loading}>
        <Form
          values={inputs}
          getFormApi={(formAPI) => (refForm.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('签到设置')}>
            <Typography.Text
              type='tertiary'
              style={{ marginBottom: 16, display: 'block' }}
            >
              {t('签到功能允许用户每日签到获取随机额度奖励')}
            </Typography.Text>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <Form.Switch
                  field={'checkin_setting.enabled'}
                  label={t('启用签到功能')}
                  size='default'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={handleFieldChange('checkin_setting.enabled')}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <QuotaUnitField
                  label={t('签到最小额度')}
                  value={inputs['checkin_setting.min_quota']}
                  unit={inputs['checkin_setting.min_quota_unit']}
                  quotaPerUnit={quotaPerUnit}
                  usdExchangeRate={usdExchangeRate}
                  placeholder={t('签到奖励的最小额度')}
                  onValueChange={(value) =>
                    setInputs((current) => ({
                      ...current,
                      'checkin_setting.min_quota': String(value),
                    }))
                  }
                  onUnitChange={(value) =>
                    setInputs((current) => ({
                      ...current,
                      'checkin_setting.min_quota_unit': value,
                    }))
                  }
                  min={0}
                  disabled={!inputs['checkin_setting.enabled']}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <QuotaUnitField
                  label={t('签到最大额度')}
                  value={inputs['checkin_setting.max_quota']}
                  unit={inputs['checkin_setting.max_quota_unit']}
                  quotaPerUnit={quotaPerUnit}
                  usdExchangeRate={usdExchangeRate}
                  placeholder={t('签到奖励的最大额度')}
                  onValueChange={(value) =>
                    setInputs((current) => ({
                      ...current,
                      'checkin_setting.max_quota': String(value),
                    }))
                  }
                  onUnitChange={(value) =>
                    setInputs((current) => ({
                      ...current,
                      'checkin_setting.max_quota_unit': value,
                    }))
                  }
                  min={0}
                  disabled={!inputs['checkin_setting.enabled']}
                />
              </Col>
            </Row>
            <Row>
              <Button size='default' onClick={onSubmit}>
                {t('保存签到设置')}
              </Button>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </>
  );
}
