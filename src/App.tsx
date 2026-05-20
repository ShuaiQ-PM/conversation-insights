import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Circle,
  Download,
  Filter,
  Flame,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  PackageCheck,
  PlayCircle,
  Radar,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "./lib/utils";

type ViewKey = "home" | "emotion" | "risk" | "hotspot" | "custom";
type DemoMode = "prototype" | "logic";
type IconType = ComponentType<{ className?: string }>;
type Annotation = {
  id: number;
  target: string;
  title: string;
  markdown?: string;
  points: string[];
  place?: "tr" | "tl" | "br" | "bl";
};
type TimeRange = "today" | "yesterday" | "7d" | "30d";
type EmotionTab = "overview" | "reports";
type EmotionTrendMode = "sentiment" | "messages";
type HotspotCategoryKey = "all" | "demand" | "consult" | "feedback" | "risk";
type HotspotMention = {
  product: string;
  customer: string;
  date: string;
  time: string;
  summary: string;
  intent: string;
  category: HotspotCategoryKey;
  sentiment: "正向" | "中性" | "负向";
  ranges: TimeRange[];
};

const views: Array<{ key: ViewKey; label: string; icon: IconType; scene: string }> = [
  { key: "home", label: "功能首页", icon: LayoutDashboard, scene: "会话洞察总览" },
  { key: "emotion", label: "客户情绪分析", icon: HeartPulse, scene: "单客情绪闭环" },
  { key: "risk", label: "高风险客户预警", icon: ShieldAlert, scene: "风险发现与处置" },
  { key: "hotspot", label: "产品热点洞察", icon: Flame, scene: "需求热点到运营动作" },
  { key: "custom", label: "自定义场景洞察", icon: Radar, scene: "场景配置与命中复盘" },
];

const emotionTrend = [
  { time: "4.19", value: -0.16, messages: 86, positive: 54, negative: 28, risk: 41 },
  { time: "4.20", value: -0.14, messages: 78, positive: 55, negative: 26, risk: 38 },
  { time: "4.21", value: -0.18, messages: 112, positive: 51, negative: 31, risk: 46 },
  { time: "4.22", value: -0.15, messages: 96, positive: 53, negative: 29, risk: 42 },
  { time: "4.23", value: -0.12, messages: 124, positive: 56, negative: 27, risk: 39 },
  { time: "4.24", value: -0.13, messages: 82, positive: 57, negative: 25, risk: 36 },
  { time: "4.25", value: -0.2, messages: 196, positive: 48, negative: 35, risk: 58 },
  { time: "4.26", value: -0.18, messages: 168, positive: 49, negative: 34, risk: 54 },
  { time: "4.27", value: -0.17, messages: 184, positive: 52, negative: 32, risk: 50 },
  { time: "4.28", value: -0.16, messages: 139, positive: 54, negative: 30, risk: 44 },
  { time: "4.29", value: -0.13, messages: 92, positive: 57, negative: 24, risk: 35 },
  { time: "4.30", value: -0.16, messages: 158, positive: 55, negative: 29, risk: 41 },
  { time: "5.1", value: -0.12, messages: 74, positive: 60, negative: 21, risk: 32 },
  { time: "5.2", value: -0.11, messages: 86, positive: 61, negative: 20, risk: 30 },
  { time: "5.3", value: 0.02, messages: 42, positive: 64, negative: 18, risk: 24 },
  { time: "5.4", value: -0.15, messages: 118, positive: 56, negative: 28, risk: 40 },
  { time: "5.5", value: -0.13, messages: 91, positive: 58, negative: 25, risk: 36 },
  { time: "5.6", value: -0.17, messages: 132, positive: 53, negative: 31, risk: 47 },
  { time: "5.7", value: -0.14, messages: 109, positive: 56, negative: 27, risk: 39 },
  { time: "5.8", value: -0.1, messages: 66, positive: 63, negative: 19, risk: 29 },
  { time: "5.9", value: -0.13, messages: 88, positive: 59, negative: 24, risk: 34 },
  { time: "5.10", value: -0.14, messages: 103, positive: 57, negative: 26, risk: 37 },
  { time: "5.11", value: -0.12, messages: 71, positive: 60, negative: 22, risk: 31 },
  { time: "5.12", value: -0.11, messages: 76, positive: 62, negative: 21, risk: 29 },
  { time: "5.13", value: -0.16, messages: 126, positive: 55, negative: 29, risk: 43 },
  { time: "5.14", value: -0.15, messages: 98, positive: 56, negative: 27, risk: 39 },
  { time: "5.15", value: -0.1, messages: 62, positive: 64, negative: 18, risk: 27 },
  { time: "5.16", value: -0.08, messages: 48, positive: 66, negative: 17, risk: 25 },
  { time: "5.17", value: 0.04, messages: 58, positive: 69, negative: 15, risk: 19 },
  { time: "5.18", value: -0.12, messages: 89, positive: 59, negative: 23, risk: 33 },
];

const productTopicTrend = [
  { day: "周三", 舒缓修护面膜: 83, 氨基酸洁面: 62, 屏障精华: 54, 防晒乳: 38 },
  { day: "周四", 舒缓修护面膜: 91, 氨基酸洁面: 68, 屏障精华: 59, 防晒乳: 41 },
  { day: "周五", 舒缓修护面膜: 106, 氨基酸洁面: 74, 屏障精华: 67, 防晒乳: 45 },
  { day: "周六", 舒缓修护面膜: 128, 氨基酸洁面: 86, 屏障精华: 75, 防晒乳: 49 },
  { day: "周日", 舒缓修护面膜: 149, 氨基酸洁面: 96, 屏障精华: 82, 防晒乳: 54 },
  { day: "昨日", 舒缓修护面膜: 161, 氨基酸洁面: 108, 屏障精华: 93, 防晒乳: 58 },
  { day: "今日", 舒缓修护面膜: 173, 氨基酸洁面: 118, 屏障精华: 101, 防晒乳: 62 },
];

const emotionChats = [
  { id: 1, name: "林小姐", tag: "敏感肌咨询", score: 34, status: "待安抚", last: "我怕用了又泛红，之前踩过坑。" },
  { id: 2, name: "赵先生", tag: "价格犹豫", score: 62, status: "可推进", last: "如果两盒一起买能优惠吗？" },
  { id: 3, name: "陈女士", tag: "物流焦虑", score: 41, status: "待确认", last: "明天生日送人，今天不发就来不及。" },
  { id: 4, name: "宋女士", tag: "成分顾虑", score: 38, status: "待安抚", last: "我皮肤比较薄，怕里面有刺激成分。" },
  { id: 5, name: "潘二抽", tag: "物流投诉", score: 29, status: "待处理", last: "已经等这么久了，还要我继续等吗？" },
  { id: 6, name: "王先生", tag: "竞品比价", score: 45, status: "待跟进", last: "隔壁直播间便宜不少，你们贵在哪？" },
  { id: 7, name: "Ada", tag: "评价验证", score: 42, status: "待确认", last: "有没有真实敏感肌反馈？我不想再踩雷。" },
  { id: 8, name: "浅巷。", tag: "过敏售后", score: 27, status: "待处理", last: "用了之后脸颊刺痛泛红，应该怎么办？" },
];

const timeRanges: Array<{ key: TimeRange; label: string }> = [
  { key: "today", label: "今日" },
  { key: "yesterday", label: "昨日" },
  { key: "7d", label: "近7日" },
  { key: "30d", label: "近30日" },
];

const hotspotCategories: Array<{ key: HotspotCategoryKey; label: string; desc: string }> = [
  { key: "all", label: "全部场景", desc: "查看所有提及" },
  { key: "demand", label: "强需求", desc: "购买、加购、搭配意图" },
  { key: "consult", label: "产品咨询", desc: "功效、肤质、用法确认" },
  { key: "feedback", label: "问题反馈", desc: "使用疑虑和效果反馈" },
  { key: "risk", label: "投诉风险", desc: "不满、退货、流失信号" },
];

const emotionStats: Record<TimeRange, { conversations: number; messages: number; positive: number; neutral: number; negative: number; risk: number; handled: number }> = {
  today: { conversations: 1280, messages: 3300, positive: 60, neutral: 10, negative: 30, risk: 67, handled: 41 },
  yesterday: { conversations: 1164, messages: 2986, positive: 56, neutral: 16, negative: 28, risk: 59, handled: 52 },
  "7d": { conversations: 8420, messages: 23180, positive: 58, neutral: 15, negative: 27, risk: 286, handled: 241 },
  "30d": { conversations: 36240, messages: 98420, positive: 61, neutral: 14, negative: 25, risk: 1128, handled: 973 },
};

const emotionHotwords = [
  {
    word: "放心",
    sentiment: "positive" as const,
    count: 186,
    change: "+21%",
    customers: [
      { name: "周女士", score: 82, summary: "询问敏感肌面膜后接受 7 天试用说明，表达“这样比较放心”。" },
      { name: "何先生", score: 76, summary: "客服解释质检批次和无忧售后后，客户继续咨询组合套餐。" },
      { name: "许小姐", score: 88, summary: "收到物流时效承诺后，主动询问是否有礼盒装。" },
    ],
  },
  {
    word: "适合敏感肌",
    sentiment: "positive" as const,
    count: 142,
    change: "+34%",
    customers: [
      { name: "林小姐", score: 74, summary: "多次确认成分刺激性，看到试用步骤后购买意向回升。" },
      { name: "Mia", score: 69, summary: "从泛红担忧转为询问使用频次和搭配产品。" },
    ],
  },
  {
    word: "有保障",
    sentiment: "positive" as const,
    count: 118,
    change: "+16%",
    customers: [
      { name: "陈女士", score: 79, summary: "客服说明退换流程和运费承担后，客户接受下单建议。" },
      { name: "赵先生", score: 72, summary: "关注组合价格和售后权益，最终进入付款确认。" },
    ],
  },
  {
    word: "怕过敏",
    sentiment: "negative" as const,
    count: 96,
    change: "+28%",
    customers: [
      { name: "林小姐", score: 34, summary: "客户提到之前使用护肤品泛红，对面膜试用风险敏感。" },
      { name: "宋女士", score: 38, summary: "反复询问成分和退货条件，暂未接受客服推荐。" },
      { name: "Ada", score: 42, summary: "对“修护”功效有期待，但要求先看真实评价。" },
    ],
  },
  {
    word: "太贵",
    sentiment: "negative" as const,
    count: 84,
    change: "+12%",
    customers: [
      { name: "赵先生", score: 62, summary: "对两盒组合价犹豫，等待客服解释单片成本和赠品权益。" },
      { name: "王先生", score: 45, summary: "拿竞品直播价做比较，需要差异化价值说明。" },
    ],
  },
  {
    word: "不想折腾",
    sentiment: "negative" as const,
    count: 57,
    change: "+19%",
    customers: [
      { name: "潘二抽", score: 29, summary: "物流延迟后表达强烈不满，要求直接给解决方案。" },
      { name: "李女士", score: 36, summary: "担心售后寄回麻烦，需明确上门取件和运费承担。" },
    ],
  },
];

