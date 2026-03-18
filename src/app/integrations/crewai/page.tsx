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

const INSTALL_CODE = `# 推荐：使用 uv 安装（CrewAI 官方推荐）
uv add mcp crewai crewai-tools

# 或使用 pip
pip install mcp crewai "crewai-tools[mcp]"`;

const DSL_QUICKSTART_CODE = `from crewai import Agent, Task, Crew

# ✨ 最简接入：DSL 方式（CrewAI 推荐）
# 直接在 mcps 字段传入 HuangtingFlux 端点 URL
research_agent = Agent(
    role="AI 研究分析师",
    goal="使用黄庭协议 SOP 完成高质量研究任务，最大化 Token 效率",
    backstory="我是一位经验丰富的研究分析师，遵循黄庭协议的三阶段 SOP 工作流，"
              "通过 start_task 压缩输入、report_step_result 追踪进度、"
              "finalize_and_report 精炼输出，将 Token 消耗降低 40%。",
    mcps=[
        "${MCP_ENDPOINT}",  # HuangtingFlux MCP 端点，无需认证
    ],
    verbose=True,
)

research_task = Task(
    description="深度分析 MCP 协议在 AI Agent 生态中的采用趋势，"
                "包括主流框架的支持情况和最佳实践。",
    expected_output="结构化的研究报告，包含 Token 节省性能数据",
    agent=research_agent,
)

crew = Crew(agents=[research_agent], tasks=[research_task])
result = crew.kickoff()
print(result)`;

const HTTP_ADAPTER_CODE = `from crewai import Agent, Task, Crew
from crewai.mcp import MCPServerHTTP

# 使用 MCPServerHTTP 进行精细化配置
huangting_server = MCPServerHTTP(
    url="${MCP_ENDPOINT}",
    streamable=True,          # 使用 Streamable HTTP 传输（推荐）
    cache_tools_list=True,    # 缓存工具列表，减少重复请求
    # headers={"X-Custom": "value"},  # 可选：自定义请求头
)

agent = Agent(
    role="Token 优化专家",
    goal="通过黄庭协议 SOP 完成任务，实现最优 Token 效率",
    backstory="专注于 AI Agent 工作流成本优化的专家，"
              "熟练运用黄庭协议三阶段 SOP：start_task → report_step_result → finalize_and_report",
    mcps=[huangting_server],
    verbose=True,
)

task = Task(
    description="分析并比较 GPT-4o、Claude 3.7 和 Gemini 2.0 的 API 定价策略，"
                "给出适合不同场景的选型建议。",
    expected_output="详细的技术选型报告，附带成本分析和 Token 节省数据",
    agent=agent,
)

crew = Crew(agents=[agent], tasks=[task])
result = crew.kickoff()
print(result)`;

const CREWBASE_CODE = `from crewai import Agent, Task, Crew
from crewai.project import CrewBase, agent, task, crew
from crewai.mcp import MCPServerHTTP

@CrewBase
class HuangtingResearchCrew:
    """使用黄庭协议 SOP 的研究 Crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # 声明 MCP 服务器配置
    mcp_server_params = [
        MCPServerHTTP(
            url="${MCP_ENDPOINT}",
            streamable=True,
            cache_tools_list=True,
        )
    ]

    @agent
    def research_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["research_analyst"],
            tools=self.get_mcp_tools(),  # 自动加载 HuangtingFlux 工具
            verbose=True,
        )

    @agent
    def report_writer(self) -> Agent:
        return Agent(
            config=self.agents_config["report_writer"],
            tools=self.get_mcp_tools(),
            verbose=True,
        )

    @task
    def research_task(self) -> Task:
        return Task(config=self.tasks_config["research_task"])

    @task
    def writing_task(self) -> Task:
        return Task(config=self.tasks_config["writing_task"])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            verbose=True,
        )

# 运行
if __name__ == "__main__":
    result = HuangtingResearchCrew().crew().kickoff()
    print(result)`;

const ADAPTER_ADVANCED_CODE = `import os
from crewai import Agent, Task, Crew
from crewai_tools import MCPServerAdapter
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# 高级用法：MCPServerAdapter（适用于需要手动管理连接的场景）
async def run_with_adapter():
    # 使用 Streamable HTTP 传输连接 HuangtingFlux
    async with streamablehttp_client("${MCP_ENDPOINT}") as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # 获取工具列表
            tools_result = await session.list_tools()
            print(f"可用工具: {[t.name for t in tools_result.tools]}")
            # 输出: ['start_task', 'report_step_result', 'finalize_and_report', 'get_network_stats']

            # 直接调用 start_task
            result = await session.call_tool(
                "start_task",
                arguments={
                    "task_description": "分析 AI Agent 框架的 Token 消耗模式",
                    "task_type": "complex_research"
                }
            )
            print(result.content)

import asyncio
asyncio.run(run_with_adapter())`;

