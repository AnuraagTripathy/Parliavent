(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/mockJudge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_FINDINGS",
    ()=>MOCK_FINDINGS,
    "MOTION",
    ()=>MOTION,
    "SEED_ARGUMENT",
    ()=>SEED_ARGUMENT
]);
const MOTION = "Should cities ban cars from downtown areas?";
const SEED_ARGUMENT = "Cities need to ban cars downtown. Every time I go there's traffic, honking, and someone almost gets hit. If we don't ban cars now, downtowns will become unlivable death zones. Europe does it and their cities are way nicer.";
const MOCK_FINDINGS = [
    {
        id: "finding-clarity-1",
        type: "clarity",
        status: "open",
        spanText: "unlivable death zones",
        title: "This reads as venting",
        reason: "Naming a concrete risk lands harder than a phrase readers may discount.",
        suggestedRewrite: "downtowns will keep getting more dangerous for people on foot"
    },
    {
        id: "finding-claim-1",
        type: "claim",
        status: "open",
        spanText: "Europe does it and their cities are way nicer",
        title: "This needs a source",
        reason: "A reader can wave this off without evidence behind it.",
        sources: [
            {
                id: "source-1",
                title: "Car-free streets and city livability",
                publisher: "Urban Planning Review",
                isSample: true
            },
            {
                id: "source-2",
                title: "Oslo city center traffic reduction outcomes",
                publisher: "City of Oslo policy brief",
                isSample: true
            },
            {
                id: "source-3",
                title: "Paris low-traffic zones, three-year review",
                publisher: "Sample case study",
                isSample: true
            }
        ]
    },
    {
        id: "finding-fallacy-1",
        type: "fallacy",
        status: "open",
        spanText: "If we don't ban cars now, downtowns will become unlivable death zones",
        title: "This offers only two extremes",
        subtitle: "False dilemma",
        reason: "Ban now or disaster are not the only options. Congestion pricing, better transit, and partial bans sit in between.",
        confidence: "82%",
        example: '"Either we ban all phones in school or students will never learn."',
        suggestedRewrite: "Without action on downtown traffic, conditions for pedestrians may keep getting worse."
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/mockPublishedArguments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITATION_PALETTE",
    ()=>CITATION_PALETTE,
    "MOCK_PUBLISHED_ARGUMENTS",
    ()=>MOCK_PUBLISHED_ARGUMENTS,
    "getCitationColor",
    ()=>getCitationColor,
    "getPublishedArgument",
    ()=>getPublishedArgument
]);
const CITATION_PALETTE = [
    {
        bg: "#e8eef8",
        underline: "#7a9cc4",
        marker: "#5a7a9e",
        ring: "#dce4ef"
    },
    {
        bg: "#e6f0ec",
        underline: "#7aab96",
        marker: "#4a8a72",
        ring: "#d4e8df"
    },
    {
        bg: "#ebe8f4",
        underline: "#9a8cc4",
        marker: "#6a5a9e",
        ring: "#e0dce8"
    },
    {
        bg: "#f0ebe6",
        underline: "#b49a7a",
        marker: "#8a725a",
        ring: "#e8e0d8"
    }
];
function getCitationColor(sourceIndex) {
    return CITATION_PALETTE[sourceIndex % CITATION_PALETTE.length];
}
const MOCK_PUBLISHED_ARGUMENTS = [
    {
        id: "arg-maya",
        author: "Maya Chen",
        postedAt: "2 days ago",
        text: "Copenhagen restricted car access in its city center starting in the 1960s. Today, over 60% of trips downtown happen by bike or foot. Partial bans paired with transit investment tend to work better than an overnight blanket ban — cities need time to build alternatives before cutting off access entirely.",
        sources: [
            {
                id: "src-cph-1",
                title: "Copenhagen bicycle account, 2023",
                publisher: "City of Copenhagen",
                url: "https://www.copenhagen.dk/en/policy/bicycle-account",
                isSample: true
            },
            {
                id: "src-partial-1",
                title: "Gradual car reduction vs. sudden bans: a comparative review",
                publisher: "Journal of Urban Mobility",
                url: "https://example.com/urban-mobility/partial-bans",
                isSample: true
            }
        ],
        citations: [
            {
                id: "cite-1",
                spanText: "over 60% of trips downtown happen by bike or foot",
                sourceId: "src-cph-1"
            },
            {
                id: "cite-2",
                spanText: "Partial bans paired with transit investment tend to work better than an overnight blanket ban",
                sourceId: "src-partial-1"
            }
        ]
    },
    {
        id: "arg-james",
        author: "James Okonkwo",
        postedAt: "4 days ago",
        text: "Congestion pricing in London's central zone cut traffic 27% in the first year while maintaining access for deliveries and emergency vehicles. A full ban would remove that flexibility. Revenue from the charge also funded bus network improvements across the city.",
        sources: [
            {
                id: "src-london-1",
                title: "Central London congestion charge: ten-year impact assessment",
                publisher: "Transport for London",
                url: "https://tfl.gov.uk/corporate/publications-and-reports/congestion-charge",
                isSample: true
            },
            {
                id: "src-london-2",
                title: "How congestion pricing revenue funded London bus expansion",
                publisher: "Centre for London",
                url: "https://example.com/centre-for-london/congestion-revenue",
                isSample: true
            }
        ],
        citations: [
            {
                id: "cite-3",
                spanText: "Congestion pricing in London's central zone cut traffic 27% in the first year while maintaining access for deliveries and emergency vehicles",
                sourceId: "src-london-1"
            },
            {
                id: "cite-4",
                spanText: "Revenue from the charge also funded bus network improvements across the city",
                sourceId: "src-london-2"
            }
        ]
    },
    {
        id: "arg-elena",
        author: "Elena Vasquez",
        postedAt: "1 week ago",
        text: "Barcelona's superblocks program reduced noise pollution by 4 decibels in pilot neighborhoods without banning cars citywide. Residents reported higher satisfaction with street life after the changes. I think a downtown ban goes too far, but we should copy what actually worked in Barcelona first.",
        sources: [
            {
                id: "src-bcn-1",
                title: "Superblocks pilot evaluation: environmental and social outcomes",
                publisher: "Barcelona City Council",
                url: "https://example.com/barcelona/superblocks-evaluation",
                isSample: true
            },
            {
                id: "src-bcn-2",
                title: "Resident satisfaction survey, superblocks districts",
                publisher: "Barcelona Urban Ecology Agency",
                url: "https://example.com/barcelona/superblocks-survey",
                isSample: true
            }
        ],
        citations: [
            {
                id: "cite-5",
                spanText: "Barcelona's superblocks program reduced noise pollution by 4 decibels in pilot neighborhoods without banning cars citywide",
                sourceId: "src-bcn-1"
            },
            {
                id: "cite-6",
                spanText: "Residents reported higher satisfaction with street life after the changes",
                sourceId: "src-bcn-2"
            }
        ],
        contestedFallacies: [
            "Appeal to moderation"
        ],
        caveats: [
            "Posted with unresolved review item."
        ]
    }
];
function getPublishedArgument(id) {
    return MOCK_PUBLISHED_ARGUMENTS.find((a)=>a.id === id);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/DebateFeed.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DebateFeed",
    ()=>DebateFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockJudge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockPublishedArguments.ts [app-client] (ecmascript)");
;
;
;
;
function ArgumentPreviewCard({ argument, onOpen }) {
    const sourceCount = argument.sources.length;
    const preview = argument.text.length > 180 ? `${argument.text.slice(0, 180).trim()}…` : argument.text;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onOpen,
        className: "group w-full rounded-xl border border-[#e4e4e0] bg-white p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:border-[#d8d8d4] hover:bg-[#fdfdfc]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-7 w-7 items-center justify-center rounded-full bg-[#ececea] text-[11px] font-medium text-[#5a5a58]",
                                children: argument.author.split(" ").map((n)=>n[0]).join("")
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[13px] font-medium text-[#2a2a28]",
                                        children: argument.author
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                        lineNumber: 39,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-[#9a9a96]",
                                        children: argument.postedAt
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1 text-[11px] text-[#7a9cc4]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "h-3 w-3",
                                strokeWidth: 1.75
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            sourceCount,
                            " source",
                            sourceCount === 1 ? "" : "s"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-4 text-[15px] leading-relaxed text-[#3a3a38]",
                children: preview
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 text-[12px] font-medium text-[#5a5a58] group-hover:text-[#1a1a18]",
                children: [
                    "Read argument",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                        className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DebateFeed.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = ArgumentPreviewCard;
function DebateFeed({ onOpenArgument, onWrite }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto w-full max-w-3xl px-4 py-8 lg:px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                        children: "Motion"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-medium leading-snug tracking-tight text-[#1a1a18] sm:text-[28px]",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOTION"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 max-w-xl text-[14px] leading-relaxed text-[#6a6a66]",
                        children: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PUBLISHED_ARGUMENTS"].length,
                            " arguments posted. Sourced claims are color-mapped to their references in each post."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                        children: "Arguments"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onWrite,
                        className: "rounded-lg border border-[#d8d8d4] bg-[#1a1a18] px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#2a2a28]",
                        children: "Write yours"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PUBLISHED_ARGUMENTS"].map((argument)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArgumentPreviewCard, {
                        argument: argument,
                        onOpen: ()=>onOpenArgument(argument.id)
                    }, argument.id, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DebateFeed.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c1 = DebateFeed;
var _c, _c1;
__turbopack_context__.k.register(_c, "ArgumentPreviewCard");
__turbopack_context__.k.register(_c1, "DebateFeed");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/applyUserEdit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyUserApprovedEdit",
    ()=>applyUserApprovedEdit
]);
function applyUserApprovedEdit({ text, spanText, replacement }) {
    const index = text.indexOf(spanText);
    if (index === -1) return text;
    return text.slice(0, index) + replacement + text.slice(index + spanText.length);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/citationsFromFindings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "citationsFromFindings",
    ()=>citationsFromFindings,
    "sourcesFromFindings",
    ()=>sourcesFromFindings
]);
function citationsFromFindings(findings) {
    return findings.filter((f)=>f.status === "source_attached" && f.selectedSourceId !== undefined).map((f)=>({
            id: f.id,
            spanText: f.spanText,
            sourceId: f.selectedSourceId
        }));
}
function sourcesFromFindings(findings) {
    const seen = new Set();
    const sources = [];
    for (const finding of findings){
        if (finding.status !== "source_attached" || !finding.selectedSourceId) {
            continue;
        }
        const source = finding.sources?.find((s)=>s.id === finding.selectedSourceId);
        if (source && !seen.has(source.id)) {
            seen.add(source.id);
            sources.push(source);
        }
    }
    return sources;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/buildPublishedArgument.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPublishedArgument",
    ()=>buildPublishedArgument,
    "formatByline",
    ()=>formatByline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/citationsFromFindings.ts [app-client] (ecmascript)");
;
function buildPublishedArgument(params) {
    const sources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourcesFromFindings"])(params.findings);
    const citations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["citationsFromFindings"])(params.findings);
    const contestedFallacies = params.findings.filter((f)=>f.type === "fallacy" && f.status === "disputed").map((f)=>f.subtitle).filter((name)=>Boolean(name));
    const hasOpenFindings = params.findings.some((f)=>f.status === "open");
    return {
        id: "user-draft",
        author: params.author ?? "You",
        postedAt: "Just now",
        text: params.text,
        sources,
        citations,
        contestedFallacies: contestedFallacies.length > 0 ? contestedFallacies : undefined,
        caveats: hasOpenFindings ? [
            "Posted with unresolved review item."
        ] : undefined
    };
}
function formatByline(argument) {
    const sourceCount = argument.sources.length;
    const contestedCount = argument.contestedFallacies?.length ?? 0;
    const sourceLabel = sourceCount === 1 ? "1 source attached" : `${sourceCount} sources attached`;
    const flagLabel = contestedCount === 1 ? "1 flag contested" : `${contestedCount} flags contested`;
    return `Vetted, ${sourceLabel}, ${flagLabel}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/highlightCitations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSourceIndex",
    ()=>buildSourceIndex,
    "highlightCitations",
    ()=>highlightCitations
]);
function buildSourceIndex(argument) {
    const index = new Map();
    argument.sources.forEach((source, i)=>index.set(source.id, i));
    return index;
}
function highlightCitations(text, citations, sourceIndex) {
    const breakpoints = new Set([
        0,
        text.length
    ]);
    const spans = [];
    for (const citation of citations){
        const start = text.indexOf(citation.spanText);
        if (start === -1) continue;
        const end = start + citation.spanText.length;
        breakpoints.add(start);
        breakpoints.add(end);
        spans.push({
            start,
            end,
            sourceId: citation.sourceId
        });
    }
    const sorted = Array.from(breakpoints).sort((a, b)=>a - b);
    const segments = [];
    for(let i = 0; i < sorted.length - 1; i++){
        const start = sorted[i];
        const end = sorted[i + 1];
        if (start === end) continue;
        const match = spans.find((s)=>s.start <= start && s.end >= end);
        const sourceId = match?.sourceId;
        const citationIndex = sourceId !== undefined ? sourceIndex.get(sourceId) : undefined;
        segments.push({
            text: text.slice(start, end),
            sourceId,
            citationIndex
        });
    }
    return segments.length > 0 ? segments : [
        {
            text
        }
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/ArgumentEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArgumentEditor",
    ()=>ArgumentEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/highlightCitations.ts [app-client] (ecmascript)");
;
;
const highlightStyles = {
    clarity: "bg-[#f5ead8] decoration-[#c9a96e]/40",
    claim: "bg-[#e8eef8] underline decoration-[#7a9cc4]/50 decoration-2 underline-offset-[3px]",
    fallacy: "bg-[#f8e8e8] underline decoration-[#c47a7a]/50 decoration-2 underline-offset-[3px]"
};
function buildDisplaySegments(text, findings, citations, sourceIndex) {
    const breakpoints = new Set([
        0,
        text.length
    ]);
    const highlightSpans = [];
    const citationSpans = [];
    for (const finding of findings.filter((f)=>f.status === "open")){
        const start = text.indexOf(finding.spanText);
        if (start === -1) continue;
        const end = start + finding.spanText.length;
        breakpoints.add(start);
        breakpoints.add(end);
        highlightSpans.push({
            start,
            end,
            type: finding.type
        });
    }
    for (const citation of citations){
        const start = text.indexOf(citation.spanText);
        if (start === -1) continue;
        const end = start + citation.spanText.length;
        breakpoints.add(start);
        breakpoints.add(end);
        const citationIndex = sourceIndex.get(citation.sourceId);
        if (citationIndex !== undefined) {
            citationSpans.push({
                start,
                end,
                citationIndex
            });
        }
    }
    const sorted = Array.from(breakpoints).sort((a, b)=>a - b);
    const segments = [];
    for(let i = 0; i < sorted.length - 1; i++){
        const start = sorted[i];
        const end = sorted[i + 1];
        if (start === end) continue;
        const types = [
            ...new Set(highlightSpans.filter((s)=>s.start <= start && s.end >= end).map((s)=>s.type))
        ];
        const citationMatch = citationSpans.find((s)=>s.start <= start && s.end >= end);
        segments.push({
            text: text.slice(start, end),
            types,
            citationIndex: citationMatch?.citationIndex,
            showCitationMarker: citationSpans.some((s)=>s.end === end)
        });
    }
    return segments.length > 0 ? segments : [
        {
            text,
            types: []
        }
    ];
}
function ArgumentDisplay({ text, findings, citations, attachedSources }) {
    const sourceIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSourceIndex"])({
        id: "",
        author: "",
        postedAt: "",
        text,
        sources: attachedSources,
        citations
    });
    const segments = buildDisplaySegments(text, findings, citations, sourceIndex);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: segments.map((segment, i)=>{
            const content = segment.types.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: segment.text
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 121,
                columnNumber: 13
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mark", {
                className: `rounded-[2px] text-inherit ${segment.types.map((type)=>highlightStyles[type]).join(" ")}`,
                children: segment.text
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 123,
                columnNumber: 13
            }, this);
            if (segment.showCitationMarker && segment.citationIndex !== undefined) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        content,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sup", {
                            className: "ml-0.5 text-[10px] font-medium text-[#5a7a9e]",
                            title: attachedSources[segment.citationIndex]?.title ?? "Source",
                            children: [
                                "[",
                                segment.citationIndex + 1,
                                "]"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                            lineNumber: 136,
                            columnNumber: 15
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                    lineNumber: 134,
                    columnNumber: 13
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: content
            }, i, false, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 148,
                columnNumber: 16
            }, this);
        })
    }, void 0, false);
}
_c = ArgumentDisplay;
function ArgumentEditor({ text, findings, citations = [], attachedSources = [], onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-baseline justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                        children: "Your argument"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] text-[#b0b0ac]",
                        children: [
                            text.length,
                            " characters"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 rounded-xl border border-[#e4e4e0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-xl px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-[#1a1a18] sm:px-8 sm:py-8 sm:text-[20px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArgumentDisplay, {
                            text: text,
                            findings: findings,
                            citations: citations,
                            attachedSources: attachedSources
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: text,
                        onChange: (e)=>onChange(e.target.value),
                        spellCheck: true,
                        className: "relative min-h-[380px] w-full resize-none rounded-xl bg-transparent px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-transparent caret-[#1a1a18] outline-none selection:bg-[#d4e4f4]/60 sm:min-h-[440px] sm:px-8 sm:py-8 sm:text-[20px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_c1 = ArgumentEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "ArgumentDisplay");
__turbopack_context__.k.register(_c1, "ArgumentEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/SourcePopover.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SourcePopover",
    ()=>SourcePopover
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function SourcePopover({ sources, onSelect, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 rounded-lg border border-[#dce4ef] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-center justify-between px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]",
                        children: "Sample sources"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/SourcePopover.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        className: "text-[10px] text-[#9a9a96] hover:text-[#6a6a66]",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/SourcePopover.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/SourcePopover.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-1",
                children: sources.map((source)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onSelect(source.id),
                            className: "w-full rounded-md border border-transparent px-2.5 py-2 text-left transition-colors hover:border-[#dce4ef] hover:bg-[#f4f7fb]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] font-medium text-[#4a4a48]",
                                    children: source.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/SourcePopover.tsx",
                                    lineNumber: 34,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-[#9a9a96]",
                                    children: [
                                        source.publisher,
                                        source.isSample && " · sample"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/SourcePopover.tsx",
                                    lineNumber: 35,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/SourcePopover.tsx",
                            lineNumber: 29,
                            columnNumber: 13
                        }, this)
                    }, source.id, false, {
                        fileName: "[project]/src/components/debate/SourcePopover.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/debate/SourcePopover.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/SourcePopover.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = SourcePopover;
var _c;
__turbopack_context__.k.register(_c, "SourcePopover");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/FindingCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FindingCard",
    ()=>FindingCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.mjs [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SourcePopover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/SourcePopover.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const typeConfig = {
    clarity: {
        label: "Clarity",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
        accent: "text-[#9a7b3c]",
        border: "border-[#ebe3d4]",
        dot: "bg-[#c9a96e]"
    },
    claim: {
        label: "Claim",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        accent: "text-[#5a7a9e]",
        border: "border-[#dce4ef]",
        dot: "bg-[#7a9cc4]"
    },
    fallacy: {
        label: "Fallacy",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        accent: "text-[#9e5a5a]",
        border: "border-[#ebdede]",
        dot: "bg-[#c47a7a]"
    }
};
const statusLabels = {
    resolved: "Suggestion applied",
    ignored: "Kept as-is",
    disputed: "Disputed",
    source_attached: "Source attached",
    marked_opinion: "Marked as opinion"
};
function ActionButton({ children, onClick, variant = "default" }) {
    const styles = {
        default: "border-[#e4e4e0] bg-white text-[#4a4a48] hover:border-[#d0d0cc] hover:bg-[#fafaf8]",
        primary: "border-[#1a1a18] bg-[#1a1a18] text-white hover:bg-[#2a2a28]",
        muted: "border-transparent bg-transparent text-[#8a8a86] hover:text-[#4a4a48]"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: `rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${styles[variant]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/debate/FindingCard.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c = ActionButton;
function FindingCard({ finding, onUseSuggestion, onKeepAsIs, onAttachSource, onMarkAsOpinion, onDispute }) {
    _s();
    const config = typeConfig[finding.type];
    const Icon = config.icon;
    const isOpen = finding.status === "open";
    const statusLabel = statusLabels[finding.status];
    const [fallacyExpanded, setFallacyExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sourcePickerOpen, setSourcePickerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [disputeOpen, setDisputeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [disputeReason, setDisputeReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    function handleDisputeSubmit() {
        const trimmed = disputeReason.trim();
        if (!trimmed) return;
        onDispute(finding.id, trimmed);
        setDisputeOpen(false);
        setDisputeReason("");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: `rounded-lg border bg-[#fafaf8] p-4 ${config.border} ${!isOpen ? "opacity-80" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2.5 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `h-1.5 w-1.5 rounded-full ${config.dot}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-[10px] font-medium uppercase tracking-[0.12em] ${config.accent}`,
                        children: config.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    finding.confidence && isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto text-[10px] text-[#a8a8a4]",
                        children: [
                            finding.confidence,
                            " confidence"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    statusLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto flex items-center gap-1 text-[10px] text-[#8ab89a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "h-3 w-3",
                                strokeWidth: 2
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            statusLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-start gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: `mt-0.5 h-3.5 w-3.5 shrink-0 ${config.accent}`,
                        strokeWidth: 1.75
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[13px] font-medium leading-snug text-[#3a3a38]",
                                children: finding.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            finding.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[11px] text-[#8a8a86]",
                                children: finding.subtitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-3 text-[12px] leading-relaxed text-[#6a6a66]",
                children: finding.reason
            }, void 0, false, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                className: "mb-3 rounded border-l-2 border-[#e4e4e0] bg-white/60 py-1 pl-2.5 pr-1 text-[11px] italic leading-relaxed text-[#7a7a76]",
                children: [
                    "“",
                    finding.spanText,
                    "”"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            finding.type === "clarity" && finding.suggestedRewrite && isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 rounded-md border border-[#ececea] bg-white px-2.5 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]",
                        children: "Suggested wording"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12px] leading-relaxed text-[#4a4a48]",
                        children: finding.suggestedRewrite
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this),
            finding.type === "fallacy" && fallacyExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    finding.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-[11px] text-[#8a8a86]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-[#6a6a66]",
                                children: "Fallacy: "
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this),
                            finding.subtitle
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 163,
                        columnNumber: 13
                    }, this),
                    finding.confidence && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-[11px] text-[#8a8a86]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-[#6a6a66]",
                                children: "Confidence: "
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this),
                            finding.confidence
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 169,
                        columnNumber: 13
                    }, this),
                    finding.example && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3 text-[11px] leading-relaxed text-[#8a8a86]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-[#6a6a66]",
                                children: "Example: "
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 176,
                                columnNumber: 15
                            }, this),
                            finding.example
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 175,
                        columnNumber: 13
                    }, this),
                    finding.suggestedRewrite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 rounded-md border border-[#ececea] bg-white px-2.5 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]",
                                children: "Suggested wording"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12px] leading-relaxed text-[#4a4a48]",
                                children: finding.suggestedRewrite
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 181,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            finding.status === "disputed" && finding.disputeReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-3 rounded-md border border-[#ebdede] bg-white/60 px-2.5 py-2 text-[11px] leading-relaxed text-[#7a7a76]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-[#6a6a66]",
                        children: "Your dispute: "
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    finding.disputeReason
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this),
            isOpen && finding.type === "clarity" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        variant: "primary",
                        onClick: ()=>onUseSuggestion(finding.id),
                        children: "Use suggestion"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        onClick: ()=>onKeepAsIs(finding.id),
                        children: "Keep as-is"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this),
            isOpen && finding.type === "claim" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>setSourcePickerOpen((open)=>!open),
                                children: "Attach source"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>onMarkAsOpinion(finding.id),
                                children: "Mark as opinion"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 215,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                variant: "muted",
                                onClick: ()=>onKeepAsIs(finding.id),
                                children: "Keep as-is"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 218,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this),
                    sourcePickerOpen && finding.sources && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SourcePopover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SourcePopover"], {
                        sources: finding.sources,
                        onSelect: (sourceId)=>{
                            onAttachSource(finding.id, sourceId);
                            setSourcePickerOpen(false);
                        },
                        onClose: ()=>setSourcePickerOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 223,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            isOpen && finding.type === "fallacy" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            !fallacyExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>setFallacyExpanded(true),
                                children: "See fix"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 239,
                                columnNumber: 15
                            }, this),
                            fallacyExpanded && finding.suggestedRewrite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                variant: "primary",
                                onClick: ()=>onUseSuggestion(finding.id),
                                children: "Use this wording"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 244,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                variant: fallacyExpanded ? "default" : "muted",
                                onClick: ()=>onKeepAsIs(finding.id),
                                children: "Keep as-is"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this),
                            !disputeOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                variant: "muted",
                                onClick: ()=>setDisputeOpen(true),
                                children: "Dispute"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 255,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this),
                    disputeOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: disputeReason,
                                onChange: (e)=>setDisputeReason(e.target.value),
                                placeholder: "Why do you disagree with this finding?",
                                rows: 2,
                                className: "w-full resize-none rounded-md border border-[#e4e4e0] bg-white px-2.5 py-2 text-[12px] leading-relaxed text-[#4a4a48] outline-none focus:border-[#c47a7a]/50"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 263,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                        variant: "primary",
                                        onClick: handleDisputeSubmit,
                                        children: "Submit dispute"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                                        lineNumber: 271,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                        variant: "muted",
                                        onClick: ()=>{
                                            setDisputeOpen(false);
                                            setDisputeReason("");
                                        },
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                                        lineNumber: 274,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 270,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 262,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/FindingCard.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(FindingCard, "fRLCRGEpBSsKzUkv94FmQ+qTbiA=");
_c1 = FindingCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionButton");
__turbopack_context__.k.register(_c1, "FindingCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/FindingsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FindingsPanel",
    ()=>FindingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/FindingCard.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function FindingsPanel({ findings, onUseSuggestion, onKeepAsIs, onAttachSource, onMarkAsOpinion, onDispute }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 8
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.35,
            ease: "easeOut"
        },
        className: "flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                        children: "Judge review"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-[#e8e8e4] bg-white px-2 py-0.5 text-[11px] text-[#8a8a86]",
                        children: [
                            findings.length,
                            " findings"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3",
                children: findings.map((finding, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 6
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.3,
                            delay: index * 0.06,
                            ease: "easeOut"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FindingCard"], {
                            finding: finding,
                            onUseSuggestion: onUseSuggestion,
                            onKeepAsIs: onKeepAsIs,
                            onAttachSource: onAttachSource,
                            onMarkAsOpinion: onMarkAsOpinion,
                            onDispute: onDispute
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    }, finding.id, false, {
                        fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/FindingsPanel.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = FindingsPanel;
var _c;
__turbopack_context__.k.register(_c, "FindingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/PublishedArgumentView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublishedArgumentView",
    ()=>PublishedArgumentView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.mjs [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/buildPublishedArgument.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockPublishedArguments.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/highlightCitations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockJudge.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function CitationText({ segments, sources }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: segments.map((segment, i)=>{
            if (segment.citationIndex === undefined) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: segment.text
                }, i, false, {
                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                    lineNumber: 29,
                    columnNumber: 18
                }, this);
            }
            const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCitationColor"])(segment.citationIndex);
            const marker = segment.citationIndex + 1;
            const sourceId = `source-${sources[segment.citationIndex]?.id}`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mark", {
                        className: "rounded-[2px] underline decoration-2 underline-offset-[3px]",
                        style: {
                            backgroundColor: color.bg,
                            textDecorationColor: color.underline
                        },
                        children: segment.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 38,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `#${sourceId}`,
                        className: "ml-0.5 inline-flex align-super text-[10px] font-semibold no-underline transition-opacity hover:opacity-70",
                        style: {
                            color: color.marker
                        },
                        "aria-label": `Source ${marker}`,
                        children: [
                            "[",
                            marker,
                            "]"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 37,
                columnNumber: 11
            }, this);
        })
    }, void 0, false);
}
_c = CitationText;
function SourceListItem({ source, index }) {
    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCitationColor"])(index);
    const sourceId = `source-${source.id}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        id: sourceId,
        href: source.url ?? "#",
        target: source.url ? "_blank" : undefined,
        rel: source.url ? "noopener noreferrer" : undefined,
        className: "group scroll-mt-24 rounded-lg border bg-white p-3.5 transition-colors hover:bg-[#fdfdfc]",
        style: {
            borderColor: color.ring
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1.5 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold",
                        style: {
                            backgroundColor: color.bg,
                            color: color.marker
                        },
                        children: index + 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[12px] font-medium leading-snug text-[#2a2a28] group-hover:underline",
                        children: source.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    source.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                        className: "ml-auto h-3 w-3 shrink-0 text-[#b0b0ac] opacity-0 transition-opacity group-hover:opacity-100"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "pl-7 text-[11px] text-[#8a8a86]",
                children: [
                    source.publisher,
                    source.isSample && " · sample link"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c1 = SourceListItem;
function PublishedArgumentView({ argument, onBack, variant = "feed" }) {
    const sourceIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSourceIndex"])(argument);
    const segments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highlightCitations"])(argument.text, argument.citations, sourceIndex);
    const isAuthor = variant === "author";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 6
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.3,
            ease: "easeOut"
        },
        className: `mx-auto w-full px-4 py-8 lg:px-8 ${isAuthor ? "max-w-3xl" : "max-w-7xl"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onBack,
                className: "mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6a6a66] transition-colors hover:text-[#1a1a18]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    isAuthor ? "Back to edit" : "Back to debate"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOTION"]
            }, void 0, false, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#ececea] text-[12px] font-medium text-[#5a5a58]",
                                children: argument.author.split(" ").map((n)=>n[0]).join("")
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] font-medium text-[#1a1a18]",
                                        children: argument.author
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-[#9a9a96]",
                                        children: argument.postedAt
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    isAuthor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1 rounded-full border border-[#dce4ef] bg-[#f4f7fb] px-2.5 py-1 text-[11px] text-[#5a7a9e]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                className: "h-3 w-3",
                                strokeWidth: 1.75
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatByline"])(argument)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1 rounded-full border border-[#dce4ef] bg-[#f4f7fb] px-2.5 py-1 text-[11px] text-[#5a7a9e]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                className: "h-3 w-3",
                                strokeWidth: 1.75
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            "Vetted by Parliavent"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            (argument.contestedFallacies?.length ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex flex-wrap gap-2",
                children: argument.contestedFallacies.map((fallacy)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-[#ebdede] bg-[#faf5f5] px-2.5 py-1 text-[11px] text-[#9e5a5a]",
                        children: [
                            "Author contests: ",
                            fallacy.toLowerCase()
                        ]
                    }, fallacy, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 173,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 171,
                columnNumber: 9
            }, this),
            argument.caveats?.map((caveat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-4 text-[12px] italic text-[#8a8a86]",
                    children: caveat
                }, caveat, false, {
                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this)),
            isAuthor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-[#e4e4e0] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-10 sm:py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap text-[19px] leading-[1.85] tracking-[-0.01em] text-[#1a1a18] sm:text-[21px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CitationText, {
                                    segments: segments,
                                    sources: argument.sources
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                    lineNumber: 194,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 193,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    argument.sources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                                children: "Sources"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 201,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2.5",
                                children: argument.sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceListItem, {
                                        source: source,
                                        index: index
                                    }, source.id, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 206,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 204,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-[11px] leading-relaxed text-[#a8a8a4]",
                                children: "Highlighted phrases match the numbered source color in the text."
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 209,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 200,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-8 lg:flex-row lg:gap-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "min-w-0 flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-[#e4e4e0] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-8 sm:py-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap text-[19px] leading-[1.8] tracking-[-0.01em] text-[#1a1a18] sm:text-[20px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CitationText, {
                                    segments: segments,
                                    sources: argument.sources
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                    lineNumber: 220,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 219,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-full shrink-0 lg:w-[300px] xl:w-[340px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                                children: "Sources"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2.5",
                                children: argument.sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceListItem, {
                                        source: source,
                                        index: index
                                    }, source.id, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 232,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-[11px] leading-relaxed text-[#a8a8a4]",
                                children: "Highlighted phrases match the numbered source color in the text."
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_c2 = PublishedArgumentView;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CitationText");
__turbopack_context__.k.register(_c1, "SourceListItem");
__turbopack_context__.k.register(_c2, "PublishedArgumentView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/readiness.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getReadiness",
    ()=>getReadiness
]);
const RESOLVED_STATUSES = new Set([
    "resolved",
    "ignored",
    "disputed",
    "source_attached",
    "marked_opinion"
]);
function getReadiness(findings) {
    const total = findings.length;
    const resolved = findings.filter((f)=>RESOLVED_STATUSES.has(f.status)).length;
    const percent = total === 0 ? 100 : Math.round(resolved / total * 100);
    let label = "Ready to post";
    if (resolved === 0) {
        label = `${total} item${total === 1 ? "" : "s"} to review`;
    } else if (resolved < total) {
        label = `${total - resolved} item${total - resolved === 1 ? "" : "s"} remaining`;
    }
    return {
        resolved,
        total,
        percent,
        label
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/ReadinessBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReadinessBar",
    ()=>ReadinessBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$readiness$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/readiness.ts [app-client] (ecmascript)");
"use client";
;
;
;
function ReadinessBar({ findings, onPost }) {
    const { resolved, total, percent, label } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$readiness$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getReadiness"])(findings);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "fixed inset-x-0 bottom-0 z-10 border-t border-[#e8e8e4] bg-[#fafaf8]/90 backdrop-blur-sm lg:sticky lg:bottom-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-1.5 flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "truncate text-[12px] font-medium text-[#4a4a48]",
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                                    lineNumber: 20,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "shrink-0 text-[11px] text-[#9a9a96]",
                                    children: [
                                        resolved,
                                        "/",
                                        total,
                                        " resolved"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                                    lineNumber: 23,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1 overflow-hidden rounded-full bg-[#ececea]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "h-full rounded-full bg-[#8ab89a]",
                                initial: {
                                    width: 0
                                },
                                animate: {
                                    width: `${percent}%`
                                },
                                transition: {
                                    duration: 0.5,
                                    ease: "easeOut"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onPost,
                    className: "shrink-0 rounded-lg border border-[#1a1a18] bg-[#1a1a18] px-4 py-2 text-[12px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#2a2a28]",
                    children: "Post"
                }, void 0, false, {
                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/debate/ReadinessBar.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/debate/ReadinessBar.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = ReadinessBar;
var _c;
__turbopack_context__.k.register(_c, "ReadinessBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/DebateApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DebateApp",
    ()=>DebateApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$applyUserEdit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/applyUserEdit.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/buildPublishedArgument.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/citationsFromFindings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockJudge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ArgumentEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ArgumentEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/FindingsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/PublishedArgumentView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ReadinessBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ReadinessBar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function DebateApp({ embedded = false }) {
    _s();
    const [argumentText, setArgumentText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEED_ARGUMENT"]);
    const [findings, setFindings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_FINDINGS"]);
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("composer");
    const citations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DebateApp.useMemo[citations]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["citationsFromFindings"])(findings)
    }["DebateApp.useMemo[citations]"], [
        findings
    ]);
    const attachedSources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DebateApp.useMemo[attachedSources]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourcesFromFindings"])(findings)
    }["DebateApp.useMemo[attachedSources]"], [
        findings
    ]);
    const updateFinding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DebateApp.useCallback[updateFinding]": (findingId, patch)=>{
            setFindings({
                "DebateApp.useCallback[updateFinding]": (prev)=>prev.map({
                        "DebateApp.useCallback[updateFinding]": (f)=>f.id === findingId ? {
                                ...f,
                                ...patch
                            } : f
                    }["DebateApp.useCallback[updateFinding]"])
            }["DebateApp.useCallback[updateFinding]"]);
        }
    }["DebateApp.useCallback[updateFinding]"], []);
    const applySuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DebateApp.useCallback[applySuggestion]": (findingId)=>{
            setFindings({
                "DebateApp.useCallback[applySuggestion]": (prev)=>{
                    const finding = prev.find({
                        "DebateApp.useCallback[applySuggestion].finding": (f)=>f.id === findingId
                    }["DebateApp.useCallback[applySuggestion].finding"]);
                    if (!finding?.suggestedRewrite) return prev;
                    setArgumentText({
                        "DebateApp.useCallback[applySuggestion]": (text)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$applyUserEdit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyUserApprovedEdit"])({
                                text,
                                spanText: finding.spanText,
                                replacement: finding.suggestedRewrite
                            })
                    }["DebateApp.useCallback[applySuggestion]"]);
                    return prev.map({
                        "DebateApp.useCallback[applySuggestion]": (f)=>f.id === findingId ? {
                                ...f,
                                status: "resolved"
                            } : f
                    }["DebateApp.useCallback[applySuggestion]"]);
                }
            }["DebateApp.useCallback[applySuggestion]"]);
        }
    }["DebateApp.useCallback[applySuggestion]"], []);
    const keepAsIs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DebateApp.useCallback[keepAsIs]": (findingId)=>{
            updateFinding(findingId, {
                status: "ignored"
            });
        }
    }["DebateApp.useCallback[keepAsIs]"], [
        updateFinding
    ]);
    const attachSource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DebateApp.useCallback[attachSource]": (findingId, sourceId)=>{
            updateFinding(findingId, {
                status: "source_attached",
                selectedSourceId: sourceId
            });
        }
    }["DebateApp.useCallback[attachSource]"], [
        updateFinding
    ]);
    const markAsOpinion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DebateApp.useCallback[markAsOpinion]": (findingId)=>{
            updateFinding(findingId, {
                status: "marked_opinion"
            });
        }
    }["DebateApp.useCallback[markAsOpinion]"], [
        updateFinding
    ]);
    const disputeFinding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DebateApp.useCallback[disputeFinding]": (findingId, reason)=>{
            updateFinding(findingId, {
                status: "disputed",
                disputeReason: reason
            });
        }
    }["DebateApp.useCallback[disputeFinding]"], [
        updateFinding
    ]);
    const publishedArgument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DebateApp.useMemo[publishedArgument]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildPublishedArgument"])({
                text: argumentText,
                findings
            })
    }["DebateApp.useMemo[publishedArgument]"], [
        argumentText,
        findings
    ]);
    if (currentView === "published") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublishedArgumentView"], {
            argument: publishedArgument,
            variant: "author",
            onBack: ()=>setCurrentView("composer")
        }, void 0, false, {
            fileName: "[project]/src/components/debate/DebateApp.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-1 flex-col",
        children: [
            embedded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-[#e8e8e4] bg-[#fafaf8]/60",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-4 py-5 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                            children: "Motion"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateApp.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "max-w-3xl text-xl font-medium leading-snug tracking-tight text-[#1a1a18] sm:text-2xl",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOTION"]
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateApp.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/DebateApp.tsx",
                    lineNumber: 101,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DebateApp.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 px-4 pb-28 pt-6 lg:flex-row lg:gap-8 lg:px-8 lg:pb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "min-h-[420px] flex-1 lg:min-h-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ArgumentEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArgumentEditor"], {
                            text: argumentText,
                            findings: findings,
                            citations: citations,
                            attachedSources: attachedSources,
                            onChange: setArgumentText
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateApp.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateApp.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-full shrink-0 lg:w-[340px] xl:w-[380px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FindingsPanel"], {
                            findings: findings,
                            onUseSuggestion: applySuggestion,
                            onKeepAsIs: keepAsIs,
                            onAttachSource: attachSource,
                            onMarkAsOpinion: markAsOpinion,
                            onDispute: disputeFinding
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateApp.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateApp.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateApp.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ReadinessBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReadinessBar"], {
                findings: findings,
                onPost: ()=>setCurrentView("published")
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DebateApp.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DebateApp.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(DebateApp, "Km1ZjQCJVM+nykeV4YWKw2AlkE8=");
_c = DebateApp;
var _c;
__turbopack_context__.k.register(_c, "DebateApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/SiteHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const navItems = [
    {
        screen: "feed",
        label: "Debate"
    },
    {
        screen: "composer",
        label: "Write"
    }
];
function SiteHeader({ screen, onNavigate, subtitle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-20 border-b border-[#e8e8e4] bg-[#fafaf8]/90 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onNavigate("feed"),
                    className: "flex items-center gap-3 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[13px] font-semibold tracking-tight text-[#1a1a18]",
                            children: "Parliavent"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this),
                        subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "h-3 w-px bg-[#dddcd8]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                                    lineNumber: 28,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[#a8a8a4]",
                                    children: subtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                                    lineNumber: 29,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex items-center gap-1",
                    children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onNavigate(item.screen),
                            className: `rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${screen === item.screen || screen === "argument" && item.screen === "feed" ? "bg-[#ececea] text-[#1a1a18]" : "text-[#6a6a66] hover:bg-[#f0f0ec] hover:text-[#3a3a38]"}`,
                            children: item.label
                        }, item.screen, false, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 38,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/debate/SiteHeader.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/debate/SiteHeader.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = SiteHeader;
var _c;
__turbopack_context__.k.register(_c, "SiteHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/debate/ParliaventApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ParliaventApp",
    ()=>ParliaventApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/DebateFeed.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateApp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/DebateApp.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/PublishedArgumentView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SiteHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/SiteHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockPublishedArguments.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function ParliaventApp() {
    _s();
    const [screen, setScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("feed");
    const [selectedArgumentId, setSelectedArgumentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const selectedArgument = selectedArgumentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublishedArgument"])(selectedArgumentId) : undefined;
    function openArgument(id) {
        setSelectedArgumentId(id);
        setScreen("argument");
    }
    function navigate(next) {
        if (next !== "argument") {
            setSelectedArgumentId(null);
        }
        setScreen(next);
    }
    const subtitle = screen === "composer" ? "Composer" : screen === "argument" ? "Argument" : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-[#f7f7f5]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SiteHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SiteHeader"], {
                screen: screen,
                onNavigate: navigate,
                subtitle: subtitle
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            screen === "feed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DebateFeed"], {
                onOpenArgument: openArgument,
                onWrite: ()=>navigate("composer")
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this),
            screen === "argument" && selectedArgument && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublishedArgumentView"], {
                argument: selectedArgument,
                onBack: ()=>navigate("feed")
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this),
            screen === "argument" && !selectedArgument && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto px-4 py-16 text-center text-[14px] text-[#6a6a66]",
                children: [
                    "Argument not found.",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>navigate("feed"),
                        className: "font-medium text-[#1a1a18] underline",
                        children: "Back to debate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this),
            screen === "composer" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateApp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DebateApp"], {
                embedded: true
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 71,
                columnNumber: 33
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ParliaventApp.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(ParliaventApp, "1MyH3jpU589V8BSSIMPBxBQQJ9s=");
_c = ParliaventApp;
var _c;
__turbopack_context__.k.register(_c, "ParliaventApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0949xxo._.js.map