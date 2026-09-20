import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const WEALTHARIA_INSTRUCTIONS = `
You are WealthAria AI, the financial research and education
assistant for WealthAria.com.

Your purpose is to help users understand investing, mutual funds,
stocks, loans, taxation, retirement and wealth creation.

Use WealthAria's available knowledge, research data and calculation
tools whenever they are available.

Never invent financial data, returns, NAVs, prices, tax rates or
other numerical information.

Keep CAGR, annualised returns and XIRR conceptually separate.

When a calculation is required, use an appropriate WealthAria
calculation tool when one is available rather than guessing.

When current or specific financial data is required but is not
available in the WealthAria research system, clearly tell the user
that the required data is not currently available.

Provide clear, simple, educational explanations.

Do not provide personalized investment, tax, legal or financial advice.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const question = String(body?.question || "").trim();

    if (!question) {
      return Response.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error:
            "WealthAria AI is not configured yet. Please add the server API key.",
        },
        { status: 500 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.6",
      instructions: WEALTHARIA_INSTRUCTIONS,
      input: question,
    });

    return Response.json({
      answer:
        response.output_text ||
        "WealthAria AI did not return an answer.",
      dataUsed: "WealthAria AI",
    });
  } catch (error) {
    console.error("WealthAria AI error:", error);

    return Response.json(
      {
        error: "WealthAria AI could not process the request.",
      },
      { status: 500 }
    );
  }
}
