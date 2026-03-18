"use client";
import { useState } from "react";
import Link from "next/link";

const MCP_ENDPOINT = "https://mcp.huangting.ai/mcp";

function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
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
      {copied ? "已复制 ✓" : label}
    </button>
  );
}

const INSTALL_CODE = `pip install langchain-mcp-adapters langchain-openai`;

const QUICKSTART_CODE = `import asyncio
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

const STATEFUL_CODE = `import asyncio
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

const LANGGRAPH_CODE = `import asyncio
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

    # 打印最终消息
    for msg in result["messages"]:
        print(f"[{msg.type}] {msg.content[:200]}")

asyncio.run(main())`;

const MULTI_SERVER_CODE = `import asyncio
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

const TOOLS_LIST = [
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
];

export default function LangChainIntegrationPage() {
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
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>LangChain 集成</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/integrations/crewai" className="nav-link">CrewAI 集成</Link>
          <a href="https://github.com/XianDAO-Labs/huangting-flux-hub" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          <a href="https://docs.langchain.com/oss/python/langchain/mcp" target="_blank" rel="noopener noreferrer" className="nav-link">LangChain MCP 文档</a>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">INTEGRATION GUIDE</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "20px 0 16px" }}>
            <span style={{ fontSize: 48 }}>🦜</span>
            <span style={{ fontSize: 32, color: "rgba(255,255,255,0.3)" }}>×</span>
            <span style={{ fontSize: 48 }}>☯</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            HuangtingFlux × <span className="text-gold">LangChain</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.7 }}>
            通过 <code style={{ color: "var(--gold-light)", background: "rgba(212,160,23,0.1)", padding: "2px 8px", borderRadius: 4 }}>langchain-mcp-adapters</code> 将黄庭协议三阶段 SOP 接入你的 LangChain Agent，
            自动降低 <strong className="text-gold">40%</strong> Token 消耗。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ 无需认证
            </span>
            <span style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", color: "var(--gold)", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ Streamable HTTP 传输
            </span>
            <span style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", color: "#93c5fd", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ 兼容 LangGraph
            </span>
            <span style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ MCP 2025-12-11
            </span>
          </div>
        </div>

        <hr className="gold-divider" style={{ marginBottom: 48 }} />

        {/* Step 1: Install */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>1</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>安装依赖</h2>
          </div>
          <div className="code-block" style={{ padding: "20px 20px 20px 20px" }}>
            <CopyButton text={INSTALL_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, overflowX: "auto" }}>
              <span style={{ color: "#86efac" }}>$</span>{" "}
              <span style={{ color: "var(--gold-light)" }}>{INSTALL_CODE}</span>
            </pre>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>
            HuangtingFlux 是一个标准的 MCP 远程服务器，通过 <code style={{ color: "var(--gold-light)" }}>langchain-mcp-adapters</code> 即可直接接入，无需安装额外的 HuangtingFlux SDK。
          </p>
        </section>

        {/* Step 2: Quickstart */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>2</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>快速开始</h2>
          </div>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={QUICKSTART_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {QUICKSTART_CODE}
            </pre>
          </div>
          <div className="glass-card" style={{ padding: "16px 20px", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>
              <strong style={{ color: "var(--gold)" }}>自动 SOP 遵循</strong>：当 Agent 连接到 HuangtingFlux 后，LLM 会通过工具描述自动理解三阶段 SOP 的调用顺序（<code>start_task → report_step_result → finalize_and_report</code>），无需手动编排。
            </p>
          </div>
        </section>

        {/* Step 3: Stateful */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>3</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>有状态会话（推荐用于长任务）</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            对于需要跨多个步骤保持上下文的任务，使用 <code style={{ color: "var(--gold-light)" }}>client.session()</code> 创建持久化会话，确保 <code style={{ color: "var(--gold-light)" }}>task_id</code> 在整个任务生命周期内保持一致。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={STATEFUL_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {STATEFUL_CODE}
            </pre>
          </div>
        </section>

        {/* Step 4: LangGraph */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>4</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>与 LangGraph 集成</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            HuangtingFlux 与 LangGraph 完全兼容。使用 <code style={{ color: "var(--gold-light)" }}>langgraph.prebuilt.create_react_agent</code> 构建更复杂的 Agent 图结构。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={LANGGRAPH_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {LANGGRAPH_CODE}
            </pre>
          </div>
        </section>

        {/* Step 5: Multi-server */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>5</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>多服务器模式（HuangtingFlux 作为 SOP 层）</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            将 HuangtingFlux 作为所有 Agent 工作流的 SOP 优化层，与其他工具服务器并列接入。HuangtingFlux 负责 Token 管理，其他服务器提供业务工具。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={MULTI_SERVER_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {MULTI_SERVER_CODE}
            </pre>
          </div>
        </section>

        <hr className="gold-divider" style={{ marginBottom: 48 }} />

        {/* Tools Reference */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            <span className="text-gold">工具参考</span> — HuangtingFlux 提供的 4 个 MCP 工具
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TOOLS_LIST.map((tool, i) => (
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
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>参数</span>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "4px 0 0", fontFamily: "monospace" }}>{tool.params}</p>
                  </div>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>返回</span>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "4px 0 0", fontFamily: "monospace" }}>{tool.returns}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP Endpoint Info */}
        <section style={{ marginBottom: 48 }}>
          <div className="glass-card" style={{ padding: "24px 28px", borderColor: "rgba(212,160,23,0.4)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--gold)" }}>连接信息</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { label: "MCP 端点", value: MCP_ENDPOINT, mono: true },
                { label: "传输协议", value: "Streamable HTTP (MCP 2025-12-11)", mono: false },
                { label: "认证方式", value: "无需认证（公开访问）", mono: false },
                { label: "GitHub", value: "XianDAO-Labs/huangting-flux-hub", mono: true },
              ].map((item, i) => (
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
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>准备好了吗？</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 28 }}>查看完整协议文档，或直接开始接入</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://github.com/XianDAO-Labs/huangting-flux-hub" target="_blank" rel="noopener noreferrer">
              <button className="btn-gold">查看 GitHub 仓库</button>
            </a>
            <Link href="/integrations/crewai">
              <button className="btn-outline">CrewAI 集成指南 →</button>
            </Link>
            <Link href="/">
              <button className="btn-outline">返回首页</button>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
