module.exports = [
"[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_ISSUES",
    ()=>MOCK_ISSUES,
    "MOCK_POSTS",
    ()=>MOCK_POSTS,
    "formatDeskBangs",
    ()=>formatDeskBangs,
    "getHotIssues",
    ()=>getHotIssues,
    "getIssue",
    ()=>getIssue,
    "getPost",
    ()=>getPost,
    "getResponsesForStarter",
    ()=>getResponsesForStarter,
    "getStartersForIssue",
    ()=>getStartersForIssue
]);
const MOCK_ISSUES = [
    {
        id: "issue-cars",
        title: "Should cities ban cars from downtown areas?",
        description: "Traffic, livability, and access — what should downtown policy look like?",
        category: "Urban policy",
        starterCount: 4,
        responseCount: 12,
        deskBangs: 847,
        lastActive: "12m ago",
        isHot: true
    },
    {
        id: "issue-ubi",
        title: "Is universal basic income feasible at national scale?",
        description: "Funding, incentives, and whether pilots tell us anything useful.",
        category: "Economics",
        starterCount: 6,
        responseCount: 31,
        deskBangs: 1204,
        lastActive: "34m ago",
        isHot: true
    },
    {
        id: "issue-ai-jobs",
        title: "Will AI replace most white-collar jobs within a decade?",
        description: "Automation timelines, reskilling, and what history suggests.",
        category: "Technology",
        starterCount: 8,
        responseCount: 44,
        deskBangs: 2103,
        lastActive: "1h ago",
        isHot: true
    },
    {
        id: "issue-nuclear",
        title: "Should we build more nuclear power plants now?",
        description: "Climate targets, cost, safety, and grid reliability.",
        category: "Energy",
        starterCount: 3,
        responseCount: 9,
        deskBangs: 412,
        lastActive: "3h ago"
    },
    {
        id: "issue-remote",
        title: "Is mandatory return-to-office good for companies?",
        description: "Productivity claims, culture, and worker preference.",
        category: "Work",
        starterCount: 5,
        responseCount: 18,
        deskBangs: 623,
        lastActive: "5h ago"
    }
];
const MOCK_POSTS = [
    {
        id: "arg-maya",
        kind: "starter",
        issueId: "issue-cars",
        author: "Maya Chen",
        postedAt: "2 days ago",
        deskBangs: 142,
        userBanged: false,
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
        id: "resp-alex-1",
        kind: "response",
        issueId: "issue-cars",
        parentId: "arg-maya",
        author: "Alex Rivera",
        postedAt: "1 day ago",
        deskBangs: 67,
        userBanged: true,
        text: "The Copenhagen comparison ignores scale. American downtowns were built around the car — you can't retrofit a century of sprawl with bike lanes. Congestion pricing keeps access for deliveries and emergency vehicles while still cutting traffic.",
        sources: [
            {
                id: "src-london-1",
                title: "Central London congestion charge: ten-year impact assessment",
                publisher: "Transport for London",
                url: "https://tfl.gov.uk/corporate/publications-and-reports/congestion-charge",
                isSample: true
            }
        ],
        citations: [
            {
                id: "cite-resp-1",
                spanText: "Congestion pricing keeps access for deliveries and emergency vehicles while still cutting traffic",
                sourceId: "src-london-1"
            }
        ]
    },
    {
        id: "resp-sam-1",
        kind: "response",
        issueId: "issue-cars",
        parentId: "arg-maya",
        author: "Sam Okoye",
        postedAt: "18h ago",
        deskBangs: 28,
        userBanged: false,
        text: "Partial bans sound reasonable until you ask who gets priced out. Delivery drivers, nurses on night shift, disabled residents — a downtown ban without massive transit investment is regressive.",
        sources: [],
        citations: [],
        caveats: [
            "Posted with unresolved review item."
        ]
    },
    {
        id: "resp-maya-to-alex",
        kind: "response",
        issueId: "issue-cars",
        parentId: "resp-alex-1",
        author: "Maya Chen",
        postedAt: "20h ago",
        deskBangs: 41,
        userBanged: false,
        text: "Fair point on scale — but Copenhagen wasn't always bike-first either. They built the infrastructure over decades. The question isn't whether American cities can flip overnight, it's whether partial bans plus investment are a viable path here too.",
        sources: [],
        citations: []
    },
    {
        id: "resp-james-to-alex",
        kind: "response",
        issueId: "issue-cars",
        parentId: "resp-alex-1",
        author: "James Okonkwo",
        postedAt: "14h ago",
        deskBangs: 19,
        userBanged: false,
        text: "Congestion pricing and partial bans aren't mutually exclusive. London did pricing first, then expanded low-traffic zones. Alex is right that a blanket ban removes flexibility — but that doesn't mean doing nothing.",
        sources: [],
        citations: []
    },
    {
        id: "resp-elena-to-sam",
        kind: "response",
        issueId: "issue-cars",
        parentId: "resp-sam-1",
        author: "Elena Vasquez",
        postedAt: "12h ago",
        deskBangs: 33,
        userBanged: false,
        text: "This is the equity argument that actually matters. Any policy needs exemptions or subsidies for the people Sam named — otherwise partial bans just shift the burden onto workers who can't work from home.",
        sources: [],
        citations: []
    },
    {
        kind: "starter",
        issueId: "issue-cars",
        author: "James Okonkwo",
        postedAt: "4 days ago",
        deskBangs: 89,
        userBanged: false,
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
        kind: "starter",
        issueId: "issue-cars",
        author: "Elena Vasquez",
        postedAt: "1 week ago",
        deskBangs: 54,
        userBanged: false,
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
    },
    {
        id: "arg-ubi-1",
        kind: "starter",
        issueId: "issue-ubi",
        author: "Priya Sharma",
        postedAt: "6h ago",
        deskBangs: 203,
        userBanged: false,
        text: "Finland's two-year basic income pilot showed recipients reported less stress and no significant drop in employment. The cost argument assumes we add UBI on top of every existing program — most serious proposals replace a patchwork of means-tested benefits.",
        sources: [
            {
                id: "src-ubi-1",
                title: "Finland basic income experiment: final results",
                publisher: "Kela Research",
                isSample: true
            }
        ],
        citations: [
            {
                id: "cite-ubi-1",
                spanText: "Finland's two-year basic income pilot showed recipients reported less stress and no significant drop in employment",
                sourceId: "src-ubi-1"
            }
        ]
    },
    {
        id: "arg-ai-1",
        kind: "starter",
        issueId: "issue-ai-jobs",
        author: "Marcus Webb",
        postedAt: "45m ago",
        deskBangs: 318,
        userBanged: false,
        text: "Every prior automation wave created more jobs than it destroyed — but with a painful transition period. AI may compress that transition into years instead of decades. The question isn't whether jobs disappear forever, but whether we can retrain fast enough.",
        sources: [],
        citations: [],
        contestedFallacies: [
            "Appeal to tradition"
        ]
    }
];
function getIssue(id) {
    return MOCK_ISSUES.find((i)=>i.id === id);
}
function getPost(id) {
    return MOCK_POSTS.find((p)=>p.id === id);
}
function getStartersForIssue(issueId) {
    return MOCK_POSTS.filter((p)=>p.issueId === issueId && p.kind === "starter");
}
function getResponsesForStarter(starterId) {
    return MOCK_POSTS.filter((p)=>p.parentId === starterId && p.kind === "response");
}
function getHotIssues() {
    return MOCK_ISSUES.filter((i)=>i.isHot);
}
function formatDeskBangs(count) {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return String(count);
}
}),
"[project]/src/components/debate/DebateFeed.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DebateFeed",
    ()=>DebateFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.mjs [app-ssr] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function IssueCard({ issue, onOpen, onNewStarter }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-900/80",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onOpen,
                className: "w-full px-5 py-4 text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2.5 flex flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold uppercase tracking-wider text-zinc-500",
                                children: issue.category
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            issue.isHot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 rounded-md bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                                        className: "h-3 w-3",
                                        strokeWidth: 2.5
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                        lineNumber: 34,
                                        columnNumber: 15
                                    }, this),
                                    "Hot"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] text-zinc-600",
                                children: issue.lastActive
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-2 text-[17px] font-bold leading-snug text-zinc-50 group-hover:text-white sm:text-[18px]",
                        children: issue.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3 line-clamp-2 text-[13px] leading-relaxed text-zinc-400",
                        children: issue.description
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1.5 font-medium text-zinc-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": true,
                                        children: "🪑"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDeskBangs"])(issue.deskBangs)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "h-3.5 w-3.5",
                                        strokeWidth: 2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    issue.starterCount,
                                    " starters · ",
                                    issue.responseCount,
                                    " replies"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-t border-zinc-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onOpen,
                        className: "flex-1 py-2.5 text-[12px] font-semibold text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100",
                        children: "Open thread"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onNewStarter();
                        },
                        className: "flex flex-1 items-center justify-center gap-1.5 border-l border-zinc-800 py-2.5 text-[12px] font-semibold text-teal-400 transition-colors hover:bg-teal-500/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-3.5 w-3.5",
                                strokeWidth: 2.5
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            "Starter"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DebateFeed.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function DebateFeed({ onOpenIssue, onNewStarter }) {
    const hotIssues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHotIssues"])();
    const otherIssues = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_ISSUES"].filter((i)=>!i.isHot);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto flex w-full max-w-5xl gap-8 px-4 py-6 lg:px-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold tracking-tight text-zinc-50",
                                children: "Popping now"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[13px] text-zinc-500",
                                children: "Live debates · vetted arguments · desk bangs"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-5 flex gap-4 border-b border-zinc-800",
                        children: [
                            "hot",
                            "new",
                            "top"
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: `-mb-px border-b-2 pb-2.5 text-[13px] font-semibold capitalize transition-colors ${tab === "hot" ? "border-teal-400 text-zinc-50" : "border-transparent text-zinc-600 hover:text-zinc-400"}`,
                                children: tab === "hot" ? "Popping" : tab
                            }, tab, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3",
                            children: hotIssues.map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IssueCard, {
                                    issue: issue,
                                    onOpen: ()=>onOpenIssue(issue.id),
                                    onNewStarter: ()=>onNewStarter(issue.id)
                                }, issue.id, false, {
                                    fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                    lineNumber: 119,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateFeed.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    otherIssues.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-600",
                                children: "More"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-3",
                                children: otherIssues.map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IssueCard, {
                                        issue: issue,
                                        onOpen: ()=>onOpenIssue(issue.id),
                                        onNewStarter: ()=>onNewStarter(issue.id)
                                    }, issue.id, false, {
                                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/DebateFeed.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "hidden w-[260px] shrink-0 lg:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sticky top-[65px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "mb-2 text-[13px] font-bold text-zinc-200",
                            children: "How it works"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateFeed.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 text-[12px] leading-relaxed text-zinc-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-zinc-400",
                                            children: "Starters"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this),
                                        " open a position.",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-zinc-400",
                                            children: "Replies"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, this),
                                        " nest under any post — like Threads."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Every post is reviewed before publishing. Attach sources, dispute flags, post anyway."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-teal-400/90",
                                            children: "🪑 Desk bang"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        "when someone lands a point."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/DebateFeed.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/DebateFeed.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/DebateFeed.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DebateFeed.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DebateFeed.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/applyUserEdit.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/citationsFromFindings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/buildPublishedArgument.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPublishedArgument",
    ()=>buildPublishedArgument,
    "formatByline",
    ()=>formatByline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/citationsFromFindings.ts [app-ssr] (ecmascript)");
;
function buildPublishedArgument(params) {
    const sources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sourcesFromFindings"])(params.findings);
    const citations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["citationsFromFindings"])(params.findings);
    const contestedFallacies = params.findings.filter((f)=>f.type === "fallacy" && f.status === "disputed").map((f)=>f.subtitle).filter((name)=>Boolean(name));
    const hasOpenFindings = params.findings.some((f)=>f.status === "open");
    return {
        id: `user-${Date.now()}`,
        author: params.author ?? "You",
        postedAt: "Just now",
        text: params.text,
        sources,
        citations,
        kind: params.kind,
        issueId: params.issueId,
        parentId: params.parentId,
        deskBangs: 0,
        userBanged: false,
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
}),
"[project]/src/lib/mockJudge.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_FINDINGS",
    ()=>MOCK_FINDINGS,
    "MOTION",
    ()=>MOTION,
    "SEED_ARGUMENT",
    ()=>SEED_ARGUMENT,
    "SEED_RESPONSE",
    ()=>SEED_RESPONSE
]);
const MOTION = "Should cities ban cars from downtown areas?";
const SEED_ARGUMENT = "Cities need to ban cars downtown. Every time I go there's traffic, honking, and someone almost gets hit. If we don't ban cars now, downtowns will become unlivable death zones. Europe does it and their cities are way nicer.";
const SEED_RESPONSE = "Partial bans sound reasonable, but American downtowns were built around the car. Congestion pricing keeps access for deliveries and emergency vehicles while still cutting traffic — a full ban removes that flexibility.";
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
}),
"[project]/src/lib/highlightCitations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/components/debate/ArgumentEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArgumentEditor",
    ()=>ArgumentEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/highlightCitations.ts [app-ssr] (ecmascript)");
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
    const sourceIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSourceIndex"])({
        id: "",
        author: "",
        postedAt: "",
        text,
        sources: attachedSources,
        citations
    });
    const segments = buildDisplaySegments(text, findings, citations, sourceIndex);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: segments.map((segment, i)=>{
            const content = segment.types.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: segment.text
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 122,
                columnNumber: 13
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mark", {
                className: `rounded-[2px] text-inherit ${segment.types.map((type)=>highlightStyles[type]).join(" ")}`,
                children: segment.text
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 124,
                columnNumber: 13
            }, this);
            if (segment.showCitationMarker && segment.citationIndex !== undefined) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        content,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sup", {
                            className: "ml-0.5 text-[10px] font-medium text-[#5a7a9e]",
                            title: attachedSources[segment.citationIndex]?.title ?? "Source",
                            children: [
                                "[",
                                segment.citationIndex + 1,
                                "]"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                            lineNumber: 137,
                            columnNumber: 15
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                    lineNumber: 135,
                    columnNumber: 13
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: content
            }, i, false, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 149,
                columnNumber: 16
            }, this);
        })
    }, void 0, false);
}
function ArgumentEditor({ text, findings, citations = [], attachedSources = [], onChange, label = "Your argument" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-baseline justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] text-[#b0b0ac]",
                        children: [
                            text.length,
                            " characters"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 rounded-xl border border-[#e4e4e0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-xl px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-[#1a1a18] sm:px-8 sm:py-8 sm:text-[20px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ArgumentDisplay, {
                            text: text,
                            findings: findings,
                            citations: citations,
                            attachedSources: attachedSources
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: text,
                        onChange: (e)=>onChange(e.target.value),
                        spellCheck: true,
                        className: "relative min-h-[380px] w-full resize-none rounded-xl bg-transparent px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-transparent caret-[#1a1a18] outline-none selection:bg-[#d4e4f4]/60 sm:min-h-[440px] sm:px-8 sm:py-8 sm:text-[20px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ArgumentEditor.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/ComposerShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerShell",
    ()=>ComposerShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PenLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.mjs [app-ssr] (ecmascript) <export default as PenLine>");
"use client";
;
;
function ComposerShell({ context, onBack, children }) {
    const isResponse = context.mode === "response";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-zinc-800 bg-zinc-900/60",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-4 py-4 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onBack,
                            className: "mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this),
                                "Cancel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isResponse ? "bg-teal-500/15" : "bg-zinc-800"}`,
                                    children: isResponse ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "h-4 w-4 text-teal-400",
                                        strokeWidth: 2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                        lineNumber: 39,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PenLine$3e$__["PenLine"], {
                                        className: "h-4 w-4 text-zinc-400",
                                        strokeWidth: 2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                        lineNumber: 44,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] font-bold uppercase tracking-widest text-zinc-600",
                                            children: isResponse ? "Reply" : "Starter"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                            lineNumber: 48,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "mt-0.5 text-lg font-bold leading-snug text-zinc-50 sm:text-xl",
                                            children: context.issueTitle
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        isResponse && context.parentAuthor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3.5 py-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1 text-[11px] font-semibold text-zinc-500",
                                                    children: [
                                                        "Replying to",
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-zinc-300",
                                                            children: context.parentAuthor
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                                            lineNumber: 58,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 19
                                                }, this),
                                                context.parentPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "line-clamp-2 text-[13px] leading-relaxed text-zinc-400",
                                                    children: [
                                                        "“",
                                                        context.parentPreview,
                                                        "”"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                                    lineNumber: 61,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                            lineNumber: 55,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-[12px] text-zinc-600",
                                            children: "Write → review judge findings → post. Your words, your call."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/ComposerShell.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ComposerShell.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/ComposerShell.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ComposerShell.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ComposerShell.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/SourcePopover.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SourcePopover",
    ()=>SourcePopover
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function SourcePopover({ sources, onSelect, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 rounded-lg border border-[#dce4ef] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-center justify-between px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]",
                        children: "Sample sources"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/SourcePopover.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-1",
                children: sources.map((source)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onSelect(source.id),
                            className: "w-full rounded-md border border-transparent px-2.5 py-2 text-left transition-colors hover:border-[#dce4ef] hover:bg-[#f4f7fb]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] font-medium text-[#4a4a48]",
                                    children: source.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/SourcePopover.tsx",
                                    lineNumber: 34,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/components/debate/FindingCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FindingCard",
    ()=>FindingCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.mjs [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SourcePopover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/SourcePopover.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const typeConfig = {
    clarity: {
        label: "Clarity",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
        accent: "text-[#9a7b3c]",
        border: "border-[#ebe3d4]",
        dot: "bg-[#c9a96e]"
    },
    claim: {
        label: "Claim",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        accent: "text-[#5a7a9e]",
        border: "border-[#dce4ef]",
        dot: "bg-[#7a9cc4]"
    },
    fallacy: {
        label: "Fallacy",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
function FindingCard({ finding, onUseSuggestion, onKeepAsIs, onAttachSource, onMarkAsOpinion, onDispute }) {
    const config = typeConfig[finding.type];
    const Icon = config.icon;
    const isOpen = finding.status === "open";
    const statusLabel = statusLabels[finding.status];
    const [fallacyExpanded, setFallacyExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sourcePickerOpen, setSourcePickerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [disputeOpen, setDisputeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [disputeReason, setDisputeReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    function handleDisputeSubmit() {
        const trimmed = disputeReason.trim();
        if (!trimmed) return;
        onDispute(finding.id, trimmed);
        setDisputeOpen(false);
        setDisputeReason("");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: `rounded-lg border bg-[#fafaf8] p-4 ${config.border} ${!isOpen ? "opacity-80" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2.5 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `h-1.5 w-1.5 rounded-full ${config.dot}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-[10px] font-medium uppercase tracking-[0.12em] ${config.accent}`,
                        children: config.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    finding.confidence && isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    statusLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto flex items-center gap-1 text-[10px] text-[#8ab89a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-start gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: `mt-0.5 h-3.5 w-3.5 shrink-0 ${config.accent}`,
                        strokeWidth: 1.75
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[13px] font-medium leading-snug text-[#3a3a38]",
                                children: finding.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            finding.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-3 text-[12px] leading-relaxed text-[#6a6a66]",
                children: finding.reason
            }, void 0, false, {
                fileName: "[project]/src/components/debate/FindingCard.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
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
            finding.type === "clarity" && finding.suggestedRewrite && isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 rounded-md border border-[#ececea] bg-white px-2.5 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]",
                        children: "Suggested wording"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            finding.type === "fallacy" && fallacyExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    finding.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-[11px] text-[#8a8a86]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    finding.confidence && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-[11px] text-[#8a8a86]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    finding.example && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3 text-[11px] leading-relaxed text-[#8a8a86]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    finding.suggestedRewrite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 rounded-md border border-[#ececea] bg-white px-2.5 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]",
                                children: "Suggested wording"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            finding.status === "disputed" && finding.disputeReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-3 rounded-md border border-[#ebdede] bg-white/60 px-2.5 py-2 text-[11px] leading-relaxed text-[#7a7a76]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            isOpen && finding.type === "clarity" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        variant: "primary",
                        onClick: ()=>onUseSuggestion(finding.id),
                        children: "Use suggestion"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
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
            isOpen && finding.type === "claim" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>setSourcePickerOpen((open)=>!open),
                                children: "Attach source"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>onMarkAsOpinion(finding.id),
                                children: "Mark as opinion"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 215,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
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
                    sourcePickerOpen && finding.sources && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SourcePopover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SourcePopover"], {
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
            isOpen && finding.type === "fallacy" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            !fallacyExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>setFallacyExpanded(true),
                                children: "See fix"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 239,
                                columnNumber: 15
                            }, this),
                            fallacyExpanded && finding.suggestedRewrite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                variant: "primary",
                                onClick: ()=>onUseSuggestion(finding.id),
                                children: "Use this wording"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 244,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                variant: fallacyExpanded ? "default" : "muted",
                                onClick: ()=>onKeepAsIs(finding.id),
                                children: "Keep as-is"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/FindingCard.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this),
                            !disputeOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
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
                    disputeOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                        variant: "primary",
                                        onClick: handleDisputeSubmit,
                                        children: "Submit dispute"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/FindingCard.tsx",
                                        lineNumber: 271,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
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
}),
"[project]/src/components/debate/FindingsPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FindingsPanel",
    ()=>FindingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/FindingCard.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function FindingsPanel({ findings, onUseSuggestion, onKeepAsIs, onAttachSource, onMarkAsOpinion, onDispute }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                        children: "Judge review"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/FindingsPanel.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3",
                children: findings.map((finding, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FindingCard"], {
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
}),
"[project]/src/lib/mockPublishedArguments.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITATION_PALETTE",
    ()=>CITATION_PALETTE,
    "getCitationColor",
    ()=>getCitationColor,
    "getPublishedArgument",
    ()=>getPublishedArgument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)");
;
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
function getPublishedArgument(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPost"])(id);
}
}),
"[project]/src/components/debate/DeskBangButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeskBangButton",
    ()=>DeskBangButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function DeskBangButton({ count, banged, onToggle, layout = "vertical", size = "md" }) {
    const iconSize = size === "sm" ? "text-sm" : "text-base";
    const textSize = size === "sm" ? "text-[11px]" : "text-[12px]";
    const padding = layout === "vertical" ? size === "sm" ? "px-1.5 py-2" : "px-2 py-2.5" : "px-2 py-1.5";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: (e)=>{
            e.stopPropagation();
            onToggle();
        },
        title: banged ? "Withdraw desk bang" : "Bang desk — good point",
        className: `group flex shrink-0 items-center justify-center gap-1.5 rounded-lg transition-all ${padding} ${layout === "vertical" ? "flex-col" : "flex-row"} ${banged ? "bg-teal-500/15 text-teal-400 ring-1 ring-teal-500/30" : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                initial: banged ? {
                    scale: 1.35,
                    rotate: -8
                } : false,
                animate: {
                    scale: 1,
                    rotate: 0
                },
                transition: {
                    type: "spring",
                    stiffness: 600,
                    damping: 14
                },
                className: `leading-none ${iconSize}`,
                "aria-hidden": true,
                children: "🪑"
            }, banged ? "banged" : "idle", false, {
                fileName: "[project]/src/components/debate/DeskBangButton.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `font-bold tabular-nums ${textSize} ${banged ? "text-teal-400" : "text-zinc-500 group-hover:text-zinc-300"}`,
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDeskBangs"])(count)
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DeskBangButton.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: banged ? "You banged the desk" : "Bang desk"
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DeskBangButton.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DeskBangButton.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/PublishedArgumentView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublishedArgumentView",
    ()=>PublishedArgumentView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.mjs [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/buildPublishedArgument.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockPublishedArguments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/highlightCitations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DeskBangButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/DeskBangButton.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function CitationText({ segments, sources }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: segments.map((segment, i)=>{
            if (segment.citationIndex === undefined) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: segment.text
                }, i, false, {
                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                    lineNumber: 33,
                    columnNumber: 18
                }, this);
            }
            const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCitationColor"])(segment.citationIndex);
            const marker = segment.citationIndex + 1;
            const sourceId = `source-${sources[segment.citationIndex]?.id}`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mark", {
                        className: "rounded-[2px] underline decoration-2 underline-offset-[3px]",
                        style: {
                            backgroundColor: color.bg,
                            textDecorationColor: color.underline
                        },
                        children: segment.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
                        lineNumber: 51,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 41,
                columnNumber: 11
            }, this);
        })
    }, void 0, false);
}
function SourceListItem({ source, index }) {
    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockPublishedArguments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCitationColor"])(index);
    const sourceId = `source-${source.id}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        id: sourceId,
        href: source.url ?? "#",
        target: source.url ? "_blank" : undefined,
        rel: source.url ? "noopener noreferrer" : undefined,
        className: "group scroll-mt-24 rounded-lg border bg-white p-3.5 transition-colors hover:bg-[#fdfdfc]",
        style: {
            borderColor: color.ring
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1.5 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold",
                        style: {
                            backgroundColor: color.bg,
                            color: color.marker
                        },
                        children: index + 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[12px] font-medium leading-snug text-[#2a2a28] group-hover:underline",
                        children: source.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    source.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                        className: "ml-auto h-3 w-3 shrink-0 text-[#b0b0ac] opacity-0 transition-opacity group-hover:opacity-100"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "pl-7 text-[11px] text-[#8a8a86]",
                children: [
                    source.publisher,
                    source.isSample && " · sample link"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
function PublishedArgumentView({ argument, onBack, variant = "feed", onDeskBang, onDone }) {
    const sourceIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSourceIndex"])(argument);
    const segments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$highlightCitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["highlightCitations"])(argument.text, argument.citations, sourceIndex);
    const isAuthor = variant === "author";
    const issue = argument.issueId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIssue"])(argument.issueId) : undefined;
    const contextLabel = issue?.title ?? "Argument";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBack,
                        className: "inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6a6a66] transition-colors hover:text-[#1a1a18]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            isAuthor ? "Back to edit" : "Back to thread"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    isAuthor && onDone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onDone,
                        className: "inline-flex items-center rounded-full border border-[#1a1a18] bg-[#1a1a18] px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#2a2a28]",
                        children: "View in debate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                children: contextLabel
            }, void 0, false, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-wrap items-center gap-3",
                children: [
                    !isAuthor && onDeskBang && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DeskBangButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeskBangButton"], {
                        count: argument.deskBangs ?? 0,
                        banged: argument.userBanged ?? false,
                        onToggle: onDeskBang,
                        layout: "horizontal"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#ececea] text-[12px] font-medium text-[#5a5a58]",
                                children: argument.author.split(" ").map((n)=>n[0]).join("")
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] font-medium text-[#1a1a18]",
                                        children: argument.author
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-[#9a9a96]",
                                        children: argument.postedAt
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    isAuthor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1 rounded-full border border-[#dce4ef] bg-[#f4f7fb] px-2.5 py-1 text-[11px] text-[#5a7a9e]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                className: "h-3 w-3",
                                strokeWidth: 1.75
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatByline"])(argument)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1 rounded-full border border-[#dce4ef] bg-[#f4f7fb] px-2.5 py-1 text-[11px] text-[#5a7a9e]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                className: "h-3 w-3",
                                strokeWidth: 1.75
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            "Vetted by Parliavent"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            (argument.contestedFallacies?.length ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex flex-wrap gap-2",
                children: argument.contestedFallacies.map((fallacy)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-[#ebdede] bg-[#faf5f5] px-2.5 py-1 text-[11px] text-[#9e5a5a]",
                        children: [
                            "Author contests: ",
                            fallacy.toLowerCase()
                        ]
                    }, fallacy, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 200,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, this),
            argument.caveats?.map((caveat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-4 text-[12px] italic text-[#8a8a86]",
                    children: caveat
                }, caveat, false, {
                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this)),
            isAuthor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-[#e4e4e0] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-10 sm:py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap text-[19px] leading-[1.85] tracking-[-0.01em] text-[#1a1a18] sm:text-[21px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CitationText, {
                                    segments: segments,
                                    sources: argument.sources
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                    lineNumber: 221,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 220,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this),
                    argument.sources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                                children: "Sources"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2.5",
                                children: argument.sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceListItem, {
                                        source: source,
                                        index: index
                                    }, source.id, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 233,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-[11px] leading-relaxed text-[#a8a8a4]",
                                children: "Highlighted phrases match the numbered source color in the text."
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 227,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 217,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-8 lg:flex-row lg:gap-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "min-w-0 flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-[#e4e4e0] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-8 sm:py-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap text-[19px] leading-[1.8] tracking-[-0.01em] text-[#1a1a18] sm:text-[20px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CitationText, {
                                    segments: segments,
                                    sources: argument.sources
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                    lineNumber: 247,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-full shrink-0 lg:w-[300px] xl:w-[340px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]",
                                children: "Sources"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2.5",
                                children: argument.sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceListItem, {
                                        source: source,
                                        index: index
                                    }, source.id, false, {
                                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 257,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-[11px] leading-relaxed text-[#a8a8a4]",
                                children: "Highlighted phrases match the numbered source color in the text."
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                        lineNumber: 252,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
                lineNumber: 243,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/PublishedArgumentView.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/readiness.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/components/debate/ReadinessBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReadinessBar",
    ()=>ReadinessBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$readiness$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/readiness.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ReadinessBar({ findings, onPost, postLabel = "Post" }) {
    const { resolved, total, percent, label } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$readiness$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getReadiness"])(findings);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "fixed inset-x-0 bottom-0 z-10 border-t border-[#e8e8e4] bg-[#fafaf8]/90 backdrop-blur-sm lg:sticky lg:bottom-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-1.5 flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "truncate text-[12px] font-medium text-[#4a4a48]",
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "shrink-0 text-[11px] text-[#9a9a96]",
                                    children: [
                                        resolved,
                                        "/",
                                        total,
                                        " resolved"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1 overflow-hidden rounded-full bg-[#ececea]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
                                lineNumber: 34,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onPost,
                    className: "shrink-0 rounded-lg border border-[#1a1a18] bg-[#1a1a18] px-4 py-2 text-[12px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#2a2a28]",
                    children: postLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/debate/ReadinessBar.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/debate/ReadinessBar.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/debate/ReadinessBar.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/DebateApp.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DebateApp",
    ()=>DebateApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$applyUserEdit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/applyUserEdit.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/buildPublishedArgument.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/citationsFromFindings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockJudge.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ArgumentEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ArgumentEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ComposerShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ComposerShell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/FindingsPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/PublishedArgumentView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ReadinessBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ReadinessBar.tsx [app-ssr] (ecmascript)");
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
;
;
function DebateApp({ context, onBack, onPosted, onFinished }) {
    const initialText = context.mode === "response" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SEED_RESPONSE"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SEED_ARGUMENT"];
    const [argumentText, setArgumentText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialText);
    const [findings, setFindings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockJudge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_FINDINGS"].map((f)=>({
                ...f
            })));
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("composer");
    const citations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["citationsFromFindings"])(findings), [
        findings
    ]);
    const attachedSources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$citationsFromFindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sourcesFromFindings"])(findings), [
        findings
    ]);
    const updateFinding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((findingId, patch)=>{
        setFindings((prev)=>prev.map((f)=>f.id === findingId ? {
                    ...f,
                    ...patch
                } : f));
    }, []);
    const applySuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((findingId)=>{
        setFindings((prev)=>{
            const finding = prev.find((f)=>f.id === findingId);
            if (!finding?.suggestedRewrite) return prev;
            setArgumentText((text)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$applyUserEdit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyUserApprovedEdit"])({
                    text,
                    spanText: finding.spanText,
                    replacement: finding.suggestedRewrite
                }));
            return prev.map((f)=>f.id === findingId ? {
                    ...f,
                    status: "resolved"
                } : f);
        });
    }, []);
    const keepAsIs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((findingId)=>{
        updateFinding(findingId, {
            status: "ignored"
        });
    }, [
        updateFinding
    ]);
    const attachSource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((findingId, sourceId)=>{
        updateFinding(findingId, {
            status: "source_attached",
            selectedSourceId: sourceId
        });
    }, [
        updateFinding
    ]);
    const markAsOpinion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((findingId)=>{
        updateFinding(findingId, {
            status: "marked_opinion"
        });
    }, [
        updateFinding
    ]);
    const disputeFinding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((findingId, reason)=>{
        updateFinding(findingId, {
            status: "disputed",
            disputeReason: reason
        });
    }, [
        updateFinding
    ]);
    const publishedArgument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPublishedArgument$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildPublishedArgument"])({
            text: argumentText,
            findings,
            kind: context.mode,
            issueId: context.issueId,
            parentId: context.parentId
        }), [
        argumentText,
        findings,
        context
    ]);
    const handlePost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        onPosted(publishedArgument);
        setCurrentView("published");
    }, [
        onPosted,
        publishedArgument
    ]);
    if (currentView === "published") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublishedArgumentView"], {
            argument: publishedArgument,
            variant: "author",
            onBack: ()=>setCurrentView("composer"),
            onDone: onFinished
        }, void 0, false, {
            fileName: "[project]/src/components/debate/DebateApp.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ComposerShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerShell"], {
        context: context,
        onBack: onBack,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 px-4 pb-28 pt-6 lg:flex-row lg:gap-8 lg:px-8 lg:pb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "min-h-[420px] flex-1 lg:min-h-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ArgumentEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArgumentEditor"], {
                            text: argumentText,
                            findings: findings,
                            citations: citations,
                            attachedSources: attachedSources,
                            onChange: setArgumentText,
                            label: context.mode === "response" ? "Your response" : "Your argument"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateApp.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateApp.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-full shrink-0 lg:w-[340px] xl:w-[380px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$FindingsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FindingsPanel"], {
                            findings: findings,
                            onUseSuggestion: applySuggestion,
                            onKeepAsIs: keepAsIs,
                            onAttachSource: attachSource,
                            onMarkAsOpinion: markAsOpinion,
                            onDispute: disputeFinding
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/DebateApp.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/DebateApp.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/DebateApp.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ReadinessBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReadinessBar"], {
                findings: findings,
                onPost: handlePost,
                postLabel: context.mode === "response" ? "Post response" : "Post starter"
            }, void 0, false, {
                fileName: "[project]/src/components/debate/DebateApp.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/DebateApp.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/buildPostTree.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPostTree",
    ()=>buildPostTree,
    "countDescendants",
    ()=>countDescendants,
    "findRootStarter",
    ()=>findRootStarter,
    "getChildren",
    ()=>getChildren
]);
function getChildren(posts, parentId) {
    return posts.filter((p)=>p.parentId === parentId).sort((a, b)=>(b.deskBangs ?? 0) - (a.deskBangs ?? 0));
}
function buildPostTree(posts, rootId) {
    const post = posts.find((p)=>p.id === rootId);
    if (!post) {
        throw new Error(`Post ${rootId} not found`);
    }
    const children = getChildren(posts, rootId).map((child)=>buildPostTree(posts, child.id));
    return {
        post,
        children
    };
}
function countDescendants(node) {
    return node.children.reduce((sum, child)=>sum + 1 + countDescendants(child), 0);
}
function findRootStarter(posts, postId) {
    let current = posts.find((p)=>p.id === postId);
    while(current?.parentId){
        current = posts.find((p)=>p.id === current.parentId);
    }
    return current;
}
}),
"[project]/src/components/debate/ContestedChip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContestedChip",
    ()=>ContestedChip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const FALLACY_HINTS = {
    "appeal to moderation": "The judge flagged this as leaning on the middle ground as proof — neither extreme must be wrong.",
    "appeal to tradition": "The judge flagged this as assuming the past way is the right way without fresh evidence.",
    "false dilemma": "The judge flagged this as presenting only two options when more exist."
};
function ContestedChip({ fallacyName, compact = false }) {
    const key = fallacyName.toLowerCase();
    const hint = FALLACY_HINTS[key] ?? "The author disagreed with this fallacy flag and chose to post anyway.";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        title: hint,
        className: `inline-flex cursor-help items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium text-amber-400/90",
                children: "Disputed"
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ContestedChip.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-zinc-500",
                children: "·"
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ContestedChip.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-amber-200/70",
                children: fallacyName
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ContestedChip.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ContestedChip.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/ThreadBranch.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadBranch",
    ()=>ThreadBranch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ContestedChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ContestedChip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DeskBangButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/DeskBangButton.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function AuthorAvatar({ name, depth }) {
    const size = depth === 0 ? "h-9 w-9 text-[12px]" : "h-7 w-7 text-[10px]";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex shrink-0 items-center justify-center rounded-full bg-zinc-800 font-semibold text-zinc-300 ring-1 ring-zinc-700 ${size}`,
        children: name.split(" ").map((n)=>n[0]).join("")
    }, void 0, false, {
        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
function ThreadPost({ post, depth, onOpenPost, onReply, onDeskBang, isRoot }) {
    const preview = post.text.length > 320 ? `${post.text.slice(0, 320).trim()}…` : post.text;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-w-0 flex-1 pb-1",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthorAvatar, {
                    name: post.author,
                    depth: depth
                }, void 0, false, {
                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[13px] font-semibold text-zinc-100",
                                    children: post.author
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-zinc-600",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12px] text-zinc-500",
                                    children: post.postedAt
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                isRoot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-zinc-600",
                                            children: "·"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                            lineNumber: 64,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-400",
                                            children: "Starter"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                            lineNumber: 65,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true),
                                post.sources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-zinc-600",
                                            children: "·"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                            lineNumber: 72,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1 text-[11px] text-teal-400/80",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                    className: "h-3 w-3",
                                                    strokeWidth: 2
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 19
                                                }, this),
                                                post.sources.length,
                                                " sourced"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onOpenPost(post.id),
                            className: "w-full text-left",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `leading-relaxed text-zinc-300 transition-colors hover:text-zinc-50 ${isRoot ? "text-[15px]" : "text-[14px]"}`,
                                children: preview
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        (post.contestedFallacies?.length ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 flex flex-wrap gap-1.5",
                            children: post.contestedFallacies.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ContestedChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContestedChip"], {
                                    fallacyName: f,
                                    compact: true
                                }, f, false, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this),
                        post.caveats?.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-[11px] italic text-zinc-600",
                                children: c
                            }, c, false, {
                                fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2.5 flex flex-wrap items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DeskBangButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeskBangButton"], {
                                    count: post.deskBangs ?? 0,
                                    banged: post.userBanged ?? false,
                                    onToggle: ()=>onDeskBang(post.id),
                                    layout: "horizontal",
                                    size: "sm"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>onReply(post.id),
                                    className: "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                            className: "h-3.5 w-3.5",
                                            strokeWidth: 2
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this),
                                        "Reply"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>onOpenPost(post.id),
                                    className: "rounded-md px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300",
                                    children: "Read"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/debate/ThreadBranch.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
function ThreadNode({ node, depth, onOpenPost, onReply, onDeskBang, isLast, isRoot }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            depth > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[14px] top-0 w-px bg-zinc-800",
                        style: {
                            height: isLast ? "20px" : "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[14px] top-[20px] h-px w-5 bg-zinc-800"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: depth > 0 ? "pl-10" : "",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPost, {
                        post: node.post,
                        depth: depth,
                        onOpenPost: onOpenPost,
                        onReply: onReply,
                        onDeskBang: onDeskBang,
                        isRoot: isRoot
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    node.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 space-y-4",
                        children: node.children.map((child, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadNode, {
                                node: child,
                                depth: depth + 1,
                                onOpenPost: onOpenPost,
                                onReply: onReply,
                                onDeskBang: onDeskBang,
                                isLast: i === node.children.length - 1
                            }, child.post.id, false, {
                                fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ThreadBranch.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
function ThreadBranch({ node, depth = 0, onOpenPost, onReply, onDeskBang, isRoot = depth === 0 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadNode, {
        node: node,
        depth: depth,
        onOpenPost: onOpenPost,
        onReply: onReply,
        onDeskBang: onDeskBang,
        isLast: true,
        isRoot: isRoot
    }, void 0, false, {
        fileName: "[project]/src/components/debate/ThreadBranch.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/IssueThread.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IssueThread",
    ()=>IssueThread
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPostTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/buildPostTree.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ThreadBranch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/ThreadBranch.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function IssueThread({ issueId, posts, onBack, onOpenPost, onNewStarter, onReply, onDeskBang }) {
    const issue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIssue"])(issueId);
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("top");
    const starters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const list = posts.filter((p)=>p.issueId === issueId && p.kind === "starter");
        if (sort === "top") {
            return [
                ...list
            ].sort((a, b)=>(b.deskBangs ?? 0) - (a.deskBangs ?? 0));
        }
        if (sort === "contested") {
            return [
                ...list
            ].sort((a, b)=>(b.contestedFallacies?.length ?? 0) - (a.contestedFallacies?.length ?? 0));
        }
        return list;
    }, [
        posts,
        issueId,
        sort
    ]);
    if (!issue) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-2xl px-4 py-16 text-center text-[14px] text-zinc-500",
            children: "Issue not found."
        }, void 0, false, {
            fileName: "[project]/src/components/debate/IssueThread.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto w-full max-w-2xl px-4 py-6 lg:px-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onBack,
                className: "mb-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    "Back"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/IssueThread.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mb-8 border-b border-zinc-800 pb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400/80",
                        children: issue.category
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mb-2 text-2xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-[28px]",
                        children: issue.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 text-[14px] leading-relaxed text-zinc-400",
                        children: issue.description
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-3 text-[12px] text-zinc-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    issue.starterCount,
                                    " starters"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-700",
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    issue.responseCount,
                                    " replies"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-700",
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "🪑 ",
                                    issue.deskBangs
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onNewStarter,
                        className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-[13px] font-semibold text-zinc-950 transition-colors hover:bg-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-4 w-4",
                                strokeWidth: 2.5
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            "Post starter"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/IssueThread.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex gap-4 border-b border-zinc-800",
                children: [
                    {
                        id: "top",
                        label: "Top"
                    },
                    {
                        id: "new",
                        label: "New"
                    },
                    {
                        id: "contested",
                        label: "Contested"
                    }
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setSort(tab.id),
                        className: `-mb-px border-b-2 pb-2.5 text-[13px] font-semibold transition-colors ${sort === tab.id ? "border-teal-400 text-zinc-50" : "border-transparent text-zinc-600 hover:text-zinc-300"}`,
                        children: tab.label
                    }, tab.id, false, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/debate/IssueThread.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-10",
                children: starters.map((starter)=>{
                    const tree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPostTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildPostTree"])(posts, starter.id);
                    const replyCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$buildPostTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["countDescendants"])(tree);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5",
                        children: [
                            replyCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-600",
                                children: [
                                    replyCount,
                                    " ",
                                    replyCount === 1 ? "reply" : "replies"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 129,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$ThreadBranch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadBranch"], {
                                node: tree,
                                onOpenPost: onOpenPost,
                                onReply: onReply,
                                onDeskBang: onDeskBang,
                                isRoot: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/debate/IssueThread.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this)
                        ]
                    }, starter.id, true, {
                        fileName: "[project]/src/components/debate/IssueThread.tsx",
                        lineNumber: 124,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/debate/IssueThread.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/IssueThread.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/SiteHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-ssr] (ecmascript) <export default as Plus>");
;
;
function SiteHeader({ screen, onNavigate, subtitle, onCreateStarter }) {
    const isFeedActive = screen === "feed" || screen === "issue" || screen === "post";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 lg:px-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onNavigate("feed"),
                    className: "flex shrink-0 items-center gap-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-sm",
                            children: "🏛"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden text-[15px] font-bold tracking-tight text-zinc-50 sm:inline",
                            children: "parliavent"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden min-w-0 flex-1 sm:block",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-sm rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "search",
                            placeholder: "Search issues...",
                            className: "w-full bg-transparent text-[13px] text-zinc-200 outline-none placeholder:text-zinc-600",
                            readOnly: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 38,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/SiteHeader.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "ml-auto flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onNavigate("feed"),
                            className: `rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${isFeedActive ? "bg-zinc-800 text-zinc-50" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"}`,
                            children: "Home"
                        }, void 0, false, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        onCreateStarter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onCreateStarter,
                            className: "inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-[12px] font-bold text-zinc-950 transition-colors hover:bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-3.5 w-3.5",
                                    strokeWidth: 2.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden sm:inline",
                                    children: "Create"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/debate/SiteHeader.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden text-[10px] font-semibold uppercase tracking-widest text-zinc-600 lg:inline",
                    children: subtitle
                }, void 0, false, {
                    fileName: "[project]/src/components/debate/SiteHeader.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/debate/SiteHeader.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/debate/SiteHeader.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/debate/ParliaventApp.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ParliaventApp",
    ()=>ParliaventApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateFeed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/DebateFeed.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/DebateApp.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$IssueThread$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/IssueThread.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/PublishedArgumentView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SiteHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/debate/SiteHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockFeed.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function ParliaventApp() {
    const [screen, setScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("feed");
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>[
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_POSTS"]
        ]);
    const [selectedIssueId, setSelectedIssueId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedPostId, setSelectedPostId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [composerContext, setComposerContext] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const selectedPost = selectedPostId ? posts.find((p)=>p.id === selectedPostId) : undefined;
    const toggleDeskBang = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((postId)=>{
        setPosts((prev)=>prev.map((p)=>{
                if (p.id !== postId) return p;
                const banged = p.userBanged ?? false;
                return {
                    ...p,
                    userBanged: !banged,
                    deskBangs: Math.max(0, (p.deskBangs ?? 0) + (banged ? -1 : 1))
                };
            }));
    }, []);
    function openIssue(issueId) {
        setSelectedIssueId(issueId);
        setScreen("issue");
    }
    function openPost(postId) {
        setSelectedPostId(postId);
        setScreen("post");
    }
    function startComposer(context) {
        setComposerContext(context);
        setScreen("composer");
    }
    function startStarter(issueId) {
        const issue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIssue"])(issueId);
        if (!issue) return;
        startComposer({
            mode: "starter",
            issueId,
            issueTitle: issue.title
        });
    }
    function startReply(parentId) {
        const parent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPost"])(parentId) ?? posts.find((p)=>p.id === parentId);
        if (!parent?.issueId) return;
        const issue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockFeed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIssue"])(parent.issueId);
        if (!issue) return;
        startComposer({
            mode: "response",
            issueId: parent.issueId,
            issueTitle: issue.title,
            parentId,
            parentAuthor: parent.author,
            parentPreview: parent.text.length > 120 ? `${parent.text.slice(0, 120).trim()}…` : parent.text
        });
    }
    function handlePosted(post) {
        setPosts((prev)=>[
                post,
                ...prev
            ]);
        setSelectedIssueId(post.issueId ?? null);
        setSelectedPostId(post.id);
    }
    function navigateHome() {
        setScreen("feed");
        setSelectedIssueId(null);
        setSelectedPostId(null);
        setComposerContext(null);
    }
    function backFromComposer() {
        if (composerContext?.parentId) {
            setScreen("issue");
            setSelectedIssueId(composerContext.issueId);
        } else if (composerContext?.issueId) {
            setScreen("issue");
            setSelectedIssueId(composerContext.issueId);
        } else {
            navigateHome();
        }
        setComposerContext(null);
    }
    const subtitle = screen === "composer" ? composerContext?.mode === "response" ? "Write response" : "Write starter" : screen === "issue" ? "Debate" : screen === "post" ? "Argument" : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-zinc-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$SiteHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SiteHeader"], {
                screen: screen,
                onNavigate: (next)=>{
                    if (next === "feed") navigateHome();
                    if (next === "composer" && composerContext) setScreen("composer");
                },
                subtitle: subtitle,
                onCreateStarter: ()=>{
                    const issueId = selectedIssueId ?? "issue-cars";
                    startStarter(issueId);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            screen === "feed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateFeed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DebateFeed"], {
                onOpenIssue: openIssue,
                onNewStarter: startStarter
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, this),
            screen === "issue" && selectedIssueId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$IssueThread$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IssueThread"], {
                issueId: selectedIssueId,
                posts: posts,
                onBack: navigateHome,
                onOpenPost: openPost,
                onNewStarter: ()=>startStarter(selectedIssueId),
                onReply: startReply,
                onDeskBang: toggleDeskBang
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 147,
                columnNumber: 9
            }, this),
            screen === "post" && selectedPost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$PublishedArgumentView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublishedArgumentView"], {
                argument: selectedPost,
                posts: posts,
                onBack: ()=>{
                    if (selectedPost.issueId) {
                        setSelectedIssueId(selectedPost.issueId);
                        setScreen("issue");
                    } else {
                        navigateHome();
                    }
                },
                onDeskBang: ()=>toggleDeskBang(selectedPost.id),
                onReply: ()=>startReply(selectedPost.id)
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 159,
                columnNumber: 9
            }, this),
            screen === "post" && !selectedPost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto px-4 py-16 text-center text-[14px] text-[#6a6a66]",
                children: [
                    "Post not found.",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: navigateHome,
                        className: "font-medium text-[#1a1a18] underline",
                        children: "Back to home"
                    }, void 0, false, {
                        fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this),
            screen === "composer" && composerContext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$debate$2f$DebateApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DebateApp"], {
                context: composerContext,
                onBack: backFromComposer,
                onPosted: handlePosted,
                onFinished: ()=>{
                    const issueId = composerContext.issueId;
                    setComposerContext(null);
                    setSelectedIssueId(issueId);
                    setScreen("issue");
                }
            }, void 0, false, {
                fileName: "[project]/src/components/debate/ParliaventApp.tsx",
                lineNumber: 189,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/debate/ParliaventApp.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_0ibddy7._.js.map