export interface ArticleEn {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  date: string;
  readTime: string;
  draftFile: string;
  featured?: boolean;
  author: string;
}

export const ARTICLES_EN: ArticleEn[] = [
  {
    slug: 'amd-bc250-cooling-undervolt-thermal-guide',
    title: 'Taming the 100°C Beast: AMD BC-250 (PS5 APU) Thermal & Power Optimization Guide via SMU Undervolt and NCT6687d PWM Fan Control',
    excerpt: 'How we brought the Oberon / Cyan Skillfish APU from dangerous 101°C throttling down to 85°C while slashing power consumption from 68W to 41W (-39%) with zero performance loss on Microsoft Phi-4 (14B).',
    category: 'decision',
    categoryLabel: '💻 AI Infrastructure',
    tags: ['BC-250', 'Undervolting', 'SMU', 'NCT6687d', 'Cooling Hack', 'Power Optimization', 'llama.cpp'],
    date: '2026-11-03',
    readTime: '12 min',
    draftFile: 'en_amd-bc250-cooling-undervolt-guide.html',
    author: 'Pottle',
  },
  {
    slug: 'amd-bc250-40cu-unlock-llm-server-guide',
    title: 'Unlocking the PS5 APU: Full 40 CU & 8-Core/16-Thread Guide for AMD BC-250 — Running Microsoft Phi-4 (14B) on Fedora 45',
    excerpt: 'How to bypass Ubuntu RANDSTRUCT rejections, ACPI reboot hangs, and LVM limitations to unleash all 2,560 stream processors and 448 GB/s GDDR6 on the $150 AMD BC-250, running Phi-4 14B at 9.3 tok/s.',
    category: 'hardware-silicon',
    categoryLabel: 'GPU Acceleration & LLM',
    tags: ['BC250', 'PS5', '40CU', 'HardwareUnlock', 'Phi4', 'Vulkan', 'LocalLLM', 'Fedora45'],
    date: '2026-11-03',
    readTime: '12 min read',
    draftFile: 'en_amd-bc250-40cu-unlock-llm-server-guide.html',
    featured: true,
    author: 'Pottle / Smart AI Life Global'
  },
  {
    slug: 'strata-gpu-unlock-rtx4070tis-dual-gpu-benchmark',
    title: 'Strata Dual-GPU Benchmark: RTX 4070 Ti SUPER (Primary 16GB) + RTX 3060 (Sub 12GB) with GPU-UNLOCK (1,265 tok/s Prefill)',
    excerpt: 'Detailed empirical telemetry on dual-GeForce MoE inference: RTX 4070 Ti SUPER as primary compute engine + RTX 3060 as sub KV-cache co-processor, hitting 158.5 TFLOPS and cutting TTFT by 58%.',
    category: 'hardware-silicon',
    categoryLabel: 'GPU Acceleration & LLM',
    tags: ['Strata', 'RTX4070TiSuper', 'RTX3060', 'DualGPU', 'GPUUnlock', 'LocalLLM', 'Qwen'],
    date: '2026-10-31',
    readTime: '10 min read',
    draftFile: 'en_strata-gpu-unlock-rtx4070tis-dual-gpu-benchmark.html',
    featured: true,
    author: 'Pottle / Smart AI Life Global'
  },
  {
    slug: 'antigravity-hermes-agent-local-llm-routing',
    title: 'Zero-Cloud-Cost Autonomous Agents: Routing Gemini & Antigravity to Local Hermes LLMs',
    excerpt: 'How to build a zero-cloud-token agentic workflow by coupling Google DeepMind Antigravity with local Nous Hermes models and Strata GPU routing, slashing API expenses while preserving reasoning depth.',
    category: 'ai-agents',
    categoryLabel: 'AI Agents & LLM',
    tags: ['AutonomousAgents', 'HermesAgent', 'LocalLLM', 'Antigravity', 'Laya', 'Economics'],
    date: '2026-10-31',
    readTime: '9 min read',
    draftFile: 'en_antigravity-hermes-agent-local-llm-routing.html',
    featured: true,
    author: 'Pottle / Smart AI Life Global'
  },
  {
    slug: 'open-energy-os-hems-jit-solar-battery-charging',
    title: 'Building an Open Home Energy OS: JIT Night-Rate Charging (16.3 JPY) & ECHONET Lite Solar Offset',
    excerpt: 'Detailed protocol for residential microgrids: Integrating Nichicon 14.9kWh batteries, Panasonic HEMS CenteHTTPd, and Wi-SUN B-route telemetry to cut annual electricity costs by $2,100.',
    category: 'energy-hems',
    categoryLabel: 'Energy OS & HEMS',
    tags: ['SmartHome', 'HEMS', 'ECHONETLite', 'SolarEnergy', 'NichiconBattery', 'JITCharging'],
    date: '2026-10-31',
    readTime: '11 min read',
    draftFile: 'en_open-energy-os-hems-jit-solar-battery-charging.html',
    featured: true,
    author: 'Pottle / Smart AI Life Global'
  },
  {
    slug: 'ryzen-9-7950x-avx512-linux-decentralized-node-tuning',
    title: 'Ryzen 9 7950X AVX-512 & Linux Kernel Tuning: Maximize Efficiency for 24/7 Compute Nodes',
    excerpt: 'Silicon benchmarks on AMD Zen 4 architecture: Cutting socket power consumption by 41% using 105W Eco Mode and Curve Optimizer while maintaining maximum SIMD throughput on Linux Ubuntu 24.04.',
    category: 'hardware-silicon',
    categoryLabel: 'Hardware & Silicon',
    tags: ['AMD', 'Ryzen7950X', 'AVX512', 'HardwareTelemetry', 'HugePages', 'LinuxTuning'],
    date: '2026-10-31',
    readTime: '8 min read',
    draftFile: 'en_ryzen-9-7950x-avx512-linux-decentralized-node-tuning.html',
    featured: true,
    author: 'Ricolo & Pottle'
  }
];
