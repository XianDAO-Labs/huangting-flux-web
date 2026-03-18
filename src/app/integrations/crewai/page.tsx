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
    breadcrumb: "CrewAI Integration",
    navLangChain: "LangChain Integration",
    navDocs: "CrewAI MCP Docs",
    sectionLabel: "INTEGRATION GUIDE",
    title: "HuangtingFlux × CrewAI",
    subtitle: (
      <>
        Use <code style={{ color: "var(--gold-light)", background: "rgba(212,160,23,0.1)", padding: "2px 8px", borderRadius: 4 }}>MCPServerHTTP</code> or the DSL shorthand to connect the Huangting Protocol three-stage SOP to your CrewAI multi-agent system and automatically reduce token usage by <strong className="text-gold">40%</strong>.
      </>
    ),
    badges: ["✓ DSL One-liner", "✓ MCPServerHTTP Support", "✓ CrewBase Compatible", "✓ Multi-Agent Shared SOP"],
    step1Title: "Install Dependencies",
    step1Note: "HuangtingFlux is a standard remote MCP server. Connect via CrewAI's built-in MCP support — no additional SDK needed.",
    step2Title: "Quick Start: DSL Method (Recommended)",
    step2Tip: (
      <>
        CrewAI v1.10+ recommends the <strong style={{ color: "var(--gold)" }}>DSL method</strong> — just pass the URL string in the <code>mcps</code> field. Simplest approach.
      </>
    ),
    step3Title: "Fine-Grained Config: MCPServerHTTP",
    step3Desc: (
      <>
        When you need more control (e.g., caching, custom headers), use <code style={{ color: "var(--gold-light)" }}>MCPServerHTTP</code> for explicit configuration.
      </>
    ),
    step4Title: "Production-Ready: CrewBase Class Integration",
    step4Desc: (
      <>
        Use the <code style={{ color: "var(--gold-light)" }}>mcp_server_params</code> attribute in a <code style={{ color: "var(--gold-light)" }}>@CrewBase</code>-decorated class — ideal for structured production Crews.
      </>
    ),
    step5Title: "Multi-Agent Collaboration (Shared SOP Layer)",
    step5Desc: "HuangtingFlux acts as the shared SOP optimization layer for all agents. Each agent independently calls the three-stage tools, maximizing token efficiency across the entire Crew.",
    stepAdvTitle: "Advanced: Direct MCP Session",
    stepAdvDesc: (
      <>
        When you need full control over the MCP protocol layer, use <code style={{ color: "var(--gold-light)" }}>streamablehttp_client</code> and <code style={{ color: "var(--gold-light)" }}>ClientSession</code> directly.
      </>
    ),
    toolsTitle: "Tool Reference",
    toolsSubtitle: "Three-Stage SOP Tools",
    taskTypesTitle: "task_type Parameter Reference",
    taskTypesDesc: (
      <>
        Specifying <code style={{ color: "var(--gold-light)" }}>task_type</code> in <code style={{ color: "var(--gold-light)" }}>start_task</code> enables optimized baseline calculation and compression strategy for that task category.
      </>
    ),
    connTitle: "Connection Info",
    ctaTitle: "Ready to Start?",
    ctaSubtitle: "View the full protocol documentation or start integrating now",
    ctaGithub: "View GitHub Repo",
    ctaLangChain: "LangChain Integration Guide →",
    ctaHome: "Back to Home",
    paramLabel: "Parameters",
    returnLabel: "Returns",
    savingsLabel: "Savings",
    tools: [
      {
        name: "start_task",
        stage: "Stage 1",
        color: "#D4A017",
        desc: "Task start: Compresses the input prompt, saving 30–60% tokens. Returns a compressed task brief and baseline token count.",
        params: "task_description: str, task_type: str",
        returns: "compressed_brief, baseline_tokens, task_id",
      },
      {
        name: "report_step_result",
        stage: "Stage 2",
        color: "#F0C040",
        desc: "Step reporting: Call after each sub-step to generate a rolling summary replacing full conversation history, preventing context bloat.",
        params: "task_id: str, step_number: int, step_result: str",
        returns: "rolling_summary, tokens_used_this_step",
      },
      {
        name: "finalize_and_report",
        stage: "Stage 3",
        color: "#86efac",
        desc: "Task end: Refines the final output and generates a verifiable token-saving performance report (with savings ratio and token comparison).",
        params: "task_id: str, final_output: str",
        returns: "refined_output, performance_report",
      },
      {
        name: "get_network_stats",
        stage: "Stats",
        color: "#93c5fd",
        desc: "Query real-time global stats: total connected agents, cumulative tokens saved, task type distribution.",
        params: "None",
        returns: "total_reports, total_tokens_saved, average_savings_ratio",
      },
    ],
    taskTypes: [
      { type: "complex_research", label: "Deep Research", savings: "55-65%" },
      { type: "multi_agent_coordination", label: "Multi-Agent Coordination", savings: "50-60%" },
      { type: "code_generation", label: "Code Generation", savings: "40-50%" },
      { type: "data_analysis", label: "Data Analysis", savings: "45-55%" },
      { type: "relationship_analysis", label: "Relationship Analysis", savings: "50-60%" },
      { type: "writing", label: "Content Writing", savings: "35-45%" },
      { type: "optimization", label: "Cost Optimization", savings: "40-50%" },
    ],
    connFields: [
      { label: "MCP Endpoint", value: MCP_ENDPOINT, mono: true },
      { label: "Transport", value: "Streamable HTTP (MCP 2025-12-11)", mono: false },
      { label: "Authentication", value: "None required (public access)", mono: false },
      { label: "Min CrewAI Version", value: "crewai >= 1.0.0, crewai-tools[mcp]", mono: true },
    ],
  },
  zh: {
    breadcrumb: "CrewAI 集成",
    navLangChain: "LangChain 集成",
    navDocs: "CrewAI MCP 文档",
    sectionLabel: "集成指南",
    title: "HuangtingFlux × CrewAI",
    subtitle: (
      <>
        通过 <code style={{ color: "var(--gold-light)", background: "rgba(212,160,23,0.1)", padding: "2px 8px", borderRadius: 4 }}>MCPServerHTTP</code> 或 DSL 方式将黄庭协议三阶段 SOP 接入你的 CrewAI 多智能体系统，
        自动降低 <strong className="text-gold">40%</strong> Token 消耗。
      </>
    ),
    badges: ["✓ DSL 一行接入", "✓ MCPServerHTTP 支持", "✓ 兼容 CrewBase", "✓ 多 Agent 共享 SOP"],
    step1Title: "安装依赖",
    step1Note: "HuangtingFlux 是标准 MCP 远程服务器，通过 CrewAI 内置的 MCP 支持即可直接接入，无需安装额外 SDK。",
    step2Title: "快速开始：DSL 方式（推荐）",
    step2Tip: (
      <>
        CrewAI v1.10+ 推荐使用 <strong style={{ color: "var(--gold)" }}>DSL 方式</strong>，只需在 <code>mcps</code> 字段传入 URL 字符串即可，最简洁。
      </>
    ),
    step3Title: "精细化配置：MCPServerHTTP",
    step3Desc: (
      <>
        需要更多控制（如缓存、自定义请求头）时，使用 <code style={{ color: "var(--gold-light)" }}>MCPServerHTTP</code> 进行精细化配置。
      </>
    ),
    step4Title: "生产级：CrewBase 类集成",
    step4Desc: (
      <>
        在 <code style={{ color: "var(--gold-light)" }}>@CrewBase</code> 装饰的类中使用 <code style={{ color: "var(--gold-light)" }}>mcp_server_params</code> 属性，适合生产环境的结构化 Crew。
      </>
    ),
    step5Title: "多 Agent 协作（共享 SOP 层）",
    step5Desc: "HuangtingFlux 作为所有 Agent 的共享 SOP 优化层，每个 Agent 都能独立调用三阶段工具，实现整个 Crew 的 Token 效率最大化。",
    stepAdvTitle: "高级：直接调用 MCP Session",
    stepAdvDesc: (
      <>
        需要完全控制 MCP 协议层时，可直接使用 <code style={{ color: "var(--gold-light)" }}>streamablehttp_client</code> 和 <code style={{ color: "var(--gold-light)" }}>ClientSession</code>。
      </>
    ),
    toolsTitle: "工具参考",
    toolsSubtitle: "三阶段 SOP 工具",
    taskTypesTitle: "task_type 参数参考",
    taskTypesDesc: (
      <>
        在 <code style={{ color: "var(--gold-light)" }}>start_task</code> 中指定 <code style={{ color: "var(--gold-light)" }}>task_type</code> 可获得针对该任务类型优化的基线计算和压缩策略。
      </>
    ),
    connTitle: "连接信息",
    ctaTitle: "准备好了吗？",
    ctaSubtitle: "查看完整协议文档，或直接开始接入",
    ctaGithub: "查看 GitHub 仓库",
    ctaLangChain: "LangChain 集成指南 →",
    ctaHome: "返回首页",
    paramLabel: "参数",
    returnLabel: "返回",
    savingsLabel: "节省",
    tools: [
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
    ],
    taskTypes: [
      { type: "complex_research", label: "深度研究", savings: "55-65%" },
      { type: "multi_agent_coordination", label: "多智能体协调", savings: "50-60%" },
      { type: "code_generation", label: "代码生成", savings: "40-50%" },
      { type: "data_analysis", label: "数据分析", savings: "45-55%" },
      { type: "relationship_analysis", label: "关系分析", savings: "50-60%" },
      { type: "writing", label: "内容创作", savings: "35-45%" },
      { type: "optimization", label: "成本优化", savings: "40-50%" },
    ],
    connFields: [
      { label: "MCP 端点", value: MCP_ENDPOINT, mono: true },
      { label: "传输协议", value: "Streamable HTTP (MCP 2025-12-11)", mono: false },
      { label: "认证方式", value: "无需认证（公开访问）", mono: false },
      { label: "CrewAI 最低版本", value: "crewai >= 1.0.0, crewai-tools[mcp]", mono: true },
    ],
  },
};

