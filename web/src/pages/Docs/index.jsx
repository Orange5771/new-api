import React, { useContext, useMemo } from 'react';
import {
  Button,
  Card,
  Collapse,
  Space,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { StatusContext } from '../../context/Status';
import { copy, showSuccess } from '../../helpers';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const Docs = () => {
  const { t } = useTranslation();
  const [statusState] = useContext(StatusContext);
  // 优先使用后端配置的服务地址，避免前后端分离时示例地址不准确
  const serverAddress =
    statusState?.status?.server_address || window.location.origin;

  const chatExample = useMemo(
    () => `curl ${serverAddress}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-你的密钥" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "你好，请做一个 3 条的周计划"}
    ]
  }'`,
    [serverAddress],
  );

  const pythonExample = useMemo(
    () => `from openai import OpenAI

client = OpenAI(
    api_key="sk-你的密钥",
    base_url="${serverAddress}/v1"
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "请总结今天要做的事"}]
)
print(resp.choices[0].message.content)`,
    [serverAddress],
  );

  const handleCopy = async (content) => {
    const ok = await copy(content);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  return (
    <div className='mt-[60px] px-2 pb-8'>
      <div className='mx-auto max-w-6xl'>
        <Card className='mb-4'>
          <Space vertical align='start' spacing='medium'>
            <Tag color='blue' size='large'>
              用户文档
            </Tag>
            <Title heading={2} style={{ margin: 0 }}>
              使用说明
            </Title>
            <Paragraph style={{ margin: 0 }}>
              这份文档面向平台最终用户，帮你快速完成：注册登录、获取密钥、配置
              Base URL、调用接口，以及充值与模型选择。
            </Paragraph>
            <div className='flex flex-wrap gap-2'>
              <Link to='/console'>
                <Button type='primary'>{t('进入控制台')}</Button>
              </Link>
              <Link to='/pricing'>
                <Button>{t('查看模型广场')}</Button>
              </Link>
              <Link to='/console/topup'>
                <Button>{t('前往钱包充值')}</Button>
              </Link>
            </div>
          </Space>
        </Card>

        <Card className='mb-4' title='快速开始'>
          <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
            <Paragraph style={{ margin: 0 }}>
              1. 注册并登录账号，进入控制台。
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              2. 在控制台创建 API 密钥（Token），复制保存。
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              3. 将客户端中的 Base URL 改为：
              <Text code>{`${serverAddress}/v1`}</Text>
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              4. 选定可用模型后发起请求，即可开始使用。
            </Paragraph>
            <div className='w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3'>
              <Text strong>{t('建议')}</Text>
              <Paragraph style={{ margin: '8px 0 0 0' }}>
                {t(
                  '先用少量额度做连通性测试，确认模型、参数和计费都符合预期后再切生产流量。',
                )}
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card className='mb-4' title='如何获取密钥（API Key / Token）'>
          <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
            <Paragraph style={{ margin: 0 }}>
              在控制台进入「令牌管理」创建新密钥。密钥只会在创建时完整展示一次，请及时保存。
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              调用接口时，把它放在请求头：
              <Text code>Authorization: Bearer sk-xxxx</Text>
            </Paragraph>
            <div className='w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3'>
              <Text strong>{t('安全提示')}</Text>
              <Paragraph style={{ margin: '8px 0 0 0' }}>
                {t(
                  '请勿将密钥提交到公开仓库或前端源码。建议为不同业务环境单独创建密钥，并按需设置过期与权限。',
                )}
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card className='mb-4' title='如何填写 Base URL'>
          <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
            <Paragraph style={{ margin: 0 }}>
              大多数 OpenAI 兼容客户端都支持自定义 Base URL，请填写：
            </Paragraph>
            <div className='w-full rounded-lg border border-semi-color-border bg-semi-color-fill-0 p-3'>
              <div className='mb-2 flex items-center justify-between'>
                <Text strong>Base URL</Text>
                <Button
                  icon={<IconCopy />}
                  size='small'
                  theme='borderless'
                  onClick={() => handleCopy(`${serverAddress}/v1`)}
                >
                  复制
                </Button>
              </div>
              <pre className='m-0 overflow-x-auto text-xs leading-6'>{`${serverAddress}/v1`}</pre>
            </div>
            <Paragraph style={{ margin: 0 }}>
              如果你的客户端会自动拼接
              <Text code>/v1</Text>
              ，那就只填域名（例如
              <Text code>{serverAddress}</Text>
              ）。
            </Paragraph>
          </Space>
        </Card>

        <Card className='mb-4' title='常用接口示例'>
          <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
            <div className='w-full rounded-lg border border-semi-color-border bg-semi-color-fill-0 p-3'>
              <div className='mb-2 flex items-center justify-between'>
                <Text strong>Chat Completions（curl）</Text>
                <Button
                  icon={<IconCopy />}
                  size='small'
                  theme='borderless'
                  onClick={() => handleCopy(chatExample)}
                >
                  复制
                </Button>
              </div>
              <pre className='m-0 overflow-x-auto text-xs leading-6'>{chatExample}</pre>
            </div>

            <div className='w-full rounded-lg border border-semi-color-border bg-semi-color-fill-0 p-3'>
              <div className='mb-2 flex items-center justify-between'>
                <Text strong>OpenAI Python SDK</Text>
                <Button
                  icon={<IconCopy />}
                  size='small'
                  theme='borderless'
                  onClick={() => handleCopy(pythonExample)}
                >
                  复制
                </Button>
              </div>
              <pre className='m-0 overflow-x-auto text-xs leading-6'>
                {pythonExample}
              </pre>
            </div>
          </Space>
        </Card>

        <Card className='mb-4' title='模型广场 / 控制台 / 钱包充值说明'>
          <Space vertical align='start' spacing='small' style={{ width: '100%' }}>
            <Paragraph style={{ margin: 0 }}>
              <Text strong>模型广场：</Text>
              查看各模型的可用状态、价格与计费策略，方便选型。
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              <Text strong>控制台：</Text>
              管理令牌、查看调用日志、检查额度消耗与错误信息。
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              <Text strong>钱包充值：</Text>
              进入「钱包管理/充值」完成充值后，余额会用于接口调用扣费。
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              <Text strong>建议：</Text>
              新项目先用低价模型联调，再逐步切换到更高能力模型。
            </Paragraph>
          </Space>
        </Card>

        <Card title='常见问题与使用建议'>
          <Collapse accordion>
            <Collapse.Panel header='1) 为什么请求返回 401 / 403？' itemKey='auth'>
              <Paragraph>
                常见原因是密钥无效、被删除、已过期，或者请求头没有带
                <Text code>Authorization: Bearer sk-xxx</Text>
                。请先在控制台检查密钥状态。
              </Paragraph>
            </Collapse.Panel>
            <Collapse.Panel header='2) 为什么提示模型不可用？' itemKey='model'>
              <Paragraph>
                可能是当前模型未对你的分组开放，或该模型暂时下线。可先在模型广场切换其他可用模型进行测试。
              </Paragraph>
            </Collapse.Panel>
            <Collapse.Panel
              header='3) Base URL 配置了还是连接失败怎么办？'
              itemKey='base-url'
            >
              <Paragraph>
                请确认你填写的地址与站点一致，网络可以访问该域名，并且是否重复拼接了
                <Text code>/v1</Text>
                。
              </Paragraph>
            </Collapse.Panel>
            <Collapse.Panel header='4) 如何降低成本并提升稳定性？' itemKey='cost'>
              <Paragraph>
                建议设置请求重试、超时、并发上限，优先使用性价比模型处理常规任务；关键请求再切换高阶模型。
              </Paragraph>
            </Collapse.Panel>
          </Collapse>
        </Card>
      </div>
    </div>
  );
};

export default Docs;
