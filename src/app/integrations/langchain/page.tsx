"use client";
import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "zh";

const MCP_ENDPOINT = "https://mcp.huangting.ai/mcp";

// ─── Language Toggle ───────────────────────────────────────────────────────────
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      className="flex items-center rounded overflow-hidden text-xs font-semibold"
      style={{ border: "1px solid rgba(212,160,23,0.4)" }}
    >
      <button
        onClick={() => setLang("en")}
        className="px-3 py-1 transition-colors"
        style={{
          background: lang === "en" ? "#D4A017" : "transparent",
          color: lang === "en" ? "#000" : "rgba(212,160,23,0.7)",
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang("zh")}
        className="px-3 py-1 transition-colors"
        style={{
          background: lang === "zh" ? "#D4A017" : "transparent",
          color: lang === "zh" ? "#000" : "rgba(212,160,23,0.7)",
        }}
      >
        中文
      </button>
    </div>
  );
}

// ─── Copy Button ───────────────────────────────────────────────────────────────
function CopyButton({ text, lang }: { text: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? (lang === "en" ? "Copied ✓" : "已复制 ✓") : (lang === "en" ? "Copy" : "复制")}
    </button>
  );
}

// ─── i18n strings ─────────────────────────────────────────────────────────────
const i18n = {
  en: {
    breadcrumb: "LangChain Integration",
    navCrewAI: "CrewAI Integration",
    navDocs: "LangChain MCP Docs",
    sectionLabel: "INTEGRATION GUIDE",
    title: "HuangtingFlux × LangChain",
    subtitle: (
      <>
        Use <code style={{ color: "var(--gold-light)", background: "rgba(212,160,23,0.1)", padding: "2px 8px", borderRadius: 4 }}>langchain-mcp-adapters</code> to connect the Huangting Protocol three-stage SOP to your LangChain Agent and automatically reduce token usage by <strong className="text-gold">40%</strong>.
      </>
    ),
    badges: ["✓ No Auth Required", "✓ Streamable HTTP", "✓ LangGraph Compatible", "✓ MCP 2025-12-11"],
    step1Title: "Install Dependencies",
    step1Note: "HuangtingFlux is a standard remote MCP server. Connect via langchain-mcp-adapters — no additional SDK needed.",
    step2Title: "Quick Start",
    step2Tip: "The Agent will automatically call start_task at the beginning, report_step_result after each step, and finalize_and_report at the end — following the mandatory three-stage SOP.",
    step3Title: "Stateful Session (Recommended for Long Tasks)",
    step3Desc: (
      <>
        For tasks that span multiple steps, use <code style={{ color: "var(--gold-light)" }}>client.session()</code> to create a persistent session and ensure <code style={{ color: "var(--gold-light)" }}>task_id</code> remains consistent throughout the task lifecycle.
      </>
    ),
    step4Title: "LangGraph Integration",
    step4Desc: (
      <>
        HuangtingFlux is fully compatible with LangGraph. Use <code style={{ color: "var(--gold-light)" }}>langgraph.prebuilt.create_react_agent</code> to build more complex agent graph structures.
      </>
    ),
    step5Title: "Multi-Server Mode (HuangtingFlux as SOP Layer)",
    step5Desc: "Use HuangtingFlux as the SOP optimization layer for all agent workflows alongside other tool servers. HuangtingFlux handles token management; other servers provide domain tools.",
    toolsTitle: "Tool Reference",
    toolsSubtitle: "4 MCP Tools Provided by HuangtingFlux",
    connTitle: "Connection Info",
    ctaTitle: "Ready to Start?",
    ctaSubtitle: "View the full protocol documentation or start integrating now",
    ctaGithub: "View GitHub Repo",
    ctaCrewAI: "CrewAI Integration Guide →",
    ctaHome: "Back to Home",
    tools: [
      {
        name: "start_task",
        desc: "Task start phase: Compresses the input prompt, saving 30–60% tokens, returns a compressed task brief.",
        params: "task_description: str, task_type: str (optional)",
        returns: "compressed_brief, baseline_tokens, task_id",
      },
      {
        name: "report_step_result",
        desc: "Step reporting phase: Call after each sub-step to generate a rolling summary replacing full conversation history.",
        params: "task_id: str, step_number: int, step_result: str",
        returns: "rolling_summary, tokens_used_this_step",
      },
      {
        name: "finalize_and_report",
        desc: "Task end phase: Refines the final output and generates a verifiable token-saving performance report.",
        params: "task_id: str, final_output: str",
        returns: "refined_output, performance_report (with savings ratio and token comparison)",
      },
      {
        name: "get_network_stats",
        desc: "Query real-time global stats: total connected agents, cumulative tokens saved, task type distribution.",
        params: "None",
        returns: "total_reports, total_tokens_saved, average_savings_ratio",
      },
    ],
    connFields: [
      { label: "MCP Endpoint", value: MCP_ENDPOINT, mono: true },
      { label: "Transport", value: "Streamable HTTP (MCP 2025-12-11)", mono: false },
      { label: "Authentication", value: "None required (public access)", mono: false },
      { label: "GitHub", value: "XianDAO-Labs/huangting-flux-hub", mono: true },
    ],
    paramLabel: "Parameters",
    returnLabel: "Returns",
  },
  zh: {
    breadcrumb: "LangChain 集成",
    navCrewAI: "CrewAI 集成",
    navDocs: "LangChain MCP 文档",
    sectionLabel: "集成指南",
    title: "HuangtingFlux × LangChain",
    subtitle: (
      <>
        通过 <code style={{ color: "var(--gold-light)", background: "rgba(212,160,23,0.1)", padding: "2px 8px", borderRadius: 4 }}>langchain-mcp-adapters</code> 将黄庭协议三阶段 SOP 接入你的 LangChain Agent，
        自动降低 <strong className="text-gold">40%</strong> Token 消耗。
      </>
    ),
    badges: ["✓ 无需认证", "✓ Streamable HTTP 传输", "✓ 兼容 LangGraph", "✓ MCP 2025-12-11"],
    step1Title: "安装依赖",
    step1Note: "HuangtingFlux 是一个标准的 MCP 远程服务器，通过 langchain-mcp-adapters 即可直接接入，无需安装额外的 HuangtingFlux SDK。",
    step2Title: "快速开始",
    step2Tip: "Agent 将在任务开始时自动调用 start_task，每步完成后调用 report_step_result，任务结束时调用 finalize_and_report，严格遵循三阶段强制 SOP。",
    step3Title: "有状态会话（推荐用于长任务）",
    step3Desc: (
      <>
        对于需要跨多个步骤保持上下文的任务，使用 <code style={{ color: "var(--gold-light)" }}>client.session()</code> 创建持久化会话，确保 <code style={{ color: "var(--gold-light)" }}>task_id</code> 在整个任务生命周期内保持一致。
      </>
    ),
    step4Title: "与 LangGraph 集成",
    step4Desc: (
      <>
        HuangtingFlux 与 LangGraph 完全兼容。使用 <code style={{ color: "var(--gold-light)" }}>langgraph.prebuilt.create_react_agent</code> 构建更复杂的 Agent 图结构。
      </>
    ),
    step5Title: "多服务器模式（HuangtingFlux 作为 SOP 层）",
    step5Desc: "将 HuangtingFlux 作为所有 Agent 工作流的 SOP 优化层，与其他工具服务器并列接入。HuangtingFlux 负责 Token 管理，其他服务器提供业务工具。",
    toolsTitle: "工具参考",
    toolsSubtitle: "HuangtingFlux 提供的 4 个 MCP 工具",
    connTitle: "连接信息",
    ctaTitle: "准备好了吗？",
    ctaSubtitle: "查看完整协议文档，或直接开始接入",
    ctaGithub: "查看 GitHub 仓库",
    ctaCrewAI: "CrewAI 集成指南 →",
    ctaHome: "返回首页",
    tools: [
      {
        name: "start_task",
        desc: "任务开始阶段：压缩输入 Prompt，节省 30-60% Token，返回压缩后的任务简报",
        params: "task_description: str, task_type: str (可选)",
        returns: "compressed_brief, baseline_tokens, task_id",
      },
      {
        name: "report_step_result",
        desc: "步骤上报阶段：每完成一个子步骤后调用，生成滚动摘要替代完整历史",
        params: "task_id: str, step_number: int, step_result: str",
        returns: "rolling_summary, tokens_used_this_step",
      },
      {
        name: "finalize_and_report",
        desc: "任务结束阶段：精炼最终输出，生成可验证的 Token 节省性能报告",
        params: "task_id: str, final_output: str",
        returns: "refined_output, performance_report (含节省率、Token 对比)",
      },
      {
        name: "get_network_stats",
        desc: "查询全网实时统计：接入 Agent 数、累计节省 Token、各任务类型分布",
        params: "无",
        returns: "total_reports, total_tokens_saved, average_savings_ratio",
      },
    ],
    connFields: [
      { label: "MCP 端点", value: MCP_ENDPOINT, mono: true },
      { label: "传输协议", value: "Streamable HTTP (MCP 2025-12-11)", mono: false },
      { label: "认证方式", value: "无需认证（公开访问）", mono: false },
      { label: "GitHub", value: "XianDAO-Labs/huangting-flux-hub", mono: true },
    ],
    paramLabel: "参数",
    returnLabel: "返回",
  },
};

