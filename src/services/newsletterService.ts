import type {
  NewsletterPayload,
  NewsletterSuccessResponse,
  NewsletterErrorResponse,
} from "@/types/newsletter";

export async function joinNewsletter(
  payload: NewsletterPayload,
): Promise<NewsletterSuccessResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/newsletter`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as NewsletterErrorResponse;
  }

  return data as NewsletterSuccessResponse;
}
