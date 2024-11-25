import {
    defineComponent,
    h,
    type VNode,
    computed,
    type PropType,
    type SlotsType,
} from 'vue';
import {
    compileNode,
    createNodesFromSource,
    type TxTagNode,
} from './index.ts';

export type TxTagSlotsType = SlotsType<{
    [p: string]: TxTagNode & { Component: VNode | null };
}>

export const TxTagRenderer = defineComponent({
    props: {
        nodes: {
            type: Array as PropType<TxTagNode[]>,
            required: true,
        },
    },
    slots: Object as TxTagSlotsType,
    setup(props, ctx) {
        return () => {
            const nodes = props.nodes;
            const vNodes: Array<VNode | VNode[] | string> = [];

            nodes.forEach((node) => {
                const slot = ctx.slots[node.token as keyof typeof ctx.slots];
                const attr = ctx.attrs[node.token as keyof typeof ctx.attrs];

                if (slot) {
                    let Component = null;

                    if (node.children) {
                        Component = h(TxTagRenderer, {
                            nodes: node.children,
                            ...ctx.attrs,
                        }, ctx.slots);
                    }

                    vNodes.push(
                        slot({
                            ...node,
                            Component,
                        }),
                    );

                    return;
                }

                if (typeof attr === 'string' || typeof attr === 'number') {
                    vNodes.push(String(compileNode(node, attr)));

                    return;
                }

                vNodes.push(node.exp);
            });

            return vNodes;
        };
    },
});

export const TxTag = defineComponent({
    props: {
        source: {
            type: String,
            required: true,
        },
    },
    slots: Object as TxTagSlotsType,
    setup(props, ctx) {
        const nodes = computed(() => createNodesFromSource(props.source));

        return () => h(TxTagRenderer, {
            nodes: nodes.value,
        }, {
            ...ctx.slots,
        });
    },
});
