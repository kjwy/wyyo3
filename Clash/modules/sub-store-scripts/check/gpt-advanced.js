// gpt-advanced.js
// 更精确的 ChatGPT 节点检测脚本

module.exports = async (params) => {
  const url = "https://chat.openai.com/cdn-cgi/trace";
  const timeout = params?.timeout || 2000;

  try {
    const res = await $http.get({
      url,
      timeout,
      node: params?.node, // 让 Sub-Store 在节点下发请求
    });

    if (!res || !res.body) {
      return { status: "不可用", message: "无响应" };
    }

    const text = res.body;

    // 判断常见的被封锁/限制情况
    if (
      text.includes("country=CN") ||
      text.includes("Access denied") ||
      text.includes("Not available")
    ) {
      return { status: "不可用", message: "地区限制" };
    }

    // 如果能正常获取 cf-trace 且没有限制字段
    return { status: "可用", message: "正常" };

  } catch (e) {
    return { status: "不可用", message: "错误: " + e.message };
  }
};