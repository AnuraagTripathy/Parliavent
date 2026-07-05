import {

  buildSearchQuery,

  type TavilySearchResult,

} from "@/lib/evidence/sourceUtils";



export class TavilyConfigError extends Error {

  constructor() {

    super("Tavily API key not configured");

    this.name = "TavilyConfigError";

  }

}



export class TavilySearchError extends Error {

  constructor(message: string) {

    super(message);

    this.name = "TavilySearchError";

  }

}



interface TavilyApiResponse {

  results?: TavilySearchResult[];

  error?: string;

}



export async function searchWithTavily(params: {

  claim: string;

  argumentText?: string;

  threadId?: string;

}): Promise<TavilySearchResult[]> {

  const apiKey = process.env.TAVILY_API_KEY?.trim();

  if (!apiKey) {

    throw new TavilyConfigError();

  }



  const query = buildSearchQuery(

    params.claim,

    params.argumentText,

    params.threadId,

  );



  let response: Response;

  try {

    response = await fetch("https://api.tavily.com/search", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${apiKey}`,

      },

      body: JSON.stringify({

        query,

        max_results: 5,

        search_depth: "basic",

      }),

    });

  } catch (error) {

    console.error("[searchWithTavily] network error", error);

    throw new TavilySearchError("Tavily request failed");

  }



  if (!response.ok) {

    const body = await response.text().catch(() => "");

    console.error("[searchWithTavily] API error", response.status, body);

    throw new TavilySearchError(`Tavily returned ${response.status}`);

  }



  let data: TavilyApiResponse;

  try {

    data = (await response.json()) as TavilyApiResponse;

  } catch {

    throw new TavilySearchError("Invalid Tavily response");

  }



  if (data.error) {

    throw new TavilySearchError(data.error);

  }



  return Array.isArray(data.results) ? data.results : [];

}


