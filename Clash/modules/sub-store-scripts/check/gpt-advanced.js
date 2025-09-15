// gpt-advanced.js
// Sub-Store 专用 ChatGPT 节点检测脚本（更精确）

module.exports = async (params, context) => {
  const url = "https://chat.openai.com/cdn-cgi/trace";
  const timeout = params?.timeout || 2000;

  try {
    const res = await context.http.get(url, {
      timeout,
      node: params?.node, // 使用 Sub-Store 的节点代理
    });

    if (!res || !res.body) {
      return { status: "failed", message: "无响应" };
    }

    const text = res.body;

    // 判断被限制的情况
    if (
      text.includes("country=CN") ||
      text.includes("Access denied") ||
      text.includes("Not available")
    ) {
      return { status: "failed", message: "地区限制" };
    }

    // 如果能获取 trace 并且没有限制
    return { status: "success", message: "可用" };

  } catch (e) {
    return { status: "failed", message: "错误: " + (e.message || e) };
  }
};