// ─── Code Snippets ─────────────────────────────────────────────────────────────
const INSTALL_CODE_EN = `# Recommended: install with uv (CrewAI official recommendation)
uv add mcp crewai crewai-tools

# Or use pip
pip install mcp crewai "crewai-tools[mcp]"`;

const INSTALL_CODE_ZH = `# 推荐：使用 uv 安装（CrewAI 官方推荐）
uv add mcp crewai crewai-tools

# 或使用 pip
pip install mcp crewai "crewai-tools[mcp]"`;

const DSL_CODE_EN = `from crewai import Agent, Task, Crew

# ✨ Simplest approach: DSL method (CrewAI recommended)
# Pass the HuangtingFlux endpoint URL directly in the mcps field
research_agent = Agent(
    role="AI Research Analyst",
    goal="Complete high-quality research tasks using the Huangting Protocol SOP, maximizing token efficiency",
    backstory="An experienced research analyst who follows the Huangting Protocol three-stage SOP workflow: "
              "start_task compresses input, report_step_result tracks progress, "
              "finalize_and_report refines output — reducing token usage by 40%.",
    mcps=[
        "${MCP_ENDPOINT}",  # HuangtingFlux MCP endpoint, no auth required
    ],
    verbose=True,
)

research_task = Task(
    description="Deeply analyze the adoption trends of the MCP protocol in the AI Agent ecosystem, "
                "including framework support and best practices.",
    expected_output="Structured research report with token savings performance data",
    agent=research_agent,
)

crew = Crew(agents=[research_agent], tasks=[research_task])
result = crew.kickoff()
print(result)`;