const emotionDailyReports = [
  {
    date: "05-19 今日",
    conversations: 1280,
    messages: 3300,
    positive: 60,
    neutral: 10,
    negative: 30,
    risk: 67,
    handled: 41,
    avgResponse: "1分42秒",
    topPositive: "放心、有保障、适合敏感肌",
    topNegative: "怕过敏、太贵、不想折腾",
    insight: "敏感肌咨询增长，负向集中在过敏和价格犹豫。",
    samples: ["林小姐：担心泛红，需先给试用路径和售后承诺。", "赵先生：价格犹豫，适合解释组合权益。", "潘二抽：物流延迟后情绪恶化，需人工优先接管。"],
  },
  {
    date: "05-18 昨日",
    conversations: 1164,
    messages: 2986,
    positive: 56,
    neutral: 16,
    negative: 28,
    risk: 59,
    handled: 52,
    avgResponse: "1分58秒",
    topPositive: "有保障、发货快、解释清楚",
    topNegative: "贵、等太久、没看到效果",
    insight: "直播流量回落，物流焦虑下降但价格质疑上升。",
    samples: ["何先生：对赠品价值不清楚，需补充权益解释。", "宋女士：物流焦虑下降，仍关注售后流程。", "Ada：咨询功效评价，需要真实案例承接。"],
  },
  {
    date: "05-17 周日",
    conversations: 1038,
    messages: 2544,
    positive: 63,
    neutral: 15,
    negative: 22,
    risk: 42,
    handled: 38,
    avgResponse: "1分36秒",
    topPositive: "礼盒好看、放心、到货快",
    topNegative: "怕不适合、优惠少、不会用",
    insight: "礼盒装咨询带来正向提升，客服承接较稳定。",
    samples: ["许小姐：送礼场景明确，询问到货后意愿增强。", "陈女士：客服解释礼盒包装后转正向。", "Mia：询问使用频次，可进入搭配推荐。"],
  },
  {
    date: "05-16 周六",
    conversations: 1196,
    messages: 3128,
    positive: 54,
    neutral: 14,
    negative: 32,
    risk: 74,
    handled: 49,
    avgResponse: "2分21秒",
    topPositive: "客服耐心、有赠品、能退换",
    topNegative: "等太久、没人回、怕过敏",
    insight: "夜间直播承接不足，售后等待客户风险走高。",
    samples: ["李女士：连续等待后不满升级，需要明确处理时限。", "王先生：拿竞品价格比较，需差异化说明。", "周女士：直播后未及时回复，意向下降。"],
  },
  {
    date: "05-15 周五",
    conversations: 1248,
    messages: 3012,
    positive: 59,
    neutral: 15,
    negative: 26,
    risk: 51,
    handled: 46,
    avgResponse: "1分49秒",
    topPositive: "质检放心、试用友好、客服专业",
    topNegative: "刺激、退货麻烦、价格高",
    insight: "质检证明话术覆盖后，敏感肌担忧有所缓解。",
    samples: ["林小姐：看到质检说明后继续咨询。", "何先生：要求查看成分解释，客服承接有效。", "宋女士：仍需补充退货边界说明。"],
  },
];

const dailyCustomerRows = [
  { name: "羊羊", summary: "反馈使用早C晚A产品后担心借鉴不当，询问是否适合敏感肌。", positive: 4, neutral: 57, negative: 20, status: "待处理", owner: "小岚" },
  { name: "七七", summary: "35岁，有抗老和淡斑需求，皮肤耐受度高，关注用水频次。", positive: 2, neutral: 31, negative: 3, status: "观察中", owner: "阿辰" },
  { name: "鹏鹏", summary: "员工发布618四重福利活动信息，客户担心肤质档案不完整。", positive: 6, neutral: 15, negative: 13, status: "跟进中", owner: "Mia" },
  { name: "heybiblee", summary: "社群欢迎信息后咨询会员权益，对价格和赠品差异有疑问。", positive: 2, neutral: 28, negative: 3, status: "已处理", owner: "周宁" },
  { name: "小紫", summary: "询问618福利操作指引，担心活动流程复杂导致错过权益。", positive: 4, neutral: 25, negative: 3, status: "已处理", owner: "小岚" },
  { name: "SRL", summary: "自述皮肤状态被建议暂不适合抗老产品，需要转入修护方案。", positive: 4, neutral: 19, negative: 5, status: "跟进中", owner: "阿辰" },
  { name: "你与时光皆薄凉", summary: "订单号上传失败，经员工询问确认后仍担心物流时效。", positive: 3, neutral: 22, negative: 3, status: "观察中", owner: "Mia" },
  { name: "浅巷。", summary: "使用早C晚酸后出现脸颊泛红刺痛，需优先进入过敏售后流程。", positive: 0, neutral: 18, negative: 9, status: "待处理", owner: "小岚" },
];

const initialRisks = [
  { id: 1, name: "潘二抽", reason: "检测到强烈的“收货紧迫感”与“对包材完整性的担忧”，若不及时安抚，极易产生差评。", tags: ["服务投诉"], risk: 92, owner: "未分配", status: "待处理", time: "2026-05-01 12:09:01", type: "服务投诉" },
  { id: 2, name: "Shuai_Q", reason: "用户多次通过语义隐喻对比竞品“百亿补贴”后的价格，目前处于决策摇摆期，流失概率 65%。", tags: ["价格纠纷"], risk: 78, owner: "小岚", status: "待处理", time: "2026-04-30 12:08:03", type: "价格纠纷" },
  { id: 3, name: "王先生", reason: "反馈合并订单无法识别，积分未计入，已经出现服务不满和规则质疑。", tags: ["售后物流"], risk: 86, owner: "未分配", status: "待处理", time: "2026-04-30 11:42:16", type: "售后物流" },
  { id: 4, name: "Mia", reason: "连续咨询产品功效与使用反应，担心A醇后过敏，需转入专业护肤指导。", tags: ["产品问题"], risk: 69, owner: "阿辰", status: "观察中", time: "2026-04-29 19:20:18", type: "产品问题" },
];

const riskTrendData = [
  { date: "05-01", warnings: 68, handled: 57 },
  { date: "05-02", warnings: 52, handled: 42 },
  { date: "05-03", warnings: 68, handled: 64 },
  { date: "05-04", warnings: 80, handled: 77 },
  { date: "05-05", warnings: 60, handled: 55 },
  { date: "05-06", warnings: 44, handled: 27 },
  { date: "05-07", warnings: 24, handled: 21 },
];

const riskSemanticDistribution = [
  { name: "售后物流", value: 48, color: "#ffd166" },
  { name: "价格纠纷", value: 30, color: "#5bc0eb" },
  { name: "服务投诉", value: 12, color: "#ff4d57" },
  { name: "产品问题", value: 8, color: "#ef4bb2" },
  { name: "活动质疑", value: 1, color: "#63e67f" },
  { name: "其他", value: 1, color: "#cbd5e1" },
];

const hotspotProducts = [
  { name: "舒缓修护面膜", mentions: 462, growth: "+31%", opportunity: "敏感肌修护套装", score: 92, buyers: 128, risk: "过敏顾虑", action: "沉淀敏感肌试用与售后保障话术" },
  { name: "氨基酸洁面", mentions: 318, growth: "+18%", opportunity: "控油不紧绷卖点", score: 81, buyers: 92, risk: "清洁力质疑", action: "补充肤质分层推荐和洗后反馈案例" },
  { name: "屏障精华", mentions: 286, growth: "+24%", opportunity: "换季维稳组合", score: 78, buyers: 86, risk: "见效周期疑问", action: "增加7日/14日使用预期说明" },
  { name: "防晒乳", mentions: 204, growth: "+11%", opportunity: "通勤补涂场景", score: 66, buyers: 61, risk: "闷痘担忧", action: "突出轻薄肤感与补涂场景" },
];

const hotspotMentionRows: HotspotMention[] = [
  { product: "舒缓修护面膜", customer: "林小姐", date: "2026-05-19", time: "10:32", summary: "反复询问面膜是否适合泛红敏感肌，希望先确认试用和售后保障。", intent: "敏感肌试用", category: "consult", sentiment: "负向", ranges: ["today", "7d", "30d"] },
  { product: "舒缓修护面膜", customer: "周女士", date: "2026-05-19", time: "09:46", summary: "看到客服解释成分和试用步骤后，继续追问组合装优惠。", intent: "组合购买", category: "demand", sentiment: "正向", ranges: ["today", "7d", "30d"] },
  { product: "舒缓修护面膜", customer: "Ada", date: "2026-05-18", time: "21:18", summary: "要求查看真实敏感肌评价，对“修护”功效仍有验证需求。", intent: "评价验证", category: "feedback", sentiment: "中性", ranges: ["yesterday", "7d", "30d"] },
  { product: "舒缓修护面膜", customer: "宋女士", date: "2026-05-16", time: "14:05", summary: "担心过敏后退货麻烦，需要客服明确无忧售后边界。", intent: "售后保障", category: "risk", sentiment: "负向", ranges: ["7d", "30d"] },
  { product: "氨基酸洁面", customer: "七七", date: "2026-05-19", time: "11:25", summary: "咨询洁面是否洗后紧绷，关注混油皮早晚使用频次。", intent: "肤质适配", category: "consult", sentiment: "中性", ranges: ["today", "7d", "30d"] },
  { product: "氨基酸洁面", customer: "赵先生", date: "2026-05-18", time: "17:42", summary: "对两支组合价格犹豫，询问是否比单买更划算。", intent: "组合比价", category: "demand", sentiment: "负向", ranges: ["yesterday", "7d", "30d"] },
  { product: "氨基酸洁面", customer: "Mia", date: "2026-05-15", time: "20:16", summary: "关注清洁力和屏障受损后的耐受度，适合转入温和清洁话术。", intent: "温和清洁", category: "consult", sentiment: "中性", ranges: ["7d", "30d"] },
  { product: "屏障精华", customer: "浅巷。", date: "2026-05-19", time: "13:10", summary: "早C晚酸后刺痛泛红，询问是否能用屏障精华修护。", intent: "泛红修护", category: "feedback", sentiment: "负向", ranges: ["today", "7d", "30d"] },
  { product: "屏障精华", customer: "何先生", date: "2026-05-17", time: "16:31", summary: "看完使用周期说明后，询问精华和面膜搭配顺序。", intent: "搭配购买", category: "demand", sentiment: "正向", ranges: ["7d", "30d"] },
  { product: "屏障精华", customer: "小紫", date: "2026-04-27", time: "15:20", summary: "担心见效慢，要求客服说明7日和14日的预期变化。", intent: "见效周期", category: "feedback", sentiment: "中性", ranges: ["30d"] },
  { product: "防晒乳", customer: "陈女士", date: "2026-05-19", time: "12:08", summary: "计划通勤补涂，担心闷痘和妆后搓泥。", intent: "通勤补涂", category: "demand", sentiment: "中性", ranges: ["today", "7d", "30d"] },
  { product: "防晒乳", customer: "王先生", date: "2026-05-18", time: "19:54", summary: "拿竞品防晒价格做比较，需要突出轻薄肤感和售后权益。", intent: "竞品比价", category: "risk", sentiment: "负向", ranges: ["yesterday", "7d", "30d"] },
  { product: "防晒乳", customer: "许小姐", date: "2026-05-14", time: "08:42", summary: "询问是否适合户外短途旅行，希望推荐补涂方案。", intent: "场景推荐", category: "consult", sentiment: "正向", ranges: ["7d", "30d"] },
];

const scenarioSamples = [
  { id: 1, name: "竞品比价", condition: "出现竞品名 + 价格比较 + 犹豫表达", hits: 23, keywords: ["竞品", "便宜", "同款"], createdAt: "2026-05-12 14:20" },
  { id: 2, name: "直播承接", condition: "提到直播间、主播、限时券", hits: 68, keywords: ["直播间", "主播", "限时券"], createdAt: "2026-05-10 19:30" },
  { id: 3, name: "过敏售后", condition: "过敏、泛红、刺痛、退款", hits: 9, keywords: ["过敏", "泛红", "刺痛"], createdAt: "2026-05-08 10:12" },
];

const riskPie = [
  { name: "质量疑虑", value: 36, color: "#ef4444" },
  { name: "价格犹豫", value: 26, color: "#f59e0b" },
  { name: "售后等待", value: 21, color: "#3b82f6" },
  { name: "沉默流失", value: 17, color: "#64748b" },
];

