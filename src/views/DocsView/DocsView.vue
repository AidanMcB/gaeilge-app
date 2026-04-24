<template>
    <div
        class="docs-layout flex flex-col md:flex-row gap-6 max-w-6xl mx-auto px-3 sm:px-4 py-6 text-gray-100 min-h-[calc(100vh-5rem)]"
        data-testid="docs-root"
    >
        <aside
            class="w-full md:w-56 shrink-0 border border-gray-700/60 rounded-lg bg-black/40 p-4 h-fit md:sticky md:top-20"
        >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-emerald-400 mb-3">Documentation</h2>
            <nav class="flex flex-col gap-1" aria-label="Documentation sections">
                <RouterLink
                    v-for="item in DOC_NAV"
                    :key="item.id"
                    :to="{ name: 'docs', params: { page: item.id } }"
                    class="rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10"
                    :class="
                        currentPage === item.id
                            ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40'
                            : 'text-gray-200 border border-transparent'
                    "
                    :data-testid="`docs-nav-${item.id}`"
                >
                    {{ item.label }}
                </RouterLink>
            </nav>
        </aside>
        <article
            class="flex-1 min-w-0 border border-gray-700/60 rounded-lg bg-black/30 p-4 sm:p-6 md:p-8 overflow-x-auto"
        >
            <div class="markdown-body" v-html="renderedHtml"></div>
        </article>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { DOC_NAV, DOC_SOURCES, isDocPageId, type DocPageId } from '@/docs/docSources';

marked.use(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

const route = useRoute();
const router = useRouter();

const currentPage = computed<DocPageId>(() => {
    const p = route.params.page as string | undefined;
    if (isDocPageId(p)) return p;
    return 'overview';
});

watch(
    () => route.params.page,
    (page) => {
        if (page === undefined || page === '') {
            router.replace({ name: 'docs', params: { page: 'overview' } });
        } else if (!isDocPageId(String(page))) {
            router.replace({ name: 'docs', params: { page: 'overview' } });
        }
    },
    { immediate: true }
);

marked.setOptions({ gfm: true, breaks: true });

const renderedHtml = computed(() => marked.parse(DOC_SOURCES[currentPage.value]) as string);
</script>

<style scoped lang="scss">
.markdown-body :deep(h1) {
    @apply text-2xl sm:text-3xl font-bold text-emerald-400 mb-4;
}
.markdown-body :deep(h2) {
    @apply text-xl font-semibold text-white mt-8 mb-3 border-b border-gray-700 pb-2;
}
.markdown-body :deep(h3) {
    @apply text-lg font-medium text-gray-100 mt-6 mb-2;
}
.markdown-body :deep(p) {
    @apply text-gray-300 leading-relaxed mb-3;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
    @apply text-gray-300 mb-4 pl-6 space-y-1;
}
.markdown-body :deep(li) {
    @apply list-disc;
}
.markdown-body :deep(ol li) {
    @apply list-decimal;
}
.markdown-body :deep(a) {
    @apply text-emerald-400 underline hover:text-emerald-300;
}
.markdown-body :deep(table) {
    @apply w-full text-sm border-collapse my-4;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
    @apply border border-gray-600 px-3 py-2 text-left;
}
.markdown-body :deep(th) {
    @apply bg-gray-800 text-gray-100;
}
.markdown-body :deep(code) {
    @apply bg-gray-800 text-emerald-200 px-1.5 py-0.5 rounded text-sm font-mono;
}
.markdown-body :deep(pre) {
    @apply bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto my-4;
}
.markdown-body :deep(pre code) {
    @apply bg-transparent p-0 text-gray-200;
}
.markdown-body :deep(blockquote) {
    @apply border-l-4 border-emerald-600 pl-4 italic text-gray-400 my-4;
}
</style>
