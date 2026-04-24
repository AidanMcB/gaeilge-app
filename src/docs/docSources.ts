import overview from '@/assets/docs/overview.md?raw';
import architecture from '@/assets/docs/architecture.md?raw';
import api from '@/assets/docs/api.md?raw';
import contributing from '@/assets/docs/contributing.md?raw';

export type DocPageId = 'overview' | 'architecture' | 'api' | 'contributing';

export const DOC_PAGE_IDS: DocPageId[] = ['overview', 'architecture', 'api', 'contributing'];

export const DOC_SOURCES: Record<DocPageId, string> = {
    overview,
    architecture,
    api,
    contributing
};

export const DOC_NAV: { id: DocPageId; label: string }[] = [
    { id: 'overview', label: 'Product overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'api', label: 'API reference' },
    { id: 'contributing', label: 'Contributing' }
];

export function isDocPageId(value: string | undefined): value is DocPageId {
    return value !== undefined && DOC_PAGE_IDS.includes(value as DocPageId);
}