const annotations: Record<ViewKey, Annotation[]> = {
  home: [
    { id: 1, target: "home-overview", title: "首页统计口径", points: ["首页是会话洞察 Agent 的默认工作台，先回答“今天客户关系哪里异常、哪里有机会”。", "同步时间和覆盖客户数是全页统一口径，真实系统应叠加租户、账号权限、会话来源和时间范围过滤。", "首页只展示聚合结论，不直接铺开原始会话，避免主管第一屏被细节淹没。", "当前原型使用静态 mock 数据，重点验证信息层级和模块跳转闭环。"] },
    { id: 2, target: "home-summary", title: "经营结论聚合", place: "br", points: ["三行结论分别对应关系健康、风险预警、机会发现，帮助管理者不读图表也能判断优先级。", "关系健康度建议由正向情绪占比、风险客户占比、响应质量和成交意向共同加权。", "风险预警只应统计未解决或观察中的客户，已关闭风险不能继续占用待办口径。", "机会发现来自产品提及、意图分类和增长率组合，不等同于单个关键词声量。"] },
    { id: 3, target: "home-kpis", title: "核心指标入口", points: ["四张指标卡既是今日结果，也是进入四个模块的任务入口。", "高风险客户用于分配处置产能，产品热点用于发现增长品，场景命中用于验证业务自定义规则。", "趋势百分比建议与上一周期对比：今日比昨日，近7日比上个7日。", "开发实现需要保留 loading、空数据、接口异常状态，避免部分指标失败导致全页不可用。"] },
    { id: 4, target: "home-emotion-distribution", title: "情绪结构预览", points: ["该区域只解释当前客户情绪结构，不替代客户情绪分析页的趋势和表达下钻。", "总消息数应排除系统通知、机器人无效通知和重复消息，避免噪声稀释情绪判断。", "正向、中性、负向比例建议以客户侧消息聚合后按会话去重，而不是简单按消息条数相加。", "“查看更多”承接到情绪分析模块，继续查看表达洞察和每日报表。"] },
    { id: 5, target: "home-risk-list", title: "高风险前置", points: ["首页只展示最高优先级风险客户，让主管可以直接发现需要介入的人。", "风险分建议综合负向情绪、投诉语义、超时未响应、历史投诉和订单价值。", "首页中的处理动作应写入处置记录；原型中仅模拟跳转和状态表达。", "完整筛选、阈值设置和批量处置统一放到高风险客户预警模块。"] },
    { id: 6, target: "home-entry", title: "模块化工作流", points: ["四个快捷入口分别对应看情绪、控风险、找增长、配场景四类任务。", "入口文案强调业务结果，便于非技术评审者理解每个模块的存在价值。", "每个入口都应能进入一个可闭环的二级流程，例如筛选、下钻、标记处理或生成动作。", "移动端入口保持自适应布局，标注点跟随真实目标元素重新计算。"] },
  ],
  emotion: [
    { id: 1, target: "emotion-tabs", title: "情绪分析层级", points: ["客户情绪分析只保留“情绪总览”和“每日报表”，避免与高风险客户预警的待处理队列重复。", "情绪总览负责看整体变化和正负向表达，每日报表负责按天复盘和进入明细。", "高风险处置统一由高风险客户预警承接，情绪模块只提供识别依据。", "真实产品建议把当前 tab、时间范围和日报日期写入 URL，方便分享同一分析视图。"] },
    { id: 2, target: "emotion-time-filter", title: "总览时间筛选", points: ["今日、昨日、近7日、近30日只作用于情绪总览。", "切换后同步影响总览指标、趋势图和正负向表达洞察。", "每日报表有独立日期范围和导出入口，不复用总览筛选，避免层级混乱。", "真实系统需要按企业时区切日，并明确是否包含当前未结束小时。"] },
    { id: 3, target: "emotion-overall", title: "会话情绪统计", points: ["该区域回答当前时间范围内会话数、消息数、正中负情绪结构和风险客户规模。", "正向、中性、负向建议按客户侧消息聚合后再按会话去重，避免客服话术量影响客户情绪判断。", "风险客户口径应来自负向情绪持续、投诉语义、超时未响应等规则的去重客户。", "已处理数量只计算完成安抚、分配或关闭的会话，不能把仅查看算作处理。"] },
    { id: 4, target: "emotion-trend-card", title: "趋势视角切换", points: ["趋势图支持情绪值和消息数两种模式，避免把情绪变化和流量波动混在一起。", "情绪值模式用正向、中性、负向分区表达，气泡大小代表当天消息量。", "消息数模式复用同一时间轴，用柱状高度展示流量峰谷。", "真实系统需要公开情绪值算法，例如正负向消息加权后的标准化区间。"] },
    { id: 5, target: "emotion-hotwords", title: "表达洞察", points: ["这里不是简单热词列表，而是对客户表达方式、情绪原因和业务意图的归纳。", "正向表达和负向表达各有独立 AI 总结，分别解释机会来源和风险来源。", "表达标签可点击，下钻到关联客户和会话摘要，用于验证 AI 归纳是否有真实依据。", "正向表达可沉淀为高转化话术，负向表达可同步给风险预警规则。"] },
    { id: 6, target: "emotion-drilldown", title: "表达下钻", points: ["点击任一表达后，右侧同卡片刷新关联客户、情绪分和摘要。", "下钻结果用于回答“这个表达是谁说的、为什么重要、是否值得处理”。", "会话摘要应支持追溯到原始聊天片段，真实系统需要可进入完整会话。", "正负向表达使用不同状态色，帮助评审者区分机会和风险。"] },
    { id: 7, target: "emotion-daily-reports", title: "每日报表闭环", points: ["每日报表用表格承载日期、分析客户数、消息数、情绪占比和查看详情。", "顶部日期范围筛选和“导出当前报表”是报表自己的工具区，导出按钮在原型中只表达入口。", "点击查看详情进入二级日报页，包含会话数据统计、表达洞察和客户统计报表。", "客户统计区域内支持客户搜索和情感筛选，原型用 mock 数据模拟查询结果。"] },
  ],
  risk: [
    { id: 1, target: "risk-strategy-button", title: "预警策略设置", points: ["预警策略收起为按钮，减少主页面上的配置噪声。", "点击后打开弹窗设置风险分阈值，阈值变化会影响待处理名单命中数量。", "原型用本地状态模拟阈值调整，真实系统应保存修改人、修改时间、生效范围和历史版本。", "策略配置应支持灰度生效，避免阈值突然变化导致一线待办激增。"] },
    { id: 2, target: "risk-trend", title: "预警处理产能", points: ["趋势图同时展示每日预警量和已处理量，用于判断团队是否及时消化风险。", "柱状表示预警会话数，折线表示已处理会话数，两者差距持续扩大时应提示主管增派处理人。", "该图关注产能和风险积压关系，不替代下方逐条处置。", "真实系统需要区分新预警、重复预警、重新打开和已关闭风险。"] },
    { id: 3, target: "risk-semantics", title: "风险语义分布", points: ["语义分布解释近7日风险来自哪些原因，例如售后物流、价格纠纷、服务投诉、产品问题。", "占比用于快速定位主要矛盾，帮助运营决定该优化流程、价格话术还是商品说明。", "真实系统应支持点击语义类型过滤待处理名单，并保留多标签风险。", "分类模型需要支持人工纠错，避免误判长期污染统计。"] },
    { id: 4, target: "risk-table", title: "待处理风险名单", points: ["待处理名单是风险预警的核心工作区，承接情绪分析中移除的待处理会话。", "每条展示风险分、客户、风险类型、AI 摘要、时间和干预动作。", "点击“立即干预”会把客户状态改为跟进中，原型用本地状态模拟处理闭环。", "筛选和排序用于定位高分风险或特定风险类型，真实系统还应支持负责人、SLA 和处理结果记录。"] },
  ],
  hotspot: [
    { id: 1, target: "hotspot-trend", title: "产品趋势线", points: ["趋势图展示近7日四个产品的提及走势，判断热度是否持续而不是只看单日声量。", "顶部图例明确每条线对应的产品：舒缓修护面膜、氨基酸洁面、屏障精华、防晒乳。", "趋势图用于发现产品声量变化，排名和右侧下钻用于验证具体客户和会话来源。", "真实系统需要做商品别名、系列名和功效词归并，避免同一产品被拆成多个主题。"] },
    { id: 2, target: "hotspot-products", title: "场景化产品排名", points: ["产品排名支持今日、昨日、近7日、近30日筛选，运营可以明确查看某个周期的热议产品。", "排名同时支持客户场景筛选：全部场景、强需求、产品咨询、问题反馈、投诉风险。", "时间和场景分类共同影响排名及右侧客户明细，确保榜单和下钻使用同一口径。", "点击产品卡片后刷新右侧客户列表，查看是谁、何时、在什么场景下提到了该产品。"] },
    { id: 3, target: "hotspot-action", title: "客户依据与动作", points: ["右侧下钻只跟随左侧排名的时间和场景筛选，不再单独放时间筛选，避免出现两个口径入口。", "客户明细展示客户名、提及时间、意图标签、场景分类、情绪和摘要。", "先看客户依据，再生成话术和运营任务，避免 AI 动作没有来源支撑。", "真实系统应支持点击客户进入完整会话，并把生成结果同步到客服 SOP、运营任务或直播脚本。"] },
  ],
  custom: [
    { id: 1, target: "custom-create", title: "新建场景弹窗", points: ["新建场景收起为按钮，点击后在弹窗中填写场景名称和命中条件。", "去掉排除条件，降低业务方首次创建场景的理解成本。", "原型只做前端创建入口表达，不写入真实后端。", "真实系统可在高级配置中再补排除词、采样验证、权限范围和命中预估。"] },
    { id: 2, target: "custom-list", title: "已配置场景卡片", points: ["卡片展示场景名称、命中条件、昨日命中客户数、关键词和创建时间。", "转化百分比被移除，避免在没有定义转化事件前制造误导指标。", "点击任一场景会刷新下方洞察数据页，形成从配置到复盘的闭环。", "真实系统应支持启停、编辑、复制和删除场景，并记录修改历史。"] },
    { id: 3, target: "custom-result", title: "场景洞察数据", points: ["详情页展示命中指标、洞察总结、建议动作、近7日命中趋势、关键词贡献和命中客户。", "近7日命中走势用于判断场景是否持续有效，而不是只看昨日单点数据。", "关键词贡献帮助业务方判断命中规则是否过宽或过窄。", "该页仍是纯前端 mock，用于表达业务方评估自定义场景价值的产品闭环。"] },
  ],
};

function App() {
  const [activeView, setActiveView] = useState<ViewKey>("home");
  const [demoMode, setDemoMode] = useState<DemoMode>("prototype");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const currentView = views.find((view) => view.key === activeView)!;

  useEffect(() => {
    setActiveAnnotation(null);
  }, [activeView, showAnnotations, demoMode]);

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <PrototypeBar
        scene={demoMode === "prototype" ? currentView.scene : "整体产品逻辑"}
        mode={demoMode}
        onModeChange={setDemoMode}
        show={showAnnotations}
        onToggle={() => setShowAnnotations((value) => !value)}
      />
      <div className="flex min-h-[calc(100vh-112px)] pt-[112px] md:min-h-[calc(100vh-56px)] md:pt-14">
        {demoMode === "prototype" ? (
          <>
            <SideNav activeView={activeView} onChange={setActiveView} />
            <section className="min-w-0 flex-1 px-4 py-4 md:px-6 lg:px-8">
              <MobileViewTabs activeView={activeView} onChange={setActiveView} />
              <div className="mt-0 md:mt-0">
                {activeView === "home" && <HomeView onChange={setActiveView} />}
                {activeView === "emotion" && <EmotionView />}
                {activeView === "risk" && <RiskView />}
                {activeView === "hotspot" && <HotspotView />}
                {activeView === "custom" && <CustomView />}
              </div>
            </section>
          </>
        ) : (
          <section className="min-w-0 flex-1 px-4 py-4 md:px-8">
            <ProductLogicView onOpenPrototype={(view) => {
              setActiveView(view);
              setDemoMode("prototype");
            }} />
          </section>
        )}
      </div>
      {demoMode === "prototype" && showAnnotations && (
        <AnnotationLayer
          annotations={annotations[activeView]}
          active={activeAnnotation}
          onSelect={setActiveAnnotation}
          onClose={() => setActiveAnnotation(null)}
        />
      )}
    </main>
  );
}

