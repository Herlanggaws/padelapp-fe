import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditEventForm from "@/components/EditEventForm";
import * as eventService from "@/services/eventService";
import type { Event } from "@/types/event";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockShowSnackbar = vi.fn();
vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: mockShowSnackbar,
  }),
}));

vi.mock("@/services/eventService", () => ({
  updateEvent: vi.fn(),
}));

const baseEvent: Event = {
  guid: "event-1",
  club_guid: "club-1",
  name: "Championship Round",
  description: "Description",
  date_time: "2026-11-01T10:00:00Z",
  number_of_players: 8,
  number_of_participants: 4,
  min_level: 2.0,
  max_level: 4.0,
  sport: "padel",
  is_active: true,
  is_finished: false,
  is_joined: false,
  is_host: true,
  is_locked: false,
  session_guid: "",
  join_status: "",
  pending_requests: null,
  created_at: "2026-01-01T00:00:00Z",
  created_by: "user-1",
  updated_at: "2026-01-01T00:00:00Z",
  updated_by: null,
};

describe("EditEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T19-AC2: enables sport selector when event has no matchmaking session and is not locked", async () => {
    const user = userEvent.setup();
    const event: Event = { ...baseEvent, session_guid: "", is_locked: false, sport: "padel" };

    vi.mocked(eventService.updateEvent).mockResolvedValue({
      data: null,
      message: "Event updated successfully",
    });

    render(<EditEventForm event={event} />);

    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });

    expect(padelOption).not.toBeDisabled();
    expect(tennisOption).not.toBeDisabled();
    expect(padelOption).toHaveAttribute("aria-checked", "true");

    // Hint should NOT be shown
    expect(screen.queryByText("Sport is locked after matchmaking starts")).not.toBeInTheDocument();

    // Select Tennis
    await user.click(tennisOption);
    expect(tennisOption).toHaveAttribute("aria-checked", "true");

    const submitBtn = screen.getByRole("button", { name: /Save/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(eventService.updateEvent).toHaveBeenCalledWith(
        "event-1",
        expect.objectContaining({
          sport: "tennis",
        }),
      );
    });
  });

  it("T19-AC2: disables sport selector and shows hint when event has session_guid", () => {
    const event: Event = {
      ...baseEvent,
      session_guid: "session-abc",
      is_locked: false,
      sport: "padel",
    };

    render(<EditEventForm event={event} />);

    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });

    expect(padelOption).toBeDisabled();
    expect(tennisOption).toBeDisabled();
    expect(screen.getByText("Sport is locked after matchmaking starts")).toBeInTheDocument();
  });

  it("T19-AC2: disables sport selector and shows hint when event is locked", () => {
    const event: Event = {
      ...baseEvent,
      session_guid: "",
      is_locked: true,
      sport: "tennis",
    };

    render(<EditEventForm event={event} />);

    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });

    expect(padelOption).toBeDisabled();
    expect(tennisOption).toBeDisabled();
    expect(tennisOption).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Sport is locked after matchmaking starts")).toBeInTheDocument();
  });
});
