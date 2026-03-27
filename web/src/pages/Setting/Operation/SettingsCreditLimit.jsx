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
import { Button, Col, Form, Row, Spin } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
} from '../../../helpers';
import QuotaUnitField from '../../../components/settings/QuotaUnitField';
import { normalizeQuotaUnit } from '../../../helpers/quota';

const defaultInputs = {
  QuotaForNewUser: '',
  PreConsumedQuota: '',
  QuotaForInviter: '',
  QuotaForInvitee: '',
  // 各字段单位单独保存，避免管理员切换一个字段时影响其它额度项。
  'quota_setting.new_user_quota_unit': 'TOKENS',
  'quota_setting.pre_consumed_quota_unit': 'TOKENS',
  'quota_setting.inviter_quota_unit': 'TOKENS',
  'quota_setting.invitee_quota_unit': 'TOKENS',
  'quota_setting.enable_free_model_pre_consume': true,
};

export default function SettingsCreditLimit(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState(defaultInputs);
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);

  const quotaPerUnit = props.options?.QuotaPerUnit;
  const usdExchangeRate = props.options?.USDExchangeRate;

  const setFieldValue = (fieldName) => (value) => {
    setInputs((current) => ({
      ...current,
      [fieldName]: String(value),
    }));
  };

  const setFieldUnit = (fieldName) => (value) => {
    setInputs((current) => ({
      ...current,
      [fieldName]: value,
    }));
  };

  const syncLegacyQuotaUnits = async (legacyUnitUpdates) => {
    if (!legacyUnitUpdates.length) return;
    try {
      await Promise.all(
        legacyUnitUpdates.map(({ key, value }) =>
          API.put('/api/option/', { key, value }),
        ),
      );
      props.refresh?.();
    } catch (error) {
      // 这里只是做旧配置自愈，失败不影响页面正常编辑。
    }
  };

  function onSubmit() {
    const updateArray = compareObjects(inputs, inputsRow);
    if (!updateArray.length) return showWarning(t('你似乎并没有修改什么'));
    const requestQueue = updateArray.map((item) => {
      let value = '';
      if (typeof inputs[item.key] === 'boolean') {
        value = String(inputs[item.key]);
      } else {
        value = inputs[item.key];
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
    const legacyUnitUpdates = [];
    for (let key in props.options) {
      if (Object.keys(defaultInputs).includes(key)) {
        if (typeof defaultInputs[key] === 'boolean') {
          currentInputs[key] = props.options[key] === 'true' || props.options[key] === true;
        } else if (key.endsWith('_unit')) {
          const normalizedUnit = normalizeQuotaUnit(props.options[key]);
          currentInputs[key] = normalizedUnit;
          if (normalizedUnit !== props.options[key]) {
            legacyUnitUpdates.push({ key, value: normalizedUnit });
          }
        } else {
          currentInputs[key] = props.options[key];
        }
      }
    }
    // 页面里既要保留内部 quota，又要保留每个字段自己的展示单位，所以统一从 options 回填。
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current?.setValues(currentInputs);
    syncLegacyQuotaUnits(legacyUnitUpdates);
  }, [props.options]);

  return (
    <>
      <Spin spinning={loading}>
        <Form
          values={inputs}
          getFormApi={(formAPI) => (refForm.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('额度设置')}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <QuotaUnitField
                  label={t('新用户初始额度')}
                  value={inputs.QuotaForNewUser}
                  unit={inputs['quota_setting.new_user_quota_unit']}
                  quotaPerUnit={quotaPerUnit}
                  usdExchangeRate={usdExchangeRate}
                  placeholder={''}
                  onValueChange={setFieldValue('QuotaForNewUser')}
                  onUnitChange={setFieldUnit('quota_setting.new_user_quota_unit')}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <QuotaUnitField
                  label={t('请求预扣费额度')}
                  value={inputs.PreConsumedQuota}
                  unit={inputs['quota_setting.pre_consumed_quota_unit']}
                  quotaPerUnit={quotaPerUnit}
                  usdExchangeRate={usdExchangeRate}
                  extraText={t('请求结束后多退少补')}
                  placeholder={''}
                  onValueChange={setFieldValue('PreConsumedQuota')}
                  onUnitChange={setFieldUnit('quota_setting.pre_consumed_quota_unit')}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <QuotaUnitField
                  label={t('邀请新用户奖励额度')}
                  value={inputs.QuotaForInviter}
                  unit={inputs['quota_setting.inviter_quota_unit']}
                  quotaPerUnit={quotaPerUnit}
                  usdExchangeRate={usdExchangeRate}
                  placeholder={t('例如：2000')}
                  onValueChange={setFieldValue('QuotaForInviter')}
                  onUnitChange={setFieldUnit('quota_setting.inviter_quota_unit')}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                <QuotaUnitField
                  label={t('新用户使用邀请码奖励额度')}
                  value={inputs.QuotaForInvitee}
                  unit={inputs['quota_setting.invitee_quota_unit']}
                  quotaPerUnit={quotaPerUnit}
                  usdExchangeRate={usdExchangeRate}
                  placeholder={t('例如：1000')}
                  onValueChange={setFieldValue('QuotaForInvitee')}
                  onUnitChange={setFieldUnit('quota_setting.invitee_quota_unit')}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Switch
                  label={t('对免费模型启用预消耗')}
                  field={'quota_setting.enable_free_model_pre_consume'}
                  extraText={t(
                    '开启后，对免费模型（倍率为0，或者价格为0）的模型也会预消耗额度',
                  )}
                  onChange={(value) =>
                    setInputs((current) => ({
                      ...current,
                      'quota_setting.enable_free_model_pre_consume': value,
                    }))
                  }
                />
              </Col>
            </Row>

            <Row>
              <Button size='default' onClick={onSubmit}>
                {t('保存额度设置')}
              </Button>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </>
  );
}