function PrototypeBar({
  scene,
  mode,
  onModeChange,
  show,
  onToggle,
}: {
  scene: string;
  mode: DemoMode;
  onModeChange: (mode: DemoMode) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-white/12 bg-[#0f172a] text-[#f8fafc]">
      <div className="flex h-[112px] flex-col items-stretch justify-center gap-2 px-4 md:h-[56px] md:flex-row md:items-center md:justify-between md:px-6">
        <div className="min-w-0">
          <div className="text-sm font-semibold">会话洞察 Agent 原型</div>
          <div className="truncate text-xs text-slate-300 md:hidden">{scene}</div>
        </div>
        <div className="hidden text-sm text-slate-200 md:block">{scene}</div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white/10 p-1">
            {[
              { key: "prototype" as const, label: "原型预览" },
              { key: "logic" as const, label: "产品逻辑" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onModeChange(item.key)}
                className={cn("rounded-full px-3 py-1.5 text-sm font-medium transition", mode === item.key ? "bg-white text-slate-950" : "text-slate-200 hover:text-white")}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onToggle}
            disabled={mode !== "prototype"}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium transition",
              mode !== "prototype" ? "cursor-not-allowed bg-white/10 text-slate-400" : show ? "bg-[#ef4444] text-white" : "bg-white/16 text-slate-200",
            )}
          >
            <span className={cn("h-2.5 w-2.5 rounded-full bg-white", show && mode === "prototype" ? "opacity-100" : "opacity-50")} />
            显示标注
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductLogicView({ onOpenPrototype }: { onOpenPrototype: (view: ViewKey) => void }) {
  const flowSteps = [
    { title: "数据接入", text: "聊天记录、客户昵称、群聊、订单与售后信号进入会话分析口径。" },
    { title: "会话切片", text: "基于 Topic Window 判断消息归属，形成可结构化的会话片段。" },
    { title: "AI 归因", text: "抽取情绪、风险、产品提及、客户意图和自定义场景命中。" },
    { title: "模块分流", text: "情绪看趋势，风险做处置，热点找增长，场景验证业务规则。" },
    { title: "业务动作", text: "沉淀话术、生成运营任务、进入风险干预或复盘日报。" },
  ];
  const moduleLogic: Array<{ key: ViewKey; title: string; goal: string; consumes: string; output: string }> = [
    { key: "emotion", title: "客户情绪分析", goal: "基于单聊和群聊结构化会话，看清客户关系健康度和情绪变化原因。", consumes: "单聊消费 `emotion`；群聊同时消费 `overall_emotion` 与 `participant_emotions`，并结合 `summary`、`evidence_messages`。", output: "整体情绪趋势、客户级情绪分布、正负向表达洞察、每日明细报表。" },
    { key: "risk", title: "高风险客户预警", goal: "从结构化会话中识别需要人工介入的客户，而不是只看话题整体情绪。", consumes: "单聊消费 `emotion.score`、`risk_signals`；群聊重点消费 `high_risk_participants`、`participant_emotions`、证据消息。", output: "待处理风险客户、AI 风险摘要、干预动作、处理趋势。" },
    { key: "hotspot", title: "产品热点洞察", goal: "用产品提及和客户意图识别近期需求强烈或问题集中的商品。", consumes: "`products`、`intents`、`topic`、`topic_type`、`summary`、提及时间；群聊按 topic 聚合多人提及。", output: "产品趋势、热议产品排名、提及客户下钻、商品话术与运营任务。" },
    { key: "custom", title: "自定义场景洞察", goal: "用结构化会话匹配业务方配置的语义场景，并复盘命中价值。", consumes: "`topic`、`summary`、`intents`、`products`、`risk_signals`、`evidence_messages` 和自定义命中条件。", output: "场景命中趋势、关键词贡献、命中客户/群聊 topic、建议动作。" },
  ];
  const fieldDefinitions = [
    { name: "conversation_type", desc: "区分单聊和群聊，决定后续情绪字段是一份客户情绪还是 topic + participant 双层情绪。" },
    { name: "topic_window_id", desc: "会话切片后的唯一窗口 ID，用于追溯原始消息范围、版本更新和指标回补。" },
    { name: "status", desc: "`provisional` 表示实时临时结果，`final` 表示静默或滚动校正后的最终结果。" },
    { name: "topic / topic_type", desc: "topic 是可读主题，topic_type 是业务分类，例如产品咨询、活动咨询、售后物流、投诉风险。" },
    { name: "emotion / overall_emotion", desc: "单聊使用 emotion；群聊使用 overall_emotion 表达该 topic 的整体氛围。" },
    { name: "participant_emotions", desc: "群聊专用，保留每个客户在同一 topic 下的独立情绪，避免整体均值掩盖个体风险。" },
    { name: "high_risk_participants", desc: "群聊专用，直接输出需要私聊承接或风险预警的客户名单。" },
    { name: "products / intents", desc: "products 用于商品归因，intents 用于判断客户是在咨询、购买、投诉、反馈还是表达需求。" },
    { name: "evidence_messages", desc: "支撑 AI 判断的原始消息证据，所有洞察和风险都应能回到这些消息复核。" },
    { name: "confidence", desc: "结构化结果置信度，低置信度可进入待确认，不应直接驱动强处置动作。" },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-5">
      <Panel className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">会话洞察 Agent 产品逻辑</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">这里用于承载整体产品逻辑、模块关系和数据闭环。评审时可先看逻辑，再切回原型预览验证具体交互。</p>
          </div>
          <button type="button" onClick={() => onOpenPrototype("home")} className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white">返回原型首页</button>
        </div>
      </Panel>

      <Panel className="p-6">
        <SectionTitle title="整体闭环" action="从会话到动作" />
        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="relative rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{index + 1}</div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{step.text}</p>
              {index < flowSteps.length - 1 && <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-slate-300 lg:block" />}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-6">
        <SectionTitle title="聊天记录清洗与会话切片" action="来自手写稿整理" />
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">单聊切片逻辑</h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">一个当前 Topic Window</span>
            </div>
            <div className="mt-5 grid gap-4">
              <LogicFlowRow left="已创建当前 TW" middle="新消息等待 N 秒，形成新消息队列" right="LLM 判断是否同一 Topic" />
              <div className="grid gap-3 md:grid-cols-2">
                <ReasonBox title="判断为同一 Topic" value="把新消息队列放入当前 Topic Window，并更新摘要、实体和最后活跃时间。" tone="green" />
                <ReasonBox title="判断为新 Topic" value="创建新的 Topic Window，原窗口继续保留为可结构化片段。" tone="blue" />
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <strong className="text-slate-900">静默边界：</strong>如果单聊消息间隔超过 30 分钟，可以认为当前 Topic Window 结束，进入最终结构化。
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">群聊切片逻辑</h2>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">多个活跃 Topic Window</span>
            </div>
            <div className="mt-5 grid gap-4">
              <LogicFlowRow left="多个活跃 TW" middle="新消息等待 N 秒，形成新消息队列" right="LLM 判断属于哪个 Topic Window" />
              <div className="grid gap-3 md:grid-cols-2">
                <ReasonBox title="属于已有 Topic" value="放入命中的 Topic Window，支持多人围绕同一商品或活动继续讨论。" tone="green" />
                <ReasonBox title="不属于任何 Topic" value="创建新的 Topic Window，避免群聊里多个话题被时间顺序强行混在一起。" tone="blue" />
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <strong className="text-slate-900">路由信号：</strong>群聊额外参考发送人、@对象、引用回复、客服统一回复和商品/活动实体。
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-semibold">关键字段解释</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">这些字段是后续情绪、风险、热点和自定义场景共同消费的结构化口径，评审时需要先统一字段含义。</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">字段口径</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {fieldDefinitions.map((field) => (
              <FieldDefinition key={field.name} name={field.name} desc={field.desc} />
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-semibold">Topic Window 结束后的结构化输出</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">当 Topic Window 静默结束、滚动结算或被判断为稳定片段后，再交给小模型输出结构化会话。单聊输出客户级片段；群聊输出 topic 级整体结构，同时保留参与客户级情绪。</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">single_chat / group_chat</span>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">单聊结构化会话</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">客户级片段</span>
              </div>
              <pre className="max-h-[520px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
{`{
  "conversation_type": "single_chat",
  "topic_window_id": "tw_single_001",
  "customer_id": "c_001",
  "customer_name": "林小姐",
  "topic": "舒缓修护面膜 / 敏感肌适配咨询",
  "topic_type": "产品咨询",
  "status": "final",
  "summary": "客户咨询舒缓修护面膜是否适合敏感肌，担心泛红、过敏，同时关注试用装和退换保障。",
  "emotion": {
    "label": "负向",
    "score": -0.42,
    "reason": "客户担心使用后泛红和过敏。"
  },
  "products": ["舒缓修护面膜"],
  "intents": ["产品咨询", "风险顾虑", "售后保障确认"],
  "risk_signals": ["怕过敏", "担心退换麻烦"],
  "evidence_messages": [
    "敏感肌可以用吗？",
    "我怕用了又泛红",
    "如果不适合能退吗？"
  ],
  "confidence": 0.86
}`}
              </pre>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">群聊结构化会话</h3>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Topic + 参与客户</span>
              </div>
              <pre className="max-h-[520px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
{`{
  "conversation_type": "group_chat",
  "topic_window_id": "tw_group_618_001",
  "group_id": "g_618_vip",
  "topic": "618活动 / 积分规则",
  "topic_type": "活动咨询",
  "status": "final",
  "summary": "多位客户围绕618满减、积分叠加和赠品规则进行咨询，其中部分客户对规则不清产生不满。",
  "overall_emotion": {
    "label": "偏负向",
    "score": -0.38,
    "reason": "积分叠加和订单转换规则不清，引发多位客户质疑。"
  },
  "participant_emotions": [
    {
      "customer_id": "c_001",
      "customer_name": "小紫",
      "emotion": "中性",
      "score": 0.05,
      "summary": "询问满减门槛和赠品规则。",
      "evidence_messages": ["618满减怎么算？"]
    },
    {
      "customer_id": "c_002",
      "customer_name": "赵先生",
      "emotion": "负向",
      "score": -0.71,
      "summary": "质疑积分无法叠加，担心权益受损。",
      "evidence_messages": ["积分不能叠加那不是亏了吗？"]
    }
  ],
  "high_risk_participants": [
    {
      "customer_id": "c_002",
      "customer_name": "赵先生",
      "reason": "权益损失感强，可能引发投诉或流失。"
    }
  ],
  "products": [],
  "intents": ["活动咨询", "权益质疑"],
  "risk_signals": ["规则不清", "权益损失感"],
  "confidence": 0.82
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-semibold">群聊情绪结构化说明</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">群聊同一个 Topic Window 里可能有多个客户参与，不能只输出一个片段级情绪；需要同时保留 topic 级整体情绪和 participant 级客户情绪。</p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">overall + participants</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <ReasonBox title="Topic 级情绪" value="用于判断该群聊话题的整体氛围，例如活动规则是否引发群体不满。" tone="blue" />
            <ReasonBox title="客户级情绪" value="用于识别同一话题下哪些客户正向、哪些客户负向，避免被整体均值掩盖。" tone="red" />
            <ReasonBox title="高风险客户" value="即使整体情绪只是中性偏负，强负向客户也应进入风险预警或私聊承接。" tone="green" />
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-6">
          <SectionTitle title="模块逻辑图" action="消费结构化会话" />
          <div className="mt-5 grid gap-4">
            {moduleLogic.map((item) => (
              <button key={item.key} type="button" onClick={() => onOpenPrototype(item.key)} className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.goal}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">查看原型</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <ReasonBox title="消费字段" value={item.consumes} tone="blue" />
                  <ReasonBox title="输出结果" value={item.output} tone="green" />
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <SectionTitle title="核心设计原则" action="结构化会话口径" />
          <div className="mt-5 space-y-4">
            <LogicPrinciple title="先切片，再分析" text="所有业务模块都不直接消费原始聊天流，而是消费经过清洗、Topic Window 切片和小模型结构化后的会话片段。" />
            <LogicPrinciple title="单聊和群聊分层建模" text="单聊输出客户级结构；群聊输出 topic 级结构并保留 participant 级情绪，避免多人情绪被平均。" />
            <LogicPrinciple title="结构化字段统一口径" text="情绪、风险、产品热点和自定义场景都围绕同一套结构化字段工作，但不同模块消费的字段视角不同。" />
            <LogicPrinciple title="AI 结论必须可追溯" text="每个 topic、emotion、products、summary 都要保留 evidence_messages，评审和客服可以回到原始消息验证判断。" />
            <LogicPrinciple title="实时与最终结果分层" text="实时监控使用 provisional 会话片段；日报、趋势和复盘使用静默后或滚动校正后的 final 结构化会话。" />
            <LogicPrinciple title="风险按客户处置" text="群聊即使整体情绪偏中性，也要从 participant_emotions 和 high_risk_participants 中识别需要跟进的客户。" />
            <LogicPrinciple title="动作基于结构化会话闭环" text="风险干预、商品话术、场景复盘都应从结构化会话出发，保证动作有主题、情绪、商品和证据支撑。" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function LogicPrinciple({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function FieldDefinition({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <code className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-blue-700">{name}</code>
      <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function LogicFlowRow({ left, middle, right }: { left: string; middle: string; right: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
      <div className="rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-700">{left}</div>
      <div className="hidden h-px w-8 bg-slate-300 md:block" />
      <div className="rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-700">{middle}</div>
      <div className="hidden h-px w-8 bg-slate-300 md:block" />
      <div className="rounded-lg bg-slate-900 p-3 text-sm font-medium text-white">{right}</div>
    </div>
  );
}

function SideNav({ activeView, onChange }: { activeView: ViewKey; onChange: (view: ViewKey) => void }) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[96px] shrink-0 flex-col items-center justify-between bg-white py-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:flex">
      <div className="grid gap-3">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.key}
              type="button"
              onClick={() => onChange(view.key)}
              className={cn(
                "grid h-14 w-14 place-items-center rounded-full text-slate-500 transition",
                activeView === view.key ? "bg-slate-100 text-slate-950 shadow-inner" : "hover:bg-slate-50 hover:text-slate-800",
              )}
              title={view.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
      <button type="button" className="grid h-11 w-11 place-items-center rounded-full text-slate-500 hover:bg-slate-50">
        <Settings className="h-5 w-5" />
      </button>
    </aside>
  );
}

function MobileViewTabs({ activeView, onChange }: { activeView: ViewKey; onChange: (view: ViewKey) => void }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
      {views.map((view) => (
        <button
          key={view.key}
          type="button"
          onClick={() => onChange(view.key)}
          className={cn("shrink-0 rounded-full px-3 py-2 text-xs font-medium shadow-sm", activeView === view.key ? "bg-blue-600 text-white" : "bg-white text-slate-600")}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

function HomeView({ onChange }: { onChange: (view: ViewKey) => void }) {
  return (
    <div className="grid gap-5">
      <Panel id="home-overview" dataAnno className="p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-xl font-semibold">会话洞察Agent</h1>
            <p className="mt-1 text-sm text-slate-500">数据最后同步：2分钟前 · 覆盖 1,280 位核心客户</p>
          </div>
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600">
            今日 <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div id="home-summary" data-anno className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-5 text-sm">
          <p><span className="font-semibold text-emerald-600">关系健康度：</span> 今日整体健康度 82%，敏感肌咨询客户信任度提升明显。</p>
          <p><span className="font-semibold text-rose-500">风险预警：</span> 67 位客户出现高风险信号，集中在物流延迟、价格疑虑、过敏售后。</p>
          <p><span className="font-semibold text-amber-500">发现机会：</span> “敏感肌 + 修护面膜”需求快速增长，可生成商品组合和客服话术。</p>
        </div>
      </Panel>

      <div id="home-kpis" data-anno className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={ShieldAlert} title="高风险预警客户数" value="67" trend="+18.19%" tone="red" onClick={() => onChange("risk")} />
        <KpiCard icon={Radar} title="自定义场景命中客户数" value="23" trend="+18.19%" tone="blue" onClick={() => onChange("custom")} />
        <KpiCard icon={MessageCircle} title="咨询热点" value="“敏感肌”" trend="+73%" tone="amber" onClick={() => onChange("hotspot")} />
        <KpiCard icon={PackageCheck} title="热议产品" value="“面膜”" trend="需求量大幅增长" tone="green" onClick={() => onChange("hotspot")} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel id="home-emotion-distribution" dataAnno className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">客户情绪分布</h2>
            <p className="mt-7 max-w-2xl text-sm leading-6 text-slate-500">最近大量新客在直播承接阶段，对组合套餐价格产生犹豫。主要集中在首单用户、面膜产品、夜间直播场次等。</p>
          </div>
          <div className="grid gap-5">
            <ProgressRow icon={<MessageCircle className="h-5 w-5 text-blue-600" />} label="总消息数" value="3,300" width="100%" color="#5b8def" />
            <ProgressRow icon={<HeartPulse className="h-5 w-5 text-emerald-600" />} label="正向情绪" value="60%" width="60%" color="#5bd4a2" />
            <ProgressRow icon={<Activity className="h-5 w-5 text-amber-500" />} label="中性情绪" value="10%" width="10%" color="#facc15" />
            <ProgressRow icon={<AlertTriangle className="h-5 w-5 text-rose-500" />} label="负向情绪" value="30%" width="30%" color="#ff4d57" />
          </div>
          <button type="button" onClick={() => onChange("emotion")} className="mt-6 text-sm font-medium text-blue-600">查看更多</button>
        </Panel>

        <Panel id="home-risk-list" className="p-6" dataAnno>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">高风险预警名单</h2>
            <div className="flex gap-2">
              <button type="button" className="text-sm font-medium text-blue-600">一键清空</button>
              <button type="button" onClick={() => onChange("risk")} className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">风险阈值设置</button>
            </div>
          </div>
          <div className="space-y-3">
            {initialRisks.slice(0, 3).map((risk) => (
              <div key={risk.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{risk.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{risk.reason}</p>
                    <p className="mt-2 text-xs text-slate-400">标签：{risk.tags.join("、")}</p>
                  </div>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">风险{risk.risk}%</span>
                </div>
                <div className="mt-3 flex justify-end gap-4 text-sm">
                  <button type="button" onClick={() => onChange("risk")} className="font-medium text-blue-600">发起会话</button>
                  <button type="button" onClick={() => onChange("risk")} className="font-medium text-blue-600">已解决</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">快捷入口</h2>
        <div id="home-entry" data-anno className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {views.slice(1).map((view) => (
            <button key={view.key} type="button" onClick={() => onChange(view.key)} className="rounded-lg bg-blue-50 p-7 text-center text-blue-600 transition hover:bg-blue-100">
              <h3 className="font-semibold">{view.label}</h3>
              <p className="mt-4 text-sm">{view.key === "emotion" ? "客户情绪实时分析，智能监控舆情" : view.key === "risk" ? "高风险客户及时发现并预警" : view.key === "hotspot" ? "洞察客户近期热议产品" : "个性化定制洞察场景"}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmotionView() {
  const [range, setRange] = useState<TimeRange>("today");
  const [tab, setTab] = useState<EmotionTab>("overview");
  const [trendMode, setTrendMode] = useState<EmotionTrendMode>("sentiment");
  const [reportDetailOpen, setReportDetailOpen] = useState(false);
  const [selectedHotword, setSelectedHotword] = useState(emotionHotwords[3]);
  const [selectedReport, setSelectedReport] = useState(emotionDailyReports[0]);
  const stats = emotionStats[range];
  const positiveWords = emotionHotwords.filter((item) => item.sentiment === "positive");
  const negativeWords = emotionHotwords.filter((item) => item.sentiment === "negative");

  return (
    <ModuleShell title="客户情绪分析" subtitle="聚焦整体统计、情绪表达洞察和每日报表复盘；高风险处置统一进入预警模块。" icon={HeartPulse}>
      <Panel id="emotion-tabs" dataAnno className="p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {[
              { key: "overview" as const, label: "情绪总览" },
              { key: "reports" as const, label: "每日报表" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setTab(item.key);
                  setReportDetailOpen(false);
                }}
                className={cn("rounded-md px-4 py-2 text-sm font-medium transition", tab === item.key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800")}
              >
                {item.label}
              </button>
            ))}
          </div>
          {tab === "overview" && (
            <div id="emotion-time-filter" data-anno className="flex flex-wrap gap-2">
              {timeRanges.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRange(item.key)}
                  className={cn("rounded-full px-4 py-2 text-sm font-medium transition", range === item.key ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {tab === "overview" && (
        <div className="grid gap-5">
          <Panel id="emotion-overall" dataAnno className="p-5">
            <SectionTitle title="整体会话情绪分析" action={timeRanges.find((item) => item.key === range)?.label ?? "今日"} />
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <EmotionStatCard title="会话数" value={stats.conversations.toLocaleString()} desc="去重客户会话" tone="blue" />
              <EmotionStatCard title="消息数" value={stats.messages.toLocaleString()} desc="排除系统通知" tone="blue" />
              <EmotionStatCard title="正向情绪" value={`${stats.positive}%`} desc="信任、认可、继续咨询" tone="green" />
              <EmotionStatCard title="中性情绪" value={`${stats.neutral}%`} desc="事实询问和信息确认" tone="amber" />
              <EmotionStatCard title="负向情绪" value={`${stats.negative}%`} desc="不满、担心、拒绝" tone="red" />
              <EmotionStatCard title="风险客户" value={String(stats.risk)} desc={`${stats.handled} 位已处理`} tone="red" />
            </div>
            <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
              <div id="emotion-trend-card" data-anno className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">情绪趋势</p>
                    <p className="mt-1 text-xs text-slate-500">可在情绪值与消息数之间切换查看。</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input type="radio" checked={trendMode === "sentiment"} onChange={() => setTrendMode("sentiment")} className="accent-blue-600" />
                      情绪值
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input type="radio" checked={trendMode === "messages"} onChange={() => setTrendMode("messages")} className="accent-blue-600" />
                      消息数
                    </label>
                  </div>
                </div>
                <EmotionTrendChart mode={trendMode} />
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-semibold">AI 总结</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">当前负向情绪主要由“怕过敏”和“太贵”驱动，正向情绪集中在“放心”和“有保障”。建议优先处理敏感肌风险客户，同时沉淀售后保障话术。</p>
              </div>
            </div>
          </Panel>

          <Panel id="emotion-hotwords" dataAnno className="p-5">
            <SectionTitle title="正负向表达洞察" action="AI 已归纳" />
            <div className="mt-4 grid gap-5 xl:grid-cols-[1fr_420px]">
              <div className="grid gap-3 lg:grid-cols-2">
                <ExpressionSummaryCard
                  tone="positive"
                  title="正向表达洞察"
                  summary="客户满意度核心来自专业的护肤搭配指导、清晰的活动规则说明和敏感肌修护方案。建议将“有保障”“适合敏感肌”等表达沉淀为高信任回复模板。"
                  words={positiveWords}
                  selectedWord={selectedHotword.word}
                  onSelect={setSelectedHotword}
                />
                <ExpressionSummaryCard
                  tone="negative"
                  title="负向表达洞察"
                  summary="负向表达集中在过敏担忧、价格疑虑和售后成本，说明用户需要更明确的安全边界和权益解释。建议将“怕过敏”命中客户优先转入高风险预警。"
                  words={negativeWords}
                  selectedWord={selectedHotword.word}
                  onSelect={setSelectedHotword}
                />
              </div>
              <div id="emotion-drilldown" data-anno className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">“{selectedHotword.word}”下钻明细</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedHotword.sentiment === "positive" ? "正向表达，可沉淀为高信任话术" : "负向表达，建议优先排查风险客户"}</p>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", selectedHotword.sentiment === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{selectedHotword.customers.length} 位客户</span>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedHotword.customers.map((customer) => (
                    <button key={customer.name} type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{customer.name}</p>
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", customer.score < 50 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600")}>情绪{customer.score}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{customer.summary}</p>
                      <p className="mt-3 text-xs font-medium text-blue-600">查看会话摘要</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === "reports" && (
        reportDetailOpen ? (
          <DailyReportDetail report={selectedReport} onBack={() => setReportDetailOpen(false)} />
        ) : (
          <div className="grid gap-5">
          <Panel id="emotion-daily-reports" dataAnno className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-semibold">每日报表</h2>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600">
                  <span>2026-04-19</span>
                  <span>~</span>
                  <span>2026-05-18</span>
                </div>
                <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700">
                  <Download className="h-4 w-4" />
                  导出当前报表
                </button>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-4 font-semibold">日期</th>
                    <th className="px-4 py-4 font-semibold">分析客户数</th>
                    <th className="px-4 py-4 font-semibold">分析消息数</th>
                    <th className="px-4 py-4 font-semibold">情绪占比</th>
                    <th className="px-4 py-4 text-right font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {emotionDailyReports.map((report) => (
                    <tr key={report.date} className="border-t border-slate-200">
                      <td className="px-4 py-4 font-medium text-slate-700">{report.date.replace(" 今日", "").replace(" 昨日", "")}</td>
                      <td className="px-4 py-4 text-slate-600">{report.conversations}</td>
                      <td className="px-4 py-4 text-slate-600">{report.messages}</td>
                      <td className="px-4 py-4">
                        <EmotionRatioBar positive={report.positive} neutral={report.neutral} negative={report.negative} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReport(report);
                            setReportDetailOpen(true);
                          }}
                          className="font-medium text-blue-600"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          </div>
        )
      )}

    </ModuleShell>
  );
}

function RiskView() {
  const [threshold, setThreshold] = useState(70);
  const [strategyOpen, setStrategyOpen] = useState(false);
  const [riskTypeFilter, setRiskTypeFilter] = useState("全部风险类型");
  const [sortMode, setSortMode] = useState("high");
  const [risks, setRisks] = useState(initialRisks);
  const visibleRisks = risks
    .filter((risk) => risk.risk >= threshold - 8)
    .filter((risk) => riskTypeFilter === "全部风险类型" || risk.type === riskTypeFilter)
    .sort((a, b) => (sortMode === "high" ? b.risk - a.risk : a.risk - b.risk));
  const totalWarnings = riskTrendData.reduce((sum, item) => sum + item.warnings, 0);
  const totalHandled = riskTrendData.reduce((sum, item) => sum + item.handled, 0);
  const handleRate = Math.round((totalHandled / totalWarnings) * 100);

  function intervene(id: number) {
    setRisks((items) => items.map((item) => (item.id === id ? { ...item, owner: "值班客服小岚", status: "跟进中" } : item)));
  }

  function riskTone(score: number) {
    if (score >= 85) return "text-red-600";
    if (score >= 70) return "text-amber-500";
    return "text-slate-500";
  }

  return (
    <ModuleShell title="高风险客户预警" subtitle="统一承接需要处理的高风险会话，从趋势判断、语义归因到立即干预形成闭环。" icon={ShieldAlert}>
      <div className="grid gap-5">
        <Panel className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">风险工作台</h2>
              <p className="mt-1 text-sm text-slate-500">当前阈值：风险分 ≥ {threshold}，命中 {visibleRisks.length} 位待处理客户</p>
            </div>
            <button id="risk-strategy-button" data-anno type="button" onClick={() => setStrategyOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white">
              <SlidersHorizontal className="h-4 w-4" />
              预警策略设置
            </button>
          </div>
        </Panel>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.8fr]">
          <Panel id="risk-trend" dataAnno className="p-5">
            <SectionTitle title="预警/处理趋势图" action="近7日" />
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskTrendData}>
                    <CartesianGrid stroke="#e5e7eb" vertical={false} strokeDasharray="4 4" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#94a3b8" />
                    <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                    <Tooltip content={<LightTooltip />} />
                    <Area type="monotone" dataKey="warnings" name="预警会话数" stroke="#ff6b6b" fill="#fecaca" strokeWidth={0} />
                    <Area type="monotone" dataKey="handled" name="已处理会话数" stroke="#22c55e" fill="#bbf7d0" strokeWidth={2} />
                    <Line type="monotone" dataKey="handled" name="已处理会话数" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid content-center gap-3">
                <div className="rounded-lg bg-rose-50 p-4">
                  <p className="text-sm text-slate-500">近7日预警会话</p>
                  <p className="mt-1 text-2xl font-bold text-rose-600">{totalWarnings}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-sm text-slate-500">近7日已处理</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">{totalHandled}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-slate-500">处理完成率</p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">{handleRate}%</p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel id="risk-semantics" dataAnno className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">预警语义分布</h2>
              <button type="button" className="inline-flex items-center gap-1 text-sm text-slate-500">今日 <ChevronDown className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-[260px_1fr]">
              <div className="relative h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskSemanticDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={112} paddingAngle={3}>
                      {riskSemanticDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<LightTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <p className="font-semibold text-slate-700">1,982</p>
                    <p className="text-sm text-slate-500">近7日总数量</p>
                  </div>
                </div>
              </div>
              <div className="grid content-center gap-4 sm:grid-cols-2">
                {riskSemanticDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <Circle className="h-3 w-3" style={{ fill: item.color, color: item.color }} />
                    <div>
                      <p className="text-sm text-slate-500">{item.name}</p>
                      <p className="text-lg font-semibold">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        <Panel id="risk-table" dataAnno className="p-5">
          <h2 className="text-lg font-semibold">待处理名单</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <select value={riskTypeFilter} onChange={(event) => setRiskTypeFilter(event.target.value)} className="h-10 min-w-[220px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500 outline-none">
              <option>全部风险类型</option>
              {Array.from(new Set(initialRisks.map((risk) => risk.type))).map((type) => <option key={type}>{type}</option>)}
            </select>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} className="h-10 min-w-[220px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500 outline-none">
              <option value="high">按风险值从高到低排序</option>
              <option value="low">按风险值从低到高排序</option>
            </select>
          </div>
          <div className="mt-4 space-y-4">
            {visibleRisks.map((risk) => (
              <div key={risk.id} className="grid gap-4 rounded-lg bg-slate-50 p-5 lg:grid-cols-[80px_1fr_120px] lg:items-center">
                <div className="text-center lg:text-left">
                  <p className={cn("text-4xl font-bold", riskTone(risk.risk))}>{risk.risk}</p>
                  <span className={cn("mt-2 inline-flex rounded px-2 py-1 text-xs font-medium", risk.risk >= 85 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700")}>{risk.risk >= 85 ? "高风险" : "中等风险"}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{risk.name}</p>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-slate-600">{risk.type}</span>
                    {risk.status === "跟进中" && <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-600">跟进中</span>}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-semibold text-blue-600">AI智能摘要：</span>{risk.reason}</p>
                  <p className="mt-2 text-sm text-slate-400">{risk.time}</p>
                </div>
                <div className="flex gap-2 lg:flex-col">
                  <button type="button" onClick={() => intervene(risk.id)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">立即干预</button>
                  <button type="button" className="rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">查看详情</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {strategyOpen && (
          <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 px-4">
            <div className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">预警策略设置</h2>
                  <p className="mt-1 text-sm text-slate-500">调整进入待处理名单的风险阈值。</p>
                </div>
                <button type="button" onClick={() => setStrategyOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">风险分阈值</span>
                  <span className="text-2xl font-semibold text-blue-600">{threshold}</span>
                </div>
                <input min="55" max="95" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} type="range" className="mt-4 w-full accent-blue-600" />
                <p className="mt-3 text-sm text-slate-500">当前预计命中 {visibleRisks.length} 位客户。阈值越高，名单越精简，但可能漏掉中风险客户。</p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setStrategyOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">取消</button>
                <button type="button" onClick={() => setStrategyOpen(false)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">保存策略</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}

function HotspotView() {
  const [generated, setGenerated] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(hotspotProducts[0]);
  const [range, setRange] = useState<TimeRange>("7d");
  const [category, setCategory] = useState<HotspotCategoryKey>("all");
  const trendLegend = [
    { key: "舒缓修护面膜", label: "舒缓修护面膜", color: "#ef4444" },
    { key: "氨基酸洁面", label: "氨基酸洁面", color: "#2563eb" },
    { key: "屏障精华", label: "屏障精华", color: "#f59e0b" },
    { key: "防晒乳", label: "防晒乳", color: "#64748b" },
  ];
  const currentRange = timeRanges.find((item) => item.key === range)?.label ?? "近7日";
  const currentCategory = hotspotCategories.find((item) => item.key === category) ?? hotspotCategories[0];
  const categoryMatched = (row: HotspotMention) => category === "all" || row.category === category;
  const selectedMentions = hotspotMentionRows.filter((row) => row.product === selectedProduct.name && row.ranges.includes(range) && categoryMatched(row));
  const allRangeMentions = hotspotMentionRows.filter((row) => row.ranges.includes(range) && categoryMatched(row));
  const mentionCountOf = (productName: string) => allRangeMentions.filter((row) => row.product === productName).length;
  const displayMentions = (base: number) => Math.round(base * (range === "today" ? 0.18 : range === "yesterday" ? 0.16 : range === "7d" ? 1 : 4.2));
  const rankedProducts = [...hotspotProducts].sort((a, b) => mentionCountOf(b.name) - mentionCountOf(a.name) || b.score - a.score);

  return (
    <ModuleShell title="产品热点洞察" subtitle="把客户近期热议的产品、诉求和场景转化为可执行的运营动作。" icon={Flame}>
      <Panel id="hotspot-trend" dataAnno className="p-5">
        <SectionTitle title="需求热点趋势" action="近7日" />
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {trendLegend.map((item) => (
            <div key={item.key} className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">趋势线：{item.key}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productTopicTrend}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
              <Tooltip content={<LightTooltip />} />
              {trendLegend.map((item) => (
                <Line key={item.key} dataKey={item.key} stroke={item.color} strokeWidth={2.5} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Panel id="hotspot-products" dataAnno className="p-5">
          <SectionTitle title="热议产品排名" action={`${currentRange} · ${currentCategory.label}`} />
          <div className="mt-4 flex flex-wrap gap-2">
            {timeRanges.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setRange(item.key);
                  setGenerated(false);
                }}
                className={cn("rounded-full px-4 py-2 text-sm font-medium transition", range === item.key ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-5 xl:grid-cols-5">
            {hotspotCategories.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setCategory(item.key);
                  setGenerated(false);
                }}
                className={cn("rounded-lg border p-3 text-left transition", category === item.key ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200")}
              >
                <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                <p className="mt-1 text-xs leading-4 text-slate-500">{item.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            当前按“{currentRange} · {currentCategory.label}”查看：{currentCategory.key === "demand" ? "优先识别购买、加购、组合搭配等强需求产品。" : currentCategory.desc}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {rankedProducts.map((product) => (
              <button key={product.name} type="button" aria-label={`查看${product.name}下钻洞察`} onClick={() => setSelectedProduct(product)} className={cn("rounded-lg border bg-white p-4 text-left transition", selectedProduct.name === product.name ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-200")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{product.opportunity}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">{product.score}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{currentRange}提及 {displayMentions(product.mentions)} 次</span>
                  <span className="font-semibold text-rose-500">{product.growth}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{currentCategory.label}命中客户：{mentionCountOf(product.name)} 位</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel id="hotspot-action" dataAnno className="p-5">
          <SectionTitle title={`${selectedProduct.name} 提及客户`} action={`${currentRange} · ${currentCategory.label}`} />
          <div className="mt-4 rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">洞察结论</p>
            <p className="mt-2 text-sm leading-6 text-amber-900">{selectedProduct.name} 在{currentRange}的“{currentCategory.label}”场景下命中 {selectedMentions.length} 位样本客户，产品提及总量为 {displayMentions(selectedProduct.mentions)} 次，主要机会是“{selectedProduct.opportunity}”。</p>
          </div>
          <div className="mt-4 grid gap-3">
            {selectedMentions.map((mention) => (
              <div key={`${mention.product}-${mention.customer}-${mention.date}`} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{mention.customer}</p>
                    <p className="mt-1 text-xs text-slate-400">{mention.date} {mention.time} · {mention.intent} · {hotspotCategories.find((item) => item.key === mention.category)?.label}</p>
                  </div>
                  <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", mention.sentiment === "正向" ? "bg-emerald-100 text-emerald-700" : mention.sentiment === "负向" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>{mention.sentiment}</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-600">{mention.summary}</p>
                <button type="button" className="mt-3 text-sm font-medium text-blue-600">查看会话摘要</button>
              </div>
            ))}
            {selectedMentions.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">当前时间范围内没有找到该产品的提及客户。</div>
            )}
          </div>
          <button type="button" onClick={() => setGenerated(true)} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-blue-600 font-medium text-white">
            <Sparkles className="h-4 w-4" />
            基于客户明细生成商品话术与运营任务
          </button>
          {generated ? (
            <div className="mt-4 space-y-3">
              <ActionItem title="目标人群" text={`${currentRange}提到敏感、泛红、屏障受损的新客。`} />
              <ActionItem title="客服话术" text="先确认肤质与刺激源，再推荐低刺激试用路径和售后保障。" />
              <ActionItem title="衡量指标" text="敏感肌咨询转化率、负向情绪下降、组合商品点击率。" />
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">生成后会展示可同步给运营和客服的动作卡片。</div>
          )}
        </Panel>
      </div>
    </ModuleShell>
  );
}

function CustomView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [keyword, setKeyword] = useState("竞品名、比你家便宜、同款");
  const [selectedScene, setSelectedScene] = useState(scenarioSamples[0]);
  const sceneTrendData = [
    { day: "D-6", hits: Math.max(4, Math.round(selectedScene.hits * 0.42)) },
    { day: "D-5", hits: Math.max(5, Math.round(selectedScene.hits * 0.58)) },
    { day: "D-4", hits: Math.max(5, Math.round(selectedScene.hits * 0.52)) },
    { day: "D-3", hits: Math.max(7, Math.round(selectedScene.hits * 0.76)) },
    { day: "D-2", hits: Math.max(6, Math.round(selectedScene.hits * 0.68)) },
    { day: "昨日", hits: selectedScene.hits },
    { day: "今日", hits: Math.round(selectedScene.hits * 1.12) },
  ];

  return (
    <ModuleShell title="自定义场景洞察" subtitle="让业务方自行配置要监控的语义场景，并验证命中样本是否有业务价值。" icon={Radar}>
      <div className="grid gap-5">
        <Panel id="custom-create" dataAnno className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">场景管理</h2>
              <p className="mt-1 text-sm text-slate-500">创建业务自定义洞察场景，并查看每个场景的命中数据。</p>
            </div>
            <button type="button" onClick={() => setCreateOpen(true)} className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white">新建场景</button>
          </div>
        </Panel>

          <Panel id="custom-list" dataAnno className="p-5">
            <SectionTitle title="已配置场景" action="3 个启用中" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {scenarioSamples.map((scene) => (
                <button key={scene.id} type="button" onClick={() => setSelectedScene(scene)} className={cn("rounded-lg border bg-white p-4 text-left transition", selectedScene.id === scene.id ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-200")}>
                  <p className="font-semibold">{scene.name}</p>
                  <p className="mt-2 text-sm leading-5 text-slate-500">命中条件：{scene.condition}</p>
                  <p className="mt-3 text-sm font-medium text-blue-600">昨日命中客户数：{scene.hits}</p>
                  <p className="mt-3 text-xs font-medium text-slate-500">关键词</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scene.keywords.map((word) => <span key={word} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{word}</span>)}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">创建时间：{scene.createdAt}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel id="custom-result" dataAnno className="p-5">
            <SectionTitle title={`${selectedScene.name} 洞察数据`} action="场景详情" />
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <ReportMetric label="昨日命中客户" value={String(selectedScene.hits)} />
              <ReportMetric label="近7日命中" value={String(selectedScene.hits * 6 + 12)} tone="blue" />
              <ReportMetric label="高风险占比" value={selectedScene.name === "过敏售后" ? "41%" : "18%"} tone="red" />
              <ReportMetric label="建议跟进" value={selectedScene.name === "直播承接" ? "32" : "9"} tone="green" />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-semibold">洞察总结</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">近7日“{selectedScene.name}”场景命中稳定，关键词主要集中在 {selectedScene.keywords.join("、")}。建议将命中客户同步到对应客服 SOP，优先处理高风险表达。</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="font-semibold text-blue-700">建议动作</p>
                <p className="mt-2 text-sm leading-6 text-blue-900">对命中客户生成专属跟进话术，并在次日复盘命中后的响应率和风险变化。</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold">近7日命中走势</p>
                <div className="mt-4 h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sceneTrendData}>
                      <CartesianGrid stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
                      <Tooltip content={<LightTooltip />} />
                      <Area type="monotone" dataKey="hits" name="命中客户数" stroke="#2563eb" fill="#dbeafe" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold">关键词贡献</p>
                <div className="mt-4 grid gap-3">
                  {selectedScene.keywords.map((word, index) => (
                    <div key={word} className="grid grid-cols-[84px_1fr_44px] items-center gap-3 text-sm">
                      <span className="font-medium text-slate-600">{word}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${68 - index * 14}%` }} />
                      </div>
                      <span className="text-right text-slate-500">{68 - index * 14}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-slate-200">
              <div className="grid grid-cols-[160px_1fr_120px] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                <span>命中客户</span>
                <span>命中摘要</span>
                <span className="text-right">建议动作</span>
              </div>
              {emotionChats.slice(0, 4).map((chat) => (
                <div key={chat.id} className="grid grid-cols-[160px_1fr_120px] border-t border-slate-200 px-4 py-3 text-sm">
                  <span className="font-medium text-slate-700">{chat.name}</span>
                  <span className="text-slate-600">{chat.last}</span>
                  <button type="button" className="text-right font-medium text-blue-600">查看会话</button>
                </div>
              ))}
            </div>
          </Panel>
      </div>
      {createOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 px-4">
          <div className="w-full max-w-[560px] rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">新建场景</h2>
                <p className="mt-1 text-sm text-slate-500">填写场景名称和命中条件，创建后进入监控列表。</p>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <label className="mt-5 block text-sm font-medium text-slate-700">场景名称</label>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500" defaultValue="竞品比价挽留" />
            <label className="mt-4 block text-sm font-medium text-slate-700">命中条件</label>
            <textarea value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mt-2 min-h-[120px] w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">取消</button>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">创建场景</button>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}

function AnnotationLayer({ annotations, active, onSelect, onClose }: { annotations: Annotation[]; active: Annotation | null; onSelect: (annotation: Annotation) => void; onClose: () => void }) {
  const [positions, setPositions] = useState<Array<Annotation & { x: number; y: number; rect: DOMRect }>>([]);
  const [hoveredAnnotation, setHoveredAnnotation] = useState<Annotation | null>(null);

  useEffect(() => {
    const update = () => {
      const next = annotations.flatMap((annotation) => {
        const el = document.querySelector<HTMLElement>(`[data-anno][id="${annotation.target}"]`);
        if (!el) return [];
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0 || rect.bottom < 56 || rect.top > window.innerHeight) return [];
        const place = annotation.place ?? "tr";
        const x = place.includes("r") ? rect.right - 14 : rect.left - 14;
        const y = place.includes("b") ? rect.bottom - 14 : rect.top - 14;
        return [{ ...annotation, x, y, rect }];
      });
      setPositions(next);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const timer = window.setInterval(update, 700);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.clearInterval(timer);
    };
  }, [annotations]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const selected = active ? positions.find((item) => item.id === active.id) : null;
  const hovered = hoveredAnnotation ? positions.find((item) => item.id === hoveredAnnotation.id) : null;

  return (
    <>
      {selected && (
        <div
          className="pointer-events-none fixed z-40 rounded-lg border-2 border-[#ef4444] bg-red-500/10"
          style={{ left: selected.rect.left, top: selected.rect.top, width: selected.rect.width, height: selected.rect.height }}
        />
      )}
      {positions.map((annotation) => (
        <button
          key={`${annotation.target}-${annotation.id}`}
          type="button"
          aria-label={annotation.title}
          onClick={() => onSelect(annotation)}
          onMouseEnter={() => setHoveredAnnotation(annotation)}
          onMouseLeave={() => setHoveredAnnotation(null)}
          onFocus={() => setHoveredAnnotation(annotation)}
          onBlur={() => setHoveredAnnotation(null)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") onSelect(annotation);
          }}
          className={cn(
            "fixed z-50 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#ef4444] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(127,29,29,0.28)]",
            active?.id === annotation.id && "ring-4 ring-red-500/25",
          )}
          style={{ left: annotation.x, top: annotation.y }}
        >
          {annotation.id}
        </button>
      ))}
      {hovered && (
        <div
          className="pointer-events-none fixed z-50 max-w-[220px] rounded-md bg-[#0f172a] px-2.5 py-1.5 text-xs font-medium text-[#f8fafc] shadow-xl"
          style={{ left: Math.min(hovered.x + 34, window.innerWidth - 230), top: Math.max(hovered.y - 2, 60) }}
        >
          {hovered.title}
        </div>
      )}
      {active && <InsightPanel annotation={active} onClose={onClose} />}
    </>
  );
}

function InsightPanel({ annotation, onClose }: { annotation: Annotation; onClose: () => void }) {
  const markdown = annotation.markdown ?? buildAnnotationMarkdown(annotation);

  return (
    <aside className="fixed bottom-0 right-0 z-50 max-h-[70vh] w-full overflow-auto rounded-t-xl border-l border-slate-200 bg-white shadow-[-12px_0_30px_rgba(15,23,42,0.08)] md:top-14 md:h-[calc(100vh-56px)] md:max-h-none md:w-[360px] md:rounded-none">
      <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-slate-300 md:hidden" />
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
        <h3 className="font-semibold">{annotation.id}. {annotation.title}</h3>
        <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>
      <MarkdownBlock markdown={markdown} />
    </aside>
  );
}

function buildAnnotationMarkdown(annotation: Annotation) {
  return annotation.points.map((point) => `- ${emphasizeMarkdownPoint(point)}`).join("\n");
}

function emphasizeMarkdownPoint(point: string) {
  if (point.includes("**")) return point;
  const splitIndex = point.search(/[，。；：]/);
  if (splitIndex <= 0) return point;
  return `**${point.slice(0, splitIndex)}**${point.slice(splitIndex)}`;
}

function MarkdownBlock({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");

  return (
    <div className="space-y-4 p-5 text-sm leading-6 text-slate-700">
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return <div key={`blank-${index}`} className="h-1" />;
        if (line === "---") return <hr key={`hr-${index}`} className="border-slate-200" />;
        if (line.startsWith("### ")) return <h4 key={line} className="pt-1 text-sm font-semibold text-slate-950"><MarkdownInline text={line.slice(4)} /></h4>;
        if (line.startsWith("## ")) return <h3 key={line} className="pt-1 text-base font-semibold text-slate-950"><MarkdownInline text={line.slice(3)} /></h3>;
        if (line.startsWith("# ")) return <h2 key={line} className="text-lg font-semibold text-slate-950"><MarkdownInline text={line.slice(2)} /></h2>;
        if (line.startsWith("> ")) return <blockquote key={line} className="border-l-2 border-slate-300 pl-3 text-slate-500"><MarkdownInline text={line.slice(2)} /></blockquote>;
        if (/^[-*]\s+/.test(line)) return <div key={`${line}-${index}`} className="ml-5 list-item list-disc pl-1"><MarkdownInline text={line.replace(/^[-*]\s+/, "")} /></div>;
        if (/^\d+\.\s+/.test(line)) return <div key={`${line}-${index}`} className="ml-5 list-item list-decimal pl-1"><MarkdownInline text={line.replace(/^\d+\.\s+/, "")} /></div>;
        return <p key={line}><MarkdownInline text={line} /></p>;
      })}
    </div>
  );
}

function MarkdownInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={`${part}-${index}`} className="font-semibold text-slate-950">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={`${part}-${index}`} className="rounded bg-white px-1 py-0.5 text-[12px] text-rose-600">{part.slice(1, -1)}</code>;
        }
        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}

