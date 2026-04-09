import React, { useContext, useMemo } from 'react';
import {
  Button,
  Divider,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { StatusContext } from '../../context/Status';
import { copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { buildDocsCatalog, getDocsPath } from './docsCatalog';

const { Title, Paragraph, Text } = Typography;

const toneClassMap = {
  info: 'border-orange-200 bg-orange-50 text-orange-800',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
};

const buildPageMap = (catalog) => {
  const pages = catalog.flatMap((group) =>
    group.pages.map((page) => ({
      ...page,
      groupTitle: group.title,
    })),
  );
  const pageMap = new Map(
    pages.map((page, index) => [
      `${page.section}/${page.slug}`,
      {
        ...page,
        index,
        previousPage: index > 0 ? pages[index - 1] : null,
        nextPage: index < pages.length - 1 ? pages[index + 1] : null,
      },
    ]),
  );
  return { pageMap };
};

const handleCopy = async (value) => {
  if (!value) return;
  await copy(value);
  showSuccess('已复制到剪贴板');
};

const DocsSidebar = ({ catalog, activePath, isMobile }) => (
  <div className={isMobile ? 'mb-4' : 'sticky top-24'}>
    <div className='mb-4 flex items-center gap-2'>
      <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-[#111418]'>
        D
      </div>
      <div>
        <div className='text-sm font-semibold text-white'>使用文档</div>
        <div className='text-xs text-slate-400'>按顺序完成接入与排查</div>
      </div>
    </div>
    <div className='rounded-[28px] border border-slate-800 bg-[#111418] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.28)]'>
      {catalog.map((group) => (
        <div key={group.section} className='mb-4 last:mb-0'>
          <div className='mb-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
            {group.title}
          </div>
          <div className='space-y-1'>
            {group.pages.map((page) => {
              const href = getDocsPath(page);
              const active = activePath === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-orange-500 font-semibold text-[#111418] shadow-sm shadow-orange-500/20'
                      : 'text-slate-200 hover:bg-[#1a1f26] hover:text-white'
                  }`}
                >
                  {page.navTitle}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DocsOnThisPage = ({ page }) => {
  const anchorBlocks = page.blocks.filter((block) => block.title);

  return (
    <div className='sticky top-24 space-y-4'>
      <div className='rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,247,237,0.62))] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl'>
        <div className='mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500'>
          本页内容
        </div>
        <div className='space-y-2'>
          {anchorBlocks.map((block) => (
            <a
              key={block.id}
              href={`#${block.id}`}
              className='block rounded-2xl border border-transparent bg-white/35 px-3 py-2 text-sm text-semi-color-text-1 transition hover:border-white/80 hover:bg-white/75 hover:text-orange-600'
            >
              {block.title}
            </a>
          ))}
        </div>
      </div>
      <div className='rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,250,252,0.64))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl'>
        <div className='mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500'>
          快速入口
        </div>
        <div className='space-y-2'>
          <Link to='/console' className='block text-sm text-semi-color-text-1 hover:text-orange-600'>
            进入控制台
          </Link>
          <Link to='/pricing' className='block text-sm text-semi-color-text-1 hover:text-orange-600'>
            查看模型广场
          </Link>
          <Link
            to='/console/topup'
            className='block text-sm text-semi-color-text-1 hover:text-orange-600'
          >
            前往钱包管理
          </Link>
        </div>
      </div>
    </div>
  );
};

const DocsPager = ({ page }) => (
  <div className='mt-10 grid gap-3 border-t border-white/70 pt-6 md:grid-cols-2'>
    {page.previousPage ? (
      <Link
        to={getDocsPath(page.previousPage)}
        className='rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,247,237,0.72))] px-4 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-white hover:shadow-[0_24px_60px_rgba(245,158,11,0.16)]'
      >
        <div className='mb-1 text-xs uppercase tracking-[0.16em] text-semi-color-text-2'>上一页</div>
        <div className='text-base font-semibold text-semi-color-text-0'>
          {page.previousPage.navTitle}
        </div>
      </Link>
    ) : (
      <div />
    )}
    {page.nextPage ? (
      <Link
        to={getDocsPath(page.nextPage)}
        className='rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,247,237,0.72))] px-4 py-4 text-right shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-white hover:shadow-[0_24px_60px_rgba(245,158,11,0.16)]'
      >
        <div className='mb-1 text-xs uppercase tracking-[0.16em] text-semi-color-text-2'>下一页</div>
        <div className='text-base font-semibold text-semi-color-text-0'>
          {page.nextPage.navTitle}
        </div>
      </Link>
    ) : null}
  </div>
);

const renderBlock = (block) => {
  switch (block.type) {
    case 'cards':
      return (
        <div className='grid gap-4 md:grid-cols-3'>
          {block.items.map((item) => (
            <div
              key={item.title}
              className='rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,248,240,0.66))] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl'
            >
              <div className='mb-2 text-base font-semibold text-semi-color-text-0'>{item.title}</div>
              <div className='text-sm leading-7 text-semi-color-text-1'>{item.description}</div>
            </div>
          ))}
        </div>
      );
    case 'steps':
      return (
        <div className='space-y-3'>
          {block.items.map((item, index) => (
            <div
              key={item}
              className='flex gap-4 rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,248,240,0.68))] px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl'
            >
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-semibold text-orange-600'>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className='text-sm leading-7 text-semi-color-text-1'>{item}</div>
            </div>
          ))}
        </div>
      );
    case 'list':
      return (
        <div className='space-y-3'>
          {block.items.map((item) => (
            <div
              key={item}
              className='flex gap-3 rounded-[22px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,248,240,0.62))] px-4 py-3 shadow-[0_14px_36px_rgba(15,23,42,0.07)] backdrop-blur-xl'
            >
              <div className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500' />
              <div className='text-sm leading-7 text-semi-color-text-1'>{item}</div>
            </div>
          ))}
        </div>
      );
    case 'callout':
      return (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm leading-7 shadow-sm ${
            toneClassMap[block.tone] || toneClassMap.info
          }`}
        >
          {block.content}
        </div>
      );
    case 'key-values':
      return (
        <div className='grid gap-4 md:grid-cols-2'>
          {block.items.map((item) => (
            <div
              key={item.label}
              className='rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,248,240,0.66))] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl'
            >
              <div className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500'>
                {item.label}
              </div>
              <div className='flex items-center justify-between gap-3'>
                <code className='text-sm font-semibold text-semi-color-text-0'>{item.value}</code>
                <Button
                  size='small'
                  theme='borderless'
                  icon={<IconCopy />}
                  onClick={() => handleCopy(item.value)}
                >
                  复制
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    case 'code':
      return (
        <div className='overflow-hidden rounded-[28px] border border-slate-800/60 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] text-white shadow-[0_28px_72px_rgba(15,23,42,0.22)] backdrop-blur-xl'>
          <div className='flex items-center justify-between border-b border-white/10 px-5 py-3'>
            <div className='text-sm font-semibold text-white'>{block.codeTitle}</div>
            <Button
              size='small'
              theme='borderless'
              icon={<IconCopy />}
              style={{ color: 'white' }}
              onClick={() => handleCopy(block.copyValue || block.code)}
            >
              复制
            </Button>
          </div>
          <pre className='m-0 overflow-x-auto px-5 py-5 text-xs leading-6 text-white/90'>
            {block.code}
          </pre>
        </div>
      );
    case 'qa':
      return (
        <div className='rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,248,240,0.68))] px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl'>
          <div className='mb-2 text-base font-semibold text-semi-color-text-0'>{block.title}</div>
          <div className='text-sm leading-7 text-semi-color-text-1'>{block.answer}</div>
        </div>
      );
    default:
      return null;
  }
};

const DocsArticle = ({ page }) => (
  <article className='min-w-0'>
    <div className='mb-6'>
      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <Tag color='orange'>{page.groupTitle}</Tag>
        <Text type='tertiary'>/</Text>
        <Text type='tertiary'>{page.navTitle}</Text>
      </div>
      <Title heading={1} style={{ marginBottom: 12 }}>
        {page.title}
      </Title>
      <Paragraph
        style={{
          margin: 0,
          maxWidth: 760,
          fontSize: 16,
          lineHeight: 1.9,
          color: 'var(--semi-color-text-1)',
        }}
      >
        {page.description}
      </Paragraph>
      {page.actions?.length ? (
        <div className='mt-5 flex flex-wrap gap-3'>
          {page.actions.map((action) => (
            <Link key={action.label} to={action.to}>
              <Button type={action.type === 'primary' ? 'primary' : 'tertiary'}>
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      ) : null}
    </div>

    <div className='space-y-8'>
      {page.blocks.map((block) => (
        <section key={block.id} id={block.id} className='scroll-mt-24'>
          <div className='mb-4'>
            <div className='mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500'>
              文档段落
            </div>
            <Title heading={3} style={{ marginBottom: 8 }}>
              {block.title}
            </Title>
            {block.description ? (
              <Paragraph style={{ margin: 0, color: 'var(--semi-color-text-1)' }}>
                {block.description}
              </Paragraph>
            ) : null}
          </div>
          {renderBlock(block)}
        </section>
      ))}
    </div>

    <DocsPager page={page} />
  </article>
);

const DocsPage = ({ catalog, pageMap }) => {
  const { section, slug } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const page = pageMap.get(`${section}/${slug}`);

  if (!page) {
    return <Navigate to='/docs/intro/welcome' replace />;
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.14),_transparent_28%),linear-gradient(180deg,_#f5f1e8_0%,_#f8fafc_100%)]'>
      <div className='mx-auto max-w-[1480px] px-3 pb-12 pt-[84px] lg:px-6'>
        <div
          className='rounded-[32px] border border-white/70 bg-white/55 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-5'
          style={{
            backgroundImage:
              'radial-gradient(circle at top right, rgba(249,115,22,0.12), transparent 32%)',
          }}
        >
          <div className='grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_240px]'>
            <DocsSidebar
              catalog={catalog}
              activePath={location.pathname}
              isMobile={isMobile}
            />
            <div className='rounded-[28px] border border-white/80 bg-[rgba(255,253,250,0.92)] p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)] md:p-8'>
              <DocsArticle page={page} />
            </div>
            {!isMobile ? <DocsOnThisPage page={page} /> : null}
          </div>
          {isMobile ? (
            <>
              <Divider margin='20px' />
              <DocsOnThisPage page={page} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Docs = () => {
  const [statusState] = useContext(StatusContext);
  // 文档示例里的地址必须跟随后端配置，避免部署后示例域名失真。
  const serverAddress =
    statusState?.status?.server_address || window.location.origin;

  const catalog = useMemo(() => buildDocsCatalog(serverAddress), [serverAddress]);
  const { pageMap } = useMemo(() => buildPageMap(catalog), [catalog]);

  return (
    <Routes>
      <Route index element={<Navigate to='intro/welcome' replace />} />
      <Route
        path=':section/:slug'
        element={<DocsPage catalog={catalog} pageMap={pageMap} />}
      />
      <Route path='*' element={<Navigate to='intro/welcome' replace />} />
    </Routes>
  );
};

export default Docs;
