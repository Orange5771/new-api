// 文档里的地址示例需要跟随当前站点配置，避免在不同部署环境里误导用户。
const normalizeServerAddress = (serverAddress) =>
  (serverAddress || window.location.origin).replace(/\/+$/, '');

export const getDocsPath = (page) => `/docs/${page.section}/${page.slug}`;

export const buildDocsCatalog = (serverAddress) => {
  const base = normalizeServerAddress(serverAddress);

  return [
    {
      title: '快速开始',
      section: 'intro',
      pages: [
        {
          section: 'intro',
          slug: 'welcome',
          navTitle: '欢迎使用',
          title: '欢迎使用 Okey188',
          description:
            '欢迎页只负责告诉你从哪里开始，以及接下来该按什么顺序阅读。具体操作已经拆到注册登录、API Key、Base URL、首个请求、充值订阅和错误排查等独立页面中。',
          actions: [
            { label: '进入控制台', to: '/console', type: 'primary' },
            { label: '查看模型广场', to: '/pricing' },
          ],
          blocks: [
            {
              id: 'first-success',
              title: '先把第一次成功请求跑通',
              description:
                '先解决入口和顺序感，再逐步进入细节页面。欢迎页不负责讲完所有内容，而是负责把你送到正确的下一步。',
              type: 'cards',
              items: [
                {
                  title: '快速开始',
                  description: '先看欢迎使用与平台概览，明确这套文档站的结构和入口。',
                },
                {
                  title: '接入指南',
                  description: '再按顺序完成注册登录、创建 API Key、配置 Base URL 和首个请求。',
                },
                {
                  title: '平台使用与帮助中心',
                  description: '最后进入充值订阅、模型选型和错误排查，处理上线前后的细节。',
                },
              ],
            },
            {
              id: 'reading-order',
              title: '推荐阅读顺序',
              type: 'steps',
              items: [
                '先看「平台概览」，了解这套文档站怎么组织。',
                '再看「注册与登录」，确认你能正常进入控制台。',
                '接着完成「创建 API Key」「配置 Base URL」和「发起首个请求」。',
              ],
            },
            {
              id: 'what-you-get',
              title: '这套文档包含什么',
              type: 'list',
              items: [
                '如何注册并进入控制台',
                '如何创建、保存和安全使用 API Key',
                '如何配置 Base URL 与 Authorization',
                '如何发起首个 OpenAI 兼容请求',
                '如何查看模型、充值额度和排查常见问题',
              ],
            },
          ],
        },
        {
          section: 'intro',
          slug: 'overview',
          navTitle: '平台概览',
          title: '平台概览',
          description:
            'Okey188 提供统一的 OpenAI 兼容接口入口，并配套令牌管理、模型选型、额度与日志能力，适合把多个 AI 模型统一接入到一个站点中。',
          blocks: [
            {
              id: 'core-capabilities',
              title: '你会用到的核心能力',
              type: 'cards',
              items: [
                {
                  title: '统一接口入口',
                  description: '大部分客户端只需要替换 Base URL 和 API Key，就能按 OpenAI 兼容方式接入。',
                },
                {
                  title: '模型广场',
                  description: '查看模型可用性、价格和能力差异，帮助你快速决定测试模型和正式模型。',
                },
                {
                  title: '控制台与日志',
                  description: '创建密钥、查看请求记录、定位错误、确认额度与模型使用情况。',
                },
              ],
            },
            {
              id: 'who-should-read',
              title: '适合谁先看这套文档',
              type: 'list',
              items: [
                '第一次接入 Okey188 的新用户',
                '从官方 OpenAI 接口迁移到自建/代理站点的用户',
                '需要先跑通测试，再逐步做模型选型和成本控制的团队',
              ],
            },
            {
              id: 'before-you-start',
              title: '开始前准备',
              type: 'list',
              items: [
                '一个可登录的账号',
                '可访问控制台与模型广场的权限',
                '一个支持自定义 Base URL 的客户端或 SDK',
                '用于联调的少量测试额度',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '接入指南',
      section: 'guide',
      pages: [
        {
          section: 'guide',
          slug: 'register',
          navTitle: '注册与登录',
          title: '注册与登录',
          description:
            '第一步是进入平台并找到控制台入口。后续的密钥创建、模型查看和充值都在控制台内完成。',
          actions: [{ label: '进入控制台', to: '/console', type: 'primary' }],
          blocks: [
            {
              id: 'steps',
              title: '操作步骤',
              type: 'steps',
              items: [
                '打开站点首页并完成注册或登录。',
                '登录后点击顶栏或首页中的「控制台」入口。',
                '在控制台左侧导航中找到后续需要用到的模块，例如令牌管理、钱包管理、使用日志。',
              ],
            },
            {
              id: 'after-login',
              title: '登录后先确认什么',
              type: 'list',
              items: [
                '你是否能看到控制台首页',
                '你是否拥有创建令牌和查看模型的权限',
                '当前账户是否已具备测试额度或订阅',
              ],
            },
            {
              id: 'tips',
              title: '建议',
              type: 'callout',
              tone: 'info',
              content:
                '如果你是团队成员，建议先确认自己的分组、可用模型范围和额度策略，再开始接入，避免后面调试时误判为代码问题。',
            },
          ],
        },
        {
          section: 'guide',
          slug: 'api-key',
          navTitle: '创建 API Key',
          title: '创建 API Key',
          description:
            'API Key 用于每一次接口鉴权。创建后只会完整展示一次，建议在生成后立刻复制保存。',
          blocks: [
            {
              id: 'create-key',
              title: '创建步骤',
              type: 'steps',
              items: [
                '进入控制台的「令牌管理」。',
                '点击新建令牌，按需填写名称、权限和过期时间。',
                '创建完成后立即复制并保存密钥，后续请求头中要使用它。',
              ],
            },
            {
              id: 'header-example',
              title: '请求头写法',
              type: 'code',
              codeTitle: 'Authorization 示例',
              copyValue: 'Authorization: Bearer sk-你的 API Key',
              code: 'Authorization: Bearer sk-你的 API Key',
            },
            {
              id: 'security',
              title: '安全建议',
              type: 'callout',
              tone: 'warn',
              content:
                '不要把密钥提交到公开仓库、前端源码或日志中。建议为不同环境单独创建密钥，并根据业务需要设置权限和过期时间。',
            },
          ],
        },
        {
          section: 'guide',
          slug: 'base-url',
          navTitle: '配置 Base URL',
          title: '配置 Base URL',
          description:
            '大多数接入失败并不是代码不会写，而是 Base URL、Authorization 或请求路径配置错误。这一页只处理最常见的配置问题。',
          blocks: [
            {
              id: 'base-url',
              title: '推荐填写方式',
              type: 'key-values',
              items: [
                { label: 'Base URL', value: `${base}/v1` },
                { label: 'Authorization', value: 'Bearer sk-你的 API Key' },
              ],
            },
            {
              id: 'important-note',
              title: '什么时候不要自己再拼 /v1',
              type: 'callout',
              tone: 'info',
              content:
                '有些 SDK 会自动补上 /v1。如果你的客户端本身已经会拼接该路径，就只填写域名本体，不要重复追加。',
            },
            {
              id: 'common-mistakes',
              title: '常见误区',
              type: 'list',
              items: [
                '把官方域名留在配置里，没有替换成自己的站点地址',
                '客户端已经自动拼接 /v1，结果手动又加了一次',
                'API Key 已创建，但请求头没有按 Bearer 形式传递',
              ],
            },
          ],
        },
        {
          section: 'guide',
          slug: 'first-request',
          navTitle: '发起首个请求',
          title: '发起首个请求',
          description:
            '当密钥和 Base URL 配好后，建议先用最短的示例请求做连通性验证。只要首个请求返回正常，后续大多数集成问题都会简单很多。',
          blocks: [
            {
              id: 'curl-example',
              title: 'curl 示例',
              type: 'code',
              codeTitle: 'Chat Completions',
              copyValue: `curl ${base}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-你的 API Key" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "你好，请返回一段测试文本"}
    ]
  }'`,
              code: `curl ${base}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-你的 API Key" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "你好，请返回一段测试文本"}
    ]
  }'`,
            },
            {
              id: 'python-example',
              title: 'Python SDK 示例',
              type: 'code',
              codeTitle: 'OpenAI Python',
              copyValue: `from openai import OpenAI

client = OpenAI(
    api_key="sk-你的 API Key",
    base_url="${base}/v1",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好，请返回一段测试文本"}],
)

print(resp.choices[0].message.content)`,
              code: `from openai import OpenAI

client = OpenAI(
    api_key="sk-你的 API Key",
    base_url="${base}/v1",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好，请返回一段测试文本"}],
)

print(resp.choices[0].message.content)`,
            },
            {
              id: 'success-check',
              title: '怎样算联调成功',
              type: 'list',
              items: [
                '接口返回 200 且能拿到模型响应内容',
                '使用日志中可以看到这次调用记录',
                '额度或账单变化与预期一致',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '平台使用',
      section: 'usage',
      pages: [
        {
          section: 'usage',
          slug: 'models',
          navTitle: '模型广场与选型',
          title: '模型广场与选型',
          description:
            '当首个请求跑通后，下一步通常是选模型。模型广场用于查看模型可用性、价格、倍率和适用场景。',
          actions: [{ label: '打开模型广场', to: '/pricing', type: 'primary' }],
          blocks: [
            {
              id: 'what-to-check',
              title: '选模型时优先看什么',
              type: 'cards',
              items: [
                {
                  title: '可用性',
                  description: '先确认当前模型是否对你的分组开放，是否处于可用状态。',
                },
                {
                  title: '价格与倍率',
                  description: '同类模型能力接近时，优先选择价格更合适、倍率更低的选项。',
                },
                {
                  title: '任务类型',
                  description: '联调阶段优先稳定和成本，生产阶段再考虑能力上限与响应速度。',
                },
              ],
            },
            {
              id: 'practical-advice',
              title: '实践建议',
              type: 'list',
              items: [
                '新项目先用稳定、成本低的模型打通链路',
                '关键业务场景再切换到更高能力模型',
                '把高价模型留给真正需要强推理或强生成的环节',
              ],
            },
          ],
        },
        {
          section: 'usage',
          slug: 'topup',
          navTitle: '钱包充值与额度',
          title: '钱包充值与额度',
          description:
            '调用接口前，先确认你的账户有足够额度或有效订阅。充值、订阅和消费记录都可以在控制台查看。',
          actions: [{ label: '前往钱包管理', to: '/console/topup', type: 'primary' }],
          blocks: [
            {
              id: 'when-you-need-topup',
              title: '什么时候需要充值',
              type: 'list',
              items: [
                '你要开始正式测试或持续调用时',
                '当前免费额度或赠送额度不足时',
                '你的分组或套餐要求先有可用余额时',
              ],
            },
            {
              id: 'what-to-check',
              title: '充值后应确认什么',
              type: 'steps',
              items: [
                '检查钱包余额或订阅状态是否更新。',
                '重新发起一次小流量测试请求，确认计费与日志正常。',
                '如果配置了多人或多环境使用，确认额度策略是否符合预期。',
              ],
            },
            {
              id: 'billing-note',
              title: '建议',
              type: 'callout',
              tone: 'info',
              content:
                '联调阶段建议使用小额度、小流量验证，确认模型、参数和计费策略都符合预期后再逐步切换正式流量。',
            },
          ],
        },
        {
          section: 'usage',
          slug: 'faq',
          navTitle: '常见问题',
          title: '常见问题',
          description:
            '如果接入过程中遇到返回码异常、模型不可用或地址配置问题，优先从这几个高频问题开始检查。',
          blocks: [
            {
              id: 'auth',
              title: '为什么会返回 401 / 403？',
              type: 'qa',
              answer:
                '通常是 API Key 无效、已删除、已过期，或者 Authorization 头没有按 Bearer 形式传递。建议先到控制台确认密钥状态，再检查请求头格式。',
            },
            {
              id: 'model',
              title: '为什么提示模型不可用？',
              type: 'qa',
              answer:
                '可能是当前分组未开放该模型，或该模型正在维护。建议先去模型广场查看状态，再切换其他可用模型测试。',
            },
            {
              id: 'base-url',
              title: 'Base URL 已经配置了，为什么还是连不上？',
              type: 'qa',
              answer:
                '请确认使用的是你的站点域名，并检查客户端是否额外拼接了一次 /v1。很多 SDK 默认会自动补上这段路径。',
            },
            {
              id: 'cost',
              title: '怎么在稳定性和成本之间做取舍？',
              type: 'qa',
              answer:
                '新项目建议先用稳定、成本低的模型完成联调，关键链路再切换到更高能力模型，同时配好超时、重试和费用限制。',
            },
          ],
        },
      ],
    },
  ];
};
