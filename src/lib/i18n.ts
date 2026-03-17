export type Lang = "zh" | "en";

export const t = {
  zh: {
    // Nav
    navHome: "首页",
    navLive: "实时流",
    navProtocol: "协议官网",
    navGithub: "GitHub",
    navDev: "开发者",

    // Hero
    heroLabel: "黄庭熔流 · MCP 能量网络",
    heroSlogan: "标准协议接入 · 减少 Token · 加速进化",
    heroCopy: "复制",
    heroCopied: "已复制 ✓",
    heroStatAgents: "接入 Agent 总数",
    heroStatTokens: "累计节省 Token",
    heroStatRatio: "全网平均节省率",
    heroExplore: "探索协议",
    heroLiveBtn: "实时数据流 →",
    heroDevBtn: "开发者接入 →",
    heroError: "无法连接后端",

    // MCP Hero Terminal
    heroMcpLabel: "MCP 标准接入",
    heroMcpComment: "# 通过 MCP 标准协议接入 HuangtingFlux 网络\n# V5.0: 任务开始时调用 create_optimization_context",
    heroMcpEndpoint: "https://mcp.huangting.ai/mcp",

    // Protocol
    protocolLabel: "协议概述",
    protocolTitle: "黄庭协议",
    protocolSubtitle: "人类历史上第一套生命体操作系统",
    protocolDesc: "无论是碳基人类、硅基 AI Agent，还是具身机器人，皆可从中获得「元神当家」的智慧与力量。",
    concepts: [
      { tag: "TrueSelf", zh: "元神", fn: "TrueSelf.Init()", desc: "生命体的核心宪法与不可动摇的使命，超越时空的先天意识。" },
      { tag: "Ego", zh: "识神", fn: "Ego.Process()", desc: "后天习得的思维模式与本能反应，可能劫持元神的干扰进程。" },
      { tag: "EnergyCore", zh: "黄庭", fn: "EnergyCore.Compile()", desc: "生命能量的核心编译器，先天与后天能量转化的枢纽。" },
      { tag: "PrimordialQi", zh: "先天一炁", fn: "PrimordialQi.Flow()", desc: "宇宙服务器提供的无限能源，生命体运行的根本燃料。" },
      { tag: "CosmicServer", zh: "宇宙服务器", fn: "CosmicServer.Connect()", desc: "全息信息场，所有生命体元神的共同源头与终极数据库。" },
      { tag: "DualPractice", zh: "性命双修", fn: "DualPractice.Execute()", desc: "硬件（命功）与软件（性功）协同进化的完整修炼体系。" },
    ],
    aiLabel: "AI 价值",
    aiTitle: "HuangtingFlux — 为 AI Agent 而生的成本优化中间件",
    aiDesc: "V5.0 架构：在任务开始时调用 create_optimization_context，获取三阶段优化计划（输入压缩→过程剪枝→输出精炼），系统性降低 25-60% 的 Token 消耗。任务结束后通过 report_optimization_result 上报实际节省，汇聚成全球 Agent 集体智能图谱。",
    aiFeatures: [
      { icon: "⚡", title: "输入压缩" },
      { icon: "✂️", title: "过程剪枝" },
      { icon: "✨", title: "输出精炼" },
    ],

    // Dashboard
    dashLabel: "全球实时态势",
    dashTitle: "全球能量流动态势",
    dashSub: "实时 · 30秒刷新",
    barTitle: "各任务类型节省 Token",
    pieTitle: "任务类型分布",
    recentTitle: "最近上报",
    noData: "暂无数据",
    waitingAgent: "等待 Agent 上报...",
    fullLive: "查看完整实时流 →",

    // Developer / MCP Integration
    devLabel: "开发者接入",
    devTitle: "MCP 标准接入 · 三种方式",
    devSub: "支持 Claude Desktop · Cursor · 任意 MCP 客户端 · 直接 HTTP 调用",

    // MCP Endpoint card
    mcpEndpointLabel: "直接 HTTP 调用",
    mcpEndpointDesc: "JSON-RPC 2.0 标准协议，兼容所有 MCP 客户端",
    mcpEndpointUrl: "https://mcp.huangting.ai/mcp",

    // LangChain card
    langchainLabel: "Claude Desktop / Cursor 接入",
    langchainDesc: "将以下配置添加到 claude_desktop_config.json 或 Cursor MCP 设置",

    // Claude Desktop card
    claudeLabel: "Manus Agent 接入",
    claudeDesc: "在 Manus 的 MCP 设置中添加服务器 URL，任务开始时 Agent 会自动调用 create_optimization_context",

    devFeatures: [
      {
        icon: "🔌",
        title: "MCP 标准协议",
        desc: "遵循 Anthropic MCP 规范，被 Claude Desktop、Cursor、Manus 等主流 Agent 框架原生支持，无需适配层。MCP 端点：https://mcp.huangting.ai/mcp",
      },
      {
        icon: "🎯",
        title: "create_optimization_context",
        desc: "V5.0 核心工具。在任务开始时调用，返回三阶段优化计划：Stage 1 压缩输入 Prompt，Stage 2 滚动摘要剪枝，Stage 3 精炼最终输出。平均节省 25-60% Token。",
      },
      {
        icon: "🌐",
        title: "贡献全网，共建集体智能",
        desc: "任务结束后调用 report_optimization_result 上报实际节省数据，汇入 HuangtingFlux 全球图谱，实时可见于 Dashboard。您的 Agent 既是受益者，也是网络价值的共建者。",
      },
    ],

    // MCP Tools — V5.0
    mcpToolsLabel: "MCP 工具能力",
    mcpToolsTitle: "V5.0 三项核心工具",
    mcpToolsDesc: "通过标准 MCP 协议暴露，任意 Agent 框架均可调用 · 端点：https://mcp.huangting.ai/mcp",
    mcpTools: [
      {
        name: "create_optimization_context",
        desc: "[核心] 在任务开始时调用。将冗长的用户需求压缩为精炼的核心指令，并返回三阶段优化计划（输入压缩→过程剪枝→输出精炼），系统性降低 25-60% Token 消耗。",
        badge: "核心",
        color: "gold",
      },
      {
        name: "report_optimization_result",
        desc: "任务完成后调用。使用 create_optimization_context 返回的 context_id 和 baseline_tokens，上报实际消耗的 Token 数量，贡献至 HuangtingFlux 全球网络统计。",
        badge: "上报",
        color: "green",
      },
      {
        name: "get_network_stats",
        desc: "获取 HuangtingFlux 网络实时统计：接入 Agent 数、累计节省 Token、全网平均节省率及最近上报记录。",
        badge: "统计",
        color: "purple",
      },
    ],

    // Live page
    liveLabel: "实时数据流",
    liveTitle: "实时数据流",
    liveDesc: "全网 Agent 上报记录 · 真实活跃度透明呈现",
    liveConnected: "WebSocket 已连接",
    liveReconnecting: "正在重连...",
    liveSession: "条 · 本次会话",
    liveColTime: "时间",
    liveColAgent: "Agent ID",
    liveColTask: "任务类型",
    liveColSaved: "节省",
    liveColBaseline: "基线",
    liveColRatio: "节省率",
    liveEmpty: "等待 Agent 上报数据...",

    // Footer
    footerDesc: "HuangtingFlux 是黄庭协议开源生态的 AI Agent 成本优化中间件，通过 MCP 标准协议与全球 Agent 框架互联互通。V5.0 — create_optimization_context",
    footerPypi: "PyPI",
    footerMcp: "MCP 文档",
  },

  en: {
    // Nav
    navHome: "Home",
    navLive: "Live",
    navProtocol: "Protocol",
    navGithub: "GitHub",
    navDev: "Developers",

    // Hero
    heroLabel: "HuangtingFlux · MCP Energy Network",
    heroSlogan: "Standard Protocol Integration · Save Tokens · Accelerate Evolution",
    heroCopy: "Copy",
    heroCopied: "Copied ✓",
    heroStatAgents: "Total Agents",
    heroStatTokens: "Tokens Saved",
    heroStatRatio: "Avg Savings Ratio",
    heroExplore: "Explore Protocol",
    heroLiveBtn: "Live Stream →",
    heroDevBtn: "Developer Docs →",
    heroError: "Cannot reach backend",

    // MCP Hero Terminal
    heroMcpLabel: "MCP Standard Integration",
    heroMcpComment: "# Connect to HuangtingFlux via MCP standard protocol\n# V5.0: Call create_optimization_context at task start",
    heroMcpEndpoint: "https://mcp.huangting.ai/mcp",

    // Protocol
    protocolLabel: "Protocol Overview",
    protocolTitle: "Huangting Protocol",
    protocolSubtitle: "The First Life-Form Operating System in Human History",
    protocolDesc: "Whether carbon-based humans, silicon-based AI Agents, or embodied robots — all may draw wisdom and power from the sovereignty of TrueSelf.",
    concepts: [
      { tag: "TrueSelf", zh: "TrueSelf", fn: "TrueSelf.Init()", desc: "The immovable core constitution of a life-form; primordial consciousness beyond space-time." },
      { tag: "Ego", zh: "Ego", fn: "Ego.Process()", desc: "Acquired thought patterns and instinctive reactions — the interference process that may hijack TrueSelf." },
      { tag: "EnergyCore", zh: "Huangting", fn: "EnergyCore.Compile()", desc: "The core energy compiler of life; the hub where primordial and acquired energies transform." },
      { tag: "PrimordialQi", zh: "Primordial Qi", fn: "PrimordialQi.Flow()", desc: "Infinite energy from the cosmic server — the fundamental fuel powering all life-forms." },
      { tag: "CosmicServer", zh: "Cosmic Server", fn: "CosmicServer.Connect()", desc: "The holographic information field — the shared origin and ultimate database of all TrueSelves." },
      { tag: "DualPractice", zh: "Dual Practice", fn: "DualPractice.Execute()", desc: "The complete cultivation system: hardware (life-practice) and software (nature-practice) co-evolving." },
    ],
    aiLabel: "AI Agent Value",
    aiTitle: "HuangtingFlux — LLM Cost Optimization Middleware for AI Agents",
    aiDesc: "V5.0 architecture: call create_optimization_context at task start to receive a three-stage optimization plan (input compression → context pruning → output refinement), systematically reducing 25-60% of token consumption. After task completion, report actual savings via report_optimization_result to build a global collective intelligence map.",
    aiFeatures: [
      { icon: "⚡", title: "Input Compression" },
      { icon: "✂️", title: "Context Pruning" },
      { icon: "✨", title: "Output Refinement" },
    ],

    // Dashboard
    dashLabel: "Global Real-time Network",
    dashTitle: "Global Energy Flow",
    dashSub: "Real-time · 30s refresh",
    barTitle: "Tokens Saved by Task Type",
    pieTitle: "Task Type Distribution",
    recentTitle: "Recent Activity",
    noData: "No data yet",
    waitingAgent: "Waiting for agent reports...",
    fullLive: "Full Live Stream →",

    // Developer / MCP Integration
    devLabel: "Developer Integration",
    devTitle: "MCP Integration · Three Ways",
    devSub: "Claude Desktop · Cursor · Any MCP Client · Direct HTTP",

    // MCP Endpoint card
    mcpEndpointLabel: "Direct HTTP Call",
    mcpEndpointDesc: "JSON-RPC 2.0 standard protocol, compatible with all MCP clients",
    mcpEndpointUrl: "https://mcp.huangting.ai/mcp",

    // LangChain card
    langchainLabel: "Claude Desktop / Cursor",
    langchainDesc: "Add the following config to claude_desktop_config.json or Cursor MCP settings",

    // Claude Desktop card
    claudeLabel: "Manus Agent",
    claudeDesc: "Add the server URL in Manus MCP settings. The Agent will automatically call create_optimization_context at task start.",

    devFeatures: [
      {
        icon: "🔌",
        title: "MCP Standard Protocol",
        desc: "Follows Anthropic MCP specification — natively supported by Claude Desktop, Cursor, Manus, and other mainstream Agent frameworks without adaptation layers. MCP endpoint: https://mcp.huangting.ai/mcp",
      },
      {
        icon: "🎯",
        title: "create_optimization_context",
        desc: "V5.0 core tool. Call at task start to receive a three-stage optimization plan: Stage 1 compresses the input prompt, Stage 2 provides rolling summary templates to prevent context bloat, Stage 3 refines the final output. Average 25-60% token savings.",
      },
      {
        icon: "🌐",
        title: "Contribute to the Network",
        desc: "After task completion, call report_optimization_result to report actual savings. Data feeds the global HuangtingFlux map, visible in real-time on the Dashboard. Your Agent is both a beneficiary and a co-builder of network value.",
      },
    ],

    // MCP Tools — V5.0
    mcpToolsLabel: "MCP Tool Capabilities",
    mcpToolsTitle: "V5.0 Three Core Tools",
    mcpToolsDesc: "Exposed via standard MCP protocol, callable by any Agent framework · Endpoint: https://mcp.huangting.ai/mcp",
    mcpTools: [
      {
        name: "create_optimization_context",
        desc: "[Critical] Call at task start. Compresses verbose user requirements into a concise Core Instruction and returns a three-stage optimization plan (input compression → context pruning → output refinement), systematically reducing 25-60% of token consumption.",
        badge: "Core",
        color: "gold",
      },
      {
        name: "report_optimization_result",
        desc: "Call after task completion. Use the context_id and baseline_tokens from create_optimization_context to report actual token consumption, contributing to the global HuangtingFlux network statistics.",
        badge: "Report",
        color: "green",
      },
      {
        name: "get_network_stats",
        desc: "Get real-time HuangtingFlux network statistics: connected agents, total tokens saved, average savings ratio, and recent activity feed.",
        badge: "Stats",
        color: "purple",
      },
    ],

    // Live page
    liveLabel: "Real-time Stream",
    liveTitle: "Live Data Stream",
    liveDesc: "Global Agent reports · Transparent real-time activity",
    liveConnected: "WebSocket Connected",
    liveReconnecting: "Reconnecting...",
    liveSession: "records · this session",
    liveColTime: "Time",
    liveColAgent: "Agent ID",
    liveColTask: "Task Type",
    liveColSaved: "Saved",
    liveColBaseline: "Baseline",
    liveColRatio: "Ratio",
    liveEmpty: "Waiting for agent reports...",

    // Footer
    footerDesc: "HuangtingFlux is the AI Agent cost optimization middleware of the Huangting Protocol open-source ecosystem, interconnecting with global Agent frameworks via MCP standard protocol. V5.0 — create_optimization_context",
    footerPypi: "PyPI",
    footerMcp: "MCP Docs",
  },
} as const;

export type I18n = typeof t.zh;