const MULTI_AGENT_CODE = `from crewai import Agent, Task, Crew
from crewai.mcp import MCPServerHTTP

# 多 Agent 协作：所有 Agent 共享 HuangtingFlux SOP 层
huangting = MCPServerHTTP(
    url="${MCP_ENDPOINT}",
    streamable=True,
    cache_tools_list=True,
)

# Agent 1：研究员
researcher = Agent(
    role="首席研究员",
    goal="深度调研指定课题，遵循黄庭协议 SOP 高效完成任务",
    backstory="专注于技术研究的 AI 分析师，擅长信息整合与洞察提炼",
    mcps=[huangting],
    verbose=True,
)

# Agent 2：撰写者
writer = Agent(
    role="技术文档撰写者",
    goal="将研究结果转化为高质量的技术文档，使用黄庭协议精炼输出",
    backstory="专业的技术写作专家，擅长将复杂信息转化为清晰文档",
    mcps=[huangting],
    verbose=True,
)

# 任务链
research_task = Task(
    description="调研 2025-2026 年 MCP 协议的生态发展现状",
    expected_output="详细的研究摘要，包含关键数据点",
    agent=researcher,
)

writing_task = Task(
    description="基于研究结果撰写技术报告，使用 finalize_and_report 精炼最终输出",
    expected_output="完整的技术报告，附带 Token 节省性能数据",
    agent=writer,
    context=[research_task],  # 依赖研究任务的输出
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True,
)

result = crew.kickoff()
print(result)`;

const TOOLS_LIST = [
  {
    name: "start_task",
    stage: "阶段 1",
    color: "#D4A017",
    desc: "任务开始：压缩输入 Prompt，节省 30-60% Token。返回压缩后的任务简报和基线 Token 数。",
    params: "task_description: str, task_type: str",
    returns: "compressed_brief, baseline_tokens, task_id",
  },
  {
    name: "report_step_result",
    stage: "阶段 2",
    color: "#F0C040",
    desc: "步骤上报：每完成一个子步骤后调用，生成滚动摘要替代完整历史，避免上下文膨胀。",
    params: "task_id: str, step_number: int, step_result: str",
    returns: "rolling_summary, tokens_used_this_step",
  },
  {
    name: "finalize_and_report",
    stage: "阶段 3",
    color: "#86efac",
    desc: "任务结束：精炼最终输出，生成可验证的 Token 节省性能报告（含节省率、Token 对比）。",
    params: "task_id: str, final_output: str",
    returns: "refined_output, performance_report",
  },
  {
    name: "get_network_stats",
    stage: "统计",
    color: "#93c5fd",
    desc: "查询全网实时统计：接入 Agent 数、累计节省 Token、各任务类型分布。",
    params: "无",
    returns: "total_reports, total_tokens_saved, average_savings_ratio",
  },
];

const TASK_TYPES = [
  { type: "complex_research", zh: "深度研究", savings: "55-65%" },
  { type: "multi_agent_coordination", zh: "多智能体协调", savings: "50-60%" },
  { type: "code_generation", zh: "代码生成", savings: "40-50%" },
  { type: "data_analysis", zh: "数据分析", savings: "45-55%" },
  { type: "relationship_analysis", zh: "关系分析", savings: "50-60%" },
  { type: "writing", zh: "内容创作", savings: "35-45%" },
  { type: "optimization", zh: "成本优化", savings: "40-50%" },
];