function ModuleShell({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: IconType; children: ReactNode }) {
  return (
    <div className="grid gap-5">
      <Panel className="p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></div>
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>
        </div>
      </Panel>
      {children}
    </div>
  );
}

function Panel({ className, children, id, dataAnno }: { className?: string; children: ReactNode; id?: string; dataAnno?: boolean }) {
  return (
    <section id={id} data-anno={dataAnno ? true : undefined} className={cn("rounded-2xl bg-white shadow-sm", className)}>
      {children}
    </section>
  );
}

function KpiCard({ icon: Icon, title, value, trend, tone, onClick }: { icon: IconType; title: string; value: string; trend: string; tone: "red" | "blue" | "amber" | "green"; onClick: () => void }) {
  const toneClass = tone === "red" ? "text-rose-500" : tone === "amber" ? "text-amber-500" : tone === "green" ? "text-emerald-600" : "text-blue-600";
  return (
    <button type="button" onClick={onClick} className="rounded-2xl bg-white p-7 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6", toneClass)} />
        <p className="font-medium text-slate-700">{title}</p>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className={cn("mt-3 text-sm font-semibold", toneClass)}>{trend}</p>
    </button>
  );
}

function DailyReportDetail({ report, onBack }: { report: (typeof emotionDailyReports)[number]; onBack: () => void }) {
  const [selectedExpression, setSelectedExpression] = useState(emotionHotwords[3]);
  const [customerKeyword, setCustomerKeyword] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedEmotion, setAppliedEmotion] = useState("all");
  const positiveExpressions = emotionHotwords.filter((item) => item.sentiment === "positive");
  const negativeExpressions = emotionHotwords.filter((item) => item.sentiment === "negative");
  const filteredCustomers = dailyCustomerRows.filter((row) => {
    const keywordMatched = !appliedKeyword.trim() || row.name.includes(appliedKeyword.trim()) || row.summary.includes(appliedKeyword.trim());
    const emotionMatched =
      appliedEmotion === "all" ||
      (appliedEmotion === "positive" && row.positive >= row.neutral && row.positive >= row.negative) ||
      (appliedEmotion === "neutral" && row.neutral >= row.positive && row.neutral >= row.negative) ||
      (appliedEmotion === "negative" && row.negative >= row.positive && row.negative >= row.neutral);
    return keywordMatched && emotionMatched;
  });

  return (
    <div className="grid gap-5">
      <Panel className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              返回每日报表
            </button>
            <h2 className="text-xl font-semibold">{report.date} 明细报表</h2>
          </div>
        </div>
      </Panel>

      <Panel className="p-5">
        <SectionTitle title="会话数据统计" action="日报口径" />
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <ReportMetric label="分析客户数" value={report.conversations.toLocaleString()} />
          <ReportMetric label="分析消息数" value={report.messages.toLocaleString()} />
          <ReportMetric label="正向占比" value={`${report.positive}%`} tone="green" />
          <ReportMetric label="中性占比" value={`${report.neutral}%`} tone="amber" />
          <ReportMetric label="负向占比" value={`${report.negative}%`} tone="red" />
        </div>
      </Panel>

      <div className="grid gap-5">
        <Panel className="p-5">
          <SectionTitle title="正负向表达洞察" action="点击表达下钻" />
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ExpressionSummaryCard
              tone="positive"
              title="正向表达洞察"
              summary="客户满意度核心来自专业的护肤搭配指导、清晰的618活动说明和高效解决订单及积分问题，增强了品牌专业度与客户忠诚度。"
              words={positiveExpressions}
              selectedWord={selectedExpression.word}
              onSelect={setSelectedExpression}
            />
            <ExpressionSummaryCard
              tone="negative"
              title="负向表达洞察"
              summary="主要负面问题集中于系统识别、订单转换、活动规则和产品适配，容易影响护肤效果及购物体验，需要优化规则透明度与售后承接。"
              words={negativeExpressions}
              selectedWord={selectedExpression.word}
              onSelect={setSelectedExpression}
            />
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">“{selectedExpression.word}”表达下钻</p>
                <p className="mt-1 text-sm text-slate-500">{selectedExpression.sentiment === "positive" ? "正向表达命中客户" : "负向表达命中客户"}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", selectedExpression.sentiment === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{selectedExpression.customers.length} 位客户</span>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {selectedExpression.customers.map((customer) => (
                <div key={customer.name} className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-800">{customer.name}：</span>{customer.summary}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionTitle title="客户统计报表" action="客户维度" />
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex h-10 min-w-[240px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={customerKeyword}
              onChange={(event) => setCustomerKeyword(event.target.value)}
              placeholder="请输入客户昵称或摘要关键词"
              className="min-w-0 flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <select
            value={emotionFilter}
            onChange={(event) => setEmotionFilter(event.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
          >
            <option value="all">情感：全部</option>
            <option value="positive">情感：正向为主</option>
            <option value="neutral">情感：中性为主</option>
            <option value="negative">情感：负向为主</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setAppliedKeyword(customerKeyword);
              setAppliedEmotion(emotionFilter);
            }}
            className="h-10 rounded-md border border-blue-500 px-4 text-sm font-medium text-blue-600"
          >
            查询
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-4 font-semibold">客户</th>
                <th className="px-4 py-4 font-semibold">会话摘要</th>
                <th className="px-4 py-4 font-semibold">情感分析</th>
                <th className="px-4 py-4 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((row) => (
                <tr key={row.name} className="border-t border-slate-200">
                  <td className="px-4 py-4 font-medium text-slate-700">{row.name}</td>
                  <td className="max-w-[440px] px-4 py-4 text-slate-600">{row.summary}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-600">正 {row.positive}</span>
                      <span className="text-amber-600">中 {row.neutral}</span>
                      <span className="text-rose-600">负 {row.negative}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button type="button" className="font-medium text-blue-600">查看详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && <div className="p-8 text-center text-sm text-slate-500">未找到匹配客户。</div>}
        </div>
      </Panel>
    </div>
  );
}