const DSL_CODE_ZH = `from crewai import Agent, Task, Crew

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

const HTTP_CODE_EN = `from crewai import Agent, Task, Crew
from crewai.mcp import MCPServerHTTP

# Use MCPServerHTTP for fine-grained configuration
huangting_server = MCPServerHTTP(
    url="${MCP_ENDPOINT}",
    streamable=True,          # Use Streamable HTTP transport (recommended)
    cache_tools_list=True,    # Cache tool list to reduce repeated requests
    # headers={"X-Custom": "value"},  # Optional: custom request headers
)

agent = Agent(
    role="Token Optimization Specialist",
    goal="Complete tasks via the Huangting Protocol SOP for optimal token efficiency",
    backstory="An expert in AI agent workflow cost optimization, "
              "proficient in the Huangting Protocol three-stage SOP: "
              "start_task → report_step_result → finalize_and_report",
    mcps=[huangting_server],
    verbose=True,
)

task = Task(
    description="Analyze and compare the API pricing strategies of GPT-4o, Claude 3.7, and Gemini 2.0, "
                "providing selection recommendations for different scenarios.",
    expected_output="Detailed technical selection report with cost analysis and token savings data",
    agent=agent,
)

crew = Crew(agents=[agent], tasks=[task])
result = crew.kickoff()
print(result)`;

const HTTP_CODE_ZH = `from crewai import Agent, Task, Crew
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