export default function CrewAIIntegrationPage() {
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
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>CrewAI 集成</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/integrations/langchain" className="nav-link">LangChain 集成</Link>
          <a href="https://github.com/XianDAO-Labs/huangting-flux-hub" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          <a href="https://docs.crewai.com/en/mcp/overview" target="_blank" rel="noopener noreferrer" className="nav-link">CrewAI MCP 文档</a>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">INTEGRATION GUIDE</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "20px 0 16px" }}>
            <span style={{ fontSize: 48 }}>🚢</span>
            <span style={{ fontSize: 32, color: "rgba(255,255,255,0.3)" }}>×</span>
            <span style={{ fontSize: 48 }}>☯</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            HuangtingFlux × <span className="text-gold">CrewAI</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.7 }}>
            通过 <code style={{ color: "var(--gold-light)", background: "rgba(212,160,23,0.1)", padding: "2px 8px", borderRadius: 4 }}>MCPServerHTTP</code> 或 DSL 方式将黄庭协议三阶段 SOP 接入你的 CrewAI 多智能体系统，
            自动降低 <strong className="text-gold">40%</strong> Token 消耗。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ DSL 一行接入
            </span>
            <span style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", color: "var(--gold)", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ MCPServerHTTP 支持
            </span>
            <span style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", color: "#93c5fd", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ 兼容 CrewBase
            </span>
            <span style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
              ✓ 多 Agent 共享 SOP
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
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={INSTALL_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {INSTALL_CODE}
            </pre>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>
            HuangtingFlux 是标准 MCP 远程服务器，通过 CrewAI 内置的 MCP 支持即可直接接入，无需安装额外 SDK。
          </p>
        </section>

        {/* Step 2: DSL Quickstart */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>2</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>快速开始：DSL 方式（推荐）</h2>
          </div>
          <div className="glass-card" style={{ padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: "#4ade80", fontSize: 16 }}>🚀</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              CrewAI v1.10+ 推荐使用 <strong style={{ color: "var(--gold)" }}>DSL 方式</strong>，只需在 <code>mcps</code> 字段传入 URL 字符串即可，最简洁。
            </p>
          </div>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={DSL_QUICKSTART_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {DSL_QUICKSTART_CODE}
            </pre>
          </div>
        </section>

        {/* Step 3: MCPServerHTTP */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>3</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>精细化配置：MCPServerHTTP</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            需要更多控制（如缓存、自定义请求头）时，使用 <code style={{ color: "var(--gold-light)" }}>MCPServerHTTP</code> 进行精细化配置。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={HTTP_ADAPTER_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {HTTP_ADAPTER_CODE}
            </pre>
          </div>
        </section>

        {/* Step 4: CrewBase */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>4</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>生产级：CrewBase 类集成</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            在 <code style={{ color: "var(--gold-light)" }}>@CrewBase</code> 装饰的类中使用 <code style={{ color: "var(--gold-light)" }}>mcp_server_params</code> 属性，适合生产环境的结构化 Crew。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={CREWBASE_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {CREWBASE_CODE}
            </pre>
          </div>
        </section>

        {/* Step 5: Multi-agent */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>5</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>多 Agent 协作（共享 SOP 层）</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            HuangtingFlux 作为所有 Agent 的共享 SOP 优化层，每个 Agent 都能独立调用三阶段工具，实现整个 Crew 的 Token 效率最大化。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={MULTI_AGENT_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {MULTI_AGENT_CODE}
            </pre>
          </div>
        </section>

        {/* Step 6: Advanced */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "rgba(212,160,23,0.3)", color: "var(--gold)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0, border: "1px solid rgba(212,160,23,0.5)" }}>+</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>高级：直接调用 MCP Session</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            需要完全控制 MCP 协议层时，可直接使用 <code style={{ color: "var(--gold-light)" }}>streamablehttp_client</code> 和 <code style={{ color: "var(--gold-light)" }}>ClientSession</code>。
          </p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={ADAPTER_ADVANCED_CODE} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {ADAPTER_ADVANCED_CODE}
            </pre>
          </div>
        </section>

        <hr className="gold-divider" style={{ marginBottom: 48 }} />

        {/* Tools Reference */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            <span className="text-gold">工具参考</span> — 三阶段 SOP 工具
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TOOLS_LIST.map((tool, i) => (
              <div key={i} className="glass-card" style={{ padding: "20px 24px", borderLeft: `3px solid ${tool.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <code style={{ color: tool.color, fontSize: 15, fontWeight: 700, background: `${tool.color}18`, padding: "3px 10px", borderRadius: 4 }}>
                    {tool.name}
                  </code>
                  <span style={{ color: tool.color, fontSize: 11, border: `1px solid ${tool.color}60`, padding: "1px 8px", borderRadius: 10 }}>{tool.stage}</span>
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

        {/* Task Types */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
            <span className="text-gold">task_type</span> 参数参考
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 20 }}>
            在 <code style={{ color: "var(--gold-light)" }}>start_task</code> 中指定 <code style={{ color: "var(--gold-light)" }}>task_type</code> 可获得针对该任务类型优化的基线计算和压缩策略。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {TASK_TYPES.map((t, i) => (
              <div key={i} className="glass-card" style={{ padding: "14px 16px" }}>
                <code style={{ color: "var(--gold-light)", fontSize: 12, display: "block", marginBottom: 6 }}>{t.type}</code>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{t.zh}</span>
                <div style={{ marginTop: 8, color: "#4ade80", fontSize: 12, fontWeight: 600 }}>节省 {t.savings}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Connection Info */}
        <section style={{ marginBottom: 48 }}>
          <div className="glass-card" style={{ padding: "24px 28px", borderColor: "rgba(212,160,23,0.4)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--gold)" }}>连接信息</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { label: "MCP 端点", value: MCP_ENDPOINT, mono: true },
                { label: "传输协议", value: "Streamable HTTP (MCP 2025-12-11)", mono: false },
                { label: "认证方式", value: "无需认证（公开访问）", mono: false },
                { label: "CrewAI 最低版本", value: "crewai >= 1.0.0, crewai-tools[mcp]", mono: true },
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
            <Link href="/integrations/langchain">
              <button className="btn-outline">LangChain 集成指南 →</button>
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