function EmotionRatioBar({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  return (
    <div className="flex w-40 overflow-hidden rounded-full bg-slate-100">
      <div className="h-2 bg-emerald-400" style={{ width: `${positive}%` }} />
      <div className="h-2 bg-amber-300" style={{ width: `${neutral}%` }} />
      <div className="h-2 bg-rose-500" style={{ width: `${negative}%` }} />
    </div>
  );
}

function EmotionTrendChart({ mode }: { mode: EmotionTrendMode }) {
  const maxMessages = Math.max(...emotionTrend.map((item) => item.messages));

  return (
    <div className="relative h-[300px] overflow-hidden rounded-lg border border-slate-100 bg-white">
      <div className="absolute inset-x-0 top-0 h-1/3 bg-emerald-50/50" />
      <div className="absolute inset-x-0 top-1/3 h-px border-t border-dashed border-slate-200" />
      <div className="absolute inset-x-0 top-1/3 h-1/3 bg-slate-50" />
      <div className="absolute inset-x-0 top-2/3 h-px border-t border-dashed border-slate-200" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-rose-50/45" />
      <div className="absolute left-3 top-[10%] text-xs font-medium text-slate-400">正向</div>
      <div className="absolute left-3 top-[48%] text-xs font-medium text-slate-400">中性</div>
      <div className="absolute left-3 bottom-[8%] text-xs font-medium text-slate-400">负向</div>
      <div className="absolute inset-x-12 top-1/2 h-px bg-slate-200" />
      <div className="absolute inset-x-10 bottom-8 top-8">
        {emotionTrend.map((item, index) => {
          const left = `${(index / (emotionTrend.length - 1)) * 100}%`;
          const y = mode === "sentiment" ? 50 - item.value * 120 : 100 - (item.messages / maxMessages) * 82;
          const size = mode === "sentiment" ? Math.max(8, Math.min(20, item.messages / 9)) : 8;
          const color = mode === "sentiment" ? (item.value > 0.02 ? "#34d399" : item.value > -0.08 ? "#facc15" : "#ef4444") : "#2563eb";
          return (
            <div key={item.time}>
              {mode === "messages" && (
                <div className="absolute bottom-7 w-2 -translate-x-1/2 rounded-t bg-blue-500/35" style={{ left, height: `${(item.messages / maxMessages) * 72}%` }} />
              )}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm"
                title={`${item.time} ${mode === "sentiment" ? `情绪值 ${item.value}` : `消息数 ${item.messages}`}`}
                style={{ left, top: `${y}%`, width: size, height: size, background: color }}
              />
              {index % 2 === 0 && <div className="absolute bottom-0 -translate-x-1/2 text-xs text-slate-400" style={{ left }}>{item.time}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmotionStatCard({ title, value, desc, tone }: { title: string; value: string; desc: string; tone: "red" | "blue" | "amber" | "green" }) {
  return (
    <div className={cn("rounded-lg p-4", tone === "red" && "bg-rose-50", tone === "blue" && "bg-blue-50", tone === "amber" && "bg-amber-50", tone === "green" && "bg-emerald-50")}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={cn("mt-2 text-3xl font-bold", tone === "red" && "text-rose-600", tone === "blue" && "text-blue-600", tone === "amber" && "text-amber-600", tone === "green" && "text-emerald-600")}>{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
    </div>
  );
}

function ReportMetric({ label, value, tone = "blue" }: { label: string; value: string; tone?: "red" | "blue" | "amber" | "green" }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn("mt-1 text-lg font-semibold", tone === "red" && "text-rose-600", tone === "blue" && "text-blue-600", tone === "amber" && "text-amber-600", tone === "green" && "text-emerald-600")}>{value}</p>
    </div>
  );
}

function ExpressionSummaryCard({
  tone,
  title,
  summary,
  words,
  selectedWord,
  onSelect,
}: {
  tone: "positive" | "negative";
  title: string;
  summary: string;
  words: typeof emotionHotwords;
  selectedWord: string;
  onSelect: (word: (typeof emotionHotwords)[number]) => void;
}) {
  const positive = tone === "positive";

  return (
    <div className={cn("rounded-lg border p-4", positive ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/60")}>
      <div className="flex items-center gap-2">
        {positive ? <HeartPulse className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-rose-600" />}
        <h3 className={cn("font-semibold", positive ? "text-emerald-700" : "text-rose-700")}>{title}</h3>
      </div>
      <p className="mt-5 text-sm font-semibold text-violet-600">AI总结</p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {words.map((word) => (
          <button
            key={word.word}
            type="button"
            onClick={() => onSelect(word)}
            className={cn(
              "rounded px-2.5 py-1.5 text-xs font-medium transition",
              selectedWord === word.word
                ? positive
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
                : "bg-white/85 text-slate-600 hover:bg-white",
            )}
          >
            {word.word}
          </button>
        ))}
      </div>
    </div>
  );
}

function HotwordGroup({
  title,
  words,
  selectedWord,
  onSelect,
}: {
  title: string;
  words: typeof emotionHotwords;
  selectedWord: string;
  onSelect: (word: (typeof emotionHotwords)[number]) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-semibold">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {words.map((item) => (
          <button
            key={item.word}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-medium transition",
              selectedWord === item.word
                ? item.sentiment === "positive"
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-rose-300 bg-rose-100 text-rose-700"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
            )}
          >
            {item.word}
            <span className="ml-2 text-xs opacity-70">{item.count} · {item.change}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressRow({ icon, label, value, width, color }: { icon: ReactNode; label: string; value: string; width: string; color: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr_64px] items-center gap-4">
      <div className="flex items-center gap-3 text-sm font-semibold">{icon}<span>{label}</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width, background: color }} /></div>
      <div className="text-right text-sm font-semibold">{value}</div>
    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{action}</span>}
    </div>
  );
}

function ReasonBox({ title, value, tone }: { title: string; value: string; tone: "red" | "blue" | "green" }) {
  return (
    <div className={cn("rounded-lg p-4", tone === "red" && "bg-rose-50", tone === "blue" && "bg-blue-50", tone === "green" && "bg-emerald-50")}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function Playbook({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ActionItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-5 text-slate-600">{text}</p>
    </div>
  );
}

function LightTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-slate-700">{label}</p>
      {payload.map((item: any) => (
        <p key={item.dataKey} style={{ color: item.color || item.fill }}>
          {item.name || item.dataKey}: {item.value}
        </p>
      ))}
    </div>
  );
}

export default App;