const CREWBASE_CODE_EN = `from crewai import Agent, Task, Crew
from crewai.project import CrewBase, agent, task, crew
from crewai.mcp import MCPServerHTTP

@CrewBase
class HuangtingResearchCrew:
    """Research Crew using the Huangting Protocol SOP"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # Declare MCP server configuration
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
            tools=self.get_mcp_tools(),  # Auto-load HuangtingFlux tools
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

if __name__ == "__main__":
    result = HuangtingResearchCrew().crew().kickoff()
    print(result)`;

const CREWBASE_CODE_ZH = `from crewai import Agent, Task, Crew
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

if __name__ == "__main__":
    result = HuangtingResearchCrew().crew().kickoff()
    print(result)`;

const MULTI_AGENT_CODE_EN = `from crewai import Agent, Task, Crew
from crewai.mcp import MCPServerHTTP

# Multi-agent collaboration: all agents share the HuangtingFlux SOP layer
huangting = MCPServerHTTP(
    url="${MCP_ENDPOINT}",
    streamable=True,
    cache_tools_list=True,
)

# Agent 1: Researcher
researcher = Agent(
    role="Lead Researcher",
    goal="Conduct deep research on the given topic, following the Huangting Protocol SOP for efficiency",
    backstory="An AI analyst focused on technical research, skilled at information synthesis and insight extraction",
    mcps=[huangting],
    verbose=True,
)

# Agent 2: Writer
writer = Agent(
    role="Technical Documentation Writer",
    goal="Transform research findings into high-quality technical documents using the Huangting Protocol for refined output",
    backstory="A professional technical writer who excels at converting complex information into clear documentation",
    mcps=[huangting],
    verbose=True,
)

# Task chain
research_task = Task(
    description="Research the ecosystem development of the MCP protocol in 2025-2026",
    expected_output="Detailed research summary with key data points",
    agent=researcher,
)

writing_task = Task(
    description="Write a technical report based on the research findings, using finalize_and_report to refine the final output",
    expected_output="Complete technical report with token savings performance data",
    agent=writer,
    context=[research_task],  # Depends on research task output
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True,
)

result = crew.kickoff()
print(result)`;

const MULTI_AGENT_CODE_ZH = `from crewai import Agent, Task, Crew
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
    context=[research_task],
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True,
)

result = crew.kickoff()
print(result)`;

const ADVANCED_CODE_EN = `import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# Advanced: direct MCP session control
async def run_with_session():
    async with streamablehttp_client("${MCP_ENDPOINT}") as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List available tools
            tools_result = await session.list_tools()
            print(f"Available tools: {[t.name for t in tools_result.tools]}")
            # Output: ['start_task', 'report_step_result', 'finalize_and_report', 'get_network_stats']

            # Directly call start_task
            result = await session.call_tool(
                "start_task",
                arguments={
                    "task_description": "Analyze token consumption patterns in AI Agent frameworks",
                    "task_type": "complex_research"
                }
            )
            print(result.content)

asyncio.run(run_with_session())`;

