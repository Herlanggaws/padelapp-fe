import axios from "axios";
import type {
  NewsletterPayload,
  NewsletterSuccessResponse,
  NewsletterErrorResponse,
} from "@/types/newsletter";

export async function joinNewsletter(
  payload: NewsletterPayload,
): Promise<NewsletterSuccessResponse> {
  try {
    const { data } = await axios.post<NewsletterSuccessResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/newsletter`,
      payload,
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data as NewsletterErrorResponse;
    }
    throw err;
  }
}