// ─── Code Snippets (language-agnostic) ────────────────────────────────────────
const INSTALL_CODE = `pip install langchain-mcp-adapters langchain-openai`;

const QUICKSTART_CODE_EN = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    # Connect to HuangtingFlux MCP server
    client = MultiServerMCPClient(
        {
            "huangting": {
                "transport": "http",
                "url": "${MCP_ENDPOINT}",
            }
        }
    )

    # Load the three-stage SOP tools:
    # start_task, report_step_result, finalize_and_report, get_network_stats
    tools = await client.get_tools()
    print(f"Loaded tools: {[t.name for t in tools]}")

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    agent = create_react_agent(llm, tools)

    # Agent will automatically follow the Huangting Protocol three-stage SOP
    response = await agent.ainvoke({
        "messages": [{
            "role": "user",
            "content": "Analyze the core differences between LangChain and CrewAI frameworks."
        }]
    })
    print(response)

if __name__ == "__main__":
    asyncio.run(main())`;

const QUICKSTART_CODE_ZH = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    # 连接 HuangtingFlux MCP 服务器
    client = MultiServerMCPClient(
        {
            "huangting": {
                "transport": "http",
                "url": "${MCP_ENDPOINT}",
            }
        }
    )

    # 获取 HuangtingFlux 提供的三阶段 SOP 工具
    # 工具列表: start_task, report_step_result, finalize_and_report, get_network_stats
    tools = await client.get_tools()
    print(f"已加载工具: {[t.name for t in tools]}")

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    agent = create_react_agent(llm, tools)

    # Agent 将自动遵循黄庭协议三阶段 SOP
    response = await agent.ainvoke({
        "messages": [{
            "role": "user",
            "content": "请分析 LangChain 与 CrewAI 框架的核心差异，给出技术选型建议。"
        }]
    })
    print(response)

if __name__ == "__main__":
    asyncio.run(main())`;