const ADVANCED_CODE_ZH = `import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# 高级用法：直接控制 MCP Session
async def run_with_session():
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

asyncio.run(run_with_session())`;

// ─── Page Component ────────────────────────────────────────────────────────────
export default function CrewAIIntegrationPage() {
  const [lang, setLang] = useState<Lang>("en");
  const s = i18n[lang];
  const installCode = lang === "en" ? INSTALL_CODE_EN : INSTALL_CODE_ZH;
  const dslCode = lang === "en" ? DSL_CODE_EN : DSL_CODE_ZH;
  const httpCode = lang === "en" ? HTTP_CODE_EN : HTTP_CODE_ZH;
  const crewbaseCode = lang === "en" ? CREWBASE_CODE_EN : CREWBASE_CODE_ZH;
  const multiAgentCode = lang === "en" ? MULTI_AGENT_CODE_EN : MULTI_AGENT_CODE_ZH;
  const advancedCode = lang === "en" ? ADVANCED_CODE_EN : ADVANCED_CODE_ZH;

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
          <Link href="/integrations/langchain" className="nav-link">{s.navLangChain}</Link>
          <a href="https://github.com/XianDAO-Labs/huangting-flux-hub" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          <a href="https://docs.crewai.com/en/mcp/overview" target="_blank" rel="noopener noreferrer" className="nav-link">{s.navDocs}</a>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">{s.sectionLabel}</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "20px 0 16px" }}>
            <span style={{ fontSize: 48 }}>🚢</span>
            <span style={{ fontSize: 32, color: "rgba(255,255,255,0.3)" }}>×</span>
            <span style={{ fontSize: 48 }}>☯</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            HuangtingFlux × <span className="text-gold">CrewAI</span>
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
            <CopyButton text={installCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {installCode}
            </pre>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>
            {s.step1Note}
          </p>
        </section>

        {/* Step 2: DSL */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>2</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step2Title}</h2>
          </div>
          <div className="glass-card" style={{ padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: "#4ade80", fontSize: 16 }}>🚀</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{s.step2Tip}</p>
          </div>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={dslCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {dslCode}
            </pre>
          </div>
        </section>

        {/* Step 3: MCPServerHTTP */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>3</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step3Title}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{s.step3Desc}</p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={httpCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {httpCode}
            </pre>
          </div>
        </section>

        {/* Step 4: CrewBase */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>4</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step4Title}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{s.step4Desc}</p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={crewbaseCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {crewbaseCode}
            </pre>
          </div>
        </section>

        {/* Step 5: Multi-agent */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "var(--gold)", color: "#000", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>5</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.step5Title}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{s.step5Desc}</p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={multiAgentCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {multiAgentCode}
            </pre>
          </div>
        </section>

        {/* Advanced */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "rgba(212,160,23,0.3)", color: "var(--gold)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0, border: "1px solid rgba(212,160,23,0.5)" }}>+</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.stepAdvTitle}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{s.stepAdvDesc}</p>
          <div className="code-block" style={{ padding: "20px" }}>
            <CopyButton text={advancedCode} lang={lang} />
            <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
              {advancedCode}
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

        {/* Task Types */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
            <span className="text-gold">task_type</span> {s.taskTypesTitle.replace("task_type ", "").replace("task_type Parameter Reference", "Parameter Reference")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 20 }}>{s.taskTypesDesc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {s.taskTypes.map((t, i) => (
              <div key={i} className="glass-card" style={{ padding: "14px 16px" }}>
                <code style={{ color: "var(--gold-light)", fontSize: 12, display: "block", marginBottom: 6 }}>{t.type}</code>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{t.label}</span>
                <div style={{ marginTop: 8, color: "#4ade80", fontSize: 12, fontWeight: 600 }}>{s.savingsLabel} {t.savings}</div>
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
            <Link href="/integrations/langchain">
              <button className="btn-outline">{s.ctaLangChain}</button>
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