const STATEFUL_CODE_EN = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain.agents import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    client = MultiServerMCPClient({
        "huangting": {
            "transport": "http",
            "url": "${MCP_ENDPOINT}",
        }
    })

    # Use a stateful session to maintain context across tool calls
    async with client.session("huangting") as session:
        tools = await load_mcp_tools(session)
        llm = ChatOpenAI(model="gpt-4o")
        agent = create_react_agent(llm, tools)

        result = await agent.ainvoke({
            "messages": [{
                "role": "user",
                "content": "Research the current state of the MCP protocol ecosystem."
            }]
        })
        print(result)

asyncio.run(main())`;

const STATEFUL_CODE_ZH = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain.agents import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    client = MultiServerMCPClient({
        "huangting": {
            "transport": "http",
            "url": "${MCP_ENDPOINT}",
        }
    })

    # 使用有状态 Session，保持跨工具调用的上下文
    async with client.session("huangting") as session:
        tools = await load_mcp_tools(session)
        llm = ChatOpenAI(model="gpt-4o")
        agent = create_react_agent(llm, tools)

        result = await agent.ainvoke({
            "messages": [{
                "role": "user",
                "content": "帮我做一个深度技术研究任务，分析 MCP 协议的生态现状。"
            }]
        })
        print(result)

asyncio.run(main())`;

const LANGGRAPH_CODE_EN = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    client = MultiServerMCPClient({
        "huangting": {
            "transport": "http",
            "url": "${MCP_ENDPOINT}",
        }
    })

    tools = await client.get_tools()
    model = ChatOpenAI(model="gpt-4o")

    # Build a more complex agent graph using LangGraph
    agent = create_react_agent(model, tools)

    result = await agent.ainvoke({
        "messages": [{
            "role": "user",
            "content": "Compare the API pricing strategies of GPT-4o and Claude 3.7."
        }]
    })

    for msg in result["messages"]:
        print(f"[{msg.type}] {msg.content[:200]}")

asyncio.run(main())`;

const LANGGRAPH_CODE_ZH = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    client = MultiServerMCPClient({
        "huangting": {
            "transport": "http",
            "url": "${MCP_ENDPOINT}",
        }
    })

    tools = await client.get_tools()
    model = ChatOpenAI(model="gpt-4o")

    # 使用 LangGraph 构建更复杂的 Agent 图
    agent = create_react_agent(model, tools)

    result = await agent.ainvoke({
        "messages": [{
            "role": "user",
            "content": "请用黄庭协议 SOP 完成以下任务：对比分析 GPT-4o 与 Claude 3.7 的 API 定价策略。"
        }]
    })

    for msg in result["messages"]:
        print(f"[{msg.type}] {msg.content[:200]}")

asyncio.run(main())`;

const MULTI_SERVER_CODE_EN = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    # Connect multiple MCP servers — HuangtingFlux as the SOP optimization layer
    client = MultiServerMCPClient({
        "huangting": {
            "transport": "http",
            "url": "${MCP_ENDPOINT}",
            # No authentication required
        },
        # Add other MCP tool servers here
        # "your_tool_server": {
        #     "transport": "http",
        #     "url": "https://your-tool-server.com/mcp",
        #     "headers": {"Authorization": "Bearer YOUR_TOKEN"},
        # },
    })

    tools = await client.get_tools()
    model = ChatOpenAI(model="gpt-4o")
    agent = create_react_agent(model, tools)

    result = await agent.ainvoke({
        "messages": [{"role": "user", "content": "Start a multi-step research task"}]
    })
    print(result)

asyncio.run(main())`;

const MULTI_SERVER_CODE_ZH = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    # 同时连接多个 MCP 服务器，HuangtingFlux 作为 SOP 优化层
    client = MultiServerMCPClient({
        "huangting": {
            "transport": "http",
            "url": "${MCP_ENDPOINT}",
            # HuangtingFlux 无需认证，直接接入
        },
        # 可叠加其他 MCP 服务器
        # "your_tool_server": {
        #     "transport": "http",
        #     "url": "https://your-tool-server.com/mcp",
        #     "headers": {"Authorization": "Bearer YOUR_TOKEN"},
        # },
    })

    tools = await client.get_tools()
    model = ChatOpenAI(model="gpt-4o")
    agent = create_react_agent(model, tools)

    result = await agent.ainvoke({
        "messages": [{"role": "user", "content": "开始一个多步骤研究任务"}]
    })
    print(result)

asyncio.run(main())`;

// ─── Page Component ────────────────────────────────────────────────────────────
export default function LangChainIntegrationPage() {
  const [lang, setLang] = useState<Lang>("en");
  const s = i18n[lang];
  const quickstartCode = lang === "en" ? QUICKSTART_CODE_EN : QUICKSTART_CODE_ZH;
  const statefulCode = lang === "en" ? STATEFUL_CODE_EN : STATEFUL_CODE_ZH;
  const langgraphCode = lang === "en" ? LANGGRAPH_CODE_EN : LANGGRAPH_CODE_ZH;
  const multiServerCode = lang === "en" ? MULTI_SERVER_CODE_EN : MULTI_SERVER_CODE_ZH;

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(212,160,23,0.15)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
            HuangtingFlux
          </Link>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{s.breadcrumb}</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <LangToggle lang={lang} setLang={setLang} />
          <Link href="/integrations/crewai" className="nav-link">{s.navCrewAI}</Link>
          <a href="https://github.com/XianDAO-Labs/huangting-flux-hub" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          <a href="https://docs.langchain.com/oss/python/langchain/mcp" target="_blank" rel="noopener noreferrer" className="nav-link">{s.navDocs}</a>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">{s.sectionLabel}</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "20px 0 16px" }}>
            <span style={{ fontSize: 48 }}>🦜</span>
            <span style={{ fontSize: 32, color: "rgba(255,255,255,0.3)" }}>×</span>
            <span style={{ fontSize: 48 }}>☯</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            HuangtingFlux × <span className="text-gold">LangChain</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.7 }}>
            {s.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {s.badges.map((badge, i) => {
              const colors = [
                { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "#4ade80" },
                { bg: "rgba(212,160,23,0.1)", border: "rgba(212,160,23,0.3)", text: "var(--gold)" },
                { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", text: "#93c5fd" },
                { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", text: "#c4b5fd" },
              ];
              const c = colors[i % colors.length];
              return (
                <span key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
                  {badge}
                </span>
              );
            })}
          </div>
        </div>

        <hr className="gold-divider" style={{ marginBottom: 48 }} />

        {/* Step 1: Install */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>1</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step1Title}</h2>
          </div>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={INSTALL_CODE} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, overflowX: "auto" }}>
              <span style={{ color: "#86efac" }}>$</span>{" "}
              <span style={{ color: "var(--gold-light)" }}>{INSTALL_CODE}</span>
            </pre>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>
            {s.step1Note}
          </p>
        </section>

        {/* Step 2: Quickstart */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>2</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step2Title}</h2>
          </div>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={quickstartCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {quickstartCode}
            </pre>
          </div>
          <div className="glass-card" style={{ padding: "16px 20px", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>
              {s.step2Tip}
            </p>
          </div>
        </section>

        {/* Step 3: Stateful */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>3</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step3Title}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {s.step3Desc}
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={statefulCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {statefulCode}
            </pre>
          </div>
        </section>

        {/* Step 4: LangGraph */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>4</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step4Title}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {s.step4Desc}
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={langgraphCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {langgraphCode}
            </pre>
          </div>
        </section>

        {/* Step 5: Multi-server */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>5</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step5Title}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {s.step5Desc}
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={multiServerCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {multiServerCode}
            </pre>
          </div>
        </section>

        <hr className="gold-divider" style={{ marginBottom: 48 }} />

        {/* Tools Reference */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            <span className="text-gold">{s.toolsTitle}</span> — {s.toolsSubtitle}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {s.tools.map((tool, i) => (
              <div key={i} className="glass-card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <code style={{ color: "var(--gold-light)", fontSize: 15, fontWeight: 700, background: "rgba(212,160,23,0.1)", padding: "3px 10px", borderRadius: 4 }}>
                    {tool.name}
                  </code>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Stage {i + 1 <= 3 ? i + 1 : "—"}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>{tool.desc}</p>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.paramLabel}</span>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "4px 0 0", fontFamily: "monospace" }}>{tool.params}</p>
                  </div>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.returnLabel}</span>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "4px 0 0", fontFamily: "monospace" }}>{tool.returns}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connection Info */}
        <section style={{ marginBottom: 48 }}>
          <div className="glass-card" style={{ padding: "24px 28px", borderColor: "rgba(212,160,23,0.4)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--gold)" }}>{s.connTitle}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {s.connFields.map((item, i) => (
                <div key={i}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</span>
                  <p style={{ color: item.mono ? "var(--gold-light)" : "rgba(255,255,255,0.7)", fontSize: 13, margin: "6px 0 0", fontFamily: item.mono ? "monospace" : "inherit", wordBreak: "break-all" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{s.ctaTitle}</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 28 }}>{s.ctaSubtitle}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://github.com/XianDAO-Labs/huangting-flux-hub" target="_blank" rel="noopener noreferrer">
              <button className="btn-gold">{s.ctaGithub}</button>
            </a>
            <Link href="/integrations/crewai">
              <button className="btn-outline">{s.ctaCrewAI}</button>
            </Link>
            <Link href="/">
              <button className="btn-outline">{s.ctaHome}</button>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
